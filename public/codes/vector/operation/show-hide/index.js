/**start**/
const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
});

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
});

const groupLayer = new maptalks.GroupGLLayer("group", [vt]).addTo(map);

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
