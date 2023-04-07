const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    // crossOrigin : 'anonymous', // required if renderer is canvas
    // renderer : 'canvas',
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

new maptalks.VectorLayer("v", new maptalks.Marker(map.getCenter())).addTo(map);

// Export map to an image
// External image(tiles, marker images) hosts need to support CORS
function save() {
  const data = map.toDataURL({
    mimeType: "image/jpeg", // or 'image/png'
    save: true, // to pop a save dialog
    fileName: "map", // file name
  });
}
