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

export function generateProfile(opts = {}) {
  const name = opts.name || "Agent";
  const tag = (opts.tag || "ASC").toUpperCase().slice(0, 5);
  const puuid = opts.puuid || uuid();
  const mainAgent = opts.mainAgent || "Jett";
  const level = opts.level ?? 400;
  const title = opts.title || TITLES[0];
  const now = new Date().toISOString();
  const skins = allSkins();

  const agents = AGENTS.map((agent) => ({
    id: agent,
    unlocked: true,
    level: 50,
    equipped: agent === mainAgent,
  }));

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
    },
  };
}

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

export function generateRoutePayloads(opts = {}) {
  const profile = generateProfile(opts);
  const user = generateBackendUser(opts);
  const puuid = profile.puuid;
  const token = Buffer.from(JSON.stringify({ sub: puuid, name: profile.name })).toString("base64url");

  return {
    profile,
    user,
    routes: {
      "GET_v1_users_me": user,
      "GET_v1_profiles_me": profile,
      "GET_v1_profiles_puuid": profile,
      "GET_v1_inventory": profile.inventory,
      "GET_v1_inventory_agents": profile.inventory.agents,
      "GET_v1_inventory_skins": profile.inventory.skins,
      "GET_v1_loadouts": profile.loadout,
      "GET_v1_loadouts_current": profile.loadout,
      "GET_v1_player": {
        puuid,
        name: profile.name,
        tag: profile.tag,
        level: profile.level,
        title: profile.title,
        identity: profile.identity,
        rank: profile.rank,
      },
      "GET_v1_player_mmr": profile.rank,
      "GET_v1_player_loadout": profile.loadout,
      "GET_v1_entitlements": {
        puuid,
        entitlements: profile.inventory.skins.map((s) => s.id),
        agents: AGENTS.slice(),
        cards: CARDS.slice(),
        sprays: SPRAYS.slice(),
        buddies: BUDDIES.slice(),
      },
      "GET_v1_catalog_agents": AGENTS.map((id) => ({ id, unlocked: true })),
      "GET_v1_catalog_weapons": WEAPONS.map((id) => ({ id })),
      "GET_v1_catalog_maps": MAPS.map((id) => ({ id, unlocked: true })),
      "GET_v1_party_me": {
        party_id: uuid(),
        leader: puuid,
        members: [{ puuid, name: profile.name, tag: profile.tag, ready: false }],
        state: "DEFAULT",
        queue_id: null,
      },
      "GET_v1_matchmaking_status": {
        in_queue: false,
        queue_id: null,
        eta: null,
      },
      "GET_v1_matches_history": {
        puuid,
        matches: [],
      },
      "GET_v1_friends": {
        puuid,
        friends: [],
      },
      "GET_v1_presence": {
        puuid,
        state: "menu",
        party_id: null,
        match_id: null,
      },
      "GET_v1_voice_token": {
        token: `vivox-${puuid}`,
        issuer: "ascent",
        expires: Date.now() + 3600000,
      },
      "GET_v1_auth_me": {
        access_token: token,
        token_type: "Bearer",
        user,
      },
      "POST_v1_auth_login": {
        access_token: token,
        token_type: "Bearer",
        user,
      },
      "POST_v1_players_ready": {
        ok: true,
        puuid,
        ready: true,
      },
      "GET_v1_local_status": {
        rnet: { running: true, port: 21000 },
        region: "na",
      },
    },
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
