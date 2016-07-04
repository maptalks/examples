
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
var infoDom = document.getElementById('info');
infoDom.innerHTML = '<div>' + new Date().getTime() + ': Loading layer......</div>';

var layer = new maptalks.VectorLayer('vector').addTo(map);
var geometry = new maptalks.Marker([121.485428, 31.228541]).addTo(layer);
layer.on('layerload', function () {
  infoDom.innerHTML = infoDom.innerHTML + '<div>' + new Date().getTime() + ': Layer loaded successfully!</div>';
});
