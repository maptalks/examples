const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 17,
  zoomControl: true,
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
          type: 'point',
        },
        sceneConfig: {
          collision: true,
          fading: false,
          depthFunc: 'always',
        },
        type: 'icon',
      },
      symbol: {
        visible: {
          // 只在 17 到 19 级之间显示
          type: 'interval',
          stops: [
            [0, false],
            [17, true],
            [19, false],
          ],
        },
        markerType: 'ellipse',
        markerHeight: 20,
        markerWidth: 20,
        markerFill: [0.53, 0.77, 0.94, 1],
        markerLineColor: [0.2, 0.29, 0.39, 1],
        markerLineWidth: 3,
      },
    },
  ],
};
vt.setStyle(style);

const groupLayer = new maptalks.GroupGLLayer('group', [vt]);
groupLayer.addTo(map);
