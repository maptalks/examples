const map = new maptalks.Map("map", {
  center: [108.9594, 34.2193],
  zoom: 17.8,
  pitch: 58.4,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}"
  })
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

const sceneConfig = {
  postProcess: {
    enable: true,
    antialias: {
      enable: true
    }
  }
};

window.focus();

window.addEventListener("mouseover", () => {
  window.focus();
});

const gltfLayer = new maptalks.GLTFLayer("gltf");
const gltfMarker = new maptalks.GLTFMarker([108.958438, 34.217715, 17.5], {
  symbol: {
    url: "{res}/gltf/character_x_bot/scene.gltf",
    rotationZ: 180,
    scaleX: 0.5,
    scaleY: 0.5,
    scaleZ: 0.5,
    animation: true,
    loop: true
  }
}).addTo(gltfLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [layer, gltfLayer], {
  sceneConfig
}).addTo(map);

const containerPoint = new maptalks.Point([map.width / 2, map.height / 2]);

/**start**/
let cameraPosition = {
  position: [108.958438, 34.217715, 50],
  pitch: 60,
  bearing: 0
};

map.setCameraPosition(cameraPosition);

const eventsMap = {
  w: moveForward,
  a: moveLeft,
  s: moveBack,
  d: moveRight,
  q: rotateLeft,
  e: rotateRight,
  z: lookUp,
  x: lookDown,
  "+": addZoom,
  "-": reduceZoom
};

function getStep(fast) {
  return fast ? 10 : 5;
}

function addZoom() {
  map.setZoom(map.getZoom() + 0.5);
}

function reduceZoom() {
  map.setZoom(map.getZoom() - 0.5);
}

function moveLeft(fast) {
  const step = getStep(fast);
  const coord = {
    x: cameraPosition.position[0],
    y: cameraPosition.position[1]
  };
  const point = map.coordToContainerPoint(coord);
  const newPoint = point.add(-step, 0);
  const newCoord = map.containerPointToCoord(newPoint);
  cameraPosition.position[0] = newCoord.x;
  cameraPosition.position[1] = newCoord.y;
  map.setCameraPosition(cameraPosition);
  gltfMarker.setCoordinates([newCoord.x, newCoord.y, 17.5]);
}

function moveRight(fast) {
  const step = getStep(fast);
  const coord = {
    x: cameraPosition.position[0],
    y: cameraPosition.position[1]
  };
  const point = map.coordToContainerPoint(coord);
  const newPoint = point.add(step, 0);
  const newCoord = map.containerPointToCoord(newPoint);
  cameraPosition.position[0] = newCoord.x;
  cameraPosition.position[1] = newCoord.y;
  map.setCameraPosition(cameraPosition);
  gltfMarker.setCoordinates([newCoord.x, newCoord.y, 17.5]);
}

function moveForward(fast) {
  const step = getStep(fast);
  const coord = {
    x: cameraPosition.position[0],
    y: cameraPosition.position[1]
  };
  const point = map.coordToContainerPoint(coord);
  const newPoint = point.add(0, -step);
  const newCoord = map.containerPointToCoord(newPoint);
  cameraPosition.position[0] = newCoord.x;
  cameraPosition.position[1] = newCoord.y;
  map.setCameraPosition(cameraPosition);
  gltfMarker.setCoordinates([newCoord.x, newCoord.y, 17.5]);
}

function moveBack(fast) {
  const step = getStep(fast);
  const coord = {
    x: cameraPosition.position[0],
    y: cameraPosition.position[1]
  };
  const point = map.coordToContainerPoint(coord);
  const newPoint = point.add(0, step);
  const newCoord = map.containerPointToCoord(newPoint);
  cameraPosition.position[0] = newCoord.x;
  cameraPosition.position[1] = newCoord.y;
  map.setCameraPosition(cameraPosition);
  gltfMarker.setCoordinates([newCoord.x, newCoord.y, 17.5]);
}

function rotateLeft() {
  cameraPosition.bearing = cameraPosition.bearing - 5;
  map.setCameraPosition(cameraPosition);
  const symbol = gltfMarker.getSymbol();
  gltfMarker.updateSymbol({
    rotationZ: symbol.rotationZ + 5
  });
}

function rotateRight() {
  cameraPosition.bearing = cameraPosition.bearing + 5;
  map.setCameraPosition(cameraPosition);
  const symbol = gltfMarker.getSymbol();
  gltfMarker.updateSymbol({
    rotationZ: symbol.rotationZ - 5
  });
}

function lookUp() {
  cameraPosition.pitch = cameraPosition.pitch + 1;
  map.setCameraPosition(cameraPosition);
}

function lookDown() {
  cameraPosition.pitch = cameraPosition.pitch - 1;
  map.setCameraPosition(cameraPosition);
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (eventsMap[key]) {
    eventsMap[key](e.shiftKey);
  }
});
/**end**/

const gui = new mt.GUI();

gui.add({
  label: "请用键盘操作"
});

gui.add({
  type: "button",
  text: "前进：W"
});

gui.add({
  type: "button",
  text: "加速前进：shift + W"
});

gui.add({
  type: "button",
  text: "左转：Q"
});

gui.add({
  type: "button",
  text: "右转：E"
});

gui.add({
  type: "button",
  text: "抬头：Z"
});

gui.add({
  type: "button",
  text: "低头：X"
});
