#!/usr/bin/env node
import { writeProfileBundle, writeMany } from "./write.js";

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i === -1) return fallback;
  return process.argv[i + 1] ?? fallback;
}

function has(flag) {
  return process.argv.includes(flag);
}

if (has("--help") || has("-h")) {
  console.log(`node src/cli.js --name Swift --tag ASC
  --agent Fade --level 400 --count 1 --out json`);
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
const outDir = arg("--out", "json");

if (count > 1) {
  const dirs = writeMany(count, opts, outDir);
  console.log(`wrote ${dirs.length} profiles into ${outDir}/`);
} else {
  const dir = writeProfileBundle(opts, outDir);
  console.log(`wrote ${dir}`);
}
