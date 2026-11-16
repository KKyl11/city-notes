import { cities, continents } from "../utils/city-loader.js";
import { filterCities } from "../utils/search.js";
import { card, escape } from "../components/shared.js";
export function renderExplore(main) {
  main.innerHTML = `<section class="wrap page-heading"><p class="eyebrow">The city collection</p><h1>Find your <em>next city.</em></h1><p>用一個名字、一個國家，或一片大陸，開始探索。</p></section><section class="wrap explore-content" aria-label="城市搜尋"><form id="filters" class="filters" role="search"><div><label for="search">搜尋城市或國家</label><input id="search" type="search" placeholder="例如：東京、Paris、日本" autocomplete="off"></div><div><label for="continent">洲別</label><select id="continent"><option value="">所有洲別</option>${continents.map((c) => `<option>${escape(c)}</option>`).join("")}</select></div><button class="reset" type="reset">清除篩選 ↺</button></form><p id="count" class="eyebrow result-count" role="status" aria-live="polite"></p><div id="results" class="city-grid"></div><div id="empty" class="empty" hidden><h2>No cities found.</h2><p>找不到符合條件的城市，試試其他關鍵字，或清除篩選。</p><button id="empty-reset" class="button">清除篩選</button></div></section>`;
  const form = main.querySelector("form"),
    search = main.querySelector("input"),
    select = main.querySelector("select");
  const update = () => {
    const result = filterCities(cities, search.value, select.value);
    main.querySelector("#count").textContent =
      `${result.length} / ${cities.length} cities · 座城市`;
    main.querySelector("#results").innerHTML = result.map(card).join("");
    main.querySelector("#empty").hidden = result.length > 0;
  };
  form.addEventListener("submit", (e) => e.preventDefault());
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("reset", () => {
    search.value = "";
    select.value = "";
    update();
  });
  main
    .querySelector("#empty-reset")
    .addEventListener("click", () => form.reset());
  update();
}
