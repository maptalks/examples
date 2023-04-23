const baseLayer = new maptalks.TileLayer("base", {
  urlTemplate: "{urlTemplate}",
  subdomains: ["a", "b", "c", "d"],
  attribution: "{attribution}",
});

const map = new maptalks.Map("map", {
  center: [100.63299495279648, 30.895363667711848],
  zoom: 3,
  pitch: 0,
  attribution: true,
  zoomControl: true,
  baseLayer: baseLayer,
});

const layer = new maptalks.VectorLayer("layer").addTo(map);
const point = new maptalks.Marker(map.getCenter());
layer.addGeometry(point);

const uiMarker = new maptalks.ui.UIMarker(map.getCenter(), {
  content: '<div class="text_marker">maptalks</div>',
  dy: -100,
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

on(getEle("#centercross"), "change", function () {
  map.options.centerCross = this.checked;
});

on(getEle("#layeropacity"), "change", function () {
  baseLayer.options.opacity = parseFloat(this.value);
  layer.options.opacity = parseFloat(this.value);
});

on(getEle("#visible"), "change", function () {
  baseLayer.options.visible = this.checked;
  layer.options.visible = this.checked;
  uiMarker.options.visible = this.checked;
});
