const center = new maptalks.Coordinate(-0.113049, 51.498568);
const map = new maptalks.Map("map", {
  center: center,
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const marker = new maptalks.Marker(
  center, // .add(-0.018,0.007).toArray(),
  {
    symbol: {
      textFaceName: '"microsoft yahei",arial,sans-serif',
      textName: "MapTalks",
      textFill: "#34495e",
      textHorizontalAlignment: "right",
      textSize: 40,
    },
  }
);
const polyline = new maptalks.LineString(
  [
    center, // .add(-0.018,0.005).toArray(),
    center.add(0.006, 0.005).toArray(),
  ],
  {
    symbol: {
      lineColor: "#1bbc9b",
      lineWidth: 3,
    },
  }
);
const polygon = new maptalks.Polygon(
  [
    center.add(-0.018, 0.004).toArray(),
    center.add(0.006, 0.004).toArray(),
    center.add(0.006, -0.001).toArray(),
    center.add(-0.018, -0.001).toArray(),
    center.add(-0.018, 0.004).toArray(),
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

const layer = new maptalks.VectorLayer("vector")
  .addGeometry([marker, polyline, polygon])
  .addTo(map);
