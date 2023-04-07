const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const pointLayer = new maptalks.PointLayer("point");

const marker = new maptalks.MultiPoint(
  [
    [-0.131049, 51.498568],
    [-0.107049, 51.498568],
    [-0.107049, 51.493568],
    [-0.131049, 51.493568],
    [-0.131049, 51.498568],
  ],
  {
    symbol: {
      textFaceName: "sans-serif",
      textName: "MapTalks",
      textFill: "#22be9e",
      textSize: 40,
    },
  }
).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);

const extent = pointLayer.getExtent();
const ex = [
  "{ ",
  "xmin:" + extent.xmin.toFixed(5),
  ", ymin:" + extent.ymin.toFixed(5),
  ", xmax:" + extent.xmax.toFixed(5),
  ", ymax:" + extent.xmax.toFixed(5),
  " }",
].join("");
document.querySelector(".info").innerHTML = "<div>" + ex + "</div>";
