const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const center = map.getCenter();

const pointLayer = new maptalks.PointLayer("point");

const marker1 = new maptalks.Marker(center.add(0.01, 0), {
  symbol: {
    textName: "m1",
    textSize: 18,
    markerFile: "{res}/markers/m4.png",
    markerRotationAlignment: "map",
    markerPitchAlignment: "map",
    markerHeight: 80,
    markerWidth: 80,
  },
}).addTo(pointLayer);

const marker2 = new maptalks.Marker(center.add(-0.01, 0), {
  symbol: {
    textName: "m2",
    textSize: 18,
    markerFile: "{res}/markers/m5.png",
    markerRotationAlignment: "map",
    markerPitchAlignment: "map",
    markerHeight: 80,
    markerWidth: 80,
  },
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
