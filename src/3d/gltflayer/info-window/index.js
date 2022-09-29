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

const url = 'alien.glb';
const symbol = {
  url: url,
  scale: [1.5, 1.5, 1.5],
};

const gltfLayer = new maptalks.GLTFLayer('gltf');
const position = map.getCenter();
const gltfMarker = new maptalks.GLTFMarker(position, {
  symbol: symbol,
}).addTo(gltfLayer);

gltfMarker.setInfoWindow({
  title: 'GLTFMarker InfoWindow',
  content: 'Click on marker to open.',
  dy: -20,
  dx: 15,
});

gltfMarker.openInfoWindow();
const groupGLLayer = new maptalks.GroupGLLayer('gl', [gltfLayer]).addTo(map);
