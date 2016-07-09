
//Van der Grinten IV projection from D3
//http://bl.ocks.org/mbostock/4489365
var d3Projection =  d3.geo.vanDerGrinten4()
                    .scale(148)
                    .precision(.1);

//convert to a maptalks projection object
var proj = {
  project : function (c) {
    var pc = d3Projection([c.x, c.y]);
    return new maptalks.Coordinate(pc[0], pc[1]);
  },
  unproject : function (pc) {
    var c = d3Projection.invert([pc.x, (pc.y)]);
    if (!c || isNaN(c[0]) || isNaN(c[1])) {
      return null;
    }
    return new maptalks.Coordinate(c);
  }
};

var min = proj.project(new maptalks.Coordinate(-180, -90)),
  max = proj.project(new maptalks.Coordinate(180, 90)),
  fullExtent = {
    'top'   : max.y,
    'left'  : min.x,
    'right' : max.x,
    'bottom' : min.y
  };
//initialize map with a customized projection
var map = new maptalks.Map('map', {
  center:     [0, 0],
  zoom:  2,
  view:{
    'projection': proj,
    'resolutions': (function () {
      var resolutions = [];
      for (var i = 0; i < 10; i++) {
        resolutions[i] = 4 / Math.pow(2, i);
      }
      return resolutions;
    })(),
    'fullExtent': fullExtent
  }
});

d3.json('world-50m.json', function (error, world) {
  if (error) throw error;
  var featureCollection = topojson.feature(world, world.objects.countries),
    geometries = maptalks.GeoJSON.toGeometry(featureCollection);
  var symbol = {
    'lineColor' : '#fff',
    'lineWidth' : 0.5,
    'polygonOpacity' : 1,
    'polygonFill'    : '#747474'
  };
  var vectors = new maptalks.VectorLayer('v', {'geometryEvents':false, 'enableSimplify':false})
      .addGeometry(geometries)
      .forEach(function (g) {
        g.config('antiMeridian', 'split')
         .setSymbol(symbol);
      })
      .addTo(map);
});
