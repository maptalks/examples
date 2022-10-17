const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const pointLayer = new maptalks.PointLayer("point");

const marker = new maptalks.Marker([-74.00912099912109, 40.71022610933129], {
  symbol: {
    markerType: "ellipse",
    markerFill: {
      type: "linear",
      places: [0, 0, 1, 1],
      colorStops: [
        [0.0, "#fff"],
        [0.5, "#fff27e"],
        [1, "#f87e4b"],
      ],
    },
    markerLineWidth: 0,
    markerWidth: 100,
    markerHeight: 100,
  },
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
