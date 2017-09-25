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
function toolbar(text) {
  var toolbar = new maptalks.control.Toolbar({
    position: 'top-right',
    items: [{
      item: text,
      click: function () {}
    }]
  });
  return toolbar;
}
toolbar('<div class="attr">Click around the square<br>Right click to clear</div>').addTo(map);
//<<<<<<<< prepare data
var layer = new maptalks.VectorLayer('v').addTo(map),
  markerLayer = new maptalks.VectorLayer('markers').addTo(map);
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
//>>>>>>>>
map.on('click', function (e) {
  var marker = new maptalks.Marker(e.coordinate);
  if (polygon.containsPoint(e.containerPoint)) {
    marker.updateSymbol({
      markerFill : '#0e595e'
    });
  }
  marker.addTo(markerLayer);
});

map.on('contextmenu', function () {
  markerLayer.clear();
});
