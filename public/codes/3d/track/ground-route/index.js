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

const groupLayer = new maptalks.GroupGLLayer("group", [layer], {
  sceneConfig: {
    postProcess: {
      enable: true,
      antialias: {
        enable: true,
      },
    },
  },
}).addTo(map);

/**start**/
const route = {
  path: [
    [108.95845234680178, 34.217980484633046, 17.27992, 301000],
    [108.95849687576288, 34.22103276057621, 24.54149, 541000],
    [108.96044665374757, 34.22104798247361, 26.77416, 781000],
    [108.96045157012941, 34.21797581739904, 23.76847, 901000],
    [108.95845234680178, 34.217980484633046, 18.27992, 1021000],
  ],
};

const player = new maptalks.RoutePlayer(route, groupLayer, {
  showTrail: false,
  showMarker: false,
  lineSymbol: {
    lineColor: "#ea6b48",
    lineWidth: 0,
  },
});

player.on("playing", (param) => {
  map.setCameraPosition({
    position: [param.coordinate.x, param.coordinate.y, param.coordinate.z],
    pitch: getPitch(param.pitch),
    bearing: -param.bearing - 90,
  });
});

function getPitch(pitch) {
  if (pitch > 270 && pitch < 350) {
    return pitch - 270;
  } else if (pitch >= 350 || (pitch >= 0 && pitch <= 180)) {
    return map.options["maxPitch"];
  } else {
    return 0;
  }
}

function play() {
  player.setUnitTime(30);
  player.showRoute();
  player.play();
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

gui.add({
  type: "color",
  label: "轨迹颜色",
  value: "#dbd34b",
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
  .onChange(() => {});

gui
  .add({
    type: "slider",
    label: "透明度",
    value: 1,
    min: 0,
    max: 1,
    step: 0.1,
  })
  .onChange(() => {});

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

function getPickedCoordinate(coordinate) {
  const identifyData = groupLayer.identify(coordinate)[0];
  const pickedPoint = identifyData && identifyData.point;
  if (pickedPoint) {
    const altitude = map.pointAtResToAltitude(pickedPoint[2], map.getGLRes());
    const coordinate = map.pointAtResToCoordinate(
      new maptalks.Point(pickedPoint[0], pickedPoint[1]),
      map.getGLRes()
    );
    return new maptalks.Coordinate(coordinate.x, coordinate.y, altitude);
  } else {
    return coordinate;
  }
}

map.on("click", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  console.log(coordinate, map.getPitch(), map.getBearing());
});

// [108.95845234680178, 34.217980484633046, 17.27992, 67.70000000000168, -2.399999999993952]

// [ 108.95849687576288, 34.22103276057621, 21.54149, 80 -2.5499999999937017]

//  [ 108.95831161193848, 34.22108039074132, 21.45132, 79.39999999999998 86.54999999999973]

//  [ 108.96044665374757, 34.22104798247361,23.77416, 80 86.85000000000093]

// [ 108.96041216354365, 34.22104159506827,23.67579, 68.74999999999986 178.64999999999566]
