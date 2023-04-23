const map = new maptalks.Map("map", {
  center: [-74.01026733935669, 40.710726717547544],
  zoom: 17.66,
  bearing: 89.4,
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

const gltfMarker = new maptalks.GLTFMarker(
  [-74.0076142322497, 40.710703715498965],
  {
    symbol: {
      shadow: true,
      url: "{res}/gltf/ebc/scene.gltf",
      scaleX: 24.7345,
      scaleY: 24.7345,
      scaleZ: 24.7345,
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

gltfLayer.addGeometry(gltfMarker);

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

/**start**/
let newVideoSurface = null;
function addVideo() {
  map.once("click", (e) => {
    const ratio = (48 / 27) * 0.0005;
    newVideoSurface = new maptalks.VideoSurface(
      [
        [e.coordinate.x - ratio, e.coordinate.y - ratio, 1],
        [e.coordinate.x + ratio, e.coordinate.y - ratio, 1],
        [e.coordinate.x + ratio, e.coordinate.y + ratio, 1],
        [e.coordinate.x - ratio, e.coordinate.y + ratio, 1],
      ],
      {
        url: "{res}/videos/test1.mp4",
        opacity: 1,
      }
    );
    newVideoSurface.addTo(videoLayer);
    newVideoSurface.startEdit();
  });
}
/**end**/

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !!newVideoSurface) {
    newVideoSurface.endEdit();
  }
});

const gui = new mt.GUI();

gui
  .add({
    type: "button",
    label: "视频投放",
    role: "video",
  })
  .onClick(() => {
    addVideo();
  });

gui
  .add({
    type: "button",
    label: "清除全部",
    role: "clear",
  })
  .onClick(() => {
    videoLayer.clear();
  });
