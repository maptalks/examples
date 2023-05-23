const map = new maptalks.Map("map", {
  center: [108.9594, 34.2193],
  zoom: 17.8,
  pitch: 58.4,
  bearing: 0,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://resource.dvgis.cn/data/3dtiles/dayanta/tileset.json",
      ambientLight: [1, 1, 1],
      maximumScreenSpaceError: 1.0,
      pointOpacity: 0.5,
      pointSize: 3,
      heightOffset: -400,
    },
  ],
});

layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, {
    animation: false,
  });
});

const sceneConfig = {
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
    },
  },
};

const gltfLayer = new maptalks.GLTFLayer("gltf");
const gltfMarker = new maptalks.GLTFMarker([108.958438, 34.217715, 17.5], {
  symbol: {
    url: "{res}/gltf/character_x_bot/scene.gltf",
    rotationZ: 180,
    scaleX: 0.5,
    scaleY: 0.5,
    scaleZ: 0.5,
    animation: true,
    loop: true,
  },
}).addTo(gltfLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [layer, gltfLayer], {
  sceneConfig,
}).addTo(map);

const containerPoint = new maptalks.Point([map.width / 2, map.height / 2]);

/**start**/
const eventsMap = {
  w: moveForward,
  a: moveLeft,
  s: moveBack,
  d: moveRight,
  q: rotateLeft,
  e: rotateRight,
  "+": addZoom,
  "-": reduceZoom,
};

function getStep(fast) {
  return fast ? 10 : 3;
}

function addZoom() {
  map.setZoom(map.getZoom() + 0.5);
}

function reduceZoom() {
  map.setZoom(map.getZoom() - 0.5);
}

function moveLeft(fast) {
  const step = getStep(fast);
  map.setCenter(map.containerPointToCoord(containerPoint.add(-step, 0)));
}

function moveRight(fast) {
  const step = getStep(fast);
  map.setCenter(map.containerPointToCoord(containerPoint.add(step, 0)));
}

function moveForward(fast) {
  const step = getStep(fast);
  map.setCenter(map.containerPointToCoord(containerPoint.add(0, -step)));
}

function moveBack(fast) {
  const step = getStep(fast);
  map.setCenter(map.containerPointToCoord(containerPoint.add(0, step)));
}

function rotateLeft() {
  map.setBearing(map.getBearing() - 5);
}

function rotateRight() {
  map.setBearing(map.getBearing() + 5);
}

document.addEventListener("keydown", (e) => {
  console.log(e);
  const key = e.key.toLowerCase();
  if (eventsMap[key]) {
    eventsMap[key](e.shiftKey);
  }
});
/**end**/
