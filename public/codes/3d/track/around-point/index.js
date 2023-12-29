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

const groupLayer = new maptalks.GroupGLLayer("group", [layer], {
  sceneConfig,
}).addTo(map);

/**start**/
const player = map.animateTo(
  {
    bearing: map.getBearing() + 360,
  },
  {
    easing: "linear",
    duration: 20000,
    repeat: true
  }
);

function rotate() {
  player.play();
}

function stop() {
  player.pause();
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
    rotate();
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
