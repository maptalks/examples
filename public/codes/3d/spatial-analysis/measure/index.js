const map = new maptalks.Map("map", {
  center: [97.4656881809608, 21.4667907971768],
  zoom: 4.3,
  bearing: -3.63,
  pitch: 35.2,
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
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
  measureTool = new maptalks.MeasureTool({
    language: "zh-CN",
    metric: true,
    imperial: false,
    symbol: {
      lineColor: "#e8542b",
      dashLineColor: "#0f0",
      polygonFill: "#e8542b",
      polygonOpacity: 0.6,
    },
    labelOptions: {
      boxStyle: {
        markerFile: "{res}/images/measure-tooltip.png",
        markerDx: 90,
        textDy: -20,
      },
    },
  }).addTo(groupGLLayer);
  measureTool.disable();
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
