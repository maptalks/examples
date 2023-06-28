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
const style = [
  {
    // Only data with building layer and Polygon type are displayed
    // Please refer to the specific description of filter:http://doc.maptalks.com/docs/style/filter/feature-filter/
    filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      dataConfig: {
        type: "fill"
      },
      type: "fill"
    },
    symbol: {
      polygonFill: "#577570"
    }
  }
];

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  debug: true,
  features: true,
  pickingGeometry: true,
  style
});

vt.on("dataload", (e) => {
  map.fitExtent(e.extent);
});

const highLightKey = "test";
function highLight(feature, layer) {
  layer.highlight([{ id: feature.id, name: highLightKey, color: "red" }]);
}

function cancel(layer) {
  layer.cancelHighlight([highLightKey]);
}

map.on("mousemove", (e) => {
  const data = vt.identify(e.coordinate);
  if (!data || !data.length) {
    // cancel(vt);
    layer.clear();
    return;
  }
  console.log(data);
  const feature = data[data.length - 1].data.feature;
  // highLight(feature, vt);
  addFeatureToLayer(feature);
  console.log(feature);
});

function addFeatureToLayer(feature) {
  layer.clear();
  const geometry = feature.geometry;
  if (!geometry || !geometry.type || !geometry.coordinates) {
    return;
  }
  const polygon = new maptalks[geometry.type](geometry.coordinates, {
    symbol: {
      polygonOpacity: 0,
      lineColor: "yellow",
      lineWidth: 3,
      shadowColor: "#fff",
      shadowBlur: 10
    }
  });
  polygon.addTo(layer);
}

const layer = new maptalks.VectorLayer("layer");

/**end**/

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
