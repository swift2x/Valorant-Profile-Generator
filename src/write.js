import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { generateRoutePayloads, generateMany } from "./generate.js";

export function writeProfileBundle(opts = {}, outDir = "json") {
  mkdirSync(outDir, { recursive: true });
  const bundle = generateRoutePayloads(opts);
  const safe = `${bundle.profile.name}_${bundle.profile.tag}`.replace(/[^\w.-]+/g, "_");
  const base = join(outDir, safe);
  mkdirSync(base, { recursive: true });

  writeFileSync(join(base, "profile.json"), JSON.stringify(bundle.profile, null, 2));
  writeFileSync(join(base, "user.json"), JSON.stringify(bundle.user, null, 2));

  const routesDir = join(base, "routes");
  mkdirSync(routesDir, { recursive: true });
  for (const [name, payload] of Object.entries(bundle.routes)) {
    writeFileSync(join(routesDir, `${name}.json`), JSON.stringify(payload, null, 2));
  }

  writeFileSync(join(base, "index.json"), JSON.stringify({
    name: bundle.profile.name,
    tag: bundle.profile.tag,
    puuid: bundle.profile.puuid,
    files: {
      profile: "profile.json",
      user: "user.json",
      routes: Object.keys(bundle.routes).map((k) => `routes/${k}.json`),
    },
  }, null, 2));

  return base;
}

export function writeMany(count, baseOpts = {}, outDir = "json") {
  const profiles = generateMany(count, baseOpts);
  const dirs = [];
  for (const p of profiles) {
    dirs.push(writeProfileBundle({
      name: p.name,
      tag: p.tag,
      mainAgent: p.identity?.preferred_agent,
      level: p.level,
      title: p.title,
      puuid: p.puuid,
    }, outDir));
  }
  writeFileSync(join(outDir, "manifest.json"), JSON.stringify({
    count: dirs.length,
    profiles: dirs.map((d) => d.replace(/\\/g, "/")),
  }, null, 2));
  return dirs;
}
