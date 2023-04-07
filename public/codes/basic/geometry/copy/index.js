const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("vector").addTo(map);
const copyLayer = new maptalks.VectorLayer("copy").addTo(map);

const rect = new maptalks.Rectangle([-0.121049, 51.50656], 800, 600, {
  symbol: {
    lineColor: "#fff",
    lineWidth: 2,
    polygonFill: "rgb(216,115,149)",
    polygonOpacity: 0.7,
  },
}).addTo(layer);

const counter = 1;
function copy() {
  // copy with translation of [0.003, -0.003]
  rect
    .copy()
    .translate(0.003 * counter, -0.003 * counter)
    .addTo(copyLayer);
  counter++;
}

function clear() {
  counter = 1;
  copyLayer.clear();
}
