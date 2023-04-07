const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const pointLayer = new maptalks.PointLayer("point");

const marker = new maptalks.Marker([-74.00912099912109, 40.71107610933129], {
  symbol: [
    {
      markerFile: "{res}/markers/avatar.jpg",
      markerWidth: 32,
      markerHeight: 32,
      markerDy: 8,
    },
    {
      markerFile: "{res}/markers/marker.png",
      markerWidth: 45,
      markerHeight: 60,
      markerDx: 0,
      markerDy: 0,
      markerOpacity: 1,
      markerHorizontalAlignment: "middle",
      markerVerticalAlignment: "middle",
    }
  ],
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
