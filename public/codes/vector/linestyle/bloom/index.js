const map = new maptalks.Map("map", {
  center: [-73.99727760921917, 40.75410734656785],
  zoom: 14,
  zoomControl: true,
  bearing: 29.6,
  pitch: 7.6,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1],
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/gradient/front.png",
          back: "{res}/hdr/gradient/back.png",
          left: "{res}/hdr/gradient/left.png",
          right: "{res}/hdr/gradient/right.png",
          top: "{res}/hdr/gradient/top.png",
          bottom: "{res}/hdr/gradient/bottom.png",
        },
        prefilterCubeSize: 1024,
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0,
    },
  },
});

/**start**/
const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
});

const style = {
  style: [
    {
      filter: [
        "all",
        ["==", "$layer", "provincial-highway"],
        ["==", "$type", "LineString"],
      ],
      renderPlugin: {
        dataConfig: {
          type: "line",
        },
        sceneConfig: {},
        type: "line",
      },
      symbol: {
        lineBloom: true,
        lineColor: [0.73, 0.73, 0.73, 1],
        lineOpacity: 1,
        lineWidth: 3,
      },
    },
  ],
};
vt.setStyle(style);

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0,
    },
    postProcess: {
      enable: true,
      bloom: {
        enable: true,
        threshold: 0,
        factor: 0.6,
        radius: 1,
      },
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill",
      },
      symbol: {
        polygonFill: [0.3215686, 0.3215686, 0.3215686, 1],
      },
    },
  },
});
groupLayer.addTo(map);

function setBloomThreshold(value) {
  const sceneConfig = groupLayer.getSceneConfig();
  sceneConfig.postProcess.bloom.threshold = value;
  groupLayer.setSceneConfig(sceneConfig);
}

function setBloomFactor(value) {
  const sceneConfig = groupLayer.getSceneConfig();
  sceneConfig.postProcess.bloom.factor = value;
  groupLayer.setSceneConfig(sceneConfig);
}

function setBloomRadius(value) {
  const sceneConfig = groupLayer.getSceneConfig();
  sceneConfig.postProcess.bloom.radius = value;
  groupLayer.setSceneConfig(sceneConfig);
}

/**end**/

const gui = new mt.GUI();

gui
  .add({
    type: "slider",
    label: "threshold",
    value: 0,
    min: 0,
    max: 1,
    step: 0.1,
  })
  .onChange((value) => {
    setBloomThreshold(value);
  });

gui
  .add({
    type: "slider",
    label: "factor",
    value: 0.6,
    min: 0,
    max: 5,
    step: 0.1,
  })
  .onChange((value) => {
    setBloomFactor(value);
  });

gui
  .add({
    type: "slider",
    label: "radius",
    value: 1,
    min: 0,
    max: 1,
    step: 0.1,
  })
  .onChange((value) => {
    setBloomRadius(value);
  });
