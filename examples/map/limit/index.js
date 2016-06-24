
var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var zoom = map.getZoom(),
    extent = map.getExtent();

map.setMinZoom(zoom - 2);
map.setMaxZoom(zoom + 1);
map.setMaxExtent(extent);