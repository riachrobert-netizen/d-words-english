# Rise of Civilization: online connection test

A standalone two-player test for an internet PvP relay. It measures server round-trip time and player-to-player round-trip time through the server. It does not yet synchronize the game. Either Cloudflare or Render can host the relay.

## No-card route: Cloudflare Workers Free

Cloudflare offers Durable Objects on Workers Free without a credit card. The [Cloudflare deployment guide](cloudflare/README.md) explains how to connect this repository, set the root directory to `rise-of-civilization/connection-test/cloudflare`, and publish a `workers.dev` address. Paste that HTTPS address into the [connection test page](https://riachrobert-netizen.github.io/d-words-english/rise-of-civilization/connection-test/). This is now the recommended route if Render asks you for card details.

## Optional: Render free server

[Deploy to Render](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2Friachrobert-netizen%2Fd-words-english)

1. Sign in to Render and follow the deployment link.
2. Review the `rise-civ-connection-test` web service: Node runtime, Singapore region, **Free** plan. No database or paid service is defined.
3. Deploy and wait until the service is live. Copy its HTTPS `onrender.com` address.
4. Open the [connection test on GitHub Pages](https://riachrobert-netizen.github.io/d-words-english/rise-of-civilization/connection-test/). Paste the address and press Connect. You can also open the Render address itself.
5. Create a room. Copy the invite link to your second device or friend. On that device, open the link and press Connect; it joins the room automatically.
6. Use different networks, keep both tabs visible, and allow the 30-second test to finish. Copy results from both devices.

The two-way player figure includes browser → server → other browser → server → first browser. It is not one-way latency. Missing probes are replies that did not arrive within two seconds; WebSockets retransmit packets, so this is not a direct packet-loss measurement. The on-screen assessment is a rough guide, not a full-game benchmark.

Free Render services sleep after 15 minutes without inbound traffic and can take around a minute to wake. Free services may restart. The page retries its initial connection for up to 100 seconds. Rooms are in memory and disappear on server restart. Reconnect and create a new room if necessary. No automatic paid upgrade is configured; Render's account-wide bandwidth/build rules still apply.

## Manual deployment if the shortcut is unavailable

Create a Render **Web Service** using the public repository URL `https://github.com/riachrobert-netizen/d-words-english`:

- Branch: `main`
- Root directory: `rise-of-civilization/connection-test`
- Runtime: Node; region: Singapore; instance: Free
- Build command: `npm ci --omit=dev`
- Start command: `npm start`
- Health check: `/health`
- Environment: `NODE_ENV=production`, `ALLOWED_ORIGINS=https://riachrobert-netizen.github.io`

Render supplies the listening port and external service URL. The server accepts the GitHub Pages origin and its own Render origin. Auto-deploy is off in the Blueprint; use Manual Deploy for later server updates.

## Local development

Node.js 22–24:

```sh
cd rise-of-civilization/connection-test
npm ci
npm test
npm start
```

Open `http://localhost:3000` in two browser windows. The server field fills itself. `PORT` overrides 3000. No credentials are needed. The server caps rooms at two clients, limits payloads and message rates, rejects unexpected website origins, cleans up closed sockets and expires connections after ten minutes without application traffic. Room codes are temporary access codes, not user authentication.

The root `render.yaml` describes only this service. The existing solo game is independent.
