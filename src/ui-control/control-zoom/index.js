var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  zoomControl: {
    'position'  : 'top-left',
    'zoomLevel' : true
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var noZoomLevel = new maptalks.control.Zoom({
  'position'  : 'top-right',
  'zoomLevel' : false
});
map.addControl(noZoomLevel);

var noSlider = new maptalks.control.Zoom({
  'position'  : 'bottom-right',
  'zoomLevel' : true
});
map.addControl(noSlider);

var customPosition = new maptalks.control.Zoom({
  'position'  : { 'bottom' : '20', 'left' : '20' },
  'zoomLevel' : false
});
map.addControl(customPosition);
