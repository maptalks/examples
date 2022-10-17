// load 3857 tiles in a map with 4326 projection
const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 9,
  minZoom: 4,
  maxZoom: 18,
  spatialReference: {
    projection: "EPSG:4326",
  },
  baseLayer: new maptalks.TileLayer("base", {
    spatialReference: {
      projection: "EPSG:3857",
      // other properties necessary for spatial reference
    },
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});
