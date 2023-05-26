/**start**/
const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 16,
  zoomControl: true
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style: "{res}/styles/maptalks-common/style.json",
  minZoom: 14,
  maxZoom: 18
});

const groupLayer = new maptalks.GroupGLLayer("group", [vtLayer]).addTo(map);
/**end**/
