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

const geo = new maptalks.GeoJSONVectorTileLayer("geo", {
  data: "{res}/geojson/area.geojson",
  style
});

geo.on("dataload", (e) => {
  console.log(e);
  map.fitExtent(e.extent);
  highLight(geo);
});

const params = {
  color: '#2e7e57',
  bloom: false,
  lineColor: '#000',
  opacity: 1

}
const highArea = '新洲区';

function getHighLightKey(key) {
  return `${highArea}_${key}`;
}


function highLight(layer) {
  layer.highlight([
    {
      name: getHighLightKey('fill'),
      filter: (feature) => {
        return feature.properties.name.includes('江');
      },
      ...params,
    },
    // {
    //   name: getHighLightKey('border'),
    //   id:12,
    //   ...params,
    //   color: highParams.lineColor
    // }
  ]);
}

function cancel() {
  geo.cancelHighlight([getHighLightKey('fill'), getHighLightKey('border')]);
}

function update() {
  highLight(geo);
}
const groupLayer = new maptalks.GroupGLLayer("group", [geo], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0
    },
    postProcess: {
      enable: true,
      bloom: {
        enable: true,
        threshold: 0,
        factor: 0.6,
        radius: 1,
      },
    }
  }
});
groupLayer.addTo(map);

const gui = new mt.GUI();
gui
  .add({
    type: "color",
    label: "颜色",
    value: params.color
  })
  .onChange((value) => {
    params.color = value;
    update();
  });
gui
  .add({
    type: "color",
    label: "边框颜色",
    value: params.lineColor
  })
  .onChange((value) => {
    params.lineColor = value;
    update();
  });
gui
  .add({
    type: "slider",
    label: "透明度",
    value: params.opacity,
    min: 0,
    max: 1,
    step: 0.1
  })
  .onChange((value) => {
    params.opacity = value;
    update();
  });
gui
  .add({
    type: "checkbox",
    label: "bloom",
    value: params.bloom,
  })
  .onChange((value) => {
    params.bloom = value;
    update();
  });
  /**end**/
