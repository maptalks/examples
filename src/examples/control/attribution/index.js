
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: {
    'position'  : 'top-right'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var attribution = new maptalks.control.Attribution({
  'position'  : { 'bottom': '20', 'right': '75' },
  'content'   : 'Powered by <a href="http://www.maptalks.org" target="_blank" style="text-decoration:none;cursor: pointer;color: #6490C4; ">maptalks</a>'
});
map.addControl(attribution);
