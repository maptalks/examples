
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var options = {
  'items'  : [
        {item: 'item1', click: function () { alert('Click item1'); }},
    '-',
        {item: 'item2', click: function () { alert('Click item2'); }}
  ]
};
map.setMenu(options).openMenu();
