const c = new maptalks.Coordinate(-0.113049, 51.49856);
const map = new maptalks.Map("map", {
  center: c.sub(0.006, 0.002),
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
  }),
});

const layer = new maptalks.VectorLayer("vector").addTo(map);

const rect1 = new maptalks.Rectangle(c.sub(0.03, 0), 600, 600, {
  symbol: {
    polygonFill: {
      type: "linear",
      colorStops: [
        [0.0, "#fff"],
        [0.5, "#fff27e"],
        [1, "#f87e4b"],
      ],
    },
    polygonOpacity: 1,
    lineColor: "#fff",
  },
}).addTo(layer);

const rect2 = new maptalks.Rectangle(c.sub(0.02, 0), 600, 600, {
  symbol: {
    polygonFill: {
      type: "linear",
      places: [0, 0, 1, 1],
      colorStops: [
        [0.0, "#fff"],
        [0.5, "#fff27e"],
        [1, "#f87e4b"],
      ],
    },
    polygonOpacity: 1,
    lineColor: "#fff",
  },
}).addTo(layer);

const rect3 = new maptalks.Rectangle(c, 600, 600, {
  symbol: {
    polygonFill: {
      type: "radial",
      colorStops: [
        [0.0, "rgba(216,115,149,0)"],
        [0.5, "rgba(216,115,149,1)"],
        [1.0, "rgba(216,115,149,1)"],
      ],
    },
    polygonOpacity: 1,
    lineWidth: 0,
  },
}).addTo(layer);

const rect4 = new maptalks.Rectangle(c.add(0.01, 0), 600, 600, {
  symbol: {
    polygonFill: {
      type: "radial",
      places: [0.5, 0.5, 1, 1, 1, 0.1],
      colorStops: [
        [0.0, "#1bbc9b"],
        [0.55, "rgb(135,196,240)"],
        [1.0, "#34495e"],
      ],
    },
    polygonOpacity: 1,
    lineColor: "#fff",
  },
}).addTo(layer);
