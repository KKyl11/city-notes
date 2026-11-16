import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";
import { pathToFileURL } from "node:url";
export const root = resolve(import.meta.dirname, "..");
export function validateCity(city, filename, { checkFiles = true } = {}) {
  const errors = [],
    fail = (field, why) => errors.push(`${filename}: ${field}: ${why}`);
  const object = (value, keys, field) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      fail(field, "must be an object");
      return false;
    }
    for (const k of keys) if (!(k in value)) fail(`${field}.${k}`, "required");
    for (const k of Object.keys(value))
      if (!keys.includes(k)) fail(`${field}.${k}`, "unknown field");
    return true;
  };
  const string = (value, field) => {
    if (typeof value !== "string" || !value.trim())
      fail(field, "must be a non-empty string");
  };
  const url = (value, field) => {
    string(value, field);
    try {
      const u = new URL(value);
      if (
        u.protocol !== "https:" ||
        !u.hostname.includes(".") ||
        u.username ||
        u.password ||
        /(^|\.)example\.(com|org|net)$/.test(u.hostname)
      )
        throw Error();
    } catch {
      fail(field, "must be a real-source HTTPS URL (format check only)");
    }
  };
  const array = (value, min, field, visit) => {
    if (!Array.isArray(value)) return fail(field, "must be an array");
    if (value.length < min) fail(field, `requires at least ${min} entries`);
    value.forEach((entry, i) => visit(entry, `${field}[${i}]`));
  };
  const image = (value, field) => {
    if (
      !object(
        value,
        ["src", "alt", "author", "sourceUrl", "license", "licenseUrl"],
        field,
      )
    )
      return;
    ["src", "alt", "author", "license"].forEach((k) =>
      string(value[k], `${field}.${k}`),
    );
    ["sourceUrl", "licenseUrl"].forEach((k) => url(value[k], `${field}.${k}`));
    const prefix = `images/${city.slug}/`;
    if (
      typeof value.src !== "string" ||
      !value.src.startsWith(prefix) ||
      value.src.includes("..") ||
      !/^images\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/.test(value.src)
    )
      fail(`${field}.src`, "must be a local images/{slug}/file.webp path");
    else if (checkFiles && !existsSync(resolve(root, "public", value.src)))
      fail(`${field}.src`, "local image does not exist");
  };
  if (
    !object(
      city,
      [
        "slug",
        "name",
        "country",
        "continent",
        "tagline",
        "summary",
        "tags",
        "bestTimeToVisit",
        "heroImage",
        "attractions",
        "foods",
        "travelTips",
        "gallery",
        "sources",
      ],
      "city",
    )
  )
    return errors;
  ["slug", "continent", "tagline", "summary", "bestTimeToVisit"].forEach((k) =>
    string(city[k], k),
  );
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(city.slug))
    fail("slug", "use lowercase kebab-case");
  if (basename(filename) !== `${city.slug}.json`)
    fail("slug", "must match filename");
  if (
    ![
      "Asia",
      "Europe",
      "North America",
      "South America",
      "Oceania",
      "Africa",
      "Antarctica",
    ].includes(city.continent)
  )
    fail("continent", "invalid enum");
  for (const key of ["name", "country"])
    if (object(city[key], ["zh", "en"], key))
      ["zh", "en"].forEach((k) => string(city[key][k], `${key}.${k}`));
  array(city.tags, 1, "tags", string);
  image(city.heroImage, "heroImage");
  for (const [key, keys] of [
    ["attractions", ["name", "category", "description"]],
    ["foods", ["name", "description"]],
    ["travelTips", ["title", "description"]],
  ])
    array(city[key], 3, key, (entry, field) => {
      if (object(entry, keys, field))
        keys.forEach((k) => string(entry[k], `${field}.${k}`));
    });
  array(city.gallery, 1, "gallery", image);
  array(city.sources, 2, "sources", (source, field) => {
    if (object(source, ["title", "url"], field)) {
      string(source.title, `${field}.title`);
      url(source.url, `${field}.url`);
    }
  });
  return errors;
}
export function validateAll() {
  const errors = [],
    seen = new Set(),
    files = readdirSync(resolve(root, "src/data/cities")).filter((f) =>
      f.endsWith(".json"),
    );
  if (!files.length) errors.push("src/data/cities: no city data");
  for (const file of files) {
    try {
      const city = JSON.parse(
        readFileSync(resolve(root, "src/data/cities", file), "utf8"),
      );
      errors.push(...validateCity(city, file));
      if (seen.has(city.slug))
        errors.push(`${file}: slug: duplicate ${city.slug}`);
      seen.add(city.slug);
    } catch (error) {
      errors.push(`${file}: JSON: ${error.message}`);
    }
  }
  return { errors, count: files.length };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const { errors, count } = validateAll();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      `PASS: ${count} cities; schema, HTTPS URL format and local assets verified. Source validity/license require human review.`,
    );
}
