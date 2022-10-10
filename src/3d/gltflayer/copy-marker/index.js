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

const url = '{res}/gltf/alien/alien.glb';
const symbol = {
  url: url,
  scale: [1.5, 1.5, 1.5],
};

const gltfLayer = new maptalks.GLTFLayer('gltf');
const position = map.getCenter();
const gltfMarker = new maptalks.GLTFMarker(position.add(-0.03, 0), {
  symbol: symbol,
}).addTo(gltfLayer);
const copyOne = gltfMarker.copy().addTo(gltfLayer);
copyOne.setCoordinates(position.add(0.03, 0));

const groupGLLayer = new maptalks.GroupGLLayer('gl', [gltfLayer]).addTo(map);
