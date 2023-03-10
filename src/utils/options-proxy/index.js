
var baseLayer = new maptalks.TileLayer('base', {
  urlTemplate: '$(urlTemplate)',
  subdomains: $(subdomains),
  attribution: '$(attribution)'
});
var map = new maptalks.Map('map', {
  center: [100.63299495279648, 30.895363667711848],
  zoom: 3,
  pitch: 0,
  attribution: true,
  zoomControl: true,
  baseLayer: baseLayer
});
map.on('click', function (e) {
  console.log(e);
});

var layer = new maptalks.VectorLayer('layer').addTo(map);
var point = new maptalks.Marker(map.getCenter());
layer.addGeometry(point);

var uiMarker = new maptalks.ui.UIMarker(map.getCenter(), {
  content: '<div class="text_marker">maptalks</div>',
  dy: -100
}).addTo(map);

function getEle(selector) {
  if (document.querySelector) {
    return document.querySelector(selector);
  }
  return document.getElementById(selector.substring(1, Infinity));
}

function on(ele, type, hanlder) {
  ele.addEventListener(type, hanlder);
}

on(getEle('#centercross'), 'change', function (e) {
  map.options.centerCross = this.checked;
});

on(getEle('#layeropacity'), 'change', function (e) {
  baseLayer.options.opacity = parseFloat(this.value);
  layer.options.opacity = parseFloat(this.value);
});

on(getEle('#visible'), 'change', function (e) {
  baseLayer.options.visible = this.checked;
  layer.options.visible = this.checked;
  uiMarker.options.visible = this.checked;
});
