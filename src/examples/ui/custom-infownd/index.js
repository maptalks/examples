
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var options = {
  'custom': true,
  'content'   : '<div class="custom_window">' +
                '<div class="close_btn" onclick="closeWindow();">x</div>' +
                '<div>My customized InfoWindow.</div>' +
                '</div>'
};

var infoWindow = new maptalks.ui.InfoWindow(options);
infoWindow.addTo(map).show(map.getCenter());

function closeWindow() {
  infoWindow.hide();
}

