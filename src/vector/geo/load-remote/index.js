const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 15,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const style = {
  style: [
    {
      filter: true,
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
        markerType: 'ellipse',
        markerFill: '#1bbc9b',
        markerFillOpacity: 1,
        markerHeight: 21,
        markerWidth: 21,
      },
    },
  ],
};

const layer = new maptalks.GeoJSONVectorTileLayer('geo', {
  data: 'area.geojson',
  style,
});

layer.on('dataload', (e) => {
  map.fitExtent(e.extent);
});

const groupLayer = new maptalks.GroupGLLayer('group', [layer]);
groupLayer.addTo(map);
