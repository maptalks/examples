var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var attribution = new maptalks.control.Attribution({
  // change default position
  position: {
    bottom: 20,
    right: 75
  }
});
map.addControl(attribution);
