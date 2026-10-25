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
    hard:      { name: "Hard",      robotHealth: 1.35, robotSpeed: 1.12, startLeaves: 165, scoreTimes: 2,   baseHealsPerWave: 0, auraChance: 0.25, strongestAura: 3 },
    nightmare: { name: "Nightmare", robotHealth: 1.9,  robotSpeed: 1.3,  startLeaves: 150, scoreTimes: 3,   baseHealsPerWave: 0, auraChance: 0.4,  strongestAura: 3 },
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
              about: "Helper: nearby Towers attack faster." },
    healer: { name: "Healer Deer", cost: 300, healPerWave: 1,
              about: "Heals your Base after every Wave." },
    squirrel: { name: "Squirrel", cost: 120, leavesPerWave: 10, leavesPerUpgrade: 5,
              about: "Gathers Maple Leaves for you after every Wave." },
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
    boss:    { name: "Boss",    health: 900, speed: 0.9, leaves: 120, points: 400 },
  },

  // ---------------- PERMANENT UPGRADES ----------------
  // Every game earns Golden Acorns for the save slot: 1 for each Wave you get through,
  // plus this many for every star when you win. Spend them on the Upgrades page.
  acornsPerStar: 5,
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
              path: [[0, 2], [4, 2], [4, 8], [8, 8], [8, 3], [12, 3], [12, 9], [16, 9], [16, 5], [19, 5]],
              // Trees, mushrooms and tall grass: you can't build on these squares. [across, down]
              trees:     [[1, 6], [2, 10], [6, 0], [10, 6], [14, 1], [18, 10], [19, 0], [6, 11]],
              mushrooms: [[2, 5], [10, 10], [14, 6], [18, 2]],
              tallGrass: [[6, 4], [3, 8], [10, 1], [15, 11], [17, 7]] },
    forest: { name: "The Forest", about: "A straighter path. Robots get through faster. Tree Giants attack 50% faster here.",
              towerBoosts: { plant: { speedTimes: 1.5 } },
              path: [[0, 6], [7, 6], [7, 2], [13, 2], [13, 9], [19, 9]],
              trees:     [[2, 2], [3, 3], [1, 9], [4, 10], [5, 1], [10, 5], [10, 6], [9, 0], [15, 2], [16, 3], [17, 6], [18, 11], [11, 11], [3, 8]],
              mushrooms: [[5, 8], [10, 9], [16, 7], [2, 0]],
              tallGrass: [[4, 4], [9, 4], [15, 10], [11, 1], [18, 4]] },
    swamp:  { name: "The Swamp", about: "Robots wade through murky water to the swamp treehouse. They're 50% tougher here, but frogs hit 25% harder.", theme: "swamp",
              robotHealth: 1.5,   // every Robot on this level has this many times its normal health
              // Towers that are stronger on this level. Same kinds of boosts as upgrade choices.
              towerBoosts: { water: { damageTimes: 1.25 } },
              path: [[0, 10], [6, 10], [6, 6], [3, 6], [3, 2], [9, 2], [9, 8], [13, 8], [13, 3], [17, 3], [17, 7], [19, 7]],
              // In the Swamp, trees are mossy cypress trees, mushrooms glow, and tall grass is cattails.
              trees:     [[1, 1], [7, 0], [11, 5], [15, 10], [19, 1], [0, 6], [11, 11], [15, 5]],
              mushrooms: [[4, 8], [7, 4], [16, 0], [12, 10]],
              tallGrass: [[1, 4], [8, 9], [10, 0], [14, 6], [18, 10], [5, 0], [16, 5]] },
  },
};
/* ===================== end of PJ's settings ===================== */
