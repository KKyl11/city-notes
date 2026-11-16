import assert from "node:assert/strict";
import { readFileSync, writeFileSync, unlinkSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { root, validateCity, validateAll } from "./validate-cities.mjs";
import { filterCities } from "../src/utils/search.js";
const run = (...args) => {
  const p = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });
  assert.equal(p.status, 0, args.join(" "));
};
const cities = readdirSync(resolve(root, "src/data/cities"))
  .filter((x) => x.endsWith(".json"))
  .map((f) =>
    JSON.parse(readFileSync(resolve(root, "src/data/cities", f), "utf8")),
  );
assert.equal(validateAll().errors.length, 0);
assert.equal(filterCities(cities, "東京")[0].slug, "tokyo");
assert.equal(filterCities(cities, "PARIS", "Europe").length, 1);
assert.equal(filterCities(cities, "日本", "Europe").length, 0);
assert.equal(filterCities(cities, "USA").length, 1);
assert.equal(filterCities(cities, "no-such-city").length, 0);
assert.equal(filterCities(cities, "").length, cities.length);
const broken = structuredClone(cities[0]);
broken.attractions = [];
broken.heroImage.src = "images/missing.webp";
broken.sources[0].url = "http://example.com";
broken.continent = "invalid";
assert.ok(validateCity(broken, `${broken.slug}.json`).length >= 4);
assert.ok(validateCity({}, "broken.json").length > 0);
console.log(
  "PASS: search, combined filters, empty/reset, validator rejects malformed content.",
);
const fixture = structuredClone(cities[0]);
fixture.slug = "extension-fixture";
fixture.name = { zh: "測試城市勿發布", en: "Extension Fixture" };
fixture.continent = "South America";
fixture.heroImage.src = "images/extension-fixture/hero.webp";
fixture.gallery[0].src = "images/extension-fixture/gallery-01.webp";
// Fixture reuses licensed bytes only for temporary integration testing.
const fs = await import("node:fs");
const imageDir = resolve(root, "public/images/extension-fixture"),
  file = resolve(root, "src/data/cities/extension-fixture.json");
assert.ok(
  !fs.existsSync(file) && !fs.existsSync(imageDir),
  "refuse to overwrite existing fixture",
);
fs.mkdirSync(imageDir);
try {
  fs.copyFileSync(
    resolve(root, "public", cities[0].heroImage.src),
    resolve(imageDir, "hero.webp"),
  );
  fs.copyFileSync(
    resolve(root, "public", cities[0].gallery[0].src),
    resolve(imageDir, "gallery-01.webp"),
  );
  writeFileSync(file, JSON.stringify(fixture));
  assert.equal(validateAll().errors.length, 0);
  assert.equal(
    filterCities([...cities, fixture], "Fixture", "South America").length,
    1,
  );
  run("scripts/validate-cities.mjs");
  run("node_modules/vite/bin/vite.js", "build");
  const chunks = readdirSync(resolve(root, "dist/assets"))
    .filter((f) => f.endsWith(".js"))
    .map((f) => readFileSync(resolve(root, "dist/assets", f), "utf8"))
    .join("");
  assert.ok(chunks.includes("Extension Fixture"));
  console.log(
    "PASS: sixth fixture auto-discovered in production bundle without UI changes.",
  );
} finally {
  if (fs.existsSync(file)) unlinkSync(file);
  for (const name of ["hero.webp", "gallery-01.webp"]) {
    const p = resolve(imageDir, name);
    if (fs.existsSync(p)) unlinkSync(p);
  }
  fs.rmdirSync(imageDir);
}
run("scripts/validate-cities.mjs");
run("node_modules/vite/bin/vite.js", "build");
console.log("PASS: fixture removed; final release rebuilt.");
