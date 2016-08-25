
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker = new maptalks.Marker(
  map.getCenter(),
  {
    'symbol' : [
      {
        'markerType' : 'ellipse',
        'markerFill' : '#fff',
        'markerFillOpacity' : 1,
        'markerWidth' : 20,
        'markerHeight' : 20,
        'markerLineWidth' : 0
      },
      {
        'markerType' : 'ellipse',
        'markerFill' : '#1bc8ff',
        'markerFillOpacity' : 0.9,
        'markerWidth' : 55,
        'markerHeight' : 55,
        'markerLineWidth' : 0
      },
      {
        'markerType' : 'ellipse',
        'markerFill' : '#0096cd',
        'markerFillOpacity' : 0.8,
        'markerWidth' : 91,
        'markerHeight' : 91,
        'markerLineWidth' : 0
      },
      {
        'markerType' : 'ellipse',
        'markerFill' : '#0096cd',
        'markerFillOpacity' : 0.3,
        'markerWidth' : 130,
        'markerHeight' : 130,
        'markerLineWidth' : 0
      },
      {
        'markerType' : 'ellipse',
        'markerFill' : '#0096cd',
        'markerFillOpacity' : 0.2,
        'markerWidth' : 172,
        'markerHeight' : 172,
        'markerLineWidth' : 0
      }
    ]
  }
).addTo(layer);
