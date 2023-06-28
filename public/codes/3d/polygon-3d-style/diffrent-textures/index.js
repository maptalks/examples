const map = new maptalks.Map("map", {
  center: [121.46618885, 31.23372094],
  zoom: 17,
  bearing: 8.4,
  pitch: 70,
  lights: {
    directional: {
      direction: [-1, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/446/front.jpg",
          back: "{res}/hdr/446/back.jpg",
          left: "{res}/hdr/446/left.jpg",
          right: "{res}/hdr/446/right.jpg",
          top: "{res}/hdr/446/top.jpg",
          bottom: "{res}/hdr/446/bottom.jpg"
        }
      },
      exposure: 1,
      hsv: [0, 0, 0.404],
      orientation: 130.213
    }
  }
});

const otherStyles = [
  {
    filter: ["all", ["==", "$layer", "tertiary-road"], ["==", "$type", "LineString"]],
    renderPlugin: {
      dataConfig: {
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: [0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 1],
      lineWidth: {
        type: "exponential",
        default: 2,
        stops: [
          [14.7, 2],
          [15.9, 8],
          [17.3, 12]
        ]
      }
    }
  },
  {
    filter: ["all", ["==", "$layer", "secondary-road"], ["==", "$type", "LineString"]],
    renderPlugin: {
      dataConfig: {
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: [0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 1],
      lineWidth: {
        type: "exponential",
        default: 2,
        stops: [
          [14.3, 2],
          [15.9, 6],
          [17.3, 12]
        ]
      }
    }
  },
  {
    filter: ["all", ["==", "$layer", "secondary-road"], ["==", "$type", "LineString"]],
    renderPlugin: {
      dataConfig: {
        type: "point"
      },
      sceneConfig: {
        collision: true,
        fading: true,
        depthFunc: "<="
      },
      type: "text"
    },
    symbol: {
      textAllowOverlap: false,
      textFaceName: "Microsoft YaHei,sans-serif",
      textFill: [1, 1, 1, 1],
      textHaloFill: [1, 1, 1, 1],
      textIgnorePlacement: false,
      textName: "{name}",
      textOpacity: 1,
      textPitchAlignment: "map",
      textPlacement: "line",
      textRotationAlignment: "viewport",
      textSize: {
        type: "exponential",
        default: 30,
        stops: [
          [17, 12],
          [18, 15],
          [20, 18]
        ]
      }
    }
  },
  {
    filter: ["all", ["==", "$layer", "four-level-road"], ["==", "$type", "LineString"]],
    renderPlugin: {
      dataConfig: {
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: [0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 1],
      lineWidth: {
        type: "exponential",
        default: 2,
        stops: [
          [14.3, 2],
          [15.9, 8],
          [17.3, 14]
        ]
      }
    }
  },
  {
    filter: ["all", ["==", "$layer", "internal-road"], ["==", "$type", "LineString"]],
    renderPlugin: {
      dataConfig: {
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: [0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 1],
      lineWidth: {
        type: "exponential",
        default: 2,
        stops: [
          [14.7, 2],
          [15.9, 6],
          [17.3, 10]
        ]
      }
    }
  },
  {
    filter: ["all", ["==", "$layer", "internal-road"], ["==", "$type", "LineString"]],
    renderPlugin: {
      dataConfig: {
        type: "point"
      },
      sceneConfig: {
        collision: true,
        fading: true,
        depthFunc: "<="
      },
      type: "text"
    },
    symbol: {
      textAllowOverlap: false,
      textFaceName: "Microsoft YaHei,sans-serif",
      textFill: [1, 1, 1, 1],
      textHaloFill: [1, 1, 1, 1],
      textHaloOpacity: 1,
      textHorizontalAlignment: "middle",
      textIgnorePlacement: false,
      textName: "{name}",
      textOpacity: 1,
      textPitchAlignment: "map",
      textPlacement: "line",
      textRotationAlignment: "viewport",
      textSize: {
        type: "exponential",
        default: 12,
        stops: [
          [17, 12],
          [18, 15],
          [20, 18]
        ]
      }
    }
  },
  {
    filter: ["all", ["==", "$layer", "greenland"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      type: "lit",
      dataConfig: {
        type: "3d-extrusion",
        altitudeProperty: "height",
        minHeightProperty: "min_height",
        altitudeScale: 1,
        defaultAltitude: 2,
        topThickness: 0,
        top: true,
        side: true
      },
      sceneConfig: {
        animation: null,
        animationDuration: 800
      }
    },
    symbol: {
      material: {
        baseColorTexture: "{res}/msd/city/2.jpg",
        baseColorFactor: [1, 1, 1, 1],
        hsv: [0, 0, -0.022],
        outputSRGB: 1,
        roughnessFactor: 0.79,
        metallicFactor: 0,
        occlusionTexture: "{res}/textures/Stylized_15_Grass_ambientocclusion.jpg"
      }
    }
  },
  {
    filter: ["all", ["==", "$layer", "water"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      type: "water",
      dataConfig: {
        type: "fill"
      }
    },
    symbol: {
      ssr: true,
      texWaveNormal: "{res}/textures/texWaveNormal.png",
      texWavePerturbation: "{res}/textures/texWavePerturbation.png",
      waterBaseColor: [0.3215686274509804, 0.47843137254901963, 0.611764705882353, 1],
      uvScale: 3,
      animation: true,
      waterSpeed: 1
    }
  },
  {
    filter: ["all", ["==", "$layer", "expressway"], ["==", "$type", "LineString"]],
    renderPlugin: {
      dataConfig: {
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: [0.73, 0.73, 0.73, 1],

      lineOpacity: 1,
      lineWidth: 2
    }
  },
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
      lineColor: [0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 1],
      lineWidth: {
        type: "exponential",
        default: 2,
        stops: [
          [14.7, 2],
          [15.9, 6],
          [17.3, 8],
          [19, 14]
        ]
      }
    }
  },
  {
    filter: ["all", ["==", "$layer", "provincial-highway"], ["==", "$type", "LineString"]],
    renderPlugin: {
      dataConfig: {
        type: "point"
      },
      sceneConfig: {
        collision: true,
        fading: true,
        depthFunc: "<="
      },
      type: "text"
    },
    symbol: {
      textBloom: false,
      textAllowOverlap: false,
      textDx: 0,
      textDy: 0,
      textFaceName: "Microsoft YaHei,sans-serif",
      textFill: [1, 1, 1, 1],
      textHaloFill: [1, 1, 1, 1],
      textHaloOpacity: 1,
      textHaloRadius: 0,
      textHorizontalAlignment: "middle",
      textIgnorePlacement: false,
      textName: "{name}",
      textOpacity: 1,
      textPitchAlignment: "map",
      textPlacement: "line",
      textRotationAlignment: "viewport",
      textSize: {
        type: "exponential",
        default: 30,
        stops: [
          [17, 12],
          [18, 15],
          [20, 18]
        ]
      },
      textWrapWidth: 240
    }
  }
];

/**start**/
const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt"
});

const buildingStlyes = [
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
        topThickness: 2,
        top: true,
        side: false
      },
      sceneConfig: {
        animation: null,
        animationDuration: 800
      }
    },
    symbol: {
      polygonOpacity: 0.6,
      material: {
        baseColorTexture: "{res}/msd/city/webp8.jpg",
        baseColorFactor: [0.3137254901960784, 0.30980392156862746, 0.3137254901960784, 1],
        hsv: [-0.022, -0.511, -0.362],
        baseColorIntensity: 0.84,
        contrast: 3.564,
        outputSRGB: 1,
        roughnessFactor: 0.11,
        metallicFactor: 0.67,
        uvScale: [0.05, 0.05],
        uvOffset: [0.2, 0.35],
        uvRotation: 0.8028514559173915,
        emissiveTexture: "{res}/msd/city/webp6.jpg",
        emissiveFactor: [0, 0, 0],
        emitColorFactor: 0.27,
        emitMultiplicative: 0,
        albedoPBRFactor: 1,
        outputLinear: 0,
        clearCoatF0: 0.04,
        emitColor: [0, 0, 0]
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
        topThickness: 2,
        top: false,
        side: true
      }
    },
    symbol: {
      bloom: false,
      ssr: false,
      polygonOpacity: 1,
      material: {
        baseColorTexture: "{res}/msd/city/Facades_06_basecolor.jpg",
        baseColorFactor: [1, 1, 1, 1],
        hsv: [0, 0.446, -0.158],
        baseColorIntensity: 1.318,
        contrast: 1.414,
        outputSRGB: 1,
        metallicRoughnessTexture: "{res}/msd/city/Facades_06_roughness.jpg",
        roughnessFactor: 0.7,
        metallicFactor: 1,
        normalTexture: "{res}/msd/city/Facades_06_normalogl.jpg",
        uvScale: [0.86, 0.86],
        uvOffset: [0.35, 0],
        normalMapFactor: 0.69,
        normalMapFlipY: 0,
        bumpTexture: "{res}/msd/city/Facades_06_height.jpg",
        occlusionTexture: "{res}/msd/city/Facades_06_ambientocclusion.jpg"
      }
    }
  }
];

const style = {
  style: [...buildingStlyes, ...otherStyles]
};
vt.setStyle(style);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 1
    },
    shadow: {
      type: "esm",
      enable: true,
      quality: "high",
      opacity: 0.5,
      color: [0, 0, 0],
      blurOffset: 1
    },
    postProcess: {
      enable: true,
      antialias: {
        enable: true
      },
      ssr: {
        enable: true
      },
      ssao: {
        enable: true,
        bias: 0.08,
        radius: 0.08,
        intensity: 1.5
      },
      sharpen: {
        enable: true,
        factor: 0.5
      }
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "lit"
      },
      symbol: {
        polygonFill: [0.54, 0.54, 0.54, 1],
        material: {
          baseColorFactor: [0.050980392, 0.050980392, 0.050980392, 1],
          outputSRGB: 1,
          roughnessFactor: 0.22,
          metallicFactor: 0.3
        }
      }
    }
  }
});
groupLayer.addTo(map);
