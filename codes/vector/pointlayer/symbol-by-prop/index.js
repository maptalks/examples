const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  zoomControl: true,
});

const c = map.getCenter();

const pointLayer = new maptalks.PointLayer("point");

const symbol = {
  markerType: "ellipse",
  markerFill: "rgb(216,115,149)",
  markerFillOpacity: {
    property: "heat",
    type: "identity",
  },
  markerLineWidth: 0,
  markerLineOpacity: 1,
  markerWidth: 40,
  markerHeight: 40,
};

const marker1 = new maptalks.Marker(c.sub(0.02, 0), {
  symbol: symbol,
  properties: {
    heat: 1,
  },
}).addTo(pointLayer);

const marker2 = new maptalks.Marker(c.add(0.02, 0), {
  symbol: symbol,
  properties: {
    heat: 0.7,
  },
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
