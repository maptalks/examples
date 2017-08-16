var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var json = [
  { 'type': 'Point', 'coordinates': [-0.113049,51.498568] },
  {
    'type': 'LineString',
    'coordinates': [[-0.113049,51.498568], [-0.103049,51.498568]]
  },
  {
    'type': 'Polygon',
    'coordinates': [
      [-0.113049,51.498568],[-0.103049,51.495568],[-0.103049,51.488568]
    ]
  }
];

var layer = new maptalks.GeoJSONLayer('vector', json).addTo(map);

document.getElementById('json').innerHTML = json.map(function (s) {
  return JSON.stringify(s);
}).join('<br>');
