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

const map = new maptalks.Map("map", {
  center: [-73.88756247170068, 40.68791104561976],
  zoom: 17.1,
  bearing: 171,
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
/**end**/

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
      polygonFill: [
        0.5725490196078431, 0.6980392156862745, 0.5450980392156862, 1,
      ],
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
      lineColor: [0.73, 0.73, 0.73, 1],
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
        baseColorFactor: [1, 1, 1, 1],
        hsv: [0, 0, -0.32],
        baseColorIntensity: 1.532,
        roughnessFactor: 1,
        metallicFactor: 0,
        emissiveTexture: "{res}/textures/897/1.jpg",
        emissiveFactor: [
          0.9333333333333333, 0.9254901960784314, 0.9607843137254902,
        ],
        emitColorFactor: 0.31,
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
      scaleX: 289.77474184549226,
      scaleY: 289.77474184549226,
      scaleZ: 289.77474184549226,
      rotationZ: 299.6285,
      shader: "pbr",
      uniforms: {
        polygonFill: [1, 1, 1, 1],
        polygonOpacity: 1,
        baseColorIntensity: 1,
        outputSRGB: 1,
      },
    },
    zoomOnAdded: 17,
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
