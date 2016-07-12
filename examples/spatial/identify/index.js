
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('v').addTo(map);

map.on('click', function (param) {
  //reset colors
  layer.forEach(function (g) {
    g.updateSymbol({
      'markerFill' : '#0e595e'
    });
  });
  map.identify(
    {
      'coordinate' : param.coordinate,
      'layers' : [layer]
    },
    function (geos) {
      if (geos.length === 0) {
        return;
      }
      geos.forEach(function (g) {
        g.updateSymbol({
            'markerFill' : '#f00'
        });
      });
    }
  );
});

//prepare data
var center = map.getCenter(), width = 0.055, height = 0.03,
  markers = [];
for (var i = 65; i <= 90; i++) {
  var x = center.x + (Math.random() - 0.5) * width;
  var y = center.y + (Math.random() - 0.5) * height;
  markers.push(new maptalks.Marker([x, y], {
    'symbol' : {
      'textName' : String.fromCharCode(i),
      'textSize' : 30,
      'textFill' : 'White',
      'markerType' : 'ellipse',
      'markerFill' : '#0e595e',
      'markerFillOpacity' : 0.4,
      'markerLineWidth' : 2,
      'markerLineColor' : 'white',
      'markerWidth' : 70,
      'markerHeight' : 70
    },
    'properties' : {
      'value' : String.fromCharCode(i)
    }
  }));
}
layer.addGeometry(markers);

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Click to identify',
      click: function () {}
    }
  ]
}).addTo(map);
