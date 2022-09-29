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
      resource: {
        url: 'env.hdr',
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
  this.visible = true;
};
const options = new Config();
const url = 'alien.glb';
const symbol = {
  url: url,
  shadow: true,
  scale: [2, 2, 2],
};

const gltfLayer = new maptalks.GLTFLayer('gltf');
const position = map.getCenter();
const gltfMarker = new maptalks.GLTFMarker(position, {
  symbol,
}).addTo(gltfLayer);

const groupGLLayer = new maptalks.GroupGLLayer('gl', [gltfLayer]).addTo(map);

//visible control
const visibleController = gui.add(options, 'visible');
visibleController.onChange(function (value) {
  if (!value) {
    gltfMarker.hide();
  } else {
    gltfMarker.show();
  }
});
