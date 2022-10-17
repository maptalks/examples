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

const center = map.getCenter();
const polygon = new maptalks.Polygon(
  [
    center.add(-0.005, 0.005),
    center.add(0.005, 0.005),
    center.add(0.005, -0.005),
    center.add(-0.005, -0.005),
  ],
  {
    symbol: {
      polygonFill: "#fff",
      polygonOpacity: 0.5,
    },
  }
);
map.getLayer("v").addGeometry(polygon);

function fitExtent() {
  // fit map's extent to polygon's
  // 0 is the zoom offset
  map.fitExtent(polygon.getExtent(), 0);
}
