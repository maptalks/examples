const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const map1 = new maptalks.Map("map1", {
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
    [-0.131049, 51.498568],
    [-0.107049, 51.498568],
    [-0.107049, 51.483568],
  ],
  {
    symbol: {
      lineColor: "#1bbc9b",
      lineWidth: 3,
    },
  }
).addTo(lineLayer);

const newLayer = new maptalks.LineStringLayer("v").addTo(map1);
// copy LineString by JSON
maptalks.LineString.fromJSON(line.toJSON()).addTo(newLayer);
