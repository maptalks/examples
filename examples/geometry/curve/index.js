
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var curve0 = new maptalks.CurveLine([
  [121.465345, 31.236732],
  [121.459953, 31.225678],
  [121.463234, 31.218754]
], {
  symbol: {
    curveType: 0,
    lineColor: '#ace',
    lineWidth: 2
  }
}).addTo(layer);

var curve1 = new maptalks.CurveLine([
  [121.475345, 31.236832],
  [121.469933, 31.225578],
  [121.473234, 31.218854]
], {
  symbol: {
    curveType: 1,
    lineColor: '#cef',
    lineWidth: 2
  }
}).addTo(layer);

var curve2 = new maptalks.CurveLine([
  [121.485345, 31.236832],
  [121.479933, 31.225578],
  [121.483234, 31.218854]
], {
  symbol: {
    curveType: 2,
    lineColor: '#d3d',
    lineWidth: 2
  }
}).addTo(layer);

var curve3 = new maptalks.CurveLine([
  [121.495345, 31.236832],
  [121.489933, 31.225578],
  [121.493234, 31.218854]
], {
  symbol: {
    curveType: 3,
    lineColor: '#fed',
    lineWidth: 2
  }
}).addTo(layer);
