#!/usr/bin/env node
import { writeFileSync } from "fs";
import { generateProfile, generateBackendUser, generateMany } from "./generate.js";

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i === -1) return fallback;
  return process.argv[i + 1] ?? fallback;
}

function has(flag) {
  return process.argv.includes(flag);
}

if (has("--help") || has("-h")) {
  console.log(`ascent-profile-gen

Usage:
  node src/cli.js [options]

Options:
  --name <str>       Player name (default Agent)
  --tag <str>        Tagline (default ASC)
  --agent <str>      Main agent (default Jett)
  --level <n>        Account level (default 400)
  --title <str>      Player title
  --count <n>        Generate N profiles (default 1)
  --backend          Emit backend user doc shape
  --out <file>       Write JSON to file
  --pretty           Pretty-print (default on)
`);
  process.exit(0);
}

const opts = {
  name: arg("--name", "Agent"),
  tag: arg("--tag", "ASC"),
  mainAgent: arg("--agent", "Jett"),
  level: Number(arg("--level", "400")),
  title: arg("--title", undefined),
};

const count = Number(arg("--count", "1"));
const backend = has("--backend");
const out = arg("--out", "");

let data;
if (count > 1) {
  data = generateMany(count, opts);
  if (backend) data = data.map((p) => generateBackendUser(p));
} else {
  data = backend ? generateBackendUser(opts) : generateProfile(opts);
}

const json = JSON.stringify(data, null, 2);
if (out) {
  writeFileSync(out, json, "utf8");
  console.error(`wrote ${out}`);
} else {
  console.log(json);
}
