
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var bar1 = new maptalks.Marker(
  [121.47388, 31.2265965],
  {
    'symbol': {
      'markerType': 'bar',
      'markerWidth': 48,
      'markerHeight': 33,
      'markerFill': 'rgb(135,196,240)',
      'markerLineWidth': 0
    }
  }
).addTo(layer);

var bar2 = new maptalks.Marker(
  [121.48100, 31.2265965],
  {
    'symbol': {
      'markerType': 'bar',
      'markerWidth': 48,
      'markerHeight': 47,
      'markerFill': 'rgb(216,115,149)',
      'markerLineWidth': 0
    }
  }
).addTo(layer);

var bar3 = new maptalks.Marker(
  [121.48900, 31.2265965],
  {
    'symbol': {
      'markerType': 'bar',
      'markerWidth': 48,
      'markerHeight': 79,
      'markerFill': '#1bbc9b',
      'markerLineWidth': 0
    }
  }
).addTo(layer);

function animation() {
  var speed = 1000;

  bar1.animate({
    'symbol': {
      'markerHeight': 82
    }
  }, {
    'speed': speed
  });

  bar2.animate({
    'symbol': {
      'markerHeight': 197
    }
  }, {
    'speed': speed
  });

  bar3.animate({
    'symbol': {
      'markerHeight': 154
    }
  }, {
    'speed': speed
  });
}

var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Animation',
      click: function () {
        animation();
      }
    }
  ]
}).addTo(map);
