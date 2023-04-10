/**start**/
const resource = {
  url: {
    front: "{res}/hdr/446/front.jpg",
    back: "{res}/hdr/446/back.jpg",
    left: "{res}/hdr/446/left.jpg",
    right: "{res}/hdr/446/right.jpg",
    top: "{res}/hdr/446/top.jpg",
    bottom: "{res}/hdr/446/bottom.jpg",
  },
  prefilterCubeSize: 1024,
};
/**end**/

const map = new maptalks.Map("map", {
  center: [-73.88688426819061, 40.68813228504152],
  zoom: 18,
  bearing: 161.5,
  pitch: 80,
  lights: {
    directional: {
      direction: [0.5, 0, -1],
      color: [1, 1, 1],
    },
    ambient: {
      resource,
      exposure: 0.787,
      hsv: [0, 0, 0],
      orientation: 0,
    },
  },
});

const vtStyle = [
  {
    filter: [
      "all",
      ["==", "$layer", "entertainment"],
      ["==", "$type", "Polygon"],
    ],
    renderPlugin: {
      dataConfig: {
        type: "fill",
      },
      sceneConfig: {},
      type: "fill",
    },
    symbol: {
      polygonBloom: false,
      polygonFill: [
        0.5725490196078431, 0.6980392156862745, 0.5450980392156862, 1,
      ],
      polygonOpacity: 1,
      polygonPatternFile: null,
    },
  },
  {
    filter: [
      "all",
      ["==", "$layer", "entertainment"],
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
      lineBloom: false,
      lineCap: "butt",
      lineColor: [0.73, 0.73, 0.73, 1],
      lineDasharray: [0, 0, 0, 0],
      lineDashColor: [1, 1, 1, 0],
      lineDx: 0,
      lineDy: 0,
      lineJoin: "miter",
      lineOpacity: 1,
      linePatternAnimSpeed: 0,
      linePatternFile: null,
      lineStrokeWidth: 0,
      lineStrokeColor: [0, 0, 0, 1],
      lineJoinPatternMode: 0,
      lineWidth: 2,
    },
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
        side: true,
      },
      sceneConfig: {
        animation: null,
        animationDuration: 800,
      },
    },
    symbol: {
      bloom: false,
      ssr: false,
      polygonOpacity: 1,
      material: {
        baseColorTexture: null,
        baseColorFactor: [1, 1, 1, 1],
        hsv: [0, 0, -0.32],
        baseColorIntensity: 1.532,
        contrast: 1,
        outputSRGB: 1,
        metallicRoughnessTexture: null,
        roughnessFactor: 1,
        metallicFactor: 0,
        normalTexture: null,
        noiseTexture: null,
        uvScale: [1, 1],
        uvOffset: [0, 0],
        uvRotation: 0,
        uvOffsetAnim: [0, 0],
        normalMapFactor: 1,
        normalMapFlipY: 0,
        bumpTexture: null,
        bumpScale: 0.02,
        clearCoatThickness: 5,
        clearCoatFactor: 0,
        clearCoatIor: 1.4,
        clearCoatRoughnessFactor: 0.04,
        occlusionTexture: null,
        emissiveTexture: "{res}/textures/897/1.jpg",
        emissiveFactor: [
          0.9333333333333333, 0.9254901960784314, 0.9607843137254902,
        ],
        emitColorFactor: 0.31,
        emitMultiplicative: 0,
      },
    },
  },
  {
    filter: [
      "all",
      ["==", "$layer", "secondary-road"],
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
      lineBloom: false,
      lineCap: "butt",
      lineColor: [1, 1, 1, 1],
      lineDasharray: [0, 0, 0, 0],
      lineDashColor: [1, 1, 1, 0],
      lineDx: 0,
      lineDy: 0,
      lineJoin: "miter",
      lineOpacity: 1,
      linePatternAnimSpeed: 0,
      linePatternFile: "{res}/patterns/d4b.jpg",
      lineStrokeWidth: 0,
      lineStrokeColor: [0, 0, 0, 1],
      lineJoinPatternMode: 0,
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
          [22, 200],
        ],
      },
    },
  },
];

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style: vtStyle,
});

const gltfLayer = new maptalks.GLTFLayer("gltf");

const gltfMarker = new maptalks.GLTFMarker(
  [-73.88713688860861, 40.68848442450471],
  {
    symbol: {
      shadow: true,
      url: "{res}/gltf/29c/scene.gltf",
      scaleX: 14.12466,
      scaleY: 14.12466,
      scaleZ: 14.12466,
      rotationZ: 299.6285,
      shader: "pbr",
      uniforms: {
        polygonFill: [1, 1, 1, 1],
        polygonOpacity: 1,
        baseColorIntensity: 1,
        outputSRGB: 1,
      },
    },
    zoomOnAdded: 18.66,
  }
);

gltfLayer.addGeometry(gltfMarker);

const groupGLLayer = new maptalks.GroupGLLayer("gl", [vtLayer, gltfLayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.489,
    },
    shadow: {
      type: "esm",
      enable: true,
      quality: "high",
      opacity: 0.5,
      color: [0, 0, 0],
      blurOffset: 1,
    },
    postProcess: {
      enable: true,
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill",
      },
      symbol: {
        polygonFill: [
          0.803921568627451, 0.803921568627451, 0.803921568627451, 1,
        ],
        polygonOpacity: 1,
      },
    },
  },
}).addTo(map);
