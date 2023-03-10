
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
map.on('click', function (e) {
  console.log(e);
});


var center = map.getCenter();

var layer = new maptalks.VectorLayer('layer', {
  enableAltitude: true
}).addTo(map);
var point = new maptalks.Marker(center, {
  symbol: {
    markerType: 'ellipse',
    markerWidth: 5,
    markerHeight: 5
  }
});
layer.addGeometry(point);

var uiMarker = new maptalks.ui.UIMarker(center, {
  content: '<div class="text_marker">maptalks</div>'
});
uiMarker.addTo(map);

function getEle(selector) {
  if (document.querySelector) {
    return document.querySelector(selector);
  }
  return document.getElementById(selector.substring(1, Infinity));
}
function on(ele, type, hanlder) {
  ele.addEventListener(type, hanlder);
}

on(getEle('#horizontalAlignment'), 'change', function (e) {
  uiMarker.options.horizontalAlignment = this.value;
});

on(getEle('#verticalAlignment'), 'change', function (e) {
  uiMarker.options.verticalAlignment = this.value;
});

