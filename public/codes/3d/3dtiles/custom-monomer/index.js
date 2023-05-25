let topHeight = 50, buttomHeight = 40;
function createMap(mapDiv, center, zoom, pitch, dragRotatePitch, dragPitch) {
  const map = new maptalks.Map(mapDiv, {
    center,
    zoom,
    pitch,
    dragRotatePitch,
    dragPitch,
    bearing: 0,
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
  return map;
}

function create3DtilesLayer() {
  const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
    geometryEvents: true,
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
  return layer;
}

function createGroupGLLayer() {
  return new maptalks.GroupGLLayer("gl", [], {
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
          },
        }
      }
    }
  });
}

function toJSONFile(layer) {
  const json = [];
  const polygons = layer.getGeometries();
  for (let i = 0; i < polygons.length; i++) {
    const maskJson = polygons[i].toGeoJSON();
    json.push(maskJson);
  }
  const str = JSON.stringify(json);
  console.log(str);
}

const mapLeft = createMap('map-left', [108.9594, 34.2198], 18.865, 0, false, false);
const mapRight = createMap('map-right', [108.9594, 34.2198], 18.5, 45, true, true);
const groupLayerLeft = createGroupGLLayer().addTo(mapLeft);
const groupLayerRight = createGroupGLLayer().addTo(mapRight);
const layerLeft = create3DtilesLayer().addTo(groupLayerLeft);
const layerRight = create3DtilesLayer().addTo(groupLayerRight);

const flatMask = new maptalks.FlatInsideMask([
  [108.95682305574587, 34.22197583048299], [108.96203619403514, 34.22206335452293], [108.96241990218334, 34.217282220654255], [108.95662458601396, 34.21698680989036]
], {
  flatHeight: 0
});
//左侧地图压平, 方便绘制
layerLeft.once('loadtileset', () => {
  layerLeft.setMask(flatMask);
});

/**start**/
let masks= [], currentMask = null;;
const drawLayer = new maptalks.VectorLayer('drawLayer').addTo(mapLeft);
const drawTool = new maptalks.DrawTool({
  mode: "polygon",
  once: true,
  symbol: {
    lineColor: '#f00',
    polygonFill: '#ea6b48',
    polygonOpacity: 0.6
  }
}).addTo(mapLeft).disable();

drawTool.on('drawend', e => {
  console.log(111);
  e.geometry.addTo(drawLayer);
  addMask(e.geometry);
});

function addMask(polygon) {
  const mask = new maptalks.ColorMask(polygon.getCoordinates(), {
    symbol: polygon.getSymbol(),
    heightRange: [buttomHeight, topHeight]
  });
  mask.on('mouseenter mouseout', e => {
    const opacity = e.type === 'mouseenter' ? 0.8 : 0.4;
    e.target.updateSymbol({
      polygonOpacity: opacity
    });
  });
  currentMask = mask;
  masks.forEach(mask => {
    mask.remove();
  });
  masks.push(mask);
  layerRight.setMask(masks);
}
/**end**/
//gui控件交互代码
const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "绘制范围",
    role: "draw"
  })
  .onClick(() => {
    drawTool.enable();
});

gui
  .add({
    type: "button",
    label: "重置",
    role: "clear"
  })
  .onClick(() => {
    drawTool.disable();
    drawLayer.clear();
    layerRight.removeMask();
});

gui
  .add({
    type: "slider",
    label: "底高(米)",
    value: buttomHeight,
    min: 0,
    max: 100,
    step: 1,
  }).onChange(function (value) {
    buttomHeight = value;
});

gui
  .add({
    type: "slider",
    label: "顶高(米)",
    value: topHeight,
    min: 0,
    max: 100,
    step: 1,
  }).onChange(function (value) {
    topHeight = value;
});

gui.add({
  type: "button",
  text: "设置高度范围",
}).onClick(() => {
  if (buttomHeight >= topHeight) {
    alert('top height should be bigger than buttom height');
    return;
  }
  currentMask.setHeightRange([buttomHeight, topHeight]);
});

gui.add({
  type: "button",
  text: "导出",
}).onClick(() => {
  toJSONFile(drawLayer);
});
