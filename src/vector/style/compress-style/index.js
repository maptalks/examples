const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
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
        type: 'fill',
      },
      symbol: {
        polygonBloom: false,
        polygonFill: [0.345, 0.345, 0.502, 1],
        polygonOpacity: 1,
        polygonPatternFile: null,
      },
    },
    {
      filter: ['all', ['==', '$layer', 'building'], ['==', '$type', 'Polygon']],
      renderPlugin: {
        dataConfig: {
          type: 'fill',
        },
        sceneConfig: {},
        type: 'fill',
      },
      symbol: {
        polygonBloom: false,
        polygonFill: [0.345, 0.345, 0.502, 1],
        polygonOpacity: 1,
        polygonPatternFile: null,
      },
    },
  ],
};
const compressedStyle = maptalks.VectorTileLayer.compressStyleJSON(style);
vt.setStyle(compressedStyle);

const groupLayer = new maptalks.GroupGLLayer('group', [vt]);
groupLayer.addTo(map);
