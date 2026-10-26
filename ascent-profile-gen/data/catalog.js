/** Static catalog used to build "everything unlocked" profiles */

export const AGENTS = [
  "Jett", "Reyna", "Phoenix", "Raze", "Yoru", "Neon", "Iso", "Waylay",
  "Sage", "Killjoy", "Cypher", "Chamber", "Deadlock", "Vyse",
  "Sova", "Breach", "Skye", "KAY/O", "Fade", "Gekko", "Tejo",
  "Omen", "Brimstone", "Viper", "Astra", "Harbor", "Clove",
];

export const WEAPONS = [
  "Classic", "Shorty", "Frenzy", "Ghost", "Sheriff",
  "Stinger", "Spectre",
  "Bucky", "Judge",
  "Bulldog", "Guardian", "Phantom", "Vandal",
  "Marshal", "Operator", "Outlaw",
  "Ares", "Odin",
  "Melee",
];

export const SKIN_TIERS = ["Select", "Deluxe", "Premium", "Exclusive", "Ultra"];

export const MAPS = [
  "Ascent", "Bind", "Haven", "Split", "Lotus", "Pearl",
  "Icebox", "Breeze", "Fracture", "Sunset", "Abyss",
];

export const SPRAYS = Array.from({ length: 40 }, (_, i) => `Spray_${i + 1}`);
export const BUDDIES = Array.from({ length: 25 }, (_, i) => `Buddy_${i + 1}`);
export const CARDS = Array.from({ length: 30 }, (_, i) => `Card_${i + 1}`);
export const TITLES = [
  "THE HUNTER", "RISING STAR", "UNSTOPPABLE", "SHARPSHOOTER",
  "TACTICIAN", "RADIANT HOPEFUL", "FIRST BLOOD", "CLUTCH",
];

export function skinId(weapon, tier, index) {
  return `${weapon}_${tier}_${index}`.replace(/\s+/g, "");
}

/** Build a full skin list per weapon */
export function allSkins() {
  const out = [];
  for (const weapon of WEAPONS) {
    out.push({
      id: skinId(weapon, "Standard", 0),
      weapon,
      name: `${weapon} Standard`,
      tier: "Standard",
      unlocked: true,
    });
    SKIN_TIERS.forEach((tier, ti) => {
      for (let i = 1; i <= 3; i++) {
        out.push({
          id: skinId(weapon, tier, i + ti * 3),
          weapon,
          name: `${weapon} ${tier} ${i}`,
          tier,
          unlocked: true,
        });
      }
    });
  }
  return out;
}
