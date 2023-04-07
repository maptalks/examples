const map = new maptalks.Map("map", {
  center: [-73.887278876636, 40.68878362526684],
  zoom: 18,
  bearing: 168.68,
  pitch: 77.2,
  lights: {
    directional: {
      direction: [0.5, 0, -1],
      color: [1, 1, 1],
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/923/front.jpg",
          back: "{res}/hdr/923/back.jpg",
          left: "{res}/hdr/923/left.jpg",
          right: "{res}/hdr/923/right.jpg",
          top: "{res}/hdr/923/top.jpg",
          bottom: "{res}/hdr/923/bottom.jpg",
        },
      },
      exposure: 0.787,
      hsv: [0, 0, 0],
      orientation: 0,
    },
  },
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  features: true,
  style: "{res}/styles/monomer.json",
});

const gltfLayer = new maptalks.GLTFLayer("gltf");

const gltfMarker = new maptalks.GLTFMarker(
  [-73.88713688860861, 40.68848442450471],
  {
    symbol: {
      shadow: true,
      url: "{res}/gltf/29c/scene.gltf",
      scaleX: 14.12466,
      scaleY: 14.12466,
      scaleZ: 14.12466,
      rotationZ: 299.6285,
      shader: "pbr",
      uniforms: {
        polygonFill: [1, 1, 1, 1],
        polygonOpacity: 1,
        baseColorIntensity: 1,
        outputSRGB: 1,
      },
    },
    zoomOnAdded: 18.66,
  }
);

gltfLayer.addGeometry(gltfMarker);

const groupGLLayer = new maptalks.GroupGLLayer("gl", [vtLayer, gltfLayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.489,
    },
    shadow: {
      type: "esm",
      enable: true,
      quality: "high",
      opacity: 0.5,
      color: [0, 0, 0],
      blurOffset: 1,
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill",
      },
      symbol: {
        polygonFill: [
          0.803921568627451, 0.803921568627451, 0.803921568627451, 1,
        ],
        polygonOpacity: 1,
      },
    },
  },
}).addTo(map);
