var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var options = {
  'title'     : 'Map\' InfoWindow',
  'content'   : 'Click on map to reopen'
};
var infoWindow = new maptalks.ui.InfoWindow(options);
infoWindow.addTo(map).show();

map.on('click', function (e) {
  infoWindow.show(e.coordinate);
});
