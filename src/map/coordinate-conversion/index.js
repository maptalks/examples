
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: true,
  centerCross : true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

map.on('moving moveend zoomend', update);

update();

function update() {
  var projection = map.getProjection();
  var center = map.getCenter(),
    prj = projection.project(center),
    containerPoint = map.coordinateToContainerPoint(center).round();

  document.getElementById('coordinate').innerHTML = '<div>' + [
    'Center : [' + center.x.toFixed(5) + ', ' + center.y.toFixed(5) + ']',
    'Projected Coordinate : [' + prj.x.toFixed(5) + ', ' + prj.y.toFixed(5) + ']',
    'ContainerPoint is the screen position in px from northwest of the map container.',
    'ContainerPoint : [' + containerPoint.x + ', ' + containerPoint.y + ']'
  ].join('<br>') + '</div>';
}
