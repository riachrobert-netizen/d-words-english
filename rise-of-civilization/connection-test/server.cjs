'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {WebSocketServer,WebSocket}=require('ws');
const VERSION='roc-connection-probe-v1';

function createProbeServer(options={}){
  const rooms=new Map();
  const page=fs.readFileSync(path.join(__dirname,'index.html'));
  const allowed=new Set((process.env.ALLOWED_ORIGINS||'https://riachrobert-netizen.github.io').split(',').map(s=>s.trim()));
  if(process.env.RENDER_EXTERNAL_URL)allowed.add(new URL(process.env.RENDER_EXTERNAL_URL).origin);
  const server=http.createServer((req,res)=>{
    const pathname=req.url.split('?')[0];
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Cache-Control','no-store');
    if(pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,service:VERSION}));return}
    if(pathname==='/'||pathname==='/index.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(page);return}
    res.writeHead(404);res.end('Not found');
  });
  const wss=new WebSocketServer({noServer:true,maxPayload:4096,perMessageDeflate:false});
  const send=(ws,data)=>{if(ws.readyState===WebSocket.OPEN){if(ws.bufferedAmount>65536){ws.close(1013,'Connection too slow');return}ws.send(JSON.stringify(data))}};
  const fail=(ws,message)=>send(ws,{type:'error',message});
  function roomUpdate(code){const room=rooms.get(code);if(room)for(const ws of room)send(ws,{type:'room',code,players:room.size})}
  function leave(ws){const code=ws.room;if(!code)return;ws.room=null;const room=rooms.get(code);if(!room)return;room.delete(ws);if(room.size===0)rooms.delete(code);else roomUpdate(code)}
  server.on('upgrade',(req,socket,head)=>{
    let origin;try{origin=new URL(req.headers.origin)}catch{}
    const local=process.env.NODE_ENV!=='production'&&origin&&['localhost','127.0.0.1'].includes(origin.hostname);
    if(req.url!=='/ws'||!origin||(!allowed.has(origin.origin)&&!local)||wss.clients.size>=200){socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');return}
    wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req));
  });
  wss.on('connection',ws=>{
    ws.room=null;ws.alive=true;ws.lastActivity=Date.now();ws.bucket=Date.now();ws.count=0;
    send(ws,{type:'hello',service:VERSION});
    ws.on('pong',()=>ws.alive=true);
    ws.on('error',()=>{});
    ws.on('close',()=>leave(ws));
    ws.on('message',(raw,binary)=>{
      if(Date.now()-ws.bucket>1000){ws.bucket=Date.now();ws.count=0}
      if(++ws.count>30){ws.close(1008,'Too many messages');return}
      let m;try{if(binary)throw Error();m=JSON.parse(raw.toString())}catch{fail(ws,'Invalid message.');return}
      if(!m||typeof m!=='object'){fail(ws,'Invalid message.');return}
      ws.lastActivity=Date.now();
      if(m.type==='ping'){send(ws,{type:'pong',id:m.id});return}
      if(m.type==='leave'){leave(ws);send(ws,{type:'left'});return}
      if(m.type==='create'){
        if(rooms.size>=100){fail(ws,'Server is busy. Try again later.');return}
        leave(ws);let code;
        do{code=Array.from(crypto.randomBytes(6),n=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[n%32]).join('')}while(rooms.has(code));
        rooms.set(code,new Set([ws]));ws.room=code;roomUpdate(code);return;
      }
      if(m.type==='join'){
        const code=typeof m.code==='string'?m.code.trim().toUpperCase():'';
        const room=rooms.get(code);
        if(!room){fail(ws,'Room not found. Check the code or ask your friend to create a new room.');return}
        if(ws.room===code){roomUpdate(code);return}
        if(room.size>=2){fail(ws,'That room already has two players.');return}
        leave(ws);room.add(ws);ws.room=code;roomUpdate(code);return;
      }
      if(['probe','ack','signal'].includes(m.type)){
        const room=rooms.get(ws.room);if(!room||room.size!==2){fail(ws,'Both players must be in the room.');return}
        if(m.type!=='signal'&&(!Number.isSafeInteger(m.id)||m.id<0)){fail(ws,'Invalid probe.');return}
        for(const peer of room)if(peer!==ws)send(peer,m.type==='signal'?{type:'signal'}:{type:m.type,id:m.id});
        return;
      }
      fail(ws,'Unknown message.');
    });
  });
  const heartbeat=setInterval(()=>{
    for(const ws of wss.clients){
      if(!ws.alive||Date.now()-ws.lastActivity>(options.idleMs||10*60*1000)){ws.terminate();continue}
      ws.alive=false;ws.ping();
    }
  },options.heartbeatMs||30000);
  heartbeat.unref();server.on('close',()=>clearInterval(heartbeat));
  return{server,wss,rooms,async close(){clearInterval(heartbeat);for(const ws of wss.clients)ws.terminate();await new Promise(r=>wss.close(r));await new Promise(r=>server.close(r))}};
}
if(require.main===module){
  const app=createProbeServer();const port=Number(process.env.PORT)||3000;
  app.server.listen(port,'0.0.0.0',()=>console.log('Connection test listening on port '+port));
  process.on('SIGTERM',()=>app.close().then(()=>process.exit(0)));
}
module.exports={createProbeServer,VERSION};
