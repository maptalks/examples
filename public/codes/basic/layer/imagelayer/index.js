const map = new maptalks.Map("map", {
  center: [-0.09270712, 51.50615],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const imageLayer = new maptalks.ImageLayer("images", [
  {
    url: "{res}/images/1.png",
    extent: [
      -0.11854216406254636, 51.50043810048564, -0.09081885168461667,
      51.50994770979011,
    ],
    opacity: 1,
  },
  {
    url: "{res}/images/2.png",
    extent: [
      -0.10343596289067136, 51.50797115663946, -0.07897421667485105,
      51.51876102463089,
    ],
    opacity: 1,
  },
]);

map.addLayer(imageLayer);
