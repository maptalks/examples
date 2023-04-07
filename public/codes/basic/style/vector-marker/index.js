const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("tile", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("v").addTo(map);

const c = map.getCenter();

const marker1 = new maptalks.Marker(c.sub(0.02, 0), {
  symbol: {
    markerType: "ellipse",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 1,
    markerLineColor: "#34495e",
    markerLineWidth: 3,
    markerLineOpacity: 1,
    markerLineDasharray: [],
    markerWidth: 40,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker2 = new maptalks.Marker(c.sub(0.015, 0), {
  symbol: {
    markerType: "cross",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 1,
    markerLineColor: "#34495e",
    markerLineWidth: 3,
    markerLineOpacity: 1,
    markerLineDasharray: [],
    markerWidth: 40,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker3 = new maptalks.Marker(c.sub(0.01, 0), {
  symbol: {
    markerType: "x",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 1,
    markerLineColor: "#34495e",
    markerLineWidth: 3,
    markerLineOpacity: 1,
    markerLineDasharray: [],
    markerWidth: 40,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker4 = new maptalks.Marker(c.sub(0.005, 0), {
  symbol: {
    markerType: "triangle",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 1,
    markerLineColor: "#34495e",
    markerLineWidth: 3,
    markerLineOpacity: 1,
    markerLineDasharray: [],
    markerWidth: 40,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker5 = new maptalks.Marker(c, {
  symbol: {
    markerType: "square",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 1,
    markerLineColor: "#34495e",
    markerLineWidth: 3,
    markerLineOpacity: 1,
    markerLineDasharray: [],
    markerWidth: 40,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker6 = new maptalks.Marker(c.add(0.005, 0), {
  symbol: {
    markerType: "diamond",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 1,
    markerLineColor: "#34495e",
    markerLineWidth: 3,
    markerLineOpacity: 1,
    markerLineDasharray: [],
    markerWidth: 40,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker7 = new maptalks.Marker(c.add(0.01, 0), {
  symbol: {
    markerType: "bar",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 1,
    markerLineColor: "#34495e",
    markerLineWidth: 3,
    markerLineOpacity: 1,
    markerLineDasharray: [],
    markerWidth: 30,
    markerHeight: 60,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker8 = new maptalks.Marker(c.add(0.015, 0), {
  symbol: {
    markerType: "pie",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 1,
    markerLineColor: "#34495e",
    markerLineWidth: 3,
    markerLineOpacity: 1,
    markerLineDasharray: [],
    markerWidth: 40,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker9 = new maptalks.Marker(c.add(0.02, 0), {
  symbol: {
    markerType: "pin",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 1,
    markerLineColor: "#34495e",
    markerLineWidth: 3,
    markerLineOpacity: 1,
    markerLineDasharray: [],
    markerWidth: 40,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker10 = new maptalks.Marker(c.add(0.022, 0), {
  symbol: {
    markerType: "rectangle",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 1,
    markerLineColor: "#34495e",
    markerLineWidth: 3,
    markerLineOpacity: 1,
    markerLineDasharray: [],
    markerWidth: 40,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);
