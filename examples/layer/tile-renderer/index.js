
var map1 = new maptalks.Map('map-on-dom', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    baseLayerRenderer: 'dom',
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

new maptalks.control.Toolbar({
  items: [
    {
      item: 'Tilelayer rendered on div'
    }
  ]
}).addTo(map1);


var map2 = new maptalks.Map('map-on-canvas', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    crossOrigin : 'anonymous',
    baseLayerRenderer: 'canvas',
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

new maptalks.control.Toolbar({
  items: [
    {
      item: 'Tilelayer rendered on canvas'
    }
  ]
}).addTo(map2);
