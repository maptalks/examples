/**start**/
const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  pitch: 60,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/gradient/front.png",
          back: "{res}/hdr/gradient/back.png",
          left: "{res}/hdr/gradient/left.png",
          right: "{res}/hdr/gradient/right.png",
          top: "{res}/hdr/gradient/top.png",
          bottom: "{res}/hdr/gradient/bottom.png"
        },
        prefilterCubeSize: 32
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0
    }
  }
});

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt"
});

const style = {
  style: [
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        dataConfig: {
          type: "fill"
        },
        sceneConfig: {},
        type: "fill"
      },
      symbol: {
        polygonBloom: false,
        polygonFill: "#577570",
        polygonOpacity: 1,
        polygonPatternFile: null
      }
    },
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        dataConfig: {
          type: "point"
        },
        sceneConfig: {
          collision: true,
          fading: false,
          depthFunc: "always"
        },
        type: "text"
      },
      symbol: {
        textFaceName: "Microsoft YaHei,sans-serif",
        textName: "{name}",
        textPitchAlignment: "map",
        textPlacement: "point",
        textSize: 12,
        textFill: "#34974f",
        textWrapWidth: 200
      }
    }
  ]
};
vt.setStyle(style);

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0
    }
  }
});
groupLayer.addTo(map);
/**end**/
