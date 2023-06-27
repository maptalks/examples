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
const url = "{res}/gltf/alien/alien.gltf";
const symbol = {
  url: "{res}/gltf/alien/alien.gltf",
  translationX: 0,
  translationY: 0,
  translationZ: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 180,
  scaleX: 240,
  scaleY: 240,
  scaleZ: 240
};

const gltfLayer = new maptalks.GLTFLayer("gltf");
const gltfMarker = new maptalks.GLTFMarker(map.getCenter(), {
  symbol,
}).addTo(gltfLayer);

function setTranslationX(value) {
  gltfMarker.updateSymbol({
    translationX: value,
  });
}

function setTranslationY(value) {
  gltfMarker.updateSymbol({
    translationY: value,
  });
}

function setTranslationZ(value) {
  gltfMarker.updateSymbol({
    translationZ: value,
  });
}

function setRotationX(value) {
  gltfMarker.updateSymbol({
    rotationX: value,
  });
}

function setRotationY(value) {
  gltfMarker.updateSymbol({
    rotationY: value,
  });
}

function setRotationZ(value) {
  gltfMarker.updateSymbol({
    rotationZ: value,
  });
}

function setScaleX(value) {
  gltfMarker.updateSymbol({
    scaleX: value,
  });
}

function setScaleY(value) {
  gltfMarker.updateSymbol({
    scaleY: value,
  });
}

function setScaleZ(value) {
  gltfMarker.updateSymbol({
    scaleZ: value,
  });
}
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

const gui = new mt.GUI();

gui
  .add({
    type: "slider",
    label: "平移X",
    value: 0,
    min: -100,
    max: 100,
    step: 1,
  })
  .onChange((value) => {
    setTranslationX(value);
  });

gui
  .add({
    type: "slider",
    label: "平移Y",
    value: 0,
    min: -100,
    max: 100,
    step: 1,
  })
  .onChange((value) => {
    setTranslationY(value);
  });

gui
  .add({
    type: "slider",
    label: "平移Z",
    value: 0,
    min: -100,
    max: 100,
    step: 1,
  })
  .onChange((value) => {
    setTranslationZ(value);
  });

gui
  .add({
    type: "slider",
    label: "旋转X",
    value: 0,
    min: -180,
    max: 180,
    step: 1,
  })
  .onChange((value) => {
    setRotationX(value);
  });

gui
  .add({
    type: "slider",
    label: "旋转Y",
    value: 0,
    min: -180,
    max: 180,
    step: 1,
  })
  .onChange((value) => {
    setRotationY(value);
  });

gui
  .add({
    type: "slider",
    label: "旋转Z",
    value: 180,
    min: -180,
    max: 180,
    step: 1,
  })
  .onChange((value) => {
    setRotationZ(value);
  });

gui
  .add({
    type: "slider",
    label: "缩放X",
    value: 240,
    min: 24,
    max: 1200,
    step: 1
  })
  .onChange((value) => {
    setScaleX(value);
  });

gui
  .add({
    type: "slider",
    label: "缩放Y",
    value: 240,
    min: 24,
    max: 1200,
    step: 1
  })
  .onChange((value) => {
    setScaleY(value);
  });

gui
  .add({
    type: "slider",
    label: "缩放Z",
    value: 240,
    min: 24,
    max: 1200,
    step: 1
  })
  .onChange((value) => {
    setScaleZ(value);
  });
