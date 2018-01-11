var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var point = new maptalks.Marker([-0.113049 - 0.018, 51.498568 + 0.003],{
  symbol : {
    'textFaceName' : 'sans-serif',
    'textName' : 'MapTalks',
    'textFill' : '#34495e',
    'textHorizontalAlignment' : 'right',
    'textSize' : 40
  },
  properties : {
    'foo' : 'marker'
  }
});
var line = new maptalks.LineString([
  [-0.131049, 51.499568],
  [-0.107049, 51.499568]
],{
  symbol: {
    'lineColor' : '#1bbc9b',
    'lineWidth' : 3
  },
  properties : {
    'foo' : 'linestring'
  }
});
var polygon = new maptalks.Polygon([
  [-0.131049, 51.498568],
  [-0.107049, 51.498568],
  [-0.107049, 51.493568],
  [-0.131049, 51.493568],
  [-0.131049, 51.498568]
], {
  symbol: {
    'lineColor' : '#34495e',
    'lineWidth' : 2,
    'polygonFill' : 'rgb(135,196,240)',
    'polygonOpacity' : 0.6
  },
  properties : {
    'foo' : 'polygon'
  }
});

var collection = new maptalks.GeometryCollection([line, polygon, point], {
  visible : true,
  editable : true,
  cursor : null,
  shadowBlur : 0,
  shadowColor : 'black',
  draggable : false,
  dragShadow : false,
  drawOnAxis : null
});

new maptalks.VectorLayer('vector', collection)
    .addTo(map);

// filter
function filter() {
  // condition can be a mapbox filter or a function
  var filtered = collection.filter(['==', 'foo', 'polygon']);
  filtered.forEach(function (polygon) {
    polygon.updateSymbol({
      'polygonFill' : '#f00'
    });
  });
}
