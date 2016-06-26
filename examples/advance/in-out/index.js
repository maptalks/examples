
var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("tile", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var coordinate = new maptalks.Coordinate(121.48542, 31.22854);
var marker = new maptalks.Marker(coordinate);

var layer = new maptalks.VectorLayer('vector');
map.addLayer(layer);
layer.addGeometry(marker);

function fly(type) {
    var offset = getFlyOffset(type);
    marker.animate({
            translate:[offset['x'], offset['y']]
        },
        {
            speed: 2000
        });
}

function getFlyOffset(type) {
    var winHeight = document.body.clientHeight;
    var offsetPoint = new maptalks.Point(0, -winHeight);
    var sourcePoint = map.coordinateToViewPoint(coordinate);
    var point = sourcePoint.add(offsetPoint);
    var startOrStopPoint = map.viewPointToCoordinate(point);
    var offset = startOrStopPoint.substract(coordinate);
    if(type === 'flyIn') {
        marker.setCoordinates(startOrStopPoint);
        offset = coordinate.substract(startOrStopPoint);
    }
    return offset
}
