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
    [108.95994503, 34.21800914],
    [108.96222276, 34.21799044],
    [108.9602735, 34.22241057],
    [108.95623461, 34.22155857],
  ],
  {
    symbol: {
      lineColor: "#ea6b48",
      lineWidth: 4,
    },
  }
).addTo(lineLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [layer], {
  sceneConfig,
}).addTo(map);

/**start**/
function play() {
  map.setCameraMovements([
    {
      center: [108.95994503, 34.21800914],
      zoom: 18.5,
      bearing: 88.2,
      pitch: 73.2,
      timestamp: 0,
    },
    {
      center: [108.96222276, 34.21799044],
      zoom: 18.5,
      bearing: 88.2,
      pitch: 73.5,
      timestamp: 2000,
    },
    {
      center: [108.9602735, 34.22241057],
      zoom: 18.5,
      bearing: -3.6,
      pitch: 77.2,
      timestamp: 4000,
    },
    {
      center: [108.95623461, 34.22155857],
      zoom: 18.5,
      bearing: -81.6,
      pitch: 79.6,
      timestamp: 6000,
    },
  ]);
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
