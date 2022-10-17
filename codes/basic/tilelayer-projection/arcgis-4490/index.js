const arcUrl =
  "http://116.211.137.33:8010/ServiceAdapter/MAP/%E7%94%B5%E5%AD%90%E5%9C%B0%E5%9B%BE/07769b53b5243b7d6aea9df803f471c1";

maptalks.SpatialReference.loadArcgis(arcUrl + "?f=pjson", function (err, conf) {
  if (err) {
    throw new Error(err);
  }
  const ref = conf.spatialReference;
  ref.projection = "EPSG:4490";
  const map = new maptalks.Map("map", {
    center: [114.2802000833099, 30.57662124451251],
    zoom: 0,
    spatialReference: ref,
    baseLayer: new maptalks.TileLayer("base", {
      renderer: "canvas",
      tileSystem: conf.tileSystem,
      tileSize: conf.tileSize, // [256, 256]
      urlTemplate: arcUrl + "/tile/{z}/{y}/{x}",
      attribution:
        '&copy; <a target="_blank" href="http://www.digitalwuhan.gov.cn/map/">天地图.武汉</a>',
    }),
  });
});
