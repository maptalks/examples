const map = new maptalks.Map("map", {
  center: [-73.98170407, 40.76104242],
  zoom: 15.141217633928335,
  bearing: -160.4,
  pitch: 58.45,
  lights: {
    directional: {
      direction: [0.5, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      exposure: 0.787,
      hsv: [0, 0, -0.298],
      orientation: 0
    }
  }
});

const vtStyle = [
  {
    filter: ["all", ["==", "$layer", "entertainment"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      dataConfig: {
        type: "fill"
      },
      sceneConfig: {},
      type: "fill"
    },
    symbol: {
      polygonFill: [0.5725490196078431, 0.6980392156862745, 0.5450980392156862, 1]
    }
  },
  {
    filter: ["all", ["==", "$layer", "entertainment"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      dataConfig: {
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: [0.73, 0.73, 0.73, 1],
      lineWidth: 2
    }
  },
  {
    filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      type: "lit",
      dataConfig: {
        type: "3d-extrusion",
        altitudeProperty: "height",
        minHeightProperty: "min_height",
        altitudeScale: 1,
        defaultAltitude: 10,
        topThickness: 0,
        top: true,
        side: true
      },
      sceneConfig: {
        animation: null,
        animationDuration: 800
      }
    },
    symbol: {
      bloom: false,
      ssr: false,
      polygonOpacity: 1,
      material: {
        baseColorFactor: [1, 1, 1, 1],
        hsv: [0, 0, -0.32],
        baseColorIntensity: 1.532,
        roughnessFactor: 1,
        metallicFactor: 0,
        clearCoatIor: 1.4,
        clearCoatRoughnessFactor: 0.04,
        emissiveTexture: "{res}/textures/897/1.jpg",
        emissiveFactor: [0.9333333333333333, 0.9254901960784314, 0.9607843137254902],
        emitColorFactor: 0.31
      }
    }
  },
  {
    filter: ["all", ["==", "$layer", "secondary-road"], ["==", "$type", "LineString"]],
    renderPlugin: {
      dataConfig: {
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: [1, 1, 1, 1],
      linePatternFile: "{res}/patterns/d4b.jpg",
      lineWidth: {
        type: "exponential",
        default: 2,
        stops: [
          [14, 2],
          [15, 4],
          [16, 10],
          [17, 20],
          [18, 50],
          [20.7, 100],
          [22, 200]
        ]
      }
    }
  }
];

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  style: vtStyle
});

const gltfLayer = new maptalks.GLTFLayer("gltf");
const center = map.getCenter();
/**start**/
const sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 3,
    brightness: 0.489
  },
  shadow: {
    type: "esm",
    enable: true,
    quality: "high",
    opacity: 0.5,
    color: [0, 0, 0],
    blurOffset: 1
  },
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
      taa: true,
      jitterRatio: 0.25
    },
    // ssr: {
    //   enable: true
    // },
    "scanEffect": {
      "enable": true,
      effects: [{
        center: center.add(0.01, 0),
        radius: 1500,
        speed: 1.5,
        color: [0.4667, 0.8800, 0.3804]
      },{
        center: center.add(0, 0.01),
        radius: 1000,
        speed: 1.8,
        color: [0.6667, 0.8800, 0.9804]
      }
    ]
    }
  },
  ground: {
    enable: true,
    renderPlugin: {
      type: "fill"
    },
    symbol: {
      polygonFill: [0.803921568627451, 0.803921568627451, 0.803921568627451, 1],
      polygonOpacity: 1
    }
  }
};

const groupGLLayer = new maptalks.GroupGLLayer("gl", [vtLayer, gltfLayer], {
  sceneConfig
}).addTo(map);
/**end**/

const vLayer = new maptalks.VectorLayer('vv').addTo(map);
const line = new maptalks.LineString([center, center.add(0.01, 0), center.add(0.01, 0.01)], { symbol: { lineOpacity: 0 }}).addTo(vLayer);

let enableAdd = false;
map.on('click', e => {
  if (!enableAdd) {
    return;
  }
  const sceneConfig = groupGLLayer.getSceneConfig();
  sceneConfig.postProcess.scanEffect = sceneConfig.postProcess.scanEffect || { enable: true, effects: []};
  sceneConfig.postProcess.scanEffect.effects.push({
    center: e.coordinate,
    radius: 1000,
    speed: 1,
    color: [0.8667, 0.4800, 0.3804, 1.0]
  });
  groupGLLayer.setSceneConfig(sceneConfig);
  enableAdd = false;
});
const gui = new mt.GUI();
gui
  .add({
    type: "checkbox",
    label: "显示/隐藏",
    value: true
  })
  .onChange((value) => {
    const sceneConfig = groupGLLayer.getSceneConfig();
    sceneConfig.postProcess.scanEffect.enable = value;
    groupGLLayer.setSceneConfig(sceneConfig);
  });

gui
  .add({
    type: "button",
    label: "新增(点击地图添加)",
    role: "draw",
  })
  .onClick(() => {
    enableAdd = true;
  });

gui
  .add({
    type: "button",
    label: "删除",
    role: "clear",
  })
  .onClick(() => {
    const sceneConfig = groupGLLayer.getSceneConfig();
    if (!sceneConfig.postProcess.scanEffect.effects.length) {
      return;
    }
    sceneConfig.postProcess.scanEffect.effects.pop();
    groupGLLayer.setSceneConfig(sceneConfig);
  });

  gui
  .add({
    type: "checkbox",
    label: "运动",
    value: false
  })
  .onChange((value) => {
    const sceneConfig = groupGLLayer.getSceneConfig();
    if (!sceneConfig.postProcess.scanEffect.effects.length) {
      return;
    }
    groupGLLayer.setSceneConfig(sceneConfig);
    line.animateShow({
      duration : 10000,
      easing : 'linear'
    }, function (frame, currentCoord) {
      const effect = sceneConfig.postProcess.scanEffect.effects[0];
      effect.center.x = currentCoord.x;
      effect.center.y = currentCoord.y;
      groupGLLayer.setSceneConfig(sceneConfig);
    });
  });

  gui
  .add({
    type: "checkbox",
    label: "水平/垂直",
    value: true
  })
  .onChange((value) => {
    const sceneConfig = groupGLLayer.getSceneConfig();
    if (!sceneConfig.postProcess.scanEffect.effects.length) {
      return;
    }
    sceneConfig.postProcess.scanEffect.effects[0].direction = !value ? 'vertical' : 'horizonal';
    sceneConfig.postProcess.scanEffect.effects[0].height = 500;
    groupGLLayer.setSceneConfig(sceneConfig);
  });

  gui
  .add({
    type: "slider",
    label: "速度",
    value: 1,
    min: 0.1,
    max: 5,
    step: 0.1
  })
  .onChange((value) => {
    const sceneConfig = groupGLLayer.getSceneConfig();
    if (!sceneConfig.postProcess.scanEffect.effects.length) {
      return;
    }
    sceneConfig.postProcess.scanEffect.effects[0].speed = value;
    groupGLLayer.setSceneConfig(sceneConfig);
  });
