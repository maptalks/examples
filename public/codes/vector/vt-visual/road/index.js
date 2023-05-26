// 两个 vt 图层 道路单独提出来
const map = new maptalks.Map("map", {
  center: [-74.01525660332106, 40.70568947796781],
  zoom: 16.5,
  bearing: 24,
  pitch: 48.8,
  lights: {
    directional: {
      direction: [0.5, 0, -1],
      color: [1, 1, 1],
    },
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

// 修改一下view

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style: "{res}/styles/road.json",
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [vtLayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.489,
    },
    shadow: {
      type: "esm",
      enable: true,
      quality: "high",
      opacity: 0.5,
      color: [0, 0, 0],
      blurOffset: 1,
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill",
      },
      symbol: {
        polygonFill: [
          0.803921568627451, 0.803921568627451, 0.803921568627451, 1,
        ],
        polygonOpacity: 1,
      },
    },
  },
}).addTo(map);
