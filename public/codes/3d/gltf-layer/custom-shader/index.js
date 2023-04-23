const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  pitch: 80,
  bearing: 180,
  lights: {
    ambient: {
      resource: {
        url: "/resources/hdr/env.hdr",
      },
      color: [1, 1, 1],
      exposure: 1,
    },
    directional: {
      color: [1, 1, 1],
      lightColorIntensity: 5000,
      direction: [1, -0.4, -1],
    },
  },
});

const sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 1,
    brightness: 1,
  },
  shadow: {
    enable: true,
    opacity: 0.5,
    color: [0, 0, 0],
  },
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
    },
    ssr: {
      enable: true,
    },
    bloom: {
      enable: true,
    },
    outline: {
      enable: true,
    },
  },
  ground: {
    enable: true,
    renderPlugin: {
      type: "lit",
    },
    symbol: {
      polygonOpacity: 1,
      material: {
        baseColorFactor: [0.48235, 0.48235, 0.48235, 1],
        hsv: [0, 0, -0.532],
        roughnessFactor: 0.22,
        metallicFactor: 0.58,
      },
    },
  },
};
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
  vert: vert,
  frag: frag,
  uniforms: ["projViewMatrix", "color"],
  positionAttribute: "POSITION",
};
maptalks.GLTFLayer.registerShader("customShader", "MeshShader", config);

const url = "/resources/gltf/alien/alien.glb";
const symbol = {
  shader: "customShader",
  url: url,
  uniforms: {
    color: [0.0, 1.0, 0.3],
  },
};

const gltfLayer = new maptalks.GLTFLayer("gltf");
const position = map.getCenter();
const gltfMarker = new maptalks.GLTFMarker(position, {
  symbol: symbol,
}).addTo(gltfLayer);
const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer], {
  sceneConfig,
}).addTo(map);
