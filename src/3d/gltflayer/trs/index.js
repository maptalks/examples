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
  this.translationX = 0;
  this.translationY = 0;
  this.translationZ = 0;
  this.rotationX = 0;
  this.rotationY = 0;
  this.rotationZ = 0;
  this.scaleX = 1.5;
  this.scaleY = 1.5;
  this.scaleZ = 1.5;
};
const options = new Config();
const url = '{res}/gltf/alien/alien.glb';
const symbol = {
  url: url,
  shadow: true,
  translation: [
    options.translationX,
    options.translationY,
    options.translationZ,
  ],
  rotation: [options.rotationX, options.rotationY, options.rotationZ],
  scale: [options.scaleX, options.scaleY, options.scaleZ],
};

const gltfLayer = new maptalks.GLTFLayer('gltf');
const gltfMarker = new maptalks.GLTFMarker(
  [-0.11304900000004636, 51.498568000000006],
  {
    symbol,
  }
).addTo(gltfLayer);

const groupGLLayer = new maptalks.GroupGLLayer('gl', [gltfLayer]).addTo(map);

const translation = gui.addFolder('translation');
translation.open();

const transControllerX = translation.add(options, 'translationX', -10, 10);
transControllerX.onChange(function (value) {
  gltfMarker.setTranslation([
    value,
    transControllerY.getValue(),
    transControllerZ.getValue(),
  ]);
});

const transControllerY = translation.add(options, 'translationY', -10, 10);
transControllerY.onChange(function (value) {
  gltfMarker.setTranslation([
    transControllerX.getValue(),
    value,
    transControllerZ.getValue(),
  ]);
});

const transControllerZ = translation.add(options, 'translationZ', -10, 10);
transControllerZ.onChange(function (value) {
  gltfMarker.setTranslation([
    transControllerX.getValue(),
    transControllerY.getValue(),
    value,
  ]);
});

const rotation = gui.addFolder('rotation');
rotation.open();

const rotationControllerAxisX = rotation.add(options, 'rotationX', -90, 90);
rotationControllerAxisX.onChange(function () {
  gltfMarker.setRotation([
    rotationControllerAxisX.getValue(),
    rotationControllerAxisY.getValue(),
    rotationControllerAxisZ.getValue(),
  ]);
});

const rotationControllerAxisY = rotation.add(options, 'rotationY', -90, 90);
rotationControllerAxisY.onChange(function () {
  gltfMarker.setRotation([
    rotationControllerAxisX.getValue(),
    rotationControllerAxisY.getValue(),
    rotationControllerAxisZ.getValue(),
  ]);
});

const rotationControllerAxisZ = rotation.add(options, 'rotationZ', -90, 90);
rotationControllerAxisZ.onChange(function () {
  gltfMarker.setRotation([
    rotationControllerAxisX.getValue(),
    rotationControllerAxisY.getValue(),
    rotationControllerAxisZ.getValue(),
  ]);
});

const scale = gui.addFolder('scale');
scale.open();

const scaleControllerX = scale.add(options, 'scaleX', 0.1, 20);
scaleControllerX.onChange(function (value) {
  gltfMarker.setScale([
    value,
    scaleControllerY.getValue(),
    scaleControllerZ.getValue(),
  ]);
});

const scaleControllerY = scale.add(options, 'scaleY', 0.1, 20);
scaleControllerY.onChange(function (value) {
  gltfMarker.setScale([
    scaleControllerX.getValue(),
    value,
    scaleControllerZ.getValue(),
  ]);
});

const scaleControllerZ = scale.add(options, 'scaleZ', 0.1, 20);
scaleControllerZ.onChange(function (value) {
  gltfMarker.setScale([
    scaleControllerX.getValue(),
    scaleControllerY.getValue(),
    value,
  ]);
});
