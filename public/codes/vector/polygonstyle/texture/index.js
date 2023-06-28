const map = new maptalks.Map("map", {
  center: [-73.98795379493208, 40.72100197835064],
  zoom: 19,
  bearing: -69,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1],
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/gradient/front.png",
          back: "{res}/hdr/gradient/back.png",
          left: "{res}/hdr/gradient/left.png",
          right: "{res}/hdr/gradient/right.png",
          top: "{res}/hdr/gradient/top.png",
          bottom: "{res}/hdr/gradient/bottom.png",
        },
        prefilterCubeSize: 32
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0,
    },
  },
});

/**start**/
const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
});

const style = {
  style: [
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        dataConfig: {
          type: "fill",
        },
        sceneConfig: {},
        type: "fill",
      },
      symbol: {
        polygonFill: [0.345, 0.345, 0.502, 1],
        polygonPatternFile: "{res}/patterns/grass.png",
      },
    },
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        dataConfig: {
          type: "line",
        },
        sceneConfig: {},
        type: "line",
      },
      symbol: {
        lineColor: [0.73, 0.73, 0.73, 1],
        lineWidth: 2,
      },
    },
  ],
};
vt.setStyle(style);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0,
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill",
      },
      symbol: {
        polygonFill: [0.3294117, 0.3294117, 0.3294117, 1],
        polygonOpacity: 1,
      },
    },
  },
});
groupLayer.addTo(map);
