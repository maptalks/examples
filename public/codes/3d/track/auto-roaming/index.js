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
  player.setUnitTime(10);
  player.showRoute();
  player.play();
}

function stop() {
  player.pause()
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
