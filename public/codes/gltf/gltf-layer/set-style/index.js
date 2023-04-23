const map = new maptalks.Map("map", {
  center: [-0.10707916972842213, 51.48119259984284],
  zoom: 14,
  pitch: 63.8,
  bearing: 179.39999999999975,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  lights: {
    ambient: {
      resource: {
        url: "{res}/hdr/env.hdr",
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

const url1 = "{res}/gltf/alien/alien.glb";
const url2 = "{res}/gltf/alien/alien.glb";

const gltfLayer = new maptalks.GLTFLayer("gltf");
const position = map.getCenter();
const markers = [];
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    const gltfMarker = new maptalks.GLTFMarker(
      position.add(i * 0.01 - 0.015, j * 0.01 - 0.015),
      {
        properties: {
          num: (i + j) * 0.1,
        },
      }
    );
    markers.push(gltfMarker);
  }
}

gltfLayer.addGeometry(markers);
const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer]).addTo(map);

const style = [
  {
    filter: ["<", "num", 0.2],
    symbol: {
      url: url1,
      animation: true,
      loop: true,
      uniforms: {
        polygonFill: [0.2, 0.8, 0.0, 1.0],
      },
    },
    uniqueName: "pyramid",
  },
  {
    filter: [">=", "num", 0.2],
    symbol: {
      url: url2,
    },
    uniqueName: "duck",
  },
];

function setStyle() {
  gltfLayer.setStyle(style);
}
