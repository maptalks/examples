var url = 'http://t0.tianditu.gov.cn/vec_c/wmts?request=GetCapabilities&service=wmts&tk=de0dc270a51aaca3dd4e64d4f8c81ff6';

maptalks.SpatialReference.loadWMTS(url, function (err, conf) {
  if (err) {
    throw new Error(err);
  }
  var params = conf[0];
  params.urlTemplate += '&tk=de0dc270a51aaca3dd4e64d4f8c81ff6';
  var spatialReference = params.spatialReference;
  var tileLayer = new maptalks.TileLayer('tilelayer', params);
  var spatialReference = params.spatialReference;

  var map = new maptalks.Map('map', {
    center: [114.3404041441181, 30.548730054693106],
    zoom: 10,
    spatialReference : spatialReference,
    baseLayer: tileLayer
  });
});

