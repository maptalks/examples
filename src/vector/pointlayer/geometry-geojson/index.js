const map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const pointLayer = new maptalks.PointLayer('point');

const marker = new maptalks.Marker([-0.113049, 51.498568], {
  properties: {
    name: 'point marker',
  },
}).addTo(pointLayer);

marker.setSymbol({
  textFaceName: 'sans-serif',
  textName: 'MapTalks',
  textFill: '#34495e',
  textSize: 40,
});

document.getElementById('info').innerHTML = JSON.stringify(marker.toGeoJSON());

const groupLayer = new maptalks.GroupGLLayer('group', [pointLayer]);
groupLayer.addTo(map);
