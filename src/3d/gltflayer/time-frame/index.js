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

const url = 'scene.gltf';
const symbol = {
  url: url,
  animation: true,
  loop: true,
  scale: [2, 2, 2],
  rotation: [0, 0, 180],
};

const gltfLayer = new maptalks.GLTFLayer('gltf');
const position = map.getCenter();
const gltfMarker = new maptalks.GLTFMarker(position, {
  symbol: symbol,
});

gltfLayer.addGeometry(gltfMarker);
const groupGLLayer = new maptalks.GroupGLLayer('gl', [gltfLayer], {
  sceneConfig,
}).addTo(map);

function setAnimationTimeFrame() {
  gltfMarker.setAnimationTimeframe(1000); // ms
  const renderer = gltfLayer.getRenderer();
  const meshes = renderer.getMarkerMeshes(gltfMarker);
  const nodeMatrix = meshes[0].nodeMatrix;
  document.getElementById('info').innerHTML = '矩阵:[' + nodeMatrix + ']';
}
