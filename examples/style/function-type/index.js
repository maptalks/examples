
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker = new maptalks.Marker([121.485428, 31.228541], {
  symbol : {
    'markerType' : 'ellipse',
    'markerWidth'  : 32,
    'markerHeight' : 32,
    'markerFill'  : {property:'num', type:'interval', stops: [[1, 'blue'], [5, 'yellow'], [10, 'red']]}
  },
  properties:{
    'num' : 6
  }
}).addTo(layer);
