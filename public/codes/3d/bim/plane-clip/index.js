const map = new maptalks.Map("map", {
  center: [108.95965, 34.2189],
  zoom: 18,
  bearing: 0,
  pitch: 45,
  lights: {
    directional: { direction: [0.5, 0, -1], color: [1, 1, 1] },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/446/front.jpg",
          back: "{res}/hdr/446/back.jpg",
          left: "{res}/hdr/446/left.jpg",
          right: "{res}/hdr/446/right.jpg",
          top: "{res}/hdr/446/top.jpg",
          bottom: "{res}/hdr/446/bottom.jpg",
        },
        prefilterCubeSize: 1024,
      },
      exposure: 0.787,
      hsv: [0, 0, 0],
      orientation: 0,
    },
  },
});

/**start**/
const geo3DTileslayer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://examples.maptalks.com/samples/ifc/test1/tileset.json",
      ambientLight: [1, 1, 1],
      maximumScreenSpaceError: 1.0,
      heightOffset: -40,
      opacity: 1.0,
    },
  ],
  polygonOpacity: 1.0,
});

let cutAnalysis = null;
geo3DTileslayer.once("loadtileset", (e) => {
  const extent = geo3DTileslayer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
  const center = map.getCenter();
  cutAnalysis = new maptalks.CutAnalysis({
    position: [center.x, center.y, 10],
    rotation: [0, 0, 45],
    scale: [0.5, 0.5, 0.5],
  }).addTo(groupGLLayer);
});
/**end**/

const groupGLLayer = new maptalks.GroupGLLayer("group", [geo3DTileslayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.489,
    },
    postProcess: {
      enable: true,
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "lit",
      },
      symbol: {
        polygonOpacity: 1,
        material: {
          baseColorFactor: [0.48235, 0.48235, 0.48235, 1],
          hsv: [0, 0, -0.532],
        },
      },
    },
  },
}).addTo(map);

const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "重置",
    role: "clear",
  })
  .onClick(() => {
    cutAnalysis.reset();
  });
