const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  pitch: 56,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const center = map.getCenter();

const rectangle = new maptalks.Rectangle(center.add(-0.018, 0.012), 800, 700, {
  symbol: {
    lineColor: "#34495e",
    lineWidth: 2,
    polygonFill: "#34495e",
    polygonOpacity: 0.4,
  },
  properties: {
    altitude: 100,
  },
});

const circle = new maptalks.Circle(center.add(0.002, 0.008), 500, {
  symbol: {
    lineColor: "#34495e",
    lineWidth: 2,
    polygonFill: "#1bbc9b",
    polygonOpacity: 0.4,
  },
  properties: {
    altitude: 800,
  },
});
const sector = new maptalks.Sector(center.add(-0.013, -0.001), 900, 240, 300, {
  symbol: {
    lineColor: "#34495e",
    lineWidth: 2,
    polygonFill: "rgb(135,196,240)",
    polygonOpacity: 0.4,
  },
  properties: {
    altitude: 600,
  },
});

const ellipse = new maptalks.Ellipse(center.add(0.003, -0.005), 1000, 600, {
  symbol: {
    lineColor: "#34495e",
    lineWidth: 2,
    polygonFill: "rgb(216,115,149)",
    polygonOpacity: 0.4,
  },
  properties: {
    altitude: 400,
  },
});

const layer = new maptalks.VectorLayer("vector", { enableAltitude: true })
  .addGeometry([rectangle, circle, sector, ellipse])
  .addTo(map);

// draw shadows
const shadowSymbol = {
  lineColor: "#bbb",
  lineDasharray: [10, 5, 5],
  lineWidth: 2,
  polygonFill: "#bbb",
  polygonOpacity: 0.4,
};
const shadows = [];
layer.forEach(function (geo) {
  shadows.push(geo.copy().setSymbol(shadowSymbol));
});
new maptalks.VectorLayer("shadows", shadows).addTo(map).bringToBack();
