const map = new maptalks.Map("map", {
  center: [108.960524, 34.219558],
  zoom: 13,
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
      ambientLight: [1, 1, 1],
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

/**start**/
layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 1, { animation: false });
});

let clipper = null,
  center = new maptalks.Coordinate([108.95943151743995, 34.21979575916629, 50]),
  width = 200,
  length = 200,
  height = 50,
  rotation = 0;
const helperLineLayer = new maptalks.LineStringLayer("linelayer").addTo(groupGLLayer);
const vLayer = new maptalks.VectorLayer("vLayer", { enableAltitude: true }).addTo(map);
function updateHelperLine() {
  helperLineLayer.clear();
  const coords = clipper.getCoordinates()[0];
  const heightRange = clipper.getHeightRange();
  const buttom = heightRange[0],
    top = heightRange[1];
  const lines = [
    [
      [coords[0].x, coords[0].y, buttom],
      [coords[1].x, coords[1].y, buttom],
      [coords[2].x, coords[2].y, buttom],
      [coords[3].x, coords[3].y, buttom],
      [coords[0].x, coords[0].y, buttom]
    ],
    [
      [coords[0].x, coords[0].y, top],
      [coords[1].x, coords[1].y, top],
      [coords[2].x, coords[2].y, top],
      [coords[3].x, coords[3].y, top],
      [coords[0].x, coords[0].y, top]
    ],
    [
      [coords[0].x, coords[0].y, buttom],
      [coords[0].x, coords[0].y, top]
    ],
    [
      [coords[1].x, coords[1].y, buttom],
      [coords[1].x, coords[1].y, top]
    ],
    [
      [coords[2].x, coords[2].y, buttom],
      [coords[2].x, coords[2].y, top]
    ],
    [
      [coords[3].x, coords[3].y, buttom],
      [coords[3].x, coords[3].y, top]
    ]
  ];
  new maptalks.MultiLineString(lines, {
    symbol: {
      lineColor: "#edde33",
      lineWidth: 2
    }
  }).addTo(helperLineLayer);
}

const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "添加裁剪盒",
    role: "draw"
  })
  .onClick(() => {
    clipper = new maptalks.BoxInsideClipMask(center, { width, height, length, rotation });
    layer.setMask(clipper);
    updateHelperLine();
  });

gui
  .add({
    type: "button",
    label: "清除全部",
    role: "clear"
  })
  .onClick(() => {
    clipper.remove();
    helperLineLayer.clear();
    clipper = null;
  });

gui
  .add({
    label: "剪裁方式",
    type: "select",
    value: "0",
    options: [
      {
        label: "裁剪盒内部",
        value: "0"
      },
      {
        label: "裁剪盒外部",
        value: "1"
      }
    ]
  })
  .onChange((value) => {
    if (clipper) {
      clipper.remove();
    }
    if (value === "0") {
      clipper = new maptalks.BoxInsideClipMask(center, { width, height, length, rotation });
    } else {
      clipper = new maptalks.BoxOutsideClipMask(center, { width, height, length, rotation });
    }
    layer.setMask(clipper);
    updateHelperLine();
  });

gui
  .add({
    type: "slider",
    label: "长度",
    value: length,
    min: 10,
    max: 500,
    step: 1
  })
  .onChange((value) => {
    if (!clipper) {
      return;
    }
    length = value;
    if (value === 358 || value === '358') {
      value = 357;
    }
    clipper.setLength(value);
    updateHelperLine();
  });

gui
  .add({
    type: "slider",
    label: "宽度",
    value: width,
    min: 10,
    max: 500,
    step: 1
  })
  .onChange((value) => {
    if (!clipper) {
      return;
    }
    width = value;
    clipper.setWidth(width);
    updateHelperLine();
  });

gui
  .add({
    type: "slider",
    label: "高度",
    value: height,
    min: 10,
    max: 300,
    step: 1
  })
  .onChange((value) => {
    if (!clipper) {
      return;
    }
    height = value;
    clipper.setHeight(height);
    updateHelperLine();
  });

gui
  .add({
    type: "slider",
    label: "旋转",
    value: rotation,
    min: 0,
    max: 360,
    step: 1
  })
  .onChange((value) => {
    if (!clipper) {
      return;
    }
    rotation = value;
    clipper.setRotation(rotation);
    updateHelperLine();
  });
/**end**/

// gui
// .add({
//   type: "checkbox",
//   label: "平移",
//   value: false
// })
// .onChange((value) => {
//   if (value) {
//     const marker = new maptalks.Marker(center, {
//       draggable: true,
//       properties: {
//         altitude: center.z
//       }
//     }).addTo(vLayer);
//     marker.on('dragging', e => {
//       e.coordinate.z = center.z;
//       clipper.setPosition(e.coordinate);
//       updateHelperLine();
//     });
//   } else {
//     vLayer.clear();
//   }
// });
