const map = new maptalks.Map("map", {
  center: [-73.98170407, 40.76104242],
  zoom: 15.141217633928335,
  bearing: -160.4,
  pitch: 58.45,
  lights: {
    directional: {
      direction: [0.5, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      exposure: 0.787,
      hsv: [0, 0, -0.298],
      orientation: 0
    }
  }
});

const vtStyle = [
  {
    filter: ["all", ["==", "$layer", "entertainment"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      dataConfig: {
        type: "fill"
      },
      sceneConfig: {},
      type: "fill"
    },
    symbol: {
      polygonFill: [0.5725490196078431, 0.6980392156862745, 0.5450980392156862, 1]
    }
  },
  {
    filter: ["all", ["==", "$layer", "entertainment"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      dataConfig: {
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: [0.73, 0.73, 0.73, 1],
      lineWidth: 2
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
      sceneConfig: {
        animation: null,
        animationDuration: 800
      }
    },
    symbol: {
      bloom: false,
      ssr: false,
      polygonOpacity: 1,
      material: {
        baseColorFactor: [1, 1, 1, 1],
        hsv: [0, 0, -0.32],
        baseColorIntensity: 1.532,
        roughnessFactor: 1,
        metallicFactor: 0,
        clearCoatIor: 1.4,
        clearCoatRoughnessFactor: 0.04,
        emissiveTexture: "{res}/textures/897/1.jpg",
        emissiveFactor: [0.9333333333333333, 0.9254901960784314, 0.9607843137254902],
        emitColorFactor: 0.31
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
      lineColor: [1, 1, 1, 1],
      linePatternFile: "{res}/patterns/d4b.jpg",
      lineWidth: {
        type: "exponential",
        default: 2,
        stops: [
          [14, 2],
          [15, 4],
          [16, 10],
          [17, 20],
          [18, 50],
          [20.7, 100],
          [22, 200]
        ]
      }
    }
  }
];

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  style: vtStyle
});

const effectLayer = new maptalks.EffectLayer("effect");
const center = map.getCenter();
/**start**/
const sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 3,
    brightness: 0.489
  },
  shadow: {
    type: "esm",
    enable: true,
    quality: "high",
    opacity: 0.5,
    color: [0, 0, 0],
    blurOffset: 1
  },
  ground: {
    enable: true,
    renderPlugin: {
      type: "fill"
    },
    symbol: {
      polygonFill: [0.803921568627451, 0.803921568627451, 0.803921568627451, 1],
      polygonOpacity: 1
    }
  }
};
const effectMarker1 = new maptalks.EffectMarker(map.getCenter(), {
  symbol: {
      url: 'plane',
      shadow: false,
      textureUrl: '{res}/images/sequence/explosion.png',
      type: 'uv',
      loop: true,
      doubleSided: true,
      anchorZ: 'bottom',
      // rotationX: 90,
      translateZ: 0,
      scaleX: 5,
      scaleY: 5,
      scaleZ: 5,
      uniforms: {
          width: 8,
          height: 4
      }
  }
}).addTo(effectLayer);
const effectMarker2 = new maptalks.EffectMarker(map.getCenter().add(0.01, 0), {
  symbol: {
      url: 'plane',
      shadow: false,
      textureUrl: '{res}/images/sequence/skill.png',
      type: 'uv',
      loop: true,
      doubleSided: true,
      anchorZ: 'bottom',
      // rotationX: 90,
      translateZ: 0,
      scaleX: 5,
      scaleY: 5,
      scaleZ: 5,
      uniforms: {
          width: 8,
          height: 5
      }
  }
}).addTo(effectLayer);
const effectMarker3 = new maptalks.EffectMarker(map.getCenter().add(0.005, 0), {
  symbol: {
      url: 'plane',
      shadow: false,
      textureUrl: '{res}/images/sequence/fly.png',
      type: 'uv',
      loop: true,
      doubleSided: true,
      anchorZ: 'bottom',
      scaleX: 358 / 133,
      // rotationX: 90,
      translateZ: 500,
      uniforms: {
          width: 6,
          height: 4
      }
  }
}).addTo(effectLayer);
const groupGLLayer = new maptalks.GroupGLLayer("gl", [vtLayer, effectLayer], {
  sceneConfig
}).addTo(map);
/**end**/

