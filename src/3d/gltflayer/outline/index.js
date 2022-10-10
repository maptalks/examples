const map = new maptalks.Map('map', {
  center: [-0.10707916972842213, 51.48119259984284],
  zoom: 12,
  pitch: 63.8,
  bearing: 179.39999999999975,
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
  this.outline = false;
};
const options = new Config();
const url = '{res}/gltf/alien/alien.glb';
const symbol = {
  url,
  shadow: true,
  scale: [1.5, 1.5, 1.5],
};

const gltfLayer = new maptalks.GLTFLayer('gltf');
const gltfMarker = new maptalks.GLTFMarker(
  [-0.11304900000004636, 51.498568000000006],
  {
    symbol,
  }
).addTo(gltfLayer);

const groupGLLayer = new maptalks.GroupGLLayer('gl', [gltfLayer], {
  sceneConfig,
}).addTo(map);

// outline control
const outlineController = gui.add(options, 'outline');
outlineController.onChange(function (value) {
  if (value) {
    gltfMarker.outline();
  } else {
    gltfMarker.cancelOutline();
  }
});
