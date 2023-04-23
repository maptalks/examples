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
  scale: [2, 2, 2],
};

const gltfLayer = new maptalks.GLTFLayer("gltf");
const position = map.getCenter();
const gltfMarker = new maptalks.GLTFMarker(position, {
  symbol: symbol,
});

gltfLayer.addGeometry(gltfMarker);
const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer], {
  sceneConfig,
}).addTo(map);

const transformControl = new maptalks.TransformControl();
transformControl.addTo(map);
transformControl.on("transforming", (e) => {
  const target = transformControl.getTransformTarget();
  target.setTRS(e.translate, e.rotation, e.scale);
});

transformControl.on("positionchange", (e) => {
  const target = transformControl.getTransformTarget();
  target.setCoordinates(e.coordinate);
});

transformControl.on("transformend", (e) => {
  document.getElementById("info").innerHTML = "操控模型完成事件";
});

map.on("dom:click", (e) => {
  const identifyData = e.coordinate
    ? groupGLLayer.identify(e.coordinate, {
        layers: [gltfLayer],
        orderByCamera: true,
      })[0]
    : groupGLLayer.identifyAtPoint(e.containerPoint, {
        layers: [gltfLayer],
        orderByCamera: true,
      })[0];
  const target = identifyData && identifyData.data;
  if (target) {
    transformControl.enable();
    transformControl.transform(target);
  } else {
    transformControl.disable();
  }
});
