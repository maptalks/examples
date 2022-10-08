const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
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
        // 从数据的 icon 属性读取 markerType
        markerType: {
          type: 'identity',
          property: 'icon',
          default: 'ellipse',
        },
        markerFill: [0.53, 0.77, 0.94, 1],
        markerHeight: 20,
        markerWidth: 20,
        markerLineColor: [0.2, 0.29, 0.39, 1],
        markerLineWidth: 3,
      },
    },
  ],
};

const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.01138478352965, 40.71511786220489],
            [-74.01046210362853, 40.70690398234356],
            [-74.00097781255187, 40.71147460291118],
            [-74.01138478352965, 40.71511786220489],
          ],
        ],
      },
      properties: {
        icon: 'square',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.03138478352965, 40.71511786220489],
            [-74.03046210362853, 40.70690398234356],
            [-74.02097781255187, 40.71147460291118],
            [-74.03138478352965, 40.71511786220489],
          ],
        ],
      },
      properties: {
        icon: 'diamond',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.03138478352965, 40.70511786220489],
            [-74.03046210362853, 40.69690398234356],
            [-74.02097781255187, 40.70147460291118],
            [-74.03138478352965, 40.70511786220489],
          ],
        ],
      },
      properties: {
        icon: 'triangle',
      },
    },
  ],
};

const geo = new maptalks.GeoJSONVectorTileLayer('geo', {
  data,
  style,
});

geo.on('dataload', (e) => {
  map.fitExtent(e.extent);
});

const groupLayer = new maptalks.GroupGLLayer('group', [geo]);
groupLayer.addTo(map);
