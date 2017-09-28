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

var layer = new maptalks.VectorLayer('v').addTo(map);
var markerLayer = new maptalks.VectorLayer('markers').addTo(map);
// the square
var polygon = new maptalks.Polygon([
    [-0.103049, 51.508568],
    [-0.116049, 51.508568],
    [-0.116049, 51.493568],
    [-0.103049, 51.493568]
], {
  symbol : {
    'lineWidth' : 3,
    'lineColor' : '#223548'
  }
}).addTo(layer);

// add markers on map
// set to green if inside the square
// set to red if outside the square
map.on('click', function (e) {
  var marker = new maptalks.Marker(e.coordinate);
  if (polygon.containsPoint(e.containerPoint)) {
    marker.updateSymbol({
      markerFill : '#0e595e'
    });
  }
  marker.addTo(markerLayer);
});

//clear markers when right click
map.on('contextmenu', function () {
  markerLayer.clear();
});
