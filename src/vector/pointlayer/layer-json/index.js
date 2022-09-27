const c = [-0.113049, 51.498568];
const map = new maptalks.Map('map', {
  center: c,
  zoom: 13,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const map1 = new maptalks.Map('map1', {
  center: c,
  zoom: 13,
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

const groupLayer = new maptalks.GroupGLLayer('group', [pointLayer]);
groupLayer.addTo(map);

maptalks.Layer.fromJSON(map.getLayer('group').toJSON()).addTo(map1);
