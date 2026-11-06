import assert from "node:assert/strict";
import test from "node:test";
import {
  appendSnapshot, formatBytes, formatPercent, relativeTime, sparklinePoints,
  unusedIndexes, usageLevel, visibleTables,
} from "../src/apps/db-dashboard/dashboard-utils.js";

const tables = [
  { name: "hockey_game", group: "Hockey Lab", total_bytes: 900, rows: 5, index_bytes: 10, dead_rows: 0 },
  { name: "lg_card", group: "Little Grains", total_bytes: 1500, rows: 2, index_bytes: 30, dead_rows: 9 },
  { name: "auth_user", group: "Accounts", total_bytes: 100, rows: 40, index_bytes: 5, dead_rows: 1 },
];

test("formatBytes scales units", () => {
  assert.equal(formatBytes(0), "0 B");
  assert.equal(formatBytes(2048), "2.00 KB");
  assert.equal(formatBytes(25419776), "24.2 MB");
  assert.equal(formatBytes(null), "–");
});

test("formatPercent and usageLevel", () => {
  assert.equal(formatPercent(0.0508), "5.1%");
  assert.equal(usageLevel(null), "none");
  assert.equal(usageLevel(0.5), "ok");
  assert.equal(usageLevel(0.75), "warning");
  assert.equal(usageLevel(0.95), "critical");
});

test("relativeTime", () => {
  const now = Date.parse("2026-11-06T12:00:00Z");
  assert.equal(relativeTime(null, now), "never");
  assert.equal(relativeTime("2026-11-06T11:59:50Z", now), "just now");
  assert.equal(relativeTime("2026-11-06T11:30:00Z", now), "30 min ago");
  assert.equal(relativeTime("2026-11-06T09:00:00Z", now), "3 h ago");
  assert.equal(relativeTime("2026-11-04T12:00:00Z", now), "2 d ago");
});

test("visibleTables sorts, filters by group and searches", () => {
  assert.deepEqual(visibleTables(tables).map((t) => t.name), ["lg_card", "hockey_game", "auth_user"]);
  assert.deepEqual(visibleTables(tables, { sort: "rows" }).map((t) => t.name), ["auth_user", "hockey_game", "lg_card"]);
  assert.deepEqual(visibleTables(tables, { sort: "name" }).map((t) => t.name), ["auth_user", "hockey_game", "lg_card"]);
  assert.deepEqual(visibleTables(tables, { group: "Accounts" }).map((t) => t.name), ["auth_user"]);
  assert.deepEqual(visibleTables(tables, { query: " HOCKEY " }).map((t) => t.name), ["hockey_game"]);
});

test("unusedIndexes ignores constraint indexes", () => {
  const found = unusedIndexes([
    { name: "a", scans: 0, unique: false, primary: false },
    { name: "b", scans: 0, unique: true, primary: false },
    { name: "c", scans: 0, unique: false, primary: true },
    { name: "d", scans: 4, unique: false, primary: false },
  ]);
  assert.deepEqual(found.map((i) => i.name), ["a"]);
});

test("appendSnapshot replaces points that are too close and caps length", () => {
  const first = appendSnapshot([], { t: 0, bytes: 1 });
  assert.equal(appendSnapshot(first, { t: 1000, bytes: 2 }).length, 1);
  assert.equal(appendSnapshot(first, { t: 1000, bytes: 2 })[0].bytes, 2);
  assert.equal(appendSnapshot(first, { t: 11 * 60 * 1000, bytes: 2 }).length, 2);
  let history = [];
  for (let i = 0; i < 200; i += 1) history = appendSnapshot(history, { t: i * 3600000, bytes: i });
  assert.equal(history.length, 120);
});

test("sparklinePoints needs two points and stays inside the box", () => {
  assert.equal(sparklinePoints([{ t: 0, bytes: 1 }], 100, 40), "");
  const points = sparklinePoints([{ t: 0, bytes: 1 }, { t: 10, bytes: 5 }], 100, 40).split(" ");
  assert.equal(points.length, 2);
  assert.equal(points[0], "4.0,36.0");
  assert.equal(points[1], "96.0,4.0");
});
