
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector');
map.addLayer(layer);

var line = new maptalks.LineString([[121.485428, 31.228541],[121.496428, 31.228541]], {
    symbol:{
        'lineColor' : {
            type : 'linear',
            colorStops : [
                [0.00, 'red'],
                [1 / 4, 'orange'],
                [2 / 4, 'green'],
                [3 / 4, 'aqua'],
                [1.00, 'white'],
            ]
        },
        'lineWidth' : 10,
        'lineOpacity' : 1,
        'polygonOpacity' : 0
    }
});
layer.addGeometry(line);

var line1 = new maptalks.LineString([[121.485428, 31.218541],[121.506428, 31.218541]], {
    symbol:{
        'lineColor' : {
            type : 'radial',
            colorStops : [
                [0.00, 'red'],
                [1 / 3, 'orange'],
                [2 / 3, 'green'],
                [1.00, 'white'],
            ]
        },
        'lineWidth' : 10,
        'lineOpacity' : 1,
        'polygonOpacity' : 0
    }
});
layer.addGeometry(line1);
