const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const pointLayer = new maptalks.PointLayer('point');

const marker = new maptalks.Marker([-74.00912099912109, 40.71107610933129], {
  symbol: {
    markerFile: '1.jpg',
    markerWidth: 40,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer('group', [pointLayer]);
groupLayer.addTo(map);
