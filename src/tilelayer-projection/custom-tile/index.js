// A complete customized TileLayer
// Radius of the earth
var earchRadiusInMeters = 6378137;
var inchPerMeter = 1 / 0.0254;
var meterPerMapUnit = (Math.PI * 2 * earchRadiusInMeters) / 360;

function replaceURL(url, x, y, scale) {
  var str = ['x', x, 'y', y, 'scale', scale];
  for (var i = 0, len = str.length; i < len; i += 2) {
    url = url.replace('{' + str[i] + '}', str[i + 1]);
  }
  return url;
}

function resolutionToScale(resolution, dpi) {
  var scale = resolution * dpi * inchPerMeter * meterPerMapUnit;
  scale = 1 / scale;
  return scale;
}


var parmas = {
  zooms: 5,
  firstRes: 0.009507170090264933,
  origin: [114.59, 42.31],
  maxBounds: [
    [-180, -90],
    [180, 90]
  ]
};

var url =
  'https://iserver.supermap.io/iserver/services/map-jingjin/rest/maps/%E4%BA%AC%E6%B4%A5%E5%9C%B0%E5%8C%BA%E5%9C%B0%E5%9B%BE/tileImage.png?width=256&height=256&redirect=false&transparent=true&cacheEnabled=true&origin=%7B%22x%22%3A114.59%2C%22y%22%3A42.31%7D&overlapDisplayed=false&scale={scale}&x={x}&y={y}';
var res = [];
for (var i = 0; i <= parmas.zooms; i++) {
  res.push(parmas.firstRes / Math.pow(2, i));
}
var crs = {
  projection: 'EPSG:4326',
  resolutions: res,
  fullExtent: {
    top: 42.31,
    left: 114.59,
    bottom: 37.44232891378436,
    right:  119.45767108621564
  }
};

var tileLayer = new maptalks.TileLayer('base', {
  repeatWorld: true,
  urlTemplate: url,
  spatialReference: crs,
  subdomains: ['a', 'b', 'c', 'd'],
  attribution:
    '&copy; <a href="https://www.supermap.com/cn/">supermap</a> contributors',
  tileSystem: [1, -1].concat(parmas.origin) // tile system
});

// custom tilelayer getTileUrl
tileLayer.getTileUrl = function (x, y, z) {
  this.scales = this.scales || {};
  if (this.scales[z]) {
    return replaceURL(this.options.urlTemplate, x, y, this.scales[z]);
  }
  var crs = this.getMap().getSpatialReference().getProjection();
  var bounds = this._getTileExtent(x, y, z);
  var min = bounds.getMin(),
    max = bounds.getMax();
  var ne = crs.project(max);
  var sw = crs.project(min);
  var tileSize = this.options.tileSize[0];
  var resolution = Math.max(
    Math.abs(ne.x - sw.x) / tileSize,
    Math.abs(ne.y - sw.y) / tileSize
  );
  var scale = resolutionToScale(resolution, 96);
  this.scales[z] = scale;
  return replaceURL(this.options.urlTemplate, x, y, this.scales[z]);
};

tileLayer._getTileExtent = function (x, y, z) {
  var map = this.getMap(),
    res = map._getResolution(z),
    tileConfig = this._getTileConfig(),
    tileExtent = tileConfig.getTilePrjExtent(x, y, res);
  return tileExtent;
};

var map = new maptalks.Map('map', {
  center: [116.85, 39.79],
  // pitch:40,
  zoom: 0,
  spatialReference: crs,
  baseLayer: tileLayer
});
