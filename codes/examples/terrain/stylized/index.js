const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const gui = new dat.GUI({
  // width: 250,
});

const Config = function () {
  this.type = "卫星影像";
};
const options = new Config();

const typeControl = gui
  .add(options, "type", ["普通地形", "卫星影像"])
  .name("");
typeControl.onChange((value) => {
  console.log(value);
});
