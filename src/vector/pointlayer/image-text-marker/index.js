const map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const center = map.getCenter();

const pointLayer = new maptalks.PointLayer('point');

const marker = new maptalks.Marker([-0.113049, 51.49856], {
  properties: {
    name: 'Hello MapTalks',
  },
  symbol: [
    {
      markerFile: '1.png',
      markerWidth: 28,
      markerHeight: 40,
    },
    {
      textFaceName: 'sans-serif',
      textName: '{name}',
      textSize: 14,
      textDy: 24,
    },
  ],
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer('group', [pointLayer]);
groupLayer.addTo(map);
