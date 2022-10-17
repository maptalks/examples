const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const pointLayer = new maptalks.PointLayer("point");

const json = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-0.113049, 51.49856],
  },
  properties: {
    name: "point marker",
  },
};

const marker = maptalks.GeoJSON.toGeometry(json).addTo(pointLayer);

marker.setSymbol({
  textFaceName: "sans-serif",
  textName: "MapTalks",
  textFill: "#34495e",
  textSize: 40,
});

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
