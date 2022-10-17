const map = new maptalks.Map("map", {
  center: [120.25309501242282, 30.231192256436856],
  zoom: 16,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const lights = {
  ambient: {
    color: [0.2, 0.2, 0.2],
    exposure: 1.5,
  },
  directional: {
    color: [0.3, 0.3, 0.3],
    direction: [1, 0, -1],
  },
};

map.setLights(lights);

const style = {
  style: [
    {
      filter: true,
      renderPlugin: {
        dataConfig: {
          // round-tube为圆形管
          // square-tube为方形管
          type: "round-tube",

          // type为round-tube时生效
          // 圆的分片数量，默认为8
          radialSegments: 16,

          // lineWidth和lineHeight 的尺寸单位
          // meter 或者 cm 或者 mm,默认是m（即米）
          metric: "cm",
        },
        sceneConfig: {},
        type: "tube",
      },
      symbol: {
        // 管线颜色，支持function-type
        // 支持的颜色类型与line渲染插件中lineColor相同
        lineColor: [0.56, 0.75, 0.13, 1],

        // 管线尺寸
        // 对于round-tube，是指的直径，单位由 dataConfig.metric 指定
        // 对于square-tube，是指宽度，单位由 dataConfig.metric 指定
        // 支持function-type
        lineWidth: {
          type: "identity",
          property: "断面尺寸",
        },

        // 管线高度
        // 只有dataConfig.type为square-tube时生效
        // 单位由 dataConfig.metric 指定
        // 支持 function-type
        // lineHeight: 6,

        // 管线的模式填充图片
        // 支持 function-type
        // linePatternFile: 'arrow.png',

        // 模式填充图片的缩放比例，序号0的值表示纵向的缩放比例，序号1的值表示横向的缩放比例
        // 不支持function-type
        // uvScale: [2, 2]

        // 填充动画，0时没有动画，正值和负值代表动画的不同方向
        // 支持function-type
        // linePatternAnimSpeed: 1,

        // 纹理填充间隔，值为纹理宽度的倍数，例如1表示纹理之间间隔1个纹理宽度
        // 支持function-type
        // linePatternGap: 0,

        // 金属度，与粗糙度一起模拟各种不同材质
        // 0表示非金属，1表示金属
        // 不支持function-type
        metallicFactor: 1,

        // 粗糙度
        // 0表示绝对光滑，1表示绝对粗糙
        // 不支持function-type
        roughnessFactor: 0.3,
      },
    },
  ],
};

const vt = new maptalks.GeoJSONVectorTileLayer("vt", {
  data: "{res}/geojson/tube.geojson",
  style,
});

const sceneConfig = {
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
      taa: true,
    },
  },
};
const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  antialias: false,
  sceneConfig,
});
groupLayer.addTo(map);
