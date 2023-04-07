const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  layers: [new maptalks.VectorLayer("v")],
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
  const symbol = {
    markerType: "x",
    markerLineColor: "#f00",
    markerLineWidth: 4,
    markerWidth: 20,
    markerHeight: 20,
  };
  const coordinate = map.getCenter().add(0.008, 0.008);
  map
    .getLayer("v")
    .clear()
    .addGeometry(new maptalks.Marker(coordinate, { symbol: symbol }));
  map.panTo(coordinate);
}

const toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: "↑",
      click: up,
    },
    {
      item: "↓",
      click: down,
    },
    {
      item: "←",
      click: left,
    },
    {
      item: "→",
      click: right,
    },
    {
      item: "pan to",
      click: toCoordinate,
    },
  ],
}).addTo(map);
