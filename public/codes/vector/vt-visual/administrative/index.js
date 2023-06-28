// https://maptalks.org/maptalks.three/demo/extrudepolygon-china.html
const map = new maptalks.Map("map", {
  center: [97.4656881809608, 21.4667907971768],
  zoom: 4.3,
  bearing: -3.63,
  pitch: 35.2,
  lights: {
    directional: { direction: [-1, -1, -1], color: [1, 1, 1] },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/923/front.jpg",
          back: "{res}/hdr/923/back.jpg",
          left: "{res}/hdr/923/left.jpg",
          right: "{res}/hdr/923/right.jpg",
          top: "{res}/hdr/923/top.jpg",
          bottom: "{res}/hdr/923/bottom.jpg"
        }
      },
      exposure: 1.426,
      hsv: [0, 0, 0],
      orientation: 302.553
    }
  }
});

const geoLayer1 = new maptalks.GeoJSONVectorTileLayer("发光数据", {
  data: "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
  style: "{res}/styles/administrative1.json"
});

const geoLayer2 = new maptalks.GeoJSONVectorTileLayer("省份", {
  data: "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
  style: "{res}/styles/administrative2.json"
});

const vtLayer = new maptalks.VectorTileLayer("底图", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  style: "{res}/styles/administrative3.json"
});

const gltfLayer = new maptalks.GLTFLayer("重点区域");

const gltfMarker = new maptalks.GLTFMarker([86.10452197331779, 37.02245639276353], {
  symbol: {
    shadow: true,
    url: "{res}/gltf/664/scene.gltf",
    shader: "pbr",
    uniforms: {
      polygonFill: [1, 1, 1, 1],
      polygonOpacity: 1,
      baseColorIntensity: 1,
      outputSRGB: 1
    }
  },
  zoomOnAdded: 5.12
});

gltfLayer.addGeometry(gltfMarker);

const groupGLLayer = new maptalks.GroupGLLayer("gl", [geoLayer1, geoLayer2, vtLayer, gltfLayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.915
    },
    ssr: {
      enable: true
    },
    bloom: {
      enable: true,
      threshold: 0.95,
      factor: 0.8,
      radius: 1
    },
    ssao: {
      enable: false,
      bias: 0.08,
      radius: 0.08,
      intensity: 1.5
    },
    sharpen: {
      enable: true,
      factor: 0.2
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
        type: "lit"
      },
      symbol: {
        polygonFill: [0.54, 0.54, 0.54, 1],
        polygonOpacity: 1,
        ssr: true,
        material: {
          baseColorTexture: null,
          baseColorFactor: [0.09019607843137255, 0.09019607843137255, 0.09019607843137255, 1],
          hsv: [0, 0, -0.426],
          baseColorIntensity: 1,
          contrast: 1,
          outputSRGB: 1,
          metallicRoughnessTexture: null,
          roughnessFactor: 0.15,
          metallicFactor: 1,
          normalTexture: null,
          uvScale: [1, 1],
          uvOffset: [0, 0],
          uvRotation: 0,
          uvOffsetAnim: [0, 0],
          normalMapFactor: 1,
          normalMapFlipY: 0,
          clearCoatThickness: 5,
          clearCoatFactor: 0,
          clearCoatIor: 1.4,
          clearCoatRoughnessFactor: 0.04,
          occlusionTexture: null,
          emissiveTexture: null,
          emissiveFactor: [0, 0, 0],
          emitColorFactor: 1,
          emitMultiplicative: 0,
          bumpTexture: null,
          noiseTexture: "{res}/textures/noise.png",
          bumpScale: 0.02
        }
      }
    }
  }
}).addTo(map);
