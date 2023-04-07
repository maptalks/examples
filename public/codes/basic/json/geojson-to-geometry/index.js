const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  layers: [new maptalks.VectorLayer("v")],
});

const json = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-0.113049, 51.498568],
  },
  properties: {
    name: "point marker",
  },
};
const marker = maptalks.GeoJSON.toGeometry(json).addTo(map.getLayer("v"));
