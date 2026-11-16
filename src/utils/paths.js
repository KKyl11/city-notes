export const sitePath = (path = "") =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
export const cityPath = (slug) =>
  sitePath(`city.html?slug=${encodeURIComponent(slug)}`);
