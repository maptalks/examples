const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const lineLayer = new maptalks.LineStringLayer("linelayer").addTo(map);
const line = new maptalks.LineString(
  [
    [-0.131049, 51.498968],
    [-0.107049, 51.498968],
    [-0.107049, 51.483968],
  ],
  {
    symbol: {
      lineColor: "#1bbc9b",
      lineWidth: 3,
    },
  }
).addTo(lineLayer);

document.getElementById("info").innerHTML = JSON.stringify(line.toGeoJSON());
