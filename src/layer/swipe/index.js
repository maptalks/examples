var layer = new maptalks.TileLayer('light', {
  urlTemplate: '$(urlTemplate)',
  subdomains: $(subdomains),
  attribution: '$(attribution)',
  // force layer to render when map is zooming and moving
  'forceRenderOnMoving' : true,
  'forceRenderOnZooming' : true
});

var map = new maptalks.Map('map', {
  center: [121.4,37.5],
  zoom: 13,
  baseLayer : new maptalks.TileLayer('base',{
    'urlTemplate': 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    'subdomains'  : ['a','b','c','d']
  }),
  layers : [layer]
});

var swipe = document.getElementById('swipe');

var renderer = layer.getRenderer();
var canvasGetter = renderer.getCanvasImage;

var swipeCanvas = document.createElement('canvas');

//override renderer's default method to get layer canvas image
renderer.getCanvasImage = function () {
  var dpr = map.getDevicePixelRatio();
  //original layer canvas image
  var layerImage = canvasGetter.call(renderer);
  if (!layerImage || !layerImage.image) {
    return layerImage;
  }
  //drawn width after layer is erased by swipper
  var ctx = renderer.context;

  var width = renderer.canvas.width * (swipe.value / 100);
  var height = ctx.canvas.height;

  var leftCtx = swipeCanvas.getContext('2d');
  swipeCanvas.width = ctx.canvas.width;
  swipeCanvas.height = ctx.canvas.height;
  leftCtx.clearRect(0, 0, swipeCanvas.width, swipeCanvas.height);
  leftCtx.drawImage(layerImage.image, 0, 0, width, height, 0, 0, width, height);
  layerImage.image = swipeCanvas;
  return layerImage;
};

swipe.addEventListener('input', function () {
  //let layer redraw self in the next frame
  layer.getRenderer().setToRedraw();
});
