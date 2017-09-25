
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
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
