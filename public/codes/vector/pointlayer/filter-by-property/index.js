const map = new maptalks.Map("map", {
  center: [121.4954, 31.2385],
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

const marker1 = new maptalks.Marker([121.475542, 31.233812], {
  id: 100,
  properties: {
    count: 100,
  },
  symbol: {
    markerFill: "#747474",
    markerFillOpacity: 0.5,
    markerType: "ellipse",
    markerWidth: 200,
    markerHeight: 200,
    textFaceName: "sans-serif",
    textName: "100",
    textFill: "#22be9e",
    textHorizontalAlignment: "right",
    textSize: 40,
    textDx: 40,
    textDy: -90,
  },
});

const marker2 = new maptalks.Marker([121.495542, 31.233812], {
  id: 200,
  properties: {
    count: 200,
  },
  symbol: {
    markerFill: "#747474",
    markerFillOpacity: 0.5,
    markerType: "ellipse",
    markerWidth: 200,
    markerHeight: 200,
    textFaceName: "sans-serif",
    textName: "200",
    textFill: "#22be9e",
    textHorizontalAlignment: "right",
    textSize: 40,
    textDx: 40,
    textDy: -90,
  },
});

const marker3 = new maptalks.Marker([121.515542, 31.233812], {
  id: 300,
  properties: {
    count: 300,
  },
  symbol: {
    markerFill: "#747474",
    markerFillOpacity: 0.5,
    markerType: "ellipse",
    markerWidth: 200,
    markerHeight: 200,
    textFaceName: "sans-serif",
    textName: "300",
    textFill: "#22be9e",
    textHorizontalAlignment: "right",
    textSize: 40,
    textDx: 40,
    textDy: -90,
  },
});

pointLayer.addGeometry([marker1, marker2, marker3]);

function selectData() {
  pointLayer.filter([">=", "count", 200]).forEach((feature) => {
    feature.updateSymbol({
      markerFill: "#f00",
    });
  });
}
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

const gui = new mt.GUI();

gui
  .add({
    type: "button",
    text: "Select >= 200",
  })
  .onClick(() => {
    selectData();
  });
