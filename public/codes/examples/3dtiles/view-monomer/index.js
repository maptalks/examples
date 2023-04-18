const map = new maptalks.Map("map", {
  center: [108.95965, 34.2189],
  zoom: 18,
  bearing: 0,
  pitch: 45,
  lights: {
    directional: { direction: [-1, -1, -1], color: [1, 1, 1] },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/923/front.jpg",
          back: "{res}/hdr/923/back.jpg",
          left: "{res}/hdr/923/left.jpg",
          right: "{res}/hdr/923/right.jpg",
          top: "{res}/hdr/923/top.jpg",
          bottom: "{res}/hdr/923/bottom.jpg",
        },
      },
      exposure: 1.426,
      hsv: [0, 0, 0],
      orientation: 302.553,
    }
  }
});

const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://examples.maptalks.com/samples/ifc/test1/tileset.json",
      ambientLight: [1, 1, 1],
      maximumScreenSpaceError: 1.0,
      heightOffset: -40,
    }
  ]
});
layer.once('loadtileset', e => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.915,
    },
    postProcess: {
      enable: true
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "lit",
      },
      symbol: {
        polygonOpacity: 1,
        material: {
          baseColorFactor: [0.48235, 0.48235, 0.48235, 1],
          hsv: [0, 0, -0.532],
          roughnessFactor: 0.22,
          metallicFactor: 0.58,
        }
      }
    }
  }
}).addTo(map);

/**start**/
let lastHit = null;
map.on('click', e => {
  console.log(111);
  if (lastHit) {
      layer.cancelHighlight(0, [lastHit]);
  }
  const hits = layer.identify(e.coordinate);
  if (hits.length) {
      layer.highlight({
          id: hits[0].data.batchId,
          color: '#f00',
          opacity: 0.6
      });  
      lastHit = hits[0].data.batchId;
    }
  });
/**end**/

//gui控件交互代码
const gui = new mt.GUI();

