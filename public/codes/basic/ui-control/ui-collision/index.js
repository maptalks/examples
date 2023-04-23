const capitals = [
  {
    citycode: "010",
    adcode: "110000",
    name: "北京市",
    center: [116.407394, 39.904211],
  },
  {
    citycode: "023",
    adcode: "500000",
    name: "重庆市",
    center: [106.551643, 29.562849],
  },
  {
    citycode: "1853",
    adcode: "820000",
    name: "澳门特别行政区",
    center: [113.543028, 22.186835],
  },
  {
    adcode: "440000",
    name: "广东省",
    center: [113.26641, 23.132324],
  },
  {
    adcode: "350000",
    name: "福建省",
    center: [119.295143, 26.100779],
  },
  {
    adcode: "460000",
    name: "海南省",
    center: [110.349228, 20.017377],
  },
  {
    adcode: "140000",
    name: "山西省",
    center: [112.562678, 37.873499],
  },
  {
    citycode: "1886",
    adcode: "710000",
    name: "台湾省",
    center: [121.509062, 25.044332],
  },
  {
    adcode: "520000",
    name: "贵州省",
    center: [106.70546, 26.600055],
  },
  {
    adcode: "450000",
    name: "广西壮族自治区",
    center: [108.327546, 22.815478],
  },
  {
    adcode: "620000",
    name: "甘肃省",
    center: [103.826447, 36.05956],
  },
  {
    adcode: "410000",
    name: "河南省",
    center: [113.753394, 34.765869],
  },
  {
    adcode: "130000",
    name: "河北省",
    center: [114.530235, 38.037433],
  },
  {
    adcode: "340000",
    name: "安徽省",
    center: [117.329949, 31.733806],
  },
  {
    adcode: "430000",
    name: "湖南省",
    center: [112.9836, 28.112743],
  },
  {
    citycode: "021",
    adcode: "310000",
    name: "上海市",
    center: [121.473662, 31.230372],
  },
  {
    adcode: "420000",
    name: "湖北省",
    center: [114.341745, 30.546557],
  },
  {
    adcode: "230000",
    name: "黑龙江省",
    center: [126.661665, 45.742366],
  },
  {
    adcode: "150000",
    name: "内蒙古自治区",
    center: [111.76629, 40.81739],
  },
  {
    adcode: "640000",
    name: "宁夏回族自治区",
    center: [106.259126, 38.472641],
  },
  {
    adcode: "360000",
    name: "江西省",
    center: [115.81635, 28.63666],
  },
  {
    adcode: "320000",
    name: "江苏省",
    center: [118.762765, 32.060875],
  },
  {
    adcode: "220000",
    name: "吉林省",
    center: [125.32568, 43.897016],
  },
  {
    adcode: "210000",
    name: "辽宁省",
    center: [123.431382, 41.836175],
  },
  {
    adcode: "370000",
    name: "山东省",
    center: [117.019915, 36.671156],
  },
  {
    adcode: "650000",
    name: "新疆维吾尔自治区",
    center: [87.627704, 43.793026],
  },
  {
    citycode: "022",
    adcode: "120000",
    name: "天津市",
    center: [117.200983, 39.084158],
  },
  {
    adcode: "630000",
    name: "青海省",
    center: [101.780268, 36.620939],
  },
  {
    adcode: "610000",
    name: "陕西省",
    center: [108.954347, 34.265502],
  },
  {
    adcode: "540000",
    name: "西藏自治区",
    center: [91.117525, 29.647535],
  },
  {
    adcode: "510000",
    name: "四川省",
    center: [104.075809, 30.651239],
  },
  {
    citycode: "1852",
    adcode: "810000",
    name: "香港特别行政区",
    center: [114.171203, 22.277468],
  },
  {
    adcode: "530000",
    name: "云南省",
    center: [102.710002, 25.045806],
  },
  {
    adcode: "330000",
    name: "浙江省",
    center: [120.152585, 30.266597],
  },
];

const baseLayer = new maptalks.TileLayer("base", {
  urlTemplate: "{urlTemplate}",
  subdomains: ["a", "b", "c", "d"],
  attribution: "{attribution}",
});

const map = new maptalks.Map("map", {
  center: [100.63299495279648, 30.895363667711848],
  zoom: 3,
  pitch: 0,
  attribution: true,
  zoomControl: true,
  baseLayer: baseLayer,
});

const layer = new maptalks.VectorLayer("layer").addTo(map);

function createMarkerContent(name) {
  const div = document.createElement("div");
  div.className = "text_marker";
  div.innerHTML = name;
  return div;
}

function addMarkers() {
  // test UIMarker
  const uiMarkers = capitals.map(function (f, index) {
    const lnglat = f.center;
    return new maptalks.ui.UIMarker(lnglat, {
      collision: true,
      collisionBufferSize: 2,
      collisionWeight: 1,
      collisionFadeIn: true,
      content: createMarkerContent(f.name + "_" + index),
      verticalAlignment: "top",
      dy: -6,
    });
  });
  // test InfoWindow
  const markers = capitals.map((f) => {
    const lnglat = f.center;
    const marker = new maptalks.Marker(lnglat, {
      symbol: {
        markerType: "ellipse",
        markerWidth: 10,
        markerHeight: 10,
        markerFill: "red",
      },
    });
    marker.setInfoWindow({
      collision: true,
      collisionBufferSize: 2,
      collisionWeight: 2,
      collisionFadeIn: true,
      content: f.name,
    });
    return marker;
  });

  uiMarkers.forEach((marker) => {
    marker.addTo(map);
  });

  layer.addGeometry(markers);
  markers.slice(0, 1).forEach((marker) => {
    marker.openInfoWindow();
  });
}
addMarkers();
