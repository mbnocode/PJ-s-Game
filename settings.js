/* =====================================================================
   HOW TO EDIT
   1. Change a number below and save this file.
   2. Open pjs-game.html in Chrome (double-click it) to try your change.
   Keep the commas, brackets [ ] and braces { } where they are.
   ===================================================================== */

/* =====================================================================
   GAME SETTINGS — PJ, this part is yours!
   Change any number here to make the game easier, harder or weirder.
   ===================================================================== */
const SETTINGS = {
  baseHealth: 100,                // how much health your Base starts with
  quicksandSlow: 0.5,             // robots in quicksand move this much slower (0.5 = half speed)
  minHealthTimes: 0.5,            // the score is multiplied by your Base health (30 health = x0.30), but never by less than this (even when you lose)
  factorySquares: 100,            // how many squares of land the Robots can take over
  robotHitRatio: 0.1,             // a Robot that reaches the Base hits it for this much of the health it has left (0.1 = 10%)
  maxHitPerRobot: 40,             // no single Robot can hit the Base harder than this
  factoryWeakness: 2,             // Towers standing on Factory do this much less damage
  waveBonusLeaves: 20,            // Maple Leaves you get for clearing a Wave (plus 2 more per Wave number)
  // During a Wave, a bonus Maple Leaf pops up on an empty square every few seconds. Tap it before it disappears!
  bonusLeaf: { leaves: 20, everySecondsMin: 6, everySecondsMax: 8, staySeconds: 5 },

  difficulties: {
    easy:      { name: "Easy",      robotHealth: 0.75, robotSpeed: 0.9,  startLeaves: 220, scoreTimes: 1,   baseHealsPerWave: 1, auraChance: 0,    strongestAura: 0 },
    normal:    { name: "Normal",    robotHealth: 1,    robotSpeed: 1,    startLeaves: 180, scoreTimes: 1.5, baseHealsPerWave: 0, auraChance: 0.15, strongestAura: 2 },
    hard:      { name: "Hard",      robotHealth: 1.35, robotSpeed: 1.12, startLeaves: 170, scoreTimes: 2,   baseHealsPerWave: 0, auraChance: 0.25, strongestAura: 3 },
    nightmare: { name: "Nightmare", robotHealth: 1.6,  robotSpeed: 1.3,  startLeaves: 160, scoreTimes: 3,   baseHealsPerWave: 0, auraChance: 0.4,  strongestAura: 3 },
  },

  // Glowing Robots are tougher. Index 1 = blue, 2 = purple, 3 = orange.
  auras: [
    null,
    { name: "Blue",   color: "#4aa8ff", health: 1.7, leaves: 1.5, points: 1.5 },
    { name: "Purple", color: "#b46cff", health: 2.6, leaves: 2,   points: 2 },
    { name: "Orange", color: "#ff8a1f", health: 4,   leaves: 3,   points: 3 },
  ],

  towers: {
    fire:   { name: "Fire Dragon", cost: 60,  range: 2.3, damage: 9,  attacksPerSecond: 2.4, burnDamagePerSecond: 5, burnSeconds: 2,
              // On snowy levels you can pay to turn a Fire Dragon into an Ice Dragon: its icy blasts slow robots like a Water Frog (instead of burning them).
              iceDragon: { cost: 150, slowBy: 0.45, slowSeconds: 1.6, damageTimes: 1.25, themes: ["tundra", "glacier", "blizzard"] },   // damageTimes: Ice Dragons hit this many times harder
              about: "Shoots fireballs that keep burning.",
              // Pick ONE choice at each upgrade. Same kinds of choices as the Water Frog, plus
              // burnPlus (extra burn damage per second) and burnSecondsPlus (burns for longer).
              upgradeChoices: [
                [ { name: "Splash Fireball", about: "Fireballs also burn robots within 1 square.", splash: 1 },
                  { name: "Long Flame",      about: "Reaches 1 more square.", rangePlus: 1 } ],
                [ { name: "Hotter Flames",   about: "Burns twice as hot, for 1 second longer.", burnPlus: 5, burnSecondsPlus: 1 },
                  { name: "Rapid Fire",      about: "Attacks 50% faster.", speedTimes: 1.5 } ],
                [ { name: "Inferno",         about: "Hits twice as hard.", damageTimes: 2 },
                  { name: "Dragon Eyes",     about: "Can see Hiders and reaches a bit farther.", vision: true, rangePlus: 0.5 } ],
              ] },
    water:  { name: "Water Frog",  cost: 55,  range: 2.5, damage: 5,  attacksPerSecond: 2, slowBy: 0.45, slowSeconds: 1.6,
              about: "Rusts Robots so they slow down.",
              // Each upgrade lets you pick ONE of these. You can add more choices, or give other towers choices too.
              // What a choice can do: damageTimes (2 = double damage), rangePlus (extra squares), speedTimes (1.5 = 50% faster),
              // slowPlus (slows robots this much more), slowSecondsPlus, splash (also hits robots within this many squares), vision (can hit Hiders)
              upgradeChoices: [
                [ { name: "Double Damage", about: "Hits twice as hard.", damageTimes: 2 },
                  { name: "Long Tongue",   about: "Reaches 1 more square.", rangePlus: 1 } ],
                [ { name: "Fast Spit",     about: "Attacks 50% faster.", speedTimes: 1.5 },
                  { name: "Deep Freeze",   about: "Slows robots way more, for longer.", slowPlus: 0.25, slowSecondsPlus: 1 } ],
                [ { name: "Big Splash",    about: "Also soaks robots within 1 square.", splash: 1 },
                  { name: "Rust Vision",   about: "Can see Hiders and hits 50% harder.", vision: true, damageTimes: 1.5 } ],
              ] },
    plant:  { name: "Tree Giant",  cost: 75,  range: 1.9, damage: 12, attacksPerSecond: 1.4, holdSeconds: 0.7,
              about: "Vines grab Robots and hold them still.",
              // At Upgrade 3 the giant smashes its fists on the ground every few seconds, hitting every robot nearby.
              groundSmash: { everySeconds: 5, radius: 1.8, damage: 25, holdSeconds: 0.5 },
              // Pick ONE choice at each upgrade. Extra choice kinds for the Tree Giant:
              // targetsPlus (grab this many more robots at once), holdSecondsPlus (holds robots longer).
              upgradeChoices: [
                [ { name: "Ground Pound",  about: "Smashes robots within 1 square too.", splash: 1 },
                  { name: "Quick Fists",   about: "Attacks 50% faster.", speedTimes: 1.5 } ],
                [ { name: "Thorny Vines",  about: "Hits 60% harder.", damageTimes: 1.6 },
                  { name: "Strong Roots",  about: "Holds robots twice as long.", holdSecondsPlus: 0.7 } ],
                [ { name: "Earthquake",    about: "Smashes 1 more square around and hits 30% harder.", splash: 1, damageTimes: 1.3 },
                  { name: "Vine Storm",    about: "Grabs 3 more robots at once.", targetsPlus: 3 } ],
              ] },
    air:    { name: "Owl",         cost: 85,  range: 3.7, damage: 5,  attacksPerSecond: 1.6, pushBack: 0.7, vision: true,
              about: "Wind pushes Robots back. Can see Hiders.",
              // Pick ONE choice at each upgrade. Extra choice kinds for the Owl:
              // pushTimes (pushes robots back this many times farther), targetsPlus (blasts this many more robots at once).
              upgradeChoices: [
                [ { name: "Eagle Eyes",    about: "Reaches 1 more square.", rangePlus: 1 },
                  { name: "Twin Gusts",    about: "Blasts 2 robots at once.", targetsPlus: 1 } ],
                [ { name: "Sharp Talons",  about: "Hits twice as hard.", damageTimes: 2 },
                  { name: "Quick Wings",   about: "Attacks 50% faster.", speedTimes: 1.5 } ],
                [ { name: "Tornado",       about: "Each gust also blows back robots within 1 square.", splash: 1, pushTimes: 1.5 },
                  { name: "Feather Storm", about: "Blasts 2 more robots at once.", targetsPlus: 2 } ],
              ] },
    wizard: { name: "Wizard",      cost: 110, range: 2.2, speedBoost: 0.3,
              // Elemental Sphere (an Upgrade 3 choice): floats over the staff and zaps nearby robots every few seconds.
              elementalSphere: { everySeconds: 3, radius: 2.2, damage: 22, zaps: 3 },
              about: "Helper: nearby Towers attack faster.",
              // Pick ONE choice at each upgrade. Wizard choice kinds: speedBoostPlus (nearby towers attack even faster),
              // discount (every tower costs this much less: 0.1 = 10%), damageAura (nearby towers hit harder: 0.25 = 25%),
              // visionAura (nearby towers can see Hiders), sphere (Elemental Sphere), slowAura (nearby robots move slower: 0.4 = 40%).
              upgradeChoices: [
                [ { name: "Haste Spell",      about: "Nearby towers attack 25% faster on top of the normal boost.", speedBoostPlus: 0.25 },
                  { name: "Bargain Magic",    about: "Every tower you build or upgrade costs 10% less.", discount: 0.1 } ],
                [ { name: "Power Spell",      about: "Nearby towers hit 25% harder.", damageAura: 0.25 },
                  { name: "Far Sight",        about: "Reaches 1 more square, and nearby towers can see Hiders.", rangePlus: 1, visionAura: true } ],
                [ { name: "Elemental Sphere", about: "A swirling sphere over the staff zaps 3 nearby robots every 3 seconds.", sphere: true },
                  { name: "Time Warp",        about: "Robots near the Wizard move 40% slower.", slowAura: 0.4 } ],
              ] },
    healer: { name: "Healer Deer", cost: 300, healPerWave: 1, range: 2.6,
              about: "Heals your Base after every Wave.",
              // Antler Shot choices turn on this attack.
              antler: { damage: 30, attacksPerSecond: 0.7, range: 2.6 },
              // Deer choice kinds: healPlus (heals more after each wave), antlerShot (shoots antlers), damageAura (nearby towers
              // hit harder), regenEvery (during waves, heals 1 Base Health every this many seconds), plus damageTimes / targetsPlus / vision.
              upgradeChoices: [
                [ { name: "Healing Bloom",  about: "Heals 2 more Base Health after every wave.", healPlus: 2 },
                  { name: "Antler Shot",    about: "Shoots strong glowing antlers at robots.", antlerShot: true } ],
                [ { name: "Sacred Grove",   about: "Nearby towers hit 20% harder.", damageAura: 0.2 },
                  { name: "Antler Volley",  about: "Shoots antlers at 2 robots at once, 50% harder.", antlerShot: true, targetsPlus: 1, damageTimes: 1.5 } ],
                [ { name: "Spirit Glow",    about: "During waves, heals 1 Base Health every 6 seconds.", regenEvery: 6 },
                  { name: "Golden Antlers", about: "Antler shots hit twice as hard and can see Hiders.", antlerShot: true, damageTimes: 2, vision: true } ],
              ] },
    squirrel: { name: "Squirrel", cost: 120, leavesPerWave: 10,
              about: "Gathers Maple Leaves for you after every Wave.",
              // Pick one choice at each Upgrade. leavesPlus (more leaves after each wave), leafSpotter (bonus maple leaves
              // appear this much more often: 0.3 = 30%), leafValuePlus / leafStaySecondsPlus (bonus leaves worth more / stay longer),
              // nutWall (adds a button: the squirrel turns into a wall on the path that blocks robots until they break it).
              upgradeChoices: [
                [ { name: "Deep Pockets",   about: "Gathers 10 more leaves after every wave.", leavesPlus: 10 },
                  { name: "Leaf Spotter",   about: "Bonus maple leaves appear 30% more often.", leafSpotter: 0.3 } ],
                [ { name: "Treasure Hoard", about: "Gathers 15 more leaves after every wave.", leavesPlus: 15 },
                  { name: "Golden Leaves",  about: "Bonus maple leaves are worth 10 more and stay 2 seconds longer.", leafValuePlus: 10, leafStaySecondsPlus: 2 } ],
                [ { name: "Nut Wall",       about: "Can jump onto the path and become a wall of nuts that blocks robots. The squirrel is gone for good.", nutWall: { health: 600 } },
                  { name: "Leaf Whisperer", about: "Bonus maple leaves appear twice as often.", leafSpotter: 1 } ],
              ],
              // How fast robots chew through a Nut Wall (health per second). Tanks chew 2x, Bosses 5x.
              wallChewPerSecond: 25 },
    crab:   { name: "Crab",        cost: 85,  range: 2.0, damage: 14, attacksPerSecond: 0.9, splash: 1,
              about: "Hurls seashells that splash every robot within 1 square.",
              // Pick ONE choice at each upgrade (splash = how many squares around the hit robot also get hurt; they take half damage).
              upgradeChoices: [
                [ { name: "Big Claws",     about: "Hits 50% harder.", damageTimes: 1.5 },
                  { name: "Wide Splash",   about: "Splashes half a square farther.", splash: 0.5 } ],
                [ { name: "Quick Snips",   about: "Attacks 50% faster.", speedTimes: 1.5 },
                  { name: "Long Throw",    about: "Reaches 1 more square.", rangePlus: 1 } ],
                [ { name: "Tidal Slam",    about: "Splashes 1 more square and hits 30% harder.", splash: 1, damageTimes: 1.3 },
                  { name: "Double Pinch",  about: "Throws shells at 2 robots at once.", targetsPlus: 1 } ],
              ] },
    // The Super Tower. It only shows up in the shop after you buy it on the Upgrades page.
    pegasus:  { name: "Pegasus", cost: 350, range: 3.4, damage: 30, attacksPerSecond: 1.1, targets: 3, vision: true, superTower: true,
              about: "Super Tower: shoots golden stars at 3 robots at once. Can see Hiders.",
              // Pick ONE choice at each upgrade.
              upgradeChoices: [
                [ { name: "Starburst",      about: "Shoots stars at 1 more robot (4 at once).", targetsPlus: 1 },
                  { name: "Far Sight",      about: "Reaches 1 more square.", rangePlus: 1 } ],
                [ { name: "Shooting Stars", about: "Attacks 50% faster.", speedTimes: 1.5 },
                  { name: "Heavy Stars",    about: "Hits 60% harder.", damageTimes: 1.6 } ],
                [ { name: "Constellation",  about: "Shoots stars at 2 more robots.", targetsPlus: 2 },
                  { name: "Supernova",      about: "Hits twice as hard.", damageTimes: 2 } ],
              ] },
    // The Hydra: unlock it in the Serpent's Shop (on the save slot screen). Each of its 3 heads bites a different robot.
    // The Phoenix: the jackpot prize from the Mystery Box. Its fire feathers burn robots, and nothing can freeze, stun or trap it:
    // it bursts into flames instead ("rebirth") and scorches robots within rebirth.radius squares.
    phoenix:  { name: "Phoenix", cost: 220, range: 2.8, damage: 20, attacksPerSecond: 1.3, burnDamagePerSecond: 8, burnSeconds: 2.5, boxUnlock: "phoenix",
              rebirth: { radius: 1.5, damage: 40 },
              about: "Found in the Mystery Box. Shoots blazing feathers that burn robots. It can't be frozen or trapped: it bursts into flames instead.",
              upgradeChoices: [
                [ { name: "Blazing Feathers", about: "Burns 6 more damage a second.", burnPlus: 6 },
                  { name: "Wide Wings",       about: "Reaches 1 more square.", rangePlus: 1 } ],
                [ { name: "Firestorm",        about: "Attacks 50% faster.", speedTimes: 1.5 },
                  { name: "Twin Flames",      about: "Shoots 2 robots at once.", targetsPlus: 1 } ],
                [ { name: "Sun Fire",         about: "Hits twice as hard.", damageTimes: 2 },
                  { name: "Phoenix Eyes",     about: "Can see Hiders and reaches a bit farther.", vision: true, rangePlus: 0.5 } ],
              ] },
    // The Wolf: unlock it in the Night Owl's shop. It hits like a Fire Dragon (without the burn, and it can't hit flying robots),
    // and packBonus = extra damage on every attack for each Wolf in the 8 squares around it.
    wolf:     { name: "Wolf", cost: 60, range: 2.3, damage: 9, attacksPerSecond: 2.4, packBonus: 15, serpentUnlock: "wolf",
              about: "Unlocked in the Night Owl's shop. Hits like a Fire Dragon, and gets stronger next to other Wolves.",
              upgradeChoices: [
                [ { name: "Sharp Fangs",  about: "Hits 50% harder.", damageTimes: 1.5 },
                  { name: "Swift Paws",   about: "Attacks 50% faster.", speedTimes: 1.5 } ],
                [ { name: "Keen Nose",    about: "Can sniff out Hiders and reaches a bit farther.", vision: true, rangePlus: 0.5 },
                  { name: "Long Leap",    about: "Reaches 1 more square.", rangePlus: 1 } ],
                [ { name: "Alpha Wolf",   about: "Hits twice as hard.", damageTimes: 2 },
                  { name: "Pack Howl",    about: "Every Wolf next to it adds 10 more damage (25 each).", packPlus: 10 } ],
              ] },
    hydra:    { name: "Hydra", cost: 180, range: 2.2, damage: 24, attacksPerSecond: 1.11, targets: 3, serpentUnlock: "hydra",
              flyingDamageTimes: 0.5,   // it can bite flying robots, but only does this much of its damage to them (0.5 = half)
              about: "Unlocked in the Serpent's Shop. Its three heads bite 3 different robots at once.",
              // Pick ONE choice at each upgrade.
              upgradeChoices: [
                [ { name: "Long Necks",     about: "Reaches 1 more square.", rangePlus: 1 },
                  { name: "Sharp Fangs",    about: "Bites 50% harder.", damageTimes: 1.5 } ],
                [ { name: "Hungry Heads",   about: "Bites 50% faster.", speedTimes: 1.5 },
                  { name: "Serpent Eyes",   about: "Can see Hiders and reaches a bit farther.", vision: true, rangePlus: 0.5 } ],
                [ { name: "Hydra's Fury",   about: "Bites twice as hard.", damageTimes: 2 },
                  { name: "Extra Bite",     about: "Grows a 4th head, so it bites 1 more robot each time (4 at once).", targetsPlus: 1 } ],
              ] },
  },
  upgradeCost: [0.7, 1.0, 1.5],   // price of Upgrade 1, 2 and 3, times the Tower's price
  upgradeDamage: 0.45,            // each Upgrade adds this much damage (0.45 = +45%)
  upgradeRange: 0.25,             // each Upgrade adds this many squares of range
  upgradeSpeed: 0.15,             // each Upgrade makes attacks this much faster
  visionAtUpgrade: 3,             // at this Upgrade every Tower gets Vision (can hit Hiders)
  sellBack: 0.5,                  // selling gives back this much of what you spent

  robots: {
    clanker: { name: "Clanker", health: 30,  speed: 1.8,  leaves: 5,   points: 10 },
    scout:   { name: "Scout",   health: 28,  speed: 4.2,  leaves: 6,   points: 15 },
    walker:  { name: "Walker",  health: 75,  speed: 2.2,  leaves: 8,   points: 20 },
    tank:    { name: "Tank",    health: 240, speed: 1.2,  leaves: 16,  points: 45 },
    hider:   { name: "Hider",   health: 90,  speed: 2.4,  leaves: 12,  points: 35, hideSeconds: 3 },
    // Tesla Coil: robots within boostRadius squares of it move boostSpeed times faster. (Shows up on The Swamp from wave 16.)
    tesla:   { name: "Tesla Coil", health: 240, speed: 1.6, leaves: 14, points: 40, boostRadius: 2, boostSpeed: 2 },
    // Junk Splitter breaks into splitInto Mini-Clankers when destroyed. (Shows up on The Beach.)
    splitter: { name: "Junk Splitter", health: 120, speed: 1.4, leaves: 10, points: 30, splitInto: 3 },
    mini:     { name: "Mini-Clanker", health: 15, speed: 3, leaves: 2, points: 5 },   // speed = squares per second
    // Repair Bot heals robots within healRadius squares by healAmount every healEvery seconds. (Shows up on The Beach.)
    repair:   { name: "Repair Bot", health: 60, speed: 2.0, leaves: 12, points: 35, healRadius: 1.5, healAmount: 15, healEvery: 3 },
    // Mummy Bot unravels into splitInto robots of type splitType when destroyed. (Shows up on The Lost Pyramid.)
    mummy:    { name: "Mummy Bot", health: 160, speed: 1.3, leaves: 14, points: 35, splitInto: 2, splitType: "scout" },
    // Desert robots:
    // Sand Golem (a Boss): every sandstormEvery seconds, towers within sandstormRadius squares can't attack for sandstormSeconds.
    sandboss: { name: "Sand Golem", health: 1600, speed: 0.8, leaves: 150, points: 500, baseHit: 40, isBoss: true, sandstormEvery: 6, sandstormRadius: 2, sandstormSeconds: 2 },
    // Sky Drone flies straight to the treehouse instead of following the road. Only Owls, Dragons, the Pegasus and the
    // Wizard's Elemental Sphere can hit it. baseHit = how hard it hits your Base.
    drone:    { name: "Sky Drone", health: 45, speed: 2.8, leaves: 10, points: 30, flying: true, baseHit: 8 },
    boss:    { name: "Boss",    health: 900, speed: 0.9, leaves: 120, points: 400 },
    // Lava-level robots (The Basalt Delta, The Magma Fields and Inside the Volcano).
    // Magma Crawler: towers next to its burning trail can't attack for trailStopsTowers seconds.
    crawler:  { name: "Magma Crawler", health: 110, speed: 2.0, leaves: 12, points: 35, trailStopsTowers: 1 },
    // Obsidian Shell: takes half damage until one hit of crackHit or more cracks its shell.
    obsidian: { name: "Obsidian Shell", health: 260, speed: 1.0, leaves: 18, points: 50, crackHit: 40 },
    // Ember Bat: flies in swarms of swarm. Only Owls, Dragons, the Pegasus and the Wizard's Sphere can hit it.
    emberbat: { name: "Ember Bat", health: 30, speed: 3.6, leaves: 6, points: 20, flying: true, baseHit: 5, swarm: 5 },
    // Fire-Proof Bot: Fire Dragons do no damage, Water Frogs do waterTimes damage.
    fireproof: { name: "Fire-Proof Bot", health: 140, speed: 1.8, leaves: 12, points: 35, waterTimes: 2 },
    // Lava Diver: every diveEvery seconds it dives under the lava for diveSeconds and can't be hit.
    diver:    { name: "Lava Diver", health: 120, speed: 2.2, leaves: 14, points: 40, diveEvery: 4, diveSeconds: 2 },
    // Snow robots (The Frozen Tundra). The Blizzard King waits for Blizzard Peak.
    snowplow:  { name: "Snowplow Bot", health: 220, speed: 1.4, leaves: 16, points: 45, frontArmor: 0.5 },   // takes half damage from towers in front of it
    snowball:  { name: "Snowball Roller", health: 40, speed: 2.0, leaves: 10, points: 30, growPerSquare: 3, baseHit: 8 },   // gains health for every square it rolls
    penguin:   { name: "Penguin Bot", health: 50, speed: 1.6, leaves: 8, points: 20, iceSpeed: 3 },   // slides this many times faster on ice
    snowdrone: { name: "Snow Drone", health: 55, speed: 2.6, leaves: 12, points: 30, flying: true, baseHit: 8, dropEvery: 5, freezeSeconds: 2 },
    yetimech:     { name: "Yeti Mech", health: 2600, speed: 0.7, leaves: 180, points: 650, baseHit: 50, isBoss: true, roarEvery: 7, freezeRadius: 1.5, freezeSeconds: 2 },
    glaciergolem: { name: "Glacier Golem", health: 2400, speed: 0.75, leaves: 170, points: 600, baseHit: 45, isBoss: true, chunkEvery: 400 },   // drops an Ice Chunk every chunkEvery damage
    // The Super Glacier Golem: three Glacier Golems merge into it on the last wave of The Glacier Caves.
    // fixedHealth: its health is exactly this on Normal (the level and late waves don't make it tougher; Easy/Hard/Nightmare still do).
    superglaciergolem: { name: "Super Glacier Golem", health: 6000, speed: 1, leaves: 400, points: 1800, baseHit: 80, isBoss: true, fixedHealth: true, chunkEvery: 500,
                         mergeIntro: { seconds: 5.5, atSquare: 6.5 } },   // the merge cutscene: how long the rest of the wave waits, and how many squares down the road they merge
    icechunk:     { name: "Ice Chunk", health: 90, speed: 1.6, leaves: 6, points: 15 },
    blizzardking: { name: "Blizzard King", health: 4000, speed: 0.6, leaves: 260, points: 950, baseHit: 60, isBoss: true, rangeShrink: 0.3 },
    // Lava-level Bosses:
    pillartitan:  { name: "Pillar Titan", health: 2200, speed: 0.7, leaves: 170, points: 600, baseHit: 45, isBoss: true, slamEvery: 8 },
    magmaking:    { name: "Magma Cube King", health: 1800, speed: 0.8, leaves: 160, points: 550, baseHit: 40, isBoss: true, splitInto: 2, splitType: "magmacube" },
    magmacube:    { name: "Magma Cube", health: 300, speed: 1.2, leaves: 20, points: 60, baseHit: 15, splitInto: 2, splitType: "magmasmall" },   // what the King splits into
    magmasmall:   { name: "Small Magma Cube", health: 70, speed: 1.9, leaves: 5, points: 15 },
    volcanoheart: { name: "Volcano Heart", health: 10000, speed: 0.6, leaves: 250, points: 900, baseHit: 60, isBoss: true, healPerSecond: 25,   // heals on the lava squares of the road
                    noSlow: true,             // Wizard Time Warps and Water Frog slows don't affect it (Freeze still does)
                    finalQuakeSeconds: 1 },   // on the final wave, the screen shakes this long before it rises
  },

  // ---------------- ABILITIES ----------------
  // Special powers on the button beside the board. Tap the button, then tap where it should land.
  abilities: {
    // Add burnDamagePerSecond + burnSeconds to set robots on fire, or cooldownSeconds to make it wait between uses.
    fireball: { name: "Mega Fireball", cost: 300, damage: 500, radius: 1.6 },
    // Freeze: every robot in the circle (even Bosses and flying ones) stops moving for this many seconds.
    freeze:   { name: "Freeze", cost: 100, seconds: 5, radius: 1.6 },
  },

  // ---------------- COMING SOON LEVELS ----------------
  // These show on the level picker as locked "Coming soon" cards. They can't be played yet.
  comingSoon: [
    { name: "Blizzard Peak", look: "blizzard", about: "The top of a snowy mountain in a howling blizzard. Watch out for the cliff!" },
    { name: "The Iron Fortress", look: "fortress", about: "The robots' giant iron stronghold. 100 waves! Can you survive them all?" },
  ],

  // ---------------- THE SERPENT'S SHOP ----------------
  // The secret shop you reach by tapping the serpent hiding behind a tree on the save slot screen.
  // Each item costs Golden Acorns. Add items like this (they don't do anything in the game yet):
  //   dragonScale: { name: "Dragon Scale", cost: 50, about: "A shiny scale. Something might need it someday." },
  serpentShop: {
    // unlock: true = you buy it once and keep it. picture = which picture shows on the shelf. shelf = which shelf it sits on.
    // acornTimes: once you own it, every Golden Acorn that drops counts this many times.
    acorndoubler: { name: "Golden Acorn Doubler", cost: 150, unlock: true, shelf: 1, picture: "acorndoubler", acornTimes: 2, about: "Every Golden Acorn that drops counts twice: you get 2 instead of 1! Works on every level, for this save slot." },
    // oneAtATime: you can hold only one. Opening the Mystery Box uses it up, then you can buy another.
    mysterykey: { name: "Mystery Key", cost: 400, oneAtATime: true, shelf: 2, picture: "mysterykey", about: "A glowing golden key. It opens the Mystery Box on the Upgrades page…",
                  holdingText: "You have one! Use it on the Mystery Box (Upgrades page)." },
    hydra: { name: "Hydra", cost: 300, unlock: true, shelf: 3, picture: "hydra", about: "A three-headed serpent tower! Unlock it and it joins your towers in every level. Each head bites a different robot." },
  },
  // The Mystery Box on the Upgrades page. It needs the Mystery Key from the Serpent's Shop.
  mysteryBox: { name: "Mystery Box", about: "Locked tight. Only a Mystery Key can open it. Maybe someone hiding nearby sells one…",
                openedAbout: "The box creaked open and light poured out! Buy another Mystery Key to open it again.",
                // What can come out of the box. chance = how likely each one is (they don't have to add up to 100).
                prizes: {
                  acorns:    { chance: 45, min: 200, max: 600 },   // Acorn Pouch: a random pile of Golden Acorns
                  leafboost: { chance: 25, leaves: 200 },           // Leaf Boost: extra Maple Leaves at the start of your next game
                  golden:    { chance: 15 },                        // Golden Tower: one of your towers turns shiny gold (just for looks)
                  upgrade:   { chance: 10 },                        // Mystery Upgrade: a free level of a permanent upgrade
                  phoenix:   { chance: 5 },                         // JACKPOT: the Phoenix tower (only once)
                } },
  serpentShopSlots: 3,   // how many shelves the shop shows (empty ones say "Coming soon")

  // ---------------- MORE SECRET SHOPS ----------------
  // The Night Owl: wait on the title screen and night falls; tap the glowing eyes in the old tree.
  nightOwl: { waitSeconds: 20, duskSeconds: 5, shelves: 3 },
  titleBats: { everySeconds: [4, 8] },   // a bat flies across the title screen every 4 to 8 seconds   // seconds of waiting before dusk, how long night takes to fall, shelves in the shop
  nightOwlShop: {
    // Add items here, just like the Serpent's Shop (name, cost, about, picture, shelf, unlock).
    wolf: { name: "Wolf", cost: 400, unlock: true, shelf: 1, picture: "wolf", about: "A silver wolf tower! It hits as hard as a Fire Dragon, and every Wolf next to it adds 15 damage to each of its attacks. Unlock it and it joins your towers in every level." },
  },
  // The Hermit Crab: on these levels, between waves, a bump sometimes moves in the sand. Tap it!
  hermitCrab: { levels: ["beach"], chance: 0.5, shelves: 3 },   // chance = how often the bump shows up in each break between waves
  hermitCrabShop: {
    // Add items here, just like the Serpent's Shop.
  },
  // The Defector Robot: a robot who switched to nature's side. On the Enemies page, one robot card (this one) has a loose screw: tap it!
  defector: { card: "clanker", shelves: 3 },
  defectorShop: {
    // Add items here, just like the Serpent's Shop.
  },

  // Leaderboard resets: a level's leaderboard only counts scores from after this time (UTC).
  // The old scores aren't deleted. Remove a line to bring that level's old scores back.
  leaderboardResets: {
    meadow: "2026-10-29T22:58:28Z",
    forest: "2026-10-29T22:58:28Z",
  },

  // ---------------- PERMANENT UPGRADES ----------------
  // Golden Acorns only come from robots dropping them (see acornDropChance on each level).
  acornsFromWave: 6,   // robots only drop Golden Acorns from this wave on (6 = after wave 5)
  bossDropsAcorn: true,   // every Boss you defeat always drops a Golden Acorn (any wave, any level)
  // Spend them on the Upgrades page.
  permanentUpgrades: {
    startLeaves: { name: "Bigger Leaf Pile",  about: "Start every game with 25 more Maple Leaves.", per: 25,   costs: [10, 20, 30, 45, 60] },
    damage:      { name: "Stronger Towers",   about: "All towers deal 5% more damage.",            per: 0.05, costs: [15, 30, 45, 65, 90] },
    baseHealth:  { name: "Tougher Tree",      about: "Your Base gets 10 more health.",              per: 10,   costs: [20, 40, 70] },
    cheaper:     { name: "Bargain Builders",  about: "Towers cost 5% less to build and upgrade.",   per: 0.05, costs: [15, 30, 50, 75] },
    // The Super Tower stays a mystery until you unlock it.
    superTower:  { name: "Mystery Super Tower", about: "A secret, super-powerful tower. Unlock it to find out what it is!", per: 1, costs: [250],
                   unlockedName: "Super Tower: Pegasus", unlockedAbout: "The Pegasus is in your tower shop!" },
  },

  // Each Wave is a list of groups: [robot, how many, seconds between them, (Boss health)]
  waves: [
    [["clanker", 8, 1.3]],
    [["clanker", 12, 1.0]],
    [["clanker", 8, 1.0], ["scout", 6, 0.8]],
    [["walker", 8, 1.1], ["scout", 6, 0.7]],
    [["walker", 6, 1.2], ["boss", 1, 0, 900]],
    [["clanker", 10, 0.6], ["walker", 10, 0.9]],
    [["scout", 12, 0.5], ["tank", 4, 2.0]],
    [["walker", 8, 0.9], ["hider", 6, 1.2]],
    [["tank", 6, 1.6], ["hider", 6, 1.0]],
    [["walker", 12, 0.7], ["tank", 4, 1.5], ["boss", 1, 0, 2200]],
    [["scout", 20, 0.4], ["hider", 8, 0.9]],
    [["walker", 14, 0.6], ["tank", 10, 1.2]],
    [["hider", 12, 0.8], ["tank", 6, 1.3]],
    [["scout", 15, 0.35], ["walker", 20, 0.5], ["tank", 8, 1.0]],
    [["tank", 8, 1.0], ["hider", 10, 0.7], ["boss", 1, 0, 4500]],
  ],

  // Maps are 20 squares wide and 12 tall. The path goes through these corners.
  levels: {
    meadow: { name: "The Meadow", about: "A long, twisty path. A good place to start.",
              acornDropChance: 0.01,   // each robot you destroy here has this chance (0.01 = 1%) to drop a Golden Acorn
              waveCount: 10,           // the Meadow only plays the first 10 waves (it ends with the big Boss on wave 10)
              maxBossHealth: 1600,     // Bosses on the Meadow have at most this much health
              path: [[0, 2], [4, 2], [4, 8], [8, 8], [8, 3], [12, 3], [12, 9], [16, 9], [16, 5], [19, 5]],
              // Trees, mushrooms and tall grass: you can't build on these squares. [across, down]
              trees:     [[1, 6], [2, 10], [6, 0], [10, 6], [14, 1], [18, 10], [19, 0], [6, 11]],
              mushrooms: [[2, 5], [10, 10], [14, 6], [18, 2]],
              tallGrass: [[6, 4], [3, 8], [10, 1], [15, 11], [17, 7]] },
    forest: { name: "The Forest", acornDropChance: 0.02, about: "A shady trail through tall pines. Robots get through faster. Tree Giants attack 50% faster here.", theme: "forest",
              // 2% Golden Acorn chance per robot (after wave 5)
              // In the Forest, trees are tall pines, mushrooms are brown, and tall grass is ferns.
              towerBoosts: { plant: { speedTimes: 1.5 } },
              path: [[0, 6], [7, 6], [7, 2], [13, 2], [13, 9], [19, 9]],
              trees:     [[2, 2], [3, 3], [1, 9], [4, 10], [5, 1], [10, 5], [10, 6], [9, 0], [15, 2], [16, 3], [17, 6], [18, 11], [11, 11], [3, 8]],
              mushrooms: [[5, 8], [10, 9], [16, 7], [2, 0]],
              tallGrass: [[4, 4], [9, 4], [15, 10], [11, 1], [18, 4]] },
    swamp:  { name: "The Swamp", acornDropChance: 0.03, about: "Robots wade through murky water to the swamp treehouse. They're 50% tougher here, but frogs hit 25% harder.", theme: "swamp",
              // 3% Golden Acorn chance per robot (after wave 5)
              robotHealth: 1.5,   // every Robot on this level has this many times its normal health
              // Extra waves after the usual 15 (so The Swamp has 20). A group can mix robots: [["tank", "tank", "tesla"], 9, 1.3]
              // takes turns through the list. A number after the gap only changes Boss health (900 = a level 1 Boss).
              extraWaves: [
                [[["tank", "tank", "tesla"], 9, 1.3]],                                      // 16: Tesla Coils arrive with the Tanks
                [[["hider", "hider", "tesla"], 12, 0.8], ["boss", 1, 0, 900]],              // 17
                [[["tesla", "hider"], 12, 0.9], ["boss", 2, 3, 900]],                       // 18
                [["hider", 10, 0.6], [["boss", "tesla", "tesla"], 9, 1.4, 900]],             // 19
                [[["tesla", "hider", "tesla"], 15, 0.6], [["boss", "tesla"], 6, 1.8, 900]],  // 20: the big finish
              ],
              // Towers that are stronger on this level. Same kinds of boosts as upgrade choices.
              towerBoosts: { water: { damageTimes: 1.25 } },
              path: [[0, 10], [6, 10], [6, 6], [3, 6], [3, 2], [9, 2], [9, 8], [13, 8], [13, 3], [17, 3], [17, 7], [19, 7]],
              // In the Swamp, trees are mossy cypress trees, mushrooms glow, and tall grass is cattails.
              trees:     [[1, 1], [7, 0], [11, 5], [15, 10], [19, 1], [0, 6], [11, 11], [15, 5]],
              mushrooms: [[4, 8], [7, 4], [16, 0], [12, 10]],
              tallGrass: [[1, 4], [8, 9], [10, 0], [14, 6], [18, 10], [5, 0], [16, 5]] },
    beach:  { name: "The Beach", acornDropChance: 0.05, about: "Robots splash through the ocean to the sandy treehouse. They're 50% tougher here, but Crabs hit 50% harder and scores are worth 1.5x.", theme: "beach",
              // 5% Golden Acorn chance per robot (after wave 5)
              robotHealth: 1.5,   // every Robot on this level has this many times its normal health
              scoreTimes: 1.5,    // your score on this level is multiplied by this (on top of the difficulty's score bonus)
              // Towers that are stronger on this level: Crabs are at home on the beach.
              towerBoosts: { crab: { damageTimes: 1.5 } },
              path: [[0, 9], [5, 9], [5, 1], [9, 1], [9, 10], [14, 10], [14, 6], [11, 6], [11, 3], [17, 3], [17, 8], [19, 8]],
              // On the Beach, trees are palm trees, mushrooms are starfish and shells, and tall grass is dune grass.
              trees:     [[2, 5], [7, 4], [12, 8], [15, 1], [19, 4], [2, 11], [7, 11], [16, 11], [3, 1]],
              mushrooms: [[1, 2], [7, 7], [13, 4], [15, 8], [11, 11]],
              tallGrass: [[3, 6], [0, 0], [12, 0], [18, 5], [10, 8], [3, 11]],
              // The Beach has its own waves instead of the usual ones.
              waves: [
                [["scout", 6, 1.3]],                                                    // 1: speedy Scouts first
                [["clanker", 6, 1.0], ["scout", 5, 0.9]],                               // 2
                [["walker", 6, 1.2]],                                                   // 3
                [[["scout", "walker"], 10, 0.9]],                                       // 4
                [["hider", 3, 1.6], ["boss", 1, 0, 900]],                               // 5
                [["walker", 8, 0.9], ["splitter", 3, 2.0]],                             // 6: Junk Splitters arrive
                [["tank", 4, 1.8], [["scout", "scout", "walker"], 12, 0.5]],           // 7
                [[["walker", "walker", "repair"], 12, 0.8], ["hider", 4, 1.0]],        // 8: Repair Bots arrive
                [["tesla", 2, 2.0], ["tank", 5, 1.4]],                                  // 9: Tesla Coils!
                [[["walker", "tank"], 10, 1.0], ["boss", 1, 0, 2200]],                  // 10
                [[["scout", "hider"], 20, 0.4]],                                        // 11
                [[["tank", "tank", "tesla"], 12, 1.1]],                                 // 12
                [["hider", 10, 0.6], ["splitter", 4, 1.5], ["boss", 2, 4, 1500]],      // 13
                [[["walker", "tesla", "scout"], 18, 0.6], ["tank", 6, 1.0]],           // 14
                [[["tank", "hider", "tesla"], 18, 0.8], ["boss", 1, 0, 4500]],          // 15
              ],
              // 5 more waves after those, so The Beach has 20.
              extraWaves: [
                [[["tank", "repair"], 10, 1.2], ["splitter", 4, 1.5]],                  // 16
                [[["splitter", "tesla"], 10, 1.2], ["hider", 8, 0.6]],                  // 17
                [[["tank", "tank", "repair"], 12, 1.0], ["boss", 1, 0, 2200]],          // 18
                [[["splitter", "repair", "tesla"], 15, 0.8], ["boss", 2, 4, 1800]],     // 19
                [[["tank", "splitter", "repair", "tesla"], 20, 0.7], ["boss", 2, 3, 4500]],  // 20: the big finish
              ] },
    // A two-factory level: the left half is written here, and mirror: true copies the path, scenery and factory onto the right half.
    desert: { name: "The Desert", acornDropChance: 0.04, about: "Two factories! Robots march from both sides along twisty canyon roads to the oasis treehouse in the middle. Scores are worth 1.75x.", theme: "desert",
              // 4% Golden Acorn chance per robot (after wave 5)
              mirror: true,          // build a matching path and factory on the right side
              base: [9, 5],          // the treehouse sits in the middle (top-left square of its 2 x 2 spot)
              robotHealth: 0.85,     // robots have this many times their normal health (you must guard two roads, so they are a bit weaker)
              scoreTimes: 1.75,      // your score on this level is multiplied by this (on top of the difficulty's score bonus)
              path: [[0, 1], [3, 1], [3, 4], [1, 4], [1, 10], [4, 10], [4, 7], [6, 7], [6, 2], [8, 2], [8, 6], [9, 6]],
              // In the Desert, trees are cacti, mushrooms are boulders, and tall grass is tumbleweeds (left half; mirrored too).
              trees:     [[2, 6], [5, 0], [7, 10], [0, 11]],
              mushrooms: [[5, 4], [2, 2]],
              tallGrass: [[3, 8], [8, 11], [9, 1]],
              // The Desert has its own 20 waves. Robots take turns coming from the left and right factories.
              waves: [
                [["clanker", 6, 1.4]],                                                  // 1: an easy start
                [["clanker", 6, 1.1], ["scout", 3, 1.3]],                               // 2
                [["walker", 5, 1.4]],                                                   // 3
                [[["clanker", "scout"], 8, 1.1]],                                       // 4
                [["walker", 6, 1.1], ["hider", 2, 1.6]],                                // 5
                [["drone", 3, 2.0], ["walker", 6, 0.9]],                                // 6: Sky Drones arrive
                [[["scout", "scout", "drone"], 9, 0.8], ["tank", 2, 2.0]],             // 7
                [["walker", 6, 1.0], ["sandboss", 1, 0]],                               // 8: the Sand Golem rises!
                [[["drone", "hider"], 10, 0.8], ["tank", 3, 1.6]],                      // 9
                [["tesla", 2, 2.0], ["tank", 4, 1.4], ["boss", 1, 0, 2200]],            // 10
                [[["drone", "drone", "scout"], 12, 0.6]],                               // 11
                [["sandboss", 2, 6], ["walker", 8, 0.8]],                               // 12: one Golem from each side
                [[["splitter", "drone"], 10, 1.0], ["repair", 3, 1.5]],                 // 13
                [[["tank", "drone", "hider"], 15, 0.8]],                                // 14
                [["sandboss", 1, 0], ["boss", 1, 0, 3000], [["drone", "scout"], 10, 0.6]],  // 15
                [[["tank", "repair", "drone"], 15, 0.9]],                               // 16
                [[["tesla", "drone"], 12, 0.8], ["sandboss", 1, 0]],                    // 17
                [[["splitter", "hider", "drone"], 18, 0.6], ["boss", 2, 4, 2500]],      // 18
                [["sandboss", 2, 5], [["drone", "drone", "tesla"], 15, 0.6]],           // 19
                [[["tank", "drone", "repair", "tesla"], 20, 0.6], ["sandboss", 2, 5], ["boss", 1, 0, 4500]],  // 20: the big finish
              ] },
    pyramid: { name: "The Lost Pyramid", acornDropChance: 0.05, about: "Robots march around an ancient pyramid on an old stone road. Quicksand slows them down, and Mummy Bots unravel! Scores are worth 2x.", theme: "pyramid",
              // 5% Golden Acorn chance per robot (after wave 5)
              robotHealth: 1.4,      // robots have this many times their normal health (the quicksand helps you a lot)
              scoreTimes: 2,         // your score on this level is multiplied by this
              path: [[0, 10], [6, 10], [6, 1], [13, 1], [13, 8], [16, 8], [16, 3], [19, 3]],
              landmark: { kind: "pyramid", x: 8, y: 4, w: 4, h: 4 },   // the big pyramid (top-left square, width, height); nothing can be built on it
              quicksand: [[6, 6], [6, 7], [10, 1], [13, 5], [16, 6]],   // road squares with quicksand (robots move at half speed there)
              // In the Lost Pyramid, trees are broken columns, mushrooms are little obelisks, and tall grass is papyrus reeds.
              trees:     [[2, 3], [3, 7], [9, 9], [15, 11], [18, 9], [11, 11]],
              mushrooms: [[1, 1], [9, 2], [18, 5], [4, 5]],
              tallGrass: [[3, 0], [8, 11], [14, 4], [19, 11], [0, 7]],
              // The Lost Pyramid's own 20 waves.
              waves: [
                [["clanker", 8, 1.1]],                                                  // 1
                [["walker", 6, 1.1], ["scout", 4, 1.0]],                                // 2
                [["mummy", 3, 2.0], ["clanker", 6, 0.9]],                               // 3: Mummy Bots arrive
                [[["walker", "scout"], 10, 0.8]],                                       // 4
                [["mummy", 4, 1.6], ["boss", 1, 0, 1000]],                              // 5
                [["hider", 6, 1.0], ["walker", 6, 0.9]],                                // 6
                [[["mummy", "walker"], 10, 1.0]],                                       // 7
                [["tank", 4, 1.6], ["tesla", 2, 2.0]],                                  // 8
                [[["mummy", "hider"], 12, 0.8]],                                        // 9
                [[["tank", "mummy"], 10, 1.1], ["boss", 1, 0, 2200]],                   // 10
                [["splitter", 5, 1.4], ["repair", 3, 1.6], ["walker", 8, 0.7]],         // 11
                [[["mummy", "mummy", "tesla"], 12, 0.9]],                               // 12
                [["drone", 6, 1.0], [["tank", "hider"], 10, 0.9]],                      // 13
                [[["mummy", "repair", "walker"], 15, 0.7]],                             // 14
                [["sandboss", 1, 0], [["mummy", "scout"], 12, 0.6]],                    // 15
                [[["tank", "mummy", "tesla"], 15, 0.8]],                                // 16
                [[["hider", "drone", "mummy"], 15, 0.7], ["boss", 1, 0, 3000]],         // 17
                [[["splitter", "mummy", "repair"], 18, 0.6]],                           // 18
                [["sandboss", 2, 5], [["mummy", "drone"], 14, 0.6]],                    // 19
                [[["tank", "mummy", "repair", "tesla"], 20, 0.6], ["boss", 2, 4, 4000], ["sandboss", 1, 0]],  // 20: the big finish
              ] },

    // ---------------- THE LAVA LEVELS ----------------
    // Fire Dragons do 1.5 times damage on all three (towerBoosts). Lava-level robots: see the robots section.
    basalt: { name: "The Basalt Delta", acornDropChance: 0.05, about: "Tall basalt pillars and bubbling lava pools. Obsidian Shells, Lava Divers and the Pillar Titan! Fire Dragons do 1.5x damage. Scores are worth 2.25x.", theme: "basalt",
              robotHealth: 1.0,
              scoreTimes: 2.25,
              towerBoosts: { fire: { damageTimes: 1.5 } },
              path: [[0, 10], [2, 10], [2, 2], [7, 2], [7, 7], [12, 7], [12, 2], [17, 2], [17, 10], [19, 10]],
              // Trees are basalt pillars, mushrooms are lava pools, tall grass is obsidian rocks.
              trees:     [[4, 5], [9, 4], [14, 5], [10, 10], [5, 0], [19, 5], [0, 4]],
              mushrooms: [[4, 9], [15, 8], [10, 1], [19, 0]],
              tallGrass: [[1, 6], [9, 9], [14, 0], [6, 11], [18, 7]],
              waves: [
                [["magmasmall", 6, 1.3]],                                               // 1
                [["obsidian", 2, 2.5], ["magmasmall", 5, 1.0]],                         // 2: Obsidian Shells
                [["diver", 3, 1.8], ["magmasmall", 5, 1.0]],                            // 3: Lava Divers
                [["crawler", 3, 1.8], [["obsidian", "diver"], 4, 1.4]],                 // 4: Magma Crawlers
                [["emberbat", 4, 0.6], ["obsidian", 3, 1.8], ["crawler", 2, 1.5]],      // 5
                [[["crawler", "diver", "magmasmall"], 9, 1.1]],                         // 6
                [["fireproof", 5, 1.3], ["obsidian", 4, 1.5]],                          // 7
                [[["diver", "obsidian", "emberbat"], 12, 0.9]],                         // 8
                [["emberbat", 10, 0.4], [["crawler", "fireproof"], 8, 1.0]],            // 9
                [["pillartitan", 1, 0], [["obsidian", "diver"], 8, 1.0]],               // 10: the Pillar Titan
                [[["crawler", "crawler", "diver"], 15, 0.7]],                           // 11
                [["obsidian", 8, 1.0], ["emberbat", 8, 0.4]],                           // 12
                [[["fireproof", "diver", "obsidian"], 15, 0.8]],                        // 13
                [["pillartitan", 1, 0], ["emberbat", 10, 0.35], ["crawler", 6, 0.8]],   // 14
                [[["obsidian", "obsidian", "crawler"], 18, 0.7]],                       // 15
                [[["diver", "fireproof", "emberbat"], 18, 0.6]],                        // 16
                [["pillartitan", 2, 6], [["obsidian", "diver"], 12, 0.8]],              // 17
                [[["crawler", "obsidian", "diver", "emberbat"], 22, 0.55]],             // 18
                [["emberbat", 15, 0.3], [["fireproof", "obsidian"], 14, 0.7]],          // 19
                [["pillartitan", 1, 0], [["diver", "crawler", "obsidian"], 20, 0.55]],  // 20
                [[["obsidian", "fireproof", "diver", "crawler"], 24, 0.5]],             // 21
                [["pillartitan", 2, 5], ["emberbat", 12, 0.3], [["obsidian", "diver"], 14, 0.6]],   // 22
                [["pillartitan", 3, 6], [["obsidian", "diver", "crawler", "fireproof", "emberbat"], 30, 0.45]],   // 23: the big finish
              ] },
    magma: { name: "The Magma Fields", acornDropChance: 0.05, about: "Cracked magma ground with flames bursting out. Fire-Proof Bots, Magma Crawlers and the Magma Cube King! Fire Dragons do 1.5x damage. Scores are worth 2.5x.", theme: "magma",
              robotHealth: 1.1,
              scoreTimes: 2.5,
              towerBoosts: { fire: { damageTimes: 1.5 } },
              path: [[0, 2], [16, 2], [16, 6], [3, 6], [3, 10], [19, 10]],
              // Trees are magma rocks, mushrooms are flame vents, tall grass is obsidian rocks.
              trees:     [[1, 4], [8, 4], [12, 8], [18, 4], [7, 0], [14, 11]],
              mushrooms: [[5, 4], [15, 8], [11, 0], [1, 8]],
              tallGrass: [[19, 0], [9, 8], [6, 11], [17, 7], [0, 11]],
              waves: [
                [["magmasmall", 6, 1.2]],                                               // 1
                [["crawler", 3, 1.5], ["magmasmall", 4, 1.0]],                          // 2
                [["fireproof", 2, 2.0], ["magmasmall", 5, 1.0]],                        // 3: Fire-Proof Bots (use Frogs!)
                [[["magmasmall", "crawler"], 6, 1.1]],                                  // 4
                [["magmacube", 2, 2.4], ["emberbat", 5, 0.5]],                          // 5
                [["magmasmall", 6, 1.0], ["fireproof", 2, 1.8]],                        // 6
                [["obsidian", 3, 1.8], ["fireproof", 2, 1.6]],                          // 7
                [["magmacube", 3, 1.8], [["crawler", "emberbat"], 6, 1.0]],             // 8
                [[["fireproof", "fireproof", "crawler"], 14, 0.8]],                     // 9
                [["emberbat", 12, 0.35], ["magmacube", 4, 1.4]],                        // 10
                [[["crawler", "obsidian", "magmasmall"], 15, 0.7]],                     // 11
                [["magmaking", 1, 0], [["crawler", "fireproof"], 10, 0.9]],             // 12: the Magma Cube King
                [[["fireproof", "emberbat", "crawler"], 16, 0.6]],                      // 13
                [["magmacube", 6, 1.1], ["diver", 6, 1.0]],                             // 14
                [[["obsidian", "fireproof", "crawler"], 18, 0.65]],                     // 15
                [["emberbat", 16, 0.3], [["magmacube", "crawler"], 10, 0.9]],           // 16
                [["magmaking", 1, 0], [["fireproof", "diver"], 12, 0.8]],               // 17
                [[["crawler", "crawler", "fireproof", "emberbat"], 22, 0.5]],           // 18
                [["magmacube", 8, 0.9], [["obsidian", "fireproof"], 12, 0.7]],          // 19
                [["magmaking", 2, 6], [["crawler", "emberbat"], 14, 0.5]],              // 20
                [[["fireproof", "obsidian", "crawler", "diver"], 24, 0.5]],             // 21
                [["magmaking", 1, 0], ["emberbat", 14, 0.3], [["magmacube", "fireproof"], 12, 0.7]],   // 22
                [["magmaking", 3, 6], [["fireproof", "crawler", "obsidian", "emberbat", "magmacube"], 30, 0.45]],   // 23: the big finish
              ] },
    volcano: { name: "Inside the Volcano", acornDropChance: 0.07,   // 7% Golden Acorn chance per robot (after wave 5)
              about: "Deep inside the mountain, where lava bubbles up through the road. Every lava robot, and the Volcano Heart heals on the lava! Fire Dragons do 1.5x damage. Scores are worth 3x.", theme: "volcano",
              robotHealth: 1.35,
              scoreTimes: 3,
              towerBoosts: { fire: { damageTimes: 1.5 } },
              path: [[0, 5], [4, 5], [4, 8], [10, 8], [10, 3], [15, 3], [15, 6], [19, 6]],
              lava: [[5, 8], [8, 8], [10, 5], [13, 3], [15, 5]],   // road squares of glowing lava (the Volcano Heart heals on these)
              // Trees are stalagmites, mushrooms are flame vents, tall grass is obsidian rocks.
              trees:     [[1, 1], [7, 5], [12, 6], [17, 1], [3, 10], [17, 9]],
              mushrooms: [[7, 10], [12, 1], [1, 8], [18, 3]],
              tallGrass: [[5, 2], [13, 10], [9, 5], [0, 10], [19, 9]],
              waves: [
                [["magmasmall", 6, 1.2]],                                               // 1
                [["emberbat", 4, 0.7], ["magmasmall", 4, 1.0]],                         // 2
                [["obsidian", 2, 2.2], ["crawler", 2, 1.6]],                            // 3
                [[["diver", "magmasmall"], 6, 1.2]],                                    // 4
                [["magmacube", 3, 2.0], ["emberbat", 6, 0.5]],                          // 5
                [[["fireproof", "magmasmall", "emberbat"], 9, 0.9]],                    // 6
                [["magmacube", 3, 1.8], [["diver", "magmasmall"], 6, 1.1]],             // 7
                [["emberbat", 14, 0.3], ["obsidian", 5, 1.2]],                          // 8
                [[["fireproof", "diver", "crawler", "obsidian"], 16, 0.7]],             // 9
                [["magmaking", 1, 0], ["emberbat", 10, 0.35], ["fireproof", 6, 1.0]],   // 10
                [[["obsidian", "obsidian", "diver"], 16, 0.65]],                        // 11
                [["pillartitan", 1, 0], [["crawler", "emberbat"], 12, 0.6]],            // 12
                [[["fireproof", "magmacube", "diver"], 16, 0.7]],                       // 13
                [["pillartitan", 2, 6], ["emberbat", 14, 0.3]],                         // 14
                [[["crawler", "obsidian", "fireproof", "emberbat"], 22, 0.5]],          // 15
                [["magmaking", 2, 6], [["diver", "obsidian"], 14, 0.6]],                // 16
                [["emberbat", 22, 0.25], [["fireproof", "crawler"], 14, 0.6]],          // 17
                [["magmaking", 1, 0], ["pillartitan", 1, 0], [["obsidian", "diver"], 14, 0.6]],   // 18
                [[["fireproof", "obsidian", "diver", "crawler", "magmacube"], 26, 0.45]],   // 19
                [["magmaking", 1, 0], ["pillartitan", 1, 0], ["emberbat", 16, 0.3]],    // 20
                [[["obsidian", "fireproof", "diver", "crawler", "emberbat"], 30, 0.4]], // 21
                [["magmaking", 1, 0], ["pillartitan", 1, 0], [["obsidian", "magmacube", "fireproof"], 18, 0.5]],   // 22
                [["volcanoheart", 1, 0], ["magmaking", 1, 0], [["obsidian", "diver", "crawler", "fireproof", "emberbat"], 26, 0.45]],   // 23: the final battle (the Volcano Heart only appears here)
              ] },

    // ---------------- THE FROZEN TUNDRA ----------------
    tundra: { name: "The Frozen Tundra", acornDropChance: 0.06, about: "Deep snow and a frozen lake where robots slide faster. A castle sends out extra robots: tap it to overgrow it with plants! Scores are worth 3.25x.", theme: "tundra",
              robotHealth: 1.3,
              lateToughness: { fromWave: 12, perWave: 0.03 },   // after wave 12, robots get 3% tougher every wave (wave 25 = 1.39x)
              scoreTimes: 3.25,
              path: [[0, 4], [5, 4], [5, 9], [11, 9], [11, 2], [16, 2], [16, 7], [19, 7]],
              // The robots' castle: a second factory whose road joins the main road (this road ends where it meets it).
              extraPaths: [[[0, 8], [5, 8]]],
              castle: {
                every: 3,              // for every 3rd robot in a wave, the castle sends out an extra one (never a Boss)
                fromWave: 2,           // the castle starts sending extras on this wave
                overgrowCost: 150,     // leaves to overgrow the castle once
                overgrowSteps: 4,      // overgrow it this many times to cover it completely
                // each overgrow stops 1 out of every 4 castle extras; fully overgrown, the castle sends none
              },
              ice: [[6, 9], [8, 9], [10, 9], [11, 7], [11, 5]],   // icy road squares on the frozen lake: robots slide 1.4x faster
              iceSpeed: 1.4,
              lake: { x: 8.5, y: 8, w: 4.5, h: 3 },   // the frozen lake (center and size, in squares)
              // Trees are snowy pines, mushrooms are snowy rocks, tall grass is ice crystals.
              trees:     [[2, 1], [8, 1], [14, 5], [18, 10], [3, 11], [8, 5], [13, 10], [19, 1]],
              mushrooms: [[3, 6], [9, 11], [17, 4], [13, 0]],
              tallGrass: [[1, 10], [7, 3], [15, 10], [18, 3]],
              // The Frozen Tundra's own 25 waves, with the snow robots (the Blizzard King waits for Blizzard Peak).
              waves: [
                [["penguin", 6, 1.2]],                                                  // 1: Penguin Bots
                [["snowball", 2, 2.0], ["clanker", 5, 1.0]],                            // 2: Snowball Rollers
                [["penguin", 4, 1.1], ["walker", 2, 1.3]],                              // 3
                [["snowplow", 1, 0], ["snowball", 3, 1.6]],                             // 4: Snowplow Bots
                [["snowdrone", 2, 1.4], [["penguin", "walker"], 4, 1.2]],               // 5: Snow Drones
                [["snowball", 3, 1.4], ["penguin", 5, 1.0]],                            // 6
                [["boss", 1, 0, 1200], ["penguin", 6, 0.8]],                            // 7
                [[["snowplow", "hider", "snowball"], 9, 1.0]],                          // 8
                [[["snowdrone", "penguin"], 10, 0.8]],                                  // 9
                [["yetimech", 1, 0], ["snowball", 5, 1.0]],                             // 10: the Yeti Mech
                [["tank", 4, 1.4], ["snowdrone", 6, 0.7]],                              // 11
                [[["snowball", "snowball", "penguin"], 15, 0.6]],                       // 12
                [["yetimech", 1, 0], [["snowplow", "walker"], 10, 0.9]],                // 13
                [[["snowdrone", "tesla", "penguin"], 14, 0.7]],                         // 14
                [[["snowplow", "snowball", "repair"], 16, 0.7]],                        // 15
                [["glaciergolem", 1, 0], [["penguin", "snowdrone"], 12, 0.6]],          // 16: the Glacier Golem visits
                [[["snowplow", "tank", "snowball"], 16, 0.7]],                          // 17
                [["yetimech", 1, 0], ["boss", 1, 0, 3000], ["penguin", 12, 0.5]],       // 18
                [[["snowdrone", "snowball", "hider", "penguin"], 20, 0.55]],            // 19
                [["glaciergolem", 1, 0], ["yetimech", 1, 0], [["snowplow", "snowball"], 18, 0.5]],   // 20
                [[["snowplow", "penguin", "snowdrone", "tank"], 28, 0.45]],             // 21
                [["yetimech", 2, 8], [["snowball", "repair", "snowplow"], 18, 0.5]],     // 22
                [["yetimech", 1, 0], [["snowplow", "snowball", "snowdrone", "penguin", "tesla"], 32, 0.4]],   // 23
                [["glaciergolem", 1, 0], ["yetimech", 2, 8], [["penguin", "snowdrone", "snowplow"], 20, 0.45]],   // 24
                [["yetimech", 2, 8], ["glaciergolem", 2, 10], ["boss", 1, 0, 4500], [["snowplow", "snowball", "penguin", "snowdrone", "tank"], 40, 0.35]],   // 25: the big finish
              ] },
    glacier: { name: "The Glacier Caves", acornDropChance: 0.07, about: "Deep inside the glacier, robots slide along an icy walkway under hanging icicles. This is where the Glacier Golem lives! Scores are worth 3.5x.", theme: "glacier",
              robotHealth: 1.45,
              lateToughness: { fromWave: 10, perWave: 0.055 },  // after wave 10, robots get 5.5% tougher every wave (wave 25 = 1.83x)
              scoreTimes: 3.5,
              path: [[0, 10], [3, 10], [3, 6], [8, 6], [8, 1], [13, 1], [13, 10], [18, 10], [18, 4], [19, 4]],
              ice: [[13, 3], [13, 5], [13, 7], [15, 10]],   // extra-slippery squares on the walkway: robots slide 1.4x faster
              iceSpeed: 1.4,
              // Trees are ice stalagmites, mushrooms are glowing frost mushrooms, tall grass is ice crystals.
              trees:     [[1, 2], [6, 3], [10, 4], [16, 2], [1, 7], [6, 9], [11, 8], [16, 7]],
              mushrooms: [[5, 11], [10, 11], [15, 5], [2, 4]],
              tallGrass: [[0, 0], [11, 3], [16, 11], [5, 1]],
              // The Glacier Caves' own 25 waves: the Glacier Golem's home (the Blizzard King still waits for Blizzard Peak).
              waves: [
                [["penguin", 8, 1.0]],                                                  // 1
                [["snowball", 2, 1.8], ["penguin", 5, 0.9]],                            // 2
                [["snowplow", 1, 0], ["walker", 5, 1.0]],                               // 3
                [["snowdrone", 2, 1.4], ["penguin", 6, 1.0]],                           // 4
                [[["penguin", "snowball", "penguin"], 9, 1.0], ["snowplow", 1, 0]],     // 5
                [["glaciergolem", 1, 0, 1400], ["penguin", 6, 0.9]],                    // 6: a young Glacier Golem
                [[["snowdrone", "hider"], 10, 0.8]],                                    // 7
                [["snowplow", 4, 1.2], ["snowball", 6, 0.8]],                           // 8
                [["yetimech", 1, 0, 1800], [["penguin", "snowdrone"], 10, 0.8]],        // 9
                [["glaciergolem", 1, 0], [["snowball", "penguin"], 12, 0.7]],           // 10
                [[["snowplow", "tank", "tesla"], 12, 0.9]],                             // 11
                [[["snowdrone", "snowdrone", "penguin"], 16, 0.6]],                     // 12
                [["glaciergolem", 1, 0], ["yetimech", 1, 0, 2000], ["penguin", 10, 0.7]],   // 13
                [[["snowplow", "snowball", "repair"], 18, 0.6]],                        // 14
                [["boss", 1, 0, 3000], [["snowdrone", "hider", "penguin"], 16, 0.6]],   // 15
                [["glaciergolem", 2, 8], [["snowplow", "snowball"], 14, 0.6]],          // 16
                [[["tank", "snowplow", "tesla", "penguin"], 22, 0.5]],                  // 17
                [["yetimech", 2, 8], [["snowdrone", "penguin"], 18, 0.5]],              // 18
                [[["snowball", "snowball", "snowplow", "repair"], 24, 0.5]],            // 19
                [["glaciergolem", 2, 8], ["yetimech", 1, 0], [["penguin", "snowdrone", "snowplow"], 20, 0.5]],   // 20
                [[["snowplow", "penguin", "snowdrone", "tank", "hider"], 30, 0.42]],    // 21
                [["glaciergolem", 2, 8], [["snowball", "repair", "snowplow"], 22, 0.45]],   // 22
                [["yetimech", 2, 8], ["boss", 1, 0, 4500], [["snowplow", "snowball", "snowdrone", "penguin", "tesla"], 32, 0.4]],   // 23
                [["glaciergolem", 3, 9], [["penguin", "snowdrone", "snowplow"], 24, 0.42]],   // 24
                [["superglaciergolem", 1, 0], ["yetimech", 2, 8], [["snowplow", "snowball", "penguin", "snowdrone", "tank"], 44, 0.33]],   // 25: three Glacier Golems merge into the Super Glacier Golem!
              ] },
  },
};
/* ===================== end of PJ's settings ===================== */
