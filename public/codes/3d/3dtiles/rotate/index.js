const map = new maptalks.Map("map", {
  center: [108.95965, 34.2189],
  zoom: 18,
  bearing: 0,
  pitch: 45,
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
          bottom: "{res}/hdr/923/bottom.jpg",
        },
      },
      exposure: 1.426,
      hsv: [0, 0, 0],
      orientation: 302.553,
    }
  }
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.915,
    },
    postProcess: {
      enable: true
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
          roughnessFactor: 0.22,
          metallicFactor: 0.58,
        }
      }
    }
  }
}).addTo(map);

const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://resource.dvgis.cn/data/3dtiles/dayanta/tileset.json",
      maximumScreenSpaceError: 8.0,
      heightOffset: -400
    }
  ]
}).addTo(groupGLLayer);
layer.once('loadtileset', e => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
});
/**start**/
const duration = 20000;
const player = map.animateTo({
    bearing: map.getBearing() + 360
  }, {
    easing: "linear",
    duration,
    repeat: true
  }
);

function rotate() {
  player.play();
}

function stop() {
  player.pause();
}
/**end**/

//gui控件交互代码
const gui = new mt.GUI();
gui
  .add({
    type: "checkbox",
    label: "自动旋转",
    value: true
  })
  .onChange((value) => {
    if (value) {
      rotate();
    } else {
      stop();
    }
  });

gui
  .add({
    type: "slider",
    label: "旋转速度",
    value: 1,
    min: 0.1,
    max: 5,
    step: 0.1
  })
  .onChange((value) => {
    player.duration = duration / value;
  });