var baseLayer = new maptalks.TileLayer('base', {
  urlTemplate: '$(urlTemplate)',
  subdomains: $(subdomains),
  attribution: '$(attribution)'
});

//generate tile url
baseLayer.getTileUrl = function (x, y, z) {
  //replace with your own
  //e.g. return a url pointing to your sqlite database
  return maptalks.TileLayer.prototype.getTileUrl.call(this, x, y, z);
};

baseLayer.on('renderercreate', function (e) {
  //load tile image
  //   img(Image): an Image object
  //   url(String): the url of the tile
  e.renderer.loadTileImage = function (img, url) {
    //mocking getting image's base64
    //replace it by your own, e.g. load from sqlite database
    var remoteImage = new Image();
    remoteImage.crossOrigin = 'anonymous';
    remoteImage.onload = function () {
      var base64 = getBase64Image(remoteImage);
      img.src = base64;
    };
    remoteImage.src = url;
  };
});

var canvas;

function getCanvas() {
  if (canvas) {
    return canvas;
  }
  canvas = document.createElement('canvas');
  return canvas;
}

function getBase64Image(img) {
  var canvas = getCanvas();
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  ctx.save();
  ctx.filter = 'sepia(100%) invert(90%)';
  ctx.drawImage(img, 0, 0);
  ctx.restore();
  ctx.fillStyle = 'white';
  ctx.font = '20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('hello maptalks', canvas.width / 2, canvas.height / 2);

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 0.1;
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();

  var dataURL = canvas.toDataURL('image/jpg', 0.7);
  return dataURL;
}

var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 11,
  baseLayer: baseLayer
});


