const map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 12,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const lineLayer = new maptalks.LineStringLayer('linelayer');
const line = new maptalks.LineString(
  [
    map.getCenter().sub(0.1, 0),
    map.getCenter().add(0.1, 0),
    map.getCenter().add(0.1, -0.1),
  ],
  {
    symbol: {
      lineColor: '#1bbc9b',
      lineWidth: 5,
      lineStrokeColor: [0.8, 0.2, 0.2],
      lineStrokeWidth: 2,
      lineOpacity: 1,
    },
  }
).addTo(lineLayer);

const groupLayer = new maptalks.GroupGLLayer('group', [lineLayer]).addTo(map);
