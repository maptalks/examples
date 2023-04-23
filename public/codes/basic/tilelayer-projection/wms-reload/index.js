const map = new maptalks.Map("map", {
  center: [-100.43074996462228, 37.69212817202581],
  zoom: 4,
  spatialReference: {
    projection: "EPSG:4326",
  },
  baseLayer: new maptalks.WMSTileLayer("wms", {
    tileSystem: [1, -1, -180, 90],
    urlTemplate: "https://ows.terrestris.de/osm/service",
    crs: "EPSG:4326",
    layers: "OSM-WMS",
    styles: "",
    version: "1.3.0",
    format: "image/png",
    transparent: true,
    uppercase: true,
  }),
  attribution: {
    content: "&copy ows.terrestris.de",
  },
});

let isTerrestris = true;
function reload() {
  const baseLayer = map.getBaseLayer();
  const options = baseLayer.options;
  if (!isTerrestris) {
    options.urlTemplate = "https://ows.terrestris.de/osm/service";
    options.layers = "OSM-WMS";
  } else {
    options.urlTemplate = "https://ahocevar.com/geoserver/wms";
    options.layers = "topp:states";
  }
  baseLayer.forceReload();
  isTerrestris = !isTerrestris;
}
