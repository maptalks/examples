
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);
var marker = new maptalks.Marker([-0.113049,51.498568], {
  symbol:[
    {
      'markerType' : 'ellipse',
      'markerWidth' : 10,
      'markerHeight' : 10
    }
  ]
});

marker.addTo(layer).animate({
  symbol : [
    {
      'markerWidth' : 100,
      'markerHeight' : 100
    }
  ]
});
