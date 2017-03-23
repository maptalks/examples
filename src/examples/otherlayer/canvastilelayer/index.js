var layerOrder = [
  'earth', 'landuse', 'water', 'roads', 'building'
];
// draw mapzen's geojson vector tile with CanvasTileLayer
var canvasTile = new maptalks.CanvasTileLayer('tile',{
  urlTemplate : 'https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.json?api_key=mapzen-cGRKZj'
});
canvasTile.drawTile = function (canvas, tileContext, onComplete) {
  maptalks.Ajax.getJSON(tileContext.url, function (err, data) {
    if (err) {
      throw err;
    }
    var layers = [];
    var loaded = 0;
    function onLayerLoaded() {
      loaded++;
      if (loaded === layers.length) {
        onComplete(null);
      }
    }
    //prepare a VectorLayer per mapzen's layer
    for (var i = 0, l = layerOrder.length; i < l; i++) {
      var name = layerOrder[i];
      if (!data[name]) {
        continue;
      }
      // mapzenStyle is the layer style defined in ./style.js
      var style = mapzenStyle[name];
      layers.push(
        new maptalks.VectorLayer(name, maptalks.GeoJSON.toGeometry(data[name]), {
          'style' : style,
          'enableSimplify' : false,
          'geometryEvents' : false
        }).on('layerload', onLayerLoaded)
      );
    }
    //create a map instance on tile's canvas
    var tileMap = new maptalks.Map(canvas,{
      center : tileContext.center,
      zoom   :  tileContext.z,
      layers : layers
    });
  });
};
var map = new maptalks.Map('map',{
  center:      [-122.12258202067433, 38.080679835385574],
  zoom:  9,
  centerCross : true,
  baseLayer : canvasTile,
  attribution : {
    content : '&copy; <a href="https://mapzen.com/" target="_blank">mapzen</a>'
  }
});
