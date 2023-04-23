const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  pitch: 80,
  bearing: 180,
  lights: {
    ambient: {
      resource: {
        url: "/resources/hdr/env.hdr",
      },
      color: [1, 1, 1],
      exposure: 1,
    },
    directional: {
      color: [1, 1, 1],
      lightColorIntensity: 5000,
      direction: [1, -0.4, -1],
    },
  },
});

const sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 1,
    brightness: 1,
  },
  shadow: {
    enable: true,
    opacity: 0.5,
    color: [0, 0, 0],
  },
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
    },
    ssr: {
      enable: true,
    },
    bloom: {
      enable: true,
    },
    outline: {
      enable: true,
    },
  },
  ground: {
    enable: true,
    renderPlugin: {
      type: "lit",
    },
    symbol: {
      polygonOpacity: 1,
      material: {
        baseColorFactor: [0.48235, 0.48235, 0.48235, 1],
        hsv: [0, 0, -0.532],
        roughnessFactor: 0.22,
        metallicFactor: 0.58,
      },
    },
  },
};
const url = "/resources/gltf/alien/alien.glb";
const symbol = {
  url: url,
};
const position = map.getCenter();
const data = [];
for (let i = -2; i < 3; i++) {
  for (let j = -2; j < 3; j++) {
    data.push({
      coordinates: position.add(i * 0.01 - 0.018, j * 0.01),
      scale: [1, 1, 1],
      color: [1, 1, 1, 1],
    });
  }
}
const gltfLayer = new maptalks.GLTFLayer("gltf");
const multiGLTFMarker = new maptalks.MultiGLTFMarker(data, {
  symbol: symbol,
}).addTo(gltfLayer);
const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer], {
  sceneConfig,
}).addTo(map);

function addItem() {
  multiGLTFMarker.addData({
    coordinates: position.add(-0.02, -0.02),
    translation: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [2, 2, 2],
    color: [1.0, 0.4, 0.3, 1.0],
  });
}
