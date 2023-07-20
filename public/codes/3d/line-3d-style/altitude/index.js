const map = new maptalks.Map("map", {
  center: [-73.98903845348661, 40.72259059625898],
  zoom: 17.8,
  bearing: -54,
  pitch: 20.8,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/gradient/front.png",
          back: "{res}/hdr/gradient/back.png",
          left: "{res}/hdr/gradient/left.png",
          right: "{res}/hdr/gradient/right.png",
          top: "{res}/hdr/gradient/top.png",
          bottom: "{res}/hdr/gradient/bottom.png"
        },
        prefilterCubeSize: 32
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0
    }
  }
});

/**start**/


const style = {
  style: [
    {
      name: 'building-test',
      filter: ["all", ["==", "$type", "Polygon"]
      ],
      renderPlugin: {
        type: "lit",
        dataConfig: {
          type: "3d-extrusion",
          altitudeProperty: "height",
          minHeightProperty: "min_height",
          altitudeScale: 1,
          defaultAltitude: 10,
          topThickness: 0,
          top: true,
          side: true
        },
        sceneConfig: {}
      },
      symbol: {
        material: {
          baseColorFactor: [1, 1, 1, 1],
          roughnessFactor: 1,
          metallicFactor: 1
        }
      }
    },
    {
      name: 'bridge-test',
      filter: ["all", ["==", "$type", "LineString"]
      ],
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {
          depthFunc: '<=',
          depthMask: true
        },
        type: "line"
      },

      symbol: {
        lineColor: [1, 1, 1, 1],
        linePatternFile: "{res}/patterns/road1.jpg",
        lineWidth: {
          type: "exponential",
          default: 2,
          stops: [
            [14, 1],
            [15, 4],
            [16, 8],
            [17, 15],
            [18, 22],
            [20, 35]
          ]
        }
      }
    },
    {
      name: 'sprite-test',
      filter: ["all", ["==", "$type", "Point"]
      ],
      renderPlugin: {
        dataConfig: {
          type: "point"
        },
        sceneConfig: {
          depthMask: true,
          depthFunc: '<=',
        },
        type: "icon"
      },

      symbol: {
        markerType: 'ellipse',
        markerWidth: 10,
        markerHeight: 10,
        markerDy: -2
      }
    }
  ]
};

const geovtLayer = new maptalks.GeoJSONVectorTileLayer("geo", {
  data: "{res}/geojson/bridge.geojson",
  features: true,
  pickingGeometry: true,
  style
});

geovtLayer.on("dataload", (e) => {
  map.fitExtent(e.extent);
});

map.on('click', e => {
  const result = geovtLayer.identify(e.coordinate);
  const len = result.length;
  if (!len) {
    return;
  }
  console.log(result);
  showInfoWindow(result[len - 1]);

});

function showInfoWindow(item) {
  const { coordinate, data } = item;

  infoWindow.setTitle(`feature.id=${data.feature.id}`);
  const content = JSON.stringify((data.feature || {}).properties);
  // console.log(content);
  infoWindow.setContent(content);
  infoWindow.show(new maptalks.Coordinate(coordinate));
}


var options = {
  'title': 'Map\' InfoWindow',
  'content': 'Click on map to reopen',

  // 'autoPan': true,
  // 'width': 300,
  // 'minHeight': 120,
  // 'custom': false,
  'autoOpenOn': null,  //set to null if not to open window when clicking on map
  //'autoCloseOn' : 'click'
};
var infoWindow = new maptalks.ui.InfoWindow(options);
infoWindow.addTo(map);

/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [geovtLayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0
    },
    shadow: {
      type: "esm",
      enable: true,
      quality: "high",
      opacity: 0.11,
      color: [0, 0, 0],
      blurOffset: 1
    },
    postProcess: {
      enable: true,
      antialias: {
        enable: true,
        taa: true,
        jitterRatio: 0.25
      },
      ssr: {
        enable: true
      },
      bloom: {
        enable: true,
        threshold: 0,
        factor: 0.2,
        radius: 0.105
      },
      ssao: {
        enable: true,
        bias: 0.08,
        radius: 0.08,
        intensity: 1.5
      },
      sharpen: {
        enable: false,
        factor: 0.2
      }
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill"
      },
      symbol: {
        polygonFill: [1, 1, 1, 1]
      }
    }
  }
});
groupLayer.addTo(map);
