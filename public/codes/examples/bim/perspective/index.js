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

const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
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

layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
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

/**start**/
function toFullView() {
  const extent = layer.getExtent();
  map.fitExtent(extent, 0, { animation: false });
}
/**end**/

const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "全景",
    role: "panorama",
  })
  .onClick(() => {
    toFullView();
  });
