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

const gltfLayer = new maptalks.GLTFLayer("gltf");
const position = map.getCenter();
const gltfMarker = new maptalks.GLTFMarker(position, {
  symbol: symbol,
}).addTo(gltfLayer);

const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer], {
  sceneConfig,
}).addTo(map);

map.on("click", (e) => {
  const picks = gltfLayer.identify(e.coordinate);
  if (picks && picks.length > 0) {
    const target = picks[0].data;
    target.setUniform("polygonFill", [0.2, 0.2, 1.0, 1.0]);
  } else {
    gltfMarker.setUniform("polygonFill", [1.0, 1.0, 1.0, 1.0]);
  }
});
