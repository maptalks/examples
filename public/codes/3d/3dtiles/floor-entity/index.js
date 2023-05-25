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

const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
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
function setEventAndInfowindow(mask) {
  mask.on('mouseover mouseout', e => {
    let polygonFill = '#ea6b48';
    if (e.type === 'mouseover') {
      polygonFill = '#2e2'
    }
    e.target.updateSymbol({
      polygonFill
    });
  });
  const name = mask.getProperties().name;
  mask.setInfoWindow({
    content: `名称: ${name} </br>地址: xxxx大道118号</br>联系方式:132xxx4422`,
    autoCloseOn: 'click'
  });
}

const masks = [];
function loadMonomers() {
  fetch('{res}/geojson/floor.json').then(function(response){
    return response.json();
  }).then(function(data){
    for (let i = 0; i < data.length; i++) {
      const top = Number(data[i].properties.topHeight), buttom = Number(data[i].properties.buttomHeight);
      const mask = new maptalks.ColorMask(data[i].geometry.coordinates, {
        symbol: {
          polygonFill: '#ea6b48',
          polygonOpacity: 0.6
        },
        heightRange: [buttom, top],
        properties: data[i].properties
      });
      setEventAndInfowindow(mask);
      masks.push(mask);
    }
    layer.setMask(masks[0]);
  });
}


layer.once("loadtileset", (e) => {
  loadMonomers();
});
/**end**/

//gui控件交互代码
const gui = new mt.GUI();
gui
  .add({
    label: "楼层选择",
    type: "select",
    value: "楼层一",
    options: [
      {
        label: "楼层一",
        value: "楼层一",
      },
      {
        label: "楼层二",
        value: "楼层二",
      },
      {
        label: "楼层三",
        value: "楼层三",
      },
      {
        label: "楼层四",
        value: "楼层四",
      }
    ],
  })
  .onChange((value) => {
    for (let i = 0; i < masks.length; i++) {
      const properties = masks[i].getProperties();
      if (properties.name === value) {
        const center = masks[i].getCenter();
        map.panTo(center, { animation: true });
        layer.setMask(masks[i]);
      }
    }
  });
