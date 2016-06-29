
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

var rect1 = new maptalks.Rectangle([121.485428, 31.238541], 600, 600, {
    symbol:{
        'polygonFill' : {
            type : 'linear',
            places : [0.5, 0.5, 1, 0.5],
            colorStops : [
                [0.00, 'red'],
                [1 / 6, 'orange'],
                [2 / 6, 'yellow'],
                [3 / 6, 'green'],
                [4 / 6, 'aqua'],
                [5 / 6, 'blue'],
                [1.00, 'white'],
            ]
        },
        'polygonOpacity' : 1
    }
});
layer.addGeometry(rect1);

var rect = new maptalks.Rectangle([121.485428, 31.228541], 600, 600, {
    symbol:{
        'polygonFill' : {
            type : 'radial',
            places : [0.5, 0.5, 1, 0.5, 0.5, 0],
            colorStops : [
                [0.00, 'red'],
                [1 / 6, 'orange'],
                [2 / 6, 'yellow'],
                [3 / 6, 'green'],
                [4 / 6, 'aqua'],
                [5 / 6, 'blue'],
                [1.00, 'white'],
            ]
        },
        'polygonOpacity' : 1
    }
});
layer.addGeometry(rect);


