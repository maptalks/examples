var baseLayer = new maptalks.TileLayer('base',{
  urlTemplate: '$(urlTemplate)',
  subdomains: $(subdomains)
});

baseLayer.on('renderercreate', function (e) {
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
  attribution: {
    content: '$(attribution)'
  },
  baseLayer : baseLayer
});


