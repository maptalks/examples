const map = new maptalks.Map("map", {
  center: [2.3039431874999536, 50.97239313116968],
  zoom: 7,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("vector").addTo(map);

const line = new maptalks.LineString(
  [
    [4.460010082031204, 50.41204897711654],
    [3.7129397695312036, 51.05869036408862],
    [3.2295413320312036, 51.20347195727524],
    [1.0872073476562036, 51.27225609350862],
    [-0.15424773046879636, 51.505353427248],
  ],
  {
    symbol: {
      lineColor: "#1bbc9b",
      lineWidth: 3,
      lineDasharray: [10, 10],
      markerFile: "{res}/markers/plane.png",
      markerPlacement: "vertex", // vertex, point, vertex-first, vertex-last, center
      markerVerticalAlignment: "middle",
      markerWidth: 30,
      markerHeight: 30,
    },
  }
).addTo(layer);
