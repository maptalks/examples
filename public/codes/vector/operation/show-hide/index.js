/**start**/
const map = new maptalks.Map("map", {
  center: [114.31, 30.52],
  zoom: 15
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  style: "{res}/styles/maptalks-common/style.json"
});

const groupLayer = new maptalks.GroupGLLayer("group", [vtLayer]).addTo(map);

function toggleLayerVisible(visible) {
  if (visible) {
    vtLayer.show();
  } else {
    vtLayer.hide();
  }
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    type: "checkbox",
    label: "显示图层",
    value: true
  })
  .onChange((value) => {
    toggleLayerVisible(value);
  });
