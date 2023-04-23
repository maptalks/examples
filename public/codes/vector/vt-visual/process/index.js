const map = new maptalks.Map("map", {
  center: [-74.01, 40.704],
  zoom: 16.3,
  bearing: 24,
  pitch: 48.8,
  lights: {
    directional: {
      direction: [0.5, 0, -1],
      color: [1, 1, 1],
    },
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
      exposure: 0.787,
      hsv: [0, 0, 0],
      orientation: 0,
    },
  },
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style: "{res}/styles/road.json",
});

/**start**/
const sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 0,
    brightness: 0.489,
  },
  shadow: {
    type: "esm",
    enable: true,
    quality: "high",
    opacity: 0.5,
    color: [0, 0, 0],
    blurOffset: 1,
  },
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
      taa: true,
      jitterRatio: 0.25,
    },
    ssr: {
      enable: true,
    },
    bloom: {
      enable: true,
      threshold: 0,
      factor: 1,
      radius: 1,
    },
    ssao: {
      enable: true,
      bias: 0.101,
      radius: 0.069,
      intensity: 1.5,
    },
    sharpen: {
      enable: true,
      factor: 0.2,
    },
    vignette: {
      enable: false,
    },
    colorLUT: {
      enable: true,
      lut: "{res}/lut/BW.cube",
    },
    outline: {
      enable: true,
      outlineFactor: 0.3,
      highlightFactor: 0.2,
      outlineWidth: 1,
      outlineColor: [1, 1, 0],
    },
  },
  ground: {
    enable: true,
    renderPlugin: {
      type: "fill",
    },
    symbol: {
      polygonFill: [0.803921568627451, 0.803921568627451, 0.803921568627451, 1],
      polygonOpacity: 1,
    },
  },
};

const groupGLLayer = new maptalks.GroupGLLayer("gl", [vtLayer], {
  sceneConfig,
}).addTo(map);

const gui = new mt.GUI();

gui
  .add({
    type: "slider",
    label: "色相",
    min: -1,
    max: 1,
    step: 0.1,
    value: 0,
  })
  .onChange((value) => {
    const lights = map.getLights();
    lights.ambient.hsv[0] = value;
    map.setLights(lights);
  });

gui
  .add({
    type: "slider",
    label: "饱和度",
    min: -1,
    max: 1,
    step: 0.1,
    value: 0,
  })
  .onChange((value) => {
    const lights = map.getLights();
    lights.ambient.hsv[1] = value;
    map.setLights(lights);
  });

gui
  .add({
    type: "slider",
    label: "明度",
    min: -1,
    max: 1,
    step: 0.1,
    value: 0,
  })
  .onChange((value) => {
    const lights = map.getLights();
    lights.ambient.hsv[2] = value;
    map.setLights(lights);
  });

gui
  .add({
    type: "slider",
    label: "锐化",
    min: 0,
    max: 1,
    step: 0.1,
    value: 0.2,
  })
  .onChange((value) => {
    const sceneConfig = groupGLLayer.getSceneConfig();
    sceneConfig.postProcess.sharpen.factor = value;
    groupGLLayer.setSceneConfig(sceneConfig);
  });

gui
  .add({
    type: "checkbox",
    label: "暗角",
    value: false,
  })
  .onChange((value) => {
    const sceneConfig = groupGLLayer.getSceneConfig();
    sceneConfig.postProcess.vignette.enable = value;
    groupGLLayer.setSceneConfig(sceneConfig);
  });

const lutMap = {
  bm: "{res}/lut/BW.cube",
  mv: "{res}/lut/MV.cube",
  wed: "{res}/lut/WED.cube",
};

gui
  .add({
    type: "select",
    label: "滤镜",
    value: "bm",
    options: [
      {
        label: "明亮",
        value: "bm",
      },
      {
        label: "暗色",
        value: "mv",
      },
      {
        label: "鲜艳",
        value: "wed",
      },
    ],
  })
  .onChange((value) => {
    const sceneConfig = groupGLLayer.getSceneConfig();
    sceneConfig.postProcess.colorLUT.lut = value;
    groupGLLayer.setSceneConfig(sceneConfig);
  });
/**end**/
