import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/components.css";
import { shell } from "./components/shared.js";
import { renderHome } from "./pages/home.js";
import { renderExplore } from "./pages/explore.js";
import { renderCity } from "./pages/city.js";
import { renderAbout } from "./pages/about.js";
const page = document.body.dataset.page;
shell(page);
({
  index: renderHome,
  explore: renderExplore,
  city: renderCity,
  about: renderAbout,
})[page](document.querySelector("main"));
