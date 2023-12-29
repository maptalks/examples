const map = new maptalks.Map("map", {
  center: [108.95965, 34.21776],
  zoom: 18.865,
  bearing: -90,
  pitch: 40,
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
let skylineAnalysis, eyePos, lookPoint, verticalAngle, horizontalAngle;
layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 1, { animation: false });
  eyePos = [108.96104505157473, 34.219553384558736, 34.55867];
  lookPoint = [108.95948541183475, 34.21971441232435, 67.59082];
  verticalAngle = 30;
  horizontalAngle = 60;
  viewshedAnalysis = new maptalks.ViewshedAnalysis({
    eyePos,
    lookPoint,
    verticalAngle,
    horizontalAngle
  });
  viewshedAnalysis.addTo(groupGLLayer);
});

let coordinates = [],
  first = true;
distance = null;
const drawTool = new maptalks.DrawTool({
  mode: "LineString",
  symbol: {
    lineOpacity: 0
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
    coordinates.push(coordinate);
  } else {
    coordinates[coordinates.length - 1] = coordinate;
  }
  e.geometry.setCoordinates(coordinates);
  lookPoint = coordinate;
  viewshedAnalysis.update("lookPoint", lookPoint);
  first = false;
});

drawTool.on("drawvertex", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  if (first) {
    coordinates.push(coordinate);
    first = false;
  } else {
    coordinates[coordinates.length - 1] = coordinate;
    first = true;
  }
  e.geometry.setCoordinates(coordinates);
  lookPoint = coordinate;
  viewshedAnalysis.update("lookPoint", lookPoint);
  drawTool.disable();
});

drawTool.on("drawstart", (e) => {
  distance = null;
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  coordinates.push(coordinate);
  e.geometry.setCoordinates(coordinates);
  eyePos = coordinate;
  viewshedAnalysis.update("eyePos", eyePos);
  first = true;
});

function getPickedCoordinate(coordinate) {
  const identifyData = groupGLLayer.identify(coordinate)[0];
  return (identifyData && identifyData.coordinate) || [coordinate.x, coordinate.y, coordinate.z || 0];
}
/**end**/

//gui控件交互代码
const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "绘制可视域",
    role: "draw"
  })
  .onClick(() => {
    drawTool.enable();
  });

gui
  .add({
    type: "slider",
    label: "水平角度",
    value: 60,
    min: 0,
    max: 90,
    step: 1
  })
  .onChange(function (value) {
    viewshedAnalysis.update("horizontalAngle", value);
  });

gui
  .add({
    type: "slider",
    label: "垂直角度",
    value: 30,
    min: 0,
    max: 90,
    step: 1
  })
  .onChange(function (value) {
    viewshedAnalysis.update("verticalAngle", value);
  });

gui
  .add({
    type: "slider",
    label: "方向",
    value: 180,
    min: 0,
    max: 360,
    step: 1
  })
  .onChange(function (value) {
    if (distance === null) {
      distance = Math.sqrt(
        Math.pow(eyePos[0] - lookPoint[0], 2) + Math.pow(eyePos[1] - lookPoint[1], 2)
      );
    }
    const x = eyePos[0] + distance * Math.cos((value / 180) * Math.PI);
    const y = eyePos[1] + distance * Math.sin((value / 180) * Math.PI);
    lookPoint[0] = x;
    lookPoint[1] = y;
    viewshedAnalysis.update("lookPoint", lookPoint);
  });
