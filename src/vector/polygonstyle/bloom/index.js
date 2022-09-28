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
        polygonBloom: true,
        polygonFill: [0.345, 0.345, 0.502, 1],
        polygonOpacity: 1,
      },
    },
  ],
};
vt.setStyle(style);

const groupLayer = new maptalks.GroupGLLayer('group', [vt], {
  // 需要先开启后处理中的bloom属性
  sceneConfig: {
    postProcess: {
      enable: true,
      bloom: {
        enable: true,
        threshold: 0.01,
        factor: 1,
        radius: 0.02,
      },
    },
  },
});
groupLayer.addTo(map);
