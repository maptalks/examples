var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  attribution: {
    position: 'top-right',
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var attribution = new maptalks.control.Attribution({
  position: {
    bottom: 20,
    right: 75
  },
  content: '$(attribution)'
});
map.addControl(attribution);
