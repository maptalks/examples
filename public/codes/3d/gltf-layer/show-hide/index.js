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

const url = "{res}/gltf/alien/alien.glb";
const symbol = {
  url,
  scale: [1.5, 1.5, 1.5],
};

const gltfLayer1 = new maptalks.GLTFLayer("gltf1");
const gltfLayer2 = new maptalks.GLTFLayer("gltf2");
const position = map.getCenter();
const gltfMarker1 = new maptalks.GLTFMarker(position, {
  symbol: symbol,
}).addTo(gltfLayer1);

const gltfMarker2 = new maptalks.GLTFMarker(position.add(0.01, 0), {
  symbol: symbol,
}).addTo(gltfLayer2);

const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer1, gltfLayer2]).addTo(map);

function show() {
  if (gltfLayer1.isVisible()) {
    gltfLayer1.hide();
  } else {
    gltfLayer1.show();
  }
}
