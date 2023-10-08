const map = new maptalks.Map("map", {
  center: [-74.01252272617671, 40.70709931736744],
  zoom: 16,
  pitch: 80,
  lights: {
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
        prefilterCubeSize: 32
      },
      exposure: 1,
      hsv: [0, 1, -0.042],
      orientation: 0,
    },
    directional: {
      direction: [-0.1, 1, -1],
      color: [1, 1, 1],
    },
  },
});

/**start**/
let selectedModel = null;
const optionsMap = {
  'fence': {
    direction: 2,
    symbol: {
      url: "{res}/gltf/fence/fence.glb",
      modelHeight: 80,
      rotationZ: 90
    },
  },
  'tree': {
    scaleVertex: false,//是否缩放端点处的模型
    gapLength: 50,
    symbol: {
      url: "{res}/gltf/tree_low-poly/scene.gltf",
      modelHeight: 120
    },
  },
  'road': {
    direction: 2,
    symbol: {
      url: "{res}/gltf/road/road_straight.glb",
      modelHeight: 1,
      rotationZ: 90
    }
  },
  'house': {
    symbol: {
      url: "{res}/gltf/29c/scene.gltf",
      modelHeight: 200
    }
  },
  'taxi': {
    symbol: {
      url: "{res}/gltf/taxi/taxi.glb",
      modelHeight: 70
    }
  },
  'forest': {
    symbol: {
      url: "{res}/gltf/trees_low_high/scene.gltf",
      modelHeight: 200,
      shadow: true
    },
    gapLength: 100,
    randomDistribution: true
  },
  'grass': {
    symbol: {
      url: "{res}/gltf/grass/grass.glb",
      modelHeight: 20,
      shadow: true
    }
  }
};
const gltfLayer = new maptalks.GLTFLayer("gltf");
const drawtool = new maptalks.DrawTool({
  mode: 'LineString',
  symbol: {
    lineColor: '#ae3',
    polygonFill: '#aaa',
    polygonOpacity: 0.4
  }
}).addTo(map).disable();

drawtool.on('mousemove', (e) => {
  const geo = e.geometry;
  const coordinates = geo.getCoordinates();
  selectedModel.setCoordinates(coordinates);
});

drawtool.on('drawend', (e) => {
  drawtool.disable();
  const geo = e.geometry;
  const coordinates = geo.getCoordinates();
  selectedModel.setCoordinates(coordinates);

});
const gui = new mt.GUI();

gui
  .add({
    type: "select",
    label: "多模型选择",
    value: 'null',
    options: [
      {
        label: '围栏',
        value: 'fence'
      },
      {
        label: "树木",
        value: "tree"
      },
      {
        label: "道路",
        value: "road"
      }
    ]
  })
  .onChange((value) => {
    drawtool.setMode('LineString');
    drawtool.enable();
    selectedModel = new maptalks.GLTFLineString(null, optionsMap[value]);
    selectedModel.addTo(gltfLayer);
  });

  gui
  .add({
    type: "select",
    label: "单模型选择",
    value: 'null',
    options: [
      {
        label: '房屋',
        value: 'house'
      },
      {
        label: "车",
        value: "taxi"
      }
    ]
  })
  .onChange((value) => {
    drawtool.enable();
    drawtool.setMode('Point');
    selectedModel = new maptalks.GLTFMarker([0, 0], optionsMap[value]);
    selectedModel.addTo(gltfLayer);
  });

// gui
//   .add({
//     type: "select",
//     label: "范围绘制",
//     value: 'null',
//     options: [
//       {
//         label: '森林',
//         value: 'forest'
//       },
//       {
//         label: "青草",
//         value: "grass"
//       }
//     ]
//   })
//   .onChange((value) => {
//     drawtool.enable();
//     drawtool.setMode('Polygon');
//     selectedModel = new maptalks.GLTFPolygon(null, optionsMap[value]);
//     selectedModel.addTo(gltfLayer);
//   });

gui
  .add({
    type: "button",
    label: "清除",
    role: "clear",
  })
  .onClick(() => {
    gltfLayer.clear();
  });
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [gltfLayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0,
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "lit",
      },
      symbol: {
        polygonFill: [0.54, 0.54, 0.54, 1],
        ssr: true,
        material: {
          baseColorTexture: "{res}/textures/rubber_roughness.png",
          baseColorFactor: [0.3450981, 0.3372549, 0.2117647, 1],
          hsv: [-0.468, 0, -0.128],
          baseColorIntensity: 1.372,
          contrast: 1.372,
          roughnessFactor: 1,
          metallicFactor: 0,
          normalTexture: "{res}/textures/rubber_roughness.png",
          uvScale: [0.09, 0.09],
          normalMapFactor: 0.68,
          emitColorFactor: 1.11,
          noiseTexture: "{res}/textures/noise.png",
        },
      },
    },
  },
}).addTo(map);
