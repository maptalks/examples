
var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("tile", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var options = {
    'custom': true,
    'content'   : '<div class="custom_window">'
                +'<div class="close_btn" onclick="closeWindow();">x</div>'
                +'<div>My customized InfoWindow.</div>'
                +'</div>'
};
var infoWindow = new maptalks.ui.InfoWindow(options);
infoWindow.addTo(map).show(map.getCenter());

function closeWindow() {
    infoWindow.hide();
}

