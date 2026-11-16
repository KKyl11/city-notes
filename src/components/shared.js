import { sitePath, cityPath } from "../utils/paths.js";
export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const photo = (image, hero = false, className = "") =>
  `<img class="${className}" src="${sitePath(image.src)}" alt="${escape(image.alt)}" width="1600" height="1067" ${hero ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
export function shell(page) {
  document.querySelector("#header").innerHTML =
    `<a class="brand" href="${sitePath()}">City Notes<span>城市探索筆記</span></a><nav aria-label="主要導覽">${[
      ["index", "Home", ""],
      ["explore", "Explore", "explore.html"],
      ["about", "About", "about.html"],
    ]
      .map(
        ([key, label, path]) =>
          `<a href="${sitePath(path)}" ${page === key ? 'aria-current="page"' : ""}>${label}</a>`,
      )
      .join("")}</nav>`;
  document.querySelector("#footer").innerHTML =
    `<a class="brand" href="${sitePath()}">City Notes</a><p>Explore the World, One City at a Time.<br>一座城市，一頁新的風景。</p><a href="${sitePath("about.html")}">About this journal ↗</a><small>© ${new Date().getFullYear()} City Notes · A student travel journal</small>`;
}
export const card = (city, i) =>
  `<article class="city-card"><a href="${cityPath(city.slug)}"> <div class="card-image">${photo(city.heroImage)}<span class="card-number">${String(i + 1).padStart(2, "0")}</span><span class="card-arrow" aria-hidden="true">↗</span></div><p class="eyebrow">${escape(city.continent)} / ${escape(city.country.en)}</p><h3>${escape(city.name.en)} <span>${escape(city.name.zh)}</span></h3><p class="country">${escape(city.country.zh)}</p><p>${escape(city.tagline)}</p></a></article>`;
export const sectionHeading = (label, title, extra = "") =>
  `<div class="section-heading"><div><p class="eyebrow">${label}</p><h2>${title}</h2></div>${extra}</div>`;
