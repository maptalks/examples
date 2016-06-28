
var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
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

