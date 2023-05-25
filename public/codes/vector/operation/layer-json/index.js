/**start**/
const map = new maptalks.Map("map", {
  center: [10.038080, 51.199505],
  zoom: 14,
});

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style: "{res}/styles/maptalks-common/style.json",
});

const group = new maptalks.GroupGLLayer("group", [vt]).addTo(map);

document.getElementById("info").innerHTML = JSON.stringify(vt.toJSON());
/**end**/
