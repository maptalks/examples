
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
var layer = new maptalks.VectorLayer('vector').addTo(map);
var marker = new maptalks.Marker([121.485428, 31.228541]).addTo(layer);
var rect = new maptalks.Rectangle([121.485428, 31.226541], 1000, 800).addTo(layer);

var infoDom = document.getElementById('info');
marker.on('click', function () {
  printEvents('marker');
});
rect.on('click', function () {
  printEvents('rectangle');
});
function printEvents(str) {
  infoDom.innerHTML = infoDom.innerHTML + '<div>' + new Date().getTime() + ': Your click ' + str + '!</div>';
}
