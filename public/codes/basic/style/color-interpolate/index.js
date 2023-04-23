const map = new maptalks.Map("map", {
  center: [0, 0],
  zoom: 2,
  baseLayer: new maptalks.TileLayer("tile", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("v").addTo(map);
fetch("{res}/json/population.json")
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    const points = [];
    let max = -Infinity;
    json.forEach((d) => {
      const x = d[0],
        y = d[1],
        value = d[2];
      max = Math.max(value, max);
      const point = new maptalks.Marker([x, y], {
        properties: {
          value: value,
        },
        symbol: {
          markerWidth: 2,
          markerHeight: 2,
          markerType: "ellipse",
          markerFill: {
            type: "color-interpolate",
            property: "value",
            stops: [
              [0, "green"],
              [50, "yellow"],
              [360, "red"],
            ],
          },
          markerLineWidth: 0,
        },
      });
      points.push(point);
    });
    layer.addGeometry(points);
  });
