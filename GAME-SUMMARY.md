# PJ's Game: how the game works now

Nature vs. Robots tower defense, designed by PJ. Play it at **https://pjs-game.vercel.app** on a computer, Chromebook or iPad.
Every number lives in `settings.js`. Words are defined in `GLOSSARY.md`; ideas for later are in `LATER.md`.

## Starting a game
- Pick a Save Slot (3), then a Level, a Difficulty (Easy, Normal, Hard, Nightmare) and whether to turn on the Tutorial (first 5 Waves).
- Play alone, **host a challenge** (get a code, friends join a lobby, the host presses Start, everyone counts down together), or **join a friend's challenge**.
- Add a nickname to get on the Leaderboards. Controls: Start Wave, Pause, 1×/2×/3× speed, sound on/off.

## Levels (15 Waves each, Bosses on Waves 5, 10, 15)
| Level | Look | Special |
|---|---|---|
| The Meadow | green meadow, dirt path, grand blossom tree | Robots have a 1% chance to drop a Golden Acorn |
| The Forest | straighter path, more trees | Tree Giants attack 50% faster |
| The Swamp | murky water path with lily pads, swamp treehouse on stilts | Robots have 1.5× health; Water Frogs (brown here) hit 25% harder |

Each level unlocks after you beat the one before it. Trees, mushrooms and tall grass block building. The robots come out of a smoking factory.

## Losing (and not losing)
- The Base (a grand tree) has 100 Base Health. A robot that reaches it takes away 10% of its remaining health (max 40).
- Each point lost turns a square into Factory: belts, pipes and machines joined into one factory with a hazard-striped wall. Towers on Factory do 2 less damage.
- At 0 health the factory sweeps across the whole map, then **GAME OVER** shows for 4 seconds before the results.
- Winning earns 1–3 Stars based on Base Health left.

## Towers (tap a grass square to build; each has 3 Upgrades; marks above its head show how upgraded it is)
| Tower | Cost | What it does | Upgrade choices (pick one at each upgrade) |
|---|---|---|---|
| Fire Dragon | 60 | Fireballs that burn | Splash Fireball / Long Flame · Hotter Flames / Rapid Fire · Inferno / Dragon Eyes. Flies and flaps its wings at Upgrade 3 |
| Water Frog | 55 | Tongue lick that slows (rusts) robots | Double Damage / Long Tongue · Fast Spit / Deep Freeze · Big Splash / Rust Vision |
| Tree Giant | 75 | Vines hold robots still | Ground Pound / Quick Fists · Thorny Vines / Strong Roots · Earthquake / Vine Storm. Smashes the ground every 5 seconds at Upgrade 3 |
| Owl | 85 | Gusts push robots back (sliding); sees Hiders | Eagle Eyes / Twin Gusts · Sharp Talons / Quick Wings · Tornado / Feather Storm. Hovers on a wind platform at Upgrade 3 |
| Wizard | 110 | Helper: nearby towers attack faster | Normal upgrades |
| Healer Deer | 300 | Heals the Base after every Wave | Normal upgrades |
| Squirrel | 120 | Gathers 10 Maple Leaves after every Wave (+5 per upgrade) | Normal upgrades |
| Pegasus (Super Tower) | 350 | Golden stars at 3 robots at once; sees Hiders | Only appears after it's unlocked on the Upgrades page |

## Robots (Normal difficulty)
| Robot | Health | Speed | Leaves | First appears |
|---|---|---|---|---|
| Clanker | 30 | 1.8 | 5 | Wave 1 |
| Scout | 28 | 4.2 | 6 | Wave 3 |
| Walker | 75 | 2.2 | 8 | Wave 4 |
| Tank | 240 | 1.2 | 16 | Wave 7 |
| Hider | 90 | 2.4 | 12 | Wave 8 (invisible for 3 seconds when hit) |
| Boss | 900 / 2,200 / 4,500 | 0.9 | 120 | Waves 5, 10, 15 |

Glowing robots are tougher: blue 1.7×, purple 2.6×, orange 4× health. Harder difficulties make robots faster and tougher.

## Money and rewards
- **Maple Leaves** (in-game money): dropped by robots, a bonus after each Wave, Squirrels, and a bonus leaf that pops up about every 7 seconds during a Wave (tap it for +20, gone after 5 seconds).
- **Golden Acorns** (kept forever in the save slot): only from robot drops on the Meadow (1% each). Shown in the top middle of the screen.
- **Upgrades page** (per save slot, paid in Golden Acorns): Bigger Leaf Pile, Stronger Towers, Tougher Tree, Bargain Builders, and the Mystery Super Tower (250 acorns, unlocks the Pegasus).

## Online
- Leaderboards (top 10 per level, plus each challenge) and challenge lobbies use the free Supabase project; a daily Vercel job keeps it awake.
- Save slots, stars, acorns and upgrades are stored in each browser, so each device has its own saves.

## How it's built
- `pjs-game.html` (the game) + `settings.js` (all the numbers) in the GitHub repo `mbnocode/PJ-s-Game`. Every push to `main` goes live on Vercel within a minute.
