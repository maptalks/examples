const map = new maptalks.Map("map", {
  center: [108.9605239272878, 34.21955775963946],
  zoom: 12,
  pitch: 45,
  lights: {
    directional: { direction: [1, -0.4, -1], color: [1, 1, 1] },
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
      exposure: 1,
      hsv: [0, 0, 0],
      orientation: 302.553
    }
  }
});

const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://resource.dvgis.cn/data/3dtiles/dayanta/tileset.json",

      maximumScreenSpaceError: 1.0,
      pointOpacity: 0.5,
      pointSize: 3,
      heightOffset: -400
    }
  ]
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 1,
      brightness: 1
    },
    shadow: {
      enable: true,
      opacity: 0.5,
      color: [0, 0, 0]
    },
    postProcess: {
      enable: true,
      antialias: {
        enable: true
      },
      ssr: {
        enable: true
      },
      bloom: {
        enable: true
      },
      outline: {
        enable: true
      }
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "lit"
      },
      symbol: {
        polygonOpacity: 1,
        material: {
          baseColorFactor: [0.48235, 0.48235, 0.48235, 1],
          hsv: [0, 0, -0.532],
          roughnessFactor: 0.22,
          metallicFactor: 0.58
        }
      }
    }
  }
}).addTo(map);

layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 1, { animation: false });
});

/**start**/
const heightLimitAnalysis = new maptalks.HeightLimitAnalysis({
  limitHeight: 25,
  limitColor: [1, 0.2, 0.2]
});
heightLimitAnalysis.addTo(groupGLLayer);

const gui = new mt.GUI();

gui
  .add({
    type: "color",
    label: "颜色",
    value: "#ea6b48"
  })
  .onChange(function (value) {
    const r = parseInt("0x" + value.toString().slice(1, 3));
    const g = parseInt("0x" + value.toString().slice(3, 5));
    const b = parseInt("0x" + value.toString().slice(5, 7));
    heightLimitAnalysis.update("limitColor", [r / 255, g / 255, b / 255]);
  });

gui
  .add({
    type: "slider",
    label: "限高（米）",
    value: 25,
    min: 0,
    max: 100,
    step: 1
  })
  .onChange(function (value) {
    heightLimitAnalysis.update("limitHeight", value);
  });
/**end**/
