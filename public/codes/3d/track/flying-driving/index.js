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

/**start**/
const gltfLayer = new maptalks.GLTFLayer("gltf");

const plane = new maptalks.GLTFMarker(
  [108.9585062962617, 34.21792224742464, 55.36973],
  {
    symbol: {
      url: "{res}/gltf/airplane/scene.gltf",
      rotationZ: 150,
    },
  }
).addTo(gltfLayer);

const car = new maptalks.GLTFMarker(
  [108.96099472732544, 34.21793272780141, 20.3101],
  {
    symbol: {
      url: "{res}/gltf/ambulance_car/scene.gltf",
      scaleX: 0.5,
      scaleY: 0.5,
      scaleZ: 0.5,
      rotationZ: 90,
    },
  }
).addTo(gltfLayer);

const planeRoute = {
  path: [
    [108.9585062962617, 34.21792224742464, 55.36973, 301000],
    [108.95941857376101, 34.21978314186296, 88.36877, 541000],
  ],
};

const carRoute = {
  path: [
    [108.96099472732544, 34.21793272780141, 20.3101, 301000],
    [108.96046160202025, 34.217917380427224, 19.65663, 541000],
    [108.96047217636101, 34.21897194236598, 22.20198, 781000],
  ],
};

const planePlayer = new maptalks.RoutePlayer(planeRoute, map, {
  showTrail: false,
  markerSymbol: {
    markerOpacity: 0,
  },
  lineSymbol: {
    lineColor: "#ea6b48",
    lineWidth: 2,
  },
});

const carPlayer = new maptalks.RoutePlayer(carRoute, map, {
  showTrail: false,
  markerSymbol: {
    markerOpacity: 0,
  },
});

let currentPlayer = planePlayer;

planePlayer.on("playing", (param) => {
  plane.setCoordinates(param.coordinate);
  plane.updateSymbol({
    rotationX: -param.rotationY + 90,
    rotationZ: param.rotationZ - 90,
  });
});

carPlayer.on("playing", (param) => {
  car.setCoordinates(param.coordinate);
  car.updateSymbol({
    rotationX: -param.rotationY + 90,
    rotationZ: param.rotationZ + 90,
  });
});

function play() {
  currentPlayer.setUnitTime(10);
  currentPlayer.showRoute();
  currentPlayer.play();
}

function pause() {
  currentPlayer.pause();
}

function changeCurrentPlayer(value) {
  if (value === "plane") {
    currentPlayer = planePlayer;
  } else {
    currentPlayer = carPlayer;
  }
}

function setColor(value) {
  currentPlayer.setLineSymbol(0, {
    lineColor: value,
  });
}

function setWidth(value) {
  currentPlayer.setLineSymbol(0, {
    lineWidth: value,
  });
}

function setOpacity(value) {
  currentPlayer.setLineSymbol(0, {
    lineOpacity: value,
  });
}

function showRoute() {
  currentPlayer.showRoute();
}

function hideRoute() {
  currentPlayer.hideRoute();
}
/**end**/
const groupLayer = new maptalks.GroupGLLayer("group", [layer, gltfLayer], {
  sceneConfig: {
    postProcess: {
      enable: true,
      antialias: {
        enable: true,
      },
    },
  },
}).addTo(map);

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
    pause();
  });

gui
  .add({
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
  })
  .onChange((value) => {
    changeCurrentPlayer(value);
  });

gui
  .add({
    type: "color",
    label: "轨迹颜色",
    value: "#ea6b48",
  })
  .onChange((value) => {
    setColor(value);
  });

gui
  .add({
    type: "slider",
    label: "轨迹宽度",
    value: 2,
    min: 1,
    max: 10,
    step: 1,
  })
  .onChange((value) => {
    setWidth(value);
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
    setOpacity(value);
  });

gui
  .add({
    type: "checkbox",
    label: "显示轨迹",
    value: true,
  })
  .onChange((value) => {
    if (value) {
      showRoute();
    } else {
      hideRoute();
    }
  });

gui.add({
  type: "checkbox",
  label: "显示站点",
  value: true,
});
