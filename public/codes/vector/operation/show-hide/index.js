/**start**/
const map = new maptalks.Map("map", {
  center: [114.31, 30.52],
  zoom: 15,
});

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style: "{res}/styles/maptalks-common/style.json",
});

const group = new maptalks.GroupGLLayer("group", [vt]).addTo(map);

function toggleLayerVisible(visible) {
  if (visible) {
    vt.show();
  } else {
    vt.hide();
  }
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    type: "checkbox",
    label: "显示图层",
    value: true,
  })
  .onChange((value) => {
    toggleLayerVisible(value);
  });
