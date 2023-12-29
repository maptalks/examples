const map = new maptalks.Map("map", {
  center: [108.95965, 34.21776],
  zoom: 18.865,
  bearing: -1.23,
  pitch: 76.8,
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
      level: 0,
      brightness: 0.915
    },
    postProcess: {
      enable: true
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
/**start**/
let skylineAnalysis = null;
layer.once("loadtileset", (e) => {
  skylineAnalysis = new maptalks.SkylineAnalysis({
    lineColor: [234 / 255, 107 / 255, 72 / 255],
    lineWidth: 1.8
  });
  skylineAnalysis.addTo(groupGLLayer);
});

const gui = new mt.GUI();
gui
  .add({
    type: "color",
    label: "天际线颜色",
    value: "#f00"
  })
  .onChange(function (value) {
    const r = parseInt("0x" + value.toString().slice(1, 3));
    const g = parseInt("0x" + value.toString().slice(3, 5));
    const b = parseInt("0x" + value.toString().slice(5, 7));
    skylineAnalysis.update("lineColor", [r / 255, g / 255, b / 255]);
  });
gui
  .add({
    type: "slider",
    label: "线宽",
    value: 1.8,
    min: 0.1,
    max: 3,
    step: 0.1
  })
  .onChange(function (value) {
    skylineAnalysis.update("lineWidth", value);
  });

const exportControl = gui
  .add({
    type: "button",
    text: "输出天际线图"
  })
  .onClick(() => {
    let dom = document.getElementById("skylineImage");
    if (dom) {
      dom.remove();
    }
    const url = skylineAnalysis.exportSkylineMap({});
    dom = document.createElement("div");
    dom.id = "skylineImage";
    dom.style.position = "absolute";
    dom.style.right = "10px";
    dom.style.bottom = "10px";
    dom.style.zIndex = 9999;
    dom.style.width = map.width / 4 + "px";
    dom.style.height = map.height / 4 + "px";
    dom.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    dom.style.padding = "5px";
    dom.style.borderRadius = "4px";
    document.body.appendChild(dom);
    const img = document.createElement("img");
    img.style.width = "100%";
    img.src = url;
    dom.appendChild(img);
  });
  /**end**/
