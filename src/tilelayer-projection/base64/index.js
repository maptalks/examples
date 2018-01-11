var baseLayer = new maptalks.TileLayer('base',{
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

function getBase64Image(img) {
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL('image/png');
  return dataURL;
}

var map = new maptalks.Map('map', {
  center:     [-0.113049,51.498568],
  zoom:  11,
  attribution: true,
  baseLayer : baseLayer
});


