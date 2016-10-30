
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var line = new maptalks.LineString([[-0.113049,51.49856], [-0.123049,51.49856]], {
  symbol:{
    'lineColor' : {
      type : 'linear',
      colorStops : [
                [0.00, 'red'],
                [1 / 4, 'orange'],
                [2 / 4, 'green'],
                [3 / 4, 'aqua'],
                [1.00, 'white']
      ]
    },
    'lineWidth' : 10,
    'lineOpacity' : 1
  }
}).addTo(layer);

var line1 = new maptalks.LineString([[-0.113049,51.48856], [-0.133049,51.48856]], {
  symbol:{
    'lineColor' : {
      type : 'radial',
      colorStops : [
                [0.00, 'red'],
                [1 / 3, 'orange'],
                [2 / 3, 'green'],
                [1.00, 'white']
      ]
    },
    'lineWidth' : 10,
    'lineOpacity' : 1
  }
}).addTo(layer);
