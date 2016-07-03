
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var drawTool = new maptalks.DrawTool({
  mode: 'Point'
}).addTo(map).disable();

drawTool.on('drawend', function (param) {
  layer.addGeometry(param.geometry);
});

var modeButtonList = Array.prototype.slice.call(document.querySelectorAll('#middle button'));
modeButtonList.forEach(function (el) {
  el.addEventListener('click', function () {
    drawTool.setMode(el.id).enable();
  });
});

document.querySelector('#disable').addEventListener('click', function (event) {
  drawTool.disable();
});

document.querySelector('#clear').addEventListener('click', function () {
  layer.clear();
});
