const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
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


/**start**/
const style = {
  style: [{
    //the style item name,Its value should be unique
    name: "building",
    filter: ["all", ["==", "$layer", "building"],
      ["==", "$type", "Polygon"]
    ],
    renderPlugin: {
      dataConfig: {
        type: "3d-extrusion",
        altitudeProperty: 'height',
        altitudeScale: 1
      },
      type: "lit"
    },
    symbol: {
      polygonOpacity: 1,
      material: {
        baseColorFactor: [0.2, 0.5, 0.7, 1]
      }
    }
  }]
};

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  : "preset-vt-3857",
  // debug: true,
  features: true,
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
    // console.log(data);
    // const feature = data[data.length - 1].data.feature;
    coordinate = data[data.length - 1].coordinate;
    // highLight(feature, vt);
    // console.log(feature);
  }
  addFeatureToLayer(coordinate);
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
layer.addTo(map);
/**end**/
