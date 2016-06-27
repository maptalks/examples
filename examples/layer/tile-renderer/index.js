
var map1 = new maptalks.Map('map-on-dom', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    baseLayerRenderer: 'dom',
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var map1Size = map1.getSize();
var map2container = document.querySelector('#map-on-canvas');
map2container.width = map1Size.width;
map2container.height = map1Size.height;

var map2 = new maptalks.Map('map-on-canvas', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    'crossOrigin' : 'anonymous',
    baseLayerRenderer: 'canvas',
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
