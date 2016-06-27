
var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var zoomControl = new maptalks.control.Zoom({
    'position'  : maptalks.Control['top_right'],
    'slider'    : true,
    'zoomLevel' : true
});
map.addControl(zoomControl);

function hideControl() {
  if(zoomControl.isVisible()) zoomControl.hide();
}

function showControl() {
  if(zoomControl.isVisible()) {
    zoomControl.show();
  } else {
    map.addControl(zoomControl);
  }
}

function removeControl() {
  zoomControl.remove();
}
