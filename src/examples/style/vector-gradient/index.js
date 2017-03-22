var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker = new maptalks.Marker([-0.109049,51.49856], {
  symbol:{
    'markerType' : 'ellipse',
    'markerFill' : {
      'type' : 'linear',
      'places' : [0, 0, 1, 1],
      'colorStops' : [
        [0.00, '#fff'],
        [0.50, '#fff27e'],
        [1, '#f87e4b']
      ]
    },
    'markerLineWidth' : 0,
    'markerWidth' : 100,
    'markerHeight' : 100
  }
}).addTo(layer);

var marker2 = new maptalks.Marker([-0.119049,51.49856], {
  symbol:{
    'markerType' : 'ellipse',
    'markerFill' : {
      'type' : 'radial',
      'colorStops' : [
        [0.00, 'rgba(216,115,149,0)'],
        [0.50, 'rgba(216,115,149,1)'],
        [1.00, 'rgba(216,115,149,1)']
      ]
    },
    'markerLineWidth' : 0,
    'markerWidth' : 100,
    'markerHeight' : 100
  }
}).addTo(layer);

