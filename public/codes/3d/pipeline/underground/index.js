const map = new maptalks.Map("map", {
  center: [120.25309501242282, 30.231192256436856],
  zoom: 18,
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
        dataConfig: {
          type: "round-tube",
          radialSegments: 16,
          metric: "cm",
        },
        sceneConfig: {},
        type: "tube",
      },
      symbol: {
        lineColor: [0.56, 0.75, 0.13, 1],
        lineWidth: {
          type: "identity",
          property: "断面尺寸",
        },
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
