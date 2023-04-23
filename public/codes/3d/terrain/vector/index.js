const map = new maptalks.Map("map", {
  center: [91.1853171915709, 29.665875376140576],
  zoom: 14,
  pitch: 0,
  bearing: 0.6000000000004775,
});

const targetCoord = new maptalks.Coordinate(0, 0);
const POINT0 = new maptalks.Coordinate(0, 0);
const POINT1 = new maptalks.Coordinate(0, 0);
const skinLayers = [
  new maptalks.TileLayer("base", {
    maxAvailableZoom: 20,
    spatialReference: {
      projection: "EPSG:3857",
    },
    offset: function (z) {
      const center = map.getCenter();
      const c = maptalks.CRSTransform.transform(
        center.toArray(),
        "GCJ02",
        "WGS84"
      );
      targetCoord.set(c[0], c[1]);
      const offset = map
        .coordToPoint(center, z, POINT0)
        ._sub(map.coordToPoint(targetCoord, z, POINT1));
      return offset._round().toArray();
    },
    urlTemplate:
      "http://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    subdomains: ["01", "02", "03", "04"],
    attribution:
      '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
  }),
];

const lines = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [91.1892104134887, 29.695188473915408],
          [91.14662913776169, 29.65404406477532],
        ],
      },
    },
  ],
};
const lineStyle = [
  {
    filter: true,
    renderPlugin: {
      dataConfig: {
        awareOfTerrain: true,
        type: "line",
      },
      sceneConfig: {},
      type: "line",
    },
    symbol: {
      lineColor: [1, 0, 0, 1],
      lineWidth: 12,
    },
  },
  {
    filter: true,
    renderPlugin: {
      type: "text",
      dataConfig: {
        awareOfTerrain: true,
        type: "point",
      },
    },
    symbol: {
      textName: "123",
      textSize: 28,
      textFill: "#000",
      textPlacement: "line",
    },
  },
];

const vtLayer = new maptalks.GeoJSONVectorTileLayer("vt", {
  data: lines,
  style: lineStyle,
});
skinLayers.push(vtLayer);

const lines0 = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [91.1942104134887, 29.695188473915408],
          [91.15062913776169, 29.65404406477532],
        ],
      },
    },
  ],
};
const lineStyle0 = [
  {
    filter: true,
    renderPlugin: {
      dataConfig: {
        awareOfTerrain: true,
        type: "line",
      },
      sceneConfig: {
        collision: false,
      },
      type: "line",
    },
    symbol: {
      lineColor: [0, 1, 0, 1],
      lineWidth: 12,
    },
  },
  {
    filter: true,
    renderPlugin: {
      type: "text",
      dataConfig: {
        awareOfTerrain: true,
        type: "point",
      },
    },
    symbol: {
      textName: "123",
      textSize: 28,
      textFill: "#000",
      textPlacement: "line",
      textPitchAlignment: "map",
    },
  },
];

const vtLayer0 = new maptalks.GeoJSONVectorTileLayer("vt0", {
  data: lines0,
  style: lineStyle0,
});
skinLayers.push(vtLayer0);

const gradientLines = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [91.1852104134887, 29.695188473915408],
          [91.14262913776169, 29.65404406477532],
        ],
      },
      properties: {
        gradients: [0, "red", 0.7, "yellow", 1, "green"],
      },
    },
  ],
};
const gradientStyle = [
  {
    filter: true,
    renderPlugin: {
      type: "line-gradient",
      dataConfig: {
        awareOfTerrain: true,
        type: "line",
      },
      sceneConfig: {},
    },
    symbol: {
      lineOpacity: 0.7,
      lineWidth: 14,
      lineColor: "#f00",
      lineGradientProperty: "gradients",
    },
  },
];

const vtLayer1 = new maptalks.GeoJSONVectorTileLayer("vt1", {
  data: gradientLines,
  style: gradientStyle,
});
skinLayers.push(vtLayer1);

const points = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [91.19896282624476, 29.693997570067694],
      },
    },
  ],
};

