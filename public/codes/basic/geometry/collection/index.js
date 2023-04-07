const c = new maptalks.Coordinate(-0.113049, 51.498568);
const map = new maptalks.Map("map", {
  center: c,
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const marker = new maptalks.Marker(c.add(-0.018, 0.007), {
  symbol: {
    textFaceName: "sans-serif",
    textName: "MapTalks",
    textFill: "#34495e",
    textHorizontalAlignment: "right",
    textSize: 40,
  },
});
const line = new maptalks.LineString(
  [c.add(-0.018, 0.005), c.add(0.006, 0.005)],
  {
    symbol: {
      lineColor: "#1bbc9b",
      lineWidth: 3,
    },
  }
);
const polygon = new maptalks.Polygon(
  [
    c.add(-0.018, 0.004),
    c.add(0.006, 0.004),
    c.add(0.006, -0.001),
    c.add(-0.018, -0.001),
    c.add(-0.018, 0.004),
  ],
  {
    symbol: {
      lineColor: "#34495e",
      lineWidth: 2,
      polygonFill: "rgb(135,196,240)",
      polygonOpacity: 0.6,
    },
  }
);

const collection = new maptalks.GeometryCollection([marker, line, polygon]);

new maptalks.VectorLayer("vector", collection).addTo(map);
