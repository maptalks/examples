const map = new maptalks.Map("map", {
  center: [94.50602824, 29.36774605, 3881],
  pitch: 44.1,
  bearing: 165.7,
  zoom: 12.8
});

// const token =
//   "pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNram9ybGI1ajExYjQyeGxlemppb2pwYjIifQ.LGy5UGNIsXUZdYMvfYRiAQ";
const token =
  "pk.eyJ1IjoiemhlbmZ1IiwiYSI6ImNsaTduNXM4ZjBtZnczbG1wbmNjenQ0OW8ifQ.UOkJDZYcC1zs9cXny6P8YQ";

/**start**/
const targetCoord = new maptalks.Coordinate(0, 0);
const POINT0 = new maptalks.Coordinate(0, 0);
const POINT1 = new maptalks.Coordinate(0, 0);

const layers = [
  new maptalks.TileLayer("base", {
    maxAvailableZoom: 20,
    spatialReference: {
      projection: "EPSG:3857"
    },
    urlTemplate: "http://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    subdomains: ["01", "02", "03", "04"],
    offset: function (z) {
      const center = map.getCenter();
      const c = maptalks.CRSTransform.transform(center.toArray(), "GCJ02", "WGS84");
      targetCoord.set(c[0], c[1]);
      const offset = map
        .coordToPoint(center, z, POINT0)
        ._sub(map.coordToPoint(targetCoord, z, POINT1));
      return offset._round().toArray();
    },
    attribution:
      '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
  })
];

const terrain = {
  type: "mapbox",
  tileSize: 256,
  urlTemplate: `https://{s}.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=${token}`,
  subdomains: ["a", "b", "c", "d"]
};

const lines = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [94.49872762429698, 29.419687853431952],
          [94.5017517325524, 29.41411114734828],
          [94.50278326399507, 29.40847932148145],
          [94.51319164855079, 29.405419569184318],
          [94.51929207097919, 29.39401914977836],
          [94.50668658457573, 29.382753862567796],
          [94.50593725736212, 29.3705326550988],
          [94.50093967073644, 29.35613686039855]
        ]
      }
    }
  ]
};

const lineStyle = [
  {
    filter: true,
    renderPlugin: {
      dataConfig: {
        awareOfTerrain: true,
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: "#ea6b48",
      lineWidth: 4
    }
  }
];

const vtLineLayer = new maptalks.GeoJSONVectorTileLayer("vt-line", {
  data: lines,
  style: lineStyle
});

layers.push(vtLineLayer);

const points = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "MultiPoint",
    coordinates: [
      [94.49872762429698, 29.419687853431952],
      [94.50093967073644, 29.35613686039855]
    ]
  }
};

const pointStyle = [
  {
    filter: true,
    renderPlugin: {
      dataConfig: {
        awareOfTerrain: true,
        type: "point"
      },
      sceneConfig: { collision: true },
      type: "icon"
    },
    symbol: {
      markerFile: "{res}/markers/site.svg",
      markerWidth: 24,
      markerHeight: 26
    }
  }
];

const vtPointLayer = new maptalks.GeoJSONVectorTileLayer("vt-point", {
  data: points,
  style: pointStyle
});

layers.push(vtPointLayer);

const group = new maptalks.GroupGLLayer("group", layers, {
  terrain
});
group.addTo(map);

function setTerrain(value) {
  if (value) {
    group.setTerrain(terrain);
  } else {
    group.setTerrain(null);
  }
}
/**end**/
