/**start**/
const map = new maptalks.Map("map", {
  center: [-110.01171, 53.277809],
  zoom: 16,
  zoomControl: true
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  features: false,
  style: "{res}/styles/maptalks-common/style.json"
});

const groupLayer = new maptalks.GroupGLLayer("group", [vtLayer]).addTo(map);

map.on("click", (e) => {
  const identifiedData = vtLayer.identify(e.coordinate, { tolerance: 2 });
  const layers = getLayers(identifiedData);
  document.getElementById("layers").innerText = !layers ? "无" : layers;
});

function setFeatures(value) {
  vtLayer.config({
    features: value
  });
}

function getLayers(identifiedData) {
  if (!identifiedData.length) {
    return "";
  }
  console.log(identifiedData);
  const layers = identifiedData.map((data) => data.data.feature.layer);
  return layers.join(", ");
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    type: "checkbox",
    label: "features",
    value: false
  })
  .onChange((value) => {
    setFeatures(value);
  });
