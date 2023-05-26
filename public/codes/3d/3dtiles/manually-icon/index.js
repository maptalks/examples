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
let drawState = 0;
const pointLayer = new maptalks.PointLayer("point").addTo(groupGLLayer);
map.on('click', e => {
  if (drawState) {
    const coordinate = getPickedCoordinate(e.coordinate);
    const marker = new maptalks.Marker(coordinate, {
      symbol: {
        markerFile: '{res}/images/logo-maptalks.svg',
        markerWidth: 29,
        markerHeight: 32,
        markerPerspectiveRatio: 0
      }
    }).addTo(pointLayer);
  }
});

function getPickedCoordinate(coordinate) {
  const identifyData = groupGLLayer.identify(coordinate)[0];
  return (identifyData && identifyData.coordinate) || coordinate;
}
/**end**/

//gui控件交互代码
const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "手动添加图标",
    role: "draw"
  })
  .onClick(() => {
    drawState = 1;
    map.setCursor('crosshair');
});

gui
  .add({
    type: "button",
    label: "清除全部",
    role: "clear"
  })
  .onClick(() => {
    drawState = 0;
    map.resetCursor();
    pointLayer.clear();
});
