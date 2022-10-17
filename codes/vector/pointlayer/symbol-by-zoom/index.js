const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  zoomControl: true,
});

const center = map.getCenter();

const pointLayer = new maptalks.PointLayer("point");

const marker = new maptalks.Marker([-0.113049, 51.49456], {
  symbol: [
    {
      markerType: "ellipse",
      markerWidth: {
        stops: [
          [12, 5],
          [14, 200],
        ],
      },
      markerHeight: {
        stops: [
          [12, 5],
          [14, 200],
        ],
      },
      markerFill: "#18987f",
      markerFillOpacity: 0.6,
      markerLineColor: "#34495e",
      markerLineWidth: 5,
    },
  ],
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
