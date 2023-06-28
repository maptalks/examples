/**start**/
const map = new maptalks.Map("map", {
  center: [10.03808, 51.199505],
  zoom: 14
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  style: "{res}/styles/maptalks-common/style.json"
});

const groupLayer = new maptalks.GroupGLLayer("group", [vtLayer]).addTo(map);

document.getElementById("info").innerHTML = JSON.stringify(vtLayer.toJSON());
/**end**/