const vtLayer2 = new maptalks.GeoJSONVectorTileLayer("vt2", {
  data: points,
  style: [
    {
      filter: true,
      renderPlugin: {
        type: "icon",
        dataConfig: {
          awareOfTerrain: true,
          type: "point",
        },
      },
      symbol: {
        markerType: "ellipse",
        markerWidth: 20,
        markerHeight: 20,
      },
    },
    {
      filter: true,
      renderPlugin: {
        type: "text",
        dataConfig: {
          awareOfTerrain: true,
          type: "point",
        },
        sceneConfig: {
          collision: false,
        },
      },
      symbol: {
        textName: "hello",
        textSize: 30,
      },
    },
  ],
});
skinLayers.push(vtLayer2);

const textPoints = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [91.20896282624476, 29.693997570067694],
      },
    },
  ],
};

const vtLayer2b = new maptalks.GeoJSONVectorTileLayer("vt2b", {
  data: textPoints,
  style: [
    {
      filter: true,
      renderPlugin: {
        type: "icon",
        dataConfig: {
          awareOfTerrain: true,
          type: "point",
        },
      },
      symbol: {
        markerType: "ellipse",
        markerWidth: 20,
        markerHeight: 20,
        markerPitchAlignment: "map",
      },
    },
    {
      filter: true,
      renderPlugin: {
        type: "text",
        dataConfig: {
          awareOfTerrain: true,
          type: "point",
        },
        sceneConfig: {
          collision: false,
        },
      },
      symbol: {
        textName: "hello",
        textSize: 30,
        textPitchAlignment: "map",
      },
    },
  ],
});
skinLayers.push(vtLayer2b);

const nativePoints = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [91.19754359779995, 29.683252717173133, 0],
      },
    },
  ],
};

const vtLayer3 = new maptalks.GeoJSONVectorTileLayer("vt3", {
  data: nativePoints,
  style: [
    {
      filter: true,
      renderPlugin: {
        type: "native-point",
        dataConfig: {
          awareOfTerrain: true,
          type: "native-point",
        },
      },
      symbol: {
        markerType: "circle",
        markerSize: 20,
        markerFill: "#f00",
      },
    },
  ],
});
skinLayers.push(vtLayer3);

const nativeLines = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [91.17803953688178, 29.680421429485165],
          [91.20333959078584, 29.666329237756628],
        ],
      },
    },
  ],
};

const vtLayer4 = new maptalks.GeoJSONVectorTileLayer("vt4", {
  data: nativeLines,
  style: [
    {
      filter: true,
      renderPlugin: {
        type: "native-line",
        dataConfig: {
          awareOfTerrain: true,
          type: "native-line",
        },
        sceneConfig: {},
      },
      symbol: {
        lineColor: "#0f0",
      },
    },
  ],
});
skinLayers.push(vtLayer4);

const fillData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [91.1902629480669, 29.68669458816092, 0],
            [91.18950170037192, 29.6734779581395, 0],
            [91.20665660876432, 29.669884944765244, 0],
            [91.20667103460687, 29.685350030132867, 0],
            [91.1902629480669, 29.68669458816092, 0],
          ],
        ],
      },
    },
  ],
};
const vtLayer5 = new maptalks.GeoJSONVectorTileLayer("vt5", {
  data: fillData,
  style: [
    {
      filter: true,
      renderPlugin: {
        type: "fill",
        dataConfig: {
          awareOfTerrain: true,
          type: "fill",
        },
        sceneConfig: {},
      },
      symbol: {
        polygonFill: "#00f",
        polygonOpacity: 0.6,
      },
    },
  ],
});
skinLayers.push(vtLayer5);

/**start**/
const terrain = {
  type: "mapbox",
  tileSize: 256,
  terrainWidth: 257,
  maxAvailableZoom: 14,

  urlTemplate:
    "https://{s}.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNram9ybGI1ajExYjQyeGxlemppb2pwYjIifQ.LGy5UGNIsXUZdYMvfYRiAQ",
  subdomains: ["a", "b", "c", "d"],
};
const group = new maptalks.GroupGLLayer("group", skinLayers, {
  terrain,
});

group.addTo(map);
/**end**/
