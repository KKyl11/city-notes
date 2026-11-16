export const filterCities = (cities, query = "", continent = "") => {
  const term = query.trim().toLocaleLowerCase();
  return cities.filter(
    (c) =>
      (!continent || c.continent === continent) &&
      [c.name.zh, c.name.en, c.country.zh, c.country.en].some((value) =>
        value.toLocaleLowerCase().includes(term),
      ),
  );
};
