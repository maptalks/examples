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
    this.visible = true;
  }
}
const options = new Config();
const url = "{res}/gltf/alien/alien.glb";
const symbol = {
  url,
  shadow: true,
  scale: [1.5, 1.5, 1.5],
};

const gltfLayer = new maptalks.GLTFLayer("gltf");
const gltfMarker = new maptalks.GLTFMarker(
  [-0.11304900000004636, 51.498568000000006],
  {
    symbol,
  }
).addTo(gltfLayer);

const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer]).addTo(map);

// visible control
const visibleController = gui.add(options, "visible");
visibleController.onChange(function (value) {
  if (!value) {
    gltfMarker.hide();
  } else {
    gltfMarker.show();
  }
});