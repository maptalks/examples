let map, groupLayer;
const symbols = [
  {
      url: '{res}/gltf/traffic/car/1.gltf',
      scaleX: 15,
      scaleY: 15,
      scaleZ: 15,
      rotationZ: -90,
      translationZ:5,
      shadow: true
  },
  {
      url: '{res}/gltf/traffic/car/2.gltf',
      scaleX: 15,
      scaleY: 15,
      scaleZ: 15,
      rotationZ: -90,
      translationZ:5,
      shadow: true
  },
  {
      url: '{res}/gltf/traffic/car/3.gltf',
      scaleX: 15,
      scaleY: 15,
      scaleZ: 15,
      rotationZ: -90,
      translationZ:5,
      shadow: true
  },
  {
      url: '{res}/gltf/traffic/car/4.gltf',
      scaleX: 15,
      scaleY: 15,
      scaleZ: 15,
      rotationZ: -90,
      translationZ:5,
      shadow: true
  }
];

/**start**/
const roads = [];
let scene = null;

function AddTrafficScene() {
  scene = new maptalks.TrafficScene();
  scene.setSymbols(symbols);
  scene.carsNumber = 300;
  scene.gridSize = 64;
  scene.addTo(groupLayer);
  scene.generateTraffic(roads);
  scene.run();
}

function loadRoads() {
  fetch('{res}/geojson/roads.json').then(function(response){
    return response.json();
  }).then(function(geometries) {
    const vLayer = new maptalks.VectorLayer('vLayer').addTo(map).hide();
    for (let i = 0; i < geometries.length; i++) {
      roads.push(geometries[i].feature.geometry.coordinates);
      const line = new maptalks.LineString(geometries[i].feature.geometry.coordinates, { symbol: { lineColor: '#4466ee' }});
      line.addTo(vLayer);
    }
    groupLayer = map.getLayer('group');
    AddTrafficScene();
  });
}
fetch('{res}/msd/traffic/map.json').then(function(response){
  return response.json();
}).then(function(data){
  map = maptalks.Map.fromJSON('map', data);
  loadRoads();
});

const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "开始模拟",
    role: "play",
  })
  .onClick(() => {
    if (!scene) {
      AddTrafficScene();
    }
    scene.run();
  });

gui
  .add({
    type: "button",
    label: "停止模拟",
    role: "pause",
  })
  .onClick(() => {
    scene.stop();
  });

gui
  .add({
    type: "button",
    label: "重置",
    role: "clear",
  })
  .onClick(() => {
    scene.remove();
    scene = null;
  });

  gui
  .add({
    type: "checkbox",
    label: "显示轨迹"
  })
  .onChange((value) => {
    const layer = map.getLayer('vLayer');
    if (value) {
      layer.show();
    } else {
      layer.hide();
    }
  });

  gui
  .add({
    type: "slider",
    label: "数量",
    value: 300,
    min: 10,
    max: 500,
    step: 1
  })
  .onChange((value) => {
    scene.carsNumber = value;
  });
/**end**/
