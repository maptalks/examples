const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const center = map.getCenter();

const pointLayer = new maptalks.PointLayer("point");

const marker = new maptalks.Marker([-0.113049, 51.49856], {
  properties: {
    name: "MapTalks",
  },
  symbol: {
    markerType: "square",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: "0.9",
    markerDy: 2,
    markerVerticalAlignment: "middle",
    markerHorizontalAlignment: "middle",
    markerTextFit: "both",
    markerTextFitPadding: [5, 5, 5, 5],
    textName: "{name}",
    textSize: 20,
  },
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
