/**start**/
const map = new maptalks.Map("map", {
  center: [102.017474, 35.520836],
  zoom: 16,
});

fetch("http://tile.maptalks.com/test/planet-single/tiles.json")
  .then((response) => response.json())
  .then((data) => {
    const vt = new maptalks.VectorTileLayer("vt", {
      urlTemplate: data.tiles[0],
      spatialReference: "preset-vt-3857",
      style: "{res}/styles/maptalks-common/style.json",
    });
    const group = new maptalks.GroupGLLayer("group", [vt]);
    group.addTo(map);
  });
/**end**/
