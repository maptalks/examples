const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const distanceTool = new maptalks.DistanceTool({
  symbol: {
    lineColor: "#34495e",
    lineWidth: 2,
  },
  vertexSymbol: {
    markerType: "ellipse",
    markerFill: "#1bbc9b",
    markerLineColor: "#000",
    markerLineWidth: 3,
    markerWidth: 10,
    markerHeight: 10,
  },

  labelOptions: {
    textSymbol: {
      textFaceName: "monospace",
      textFill: "#fff",
      textLineSpacing: 1,
      textHorizontalAlignment: "right",
      textDx: 15,
      markerLineColor: "#b4b3b3",
      markerFill: "#000",
    },
    boxStyle: {
      padding: [6, 2],
      symbol: {
        markerType: "square",
        markerFill: "#000",
        markerFillOpacity: 0.9,
        markerLineColor: "#b4b3b3",
      },
    },
  },
  clearButtonSymbol: [
    {
      markerType: "square",
      markerFill: "#000",
      markerLineColor: "#b4b3b3",
      markerLineWidth: 2,
      markerWidth: 15,
      markerHeight: 15,
      markerDx: 20,
    },
    {
      markerType: "x",
      markerWidth: 10,
      markerHeight: 10,
      markerLineColor: "#fff",
      markerDx: 20,
    },
  ],
  language: "en-US",
}).addTo(map);
