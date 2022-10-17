const c = [-0.113049, 51.498568];
const map = new maptalks.Map("map", {
  center: c,
  zoom: 13,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  layers: [new maptalks.VectorLayer("v")],
});

const marker = new maptalks.Marker(c);
const rect = new maptalks.Rectangle(c, 1000, 800);
map.getLayer("v").addGeometry(marker, rect);

const map1 = new maptalks.Map("map1", {
  center: c,
  zoom: 13,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});
const newLayer = new maptalks.VectorLayer("v").addTo(map1);
// copy geometry by JSON
maptalks.Geometry.fromJSON(rect.toJSON()).addTo(newLayer);
