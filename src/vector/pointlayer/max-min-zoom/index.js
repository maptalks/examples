const map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  zoomControl: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const point = new maptalks.PointLayer('point', {
  minZoom: 12,
  maxZoom: 16,
});

const marker = new maptalks.Marker(map.getCenter(), {
  symbol: {
    textName: 'Layer is add.',
    textWeight: 'bold',
    textSize: 50,
    textFill: '#1bbc9b',
    textHaloFill: '#fff',
    textHaloRadius: 5,
  },
}).addTo(point);

const groupLayer = new maptalks.GroupGLLayer('group', [point]);
groupLayer.addTo(map);
