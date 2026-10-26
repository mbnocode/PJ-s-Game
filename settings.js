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
    crab:   { name: "Crab",        cost: 95,  range: 2.0, damage: 14, attacksPerSecond: 0.9, splash: 1,
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
              about: "Super Tower: shoots golden stars at 3 robots at once. Can see Hiders." },
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
    // Desert robots:
    // Sand Golem (a Boss): every sandstormEvery seconds, towers within sandstormRadius squares can't attack for sandstormSeconds.
    sandboss: { name: "Sand Golem", health: 1600, speed: 0.8, leaves: 150, points: 500, baseHit: 40, isBoss: true, sandstormEvery: 6, sandstormRadius: 2, sandstormSeconds: 2 },
    // Sky Drone flies straight to the treehouse instead of following the road. Only Owls, Dragons, the Pegasus and the
    // Wizard's Elemental Sphere can hit it. baseHit = how hard it hits your Base.
    drone:    { name: "Sky Drone", health: 45, speed: 2.8, leaves: 10, points: 30, flying: true, baseHit: 8 },
    boss:    { name: "Boss",    health: 900, speed: 0.9, leaves: 120, points: 400 },
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
  },
};
/* ===================== end of PJ's settings ===================== */
