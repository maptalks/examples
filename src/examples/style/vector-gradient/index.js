
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker = new maptalks.Marker([-0.113049,51.49856], {
  symbol:{
    'markerType' : 'ellipse',
    'markerFill' : {
      type : 'linear',
      colorStops : [
                  [0.00, 'red'],
                  [1 / 6, 'orange'],
                  [2 / 6, 'yellow'],
                  [3 / 6, 'green'],
                  [4 / 6, 'aqua'],
                  [5 / 6, 'blue'],
                  [1.00, 'white']
      ]
    },
    'markerFillOpacity' : 1,
    'markerWidth' : 100,
    'markerHeight' : 100
  }
}).addTo(layer);
