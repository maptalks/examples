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
        prefilterCubeSize: 1024,
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
const url = "{res}/gltf/alien/alien.glb";
const symbol = {
  url,
  rotationZ: 180,
  scaleX: 1.5,
  scaleY: 1.5,
  scaleZ: 1.5,
  uniforms: {
    polygonFill: [1, 1, 1, 1],
    metallicFactor: 0,
    roughnessFactor: 0.4,
  },
};

const layer = new maptalks.GLTFLayer("gltf");
const marker = new maptalks.GLTFMarker(map.getCenter(), {
  symbol,
}).addTo(layer);

function setPolygonFill(value) {
  marker.setUniform("polygonFill", value);
}

function setMetallicFactor(value) {
  marker.setUniform("metallicFactor", value);
}

function setRoughnessFactor(value) {
  marker.setUniform("roughnessFactor", value);
}
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [layer], {
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
    type: "color",
    label: "填充色",
    value: [1, 1, 1, 1],
  })
  .onChange((value) => {
    setPolygonFill(value);
  });

gui
  .add({
    type: "slider",
    label: "金属度",
    value: 0,
    min: 0,
    max: 1,
    step: 0.1,
  })
  .onChange((value) => {
    setMetallicFactor(value);
  });

gui
  .add({
    type: "slider",
    label: "粗糙度",
    value: 0.4,
    min: 0,
    max: 1,
    step: 0.1,
  })
  .onChange((value) => {
    setRoughnessFactor(value);
  });
