const layer = new maptalks.TileLayer("light", {
  urlTemplate: "{urlTemplate}",
  subdomains: ["a", "b", "c", "d"],
  attribution: "{attribution}",
  // force layer to render when map is zooming and moving
  forceRenderOnMoving: true,
  forceRenderOnZooming: true,
});

const map = new maptalks.Map("map", {
  center: [121.4, 37.5],
  zoom: 13,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c", "d"],
  }),
  layers: [layer],
});

const swipe = document.getElementById("swipe");

const renderer = layer.getRenderer();
const canvasGetter = renderer.getCanvasImage;
// override renderer's default method to get layer canvas image
renderer.getCanvasImage = function () {
  const dpr = map.getDevicePixelRatio();
  // original layer canvas image
  const layerImage = canvasGetter.call(renderer);
  if (!layerImage || !layerImage.image) {
    return layerImage;
  }
  // drawn width after layer is erased by swipper
  const ctx = renderer.context;
  const width = renderer.canvas.width * (swipe.value / 100);
  const height = ctx.canvas.height;

  // copy drawn rect of original layer canvas
  const drawnRect = document.createElement("canvas");
  drawnRect.width = width;
  drawnRect.height = ctx.canvas.height;
  drawnRect.getContext("2d").drawImage(layerImage.image, 0, 0);

  // clear the erased part
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // draw a white background to cover the bottom layers when zooming
  ctx.beginPath();
  ctx.rect(0, 0, width / dpr, height / dpr);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // draw the drawn part on layer's canvas
  ctx.drawImage(drawnRect, 0, 0, width / dpr, height / dpr);
  layerImage.image = ctx.canvas;
  return layerImage;
};

swipe.addEventListener("input", function () {
  // let layer redraw self in the next frame
  layer.getRenderer().setToRedraw();
});
