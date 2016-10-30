
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var geoJSONs = [
  {'type': 'Point', 'coordinates': [-0.113049,51.498568]},
  {
    'type': 'LineString',
    'coordinates': [[-0.113049,51.508568], [-0.103049,51.508568]]
  },
  {
    'type': 'Polygon',
    'coordinates': [
      [-0.113049,51.498568],[-0.103049,51.495568],[-0.103049,51.488568],[-0.113049,51.498568]
    ]
  }
];
var layer = new maptalks.GeoJSONLayer('vector', geoJSONs).addTo(map);
