/**start**/
const map = new maptalks.Map("map", {
  center: [-0.113049,51.498568],
  zoom: 16,
  zoomControl: true,
});

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style: "{res}/styles/maptalks-common/style.json",
  minZoom: 14,
  maxZoom: 18,
});

const group = new maptalks.GroupGLLayer("group", [vt]).addTo(map);
/**end**/
