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
        prefilterCubeSize: 32
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
    textName: "Layer is added.",
    textWeight: "bold",
    textSize: 50,
    textFill: "#1bbc9b",
    textHaloFill: "#fff",
    textHaloRadius: 5,
  },
}).addTo(pointLayer);

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

function add() {
  if (groupLayer.getLayers().length === 0) {
    groupLayer.addLayer(pointLayer);
  }
}

function remove() {
  groupLayer.removeLayer(pointLayer);
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    type: "button",
    text: "Add layer",
  })
  .onClick(() => {
    add();
  });

gui
  .add({
    type: "button",
    text: "Remove Layer",
  })
  .onClick(() => {
    remove();
  });
