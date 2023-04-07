const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const options = {
  animation: true,
  // 默认颜色
  color: ["Red", "Blue", "Green", "Yellow"],
  // 默认字体
  font: "30px san-serif",
};

class HelloLayer extends maptalks.Layer {
  // 构造函数
  constructor(id, data, options) {
    super(id, options);
    this.data = data;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  getData() {
    return this.data;
  }
}

// 定义默认的图层配置属性
HelloLayer.mergeOptions(options);

class HelloLayerRenderer extends maptalks.renderer.CanvasRenderer {
  checkResources() {
    // HelloLayer只是绘制文字, 没有外部图片, 所以返回空数组
    return [];
  }

  draw() {
    const colors = this.layer.options.color;
    const now = Date.now();
    const rndIdx = Math.round((now / 300) % colors.length),
      color = colors[rndIdx];
    const drawn = this._drawData(this.layer.getData(), color);
    this._drawnData = drawn;
    this.completeRender();
  }

  drawOnInteracting(evtParam) {
    if (!this._drawnData || this._drawnData.length === 0) {
      return;
    }
    const colors = this.layer.options.color;
    const now = Date.now();
    const rndIdx = Math.round((now / 300) % colors.length),
      color = colors[rndIdx];
    this._drawData(this._drawnData, color);
  }

  // drawOnIntearcting被略过时的回调函数
  onSkipDrawOnInteracting() {}

  //当animation为true时是动画图层, 返回true
  needToRedraw() {
    if (this.layer.options["animation"]) {
      return true;
    }
    return super.needToRedraw();
  }

  _drawData(data, color) {
    if (!Array.isArray(data)) {
      return;
    }
    const map = this.getMap();
    // prepareCanvas是父类CanvasRenderer中的方法
    // 用于准备canvas画布
    // 如果canvas不存在时, 则创建它
    // 如果canvas已存在, 则清空画布
    this.prepareCanvas();
    // this.context是渲染器canvas的CanvasRenderingContext2D
    const ctx = this.context;
    // 设置样式
    ctx.fillStyle = color;
    ctx.font = this.layer.options["font"];

    const containerExtent = map.getContainerExtent();
    const drawn = [];
    data.forEach((d) => {
      // 将中心点经纬度坐标转化为containerPoint
      // containerPoint是指相对地图容器左上角的像素坐标.
      const point = map.coordinateToContainerPoint(
        new maptalks.Coordinate(d.coord)
      );
      // 如果绘制的点不在屏幕范围内, 则不做绘制以提高性能
      if (!containerExtent.contains(point)) {
        return;
      }
      const text = d.text;
      const len = ctx.measureText(text);
      ctx.fillText(text, point.x - len.width / 2, point.y);
      drawn.push(d);
    });

    return drawn;
  }
}

HelloLayer.registerRenderer("canvas", HelloLayerRenderer);

const layer = new HelloLayer("hello");
layer.setData([
  {
    coord: map.getCenter().toArray(),
    text: "Hello World",
  },

  {
    coord: map.getCenter().add(0.01, 0.01).toArray(),
    text: "Hello World 2",
  },
]);
layer.addTo(map);
