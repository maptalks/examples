var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var canvasLayer = new maptalks.CanvasLayer('c', {
  'forceRenderOnMoving' : true,
  'forceRenderOnZooming' : true
});

canvasLayer.prepareToDraw = function (context) {
  context.fillStyle = '#f00';
  context.font = 'bolder 50px sans-serif';
  return ['foo', 'bar'];
};

// param1 and param2 are prepareToDraw's return values.
canvasLayer.draw = function (context, view, param1, param2) {
  var size = map.getSize();
  var str = param1 + ',' + param2;
  var len = context.measureText(str);
  context.fillText(str, size.width / 2 - len.width / 2, size.height / 2);
  this.completeRender();
};

//draw when map is interacting
canvasLayer.drawOnInteracting = function (context, view, param1, param2) {
  this.draw(context, view, param1, param2);
};

map.addLayer(canvasLayer);
