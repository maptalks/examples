
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('tile', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector');
map.addLayer(layer);
var symbol = {
    'textName'          : 'TEXT MARKER',
    'textFaceName'      : 'monospace',
    'textSize'          : 12,
    'textFill'          : '#6fa8dc',
    'textOpacity'       : 1,
    'textHaloFill'      : '#ffffff',
    'textHaloRadius'    : 0,
    'textLineSpacing'   : 0,
    'textHorizontalAlignment' : 'middle',
    'textVerticalAlignment'   : 'middle',
    'textAlign'               : 'center'
};
var geometry = new maptalks.Marker([121.485428, 31.228541], {'symbol' : symbol});
layer.addGeometry(geometry);
