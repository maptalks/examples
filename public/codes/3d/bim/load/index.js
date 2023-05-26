const map = new maptalks.Map("map", {
  center: [108.95965, 34.2189],
  zoom: 18,
  bearing: 0,
  pitch: 45,
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
      url: "http://examples.maptalks.com/samples/ifc/test1/tileset.json",
      ambientLight: [1, 1, 1],
      maximumScreenSpaceError: 1.0,
      heightOffset: -40,
      opacity: 1.0,
    },
  ],
  polygonOpacity: 1.0,
});

layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
});

function toFullView() {
  const extent = layer.getExtent();
  map.fitExtent(extent, 0, { animation: false });
}

// 按钮刷新当前物件

const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.915,
    },
    postProcess: {
      enable: true,
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

/**start**/
let selectedColor = "#33CCFF",
  selectedOpacity = 1,
  infoWindow = null;
map.on("click", (e) => {
  layer.cancelAllHighlight();
  const hits = layer.identify(e.coordinate);
  if (hits.length) {
    const batchId = hits[0].data.batchId;
    layer.highlight({
      id: batchId,
      color: selectedColor,
      opacity: selectedOpacity,
    });
    infoWindow = showInfoWindow(e.coordinate, `名称: ${hits[0].data.name}`);
  } else if (infoWindow) {
    infoWindow.remove();
  }
});

function showInfoWindow(coordinate, content) {
  return new maptalks.ui.InfoWindow({
    title: "属性查询",
    content,
    animation: "scale",
    autoOpenOn: null,
  })
    .addTo(map)
    .show(coordinate);
}
/**end**/

const gui = new mt.GUI();
gui
  .add({
    label: "过滤模型",
    type: "button",
    role: "clear"
  }).onClick(() => {
    const batchIds = layer.getCurrentBatchIDs()
    console.log(batchIds)
  })
gui
  .add({
    label: "过滤模型",
    type: "select",
    value: "0",
    options: [
      {
        label: "部件001",
        value: "0",
      },
      {
        label: "部件002",
        value: "139",
      },
      {
        label: "部件003",
        value: "26",
      },
    ],
  })
  .onChange((value) => {
    layer.cancelAllHighlight();
    layer.highlight({
      id: Number(value),
      color: selectedColor,
      opacity: selectedColor,
    });
  });

gui
  .add({
    type: "color",
    label: "选中填充色",
    value: selectedColor,
  })
  .onChange((value) => {
    selectedColor = value;
  });

gui
  .add({
    type: "slider",
    label: "透明度",
    value: selectedOpacity,
    min: 0.0,
    max: 1.0,
    step: 0.1,
  })
  .onChange((value) => {
    selectedOpacity = value;
  });

  gui
  .add({
    type: "button",
    label: "全景",
    role: "panorama",
  })
  .onClick(() => {
    toFullView();
  });
