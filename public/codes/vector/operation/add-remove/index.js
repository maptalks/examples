/**start**/
const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style: "{res}/styles/maptalks-common/style.json"
});

const groupLayer = new maptalks.GroupGLLayer("group", [vtLayer]).addTo(map);

function add() {
  if (groupLayer.getLayers().length === 0) {
    groupLayer.addLayer(vtLayer);
  }
}

function remove() {
  groupLayer.removeLayer(vtLayer);
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    type: "button",
    text: "添加图层"
  })
  .onClick(() => {
    add();
  });

gui
  .add({
    type: "button",
    text: "移除图层"
  })
  .onClick(() => {
    remove();
  });
