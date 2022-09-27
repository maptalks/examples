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

const marker = new maptalks.Marker(c, {
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

const pointLayer1 = new maptalks.PointLayer('point1');
maptalks.Geometry.fromJSON(marker.toJSON()).addTo(pointLayer1);
const groupLayer1 = new maptalks.GroupGLLayer('group1', [pointLayer1]);
groupLayer1.addTo(map1);
