
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  centerCross : true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

map.on('moving moveend zoomend', refresh);

refresh();

function refresh() {

  var center = map.getCenter(),
    containerPoint = map.coordinateToContainerPoint(center).round(),
    viewPoint = map.coordinateToViewPoint(center).round();

  document.getElementById('coordinate').innerHTML = '<div>' + [
    'Center : ',
    'Coordinate : ' + center.x.toFixed(5) + ',' + center.y.toFixed(5),
    'ContainerPoint :' + containerPoint.x + ',' + containerPoint.y,
    'ViewPoint :' + viewPoint.x + ',' + viewPoint.y
  ].join('<br>') + '</div>';
}
