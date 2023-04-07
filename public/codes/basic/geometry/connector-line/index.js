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

// blue circle
const src = new maptalks.Marker([-0.128449, 51.503568], {
  symbol: {
    markerType: "ellipse",
    markerFill: "rgb(135,196,240)",
    markerFillOpacity: 0.8,
    markerLineColor: "#fff",
    markerLineWidth: 3,
    markerWidth: 120,
    markerHeight: 120,
  },
});

// red circle
const dst = new maptalks.Marker([-0.102149, 51.503568], {
  draggable: true,
  symbol: [
    {
      markerType: "ellipse",
      markerFill: "rgb(216,115,149)",
      markerFillOpacity: 0.8,
      markerLineColor: "#fff",
      markerLineWidth: 3,
      markerWidth: 70,
      markerHeight: 70,
    },
    {
      textName: "Drag\nMe",
      textSize: 18,
      textFill: "#fff",
      textWrapCharacter: "\n",
    },
  ],
});

// connector line
const line = new maptalks.ConnectorLine(src, dst, {
  showOn: "always", //'moving', 'click', 'mouseover', 'always'
  arrowStyle: "classic",
  arrowPlacement: "vertex-last", // 'vertex-last', //vertex-first, vertex-last, vertex-firstlast, point
  symbol: {
    lineColor: "#34495e",
    lineWidth: 2,
  },
});

layer.addGeometry(src, dst, line);

const src2 = src.copy().translate(0, -0.01);
const dst2 = dst.copy().translate(0, -0.01);
// Arc Connector Line
const line2 = new maptalks.ArcConnectorLine(src2, dst2, {
  arcDegree: 90,
  showOn: "always",
  symbol: {
    lineColor: "#34495e",
    lineWidth: 2,
  },
});

layer.addGeometry(src2, dst2, line2);
