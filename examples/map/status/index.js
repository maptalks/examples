
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var extent = map.getExtent(),
  ex = [
    '{',
    '  xmin:' + extent.xmin,
    '  ymin:' + extent.ymin,
    '  xmax:' + extent.xmax,
    '  ymax:' + extent.xmax,
    '}'
  ].join('\n');

var mapStatus = [
  'Center : \n[' + map.getCenter().toArray().join() + ']',
  'Extent : \n' + ex,
  'Size :' + map.getSize().toArray().join(),
  'Zoom : '   + map.getZoom(),
  'MinZoom : ' + map.getMinZoom(),
  'MaxZoom : ' + map.getMaxZoom(),
  'Projection : ' + map.getProjection().code
];


var content = '<pre>' + mapStatus.join('\n') + '</pre>';
document.getElementById('status').innerHTML = content;
