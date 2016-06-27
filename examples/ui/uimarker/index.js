
var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var coordinate = new maptalks.Coordinate(121.48542, 31.22854);
var marker = new maptalks.ui.UIMarker(coordinate, {
    'draggable'     : true,
    'single'        : false,
    'content'       : '<div class="text_marker">UI Marker</div>'
});
marker.addTo(map).show();
