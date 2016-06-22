
var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

function up() {
  map.panBy([0, -200]);
}

function down() {
  map.panBy([0, 200]);
}

function left() {
  map.panBy([-200, 0]);
}

function right() {
  map.panBy([200, 0]);
}

function toCoordinate() {
  var coordinate = map.getCenter().add(0.1, 0.1);
  map.panTo(coordinate);
}