let map, groupLayer, drawTool;
let insightAnalysis = null,
eyePos, lookPoint, altitudes = [], distance,
coordinates = [],
first = true, angle = 180;
/**start**/
fetch('{res}/msd/map.json').then(function(response){
  return response.json();
}).then(function(data){
  map = maptalks.Map.fromJSON('map', data);
  const center = map.getCenter();
  groupLayer = map.getLayer('group');
  const vt = groupLayer.getLayer('vt0');
  vt.options.pickingPoint = true;
  lookPoint = [center.x - 0.001, center.y - 0.0005, 100];
    //视点位置
  eyePos = [center.x + 0.003, center.y + 0.002, 50];
  //创建通视分析对象
  insightAnalysis = new maptalks.InSightAnalysis({
    lines: [{
        from: eyePos,
        to: lookPoint,
      }
    ],
    //可视部分的颜色
    visibleColor: [0, 1, 0, 1],
    //不可视部分的颜色
    invisibleColor: [1, 0, 0, 1]
  });
  insightAnalysis.addTo(groupLayer);
  addLabel();
  setDrawTool();
});

// 以下是绘制通视分析的逻辑
function setDrawTool() {
  drawTool = new maptalks.DrawTool({
    mode: "LineString",
    enableAltitude: true,
    symbol: {
      lineColor: '#f00'
    }
  }).addTo(map).disable();
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
      altitude: altitudes,
    });
    e.geometry.setCoordinates(coordinates);
    lookPoint = [coordinate.x, coordinate.y, coordinate.z];
    insightAnalysis.update('lines', [{
      from: eyePos,
      to: lookPoint
    }]);
    updateLabel();
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
      altitude: altitudes,
    });
    e.geometry.setCoordinates(coordinates);
    lookPoint = [coordinate.x, coordinate.y, coordinate.z];
    insightAnalysis.update('lines', [{
      from: eyePos,
      to: lookPoint
    }]);
    updateLabel();
    drawTool.disable();
  });

  drawTool.on("drawstart", (e) => {
    const coordinate = getPickedCoordinate(e.coordinate);
    if (!coordinate) {
      return;
    }
    coordinates.push([coordinate.x, coordinate.y]);
    altitudes.push(coordinate.z);
    e.geometry.setProperties({
      altitude: altitudes,
    });
    e.geometry.setCoordinates(coordinates);
    eyePos = [coordinate.x, coordinate.y, coordinate.z];
    insightAnalysis.update('lines', [{
      from: eyePos,
      to: lookPoint
    }]);
    updateLabel();
    first = true;
  });
}

function getPickedCoordinate(coordinate) {
  const identifyData = groupLayer.identify(coordinate)[0];
  const pickedCoordinate = identifyData && identifyData.coordinate;
  if (pickedCoordinate) {
    return new maptalks.Coordinate(pickedCoordinate);
  } else {
    return coordinate;
  }
}
/**end**/

function addLabel() {
  let vLayer = map.getLayer('vLayer');
  if (!vLayer) {
    vLayer = new maptalks.VectorLayer('vLayer', {
      enableAltitude: true
    }).addTo(map);
  }
  const circleSymbol = {
    'markerType' : 'ellipse',
    'markerLineColor': '#fff',
    'markerFill': '#f00',
    'markerWidth': 10,
    'markerHeight': 10
  };
  const labelSymbol1 = getLabelSymbol(60, eyePos[2]);
  new maptalks.Marker(eyePos, {
    symbol: circleSymbol,
    properties: {
      altitude: eyePos[2]
    }
  }).addTo(vLayer);
  new maptalks.TextBox('观察点', eyePos, 80, 35, labelSymbol1).addTo(vLayer);
  const labelSymbol2 = getLabelSymbol(-60, lookPoint[2]);
  new maptalks.Marker(lookPoint, {
    symbol: circleSymbol,
    properties: {
      altitude: lookPoint[2]
    }
  }).addTo(vLayer);
  new maptalks.TextBox('目标点', lookPoint, 80, 35, labelSymbol2).addTo(vLayer);

}
function updateLabel() {
  const vLayer = map.getLayer('vLayer');
  vLayer.clear();
  addLabel();
}

function getLabelSymbol(Dx, height) {
  const labelSymbol = {
    'draggable' : false,
    'textStyle' : {
      'wrap' : true,
      'padding' : [12, 8],
      'verticalAlignment' : 'center',
      'horizontalAlignment' : 'center',
      'symbol' : {
        'textFaceName' : 'monospace',
        'textFill' : '#fff',
        'textSize' : 14,
      }
    },
    'boxSymbol': {
      'markerType' : 'square',
      'markerFill' : 'rgb(20, 20, 20)',
      'markerFillOpacity' : 0.7,
      'markerLineWidth' : 0,
      'markerDy': -10,
      'markerDx': Dx
    },
    properties: {
      altitude: height
    }
  };
  return labelSymbol;
}
//gui控件交互代码
const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "绘制通视线",
    role: "draw",
  })
  .onClick(() => {
    insightAnalysis.enable();
    drawTool.enable();
});

gui
  .add({
    type: "button",
    label: "清除全部",
    role: "clear",
  })
  .onClick(() => {
    const vLayer = map.getLayer('vLayer');
    vLayer.clear();
    insightAnalysis.disable();
  });

gui
  .add({
    type: "slider",
    label: "观察方向",
    value: 180,
    min: 0,
    max: 360,
    step: 1,
  }).onChange(function (value) {
    if (!distance) {
      distance = Math.sqrt(Math.pow(eyePos[0] - lookPoint[0], 2) + Math.pow(eyePos[1] - lookPoint[1], 2));
    }
    angle = value;
    const x = eyePos[0] + distance * Math.cos(value / 180 * Math.PI);
    const y = eyePos[1] + distance * Math.sin(value / 180 * Math.PI);
    lookPoint[0] = x;
    lookPoint[1] = y;
    insightAnalysis.update("lines", [{
      from: eyePos,
      to: lookPoint
    }]);
    updateLabel();
});

gui
  .add({
    type: "slider",
    label: "观察点高度",
    value: 30,
    min: 0,
    max: 200,
    step: 1,
  }).onChange(function (value) {
    eyePos[2] = value;
    insightAnalysis.update("lines", [{
      from: eyePos,
      to: lookPoint
    }]);
    updateLabel();
});

gui
  .add({
    type: "slider",
    label: "目标点高度",
    value: 30,
    min: 0,
    max: 200,
    step: 1,
  }).onChange(function (value) {
    lookPoint[2] = value;
    insightAnalysis.update("lines", [{
      from: eyePos,
      to: lookPoint
    }]);
    updateLabel();
});

gui
  .add({
    type: "slider",
    label: "距离",
    value: 0,
    min: 0,
    max: 90,
    step: 1,
  }).onChange(function (value) {
    lookPoint[0] = eyePos[0] + (value / 10000) * Math.cos(angle / 180 * Math.PI );
    lookPoint[1] = eyePos[1] + (value / 10000) * Math.sin(angle / 180 * Math.PI );
    insightAnalysis.update("lines", [{
      from: eyePos,
      to: lookPoint
    }]);
    updateLabel();
});

const exportControl = gui.add({
  type: "button",
  text: "计算交点",
}).onClick(() => {
  const results = insightAnalysis.getIntersetction();
  console.group(results);
});
