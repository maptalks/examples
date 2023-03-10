var capitals = window.capitals;
var baseLayer = new maptalks.TileLayer('base', {
  urlTemplate: '$(urlTemplate)',
  subdomains: $(subdomains),
  attribution: '$(attribution)'
});
var map = new maptalks.Map('map', {
  center: [100.63299495279648, 30.895363667711848],
  zoom: 3,
  pitch: 0,
  attribution: true,
  zoomControl: true,
  baseLayer: baseLayer
});

var layer = new maptalks.VectorLayer('layer').addTo(map);

function createMarkerContent(name) {
  var div = document.createElement('div');
  div.className = 'text_marker';
  div.innerHTML = name;
  return div;
}

function addMarkers() {
  //test UIMarker
  var uiMarkers = capitals.map(function (f, index) {
    var lnglat = f.center;
    return new maptalks.ui.UIMarker(lnglat, {
      collision: true,
      collisionBufferSize: 2,
      collisionWeight: 1,
      collisionFadeIn: true,
      content: createMarkerContent(f.name + '_' + index),
      verticalAlignment: 'top',
      dy: -6
    });
  });
  //test InfoWindow
  var markers = capitals.map(function (f) {
    var lnglat = f.center;
    var marker = new maptalks.Marker(lnglat, {
      symbol: {
        markerType: 'ellipse',
        markerWidth: 10,
        markerHeight: 10,
        markerFill: 'red'
      }
    });
    marker.setInfoWindow({
      collision: true,
      collisionBufferSize: 2,
      collisionWeight: 2,
      collisionFadeIn: true,
      content: f.name
    });
    return marker;
  });

  uiMarkers.forEach(function (marker) {
    marker.addTo(map);
  });

  layer.addGeometry(markers);
  markers.slice(0, 1).forEach(function (marker) {
    marker.openInfoWindow();
  });
}
addMarkers();
