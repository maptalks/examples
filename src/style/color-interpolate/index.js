var map = new maptalks.Map('map', {
  center: [0, 0],
  zoom: 2,
  baseLayer: new maptalks.TileLayer('tile', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('v').addTo(map);
fetch('./population.json').then(function (res) { return res.json(); }).then(function (json) {
  var points = [];
  var max = -Infinity;
  json.forEach(function (d) {
    var x = d[0], y = d[1], value = d[2];
    max = Math.max(value, max);
    var point = new maptalks.Marker([x, y], {
      properties: {
        value: value
      },
      symbol: {
        markerWidth: 2,
        markerHeight: 2,
        markerType: 'ellipse',
        markerFill: {
          type: 'color-interpolate',
          property: 'value',
          stops: [
            [0, 'green'],
            [50, 'yellow'],
            [360, 'red']
          ]
        },
        markerLineWidth: 0
      }
    });
    points.push(point);
  });
  layer.addGeometry(points);
  console.log(max);
});

