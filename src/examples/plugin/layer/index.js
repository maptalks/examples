
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

const options = {
  'textColor' : 'Red'
};

// A layer display given text with given color in the center.
class MyLayer extends maptalks.Layer {

  // JSON deserialize
  static fromJSON(json) {
    return new MyLayer(json.id, json.text, json.options);
  }

  constructor(id, text, options) {
    super(id, options);
    this._text = text;
  }

  getText() {
    return this._text;
  }

  // JSON serialize
  toJSON() {
    return {
      'type'    : 'MyLayer',
      'id'      : this.getId(),
      'options' : this.config(),
      'text' : this.getText()
    };
  }
};

//merge default options
MyLayer.mergeOptions(options);
//register the JSON Type name
MyLayer.registerJSONType('MyLayer');

//MyLayer's renderer
class MyLayerRenderer extends maptalks.renderer.CanvasRenderer {
  //constructor
  constructor(layer) {
    super(layer);
  }

  // render the layer when map is moving
  isRenderOnMoving() {
    return true;
  }

  // render the layer when map is moving
  isRenderOnZooming() {
    return true;
  }

  //interface method to draw
  draw() {
    const map = this.getMap(),
      size = map.getSize();
    //prepare layer's canvas
    this.prepareCanvas();
    //convert center coordinate to containerPoint
    //a containerPoint is screen position from top-left of container.
    const point = map.coordinateToContainerPoint(map.getCenter());
    const text = this.layer.getText();
    //this.context is the CanvasRenderingContext2D of the layer canvas
    this.context.fillStyle = this.layer.options['textColor'];
    this.context.font = 'bold 50px sans-serif';
    const len = this.context.measureText(text);
    this.context.fillText(text, point.x - len.width / 2, point.y);
    //ask map to render
    this.completeRender();
  }
}

//register the renderer as a "canvas" renderer, the default renderer of all layers.
MyLayer.registerRenderer('canvas', MyLayerRenderer);

map.addLayer(new MyLayer('my', 'Hello MyLayer', {
              'textColor' : 'Red'
            }));
