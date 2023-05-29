const map = new maptalks.Map("map", {
  center: [108.95965, 34.21776],
  zoom: 18.865,
  bearing: -1.23,
  pitch: 50,
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
let floodAnalysis,
  waterHeight = 50,
  floodAnimation = false,
  floodAnimationSpeed = 1;
layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 1, { animation: false });
  floodAnalysis = new maptalks.FloodAnalysis({
    // 水淹区域
    boundary: [
      [108.95888623345706, 34.220502132776204],
      [108.9582019833017, 34.21987192350153],
      [108.95866479224173, 34.21879554904879],
      [108.95976365662978, 34.21870809810403],
      [108.96043811487289, 34.219454268264116],
      [108.96030941797153, 34.2204038033789]
    ],
    // 水面海拔高度，单位米
    waterHeight,
    // 水的颜色
    waterColor: [0.1, 0.5, 0.6],
    waterOpacity: 0.4
  });
  floodAnalysis.addTo(groupGLLayer);
});
/**end**/
//以下是绘制水淹区域的逻辑
const vlayer = new maptalks.VectorLayer("vector", {
  enableAltitude: true
}).addTo(map);

let altitudes = [],
  coordinates = [],
  first = true;
const drawTool = new maptalks.DrawTool({
  mode: "LineString",
  once: true,
  enableAltitude: true,
  symbol: {
    lineColor: "#f00"
  }
})
  .addTo(map)
  .disable();

drawTool.on("mousemove", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  if (first) {
    coordinates.push([coordinate.x, coordinate.y]);
    altitudes.push(coordinate.z);
  } else {
    coordinates[coordinates.length - 1] = [coordinate.x, coordinate.y];
    altitudes[altitudes.length - 1] = coordinate.z;
  }
  e.geometry.setProperties({
    altitude: altitudes
  });
  e.geometry.setCoordinates(coordinates);
  first = false;
});

drawTool.on("drawvertex", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  if (first) {
    coordinates.push([coordinate.x, coordinate.y]);
    altitudes.push(coordinate.z);
    first = false;
  } else {
    coordinates[coordinates.length - 1] = [coordinate.x, coordinate.y];
    altitudes[altitudes.length - 1] = coordinate.z;
    first = true;
  }
  e.geometry.setProperties({
    altitude: altitudes
  });
  e.geometry.setCoordinates(coordinates);
});

drawTool.on("drawstart", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  coordinates.push([coordinate.x, coordinate.y]);
  altitudes.push(coordinate.z);
  e.geometry.setProperties({
    altitude: altitudes
  });
  e.geometry.setCoordinates(coordinates);
  first = true;
});

drawTool.on("drawend", function (param) {
  vlayer.clear();
  coordinates.push(coordinates[0]);
  altitudes.push(altitudes[0]);
  new maptalks.LineString(coordinates, {
    symbol: {
      lineColor: "#f00"
    },
    properties: {
      altitude: altitudes
    }
  }).addTo(vlayer);
  floodAnalysis.enable();
  floodAnalysis.update("boundary", coordinates);
  coordinates = [];
  altitudes = [];
});

function getPickedCoordinate(coordinate) {
  const identifyData = groupGLLayer.identify(coordinate)[0];
  const pickedCoordinate = identifyData && identifyData.coordinate;
  if (pickedCoordinate) {
    return new maptalks.Coordinate(pickedCoordinate);
  } else {
    return coordinate;
  }
}

function step() {
  if (floodAnimation) {
    if (waterHeight > 100) {
      waterHeight = 0;
    }
    waterHeight += 0.05 * floodAnimationSpeed;
    floodAnalysis.update("waterHeight", waterHeight);
    requestAnimationFrame(step);
  }
}

const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "绘制水淹区域",
    role: "draw"
  })
  .onClick(() => {
    floodAnimation = false;
    drawTool.enable();
  });
gui
  .add({
    type: "slider",
    label: "水淹高度",
    value: 25,
    min: 0.0,
    max: 100,
    step: 1
  })
  .onChange(function (value) {
    waterHeight = value;
    floodAnalysis.update("waterHeight", waterHeight);
  });

gui
  .add({
    type: "slider",
    label: "淹没速度",
    value: 1,
    min: 0.1,
    max: 3,
    step: 0.1
  })
  .onChange(function (value) {
    floodAnimation = true;
    floodAnimationSpeed = value;
    requestAnimationFrame(step);
  });

gui
  .add({
    type: "color",
    label: "水面颜色",
    value: "#197d99"
  })
  .onChange(function (value) {
    const r = parseInt("0x" + value.toString().slice(1, 3));
    const g = parseInt("0x" + value.toString().slice(3, 5));
    const b = parseInt("0x" + value.toString().slice(5, 7));
    floodAnalysis.update("waterColor", [r / 255, g / 255, b / 255]);
  });

gui
  .add({
    type: "button",
    role: "play",
    label: "开始分析"
  })
  .onClick(function () {
    floodAnimation = true;
    requestAnimationFrame(step);
  });

gui
  .add({
    type: "button",
    label: "重置",
    role: "clear"
  })
  .onClick(() => {
    waterHeight = 50;
    floodAnimation = false;
    floodAnimationSpeed = 1;
    floodAnalysis.disable();
    vlayer.clear();
  });
