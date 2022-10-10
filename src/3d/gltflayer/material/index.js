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
      resource: {
        url: '{res}/hdr/env.hdr',
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

const gui = new dat.GUI({
  width: 250,
});
const Config = function () {
  this.polygonFill = [255, 255, 255];
  this.metallicFactor = 0;
  this.roughnessFactor = 0.4;
};
const options = new Config();
const url = '{res}/gltf/alien/alien.glb';
const symbol = {
  url: url,
  shadow: true,
  scale: [1.5, 1.5, 1.5],
  uniforms: {
    polygonFill: [
      options.polygonFill[0] / 255,
      options.polygonFill[1] / 255,
      options.polygonFill[2] / 255,
      1.0,
    ],
    metallicFactor: options.metallicFactor,
    roughnessFactor: options.roughnessFactor,
  },
};

const gltfLayer = new maptalks.GLTFLayer('gltf');
const gltfMarker = new maptalks.GLTFMarker(
  [-0.11304900000004636, 51.498568000000006],
  {
    symbol,
  }
).addTo(gltfLayer);

const groupGLLayer = new maptalks.GroupGLLayer('gl', [gltfLayer]).addTo(map);

// matrial control
const polygonFillController = gui.addColor(options, 'polygonFill');
polygonFillController.onChange(function (value) {
  gltfMarker.setUniform('polygonFill', [
    value[0] / 255,
    value[1] / 255,
    value[2] / 255,
    1.0,
  ]);
});

const metallicFactorController = gui.add(options, 'metallicFactor', 0, 1);
metallicFactorController.onChange(function (value) {
  gltfMarker.setUniform('metallicFactor', value);
});

const roughnessFactorController = gui.add(options, 'roughnessFactor', 0, 1);
roughnessFactorController.onChange(function (value) {
  gltfMarker.setUniform('roughnessFactor', value);
});
