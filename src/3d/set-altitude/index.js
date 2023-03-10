
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

var offset = 0.001;
var center = map.getCenter();
var c1 = center.add(-offset, 0);
var c2 = center.add(offset, 0);

var c3 = center.add(offset / 2, offset / 2);

var c11 = c1.add(0, offset);
var c22 = c2.add(0, offset);

c1 = c1.toArray();
c2 = c2.toArray();
c3 = c3.toArray();
c11 = c11.toArray();
c22 = c22.toArray();

var layer = new maptalks.VectorLayer('layer', {
  enableAltitude: true
}).addTo(map);

var polygon = new maptalks.Polygon([[c11, c22, c3]]);
layer.addGeometry(polygon);
var line = new maptalks.LineString([c1, c2]);
layer.addGeometry(line);

var point = new maptalks.Marker(c1);
layer.addGeometry(point);


var uiMarker = new maptalks.ui.UIMarker(c2, {
  content: '<div class="text-marker">maptalks</div>',
  verticalAlignment: 'top'
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

on(getEle('#altitude'), 'change', function (e) {
  [point, uiMarker, line, polygon].forEach(function (geo) {
    geo.setAltitude(parseFloat(e.target.value));
  });
});

