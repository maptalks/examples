
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  centerCross: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

map.on('zoomend moving moveend', getStatus);

getStatus();

function getStatus() {
  var extent = map.getExtent(),
    ex = [
      '{',
      'xmin:' + extent.xmin.toFixed(5),
      ', ymin:' + extent.ymin.toFixed(5),
      ', xmax:' + extent.xmax.toFixed(5),
      ', ymax:' + extent.xmax.toFixed(5),
      '}'
    ].join('');
  var center = map.getCenter();
  var mapStatus = [
    'Center : [' + [center.x.toFixed(5), center.y.toFixed(5)].join() + ']',
    'Extent : ' + ex,
    'Size : ' + map.getSize().toArray().join(),
    'Zoom : '   + map.getZoom(),
    'MinZoom : ' + map.getMinZoom(),
    'MaxZoom : ' + map.getMaxZoom(),
    'Projection : ' + map.getProjection().code
  ];

  document.getElementById('status').innerHTML = '<pre>' + mapStatus.join('\n') + '</pre>';
}

