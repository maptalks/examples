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


const geo = new maptalks.GeoJSONVectorTileLayer("geo", {
  data: "{res}/geojson/area.geojson",
  style
});

geo.on("dataload", (e) => {
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
  const data = geo.identify(e.coordinate);
  if (!data || !data.length) {
    cancel(geo);
    infoWindow.hide();
    return;
  }
  const feature = data[data.length - 1].data.feature;
  highLight(feature, geo);
  showInfoWindow(e.coordinate, feature);
  console.log(feature);
})


// 模拟获取要素的详细信息
// Simulate obtaining detailed information about elements
function getFeatureInfo(feature) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(feature);
    }, 1000 * Math.random() + 1000);
  })
}

function showInfoWindow(coordinate, feature) {
  infoWindow.setTitle('....');
  infoWindow.setContent(`<div class="loading"><img src="{res}/images/loading.awebp"/></div>`);
  infoWindow.show(coordinate);
  getFeatureInfo(feature).then(data => {
    infoWindow.setContent(JSON.stringify(data.properties));
    infoWindow.setTitle(data.properties.name);
  
  })
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