const map = new maptalks.Map("map", {
  center: [108.9605239272878, 34.21955775963946],
  zoom: 12,
  pitch: 45,
  lights: {
    directional: { direction: [0, 0, 0], color: [1, 1, 1] },
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
      exposure: 1,
      hsv: [0, 0, 0],
      orientation: 302.553,
    },
  },
});

const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://resource.dvgis.cn/data/3dtiles/dayanta/tileset.json",
      ambientLight: [1, 1, 1],
      maximumScreenSpaceError: 1.0,
      pointOpacity: 0.5,
      pointSize: 3,
      heightOffset: -400,
    },
  ],
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 1,
      brightness: 1,
    },
    shadow: {
      enable: true,
      opacity: 1,
      color: [0, 0, 0],
    },
    postProcess: {
      enable: true,
      antialias: {
        enable: true,
      },
      ssr: {
        enable: true,
      },
      bloom: {
        enable: true,
      },
      outline: {
        enable: true,
      },
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
        },
      },
    },
  },
}).addTo(map);

layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
});

const position = map.getCenter();

//日照分析相关代码
$("#datepicker").datepicker();
$("#slider").slider();
$("#slider").slider({
  max: 1440,
  min: 0,
  slide: function (event, ui) {
    const currentDate = $("#datepicker").datepicker("getDate");
    if (!currentDate) {
      alert("请选择日期");
    }
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const value = ui.value;
    const hours = value / 60;
    const minitues = value % 60;
    //根据时间计算太阳位置,参考https://github.com/mourner/suncalc
    const { altitude, azimuth } = SunCalc.getPosition(
      new Date(year, month, day, hours, minitues),
      position.y,
      position.x
    );
    document.getElementById("hours").innerText = hours.toFixed(2) + "时";
    document.getElementById("minitues").innerText = minitues.toFixed(2) + "分";
    let lightDirection = null;
    if (altitude < 0) {
      lightDirection = [0, 0, 0];
    } else if (azimuth < 0) {
      lightDirection = [
        -1,
        -1 / Math.tan(azimuth),
        -Math.sqrt(1 + Math.pow(1 / Math.tan(azimuth), 2)) * Math.tan(altitude),
      ];
    } else {
      lightDirection = [
        1,
        1 / Math.tan(azimuth),
        -Math.sqrt(1 + Math.pow(1 / Math.tan(azimuth), 2)) * Math.tan(altitude),
      ];
    }
    if (lightDirection) {
      const lightConfig = map.getLights();
      lightConfig.directional.direction = lightDirection;
      map.setLights(lightConfig);
    }
  },
});
