import { randomUUID } from "crypto";
import {
  AGENTS,
  WEAPONS,
  MAPS,
  SPRAYS,
  BUDDIES,
  CARDS,
  TITLES,
  allSkins,
} from "../data/catalog.js";

function uuid() {
  try {
    return randomUUID();
  } catch {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

/**
 * Generate a full Ascent-style player profile (everything unlocked).
 * @param {object} opts
 * @param {string} [opts.name]
 * @param {string} [opts.tag]
 * @param {string} [opts.puuid]
 * @param {string} [opts.mainAgent]
 * @param {number} [opts.level]
 * @param {string} [opts.title]
 */
export function generateProfile(opts = {}) {
  const name = opts.name || "Agent";
  const tag = (opts.tag || "ASC").toUpperCase().slice(0, 5);
  const puuid = opts.puuid || uuid();
  const mainAgent = opts.mainAgent || "Jett";
  const level = opts.level ?? 400;
  const title = opts.title || TITLES[0];
  const now = new Date().toISOString();

  const agents = AGENTS.map((agent) => ({
    id: agent,
    unlocked: true,
    level: 50,
    equipped: agent === mainAgent,
  }));

  const skins = allSkins();
  const loadout = {};
  for (const weapon of WEAPONS) {
    const skin = skins.find((s) => s.weapon === weapon && s.tier === "Standard");
    loadout[weapon] = {
      skin_id: skin?.id || null,
      buddy_id: BUDDIES[0],
      charm_id: null,
    };
  }

  return {
    schema: "ascent.profile.v1",
    generated_at: now,
    puuid,
    name,
    tag,
    game_name: `${name}#${tag}`,
    title,
    level,
    xp: level * 1000,
    rank: {
      current: "Platinum",
      tier: 2,
      rr: 50,
      peak: "Diamond 1",
    },
    inventory: {
      agents,
      skins,
      sprays: SPRAYS.map((id) => ({ id, unlocked: true })),
      buddies: BUDDIES.map((id) => ({ id, unlocked: true })),
      cards: CARDS.map((id) => ({ id, unlocked: true })),
      titles: TITLES.map((t) => ({ id: t, unlocked: true })),
      currency: {
        vp: 99999,
        radianite: 9999,
        kingdom_credits: 99999,
      },
    },
    loadout,
    identity: {
      card_id: CARDS[0],
      title_id: title,
      preferred_agent: mainAgent,
    },
    maps_unlocked: MAPS.slice(),
    flags: {
      everything_unlocked: true,
      battlepass_complete: true,
      tutorial_complete: true,
    },
    meta: {
      source: "ascent-profile-gen",
      note: "Private server profile payload — not a Riot account",
    },
  };
}

/**
 * Minimal player doc shape used by some Ascent backend routes.
 */
export function generateBackendUser(opts = {}) {
  const profile = generateProfile(opts);
  return {
    puuid: profile.puuid,
    name: profile.name,
    tag: profile.tag,
    level: profile.level,
    title: profile.title,
    online: false,
    banned: false,
    inventory: profile.inventory,
    loadout: profile.loadout,
    identity: profile.identity,
    created_at: profile.generated_at,
    updated_at: profile.generated_at,
  };
}

export function generateMany(count, base = {}) {
  const n = Math.max(1, Number(count) || 1);
  return Array.from({ length: n }, (_, i) =>
    generateProfile({
      ...base,
      name: base.name ? `${base.name}${i || ""}` : `Agent${i + 1}`,
      puuid: undefined,
    })
  );
}
