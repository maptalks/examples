const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      resource: {
        // url: {
        //   front: "{res}/hdr/gradient/front.png",
        //   back: "{res}/hdr/gradient/back.png",
        //   left: "{res}/hdr/gradient/left.png",
        //   right: "{res}/hdr/gradient/right.png",
        //   top: "{res}/hdr/gradient/top.png",
        //   bottom: "{res}/hdr/gradient/bottom.png"
        // },
        prefilterCubeSize: 1024
      },
      hsv: [0, 0.34, 0],
      orientation: 0
    }
  }
});


/**start**/
const style = {
  style: [
    {
      name: 'area-fill',
      filter: ["all", ["==", "layerName", "area"],
        ["==", "$type", "Polygon"]
      ],
      renderPlugin: {
        dataConfig: {
          type: "fill"
        },
        sceneConfig: {},
        type: "fill"
      },
      symbol: {
        polygonFill: "#996247",
        polygonOpacity: 1
      }
    },
    {
      name: 'area-border',
      filter: ["all", ["==", "layerName", "area"],
        ["==", "$type", "Polygon"]
      ],
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {},
        type: "line"
      },
      symbol: {
        lineColor: "#E2E2E2",
        lineOpacity: 1,
        lineWidth: 2
      }
    },
    {
      name: 'huanggang-fill',
      filter: ["all", ["==", "layerName", "huanggang"],
        ["==", "$type", "Polygon"]
      ],
      renderPlugin: {
        dataConfig: {
          type: "fill"
        },
        sceneConfig: {},
        type: "fill"
      },
      symbol: {
        polygonFill: "green",
        polygonOpacity: 1
      }
    },
    {
      name: 'huanggang-border',
      filter: ["all", ["==", "layerName", "huanggang"],
        ["==", "$type", "Polygon"]
      ],
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {},
        type: "line"
      },
      symbol: {
        lineColor: "#000",
        lineOpacity: 1,
        lineWidth: 2
      }
    },
    {
      name: 'road',
      filter: ["all", ["==", "layerName", "line"],
        ["==", "$type", "LineString"]
      ],
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {},
        type: "line"
      },
      symbol: {
        lineColor: "#000",
        lineOpacity: 1,
        lineWidth: 4
      }
    }
  ]
};


function getGeoJSON(fileName) {
  return fetch(`{res}/geojson/${fileName}.geojson`).then(res => res.json());
}
// Merging multiple geojsons onto the same layer will have better performance.
//  If there are multiple layers in the business, it is best to merge them as much as possible
function mergeGeoJSON() {
  const fileNames = ['area', 'huanggang', 'line'];
  const fetchs = fileNames.map(fileName => {
    return getGeoJSON(fileName);
  });

  Promise.all(fetchs).then(geojsons => {
    const data = [];
    geojsons.forEach((d, index) => {
      data[index] = {
        layerName: fileNames[index],
        features: d.features
      }
    });
    let id = 1;
    data.forEach(d => {
      const { layerName, features } = d;
      features.forEach(f => {
        f.properties.layerName = layerName;
        f.properties.subFeatureIndex = id;
        id++;
        geojson.features.push(f);
      });
    });
    console.log(geojson);
    geo.setData(geojson);
  })

}

const geojson = {
  type: "FeatureCollection",
  features: []
}
const geo = new maptalks.GeoJSONVectorTileLayer("geo", {
  data: geojson,
  style
});
let mergeData = false;
geo.on("dataload", (e) => {
  map.fitExtent(e.extent);
  if (!mergeData) {
    mergeData = true;
    mergeGeoJSON();
  }
});

const highLightKey = 'test';
function highLight(feature, layer) {
  layer.highlight([{ id: feature.id, name: highLightKey, color: 'red' }]);
}

function cancel(layer) {
  layer.cancelHighlight([highLightKey]);
}

map.on('mousemove', e => {
  const data = geo.identify(e.coordinate);
  if (!data || !data.length) {
    cancel(geo);
    return;
  }
  const feature = data[data.length - 1].data.feature;
  highLight(feature, geo);
  console.log(feature);
})


/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [geo], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0
    }
  }
});
groupLayer.addTo(map);