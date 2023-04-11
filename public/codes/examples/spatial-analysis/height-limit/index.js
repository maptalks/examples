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
          bottom: "{res}/hdr/923/bottom.jpg",
        },
      },
      exposure: 1,
      hsv: [0, 0, 0],
      orientation: 302.553,
    },
  },
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

const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 1,
      brightness: 1,
    },
    shadow: {
      enable: true,
      opacity: 0.5,
      color: [0, 0, 0],
    },
    postProcess: {
      enable: true,
      antialias: {
        enable: true,
      },
      ssr: {
        enable: true,
      },
      bloom: {
        enable: true,
      },
      outline: {
        enable: true,
      },
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
        },
      },
    },
  },
}).addTo(map);

layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
});

/**start**/
const heightLimitAnalysis = new maptalks.HeightLimitAnalysis({
  limitHeight: 25,
  limitColor: [1, 0.2, 0.2],
});
heightLimitAnalysis.addTo(groupGLLayer);

const vlayer = new maptalks.VectorLayer("vector", {
  enableAltitude: true,
}).addTo(map);

let altitudes = [],
  coordinates = [],
  first = true;
const drawTool = new maptalks.DrawTool({
  mode: "LineString",
  enableAltitude: true,
  symbol: {
    lineColor: "#f00",
  },
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
    altitude: altitudes,
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
    altitude: altitudes,
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
    altitude: altitudes,
  });
  e.geometry.setCoordinates(coordinates);
  first = true;
});

drawTool.on("drawend", function (param) {
  vlayer.clear();
  const geometry = param.geometry;
  coordinates.push(coordinates[0]);
  altitudes.push(altitudes[0]);
  new maptalks.LineString(coordinates, {
    symbol: {
      lineColor: "#f00",
    },
    properties: {
      altitude: altitudes,
    },
  }).addTo(vlayer);
  heightLimitAnalysis.update("boundary", coordinates);
  coordinates = [];
  altitudes = [];
});

function getPickedCoordinate(coordinate) {
  const identifyData = groupLayer.identify(coordinate)[0];
  const pickedPoint = identifyData && identifyData.point;
  if (pickedPoint) {
    const altitude = map.pointAtResToAltitude(pickedPoint[2], map.getGLRes());
    const coordinate = map.pointAtResToCoordinate(
      new maptalks.Point(pickedPoint[0], pickedPoint[1]),
      map.getGLRes()
    );
    return new maptalks.Coordinate(coordinate.x, coordinate.y, altitude);
  } else {
    return coordinate;
  }
}

const gui = new dat.GUI({
  width: 250,
});
const Config = function () {
  this.limitColor = "#ea6b48";
  this.limitHeight = 25;
};
const options = new Config();

const limitColorController = gui
  .addColor(options, "limitColor")
  .name("限高（米）");
limitColorController.onChange(function (value) {
  heightLimitAnalysis.update("limitColor", [
    value[0] / 255,
    value[1] / 255,
    value[2] / 255,
  ]);
});
const limitHeightController = gui
  .add(options, "limitHeight", 0, 100)
  .name("颜色");
limitHeightController.onChange(function (value) {
  heightLimitAnalysis.update("limitHeight", value);
});
/**end**/
