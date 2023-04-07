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

const marker = new maptalks.Marker([-0.113049, 51.49556], {
  symbol: {
    markerType: "ellipse",
    markerFill: "rgb(135,196,240)",
    markerWidth: 130,
    markerHeight: 130,
    markerLineWidth: 0,
  },
}).addTo(pointLayer);

function updateFill() {
  marker.updateSymbol({
    markerFill: "rgb(216,115,149)",
  });
}

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
