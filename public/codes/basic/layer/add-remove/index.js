const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const marker = new maptalks.Marker(map.getCenter(), {
  symbol: {
    textName: "Layer is added.",
    textWeight: "bold",
    textSize: 50,
    textFill: "#1bbc9b",
    textHaloFill: "#fff",
    textHaloRadius: 5,
  },
});
const layer = new maptalks.VectorLayer("vector", [marker]).addTo(map);

function add() {
  map.addLayer(layer);
}

function remove() {
  map.removeLayer(layer);
}
