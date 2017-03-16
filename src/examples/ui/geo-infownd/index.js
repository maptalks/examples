
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);
var geometry = new maptalks.Marker([-0.113049,51.49856]).addTo(layer);

var options = {
  'title'     : 'Title',
  'content'   : 'Content'
};
var infoWindow = new maptalks.ui.InfoWindow(options);
infoWindow.addTo(geometry).show(geometry.getCenter());
