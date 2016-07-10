
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  }),
  layers : [
    new maptalks.VectorLayer('v')
  ]
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
  var coordinate = map.getCenter().add(0.008, 0.008);
  map.getLayer('v').clear().addGeometry(new maptalks.Marker(coordinate));
  map.panTo(coordinate);
}

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: '↑',
      click: up
    },
    {
      item: '↓',
      click: down
    },
    {
      item: '←',
      click: left
    },
    {
      item: '→',
      click: right
    },
    {
      item: 'pan to',
      click: toCoordinate
    }
  ]
}).addTo(map);
