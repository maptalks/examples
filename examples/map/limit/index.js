
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  centerCross : true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var zoom = map.getZoom(),
  extent = map.getExtent();

map.setMinZoom(zoom - 2);
map.setMaxZoom(zoom + 1);
map.setMaxExtent(extent);

new maptalks.VectorLayer('v')
  .addGeometry(new maptalks.Polygon(extent.toArray()).updateSymbol({'polygonOpacity':0, 'lineWidth':5}))
  .addTo(map);
