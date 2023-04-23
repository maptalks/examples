const map = new maptalks.Map("map", {
  center: [108.9594, 34.2193],
  zoom: 17.8,
  pitch: 58.4,
  bearing: 0,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
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

const sceneConfig = {
  ground: {
    enable: false,
    renderPlugin: {
      type: "fill",
    },
    symbol: {
      polygonFill: [0, 0, 0, 1],
      polygonOpacity: 1,
    },
  },
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
    },
  },
};

const lineLayer = new maptalks.VectorLayer("line").addTo(map);
lineLayer.setZIndex(1);
const lineString1 = new maptalks.LineString(
  [
    [108.95821, 34.21859],
    [108.95938, 34.22207],
  ],
  {
    symbol: {
      lineColor: "#ea6b48",
      lineWidth: 4,
    },
  }
).addTo(lineLayer);

const lineString2 = new maptalks.LineString(
  [
    [108.961136, 34.218191],
    [108.960527, 34.218217],
    [108.960571, 34.219085],
  ],
  {
    symbol: {
      lineColor: "#dbd34b",
      lineWidth: 4,
    },
  }
).addTo(lineLayer);

const gltfLayer = new maptalks.GLTFLayer("gltf");
gltfLayer.setZIndex(2);
const gltfMarker1 = new maptalks.GLTFMarker([108.95841, 34.21779, 50], {
  symbol: {
    url: "{res}/gltf/airplane/scene.gltf",
    rotationZ: 150,
  },
}).addTo(gltfLayer);
const gltfMarker2 = new maptalks.GLTFMarker([108.961136, 34.218001, 20], {
  symbol: {
    url: "{res}/gltf/ambulance_car/scene.gltf",
    rotationZ: 90,
    scaleX: 0.5,
    scaleY: 0.5,
    scaleZ: 0.5,
  },
}).addTo(gltfLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [layer, gltfLayer], {
  sceneConfig,
}).addTo(map);

map.on("click", (e) => {
  console.log(e);
});

/**start**/
function play() {
  lineString1.animateShow(
    {
      duration: 100000,
      easing: "linear",
    },
    (_, c) => {
      gltfMarker1.setCoordinates([c.x + 0.0002, c.y - 0.0008, 50]);
    }
  );
  lineString2.animateShow(
    {
      duration: 100000,
      easing: "linear",
    },
    (_, c) => {
      gltfMarker2.setCoordinates([c.x, c.y - 0.0002, 20]);
    }
  );
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    type: "button",
    label: "开始播放",
    role: "play",
  })
  .onClick(() => {
    play();
  });

gui
  .add({
    type: "button",
    label: "停止播放",
    role: "pause",
  })
  .onClick(() => {
    stop();
  });

gui.add({
  label: "选择轨迹",
  type: "select",
  value: "plane",
  options: [
    {
      label: "飞机",
      value: "plane",
    },
    {
      label: "汽车",
      value: "car",
    },
  ],
});

gui
  .add({
    type: "color",
    label: "轨迹颜色",
    value: "#dbd34b",
  })
  .onChange((value) => {
    lineString1.updateSymbol({
      lineColor: value,
    });
  });

gui
  .add({
    type: "slider",
    label: "轨迹宽度",
    value: 4,
    min: 1,
    max: 10,
    step: 1,
  })
  .onChange((value) => {
    lineString1.updateSymbol({
      lineWidth: value,
    });
  });

gui
  .add({
    type: "slider",
    label: "透明度",
    value: 1,
    min: 0,
    max: 1,
    step: 0.1,
  })
  .onChange((value) => {
    lineString1.updateSymbol({
      lineOpacity: value,
    });
  });

gui.add({
  type: "checkbox",
  label: "显示轨迹",
  value: true,
});

gui.add({
  type: "checkbox",
  label: "显示站点",
  value: true,
});
