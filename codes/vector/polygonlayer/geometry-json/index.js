const c = [-0.113049, 51.498568];
const map = new maptalks.Map("map", {
  center: c,
  zoom: 13,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const map1 = new maptalks.Map("map1", {
  center: c,
  zoom: 13,
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
      polygonFill: "rgb(135,196,240)",
      polygonOpacity: 1,
      lineColor: "#1bbc9b",
      lineWidth: 6,
    },
  }
).addTo(layer);

const groupLayer = new maptalks.GroupGLLayer("group", [layer]);
groupLayer.addTo(map);

const layer1 = new maptalks.PolygonLayer("polygon1");
maptalks.Geometry.fromJSON(polygon.toJSON()).addTo(layer1);
const groupLayer1 = new maptalks.GroupGLLayer("group1", [layer1]);
groupLayer1.addTo(map1);
