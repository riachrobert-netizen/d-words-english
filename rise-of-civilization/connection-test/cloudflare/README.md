# No-card connection test on Cloudflare

Cloudflare Durable Objects run on the Workers Free plan without a credit card. This version of the connection test uses the same two-player room and measurement protocol as the Render version; the solo game continues on GitHub Pages. This deploys **only the connection test**, not full PvP.

## Deploy from your browser

1. Create a free [Cloudflare account](https://dash.cloudflare.com/sign-up) and open **Workers & Pages** → **Create application** → **Import a repository**. Connect GitHub if prompted and select `riachrobert-netizen/d-words-english`.
2. Set the **root directory** to `rise-of-civilization/connection-test/cloudflare` and the **deploy command** to `npm run deploy`. If Cloudflare asks for a build command, use `npm ci`.
3. Keep the default `wrangler.jsonc`. It declares a **SQLite Durable Object** (`new_sqlite_classes`), which the Workers Free plan supports. Deploy to the provided `workers.dev` subdomain.
4. Open your `https://rise-civ-connection-test.YOUR-SUBDOMAIN.workers.dev/health`. It should say `"ok":true` and `roc-connection-probe-v1`.
5. Open the [connection test](https://riachrobert-netizen.github.io/d-words-english/rise-of-civilization/connection-test/), paste the same `https://…workers.dev` base address, then press **Connect**. Create a room and share its invite link with a second device on another network.

If the GitHub import UI does not let you set the root directory and deploy command, use the local command below instead; it uploads the exact same Worker. Do not deploy the repository root, because its `render.yaml` belongs to Render and its top-level HTML files are a separate site.

## Deploy with the CLI

From a local checkout of this GitHub repository, with Node.js installed:

```sh
cd rise-of-civilization/connection-test/cloudflare
npm ci
npx wrangler login
npm run deploy
```

Copy the `workers.dev` address that Wrangler prints. Local development: `npm run dev`, then paste the displayed localhost URL into the connection test. To validate the upload without deploying, run `npm run check`.

The Worker uses a single hibernating Durable Object for temporary rooms. Its WebSocket state is reconstructed from socket attachments after hibernation; no account or match data is stored. Rooms end when both players disconnect. The worker restricts browser origins to the published GitHub Pages test and its own origin. Free daily usage limits apply. A `workers.dev` address might not be reachable on every network; test from both devices before building full PvP.
