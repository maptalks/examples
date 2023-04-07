const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("v").addTo(map);

const label = new maptalks.Label("label with box", [-0.117, 51.496], {
  textSymbol: {
    textFaceName: "sans-serif",
    textFill: "#fff",
    textSize: 18,
  },
  boxStyle: {
    padding: [12, 8],
    symbol: {
      markerType: "square",
      markerFillOpacity: 0.9,
      markerLineColor: "#34495e",
      markerFill: "#34495e",
      markerLineWidth: 1,
    },
  },
}).addTo(layer);

startEdit();

function startEdit() {
  label.startEditText();
}

function endEdit() {
  label.endEditText();
}
