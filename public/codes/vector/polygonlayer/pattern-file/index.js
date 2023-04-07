const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.PolygonLayer("polygon");

const polygon = new maptalks.Polygon(
  [
    [
      [-0.131049, 51.498568],
      [-0.107049, 51.498568],
      [-0.107049, 51.493568],
      [-0.131049, 51.493568],
      [-0.131049, 51.498568],
    ],
  ],
  {
    symbol: {
      lineColor: "#fff",
      polygonPatternFile: "{res}/patterns/fill-pattern.png",
      polygonOpacity: 1,
    },
  }
).addTo(layer);

const groupLayer = new maptalks.GroupGLLayer("group", [layer]);
groupLayer.addTo(map);
