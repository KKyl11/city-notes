const modules = import.meta.glob("../data/cities/*.json", {
  eager: true,
  import: "default",
});
export const cities = Object.values(modules).sort((a, b) =>
  a.name.en.localeCompare(b.name.en),
);
export const continents = [
  ...new Set(cities.map((city) => city.continent)),
].sort();
export const findCity = (slug) => cities.find((city) => city.slug === slug);
