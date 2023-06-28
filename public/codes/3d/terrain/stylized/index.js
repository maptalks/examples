const map = new maptalks.Map("map", {
  center: [94.50812103, 29.45095163, 1469],
  zoom: 11,
  pitch: 60,
  lights: {
    directional: {
      direction: [0.5, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/446/front.jpg",
          back: "{res}/hdr/446/back.jpg",
          left: "{res}/hdr/446/left.jpg",
          right: "{res}/hdr/446/right.jpg",
          top: "{res}/hdr/446/top.jpg",
          bottom: "{res}/hdr/446/bottom.jpg"
        },
        prefilterCubeSize: 1024
      },
      exposure: 0.787,
      hsv: [0, 0, 0],
      orientation: 0
    }
  }
});

// const token =
//   "pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNram9ybGI1ajExYjQyeGxlemppb2pwYjIifQ.LGy5UGNIsXUZdYMvfYRiAQ";
const token =
  "pk.eyJ1IjoiemhlbmZ1IiwiYSI6ImNsaTduNXM4ZjBtZnczbG1wbmNjenQ0OW8ifQ.UOkJDZYcC1zs9cXny6P8YQ";

/**start**/
const layers = [
  new maptalks.VectorTileLayer("vt", {
    urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
    style: "{res}/styles/maptalks-common/style.json"
  })
];

const terrain = {
  type: "mapbox",
  tileSize: 256,
  urlTemplate: `https://{s}.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=${token}`,
  subdomains: ["a", "b", "c", "d"],
  shader: "lit",
  material: {
    baseColorFactor: [1, 1, 1, 1],
    outputSRGB: 1,
    roughnessFactor: 0.69,
    metallicFactor: 0
  }
};

const group = new maptalks.GroupGLLayer("group", layers, {
  terrain,
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.489
    }
  }
});
group.addTo(map);
/**end**/
