const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

// sort to 3,2,1
function sort1() {
  map.sortLayers(["1", "2", "3"]);
}

// sort to 1,2,3
function sort2() {
  map.sortLayers(["3", "2", "1"]);
}

const rect3 = new maptalks.Rectangle(
  map.getCenter().sub(0.025, 0.0035),
  1600,
  1000,
  {
    symbol: [
      {
        lineColor: "#34495e",
        lineWidth: 3,
        polygonFill: "#1bbc9b",
        polygonOpacity: 1,
      },
      {
        textName: "Layer 3",
        textWeight: "bold",
        textSize: 30,
        textFill: "#fff",
      },
    ],
  }
);

const rect2 = rect3
  .copy()
  .translate([0.006, 0.006])
  .updateSymbol([{ polygonFill: "rgb(216,115,149)" }, { textName: "Layer 2" }]);

const rect1 = rect2
  .copy()
  .translate([0.006, 0.006])
  .updateSymbol([{ polygonFill: "rgb(135,196,240)" }, { textName: "Layer 1" }]);

map.addLayer([
  new maptalks.VectorLayer("3", [rect3]),
  new maptalks.VectorLayer("2", [rect2]),
  new maptalks.VectorLayer("1", [rect1]),
]);
