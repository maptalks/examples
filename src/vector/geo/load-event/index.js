const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 15,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const layer = new maptalks.GeoJSONVectorTileLayer('geo', {
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [120.1862434, 30.31784858],
        },
        properties: {},
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [120.194314, 30.34644838],
        },
        properties: {},
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [120.1911453, 30.33728535],
        },
        properties: {},
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [120.1924787, 30.32657846],
        },
        properties: {},
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [120.1723801, 30.27646996],
        },
        properties: {},
      },
    ],
  },
});

layer.on('dataload', (e) => {
  map.fitExtent(e.extent);
  document.getElementById('info').innerHTML = 'Data loading completed';
});

layer.setStyle({
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
});

const groupLayer = new maptalks.GroupGLLayer('group', [layer]);
groupLayer.addTo(map);
