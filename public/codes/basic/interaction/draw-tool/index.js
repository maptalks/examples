const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("vector").addTo(map);

const drawTool = new maptalks.DrawTool({
  mode: "Point",
})
  .addTo(map)
  .disable();

drawTool.on("drawend", function (param) {
  console.info(param.geometry);
  layer.addGeometry(param.geometry);
});

const items = [
  "Point",
  "LineString",
  "Polygon",
  "Circle",
  "Ellipse",
  "Rectangle",
  "FreeHandLineString",
  "FreeHandPolygon",
].map(function (value) {
  return {
    item: value,
    click: function () {
      drawTool.setMode(value).enable();
    },
  };
});

const toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: "Shape",
      children: items,
    },
    {
      item: "Disable",
      click: function () {
        drawTool.disable();
      },
    },
    {
      item: "Clear",
      click: function () {
        layer.clear();
      },
    },
  ],
}).addTo(map);
