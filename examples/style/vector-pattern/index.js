
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

var vector = new maptalks.Marker([121.485428, 31.228541], {
  symbol:{
    'markerType' : 'ellipse',
    'markerFillPatternFile' : 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Marker-Outside-Azure-icon.png',
    'markerFillOpacity': 1,
    'markerWidth' : 100,
    'markerHeight' : 100
  }
});
layer.addGeometry(vector);
