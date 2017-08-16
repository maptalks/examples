var center = new maptalks.Coordinate(-0.113049,51.498568);
var map = new maptalks.Map('map', {
  center: center,
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);
var bar1 = new maptalks.Marker(
  center.add(-0.012,-0.002),
  {
    'symbol': {
      'markerType': 'bar',
      'markerWidth': 48,
      'markerHeight': 33,
      'markerFill': 'rgb(135,196,240)',
      'markerLineWidth': 2,
      'markerLineColor' : '#fff'
    }
  }
).addTo(layer);

var bar2 = new maptalks.Marker(
  center.add(-0.004,-0.002),
  {
    'symbol': {
      'markerType': 'bar',
      'markerWidth': 48,
      'markerHeight': 47,
      'markerFill': 'rgb(216,115,149)',
      'markerLineWidth': 2,
      'markerLineColor' : '#fff'
    }
  }
).addTo(layer);

var bar3 = new maptalks.Marker(
  center.add(0.004,-0.002),
  {
    'symbol': {
      'markerType': 'bar',
      'markerWidth': 48,
      'markerHeight': 79,
      'markerFill': '#1bbc9b',
      'markerLineWidth': 2,
      'markerLineColor' : '#fff'
    }
  }
).addTo(layer);

function animation() {
  var duration = 1000;

  bar1.animate({
    'symbol': {
      'markerHeight': 82
    }
  }, {
    'duration': duration
  });

  bar2.animate({
    'symbol': {
      'markerHeight': 197
    }
  }, {
    'duration': duration
  });

  bar3.animate({
    'symbol': {
      'markerHeight': 154
    }
  }, {
    'duration': duration
  });
}

function reset() {
  bar1.updateSymbol({
    'markerHeight' : 33
  });
  bar2.updateSymbol({
    'markerHeight' : 47
  });
  bar3.updateSymbol({
    'markerHeight' : 79
  });
}

var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Animation',
      click: function () {
        reset();
        animation();
      }
    }
  ]
}).addTo(map);
