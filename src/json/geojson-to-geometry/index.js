var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  }),
  layers : [
    new maptalks.VectorLayer('v')
  ]
});

var json = {
  'type': 'Feature',
  'geometry': {
    'type': 'Point',
    'coordinates': [-0.113049,51.498568]
  },
  'properties': {
    'name': 'point marker'
  }
};
var marker = maptalks.GeoJSON.toGeometry(json).addTo(map.getLayer('v'));
