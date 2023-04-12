const map = new maptalks.Map("map", {
  center: [108.95965, 34.21776],
  zoom: 18.865,
  bearing: -1.23,
  pitch: 76.8,
  lights: {
    directional: { direction: [-1, -1, -1], color: [1, 1, 1] },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/923/front.jpg",
          back: "{res}/hdr/923/back.jpg",
          left: "{res}/hdr/923/left.jpg",
          right: "{res}/hdr/923/right.jpg",
          top: "{res}/hdr/923/top.jpg",
          bottom: "{res}/hdr/923/bottom.jpg",
        },
      },
      exposure: 1.426,
      hsv: [0, 0, 0],
      orientation: 302.553,
    },
  },
});

const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://resource.dvgis.cn/data/3dtiles/dayanta/tileset.json",
      ambientLight: [1, 1, 1],
      maximumScreenSpaceError: 1.0,
      pointOpacity: 0.5,
      pointSize: 3,
      heightOffset: -400,
    },
  ],
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.915,
    },
    postProcess: {
      enable: true
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "lit",
      },
      symbol: {
        polygonOpacity: 1,
        material: {
          baseColorFactor: [0.48235, 0.48235, 0.48235, 1],
          hsv: [0, 0, -0.532],
          roughnessFactor: 0.22,
          metallicFactor: 0.58,
        },
      },
    },
  },
}).addTo(map);

let measureTool = null;
layer.once("loadtileset", (e) => {
  skylineAnalysis = new maptalks.SkylineAnalysis({
    lineColor: [1, 0, 0],
    lineWidth: 1.8,
  });
  skylineAnalysis.addTo(groupGLLayer);
});

const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "测量距离",
    role: "distance",
  })
  .onClick(() => {
    if (measureTool) {
      measureTool.enable();
      measureTool.setType("distance");
    }
  });

gui
  .add({
    type: "button",
    label: "测量面积",
    role: "area",
  })
  .onClick(() => {
    if (measureTool) {
      measureTool.enable();
      measureTool.setType("area");
    }
  });

gui
  .add({
    type: "button",
    label: "测量高度",
    role: "height",
  })
  .onClick(() => {
    if (measureTool) {
      measureTool.enable();
      measureTool.setType("height");
    }
  });

gui
  .add({
    type: "button",
    label: "清除全部",
    role: "clear",
  })
  .onClick(() => {
    if (measureTool) {
      measureTool.clear();
      measureTool.disable();
    }
  });
