const map = new maptalks.Map("map", {
  center: [-74.0146705917781, 40.70423172291831],
  zoom: 17.3,
  bearing: 24.1,
  pitch: 48.8,
  lights: {
    directional: { direction: [0.5, 0, -1], color: [1, 1, 1] },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/923/front.jpg",
          back: "{res}/hdr/923/back.jpg",
          left: "{res}/hdr/923/left.jpg",
          right: "{res}/hdr/923/right.jpg",
          top: "{res}/hdr/923/top.jpg",
          bottom: "{res}/hdr/923/bottom.jpg",
        },
      },
      exposure: 0.787,
      hsv: [0, 0, 0],
      orientation: 0,
    },
  },
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
});
