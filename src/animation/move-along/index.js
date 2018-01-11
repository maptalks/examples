var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('vector', { forceRenderOnMoving : true }).addTo(map);
var marker = new maptalks.Marker(map.getCenter()).addTo(layer);

var start = map.getCenter(),
  // offset from line start to line end.
  offset = getOffset(),
  end = start.add(offset);

var arrow = new maptalks.LineString(
  [start, end],
  {
    'id' : 'arrow',
    'arrowStyle' : 'classic',
    'arrowPlacement' : 'vertex-last'
  }
)
.addTo(layer);

replay();

function replay() {
  marker.setCoordinates(start);
  marker.bringToFront().animate({
    //animation translate distance
    translate: [offset['x'], offset['y']]
  }, {
    duration: 2000,
    //let map focus on the marker
    focus : true
  });
}

function getOffset() {
  var center = map.getCenter();
  var extent = map.getExtent();
  marker.setCoordinates(center);
  return extent.getMax().sub(map.getCenter()).multi(1 / 2);
}
