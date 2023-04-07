const map = new maptalks.Map("map", {
  center: [-74.01026733935669, 40.710726717547544],
  zoom: 17.66022772811314,
  bearing: 89.39999999999998,
  pitch: 80,
  lights: {
    directional: { direction: [0.4, 0, -1], color: [1, 1, 1] },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/923/front.jpg",
          back: "{res}/hdr/923/back.jpg",
          left: "{res}/hdr/923/left.jpg",
          right: "{res}/hdr/923/right.jpg",
          top: "{res}/hdr/923/top.jpg",
          bottom: "{res}/hdr/923/bottom.jpg",
        },
      },
      exposure: 1.372,
      hsv: [0, 0, 0],
      orientation: 0,
    },
  },
});

// add gltf layer
const gltfLayer = new maptalks.GLTFLayer("gltf");

const gltfMarker1 = new maptalks.GLTFMarker(
  [-74.00656386898424, 40.70756493323685],
  {
    symbol: {
      bloom: false,
      ssr: false,
      shadow: true,
      url: "{res}/gltf/police/police.glb",
      animation: true,
      animationName: null,
      loop: true,
      speed: 1,
      translationX: 0,
      translationY: 0,
      translationZ: 0,
      scaleX: 0.49241701188966774,
      scaleY: 0.49241701188966774,
      scaleZ: 0.49241701188966774,
      rotationX: 0,
      rotationY: 0,
      rotationZ: -192.26783248583342,
      fixSizeOnZoom: -1,
      shader: "pbr",
      uniforms: {
        polygonFill: [1, 1, 1, 1],
        polygonOpacity: 1,
        baseColorIntensity: 1,
        outputSRGB: 1,
      },
    },
    zoomOnAdded: 17.425549387902585,
  }
);

gltfLayer.addGeometry(gltfMarker1);

const gltfMarker2 = new maptalks.GLTFMarker(
  [-74.00663965973223, 40.703013720827386],
  {
    symbol: {
      bloom: false,
      ssr: false,
      shadow: true,
      url: "{res}/gltf/police/police.glb",
      animation: true,
      animationName: null,
      loop: true,
      speed: 1,
      translationX: 0,
      translationY: 0,
      translationZ: 0,
      scaleX: 0.47064793594963306,
      scaleY: 0.47064793594963306,
      scaleZ: 0.47064793594963306,
      rotationX: 0,
      rotationY: 0,
      rotationZ: -184.09723384684312,
      fixSizeOnZoom: -1,
      shader: "pbr",
      uniforms: {
        polygonFill: [1, 1, 1, 1],
        polygonOpacity: 1,
        baseColorIntensity: 1,
        outputSRGB: 1,
      },
    },
    zoomOnAdded: 17.425549387902585,
  }
);

gltfLayer.addGeometry(gltfMarker2);

const gltfMarker3 = new maptalks.GLTFMarker(
  [-74.00548429889682, 40.706208529544114],
  {
    symbol: {
      bloom: false,
      ssr: false,
      shadow: true,
      url: "{res}/gltf/taxi/taxi.glb",
      animation: true,
      animationName: null,
      loop: true,
      speed: 1,
      translationX: 0,
      translationY: 0,
      translationZ: 0,
      scaleX: 0.19266722509667805,
      scaleY: 0.19266722509667805,
      scaleZ: 0.19266722509667805,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 85.75520986697181,
      fixSizeOnZoom: -1,
      shader: "pbr",
      uniforms: {
        polygonFill: [1, 1, 1, 1],
        polygonOpacity: 1,
        baseColorIntensity: 1,
        outputSRGB: 1,
      },
    },
    zoomOnAdded: 16,
  }
);

gltfLayer.addGeometry(gltfMarker3);

const gltfMarker4 = new maptalks.GLTFMarker(
  [-74.00673437408062, 40.70420503459124],
  {
    symbol: {
      bloom: false,
      ssr: false,
      shadow: true,
      url: "{res}/gltf/taxi/taxi.glb",
      animation: true,
      animationName: null,
      loop: true,
      speed: 1,
      translationX: 0,
      translationY: 0,
      translationZ: 0,
      scaleX: 0.19266722509667805,
      scaleY: 0.19266722509667805,
      scaleZ: 0.19266722509667805,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      fixSizeOnZoom: -1,
      shader: "pbr",
      uniforms: {
        polygonFill: [1, 1, 1, 1],
        polygonOpacity: 1,
        baseColorIntensity: 1,
        outputSRGB: 1,
      },
    },
    zoomOnAdded: 16,
  }
);

gltfLayer.addGeometry(gltfMarker4);

const gltfMarker5 = new maptalks.GLTFMarker(
  [-74.0076142322497, 40.710703715498965],
  {
    symbol: {
      visible: true,
      bloom: false,
      ssr: false,
      shadow: true,
      url: "{res}/gltf/ebc/scene.gltf",
      animation: true,
      animationName: null,
      loop: true,
      speed: 1,
      translationX: 0,
      translationY: 0,
      translationZ: 0,
      scaleX: 24.734538996256795,
      scaleY: 24.734538996256795,
      scaleZ: 24.734538996256795,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      fixSizeOnZoom: -1,
      shader: "pbr",
      uniforms: {
        polygonFill: [1, 1, 1, 1],
        polygonOpacity: 1,
        baseColorIntensity: 1.69,
        outputSRGB: 1,
      },
    },
    zoomOnAdded: 16,
  }
);

gltfLayer.addGeometry(gltfMarker5);

// video layer
const ratio = (48 / 27) * 0.01;
const videoSurface = new maptalks.VideoSurface(
  [
    [-74.01162476336549, 40.712214182492374, 100],
    [-74.0116320237475, 40.7111789805343, 100],
    [-74.0116320237475, 40.7111789805343, 1],
    [-74.01162476336549, 40.712214182492374, 1],
  ],
  {
    url: "{res}/videos/test1.mp4",
    opacity: 1,
  }
);
const videoLayer = new maptalks.VideoLayer("video");
videoSurface.addTo(videoLayer);

// group layer
const groupGLLayer = new maptalks.GroupGLLayer("gl", [gltfLayer, videoLayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0,
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
      antialias: { enable: true, taa: true, jitterRatio: 0.25 },
      ssr: { enable: true },
      bloom: {
        enable: true,
        threshold: 0,
        factor: 1,
        radius: 1,
      },
      ssao: {
        enable: true,
        bias: 0.08,
        radius: 0.08,
        intensity: 1.5,
      },
      sharpen: { enable: false, factor: 0.2 },
      outline: {
        enable: true,
        outlineFactor: 0.3,
        highlightFactor: 0.2,
        outlineWidth: 1,
        outlineColor: [1, 1, 0],
      },
    },
    ground: {
      enable: true,
      renderPlugin: { type: "fill" },
      symbol: {
        polygonFill: [
          0.5215686274509804, 0.5450980392156862, 0.5725490196078431, 1,
        ],
        polygonOpacity: 1,
      },
    },
  },
}).addTo(map);

map.on("click", (e) => {
  console.log(e);
});

const gui = new dat.GUI({
  // width: 250,
});

const Config = function () {
  this.height = 96;
};
const options = new Config();

const heightController = gui
  .add(options, "height")
  .name("地形高度")
  .min(0)
  .max(120)
  .step(0.1);
heightController.onChange((value) => {
  console.log(value);
});
