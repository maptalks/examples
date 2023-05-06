const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 17,
  zoomControl: true,
  pitch: 80,
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

const style = {
  style: [
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        dataConfig: {
          type: "point",
        },
        sceneConfig: {
          collision: true,
          fading: false,
          depthFunc: "always",
        },
        type: "icon",
      },
      symbol: {
        visible: {
          // 只在 17 到 19 级之间显示
          type: "interval",
          stops: [
            [0, false],
            [17, true],
            [19, false],
          ],
        },
        markerType: "ellipse",
        markerHeight: 20,
        markerWidth: 20,
        markerFill: [0.53, 0.77, 0.94, 1],
        markerLineColor: [0.2, 0.29, 0.39, 1],
        markerLineWidth: 3,
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
  },
});
groupLayer.addTo(map);
