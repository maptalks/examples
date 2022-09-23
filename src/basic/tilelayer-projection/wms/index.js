var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 6,
  spatialReference: {
    projection: 'EPSG:4326'
  },
  baseLayer: new maptalks.WMSTileLayer('wms', {
    'tileSystem': [1, -1, -180, 90],
    'urlTemplate': 'https://ows.terrestris.de/osm/service',
    'crs': 'EPSG:4326',
    'layers': 'OSM-WMS',
    'styles': '',
    'version': '1.3.0',
    'format': 'image/png',
    'transparent': true,
    'uppercase': true
  }),
  attribution: {
    content: '&copy ows.terrestris.de'
  }
});
