
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attributionControl: {
    'position'  : 'top-right'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var customContent = new maptalks.control.Attribution({
  'position'  : {'bottom': '0', 'right': '0'},
  'content'   : '<a href="http://www.maptalks.org" target="_blank" style="text-decoration:none;cursor: pointer;color: #6490C4; ">Attribution demo.</a>'
});
map.addControl(customContent);
