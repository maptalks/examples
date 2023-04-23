const map = new maptalks.Map("map", {
  center: [-0.10707916972842213, 51.48119259984284],
  zoom: 12,
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

const gui = new dat.GUI({
  width: 250,
});
class Config {
  constructor() {
    this.setSymbol = false;
  }
}
const options = new Config();
const url = "{res}/gltf/alien/alien.glb";
const symbol = {
  url,
  rotation: [0, 0, 0],
  scale: [1.5, 1.5, 1.5],
  uniforms: {
    polygonFill: [0.8, 0.0, 0.0, 1.0],
  },
};
const newSymbol = {
  url: "{res}/gltf/Fox/Fox.gltf",
  rotation: [0, 0, 90],
  scale: [1.5, 1.5, 1.5],
  animation: true,
  loop: true,
  uniforms: {
    polygonFill: [0.0, 0.8, 0.0, 1.0],
  },
};

const gltfLayer = new maptalks.GLTFLayer("gltf");
const gltfMarker = new maptalks.GLTFMarker(
  [-0.11304900000004636, 51.498568000000006],
  {
    symbol: symbol,
  }
).addTo(gltfLayer);
const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer]).addTo(map);

// symbol control
const symbolController = gui.add(options, "setSymbol").name("set symbol");
symbolController.onChange(function (value) {
  if (value) {
    gltfMarker.setSymbol(newSymbol);
  } else {
    gltfMarker.setSymbol(symbol);
  }
});
