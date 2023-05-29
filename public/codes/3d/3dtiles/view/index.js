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
/**start**/
const viewPoints = [{ name: "视点1", coordinate: [108.95936021, 34.219710523, 61.8]
}, { name: "视点2", coordinate: [108.95942507629388, 34.22067097711019, 36.82354]
}, { name: "视点3", coordinate: [108.96009562683105, 34.21850388887586, 27.62234]
}, { name: "视点4", coordinate: [108.95803062973027, 34.21785606471539, 40.97386]
}];

const viewMap = [{center: [108.96012238218702, 34.22056674324037], zoom: 18.4446, pitch: 74.2, bearing: 39.6},
  {center: [108.95971800453219, 34.220909441652026], zoom: 19.6565, pitch: 63.4, bearing: 39.978},
  {center: [108.9602382990106, 34.2184286058185], zoom: 19.6565, pitch: 37.4, bearing: 121.578},
  {center: [108.95770568501587, 34.21753802805168], zoom: 18.7391, pitch: 62.6, bearing: -138.222}];
const point = new maptalks.PointLayer("point").addTo(groupGLLayer);

function addMarkers() {
  for (let i = 0; i < viewPoints.length; i++) {
    const marker = new maptalks.Marker(
      viewPoints[i].coordinate, {
        properties: { name: viewPoints[i].name, index: i },
        symbol: [{
          textName: `${i + 1}`,
          textSize: 16,
          textFill: "#ddd",
          textDy: -11,
          textDx: 1,
          textFaceName: '"microsoft yahei"'
        },{
          markerPerspectiveRatio: 0,
          markerType: "ellipse",
          markerFill: "#000",
          markerFillOpacity: 0.6,
          markerLineColor: "#ddd",
          markerLineWidth: 2,
          markerWidth: 25,
          markerHeight: 25,
        }]
      }
    ).addTo(point);

    marker.on("mouseenter mouseout", e => {
      const lineColor = e.type === "mouseenter" ? '#80caff' : "#ddd";
      e.target.updateSymbol([{
          textFill: lineColor
      },{
        markerLineColor: lineColor
      }]);
    });

    marker.on('click', e => {
      const index = e.target.getProperties().index;
      map.flyTo(viewMap[index], { duration: 3000 });
    });
  }
}

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
  addMarkers();
});

let viewIndex = 0, interval = null;
function autoPlay(auto) {
  if (auto) {
    map.flyTo(viewMap[viewIndex], { duration: 3000 });
    interval = setInterval(() => {
      if (viewIndex >= viewMap.length) {
        viewIndex = 0;
      }
      map.flyTo(viewMap[viewIndex], { duration: 3000 });
      viewIndex += 1;
    }, 6000);
  } else {
    clearInterval(interval);
  }
}
/**end**/
//gui控件交互代码
const gui = new mt.GUI();
gui
  .add({
    type: "checkbox",
    label: "显示标注",
    value: true
  })
  .onChange((value) => {
    if (value) {
      point.show();
    } else {
      point.hide();
    }
  });

gui
  .add({
    type: "checkbox",
    label: "自动播放",
    value: false
  })
  .onChange((value) => {
    autoPlay(value);
  });

gui
  .add({
    label: "视角选择",
    type: "select",
    value: "0",
    options: [
      {
        label: "视角1",
        value: "0",
      },
      {
        label: "视角2",
        value: "1",
      },
      {
        label: "视角3",
        value: "2",
      },
      {
        label: "视角4",
        value: "3",
      }
    ]
  })
  .onChange((value) => {
    const view = viewMap[value];
    if (view) {
      map.flyTo(view, { duration: 3000 });
    }
  });
