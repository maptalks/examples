const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  minZoom: 14, // set map's min zoom to 14
  maxZoom: 14, // set map's max zoom to 14
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  layers: [new maptalks.VectorLayer("v")],
});

// or you can set zoom limit by
map.setMinZoom(14).setMaxZoom(14);
