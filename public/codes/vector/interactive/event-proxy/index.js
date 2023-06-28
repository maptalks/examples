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
      filter: true,
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
      filter: true,
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
    }
  ]
};


/**start**/
const style1 = {
  style: [
    {
      name: 'road-test',
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {},
        type: "line"
      },
      symbol: {
        lineColor: "#000",
        // lineOpacity: 1,
        lineWidth: 5
      }
    }
  ]
};


const geo = new maptalks.GeoJSONVectorTileLayer("geo", {
  data: "{res}/geojson/area.geojson",
  style,
  highLightColor: "red"
});

geo.on("dataload", (e) => {
  map.fitExtent(e.extent);
});

const geo1 = new maptalks.GeoJSONVectorTileLayer("geo1", {
  data: "{res}/geojson/line.geojson",
  style: style1,
  highLightColor: "green"
});
// Each layer can have its own processing logic function
function featureEventHandler(e) {
  const layer = e.target;
  const feature = e.feature;
  highLight(feature, layer, layer.options.highLightColor);
}

geo.on('identifyfeature', featureEventHandler)

geo1.on('identifyfeature', featureEventHandler)

const highLightKey = 'test';
function highLight(feature, layer, color = 'red') {
  layer.highlight([{ id: feature.id, name: highLightKey, color }]);
}

function cancel(layer) {
  layer.cancelHighlight([highLightKey]);
}

map.on('mousemove', e => {
  let feature;
  groupLayer.getLayers().map(layer => {
    return layer;
  }).reverse().forEach(layer => {
    cancel(layer);
    if (feature) {
      return;
    }
    const data = layer.identify(e.coordinate);
    if (!data || !data.length) {
      return;
    }
    feature = data[data.length - 1].data.feature;
    // Trigger Custom Event
    layer.fire('identifyfeature', Object.assign({}, e, { feature }));
  });
})


/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [geo, geo1], {
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