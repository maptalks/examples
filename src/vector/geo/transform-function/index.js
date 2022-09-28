const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

// 输入的数据不是GeoJSON数据
const data = {
  properties: {
    adcode: '110000',
    name: '北京市',
    center: [116.405285, 39.904989],
    centroid: [116.41995, 40.18994],
    childrenNum: 16,
    level: 'province',
    parent: {
      adcode: 100000,
    },
    subFeatureIndex: 0,
    acroutes: [100000],
  },
  geometry: {
    type: 'Point',
    coordinates: [116.405285, 39.904989],
  },
};

const geo = new maptalks.GeoJSONVectorTileLayer('geo', {
  data,
  // 数据转换函数
  convertFn: function convert(data) {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: data.geometry,
          properties: data.properties,
        },
      ],
    };
  },
});

geo.on('dataload', (e) => {
  map.fitExtent(e.extent);
});

geo.setStyle({
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

const groupLayer = new maptalks.GroupGLLayer('group', [geo]);
groupLayer.addTo(map);
