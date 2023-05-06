const map = new maptalks.Map("map", {
  center: [-73.98947957157736, 40.790142825954234],
  zoom: 14.2,
  bearing: 30,
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
      filter: [
        "all",
        ["==", "$layer", "provincial-highway"],
        ["==", "$type", "LineString"],
      ],
      renderPlugin: {
        dataConfig: {
          type: "line",
        },
        sceneConfig: {},
        type: "line",
      },
      symbol: {
        lineColor: [0.741176, 0.741176, 0.741176, 1],
        lineWidth: {
          type: "exponential",
          default: 4,
          stops: [
            [14, 4],
            [16, 20],
          ],
        },
      },
    },
    {
      filter: [
        "all",
        ["==", "$layer", "provincial-highway"],
        ["==", "$type", "LineString"],
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
        textFaceName: "Microsoft YaHei,sans-serif",
        textFill: [1, 1, 1, 1],
        textHaloFill: [0.0392156, 0.0392156, 0.0392156, 1],
        textHaloOpacity: 1,
        textHaloRadius: 1,
        textIgnorePlacement: false,
        textName: "{name}",
        textPitchAlignment: "viewport",
        textPlacement: "point",
        textRotation: 0,
        textRotationAlignment: "viewport",
        textSize: 20,
        textSpacing: 250,
        textStyle: "normal",
        textVerticalAlignment: "middle",
        textWeight: "normal",
        textWrapWidth: 240,
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
        polygonFill: [0.3215686, 0.3215686, 0.3215686, 1],
      },
    },
  },
});
groupLayer.addTo(map);
