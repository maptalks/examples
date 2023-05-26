const map = new maptalks.Map("map", {
  center: [120.25213143, 30.23139069],
  zoom: 20,
  pitch: 45,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const lights = {
  ambient: {
    color: [0.2, 0.2, 0.2],
    exposure: 1.5,
  },
  directional: {
    color: [0.3, 0.3, 0.3],
    direction: [1, 0, -1],
  },
};

map.setLights(lights);

/**start**/
const style = {
  style: [
    {
      filter: true,
      renderPlugin: {
        type: "gltf-lit",
        dataConfig: {
          type: "native-point",
        },
        sceneConfig: {
          gltfAnimation: {
            enable: true,
          },
        },
      },
      symbol: {
        markerFill: "#0f0",
        markerRotationAlignment: "line",
        url: "{res}/gltf/ylk/ylk.gltf",
        markerPlacement: "vertex-last",
        rotationZ: 90,
        anchorZ: "middle",
        translationX: -2,
        scaleX: 0.1,
        scaleY: 0.1,
        scaleZ: 0.1,
      },
    },
    {
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "round-tube",
          radialSegments: 16,
          metric: "cm",
        },
        sceneConfig: {},
        type: "tube",
      },
      symbol: {
        lineColor: [1, 1, 1, 1],
        lineWidth: {
          type: "identity",
          property: "断面尺寸",
        },
        lineHeight: 60,
        uvScale: [1, 1],
        metallicFactor: 1,
        roughnessFactor: 0.3,
      },
    },
  ],
};

const vt = new maptalks.GeoJSONVectorTileLayer("vt", {
  data: "{res}/geojson/tube.geojson",
  style,
});
/**end**/

const sceneConfig = {
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
      taa: true,
    },
  },
};
const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  antialias: false,
  sceneConfig,
});
groupLayer.addTo(map);
