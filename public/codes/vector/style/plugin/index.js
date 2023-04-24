const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  pitch: 60,
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
        prefilterCubeSize: 1024,
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
  spatialReference: "preset-vt-3857",
});

const style = [
  {
    filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      dataConfig: {
        type: "fill",
      },
      type: "fill",
    },
    symbol: {
      polygonFill: "#bd604b",
      polygonOpacity: 1,
    },
  },
];
vt.setStyle(style);

function setFill() {
  const style = {
    style: [
      {
        filter: [
          "all",
          ["==", "$layer", "building"],
          ["==", "$type", "Polygon"],
        ],
        renderPlugin: {
          dataConfig: {
            type: "fill",
          },
          type: "fill",
        },
        symbol: {
          polygonFill: "#2e7e57",
          polygonOpacity: 1,
        },
      },
    ],
  };
  vt.setStyle(style);
}

function setLine() {
  const style = {
    style: [
      {
        filter: [
          "all",
          ["==", "$layer", "building"],
          ["==", "$type", "Polygon"],
        ],
        renderPlugin: {
          dataConfig: {
            type: "line",
          },
          sceneConfig: {},
          type: "line",
        },
        symbol: {
          lineWidth: 2,
          lineColor: [0.23, 0.73, 0.51, 1],
          lineDasharray: [0, 0, 0, 0],
          lineDashColor: [1, 1, 1, 0],
        },
      },
    ],
  };
  vt.setStyle(style);
}

function setIcon() {
  const style = {
    style: [
      {
        filter: [
          "all",
          ["==", "$layer", "building"],
          ["==", "$type", "Polygon"],
        ],
        renderPlugin: {
          dataConfig: {
            type: "point",
          },
          sceneConfig: {
            collision: true,
            fading: true,
            depthFunc: "always",
          },
          type: "icon",
        },
        symbol: {
          markerType: "ellipse",
          markerFill: [0.53, 0.77, 0.94, 1],
          markerFillOpacity: 1,
          markerHeight: 20,
          markerWidth: 20,
        },
      },
    ],
  };
  vt.setStyle(style);
}

function setText() {
  const style = {
    style: [
      {
        filter: [
          "all",
          ["==", "$layer", "building"],
          ["==", "$type", "Polygon"],
        ],
        renderPlugin: {
          dataConfig: {
            type: "point",
          },
          sceneConfig: {
            collision: true,
            fading: true,
            depthFunc: "always",
          },
          type: "text",
        },
        symbol: {
          textName: "{name}",
          textOpacity: 1,
          textPitchAlignment: "viewport",
          textPlacement: "point",
          textRotationAlignment: "viewport",
          textSize: 14,
          textSpacing: 250,
          textStyle: "normal",
          textVerticalAlignment: "middle",
          textWeight: "normal",
        },
      },
    ],
  };
  vt.setStyle(style);
}

function setWater() {
  const style = {
    style: [
      {
        filter: [
          "all",
          ["==", "$layer", "building"],
          ["==", "$type", "Polygon"],
        ],
        renderPlugin: {
          type: "water",
          dataConfig: {
            type: "fill",
          },
        },
        symbol: {
          ssr: false,
          texWaveNormal: "{res}/textures/texWaveNormal.png",
          texWavePerturbation: "{res}/textures/texWavePerturbation.png",
          waterBaseColor: [0.1451, 0.2588, 0.4863, 1],
          contrast: 1,
          hsv: [0, 0, 0],
          uvScale: 3,
          animation: true,
          waterSpeed: 1,
          waterDirection: 0,
        },
      },
    ],
  };
  vt.setStyle(style);
}

function setLit() {
  const style = {
    style: [
      {
        filter: [
          "all",
          ["==", "$layer", "building"],
          ["==", "$type", "Polygon"],
        ],
        renderPlugin: {
          type: "lit",
          dataConfig: {
            type: "3d-extrusion",
            altitudeProperty: "height",
            minHeightProperty: "null",
            altitudeScale: 1,
            defaultAltitude: 10,
            topThickness: 0,
            top: true,
            side: true,
          },
          sceneConfig: {},
        },
        symbol: {
          polygonOpacity: 1,
          material: {
            baseColorFactor: [1, 1, 1, 1],
            roughnessFactor: 1,
            metallicFactor: 1,
          },
        },
      },
    ],
  };
  vt.setStyle(style);
}
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0,
    },
  },
});
groupLayer.addTo(map);

const gui = new mt.GUI();

const changeEventMap = {
  fill: setFill,
  line: setLine,
  icon: setIcon,
  text: setText,
  water: setWater,
  lit: setLit,
};

gui
  .add({
    label: "渲染插件",
    type: "select",
    value: "fill",
    options: [
      {
        label: "fill",
        value: "fill",
      },
      {
        label: "line",
        value: "line",
      },
      {
        label: "icon",
        value: "icon",
      },
      {
        label: "text",
        value: "text",
      },
      {
        label: "water",
        value: "water",
      },
      {
        label: "lit",
        value: "lit",
      },
    ],
  })
  .onChange((value) => {
    changeEventMap[value]();
  });
