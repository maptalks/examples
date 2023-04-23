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
  zoomControl: true,
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
const gui = new dat.GUI({
  width: 250,
});
const Config = function () {
  this.animation = true;
  this.loop = true;
  this.coordinateSystemList = "map";
};
const options = new Config();
const url = "/resources/gltf/teapot/teapot.gltf";
const symbol = {
  url: url,
};

const gltfLayer = new maptalks.GLTFLayer("gltf", {
  gltfCoordinateSystem: "map", //分为map和gltf两种, map为地图坐标系统，会给模型尺寸位置做自适应。gltf为模型内部坐标系统，按真实大小渲染
});
const position = map.getCenter();
const gltfMarker = new maptalks.GLTFMarker(position, {
  symbol,
}).addTo(gltfLayer);

const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer], {
  sceneConfig,
}).addTo(map);

const coordinateSystemListControl = gui
  .add(options, "coordinateSystemList", ["map", "gltf"])
  .name("coordinate list");
coordinateSystemListControl.onChange(function (value) {
  gltfLayer.setGltfCoordinateSystem(value);
  if (value === "gltf") {
    map.animateTo({
      center: [-0.11294, 51.4987],
      zoom: 20,
    });
  } else {
    map.animateTo({
      center: [-0.113049, 51.498568],
      zoom: 14,
    });
  }
});
