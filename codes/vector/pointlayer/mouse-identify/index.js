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

map.on("click", (e) => {
  // reset colors
  pointLayer.forEach((g) => {
    g.updateSymbol({
      markerFill: "#0e595e",
    });
  });
  // identify
  map.identify(
    {
      coordinate: e.coordinate,
      layers: [pointLayer],
    },
    (geos) => {
      if (geos.length === 0) {
        return;
      }
      geos.forEach((g) => {
        g.updateSymbol({
          markerFill: "#f00",
        });
      });
    }
  );
});

const center = map.getCenter();
const width = 0.055;
const height = 0.03;
const markers = [];

for (let i = 65; i <= 90; i++) {
  const x = center.x + (Math.random() - 0.5) * width;
  const y = center.y + (Math.random() - 0.5) * height;
  markers.push(
    new maptalks.Marker([x, y], {
      symbol: {
        textName: String.fromCharCode(i),
        textSize: 30,
        textFill: "#fff",
        markerType: "ellipse",
        markerFill: "#0e595e",
        markerFillOpacity: 0.4,
        markerLineWidth: 2,
        markerLineColor: "#fff",
        markerWidth: 70,
        markerHeight: 70,
        markerVerticalAlignment: "middle",
      },
    })
  );
}

pointLayer.addGeometry(markers);

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
