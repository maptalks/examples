var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  // change default attribution content
  attribution: {
    content: 'One Attribution Control'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

// another attribution control
var attribution = new maptalks.control.Attribution({
  content: 'Another Attribution Control',
  position: {
    top: 5,
    right: 5
  }
});
map.addControl(attribution);
