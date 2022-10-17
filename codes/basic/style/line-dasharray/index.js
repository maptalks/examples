const c = new maptalks.Coordinate(-0.113049, 51.49856);
const map = new maptalks.Map("map", {
  center: c,
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("vector").addTo(map);

const line = new maptalks.LineString([c.sub(0.01, 0), c], {
  symbol: [
    {
      lineColor: "#fff",
      lineWidth: 10,
    },
    {
      lineColor: "#000",
      lineWidth: 8,
      lineDasharray: [10, 5, 10, 5],
    },
  ],
}).addTo(layer);
