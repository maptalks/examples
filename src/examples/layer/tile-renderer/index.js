
var map1 = new maptalks.Map('map-on-dom', {
  center: [-0.113049,51.498568],
  zoom: 14,
  layers : [
    new maptalks.TileLayer('base', {
      renderer: 'dom',
      urlTemplate: '$(urlTemplate)',
      subdomains: $(subdomains)
    })
  ],
  attribution : {
    position : 'top-right',
    content : '<div class="attr">dom renderer</div>'
  }
});

var map2 = new maptalks.Map('map-on-canvas', {
  center: [-0.113049,51.498568],
  zoom: 14,
  layers : [
    new maptalks.TileLayer('base', {
      renderer: 'canvas',
      urlTemplate: '$(urlTemplate)',
      subdomains: $(subdomains)
    })
  ],
  attribution : {
    position : 'top-right',
    content : '<div class="attr">canvas renderer</div>'
  }
});

