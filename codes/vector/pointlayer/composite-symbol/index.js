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

const marker = new maptalks.Marker(map.getCenter(), {
  symbol: [
    {
      markerType: "ellipse",
      markerFill: "#fff",
      markerFillOpacity: 1,
      markerWidth: 20,
      markerHeight: 20,
      markerLineWidth: 0,
      markerVerticalAlignment: "middle",
    },
    {
      markerType: "ellipse",
      markerFill: "#1bc8ff",
      markerFillOpacity: 0.9,
      markerWidth: 55,
      markerHeight: 55,
      markerLineWidth: 0,
      markerVerticalAlignment: "middle",
    },
    {
      markerType: "ellipse",
      markerFill: "#0096cd",
      markerFillOpacity: 0.8,
      markerWidth: 91,
      markerHeight: 91,
      markerLineWidth: 0,
      markerVerticalAlignment: "middle",
    },
    {
      markerType: "ellipse",
      markerFill: "#0096cd",
      markerFillOpacity: 0.3,
      markerWidth: 130,
      markerHeight: 130,
      markerLineWidth: 0,
      markerVerticalAlignment: "middle",
    },
    {
      markerType: "ellipse",
      markerFill: "#0096cd",
      markerFillOpacity: 0.2,
      markerWidth: 172,
      markerHeight: 172,
      markerLineWidth: 0,
      markerVerticalAlignment: "middle",
    },
  ],
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
