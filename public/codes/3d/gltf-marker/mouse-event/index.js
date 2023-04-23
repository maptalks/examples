const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  pitch: 80,
  bearing: 180,
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

const url = "{res}/gltf/alien/alien.glb";
const symbol = {
  url,
  scale: [2, 2, 2],
  translation: [0, 0, -10],
};

const gltfLayer = new maptalks.GLTFLayer("gltf");
const position = map.getCenter();
const gltfMarker = new maptalks.GLTFMarker(position, {
  symbol: symbol,
}).addTo(gltfLayer);

gltfMarker.on("click", (e) => {
  document.getElementById("info").innerHTML = "click事件";
});
gltfMarker.on("mousemove", (e) => {
  gltfMarker.setUniform("polygonFill", [0.0, 0.8, 0.0, 1.0]);
  document.getElementById("info").innerHTML = "mousemove事件";
});
gltfMarker.on("mouseleave", (e) => {
  map.resetCursor();
  gltfMarker.setUniform("polygonFill", [1, 1, 1, 1.0]);
  document.getElementById("info").innerHTML = "mouseleave事件";
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer]).addTo(map);
