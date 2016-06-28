
var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector');
map.addLayer(layer);
var geometry = new maptalks.Marker([121.485428, 31.228541]);
layer.addGeometry(geometry);
var options = {
    'items'  : [
        {item: 'item1', click: function(){alert('Click item1')}},
        '-',
        {item: 'item2', click: function(){alert('Click item2')}}
    ]
};
geometry.setMenu(options).openMenu();
