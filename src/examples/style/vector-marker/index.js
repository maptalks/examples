
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('tile', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var symbol = {

};
var marker1 = new maptalks.Marker(
  map.getCenter().substract(0.020, 0),
  {
    'symbol' : {
      'markerType': 'ellipse',
      'markerFill': 'rgb(135,196,240)',
      'markerFillOpacity': 1,
      'markerLineColor': '#34495e',
      'markerLineWidth': 3,
      'markerLineOpacity': 1,
      'markerLineDasharray':[],
      'markerWidth': 40,
      'markerHeight': 40,
      'markerDx': 0,
      'markerDy': 0
    }
  }
).addTo(layer);

var marker2 = new maptalks.Marker(
  map.getCenter().substract(0.015, 0),
  {
    'symbol' : {
      'markerType': 'cross',
      'markerFill': 'rgb(135,196,240)',
      'markerFillOpacity': 1,
      'markerLineColor': '#34495e',
      'markerLineWidth': 3,
      'markerLineOpacity': 1,
      'markerLineDasharray':[],
      'markerWidth': 40,
      'markerHeight': 40,
      'markerDx': 0,
      'markerDy': 0
    }
  }
).addTo(layer);

var marker3 = new maptalks.Marker(
  map.getCenter().substract(0.010, 0),
  {
    'symbol' : {
      'markerType': 'x',
      'markerFill': 'rgb(135,196,240)',
      'markerFillOpacity': 1,
      'markerLineColor': '#34495e',
      'markerLineWidth': 3,
      'markerLineOpacity': 1,
      'markerLineDasharray':[],
      'markerWidth': 40,
      'markerHeight': 40,
      'markerDx': 0,
      'markerDy': 0
    }
  }
).addTo(layer);

var marker4 = new maptalks.Marker(
  map.getCenter().substract(0.005, 0),
  {
    'symbol' : {
      'markerType': 'triangle',
      'markerFill': 'rgb(135,196,240)',
      'markerFillOpacity': 1,
      'markerLineColor': '#34495e',
      'markerLineWidth': 3,
      'markerLineOpacity': 1,
      'markerLineDasharray':[],
      'markerWidth': 40,
      'markerHeight': 40,
      'markerDx': 0,
      'markerDy': 0
    }
  }
).addTo(layer);

var marker5 = new maptalks.Marker(
  map.getCenter(),
  {
    'symbol' : {
      'markerType': 'square',
      'markerFill': 'rgb(135,196,240)',
      'markerFillOpacity': 1,
      'markerLineColor': '#34495e',
      'markerLineWidth': 3,
      'markerLineOpacity': 1,
      'markerLineDasharray':[],
      'markerWidth': 40,
      'markerHeight': 40,
      'markerDx': 0,
      'markerDy': 0
    }
  }
).addTo(layer);


var marker6= new maptalks.Marker(
  map.getCenter().add(0.005, 0),
  {
    'symbol' : {
      'markerType': 'diamond',
      'markerFill': 'rgb(135,196,240)',
      'markerFillOpacity': 1,
      'markerLineColor': '#34495e',
      'markerLineWidth': 3,
      'markerLineOpacity': 1,
      'markerLineDasharray':[],
      'markerWidth': 40,
      'markerHeight': 40,
      'markerDx': 0,
      'markerDy': 0
    }
  }
).addTo(layer);

var marker7 = new maptalks.Marker(
  map.getCenter().add(0.010, 0),
  {
    'symbol' : {
      'markerType': 'bar',
      'markerFill': 'rgb(135,196,240)',
      'markerFillOpacity': 1,
      'markerLineColor': '#34495e',
      'markerLineWidth': 3,
      'markerLineOpacity': 1,
      'markerLineDasharray':[],
      'markerWidth': 30,
      'markerHeight': 60,
      'markerDx': 0,
      'markerDy': 0
    }
  }
).addTo(layer);

var marker8= new maptalks.Marker(
  map.getCenter().add(0.015, 0),
  {
    'symbol' : {
      'markerType': 'pie',
      'markerFill': 'rgb(135,196,240)',
      'markerFillOpacity': 1,
      'markerLineColor': '#34495e',
      'markerLineWidth': 3,
      'markerLineOpacity': 1,
      'markerLineDasharray':[],
      'markerWidth': 40,
      'markerHeight': 40,
      'markerDx': 0,
      'markerDy': 0
    }
  }
).addTo(layer);

var marker8= new maptalks.Marker(
  map.getCenter().add(0.020, 0),
  {
    'symbol' : {
      'markerType': 'pin',
      'markerFill': 'rgb(135,196,240)',
      'markerFillOpacity': 1,
      'markerLineColor': '#34495e',
      'markerLineWidth': 3,
      'markerLineOpacity': 1,
      'markerLineDasharray':[],
      'markerWidth': 40,
      'markerHeight': 40,
      'markerDx': 0,
      'markerDy': 0
    }
  }
).addTo(layer);
