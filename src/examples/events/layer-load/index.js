
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
var infoDom = document.getElementById('info');
infoDom.innerHTML = '<div>' + new Date().getTime() + ': Loading layer......</div>';

var layer = new maptalks.VectorLayer('vector').addTo(map);
var geometry = new maptalks.Marker([-0.113049,51.498568]).addTo(layer);
layer.on('layerload', function () {
  infoDom.innerHTML = infoDom.innerHTML + '<div>' + new Date().getTime() + ': Layer loaded successfully!</div>';
});
