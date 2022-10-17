const map = new maptalks.Map("map", {
  center: [-0.11144680030497511, 51.49097843108163],
  zoom: 13.629942384883169,
  pitch: 62.00000000000024,
  bearing: -180,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  lights: {
    ambient: {
      resource: null,
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
};
const gui = new dat.GUI({
  width: 250,
});
class Config {
  constructor() {
    this.shadow = false;
  }
}
const options = new Config();
const url = "{res}/gltf/alien/alien.glb";
const symbol = {
  url,
  shadow: options.shadow,
  scale: [2, 2, 2],
};

const gltfLayer = new maptalks.GLTFLayer("gltf");
const gltfMarker = new maptalks.GLTFMarker(
  [-0.11304900000004636, 51.498568000000006],
  {
    symbol,
  }
).addTo(gltfLayer);

const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer], {
  sceneConfig,
}).addTo(map);

// shadow control
const shadowController = gui.add(options, "shadow");
shadowController.onChange(function (value) {
  gltfMarker.setCastShadow(value);
});
