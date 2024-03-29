// This work is submitted by @1dent1ty https://github.com/1dent1ty
// Inspired by openlayers https://openlayers.org/en/latest/examples/magnify.html

var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var mousePosition = null;

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
  var ctx = e.context;
  // radius of magnifier
  var radius = 150;
  var pixelRatio = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI));
  radius *= (pixelRatio > 1 ? 2 : 1);
  var centerX = mousePosition.x * pixelRatio,
    centerY = mousePosition.y * pixelRatio;
  var originX = centerX - radius,
    originY = centerY - radius;
  var size = 2 * radius + 2;
  // manipulate pixel values to magnify
  var sourceData = ctx.getImageData(originX, originY, size, size).data;
  var dest = ctx.createImageData(size, size);
  var destData = dest.data;
  for (var j = 0; j < size; ++j) {
    for (var i = 0; i < size; ++i) {
      var dI = i - radius;
      var dJ = j - radius;
      var dist = Math.sqrt(dI * dI + dJ * dJ);
      var sourceI = i;
      var sourceJ = j;
      if (dist < radius) {
        sourceI = Math.round(radius + dI / 2);
        sourceJ = Math.round(radius + dJ / 2);
      }
      var destOffset = (j * size + i) * 4;
      var sourceOffset = (sourceJ * size + sourceI) * 4;
      destData[destOffset] = sourceData[sourceOffset];
      destData[destOffset + 1] = sourceData[sourceOffset + 1];
      destData[destOffset + 2] = sourceData[sourceOffset + 2];
      destData[destOffset + 3] = sourceData[sourceOffset + 3];
    }
  }
  // draw magnifier's outline
  ctx.beginPath();
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 2;
  ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  // draw magnified image and clip it by circle
  ctx.drawImage(createMagCircle(dest, size), centerX - size / 2, centerY - size / 2);
}

map.on('mousemove', onMouseMove);

map.on('mouseout', onMouseOut);

map.on('renderend', onRenderEnd);

//draw image data into a canvas, and clip it by a circle with diameter of size
function createMagCircle(imageData, size) {
  var magImg = document.createElement('canvas');
  var magCircle = document.createElement('canvas');

  magImg.width = magImg.height = magCircle.width = magCircle.height = size;
  magImg.getContext('2d').putImageData(imageData, 0, 0);

  var ctx = magCircle.getContext('2d');
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  // clip canvas
  ctx.clip();
  ctx.drawImage(magImg, 0, 0);
  return magCircle;
}
