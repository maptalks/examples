
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

maptalks.MyLayer = maptalks.Layer.extend({
  options : {
    'textColor' : 'Red'
  },

  //id is required, layer's identifier
  initialize: function (id, content, options) {
    this.setId(id);
    this._content = content;
    maptalks.Util.setOptions(this, options);
  },

  getContent: function () {
    return this._content;
  },

  // serialize the MyLayer to a profile json
  toJSON: function () {
    return {
      'type'    : 'MyLayer',
      'id'      : this.getId(),
      'options' : this.config(),
      'content' : this.getContent()
    };
  }
});

// deserialize the profile json to a MyLayer instance.
maptalks.MyLayer.fromJSON = function (json) {
  return new maptalks.MyLayer(json.id, json.content, json.options);
}


var MyLayerRenderer = maptalks.renderer.Canvas.extend({

  //constructor
  initialize:function (layer) {
      //required to set layer to this.layer
      this.layer = layer;
  },

  draw: function () {
    var map = this.getMap(),
      size = map.getSize();
    //prepare canvas, create or clear it
    this.prepareCanvas();
    //convert center coordinate to containerPoint
    var point = map.coordinateToContainerPoint(map.getCenter());

    this.context.fillStyle = this.layer.options['textColor'];
    this.context.font = 'bold 15px arial, sans-serif';
    this.context.fillText(this.layer.getContent(), point.x, point.y);
    //execute to ask layer and map to draw.
    this.completeRender();
  }

});

//register the renderer as a "canvas" renderer, the default renderer of all layers.
maptalks.MyLayer.registerRenderer('canvas', MyLayerRenderer);

map.addLayer(new maptalks.MyLayer('my', 'Hello MyLayer', {
  'textColor' : 'Green'
}));
