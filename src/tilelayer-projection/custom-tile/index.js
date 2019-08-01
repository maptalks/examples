// A complete customized TileLayer
var resolutions = [];
var d = 2 * 6378137 * Math.PI;
for (var i = 0; i < 21; i++) {
  resolutions[i] = d / (256 * Math.pow(2, i));
}

var map = new maptalks.Map('map', {
  center:     [-0.113049,51.498568],
  zoom:  13,
  // a custom version of default web-mercator spatial reference
  // map's spatial reference definition
  spatialReference : {
    projection : 'EPSG:3857', // geo projection, can be a string or a function
    resolutions : resolutions,
    fullExtent : {         // map's full extent
      'top': 6378137 * Math.PI,
      'left': -6378137 * Math.PI,
      'bottom': -6378137 * Math.PI,
      'right': 6378137 * Math.PI
    }
  },
  baseLayer : new maptalks.TileLayer('base',{
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
    tileSystem : [1, -1, -20037508.34, 20037508.34], // tile system
    minZoom : 1,
    maxZoom : 20
  })
});
