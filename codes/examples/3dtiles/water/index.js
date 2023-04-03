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
  this.enable = false;
  this.flow = false;
  this.fill = "#6a97d9";
  this.contrast = 66;
  this.hue = 66;
  this.saturation = 66;
  this.lightness = 66;
  this.scale = 66;
  this.speed = 66;
  this.direction = 66;
};
const options = new Config();

const enableController = gui.add(options, "enable").name("显示地形");
enableController.onChange((value) => {
  console.log(value);
});

const flowController = gui.add(options, "flow").name("水面流动");
flowController.onChange((value) => {
  console.log(value);
});

const fillController = gui.addColor(options, "fill").name("填充");
fillController.onChange((value) => {
  console.log(value);
});

const contrastController = gui
  .add(options, "contrast")
  .name("对比度")
  .min(0)
  .max(100)
  .step(0.1);
contrastController.onChange((value) => {
  console.log(value);
});

const hueController = gui
  .add(options, "hue")
  .name("色相")
  .min(0)
  .max(100)
  .step(0.1);
hueController.onChange((value) => {
  console.log(value);
});

const saturationController = gui
  .add(options, "saturation")
  .name("饱和度")
  .min(0)
  .max(100)
  .step(0.1);
saturationController.onChange((value) => {
  console.log(value);
});

const lightnessController = gui
  .add(options, "lightness")
  .name("明度")
  .min(0)
  .max(100)
  .step(0.1);
lightnessController.onChange((value) => {
  console.log(value);
});

const scaleController = gui
  .add(options, "scale")
  .name("缩放")
  .min(0)
  .max(100)
  .step(0.1);
scaleController.onChange((value) => {
  console.log(value);
});

const speedController = gui
  .add(options, "speed")
  .name("流速")
  .min(0)
  .max(100)
  .step(0.1);
speedController.onChange((value) => {
  console.log(value);
});

const directionController = gui
  .add(options, "direction")
  .name("流向")
  .min(0)
  .max(100)
  .step(0.1);
directionController.onChange((value) => {
  console.log(value);
});
