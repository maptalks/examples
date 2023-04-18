const map = new maptalks.Map("map", {
  center: [108.9594, 34.2193],
  zoom: 18,
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
  ground: {
    enable: false,
    renderPlugin: {
      type: "fill",
    },
    symbol: {
      polygonFill: [0, 0, 0, 1],
      polygonOpacity: 1,
    },
  },
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
    },
  },
};

const groupLayer = new maptalks.GroupGLLayer("group", [layer], {
  sceneConfig,
}).addTo(map);

/**start**/
map.setCameraMovements([
  {
    center: [108.9597677, 34.21900104],
    zoom: 18.5,
    bearing: -61.8,
    pitch: 53.6,
    timestamp: 0,
  },
  {
    center: [108.96004774, 34.2199875],
    zoom: 18,
    bearing: -153.6,
    pitch: 52.4,
    timestamp: 8000,
  },
  {
    center: [108.95965158, 34.22035338],
    zoom: 18,
    bearing: 114.6,
    pitch: 62,
    timestamp: 16000,
  },
]);
/**end**/
