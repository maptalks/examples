
var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

function dragOn() {
  map.config('draggable', true);
}
function dragOff() {
  map.config('draggable', false);
}
function zoomOn() {
  map.config('zoomable', true);
}
function zoomOff() {
  map.config('zoomable', false);
}
function scrollOn() {
  map.config('scrollWheelZoom', true);
}
function scrollOff() {
  map.config('scrollWheelZoom', false);
}
function touchZoomOn() {
  map.config('touchZoom', true);
}
function touchZoomOff() {
  map.config('touchZoom', false);
}
function dblClickOn() {
  map.config('doubleClickZoom', true);
}
function dblClickOff() {
  map.config('doubleClickZoom', false);
}
function borderPanOn() {
  map.config('autoBorderPanning', true);
}
function borderPanOff() {
  map.config('autoBorderPanning', false);
}
