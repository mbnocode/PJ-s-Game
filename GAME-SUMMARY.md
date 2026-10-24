# PJ's Game: the plan (version 1)

Nature vs. tech tower defense. PJ is the game designer; Claude writes the code. Every number (damage, speed, prices, robots per Wave) lives in one settings file PJ can change himself. Words are defined in GLOSSARY.md; ideas for later are in LATER.md.

## Playing a game
- Open a link in the browser (Chromebook, computer or iPad). Nothing to install.
- Pick a Save Slot (3), a Level, and a Difficulty: Easy, Normal, Hard or Nightmare.
- Choose whether to turn on the Tutorial, which guides you through the first 5 Waves.
- Press Start Wave. Use Pause, 2× or 3× speed any time.

## The map
- A chunky pixel-art grid seen from above, with a twisty path from the Robots' side all the way to the Base.
- Level 1 is the Meadow (long, twisty path, easier). Level 2 is the Forest (straighter path, harder). Beating a Level unlocks the next.
- Each Level is 15 Waves, with a Boss on Waves 5, 10 and 15.

## Losing (and not losing)
- The Base has 100 Base Health. A Robot that reaches it takes away the health the Robot had left.
- Every point lost turns one of 100 land squares into Factory, spreading from the Robots' side toward the Base. All 100 Factory = game over.
- Towers standing on Factory do 2 less damage.
- The Healer tower (a glowing deer) gives back 1 Base Health per Wave and turns Factory back into grass. It's expensive. On Easy only, the Base also heals a little on its own.
- Beat a Level to earn 1 to 3 Stars, based on Base Health left.

## Towers (tap a grass square to place; can't be hurt)
- Fire dragon: burns. Water frog: rusts Robots so they slow down. Tree giant: vines hold Robots in place. Owl: wind pushes Robots back, and it can see Hiders.
- Wizard (Helper): nearby Towers attack faster.
- Healer (glowing deer): heals the Base.
- Upgrade up to 3 times with Maple Leaves; each Upgrade changes how the Tower looks. Upgrades can give Vision (seeing Hiders). Sell for half price.

## Robots
- Clanker (wobbly yellow farm bot), Scout (fast, from Wave 3), Walker, Tank, Hider (goes invisible for 3 seconds when hit), and a Boss.
- A glow shows extra strength: none, blue, purple, orange (strongest). Stronger glows appear in later Waves and on harder Difficulties.
- Destroyed Robots drop Maple Leaves that fly up to the money bar.

## Friends and scores
- Score = points for Robots destroyed (bigger = more) + a bonus for Base Health left, × Difficulty (Nightmare ×3).
- An all-time Leaderboard for each Level, plus Challenges: a code like LEAF-42 that friends type in to play the same Level and Difficulty for 1 hour, 1 day or 1 week, with its own Leaderboard.
- Nicknames only, no logins. Preston can delete names.

## Sound
- Clank-pop when a Robot breaks, swish for leaves, a sound for each element, a horn when a Boss arrives, a calm nature music loop, and a mute button.

## How it's built
- One web page hosted on Vercel at a public link; scores in Supabase's free plan (see docs/adr).
