const c = [-0.113049, 51.498568];
const map = new maptalks.Map("map", {
  center: c,
  zoom: 13,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  layers: [
    new maptalks.VectorLayer("v0", [new maptalks.Marker(c)]),
    new maptalks.VectorLayer("v1", [new maptalks.Rectangle(c, 1000, 800)]),
  ],
});

const map1 = new maptalks.Map("map1", {
  center: c,
  zoom: 13,
  baseLayer: new maptalks.TileLayer("base1", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});
// copy layer by JSON
maptalks.Layer.fromJSON(map.getLayer("v0").toJSON()).addTo(map1);
