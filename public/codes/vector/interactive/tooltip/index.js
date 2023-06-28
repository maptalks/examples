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
  layer.highlight([{ id: feature.id, plugin: 'area-fill', name: highLightKey, color: 'red' }]);
}

function cancel(layer) {
  layer.cancelHighlight([highLightKey]);
}

map.on('mousemove', e => {
  const data = geo.identify(e.coordinate);
  if (!data || !data.length) {
    cancel(geo);
    uiMarker.remove();
    return;
  }
  const feature = data[data.length - 1].data.feature;
  highLight(feature, geo);
  showInfo(e.coordinate, feature);
  // console.log(data[0]);
})

function getMarkerContent(feature) {
  return `<div class="marker-info">${feature.properties.name}</div>`;
}


function showInfo(coordinate, feature) {
  if (!uiMarker.getMap()) {
    uiMarker.addTo(map);
  }
  uiMarker.setContent(getMarkerContent(feature));
  uiMarker.setCoordinates(coordinate);
}
var uiMarker = new maptalks.ui.UIMarker(map.getCenter(), {
  content: '<div class="text_marker">maptalks</div>',
  dy: 30
});


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