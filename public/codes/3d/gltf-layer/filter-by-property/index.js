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

const gltfLayer = new maptalks.GLTFLayer("gltf");
const position = map.getCenter();
const markers = [];
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    const gltfMarker = new maptalks.GLTFMarker(
      position.add(i * 0.01 - 0.015, j * 0.01 - 0.015),
      {
        symbol: {
          url,
        },
        properties: {
          num: (i + j) * 0.1,
        },
      }
    );
    markers.push(gltfMarker);
  }
}

gltfLayer.addGeometry(markers);
const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer], {
  sceneConfig,
}).addTo(map);

function filter() {
  gltfLayer.filter([">=", "num", 0.2]).forEach(function (gltfMarker) {
    gltfMarker.updateSymbol({
      uniforms: {
        polygonFill: [0.8, 0.1, 0.1, 1.0],
      },
    });
  });
}
