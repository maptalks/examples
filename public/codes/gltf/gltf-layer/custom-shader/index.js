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
const vert = `
attribute vec3 aPosition;
uniform mat4 positionMatrix;
uniform mat4 projViewMatrix;
uniform mat4 modelMatrix;
uniform vec3 color;
varying vec3 vColor;

#include <get_output>
void main()
{
mat4 localPositionMatrix = getPositionMatrix();
vec4 localVertex = getPosition(aPosition);
vec4 position = localPositionMatrix * localVertex;
gl_Position = projViewMatrix * modelMatrix * position;
vColor = color;
}
`;

const frag = `
precision mediump float;
varying vec3 vColor;
void main() {
gl_FragColor = vec4(vColor, 1.0);
}
`;
const config = {
  vert,
  frag,
  uniforms: ["projViewMatrix", "color"],
  positionAttribute: "POSITION",
};
maptalks.GLTFLayer.registerShader("customShader", "MeshShader", config);

const symbol = {
  url: "{res}/gltf/alien/alien.gltf",
  shader: "customShader",
  modelHeight: 240,
  rotationZ: 180,
  uniforms: {
    color: [0.0, 1.0, 0.3],
  },
};

const gltfLayer = new maptalks.GLTFLayer("gltf");
const gltfMarker = new maptalks.GLTFMarker(map.getCenter(), {
  symbol,
}).addTo(gltfLayer);
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
