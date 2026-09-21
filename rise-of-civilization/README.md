# Rise of Civilization — Solo Skirmish

A self-contained browser RTS. Open `index.html` locally or visit this folder through GitHub Pages. No installation, Node.js, API keys, accounts or server are required to play.

## Start a match

Choose Civilization A (Mediterranean, west bank) or B (Eastern, east bank). The computer commands the other civilization. Choose Easy, Standard or Hard, and either Civilization-or-conquest victory or conquest only.

The computer gathers and delivers resources, develops through three ages, builds its settlement, trains soldiers and archers, defends against intruders, crosses bridges, attacks and replaces losses while resources permit. It starts with the same resources and pays the same costs as the player. Difficulty changes decision frequency, settlement size, army size and attack timing; it does not grant resource bonuses.

## Controls

- Click your villager, then a resource to gather it.
- Click a friendly Storehouse or Town Center to unload a carried basket.
- Click a building action, then a valid footprint to construct. Escape cancels.
- Click your soldier, then an enemy unit or building to attack.
- Archers automatically shoot nearby enemies. Hold Position prevents pursuit.
- Build a bridge spanning the river. Units route via intact, completed bridges.
- Scroll to zoom; Shift + drag pans. H or Home view returns to your settlement.
- Space or Pause freezes the match. Help and visual galleries also pause.
- New match opens the civilization/difficulty menu; return keeps the current match paused.

## Victory

Conquest requires destroying the rival Town Center and all surviving rival units.
When Civilization victory is enabled, all six features must be achieved:

- Bronze Age, population of at least 8, and 2 houses for cities.
- Government Hall for government.
- Temple for religion.
- Population of at least 7, 2 farms and a Barracks for social structure.
- Scribal School for writing.
- Monument for art.

Large wealth or population totals alone do not end the game.

## Limits

Designed primarily for mouse/desktop play. No match saving: closing or reloading resets progress. The simulation stops while the page is hidden. This is a rule-based opponent with full map knowledge, not a machine-learning model. Resources are finite except farm food. No multiplayer in this edition.

## Verification

Automated simulation coverage includes both playable civilizations at all three difficulties over 15 simulated minutes each; Bronze Age development, mixed armies and raids; player control isolation; bridge routing/destruction; partial-load delivery; pause/restart; AI conquest and Civilization victories; and rebuilding a destroyed Archery Range. Native Canvas rendering was checked before and after AI development.

This game lives only in `rise-of-civilization/`; the repository's vocabulary application is unchanged.
