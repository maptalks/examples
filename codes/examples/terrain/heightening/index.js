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
  this.height = 96;
};
const options = new Config();

const heightController = gui
  .add(options, "height")
  .name("地形高度")
  .min(0)
  .max(120)
  .step(0.1);
heightController.onChange((value) => {
  console.log(value);
});
