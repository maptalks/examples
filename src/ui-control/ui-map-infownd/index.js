var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var options = {
  'title'     : 'Map\' InfoWindow',
  'content'   : 'Click on map to reopen'

  // 'autoPan': true,
  // 'width': 300,
  // 'minHeight': 120,
  // 'custom': false,
  //'autoOpenOn' : 'click',  //set to null if not to open window when clicking on map
  //'autoCloseOn' : 'click'
};
var infoWindow = new maptalks.ui.InfoWindow(options);
infoWindow.addTo(map).show();
