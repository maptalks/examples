/**start**/
const map = new maptalks.Map("map", {
  center: [9.936716, 51.067612],
  zoom: 15,
  zoomControl: true
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  style: "{res}/styles/maptalks-common/style.json",
  maxAvailableZoom: 16
});

const groupLayer = new maptalks.GroupGLLayer("group", [vtLayer]).addTo(map);
/**end**/
