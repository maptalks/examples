var center = new maptalks.Coordinate(-0.113049,51.498568);
var map = new maptalks.Map('map', {
  center: center,
  zoom: 14,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  }),
  layers : [
    new maptalks.VectorLayer('v')
  ]
});

var bars = getBars();
map.getLayer('v').addGeometry(bars);

replay();

function replay() {
  reset();
  animate();
}

function animate() {
  bars[0].animate({
    'symbol': {
      'markerHeight': 82
    }
  }, {
    'duration': 1000
  });

  bars[1].animate({
    'symbol': {
      'markerHeight': 197
    }
  }, {
    'duration': 1000
  });

  bars[2].animate({
    'symbol': {
      'markerHeight': 154
    }
  }, {
    'duration': 1000
  });
}

function reset() {
  bars[0].updateSymbol({
    'markerHeight' : 33
  });
  bars[1].updateSymbol({
    'markerHeight' : 47
  });
  bars[2].updateSymbol({
    'markerHeight' : 79
  });
}

function getBars() {
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
  );

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
  );

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
  );

  return [bar1, bar2, bar3];
}
