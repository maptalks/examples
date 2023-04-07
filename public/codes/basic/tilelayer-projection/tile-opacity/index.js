const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 11,
  attribution: {
    content: "$(attribution), &copy ESRI",
  },
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate:
      "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg",
  }),
});

map.addLayer(
  new maptalks.TileLayer("carto", {
    opacity: 0.6, // TileLayer's opacity, 0-1
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  })
);
