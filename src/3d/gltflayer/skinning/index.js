const map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  pitch: 80,
  bearing: 180,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
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
const Config = function () {
  this.animation = true;
  this.loop = true;
};
const options = new Config();
const url = 'scene.gltf';
const symbol = {
  url: url,
  shadow: true,
  animation: options.animation,
  loop: options.loop,
  scale: [2, 2, 2],
  rotation: [0, 0, 180],
};

const gltfLayer = new maptalks.GLTFLayer('gltf');
const position = map.getCenter();
const gltfMarker = new maptalks.GLTFMarker(position, {
  symbol,
}).addTo(gltfLayer);

const groupGLLayer = new maptalks.GroupGLLayer('gl', [gltfLayer], {
  sceneConfig,
}).addTo(map);

// animation control
const animationController = gui.add(options, 'animation');
animationController.onChange(function (value) {
  gltfMarker.setAnimation(value);
});
const loopController = gui.add(options, 'loop');
loopController.onChange(function (value) {
  gltfMarker.setAnimationLoop(value);
});
