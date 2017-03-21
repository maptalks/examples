var res = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;
if (res) {
  var canvas = document.getElementById('map');
  var r = window.devicePixelRatio;
  canvas.width *= r;
  canvas.height *= r;
  canvas.style.cssText += 'width:' + Math.round(canvas.width / r) + 'px;height:' + Math.round(canvas.height / r) + 'px';
}

var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
