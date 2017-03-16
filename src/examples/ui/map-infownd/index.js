
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var options = {
  'title'     : 'Title',
  'content'   : 'Content'
};
var infoWindow = new maptalks.ui.InfoWindow(options);
infoWindow.addTo(map).show(map.getCenter());

