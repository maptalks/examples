const map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const map1 = new maptalks.Map('map1', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const lineLayer = new maptalks.LineStringLayer('linelayer').addTo(map);
const line = new maptalks.LineString(
  [
    [-0.131049, 51.498568],
    [-0.107049, 51.498568],
    [-0.107049, 51.483568],
  ],
  {
    symbol: {
      lineColor: '#1bbc9b',
      lineWidth: 3,
    },
  }
).addTo(lineLayer);

maptalks.LineStringLayer.fromJSON(map.getLayer('linelayer').toJSON()).addTo(
  map1
);
