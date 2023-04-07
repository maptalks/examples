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

const json = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-0.131049, 51.498568],
        [-0.107049, 51.498568],
        [-0.107049, 51.493568],
        [-0.131049, 51.493568],
        [-0.131049, 51.498568],
      ],
    ],
  },
  properties: {
    name: "polygon data",
  },
};

const polygon = maptalks.GeoJSON.toGeometry(json).addTo(layer);

polygon.setSymbol({
  lineColor: "#34495e",
  lineWidth: 2,
  polygonFill: "rgb(135,196,240)",
  polygonOpacity: 0.6,
});

const groupLayer = new maptalks.GroupGLLayer("group", [layer]);
groupLayer.addTo(map);
