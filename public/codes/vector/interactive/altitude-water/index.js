const map = new maptalks.Map("map", {
  center: [-74.02009372824807, 40.699368339089375],
  zoom: 17,
  pitch: 60,
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
map.on('click', e => {
  console.log(e.coordinate.toArray());
})


/**start**/
const style = {
  style: [{
    name: 'water',
    filter: ["all", ["==", "$layer", "water"],
      ["==", "$type", "Polygon"]
    ],
    renderPlugin: {
      dataConfig: {
        type: "fill"
      },
      sceneConfig: {},
      type: "water"
    },
    symbol: {
      ssr: true,
      texWaveNormal: "{res}/textures/texWaveNormal.png",
      texWavePerturbation: "{res}/textures/texWavePerturbation.png",
      waterBaseColor: [0.611764705882353, 0.7529411764705882, 0.9764705882352941, 1],
      contrast: 1.425,
      hsv: [0, -0.596, 0],
      uvScale: 3,
      animation: true,
      waterSpeed: 1,
      waterDirection: 0
    }
  },
  {
    name: 'building-top',
    filter: ["all", ["==", "$layer", "building"],
      ["==", "$type", "Polygon"]
    ],
    renderPlugin: {
      dataConfig: {
        type: "3d-extrusion",
        altitudeProperty: "height",
        minHeightProperty: "min_height",
        altitudeScale: 1,
        defaultAltitude: 10,
        topThickness: 10,
        top: true,
        side: false
      },
      sceneConfig: {},
      type: "lit"
    },
    symbol: {
      material: {
        baseColorFactor: [0.8549019607843137, 0.8588235294117647, 0.8588235294117647, 1],
        outputSRGB: 1,
        roughnessFactor: 0.18,
        metallicFactor: 0.72
      }
    }
  },
  {
    name: 'building-side',
    filter: ["all", ["==", "$layer", "building"],
      ["==", "$type", "Polygon"]
    ],
    renderPlugin: {
      dataConfig: {
        type: "3d-extrusion",
        altitudeProperty: "height",
        minHeightProperty: "min_height",
        altitudeScale: 1,
        defaultAltitude: 10,
        topThickness: 10,
        top: false,
        side: true
      },
      type: "lit"
    },
    symbol: {
      material: {
        baseColorFactor: [0.8549019607843137, 0.8588235294117647, 0.8588235294117647, 1],
        hsv: [0.128, -0.489, 0],
        outputSRGB: 1,
        roughnessFactor: 0.32,
        metallicFactor: 0.66,
        uvScale: [0.14, 0.43],
        uvOffset: [0, 0.65],
        emissiveTexture: "{res}/textures/em.png",
        emitColorFactor: 1.8,
        emitMultiplicative: 0
      }
    }
  },

  ]
};

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  // debug: true,
  // features: true,
  pickingGeometry: true,
  style
});

vt.on("dataload", (e) => {
  map.fitExtent(e.extent);
});

const highLightKey = 'test';
function highLight(feature, layer) {
  layer.highlight([{ id: feature.id, name: highLightKey, color: 'red' }]);
}

function cancel(layer) {
  layer.cancelHighlight([highLightKey]);
}

map.on('click', e => {
  const data = vt.identify(e.coordinate);
  let coordinate = e.coordinate;
  if (!data || !data.length) {
    // cancel(vt);
  } else {
    // const feature = data[data.length - 1].data.feature;
    const item = data[data.length - 1];
    if (item.type !== 'water') {
      console.log('pick data is not water');
      return;
    }
    coordinate = item.coordinate;
    addFeatureToLayer(coordinate);
  }

})

function addFeatureToLayer(coordinate) {
  if (!coordinate) {
    return;
  }
  const point = new maptalks.Marker(coordinate, {
    symbol: {
      textName: coordinate.z || coordinate[2] || 0,
      textSize: 12,
      textHaloFill: '#000',
      textFill: "#fff",
      textHaloRadius: 1
    }
  });
  point.addTo(layer);
}

const layer = new maptalks.VectorLayer('layer', {
  enableAltitude: true,        // enable altitude
});


const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  // 需要先开启后处理中的ssr属性
  sceneConfig: {
    environment: {
      enable: true,
      mode: 0,
      level: 2,
      brightness: 0
    },
    shadow: {
      type: "esm",
      enable: true,
      quality: "high",
      opacity: 0.5,
      color: [0, 0, 0],
      blurOffset: 1
    },
    postProcess: {
      enable: true,
      antialias: {
        enable: true
      },
      ssr: {
        enable: true
      },
      sharpen: {
        enable: true,
        factor: 0.3
      }
    },
    ground: {
      enable: false,
      renderPlugin: {
        type: "lit"
      },
      symbol: {
        polygonFill: [0.54, 0.54, 0.54, 1],
        material: {
          baseColorFactor: [0.13333333, 0.13333333, 0.13333333, 1]
        }
      }
    }
  }
});
groupLayer.addTo(map);
layer.addTo(map);
/**end**/