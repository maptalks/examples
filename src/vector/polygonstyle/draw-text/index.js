const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
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
        type: 'fill',
      },
      symbol: {
        polygonBloom: false,
        polygonFill: '#577570',
        polygonOpacity: 1,
        polygonPatternFile: null,
      },
    },
    {
      filter: ['all', ['==', '$layer', 'building'], ['==', '$type', 'Polygon']],
      renderPlugin: {
        dataConfig: {
          type: 'point',
        },
        sceneConfig: {
          collision: true,
          fading: false,
          depthFunc: 'always',
        },
        type: 'text',
      },
      symbol: {
        textFaceName: 'Microsoft YaHei,sans-serif',
        textName: '{name}',
        textPitchAlignment: 'map',
        textPlacement: 'point',
        textSize: 12,
        textFill: '#fff',
        textWrapWidth: 40,
      },
    },
  ],
};
vt.setStyle(style);

const sceneConfig = {
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
    },
  },
};

const groupLayer = new maptalks.GroupGLLayer('group', [vt], {
  sceneConfig,
});
groupLayer.addTo(map);
