/**start**/
const map = new maptalks.Map("map", {
  center: [-3.707467, 40.409928],
  zoom: 16,
});

const json = {
  type: "VectorTileLayer",
  id: "vt",
  options: {
    urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
    spatialReference: "preset-vt-3857",
    style: "{res}/styles/maptalks-common/style.json",
  },
};

const vt = maptalks.VectorTileLayer.fromJSON(json);

const group = new maptalks.GroupGLLayer("group", [vt]).addTo(map);
/**end**/
