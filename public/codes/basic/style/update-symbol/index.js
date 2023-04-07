const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 13,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("vector").addTo(map);

const rect = new maptalks.Rectangle([-0.143049, 51.50856], 4250, 3000, {
  symbol: {
    polygonFill: "rgb(135,196,240)",
    polygonOpacity: 1,
    lineColor: "#1bbc9b",
    lineWidth: 6,
  },
}).addTo(layer);

// only update rectangle's polygonFill
function updateFill() {
  rect.updateSymbol({
    polygonFill: "rgb(216,115,149)",
  });
}
