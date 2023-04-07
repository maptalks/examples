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
  this.auto = false;
  this.speed = 66;
};
const options = new Config();

const autoController = gui.add(options, "auto");
autoController.onChange((value) => {
  console.log(value);
});

const speedController = gui
  .add(options, "speed")
  .name("速度")
  .min(0)
  .max(120)
  .step(0.1);
speedController.onChange((value) => {
  console.log(value);
});
