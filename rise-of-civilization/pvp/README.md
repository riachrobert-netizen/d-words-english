# Rise of Civilization · two-player PvP

The PvP page is a separate copy of the solo game. Its match runs in the room creator's browser (Civilization A); the joining browser controls Civilization B. The Cloudflare Worker relays guest orders and host snapshots. Both sides can gather, build, train, advance, fight and win using the existing game rules.

## Play

1. Deploy the updated Worker in `../connection-test/cloudflare/` through the existing Cloudflare GitHub build. The previous connection-test protocol still works.
2. Open `https://riachrobert-netizen.github.io/d-words-english/rise-of-civilization/pvp/` on the first device. Paste the Worker base URL, connect and create a room.
3. Copy the invite link and open it on the second device. Connect and join using the filled room code. Keep both pages visible.

The original solo game remains at `../index.html`. Matches are temporary: if either player disconnects, the game pauses, and joining again starts a new match. The host must keep the tab open; hosting does not continue on the server. As with the connection test, actual reachability and latency depend on each player's network. This is an initial live PvP build and does not yet include persistent matches, lag compensation or cheat-resistant server simulation.
