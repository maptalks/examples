const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  devicePixelRatio: 2,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("layer").addTo(map);
const marker = new maptalks.Marker(map.getCenter());
marker.addTo(layer);
