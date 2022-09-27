const map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const pointLayer = new maptalks.PointLayer('point', {
  hitDetect: false,
});

const marker = new maptalks.Marker(map.getCenter(), {
  symbol: {
    textFaceName: 'sans-serif',
    textName: 'MapTalks',
    textFill: '#22be9e',
    textSize: 40,
  },
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer('group', [pointLayer]);
groupLayer.addTo(map);
