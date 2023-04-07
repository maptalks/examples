const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const rect1 = new maptalks.Rectangle(
  map.getCenter().add(-0.025, 0.005),
  1600,
  1000,
  {
    symbol: [
      {
        lineColor: "#34495e",
        lineWidth: 3,
        polygonFill: "#1bbc9b",
      },
      {
        textName: "70%",
        textWeight: "bold",
        textSize: 30,
        textFill: "#fff",
      },
    ],
  }
);

const rect2 = rect1
  .copy()
  .translate([0.03, 0])
  .updateSymbol([{}, { textName: "40%" }]);

const layer1 = new maptalks.VectorLayer("vector1", [rect1], {
  opacity: 0.7,
}).addTo(map);

const layer2 = new maptalks.VectorLayer("vector2", [rect2], {
  opacity: 0.4,
}).addTo(map);
