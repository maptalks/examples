// This work is submitted by @1dent1ty https://github.com/1dent1ty
// Inspired by openlayers https://openlayers.org/en/latest/examples/magnify.html

const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

let mousePosition = null;

function onMouseMove(e) {
  mousePosition = e.containerPoint;
  map.getRenderer().setToRedraw();
}

function onMouseOut() {
  mousePosition = null;
  map.getRenderer().setToRedraw();
}

function onRenderEnd(e) {
  if (!mousePosition) {
    return;
  }
  // map's canvas context
  const ctx = e.context;
  // radius of magnifier
  let radius = 150;
  const pixelRatio =
    window.devicePixelRatio ||
    window.screen.deviceXDPI / window.screen.logicalXDPI;
  radius *= pixelRatio > 1 ? 2 : 1;
  const centerX = mousePosition.x * pixelRatio,
    centerY = mousePosition.y * pixelRatio;
  const originX = centerX - radius,
    originY = centerY - radius;
  const size = 2 * radius + 2;
  // manipulate pixel values to magnify
  const sourceData = ctx.getImageData(originX, originY, size, size).data;
  const dest = ctx.createImageData(size, size);
  const destData = dest.data;
  for (let j = 0; j < size; ++j) {
    for (let i = 0; i < size; ++i) {
      const dI = i - radius;
      const dJ = j - radius;
      const dist = Math.sqrt(dI * dI + dJ * dJ);
      let sourceI = i;
      let sourceJ = j;
      if (dist < radius) {
        sourceI = Math.round(radius + dI / 2);
        sourceJ = Math.round(radius + dJ / 2);
      }
      const destOffset = (j * size + i) * 4;
      const sourceOffset = (sourceJ * size + sourceI) * 4;
      destData[destOffset] = sourceData[sourceOffset];
      destData[destOffset + 1] = sourceData[sourceOffset + 1];
      destData[destOffset + 2] = sourceData[sourceOffset + 2];
      destData[destOffset + 3] = sourceData[sourceOffset + 3];
    }
  }
  // draw magnifier's outline
  ctx.beginPath();
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 2;
  ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  // draw magnified image and clip it by circle
  ctx.drawImage(
    createMagCircle(dest, size),
    centerX - size / 2,
    centerY - size / 2
  );
}

map.on("mousemove", onMouseMove);

map.on("mouseout", onMouseOut);

map.on("renderend", onRenderEnd);

// draw image data into a canvas, and clip it by a circle with diameter of size
function createMagCircle(imageData, size) {
  const magImg = document.createElement("canvas");
  const magCircle = document.createElement("canvas");

  magImg.width = magImg.height = magCircle.width = magCircle.height = size;
  magImg.getContext("2d").putImageData(imageData, 0, 0);

  const ctx = magCircle.getContext("2d");
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  // clip canvas
  ctx.clip();
  ctx.drawImage(magImg, 0, 0);
  return magCircle;
}
