import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
const base = process.env.TEST_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 400 && r.url().startsWith(base))
    errors.push(`${r.status()} ${r.url()}`);
});
const visit = async (path) => {
  const r = await page.goto(new URL(path, base).href);
  assert.equal(r.status(), 200, path);
  await page.locator("h1").waitFor();
};
const checkLayout = async () =>
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    "no horizontal overflow",
  );
const images = async () => {
  for (const img of await page.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((el) => el.decode());
    assert.ok(await img.evaluate((el) => el.naturalWidth > 0));
  }
};
try {
  await visit("");
  assert.equal(await page.locator(".city-card").count(), 5);
  await images();
  await checkLayout();
  if (process.env.QA_SCREENSHOTS) {
    mkdirSync(process.env.QA_SCREENSHOTS, { recursive: true });
    await page.screenshot({
      path: `${process.env.QA_SCREENSHOTS}/home-desktop.png`,
      fullPage: true,
    });
  }
  await visit("explore.html");
  assert.equal(await page.locator(".city-card").count(), 5);
  await page.getByLabel("搜尋城市或國家").fill("東京");
  assert.equal(await page.locator(".city-card").count(), 1);
  await page.getByLabel("洲別", { exact: true }).selectOption("Europe");
  assert.equal(await page.locator(".city-card").count(), 0);
  assert.ok(await page.locator("#empty").isVisible());
  await page.getByRole("button", { name: "清除篩選", exact: true }).click();
  assert.equal(await page.locator(".city-card").count(), 5);
  for (const [query, slug] of [
    ["PARIS", "paris"],
    ["USA", "new-york"],
    ["日本", "tokyo"],
  ]) {
    await page.locator("#search").fill(query);
    assert.equal(await page.locator(".city-card").count(), 1);
    assert.ok(
      (await page.locator(".city-card a").getAttribute("href")).endsWith(
        `slug=${slug}`,
      ),
    );
  }
  await page.locator("form").evaluate((f) => f.reset());
  await page.locator("#continent").selectOption("Oceania");
  assert.equal(await page.locator(".city-card").count(), 1);
  for (const slug of ["tokyo", "paris", "new-york", "sydney", "cape-town"]) {
    await visit(`city.html?slug=${slug}`);
    await page.reload();
    await page.locator(".detail-hero").waitFor();
    assert.equal(await page.locator(".notes-grid article").count(), 9);
    await images();
    await checkLayout();
  }
  await visit("city.html?slug=invalid");
  assert.ok(
    await page.getByText("找不到這座城市", { exact: false }).isVisible(),
  );
  await visit("city.html");
  assert.equal(await page.locator("h1").count(), 1);
  await visit("about.html");
  assert.equal(await page.locator("h1").count(), 1);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    "",
    "explore.html",
    "about.html",
    ...["tokyo", "paris", "new-york", "sydney", "cape-town"].map(
      (s) => `city.html?slug=${s}`,
    ),
  ]) {
    await visit(path);
    await checkLayout();
    assert.equal(await page.locator("nav a:visible").count(), 3);
  }
  await visit("");
  await images();
  await page.evaluate(() => scrollTo(0, 0));
  if (process.env.QA_SCREENSHOTS)
    await page.screenshot({
      path: `${process.env.QA_SCREENSHOTS}/home-mobile.png`,
      fullPage: true,
    });
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.className),
    "skip",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  assert.deepEqual(errors, []);
  console.log(
    `PASS browser: ${base}; four pages, five cities/reload, bilingual/country search, combined filter, reset/empty, invalid slug, images, 390px responsive, skip link, reduced motion, no runtime/HTTP errors.`,
  );
} finally {
  await browser.close();
}
