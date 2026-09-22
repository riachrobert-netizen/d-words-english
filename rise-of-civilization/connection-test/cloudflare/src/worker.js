import { DurableObject } from 'cloudflare:workers';

const VERSION = 'roc-connection-probe-v1';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return Response.json({ ok: true, service: VERSION }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (url.pathname !== '/ws' || request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('Rise of Civilization connection test. Open https://riachrobert-netizen.github.io/d-words-english/rise-of-civilization/connection-test/', { status: url.pathname === '/' ? 200 : 404 });
    }
    const origin = request.headers.get('Origin');
    const allowed = origin === 'https://riachrobert-netizen.github.io' || origin === url.origin || (
      ['localhost', '127.0.0.1'].includes(url.hostname) && /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/.test(origin || '')
    );
    if (!allowed) return new Response('Website origin not allowed', { status: 403 });
    return env.ROOMS.getByName('test-lobby').fetch(request);
  }
};

export class Rooms extends DurableObject {
  constructor(ctx, env) { super(ctx, env); this.ctx = ctx; }

  sockets() { return this.ctx.getWebSockets().filter(ws => ws.readyState === 1); }
  peers(code) { return this.sockets().filter(ws => ws.deserializeAttachment()?.room === code); }
  send(ws, message) {
    if (ws.readyState !== 1) return;
    if (ws.bufferedAmount > 1048576) { ws.close(1013, 'Connection too slow'); return; }
    ws.send(JSON.stringify(message));
  }
  error(ws, message) { this.send(ws, { type: 'error', message }); }
  update(code) {
    if (!code) return;
    const group = this.peers(code);
    for (const ws of group) this.send(ws, { type: 'room', code, players: group.length });
  }
  leave(ws) {
    const state = ws.deserializeAttachment() || {};
    if (state.room) {
      ws.serializeAttachment({ ...state, room: null });
      this.update(state.room);
    }
  }
  async fetch() {
    if (this.sockets().length >= 200) return new Response('Server is busy', { status: 503 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ room: null, bucket: Date.now(), count: 0 });
    this.send(server, { type: 'hello', service: VERSION });
    return new Response(null, { status: 101, webSocket: client });
  }
  async webSocketMessage(ws, data) {
    const now = Date.now();
    const state = ws.deserializeAttachment() || { room: null, bucket: now, count: 0 };
    if (now - state.bucket > 1000) { state.bucket = now; state.count = 0; }
    if (++state.count > 30) { ws.close(1008, 'Too many messages'); return; }
    ws.serializeAttachment(state);
    if (typeof data !== 'string' || data.length > 262144) { this.error(ws, 'Invalid message.'); return; }
    let m; try { m = JSON.parse(data); } catch { this.error(ws, 'Invalid message.'); return; }
    if (!m || typeof m !== 'object') { this.error(ws, 'Invalid message.'); return; }
    if (m.type === 'ping') { this.send(ws, { type: 'pong', id: m.id }); return; }
    if (m.type === 'leave') { this.leave(ws); this.send(ws, { type: 'left' }); return; }
    if (m.type === 'create') {
      const used = new Set(this.sockets().map(s => s.deserializeAttachment()?.room).filter(Boolean));
      if (used.size >= 100) { this.error(ws, 'Server is busy. Try again later.'); return; }
      let code;
      do { const bytes = crypto.getRandomValues(new Uint8Array(6)); code = Array.from(bytes, n => ALPHABET[n % 32]).join(''); } while (used.has(code));
      this.leave(ws); ws.serializeAttachment({ ...state, room: code, role: 'host' }); this.send(ws, { type: 'game-role', role: 'host' }); this.update(code); return;
    }
    if (m.type === 'join') {
      const code = typeof m.code === 'string' ? m.code.trim().toUpperCase() : '';
      const group = this.peers(code);
      if (!/^[A-Z2-9]{6}$/.test(code) || group.length === 0) { this.error(ws, 'Room not found. Check the code or ask your friend to create a new room.'); return; }
      if (state.room === code) { this.update(code); return; }
      if (group.length >= 2) { this.error(ws, 'That room already has two players.'); return; }
      this.leave(ws); ws.serializeAttachment({ ...state, room: code, role: 'guest' }); this.send(ws, { type: 'game-role', role: 'guest' }); this.update(code); return;
    }
    if (m.type === 'game-state' || m.type === 'game-command') {
      const group = state.room ? this.peers(state.room) : [];
      if (group.length !== 2 || state.role !== (m.type === 'game-state' ? 'host' : 'guest')) return;
      if (m.type === 'game-command' && (typeof m.action !== 'string' || !['order','place','age','villager','spearman','archer','swordsman','repair','stance'].includes(m.action))) return;
      if (m.type === 'game-state' && (!m.world || typeof m.world !== 'object')) return;
      for (const peer of group) if (peer !== ws) this.send(peer, m);
      return;
    }
    if (['probe', 'ack', 'signal'].includes(m.type)) {
      const group = state.room ? this.peers(state.room) : [];
      if (group.length !== 2) { this.error(ws, 'Both players must be in the room.'); return; }
      if (m.type !== 'signal' && (!Number.isSafeInteger(m.id) || m.id < 0)) { this.error(ws, 'Invalid probe.'); return; }
      for (const peer of group) if (peer !== ws) this.send(peer, m.type === 'signal' ? { type: 'signal' } : { type: m.type, id: m.id });
      return;
    }
    this.error(ws, 'Unknown message.');
  }
  async webSocketClose(ws) { this.leave(ws); }
  async webSocketError(ws) { this.leave(ws); }
}
