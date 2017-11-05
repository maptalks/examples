var map = new maptalks.Map('map', {
  center:     [-0.113049,51.498568],
  zoom:  6,
  pitch : 40,
  attribution: {
    content: '$(attribution), &copy; BoudlessGeo'
  },
  // add 2 TileLayers with a GroupTileLayer
  baseLayer : new maptalks.GroupTileLayer('base', [
    new maptalks.TileLayer('tile2', {
      urlTemplate: 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
      subdomains  : ['a','b','c','d']
    }),

    new maptalks.WMSTileLayer('wms', {
      'urlTemplate' : 'https://demo.boundlessgeo.com/geoserver/ows',
      'crs' : 'EPSG:3857',
      'layers' : 'ne:ne',
      'styles' : '',
      'version' : '1.3.0',
      'format': 'image/png',
      'transparent' : true,
      'uppercase' : true
    })
  ])
});
