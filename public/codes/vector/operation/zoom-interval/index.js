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

function setMinZoom(value) {
  vtLayer.config({
    minZoom: value
  });
  vtLayer.getRenderer().setToRedraw();
}

function setMaxZoom(value) {
  vtLayer.config({
    maxZoom: value
  });
  vtLayer.getRenderer().setToRedraw();
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    type: "slider",
    label: "最小级别",
    value: 14,
    min: 0,
    max: 20,
    step: 1
  })
  .onChange((value) => {
    setMinZoom(value);
  });

gui
  .add({
    type: "slider",
    label: "最大级别",
    value: 18,
    min: 0,
    max: 20,
    step: 1
  })
  .onChange((value) => {
    setMaxZoom(value);
  });
