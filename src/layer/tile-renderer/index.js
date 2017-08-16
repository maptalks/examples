
function toolbar(text) {
  var toolbar = new maptalks.control.Toolbar({
    position: 'top-right',
    items: [{
      item: text,
      click: function () {}
    }]
  });
  return toolbar;
}

var map1 = new maptalks.Map('map-on-dom', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  layers : [
    new maptalks.TileLayer('base', {
      renderer: 'dom',
      urlTemplate: '$(urlTemplate)',
      subdomains: $(subdomains)
    })
  ]
});
toolbar('dom renderer').addTo(map1);

var map2 = new maptalks.Map('map-on-canvas', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  layers : [
    new maptalks.TileLayer('base', {
      renderer: 'canvas',
      urlTemplate: '$(urlTemplate)',
      subdomains: $(subdomains)
    })
  ]
});
toolbar('canvas renderer').addTo(map2);
