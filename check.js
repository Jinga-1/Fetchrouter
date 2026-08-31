#!/usr/bin/env node
"use strict";
/* FetchRouter daily health check.
 *
 * Reads routers.json, probes each gateway's signup URL, and writes a `health`
 * field per router with { status, code, checkedAt }. Safe to re-run: if every
 * probe result is unchanged, the file is not touched and the process exits 0.
 *
 * Usage: node check.js [--timeout <seconds>] [--dry]
 */

const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "routers.json");
const DEFAULT_TIMEOUT = 12;
const STALE_AFTER_MS = 4 * 24 * 60 * 60 * 1000; // 4 days

const args = process.argv.slice(2);
const timeoutSec = (() => {
  const i = args.indexOf("--timeout");
  return i >= 0 ? parseFloat(args[i + 1]) || DEFAULT_TIMEOUT : DEFAULT_TIMEOUT;
})();
const dry = args.includes("--dry");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

function hostOf(url) {
  try {
    const u = new URL(url);
    return u.hostname;
  } catch (e) {
    return null;
  }
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutSec * 1000);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": UA, accept: "*/*" },
      signal: controller.signal,
    });
    return { ok: true, code: res.status };
  } catch (err) {
    const name = err && err.name;
    if (name === "AbortError") return { ok: false, code: null, reason: "timeout" };
    return { ok: false, code: null, reason: err && err.cause ? String(err.cause.code || err.cause) : name || "error" };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  if (!fs.existsSync(FILE)) {
    console.error("routers.json not found next to check.js");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  const routers = Array.isArray(data) ? data : data.routers || [];
  if (!routers.length) {
    console.error("no routers in routers.json");
    process.exit(1);
  }

  const now = new Date();
  const checkedAt = now.toISOString();
  let changed = false;

  const results = [];
  for (const r of routers) {
    const host = hostOf(r.baseUrl);
    if (!host) {
      console.log(`skip  ${r.name.padEnd(16)} no valid baseUrl`);
      continue;
    }
    const res = await probe(r.baseUrl);
    const status = res.ok ? "up" : "down";
    const prev = r.health || {};

    // Only touch the file when the verdict actually changes or the stamp moves a day.
    const dayStamp = checkedAt.slice(0, 10);
    const prevDay = prev.checkedAt ? prev.checkedAt.slice(0, 10) : "";
    const same = prev.status === status && prev.code === res.code && prevDay === dayStamp;
    if (!same) changed = true;

    const health = {
      status,
      code: res.code,
      checkedAt,
      ...(res.reason ? { reason: res.reason } : {}),
    };
    r.health = health;
    results.push({ name: r.name, status, code: res.code, reason: res.reason, prev: prev.status });

    const dot = status === "up" ? "\u2713" : "\u2717";
    const note = res.reason ? ` (${res.reason})` : "";
    console.log(`${dot} ${r.name.padEnd(16)} ${status.toUpperCase().padEnd(5)} ${res.code ?? "—"}${note}`);
  }

  const up = results.filter(x => x.status === "up").length;
  const down = results.length - up;
  console.log(`\n${up}/${results.length} up, ${down} down, checked ${checkedAt}`);

  if (dry) {
    console.log("--dry: not writing");
    process.exit(0);
  }
  if (!changed) {
    console.log("no change — routers.json left untouched");
    process.exit(0);
  }

  data.lastChecked = checkedAt.slice(0, 10);
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("wrote routers.json");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
