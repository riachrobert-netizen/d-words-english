# Rise of Civilization — Solo Skirmish

A self-contained browser RTS. Open `index.html` locally or visit this folder through GitHub Pages. No installation, Node.js, API keys, accounts or server are required to play.

## Start a match

Choose Civilization A (Mediterranean, west bank) or B (Eastern, east bank). The computer commands the other civilization. Choose Easy, Standard or Hard, and either Civilization-or-conquest victory or conquest only.

The computer gathers and delivers resources, develops through three ages, builds its settlement, trains soldiers and archers, defends against intruders, crosses bridges, attacks and replaces losses while resources permit. It starts with the same resources and pays the same costs as the player. Difficulty changes decision frequency, settlement size, army size and attack timing; it does not grant resource bonuses.

## Controls

- Click your villager, then a resource to gather it.
- Click a friendly Storehouse or Town Center to unload a carried basket.
- Open Build, choose a building, then tap a valid footprint to construct. Cancel or Escape exits placement.
- Open Train to recruit people and soldiers. More contains age advancement, stances and settings.
- Click your soldier, then an enemy unit or building to attack.
- Archers automatically shoot nearby enemies. Hold Position prevents pursuit.
- Build a bridge spanning the river. Units route via intact, completed bridges.
- After a valid gathering, unloading, movement or attack order, the person is automatically deselected. Their task continues until you select them again and give a new order.
- Pinch to zoom and drag to pan on phones. Gestures never issue orders or place buildings.
- Scroll to zoom; Shift + drag pans with a mouse. H or Home returns to your settlement.
- Full screen expands the game where supported. Otherwise an expanded layout is used; iPhone users can also open the page as a Home Screen web app.
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

Supports touch and mouse, with a compact phone layout in portrait or landscape. No match saving: closing or reloading resets progress. The simulation stops while the page is hidden. This is a rule-based opponent with full map knowledge, not a machine-learning model. Resources are finite except farm food. No multiplayer in this edition.

## Verification

Automated simulation coverage includes both playable civilizations at all three difficulties over 15 simulated minutes each; Bronze Age development, mixed armies and raids; player control isolation; bridge routing/destruction; partial-load delivery; pause/restart; AI conquest and Civilization victories; and rebuilding a destroyed Archery Range. Native Canvas rendering was checked before and after AI development.

This game lives only in `rise-of-civilization/`; the repository's vocabulary application is unchanged.

Mobile patch verification: Chromium touch-event tests cover pinch/drag, task deselection, delivery, attacks, placement/cancellation, fullscreen and desktop input. Phone layouts were checked at 375×667, 430×932 and 932×430. Physical iPhone/Safari testing is still needed.
