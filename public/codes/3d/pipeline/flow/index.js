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
        linePatternFile: "{res}/images/flow.png",
        linePatternAnimSpeed: 0.1,
        uvScale: [1, 1],
        metallicFactor: 0,
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

// const gui = new mt.GUI();
// gui
//   .add({
//     type: "slider",
//     label: "动画速度",
//     value: 0.1,
//     min: -1,
//     max: 1,
//     step: 0.1,
//   })
//   .onChange((value) => {
//     vt.updateSymbol(0, {
//       linePatternAnimSpeed: value,
//     });
//   });

// gui
//   .add({
//     type: "slider",
//     label: "纹理间距",
//     value: 0,
//     min: 0,
//     max: 10,
//     step: 0.1,
//   })
//   .onChange((value) => {
//     vt.updateSymbol(0, {
//       linePatternGap: value,
//     });
//   });
