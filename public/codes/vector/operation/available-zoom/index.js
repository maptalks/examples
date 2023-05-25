/**start**/
const map = new maptalks.Map("map", {
  center: [9.936716, 51.067612],
  zoom: 15,
  zoomControl: true,
});

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style: "{res}/styles/maptalks-common/style.json",
  maxAvailableZoom: 16,
});

const group = new maptalks.GroupGLLayer("group", [vt]).addTo(map);
/**end**/
