
var baseLayer = new maptalks.TileLayer('base', {
  urlTemplate: '$(urlTemplate)',
  subdomains: $(subdomains),
  attribution: '$(attribution)'
});
var map = new maptalks.Map('map', {
  center: [114.26012989831725, 30.616193225646924],
  zoom: 18,
  pitch: 60,
  attribution: true,
  zoomControl: true,
  baseLayer: baseLayer
});



var layer = new maptalks.VectorLayer('layer', {

}).addTo(map);
var point = new maptalks.Marker(map.getCenter());
layer.addGeometry(point);
point.setInfoWindow({
  title: 'hello maptalks',
  content: '<div class="info-content"><video controls width="450" height="300" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video></div>'
});
point.openInfoWindow();


