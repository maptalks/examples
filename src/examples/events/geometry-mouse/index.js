
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
var layer = new maptalks.VectorLayer('vector').addTo(map);
var marker = new maptalks.Marker([-0.113049,51.498568]).addTo(layer);
var rect = new maptalks.Rectangle([-0.113049,51.496568], 1000, 800).addTo(layer);

marker.on('click', function () {
  printEvents('marker');
});
rect.on('click', function () {
  printEvents('rectangle');
});
function printEvents(str) {
  var infoDom = document.getElementById('info');
  infoDom.innerHTML = infoDom.innerHTML + '<div>' + new Date().getTime() + ': Your click ' + str + '!</div>';
}
