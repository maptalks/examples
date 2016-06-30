
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var src = new maptalks.Polygon([
  [121.465345, 31.236732],
  [121.459953, 31.225678],
  [121.463234, 31.218754]
], {
  symbol: {
    lineColor: '#ace',
    lineWidth: 2
  }
}).addTo(layer);

var dst = new maptalks.Polygon([
  [121.495345, 31.236832],
  [121.489933, 31.225578],
  [121.493234, 31.218854]
], {
  symbol: {
    lineColor: '#fed',
    lineWidth: 2
  }
}).addTo(layer);

var line = new maptalks.ConnectorLine(src, dst, {
  symbol: {
    curveType: 1,
    lineColor: 'SlateBlue',
    lineWidth: 2
  }
}).addTo(layer);
