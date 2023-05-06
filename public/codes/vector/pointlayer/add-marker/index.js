const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  pitch: 80,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1],
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/gradient/front.png",
          back: "{res}/hdr/gradient/back.png",
          left: "{res}/hdr/gradient/left.png",
          right: "{res}/hdr/gradient/right.png",
          top: "{res}/hdr/gradient/top.png",
          bottom: "{res}/hdr/gradient/bottom.png",
        },
        prefilterCubeSize: 1024,
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0,
    },
  },
});

/**start**/
const pointLayer = new maptalks.PointLayer("point");

const marker = new maptalks.Marker(map.getCenter(), {
  symbol: {
    textFaceName: "sans-serif",
    textName: "MapTalks",
    textFill: "#22be9e",
    textSize: 40,
  },
}).addTo(pointLayer);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0,
    },
  },
});
groupLayer.addTo(map);
