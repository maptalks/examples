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
    [-0.131049, 51.498568],
    [-0.107049, 51.498568],
  ],
  {
    symbol: {
      lineColor: "#1bbc9b",
      lineWidth: 3,
    },
  }
).addTo(lineLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [lineLayer]).addTo(map);

function updateSymbol() {
  line.updateSymbol({
    lineColor: "rgb(216,115,149)",
    lineWidth: 4,
  });
}
