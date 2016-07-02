(function () {
  'use strict';

  var maptalks;

  var nodeEnv = typeof module !== 'undefined' && module.exports;
  if (nodeEnv)  {
    maptalks = require('maptalks');
  } else {
    maptalks = window.maptalks;
  }

  var SVG = {
    createContainer:function () {
      var ns = 'http://www.w3.org/2000/svg';
      var paper = document.createElementNS(ns, 'svg');
      paper.style.overflow = '';
      paper.style.position = 'absolute';
      paper.setAttribute('xmlns', ns);
      var defs = document.createElementNS(ns, 'defs');
      paper.appendChild(defs);
      paper.defs = defs;
      return paper;
    }
  };

/**
 * @classdesc
 * Base layer to visualize data with [d3js]{@link http://www.d3js.org}
 * @class
 * @category layer
 * @extends {maptalks.Layer}
 * @param {String|Number} id - layer's id
 * @param {Object} [options=null] - construct options, including the options defined in [maptalks.Layer]{@link maptalks.Layer#options}
 */
  maptalks.D3Layer =  maptalks.Layer.extend(/** @lends maptalks.D3Layer.prototype */{
    options:{
      'renderer' : 'dom', //'dom/canvas'
      'hideWhenZooming' : false
    },

    initialize:function (id, options) {
      this.setId(id);
      maptalks.Util.setOptions(this, options);
    },

    /**
     * Whether rendered by HTML5 Canvas2D
     * @return {Boolean}
     */
    isCanvasRender:function () {
      if (this.options['renderer'] === 'canvas') {
        return true;
      }
      return false;
    },

    preDraw: function (projection) {
      return null;
    },

    /**
     * Draw the D3Layer
     * This is an abstract interface method for subclasses to implement.
     * @param  {SVG|Canvas} context    - context for D3 to draw on, possiblly a SVG element or a canvas.
     * @param  {Function} projection   - A D3 projection function to projection geodesic coordinate to 2D point.
     */
    draw: function (context, projection) {
        //draw the layer, interface to implement.
      return this;
    },

    /**
     * request layer to refresh
     */
    refresh: function () {
        //request layer to refresh
      if (this.isCanvasRender()) {
        this._getRenderer()._requestMapToRender();
      }
      return this;
    },

    getContext:function () {
      return this._getRenderer()._context;
    },

    getSize:function () {
      return this.getMap().getSize();
    },

    getGeoProjection: function () {
      return this._getRenderer()._getGeoProjection();
    }
  });

  maptalks.Util.extend(maptalks.D3Layer, maptalks.Renderable);

  maptalks.renderer.d3layer = {};

/**
 * @classdesc
 * A renderer based on HTML Doms for TileLayers.
 * It is implemented based on Leaflet's GridLayer, and all the credits belongs to Leaflet.
 * @class
 * @protected
 * @memberOf maptalks.renderer.d3layer
 * @name Dom
 * @extends {maptalks.Class}
 * @param {maptalks.D3Layer} layer - layer of the renderer
 */
  maptalks.renderer.d3layer.Dom = maptalks.Class.extend(/** @lends maptalks.renderer.d3layer.Dom.prototype */{
    initialize: function (layer) {
      this._layer = layer;
      this._registerEvents();
      this._initContainer();
    },

    getMap: function () {
      return this._layer.getMap();
    },

    render: function () {
      if (!this._drawed) {
        this._layer.draw(this._layer.getContext(), this._layer.getGeoProjection());
        this._drawed = true;
      }
      return true;
    },

    setZIndex: function (z) {
      this._zIndex = z;
      this._layerContainer.style.zIndex = 100 + z;
    },

    transform: function (matrices) {
      if (!this._canTransform()) {
        return false;
      }
      if (this._layerContainer) {
        this._matrix = matrices['container'];
        maptalks.DomUtil.setTransform(this._layerContainer, this._matrix);
      }
      return false;
    },

    _getGeoProjection: function () {
      var map = this.getMap();
      if (!this._d3zoom) {
        this._d3zoom = map.getZoom();
      }
      var me = this;
      return function (x, y) {
        if (x[0] && x[1]) {
          x = [x[0], x[1]];
        }
        var point = map.coordinateToPoint(new maptalks.Coordinate(x, y), me._d3zoom);
        if (this && this.stream) {
          this.stream.point(point.x, point.y);
        }
        return [point.x, point.y];
      };
    },

    _canTransform: function () {
      return maptalks.Browser.any3d || maptalks.Browser.ie9;
    },

    _getContainerPos: function () {
      var map = this.getMap(),
        center = map.getCenter(),
        zoom = this._d3zoom || map.getZoom();
      var point = map.coordinateToPoint(center, zoom),
        scale = 1;
      return [point, scale];
    },

    _initContainer:function () {
      var map = this.getMap();
      this._layerContainer = maptalks.DomUtil.createElOn('div', 'position:absolute;left:0px;top:0px;');

      this._context = SVG.createContainer();

      this._layerContainer.appendChild(this._context);

      this._resetContainer();
      map._panels.mapPlatform.appendChild(this._layerContainer);

    },

    _resetContainer: function () {
      var pos = this._getContainerPos();
      this._context.style.transform = '';
      this._refreshViewBox();
    },

    _refreshViewBox: function () {
      var map = this.getMap();
      var size = map.getSize(),
        res = map._getResolution(),
        d3z = this._d3zoom || map.getZoom(),
        d3res = map._getResolution(d3z),
        scale = res / d3res;
      this._context.setAttribute('width', size.width);
      this._context.setAttribute('height', size.height);
      var point = map.coordinateToPoint(map.getCenter(), d3z);
      this._viewBox = [point.x - size.width * scale / 2, point.y - size.height * scale / 2, size.width * scale, size.height * scale];

      this._context.setAttribute('viewBox', this._viewBox.join(' '));

      this._layerContainer.style.transform = '';

      var offset = map.offsetPlatform();
      this._layerContainer.style.left = -offset.x + 'px';
      this._layerContainer.style.top = -offset.y + 'px';
    },

    _registerEvents:function () {
      var map = this.getMap();
      var container = this._context;

      map.on('zoomend', function () {
        this._resetContainer();
        if (this._layer.options['hideWhenZooming'] || !this._canTransform()) {
          this._layerContainer.style.display = '';
        }
      }, this);
      map.on('zoomstart', function () {
        if (this._layer.options['hideWhenZooming'] || !this._canTransform()) {
          this._layerContainer.style.display = 'none';
        }
      }, this);

      map.on('moveend resize', function () {
        this._refreshViewBox();
      }, this);
    }
  });

  maptalks.renderer.d3layer.Canvas = maptalks.renderer.Canvas.extend({
    initialize : function (layer) {
      this._layer = layer;
      this._registerEvents();
    },

    remove:function () {
      delete this._drawContext;
      this._removeEvents();
      this._requestMapToRender();
    },

    _getGeoProjection: function () {
      var map = this.getMap();
      return function (x, y) {
        if (x[0] && x[1]) {
          x = [x[0], x[1]];
        }
        var point = map.coordinateToContainerPoint(new maptalks.Coordinate(x, y));
        if (this && this.stream) {
          this.stream.point(point.x, point.y);
        }
        return [point.x, point.y];
      };
    },

    draw: function () {
      this._prepareCanvas();
      if (!this._predrawed) {
        this._armContext();
        this._drawContext = this._layer.preDraw(this._context, this._layer.getGeoProjection());
        if (!this._drawContext) {
          this._drawContext = [];
        }
        this._predrawed = true;
      }

      this._layer.draw.apply(this._layer, this._drawContext.concat([this._context, this._layer.getGeoProjection()]));
      this._requestMapToRender();
      this._fireLoadedEvent();
    },

    _armContext: function () {
      if (!this._context) {
        return;
      }
      var map = this.getMap();
      this._context.arcInMeter = function (x, y, radius, startAngle, endAngle, anticlockwise) {
        var px = map.distanceToPixel(radius, 0);
        return this.arc(x, y, px['width'], startAngle, endAngle, anticlockwise);
      };
      this._context.arcToInMeter = function (x1, y1, x2, y2, radius) {
        var px = map.distanceToPixel(radius, 0);
        return this.arcTo(x1, y1, x2, y2, px['width']);
      };
      if (this._context.ellipse) {
        this._context.ellispeInMeter = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
          var px = map.distanceToPixel(radiusX, radiusY);
          return this.ellipse(x, y, px['width'], px['height'], rotation, startAngle, endAngle, anticlockwise);
        };
      }
      this._context.rectInMeter = function (x, y, width, height) {
        var px = map.distanceToPixel(width, height);
        return this.rect(x, y, px['width'], px['height']);
      };
    }
  });

  maptalks.D3Layer.registerRenderer('dom', maptalks.renderer.d3layer.Dom)
                .registerRenderer('canvas', maptalks.renderer.d3layer.Canvas);



})();
