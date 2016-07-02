
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

map.on('click', function () {
  var infoDom = document.getElementById('info');
  infoDom.innerHTML = infoDom.innerHTML + '<div>' + new Date().toLocaleTimeString() + ': Your click map!</div>';
});
