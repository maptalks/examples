const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const lineLayer = new maptalks.LineStringLayer("linelayer");
const line = new maptalks.LineString(
  [
    map.getCenter().sub(0.1, 0),
    map.getCenter().add(0.1, 0),
    map.getCenter().add(0.1, -0.1),
  ],
  {
    symbol: {
      lineColor: "#1bbc9b",
      lineWidth: 6,
      lineJoin: "round", // miter, round, bevel
      lineCap: "round", // butt, round, square
      lineDasharray: null, // dasharray, e.g. [10, 5, 5]
      lineOpacity: 1,
    },
  }
).addTo(lineLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [lineLayer]).addTo(map);
