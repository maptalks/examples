/**start**/
const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  zoomControl: true,
});

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  maxAvailableZoom: 16,
});

const groupLayer = new maptalks.GroupGLLayer("group", [vt]).addTo(map);
/**end**/
