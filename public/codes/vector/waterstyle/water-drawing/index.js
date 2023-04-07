const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const vt = new maptalks.VectorTileLayer('vt', {
  urlTemplate: 'http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt',
  spatialReference: 'preset-vt-3857',
});

const style = {
  style: [
    {
      filter: ['all', ['==', '$layer', 'building'], ['==', '$type', 'Polygon']],
      renderPlugin: {
        dataConfig: {
          type: 'fill',
        },
        sceneConfig: {},
        type: 'water',
      },
      symbol: {
        ssr: true,
        texWaveNormal: '{res}/textures/texWaveNormal.png',
        texWavePerturbation: '{res}/textures/texWavePerturbation.png',
        waterBaseColor: [
          0.611764705882353, 0.7529411764705882, 0.9764705882352941, 1,
        ],
        contrast: 1.425,
        hsv: [0, -0.596, 0],
        uvScale: 3,
        animation: true,
        waterSpeed: 1,
        waterDirection: 0,
      },
    },
  ],
};
vt.setStyle(style);

const groupLayer = new maptalks.GroupGLLayer('group', [vt]);
groupLayer.addTo(map);
