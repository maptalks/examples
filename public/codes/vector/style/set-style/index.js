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
const style = {
  style: [
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        dataConfig: {
          type: "fill",
        },
        type: "fill",
      },
      symbol: {
        polygonFill: "#a49084",
        polygonOpacity: 1,
      },
    },
  ],
};

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style,
});

function update() {
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
          polygonFill: "#46a4af"
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

gui
  .add({
    type: "button",
    text: "Set style",
  })
  .onClick(() => {
    update();
  });
