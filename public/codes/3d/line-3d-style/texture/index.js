const map = new maptalks.Map("map", {
  center: [-73.98903845348661, 40.72259059625898],
  zoom: 17.8,
  bearing: -54,
  pitch: 20.8,
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

/**start**/
const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857"
});

const style = {
  style: [
    {
      filter: ["all", ["==", "$layer", "provincial-highway"], ["==", "$type", "LineString"]],
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {},
        type: "line"
      },
      symbol: {
        lineColor: [0.74117647, 0.74117647, 0.74117647, 1],
        linePatternFile: "{res}/patterns/road1.jpg",
        lineWidth: {
          type: "exponential",
          default: 4,
          stops: [
            [14, 2],
            [15, 8],
            [16, 20],
            [17, 25],
            [18, 35],
            [20, 60]
          ]
        }
      }
    },
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        type: "lit",
        dataConfig: {
          type: "3d-extrusion",
          altitudeProperty: "height",
          minHeightProperty: "min_height",
          altitudeScale: 1,
          defaultAltitude: 10,
          topThickness: 0,
          top: true,
          side: true
        },
        sceneConfig: {}
      },
      symbol: {
        polygonOpacity: 0.66,
        material: {
          baseColorFactor: [0.5098039, 0.6431372, 0.8274509, 1],
          hsv: [0, -0.383, 0.021],
          roughnessFactor: 1,
          metallicFactor: 0,
          uvScale: [0.01, 0.01],
          emissiveTexture: "{res}/textures/webp16.webp",
          emitColorFactor: 3.83
        }
      }
    }
  ]
};
vt.setStyle(style);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0
    },
    shadow: {
      type: "esm",
      enable: true,
      quality: "high",
      opacity: 0.11,
      color: [0, 0, 0],
      blurOffset: 1
    },
    postProcess: {
      enable: true,
      antialias: {
        enable: true,
        taa: true,
        jitterRatio: 0.25
      },
      ssr: {
        enable: true
      },
      bloom: {
        enable: true,
        threshold: 0,
        factor: 0.2,
        radius: 0.105
      },
      ssao: {
        enable: true,
        bias: 0.08,
        radius: 0.08,
        intensity: 1.5
      },
      sharpen: {
        enable: false,
        factor: 0.2
      }
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill"
      },
      symbol: {
        polygonFill: [0.517647, 0.517647, 0.517647, 1]
      }
    }
  }
});
groupLayer.addTo(map);
