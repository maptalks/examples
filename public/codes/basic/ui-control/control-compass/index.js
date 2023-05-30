/**start**/
const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  compassControl: {
    position: "top-left"
  },
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}"
  })
});

const topRightCompass = new maptalks.control.Compass({
  position: "top-right"
});
map.addControl(topRightCompass);

const bottomRightCompass = new maptalks.control.Compass({
  position: "bottom-right"
});
map.addControl(bottomRightCompass);

const customPositionCompass = new maptalks.control.Compass({
  position: { bottom: "20", left: "20" }
});
map.addControl(customPositionCompass);
/**end**/
