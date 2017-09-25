var map = new maptalks.Map('map', {
  center:     [-0.113049,51.498568],
  zoom:  6,
  baseLayer : new maptalks.WMSTileLayer('wms', {
    'urlTemplate' : 'https://demo.boundlessgeo.com/geoserver/ows',
    'crs' : 'EPSG:3857',
    'layers' : 'ne:ne',
    'styles' : '',
    'version' : '1.3.0',
    'format': 'image/png',
    'transparent' : true,
    'uppercase' : true
  }),
  attribution: {
    content: '&copy BoudlessGeo'
  }
});
