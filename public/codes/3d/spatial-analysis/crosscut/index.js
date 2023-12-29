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

/**start**/
let crosscutAnalysis = null;
layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 1, { animation: false });
  crosscutAnalysis = new maptalks.CrossCutAnalysis({
    cutLine: [
      [108.95943151743995, 34.220773839751956],
      [108.95942615302192, 34.21846280188899]
    ],
    cutLineColor: [0.0, 1.0, 0.0, 1.0]
  }).addTo(groupGLLayer);
});

const vLayer = new maptalks.VectorLayer("vector", {
  enableAltitude: true
}).addTo(map);
let coordinates = [],
  first = true;
const drawTool = new maptalks.DrawTool({
  mode: "LineString",
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
    coordinates.push(coordinate);
  } else {
    coordinates[coordinates.length - 1] = coordinate;
  }
  e.geometry.setCoordinates(coordinates);
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
});

drawTool.on("drawstart", (e) => {
 const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  coordinates.push(coordinate);
  e.geometry.setCoordinates(coordinates);
  first = true;
});

drawTool.on("drawend", () => {
  vLayer.clear();
  drawTool.disable();
  vLayer.clear();
  crosscutAnalysis.update("cutLine", coordinates);
  const results = crosscutAnalysis.getAltitudes(500);
  const distances = results.map((result) => {
    return Number(result.distance.toFixed(3));
  });
  const coords = results.map((result) => {
    return [result.coordinate.x, result.coordinate.y];
  });
  const alts = results.map((result) => {
    return result.coordinate.z;
  });
  new maptalks.LineString(coords, {
    properties: {
      altitude: alts
    },
    symbol: {
      lineColor: "#ea6b48"
    }
  }).addTo(vLayer);
  drawChart(distances, alts);
  coordinates = [];
});

function getPickedCoordinate(coordinate) {
  const identifyData = groupGLLayer.identify(coordinate)[0];
  return (identifyData && identifyData.coordinate) || coordinate;
}

function drawChart(distances, alts) {
  const dom = document.getElementById("chart");
  dom.style.display = "block";
  const myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false
  });

  const option = {
    xAxis: {
      type: "category",
      data: distances,
      name: "间距",
      nameTextStyle: {
        color: "#666",
        fontSize: 12
      }
    },
    yAxis: {
      type: "value",
      name: "高度",
      position: "left",
      nameTextStyle: {
        color: "#666",
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: "#000"
        }
      }
    },
    series: [
      {
        data: alts,
        type: "line",
        lineStyle: {
          color: "#ea6b48"
        },
        areaStyle: {
          color: "#ea6b48",
          opacity: 0.35
        }
      }
    ]
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }
}

const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "绘制切线",
    role: "draw"
  })
  .onClick(() => {
    drawTool.enable();
  });

gui
  .add({
    type: "button",
    label: "清除全部",
    role: "clear"
  })
  .onClick(() => {
    vLayer.clear();
    const dom = document.getElementById("chart");
    dom.style.display = "none";
    drawTool.disable();
  });
/**end**/
