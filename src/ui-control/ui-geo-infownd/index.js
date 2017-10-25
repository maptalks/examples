
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);
var marker = new maptalks.Marker([-0.113049,51.49856]).addTo(layer);

marker.setInfoWindow({
  'title'     : 'Marker\'s InfoWindow',
  'content'   : 'Click on marker to open.'

  // 'autoPan': true,
  // 'width': 300,
  // 'minHeight': 120,
  // 'custom': false,
  //'autoOpenOn' : 'click',  //set to null if not to open when clicking on marker
  //'autoCloseOn' : 'click'
});

marker.openInfoWindow();
