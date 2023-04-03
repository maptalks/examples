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
  this.annotation = false;
  this.auto = false;
};
const options = new Config();

const annotationController = gui.add(options, "annotation").name("显示注释");
annotationController.onChange((value) => {
  console.log(value);
});

const autoController = gui.add(options, "auto").name("自动播放");
autoController.onChange((value) => {
  console.log(value);
});
