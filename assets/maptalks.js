(function () {
'use strict';
'0.5.0';
// Z is the root namespace used internally, and will be exported later as maptalks.
/**
 * @namespace
 * @alias maptalks
 */
var Z = {};

/**
 * @property {boolean} node - whether running in nodejs.
 * @global
 * @name node
 * @static
 */
Z.node = (function () {
    return (typeof module !== 'undefined' && module.exports);
})();

if (!Z.node) {
    (function () {

        var ua = navigator.userAgent.toLowerCase(),
            doc = document.documentElement,

            ie = 'ActiveXObject' in window,

            webkit    = ua.indexOf('webkit') !== -1,
            phantomjs = ua.indexOf('phantom') !== -1,
            android23 = ua.search('android [23]') !== -1,
            chrome    = ua.indexOf('chrome') !== -1,
            gecko     = ua.indexOf('gecko') !== -1  && !webkit && !window.opera && !ie,

            mobile = typeof orientation !== 'undefined' || ua.indexOf('mobile') !== -1,
            msPointer = !window.PointerEvent && window.MSPointerEvent,
            pointer = (window.PointerEvent && navigator.pointerEnabled) || msPointer,

            ie3d = ie && ('transition' in doc.style),
            webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
            gecko3d = 'MozPerspective' in doc.style,
            opera12 = 'OTransition' in doc.style,
            any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantomjs;

        var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window ||
                (window.DocumentTouch && document instanceof window.DocumentTouch));

        Z.Browser = {
            ie: ie,
            ielt9: ie && !document.addEventListener,
            edge: 'msLaunchUri' in navigator && !('documentMode' in document),
            webkit: webkit,
            gecko: gecko,
            android: ua.indexOf('android') !== -1,
            android23: android23,
            chrome: chrome,
            safari: !chrome && ua.indexOf('safari') !== -1,
            phantomjs : phantomjs,

            ie3d: ie3d,
            webkit3d: webkit3d,
            gecko3d: gecko3d,
            opera12: opera12,
            any3d: any3d,

            mobile: mobile,
            mobileWebkit: mobile && webkit,
            mobileWebkit3d: mobile && webkit3d,
            mobileOpera: mobile && window.opera,
            mobileGecko: mobile && gecko,

            touch: !!touch,
            msPointer: !!msPointer,
            pointer: !!pointer,

            retina: (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1,

            language: navigator.browserLanguage ? navigator.browserLanguage : navigator.language,
            ie9: (ie && document.documentMode === 9),
            ie10: (ie && document.documentMode === 10),
            canvas: (!!document.createElement('canvas').getContext)
        };
        Z.Browser.translateDom = (Z.Browser.any3d && !ie);
    }());
} else {
    //usually in node
    Z.Browser = {
        canvas:true
    };
}


//根据script查找
Z.prefix = '';

if (!Z.node) {
    (function () {
        //解析host地址，插入css和vml定义
        var head = document.getElementsByTagName('head')[0];

        var headChildren = head.childNodes;
        var viewPortMeta = null;
        for (var i = 0, len = headChildren.length; i < len; i++) {
            if (headChildren[i].nodeName.toLowerCase() === 'meta') {
                var metaName = (headChildren[i].getAttribute ? headChildren[i].getAttribute('name') : null);
                if (metaName === 'viewport') {
                    viewPortMeta = headChildren[i];
                }
            }
        }

        if (Z.Browser.mobile) {
            if (viewPortMeta === null) {
                viewPortMeta = document.createElement('meta');
                viewPortMeta.setAttribute('name', 'viewport');
                viewPortMeta.setAttribute('content', 'user-scalable=no');
                head.appendChild(viewPortMeta);
            } else {
                var viewPortContent = viewPortMeta.getAttribute('content');
                if (viewPortContent.indexOf('user-scalable=no') < 0) {
                    viewPortMeta.setAttribute('content', viewPortContent + ',user-scalable=no');
                }
            }
        }

        if (Z.Browser.ielt9) {
            //chrome frame meta标签
            var cfMeta = document.createElement('meta');
            cfMeta.setAttribute('http-equiv', 'X-UA-Compatible');
            cfMeta.setAttribute('content', 'IE=edge,chrome=1');
            head.appendChild(cfMeta);
        }
    })();
}


Z.Url = function (prefix) {
    this.prefix = prefix;
    var parts = this.prefix.split('/');
    var hostIndex = 2;
    if (this.prefix.indexOf('http') < 0) {
        hostIndex = 0;
    }
    var hostport = parts[hostIndex];
    var hostParts = hostport.split(':');
    this.host = hostParts[0];
    if (hostParts.length > 1) {
        this.port = hostParts[1];
    } else {
        this.port = 80;
    }
};

Z.Url.prototype.getHost = function () {
    return this.host;
};

Z.Url.prototype.getPort = function () {
    return this.port;
};

//internal constants.
Z.internalLayerPrefix = '_maptalks__internal_layer_';

/**
 * Misc utilities used internally
 * @class
 * @category core
 * @protected
 */
Z.Util = {
    /**
     * @property {Number} guid
     * @static
     */
    guid: 0,

    now:function () {
        if (!Date.now) {
            return new Date().getTime();
        }
        return Date.now();
    },

    /**
     * Extend a object with one or more source objects.
     * @param  {Object} dest   - object to extend
     * @param  {...Object} src - sources
     * @return {Object}
     */
    extend: function (dest) { // (Object[, Object, ...]) ->
        var sources = Array.prototype.slice.call(arguments, 1), i, j, len, src;

        for (j = 0, len = sources.length; j < len; j++) {
            src = sources[j] || {};
            for (i in src) {
                if (src.hasOwnProperty(i)) {
                    dest[i] = src[i];
                }
            }
        }
        return dest;
    },

    /**
     * Set options to a object, extends its options member.
     * @param {Object} obj      - object to set options to
     * @param {Object} options  - options to set
     * @returns {Object} options set
     */
    setOptions: function (obj, options) {
        if (!obj.hasOwnProperty('options')) {
            obj.options = obj.options ? Z.Util.create(obj.options) : {};
        }
        for (var i in options) {
            obj.options[i] = options[i];
        }
        return obj.options;
    },

    isSVG:function (url) {
        var prefix = 'data:image/svg+xml';
        if (url.length > 4 && url.substring(url.length - 4) === '.svg') {
            return 1;
        } else if (url.substring(0, prefix.length) === prefix) {
            return 2;
        }
        return 0;
    },

    /**
     * Load a image, can be a remote one or a local file. <br>
     * If in node, a SVG image will be converted to a png file by [svg2img]{@link https://github.com/FuZhenn/node-svg2img}<br>
     * @param  {Image} img  - the image object to load.
     * @param  {Object[]} imgDesc - image's descriptor, it's a array. imgUrl[0] is the url string, imgUrl[1] is the width, imgUrl[2] is the height.
     * @return maptalks.Util
     */
    loadImage:function (img, imgDesc) {
        if (!Z.node) {
            img.src = imgDesc[0];
            return this;
        }
        function onError(err) {
            if (err) {
                console.error(err);
                console.error(err.stack);
            }
            var onerrorFn = img.onerror;
            if (onerrorFn) {
                onerrorFn.call(img);
            }
        }
        function onLoadComplete(err, data) {
            if (err) {
                onError(err);
                return;
            }
            var onloadFn = img.onload;
            if (onloadFn) {
                img.onload = function () {
                    onloadFn.call(img);
                };
            }
            img.src = data;
        }
        var url = imgDesc[0],
            w   = imgDesc[1],
            h   = imgDesc[2];
        try {
            if (Z.Util.isSVG(url)) {
                Z.Util._convertSVG2PNG(url, w, h, onLoadComplete);
            } else if (Z.Util.isURL(url)) {
                //canvas-node的Image对象
                this._loadRemoteImage(img, url, onLoadComplete);
            } else {
                this._loadLocalImage(img, url, onLoadComplete);
            }
        } catch (error) {
            onError(error);
        }
        return this;
    },

    _loadRemoteImage:function (img, url, onComplete) {
        //http
        var loader;
        if (url.indexOf('https://') === 0) {
            loader = require('https');
        } else {
            loader = require('http');
        }
        var urlObj = require('url').parse(url);
        //mimic the browser to prevent server blocking.
        urlObj.headers = {
            'Accept':'image/*,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate',
            'Cache-Control':'no-cache',
            'Connection':'keep-alive',
            'Host':urlObj.host,
            'Pragma':'no-cache',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
        };
        loader.request(urlObj, function (res) {
            var data = [];
            res.on('data', function (chunk) {
                data.push(chunk);
            });
            res.on('end', function () {
                onComplete(null, Buffer.concat(data));
            });
        }).on('error', onComplete).end();
    },

    _loadLocalImage:function (img, url, onComplete) {
        //local file
        require('fs').readFile(url, onComplete);
    },

    _convertSVG2PNG:function (url, w, h, onComplete) {
        //use svg2img to convert svg to png.
        //https://github.com/FuZhenn/node-svg2img
        require('svg2img')(url, {'width':w, 'height':h}, onComplete);
    },

    fixPNG:function () {

    },

    /**
     * Generate a global UID, not a real UUID, just a auto increment key with a prefix.
     * @return {String}
     */
    GUID: function () {
        return '___MAPTALKS_GLOBAL_' + (Z.Util.guid++);
    },

    // return unique ID of an object
    stamp: function (obj) {
        /*eslint-disable camelcase*/
        obj._maptalks_id = obj._maptalks_id || Z.Util.GUID();
        return obj._maptalks_id;
        /*eslint-enable camelcase*/
    },

    /**
     * Parse a JSON string to a object
     * @param {String} str      - a JSON string
     * @return {Object}
     */
    parseJSON:function (str) {
        if (!str || !Z.Util.isString(str)) {
            return str;
        }
        return JSON.parse(str);
    },

    /**
     * Object.create or a polyfill in old browsers.
     * @function
     * @param {Object} proto - the proto to create on.
     * @return {Object}
     */
    create: Object.create || (function () {
        function F() {}
        return function (proto) {
            F.prototype = proto;
            return new F();
        };
    })(),

    /**
     * Function.bind or a polyfill in old browsers.
     * @param {Function} fn     - function to bind
     * @param {Object} obj      - context to bind
     * @return {Function} function binded.
     */
    bind: function (fn, obj) {
        var slice = Array.prototype.slice;
        if (fn.bind) {
            return fn.bind.apply(fn, slice.call(arguments, 1));
        }
        var args = slice.call(arguments, 2);
        return function () {
            return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
        };
    },

    /**
     * from leaflet <br>
     * return a function that won't be called more often than the given interval
     *
     * @param  {Function} fn      - function to call
     * @param  {Number}   time    - interval to throttle
     * @param  {Object}   context - function's context
     * @return {Function} the throttled function
     */
    throttle: function (fn, time, context) {
        var lock, args, wrapperFn, later;

        later = function () {
            // reset lock and call if queued
            lock = false;
            if (args) {
                wrapperFn.apply(context, args);
                args = false;
            }
        };

        wrapperFn = function () {
            if (lock) {
                // called too soon, queue to call later
                args = arguments;

            } else {
                // call and lock until later
                fn.apply(context, arguments);
                setTimeout(later, time);
                lock = true;
            }
        };

        return wrapperFn;
    },

    removeFromArray:function (obj, array) {
        for (var i = array.length - 1; i >= 0; i--) {
            if (array[i] === obj) {
                return array.splice(i, 1);
            }
        }
        return null;
    },


    mapArrayRecursively:function (arr, fn, context) {
        if (!this.isArray(arr)) {
            return null;
        }
        var result = [],
            p, pp;
        for (var i = 0, len = arr.length; i < len; i++) {
            p = arr[i];
            if (Z.Util.isNil(p)) {
                result.push(null);
                continue;
            }
            if (Z.Util.isArray(p)) {
                result.push(Z.Util.mapArrayRecursively(p, fn, context));
            } else {
                pp = context ? fn.call(context, p) : fn(p);
                result.push(pp);
            }

        }
        return result;
    },


    mapArray: function (array, fn, context) {
        if (!this.isArray(array)) {
            return null;
        }
        var result = [],
            p, pp;
        for (var i = 0, len = array.length; i < len; i++) {
            p = array[i];
            if (Z.Util.isNil(p)) {
                result.push(null);
                continue;
            }
            pp = context ? fn.call(context, p) : fn(p);
            result.push(pp);
        }
        return result;
    },

    indexOfArray:function (obj, arr) {
        if (!Z.Util.isArrayHasData(arr)) {
            return -1;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    },

    /**
     * Shallow comparison of two objects <br>
     * borrowed from expect.js
     * @param  {Object} a
     * @param  {Object} b
     * @return {Boolean}
     */
    objEqual:function (a, b) {
        return Z.Util._objEqual(a, b);
    },

    /**
     * Deep comparison of two objects <br>
     * borrowed from expect.js
     * @param  {Object} a
     * @param  {Object} b
     * @return {Boolean}
     */
    objDeepEqual:function (a, b) {
        return Z.Util._objEqual(a, b, true);
    },

    _objEqual:function (a, b, isDeep) {
        function getKeys(obj) {
            if (Object.keys) {
                return Object.keys(obj);
            }
            var keys = [];
            for (var i in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, i)) {
                    keys.push(i);
                }
            }
            return keys;
        }
        if (Z.Util.isNil(a) || Z.Util.isNil(b)) {
            return false;
        }
        // an identical "prototype" property.
        if (a.prototype !== b.prototype) { return false; }
        var ka, kb, key, i;
        try {
            ka = getKeys(a);
            kb = getKeys(b);
        } catch (e) { //happens when one is a string literal and the other isn't
            return false;
        }
        // having the same number of owned properties (keys incorporates hasOwnProperty)
        if (ka.length !== kb.length) {
            return false;
        }
        //~~~cheap key test
        for (i = ka.length - 1; i >= 0; i--) {
            if (ka[i] !== kb[i]) {
                return false;
            }
        }
        //equivalent values for every corresponding key, and
        //~~~possibly expensive deep test
        if (isDeep) {
            for (i = ka.length - 1; i >= 0; i--) {
                key = ka[i];
                if (!Z.Util.objEqual(a[key], b[key])) {
                    return false;
                }
            }
        }
        return true;
    },

    /*
     * round a number, more efficient one.
     * @param  {Number} num - num to round
     * @return {Number}
     */
    round:function (num) {
        if (num > 0) {
            return (0.5 + num) << 0;
        } else {
            return (num - 0.5) << 0;
        }

    },

    /*
     * Whether the object is a coordinate
     * @param  {Object} obj     - object
     * @return {Boolean}
     */
    isCoordinate:function (obj) {
        if (obj instanceof Z.Coordinate) {
            return true;
        }
        /*if (obj && !Z.Util.isNil(obj.x) && !Z.Util.isNil(obj.y)) {
            return true;
        }*/
        return false;
    },
    /*
     * Whether the object is null or undefined.
     * @param  {Object}  obj - object
     * @return {Boolean}
     */
    isNil:function (obj) {
        return (typeof (obj) === 'undefined' || obj === null);
    },

    /*
     * Whether val is a number and not a NaN.
     * @param  {Object}  val - val
     * @return {Boolean}
     */
    isNumber:function (val) {
        return (typeof val === 'number') && !isNaN(val);
    },

    /*
     * Whether the obj is a javascript object.
     * @param  {*}  obj     - object to check
     * @return {Boolean}
     */
    isObject: function (obj) {
        return typeof obj === 'object' && !!obj;
    },

    /*
     * 判断数组中是否包含obj
     * @param {Object} obj
     * @return {Boolean} true|false
     */
    isArrayHasData:function (obj) {
        return this.isArray(obj) && obj.length > 0;
    },

    /*
     * 判断是否数组
     * @param {Object} obj
     * @return {Boolean} true|false
     */
    isArray:function (obj) {
        if (!obj) { return false; }
        if (Array.isArray) {
            return Array.isArray(obj);
        }
        return Object.prototype.toString.call(obj) === '[object Array]';
    },

    /**
     * 判断是否字符串
     * @param {Object} _str
     * @return {Boolean} true|false
     */
    isString:function (_str) {
        if (Z.Util.isNil(_str)) { return false; }
        return typeof _str === 'string' || (_str.constructor !== null && _str.constructor === String);
    },

    /*
     * 判断是否函数
     * @param {Object} _func
     * @return {Boolean} true|false
     */
    isFunction:function (_func) {
        if (this.isNil(_func)) {
            return false;
        }
        return typeof _func === 'function' || (_func.constructor !== null && _func.constructor === Function);
    },

    /**
     * Whether the input string is a valid url.
     * @param  {String}  url - url to check
     * @return {Boolean}
     */
    isURL:function (url) {
        if (!url) {
            return false;
        }
        if (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0 || url.indexOf('blob:') >= 0) {
            return true;
        }
        return false;
    },

    //改原先的regex名字为xWithQuote；不带引号的regex，/^url\(([^\'\"].*[^\'\"])\)$/i，为xWithoutQuote。然后在is函数里||测试，extract函数里if...else处理。没引号的匹配后，取matches[1]

    // match: url('x'), url("x").
    // TODO: url(x)
    cssUrlReWithQuote: /^url\(([\'\"])(.+)\1\)$/i,

    cssUrlRe:/^url\(([^\'\"].*[^\'\"])\)$/i,

    isCssUrl: function (str) {
        if (!Z.Util.isString(str)) {
            return 0;
        }
        if (str.substring(0, 4) === 'http') {
            return 3;
        }
        if (Z.Util.cssUrlRe.test(str)) {
            return 1;
        }
        if (Z.Util.cssUrlReWithQuote.test(str)) {
            return 2;
        }
        return 0;
    },

    extractCssUrl: function (str) {
        var test = Z.Util.isCssUrl(str), matches;
        if (test === 3) {
            return str;
        }
        if (test === 1) {
            matches = Z.Util.cssUrlRe.exec(str);
            return matches[1];
        } else if (test === 2) {
            matches = Z.Util.cssUrlReWithQuote.exec(str);
            return matches[2];
        } else {
            // return as is if not an css url
            return str;
        }
    },

    b64chrs : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    /**
     * btoa or a polyfill in old browsers. <br>
     * Creates a base-64 encoded ASCII string from a String object in which each character in the string is treated as a byte of binary data.<br>
     * From https://github.com/davidchambers/Base64.js
     * @param  {Buffer} input - input string to convert
     * @return {String} ascii
     * @example
     *     var encodedData = maptalks.Util.btoa(stringToEncode);
     */
    btoa:function (input) {
        if ((typeof window !== 'undefined') && window.btoa) {
            return window.btoa(input);
        }
        var str = String(input);
        for (
          // initialize result and counter
          var block, charCode, idx = 0, map = Z.Util.b64chrs, output = '';
          // if the next str index does not exist:
          //   change the mapping table to "="
          //   check if d has no fractional digits
          str.charAt(idx | 0) || (map = '=', idx % 1);
          // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
          output += map.charAt(63 & block >> 8 - idx % 1 * 8)
        ) {
            charCode = str.charCodeAt(idx += 3 / 4);
            if (charCode > 0xFF) {
                throw new Error('\'btoa\' failed: The string to be encoded contains characters outside of the Latin1 range.');
            }
            block = block << 8 | charCode;
        }
        return output;
    },

    /**
     * Borrowed from jquery, evaluates a javascript snippet in a global context
     * @param {String} code
     */
    globalEval: function (code) {
        var script = document.createElement('script');
        script.text = code;
        document.head.appendChild(script).parentNode.removeChild(script);
    },

    /**
     * Borrowed from jquery, evaluates a script in a global context.
     * @param  {String} file    - javascript file to eval
     */
    globalScript: function (file) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = file;
        document.head.appendChild(script);
    },

    decreaseSymbolOpacity:function (symbol, ratio) {
        function s(_symbol, _ratio) {
            var op = _symbol['opacity'];
            if (Z.Util.isNil(op)) {
                _symbol['opacity'] = _ratio;
            } else {
                _symbol['opacity'] *= _ratio;
            }
        }
        if (Z.Util.isArray(symbol)) {
            for (var i = 0; i < symbol.length; i++) {
                s(symbol[i], ratio);
            }
        } else {
            s(symbol, ratio);
        }
        return symbol;
    },

    extendSymbol:function (symbol) {
        var sources = Array.prototype.slice.call(arguments, 1);
        if (!sources || !sources.length) {
            sources = [{}];
        }
        if (Z.Util.isArray(symbol)) {
            var s, dest, i, ii, len, ilen;
            var result = [];
            for (i = 0, len = symbol.length; i < len; i++) {
                s = symbol[i];
                dest = {};
                for (ii = 0, ilen = sources.length; ii < ilen; ii++) {
                    if (!Z.Util.isArray(sources[ii])) {
                        Z.Util.extend(dest, s, sources[ii]);
                    } else if (!Z.Util.isNil(sources[ii][i])) {
                        Z.Util.extend(dest, s, sources[ii][i]);
                    }
                }
                result.push(dest);
            }
            return result;
        } else {
            return Z.Util.extend.apply(Z.Util, [{}, symbol].concat(sources));
        }
    },

    computeDegree: function (p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        return Math.atan2(dy, dx);
    },

    isGradient: function (g) {
        return g && Z.Util.isArrayHasData(g['colorStops']);
    },

    /**
     * Get external resources from the given symbol
     * @param  {Object} symbol      - symbol
     * @return {String[]}           - resource urls
     */
    getExternalResources: function (symbol) {
        if (!symbol) {
            return null;
        }
        var symbols = symbol;
        if (!Z.Util.isArray(symbol)) {
            symbols = [symbol];
        }
        var resources = [];
        var props = Z.Symbolizer.resourceProperties,
            ii, res, resSizeProp;
        for (var i = symbols.length - 1; i >= 0; i--) {
            symbol = symbols[i];
            if (!symbol) {
                continue;
            }
            for (ii = 0; ii < props.length; ii++) {
                res = symbol[props[ii]];
                if (!res) {
                    continue;
                }
                if (res.indexOf('url(') >= 0) {
                    res = Z.Util.extractCssUrl(res);
                }
                resSizeProp = Z.Symbolizer.resourceSizeProperties[ii];
                resources.push([res, symbol[resSizeProp[0]], symbol[resSizeProp[1]]]);
            }
            if (symbol['markerType'] === 'path' && symbol['markerPath']) {
                resources.push([Z.Geometry._getMarkerPathURL(symbol), symbol['markerWidth'], symbol['markerHeight']]);
            }
        }
        return resources;
    },

     /**
     * Convert symbol's resources' urls from relative path to an absolute path.
     * @param  {Object} symbol
     * @private
     */
    convertResourceUrl: function (symbol) {
        if (!symbol) {
            return null;
        }

        function absolute(base, relative) {
            var stack = base.split('/'),
                parts = relative.split('/');
            if (relative.indexOf('/') === 0) {
                return stack.slice(0, 3).join('/') + relative;
            } else {
                stack.pop(); // remove current file name (or empty string)
                             // (omit if "base" is the current folder without trailing slash)
                for (var i = 0; i < parts.length; i++) {
                    if (parts[i] === '.')
                        continue;
                    if (parts[i] === '..')
                        stack.pop();
                    else
                        stack.push(parts[i]);
                }
                return stack.join('/');
            }

        }
        var s = Z.Util.extend({}, symbol);
        if (Z.node) {
            return s;
        }
        var props = Z.Symbolizer.resourceProperties;
        var res, isCssStyle = false;
        for (var ii = 0, len = props.length; ii < len; ii++) {
            res = s[props[ii]];
            if (!res) {
                continue;
            }
            isCssStyle = false;
            if (res.indexOf('url(') >= 0) {
                res = Z.Util.extractCssUrl(res);
                isCssStyle = true;
            }
            if (!Z.Util.isURL(res)) {
                res = absolute(location.href, res);
                s[props[ii]] = isCssStyle ? 'url("' + res + '")' : res;
            }
        }
        return s;
    }

};


    //RequestAnimationFrame, inspired by Leaflet
(function () {
    if (Z.node) {
        Z.Util.requestAnimFrame = function (fn) {
            return setTimeout(fn, 16);
        };

        Z.Util.cancelAnimFrame = clearTimeout;
        return;
    }

    var requestFn, cancelFn;
    var lastTime = 0;


        // fallback for IE 7-8
    function timeoutDefer(fn) {
        var time = +new Date(),
            timeToCall = Math.max(0, 16 - (time - lastTime));

        lastTime = time + timeToCall;
        return setTimeout(fn, timeToCall);
    }
    function getPrefixed(name) {
        return window['webkit' + name] || window['moz' + name] || window['ms' + name];
    }
    if (typeof (window) != 'undefined') {
            // inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

        requestFn = window['requestAnimationFrame'] || getPrefixed('RequestAnimationFrame') || timeoutDefer;
        cancelFn = window['cancelAnimationFrame'] || getPrefixed('CancelAnimationFrame') ||
                           getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };
    } else {
        requestFn = timeoutDefer;
        cancelFn =  function (id) { clearTimeout(id); };
    }
    Z.Util.requestAnimFrame = function (fn) {
        return requestFn(fn);
    };

    Z.Util.cancelAnimFrame = function (id) {
        if (id) {
            cancelFn(id);
        }
    };
})();

/**
 * String utilities  used internally
 * @class
 * @category core
 * @protected
 */
Z.StringUtil = {

    /**
     * Trim the string
     * @param {String} str
     * @return {String}
     */
    trim: function (str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },

    /**
     * Split string by specified char
     * @param {String} chr - char to split
     * @return {String[]}
     */
    splitWords: function (chr) {
        return Z.StringUtil.trim(chr).split(/\s+/);
    },

    /**
     * Gets size in pixel of the text with a certain font.
     * @param {String} text - text to measure
     * @param {String} font - font of the text, same as the CSS font.
     * @return {maptalks.Size}
     */
    stringLength:function (text, font) {
        var ruler = Z.StringUtil._getStrRuler();
        ruler.style.font = font;
        ruler.innerHTML = text;
        var result = new Z.Size(ruler.clientWidth, ruler.clientHeight);
        //if not removed, the canvas container on chrome will turn to unexpected blue background.
        //Reason is unknown.
        Z.DomUtil.removeDomNode(ruler);
        return result;

    },

    _getStrRuler:function () {
        var span = document.createElement('span');
        span.style.cssText = 'position:absolute;left:-10000px;top:-10000px;';
        document.body.appendChild(span);
        return span;
    },

    /**
     * Split content by wrapLength 根据长度分割文本
     * @param {String} content      - text to split
     * @param {Number} textLength   - width of the text, provided to prevent expensive repeated text measuring
     * @param {Number} wrapWidth    - width to wrap
     * @return {String[]}
     */
    splitContent: function (content, textLength, wrapWidth) {
        var rowNum = Math.ceil(textLength / wrapWidth);
        var avgLen = textLength / content.length;
        var approxLen =  Math.floor(wrapWidth / avgLen);
        var result = [];
        for (var i = 0; i < rowNum; i++) {
            if (i < rowNum - 1) {
                result.push(content.substring(i * approxLen, (i + 1) * approxLen));
            } else {
                result.push(content.substring(i * approxLen));
            }
        }
        return result;
    },
    /**
     * Replace variables wrapped by square brackets ({foo}) with actual values in props.
     * @example
     *     // will returns 'John is awesome'
     *     var actual = maptalks.StringUtil.replaceVariable('{foo} is awesome', {'foo' : 'John'});
     * @param {String} str      - string to replace
     * @param {Object} props    - variable value properties
     * @return {String}
     */
    replaceVariable: function (str, props) {
        if (!Z.Util.isObject(props) || !Z.Util.isString(str)) {
            return str;
        }
        return str.replace(Z.StringUtil._contentExpRe, function (str, key) {
            var value = props[key];
            if (Z.Util.isNil(value)) {
                return str;
            }
            return value;
        });
    },

    _contentExpRe: /\{([\w_]+)\}/g,

    /**
     * Split a text to multiple rows according to the style.<br>
     * Style is generated in [TextMarkerSymbolizer]{@link maptalks.symbolizer.TextMarkerSymbolizer}
     * @param {String} text     - text to split
     * @param {Object} style    - text style
     * @return {Object[]} the object's structure: {rowNum: rowNum, textSize: textSize, rows: textRows}
     */
    splitTextToRow: function (text, style) {
        var font = Z.symbolizer.TextMarkerSymbolizer.getFont(style),
            lineSpacing = style['textLineSpacing'] || 0,
            rawTextSize = Z.StringUtil.stringLength(text, font),
            textWidth = rawTextSize['width'],
            textHeight = rawTextSize['height'],
            wrapChar = style['textWrapCharacter'],
            wrapWidth = style['textWrapWidth'],
            textRows = [];
        if (!wrapWidth || wrapWidth > textWidth) { wrapWidth = textWidth; }
        if (!Z.Util.isString(text)) {
            text += '';
        }
        var actualWidth = 0, size, i, len;
        if (wrapChar && text.indexOf(wrapChar) >= 0) {
            var texts = text.split(wrapChar),
                t, tSize, tWidth, contents, ii;
            for (i = 0, len = texts.length; i < len; i++) {
                t = texts[i];
                //TODO stringLength is expensive, should be reduced here.
                tSize = Z.StringUtil.stringLength(t, font);
                tWidth = tSize['width'];
                if (tWidth > wrapWidth) {
                    contents = Z.StringUtil.splitContent(t, tWidth, wrapWidth);
                    for (ii = 0; ii < contents.length; ii++) {
                        size = Z.StringUtil.stringLength(contents[ii], font);
                        if (size['width'] > actualWidth) { actualWidth = size['width']; }
                        textRows.push({'text':contents[ii], 'size':size});
                    }
                } else {
                    if (tSize['width'] > actualWidth) { actualWidth = tSize['width']; }
                    textRows.push({'text':t, 'size':tSize});
                }
            }
        } else if (textWidth > wrapWidth) {
            var splitted = Z.StringUtil.splitContent(text, textWidth, wrapWidth);
            for (i = 0; i < splitted.length; i++) {
                size = Z.StringUtil.stringLength(splitted[i], font);
                if (size['width'] > actualWidth) { actualWidth = size['width']; }
                textRows.push({'text':splitted[i], 'size':size});
            }
        } else {
            if (rawTextSize['width'] > actualWidth) {
                actualWidth = rawTextSize['width'];
            }
            textRows.push({'text':text, 'size':rawTextSize});
        }

        var rowNum = textRows.length;
        var textSize = new Z.Size(actualWidth, textHeight * rowNum + lineSpacing * (rowNum - 1));
        return {'total': rowNum, 'size': textSize, 'rows': textRows, 'rawSize':rawTextSize};
    },

    /**
     * Gets text's align point according to the horizontalAlignment and verticalAlignment
     * @param  {maptalks.Size} size                  - text size
     * @param  {String} horizontalAlignment - horizontalAlignment: left/middle/right
     * @param  {String} verticalAlignment   - verticalAlignment: top/middle/bottom
     * @return {maptalks.Point}
     */
    getAlignPoint:function (size, horizontalAlignment, verticalAlignment) {
        var width = size['width'], height = size['height'];
        var alignW, alignH;
        if (horizontalAlignment === 'left') {
            alignW = -width;
        } else if (horizontalAlignment === 'middle') {
            alignW = -width / 2;
        } else if (horizontalAlignment === 'right') {
            alignW = 0;
        }
        if (verticalAlignment === 'top') {
            alignH = -height;
        } else if (verticalAlignment === 'middle') {
            alignH = -height / 2;
        } else if (verticalAlignment === 'bottom') {
            alignH = 0;
        }
        return new Z.Point(alignW, alignH);
    }
};


/**
 * DOM utilities used internally.
 * Learned a lot from Leaflet.DomUtil
 * @class
 * @category core
 * @protected
 * @memberOf maptalks
 * @name DomUtil
 */
Z.DomUtil = {

    /**
     * Create a html element.
     * @param {String} tagName
     * @returns {HTMLElement}
     */
    createEl:function (tagName, className) {
        var el = document.createElement(tagName);
        if (className) {
            Z.DomUtil.setClass(el, className);
        }
        return el;
    },

    /**
     * Create a html element on the specified container
     * @param {String} tagName
     * @param {String} style - css styles
     * @param {HTMLElement} container
     * @return {HTMLElement}
     */
    createElOn:function (tagName, style, container) {
        var el = this.createEl(tagName);
        if (style) {
            this.setStyle(el, style);
        }
        if (container) {
            container.appendChild(el);
        }
        return el;
    },

    /**
     * Removes a html element.
     * @param {HTMLElement} node
     */
    removeDomNode:function (node) {
        if (!node) { return; }
        if (Z.Browser.ielt9 || Z.Browser.ie9) {
            //fix memory leak in IE9-
            //http://com.hemiola.com/2009/11/23/memory-leaks-in-ie8/
            var d = Z.DomUtil.createEl('div');
            d.appendChild(node);
            d.innerHTML = '';
            d = null;
        } else if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    },

    /**
     * Adds a event listener to the dom element.
     * @param {HTMLElement} obj     - dom element to listen on
     * @param {String} typeArr      - event types, seperated by space
     * @param {Function} handler    - listener function
     * @param {Object} context      - function context
     * @return {maptalks.DomUtil}
     */
    addDomEvent:function (obj, typeArr, handler, context) {
        if (!obj || !typeArr || !handler) { return Z.DomUtil; }
        var eventHandler = function (e) {
            if (!e) {
                e = window.event;
            }
            return handler.call(context || obj, e);
        };
        var types = typeArr.split(' ');
        for (var i = types.length - 1; i >= 0; i--) {
            var type = types[i];
            if (!type) {
                continue;
            }

            if (!obj['Z__' + type]) {
                obj['Z__' + type] = [];

            }
            var hit = Z.DomUtil.listensDomEvent(obj, type, handler);
            if (hit >= 0) {
                Z.DomUtil.removeDomEvent(obj, type, handler);
            }
            obj['Z__' + type].push({callback:eventHandler, src:handler});
            if ('addEventListener' in obj) {
                //滚轮事件的特殊处理
                if (type === 'mousewheel' && document['mozHidden'] !== undefined) {
                    type = 'DOMMouseScroll';
                }
                obj.addEventListener(type, eventHandler, false);
            } else if ('attachEvent' in obj) {
                obj.attachEvent('on' + type, eventHandler);
            }
        }
        return Z.DomUtil;
    },

    /**
     * Removes event listener from a dom element
     * @param {HTMLElement} obj         - dom element
     * @param {String} typeArr          - event types, separated by space
     * @param {Function} handler        - listening function
     * @return {maptalks.DomUtil}
     */
    removeDomEvent:function (obj, typeArr, handler) {
        function doRemove(type, callback) {
            if ('removeEventListener' in obj) {
                //mouse wheel in firefox
                if (type === 'mousewheel' && document['mozHidden'] !== undefined) {
                    type = 'DOMMouseScroll';
                }
                obj.removeEventListener(type, callback, false);
            } else if ('detachEvent' in obj) {
                obj.detachEvent('on' + type, callback);
            }
        }
        if (!obj || !typeArr) { return this; }
        var types = typeArr.split(' ');
        for (var i = types.length - 1; i >= 0; i--) {
            var type = types[i];
            if (!type) {
                continue;
            }
            //remove all the listeners if handler is not given.
            if (!handler && obj['Z__' + type]) {
                var handlers = obj['Z__' + type];
                for (var j = 0, jlen = handlers.length; j < jlen; j++) {
                    doRemove(handlers[j].callback);
                }
                delete obj['Z__' + type];
                return this;
            }
            var hit = this.listensDomEvent(obj, type, handler);
            if (hit < 0) {
                return this;
            }
            var hitHandler = obj['Z__' + type][hit];
            doRemove(type, hitHandler.callback);
            obj['Z__' + type].splice(hit, 1);
        }
        return this;
    },

    /**
     * Check if event type of the dom is listened by the handler
     * @param {HTMLElement} obj     - dom element to check
     * @param {String} typeArr      - event
     * @param {Function} handler    - the listening function
     * @return {Number} - the handler's index in the listener chain, returns -1 if not.
     */
    listensDomEvent:function (obj, type, handler) {
        if (!obj || !obj['Z__' + type] || !handler) {
            return -1;
        }
        var handlers = obj['Z__' + type];
        for (var i = 0, len = handlers.length; i < len; i++) {
            if (handlers[i].src === handler) {
                return i;
            }
        }
        return -1;
    },

    /**
     * Prevent default behavior of the browser. <br/>
     * preventDefault Cancels the event if it is cancelable, without stopping further propagation of the event.
     * @param {Event} event - browser event
     */
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    /**
     * Stop browser event propagation
     * @param  {Event} e - browser event.
     */
    stopPropagation: function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        return this;
    },

    preventSelection: function (dom) {
        dom.onselectstart = function () {
            return false;
        };
        dom.ondragstart = function () { return false; };
        dom.setAttribute('unselectable', 'on');
        return this;
    },

    /**
     * Get the dom element's current position or offset its position by offset
     * @param  {HTMLElement} dom - HTMLElement
     * @param  {maptalks.Point} [offset=null] - position to set.
     * @return {maptalks.Point} - dom element's current position if offset is null.
     */
    offsetDom: function (dom, offset) {
        if (!dom) { return null; }

        if (Z.Browser.any3d) {
            Z.DomUtil.setTransform(dom, offset);
        } else {
            dom.style.left = offset.x + 'px';
            dom.style.top = offset.y + 'px';
        }
        return offset;
    },

    /**
     * 获取dom对象在页面上的屏幕坐标
     * @param  {HTMLElement} obj Dom对象
     * @return {Object}     屏幕坐标
     */
    getPagePosition:function (obj) {
        if (obj.getBoundingClientRect) {
            var docEl = document.documentElement;
            var rect = obj.getBoundingClientRect();
            return new Z.Point(rect['left'] + docEl['scrollLeft'], rect['top'] + docEl['scrollTop']);
        }
        var topValue = 0, leftValue = 0;
        if (!obj) {
            console.error('obj is null');
        }
        leftValue += parseInt(obj.offsetLeft, 0);
        topValue += parseInt(obj.offsetTop, 0);
        obj = obj.offsetParent;
        while (obj) {
            leftValue += parseInt(obj.offsetLeft, 0);
            topValue += parseInt(obj.offsetTop, 0);
            obj = obj.offsetParent;
        }
        return new Z.Point(leftValue, topValue);
    },

    /**
     * 获取事件触发页面的屏幕坐标
     * @param  {Event} ev 事件
     * @return {Object} 屏幕坐标
     */
    getEventPagePosition:function (ev) {
        ev = ev || window.event;
        if (ev.touches && ev.touches.length > 0) {
            return new Z.Point(ev.touches[0].pageX, ev.touches[0].pageY);
        } else if (ev.changedTouches && ev.changedTouches.length > 0) {
            //touchend
            return new Z.Point(ev.changedTouches[0].pageX, ev.changedTouches[0].pageY);
        } else if (ev.pageX || ev.pageY) {
            return new Z.Point(ev.pageX, ev.pageY);
        } else {
            //解决是否定义DOCTYPE W3C DTD标准取值滚动条参数
            var dBody = document.body;//无标准这有效
            var dElement = document.documentElement;//有标准这有效
            var scrollLeft = dElement.scrollLeft ? dElement.scrollLeft : dBody.scrollLeft;
            var clientLeft = dElement.clientLeft ? dElement.clientLeft : dBody.clientLeft;
            var scrollTop = dElement.scrollTop ? dElement.scrollTop : dBody.scrollTop;
            var clientTop = dElement.clientTop ? dElement.clientTop : dBody.clientTop;
            return new Z.Point(
                ev.clientX + scrollLeft - clientLeft,
                ev.clientY + scrollTop  - clientTop
            );
        }
    },

    /**
     * 获取鼠标在容器上相对容器左上角的坐标值
     * @param {Event} ev  触发的事件
     * @return {maptalks.Point} left:鼠标在页面上的横向位置, top:鼠标在页面上的纵向位置
     */
    getEventContainerPoint:function (ev, dom) {
        if (!ev) {
            ev = window.event;
        }
        var domScreenPos = Z.DomUtil.getPagePosition(dom);
        var mousePagePos = Z.DomUtil.getEventPagePosition(ev);
        return mousePagePos._substract(domScreenPos);
    },

    /**
     * 为dom设置样式
     * @param {HTMLElement} dom dom节点
     * @param {String} strCss 样式字符串
     */
    setStyle : function (dom, strCss) {
        function endsWith(str, suffix) {
            var l = str.length - suffix.length;
            return l >= 0 && str.indexOf(suffix, l) === l;
        }
        var style = dom.style,
            cssText = style.cssText;
        if (!endsWith(cssText, ';')) {
            cssText += ';';
        }
        dom.style.cssText = cssText + strCss;
    },

    /**
     * 清空dom样式
     * @param {HTMLElement} dom dom节点
     */
    removeStyle: function (dom) {
        dom.style.cssText = '';
    },

    /**
     * 为dom添加样式
     * @param {HTMLElement} dom dom节点
     * @param {String} attr 样式标签
     * @param {String} value 样式值
     */
    addStyle: function (dom, attr, value) {
        var css = dom.style.cssText;
        if (attr && value) {
            var newStyle = attr + ':' + value + ';';
            dom.style.cssText = css + newStyle;
        }
    },

    /**
     * 判断元素是否包含class
     * @param {HTMLElement} el html元素
     * @param {String} name class名称
     */
    hasClass: function (el, name) {
        if (el.classList !== undefined) {
            return el.classList.contains(name);
        }
        var className = Z.DomUtil.getClass(el);
        return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
    },

    /**
     * 为dom添加class
     * @param {HTMLElement} el html元素
     * @param {String} name class名称
     */
    addClass: function (el, name) {
        if (el.classList !== undefined) {
            var classes = Z.StringUtil.splitWords(name);
            for (var i = 0, len = classes.length; i < len; i++) {
                el.classList.add(classes[i]);
            }
        } else if (!Z.DomUtil.hasClass(el, name)) {
            var className = Z.DomUtil.getClass(el);
            Z.DomUtil.setClass(el, (className ? className + ' ' : '') + name);
        }
    },

    /**
     * 移除dom class
     * @param {HTMLElement} el html元素
     * @param {String} name class名称
     */
    removeClass: function (el, name) {
        if (el.classList !== undefined) {
            el.classList.remove(name);
        } else {
            Z.DomUtil.setClass(el, Z.StringUtil.trim((' ' + Z.DomUtil.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
        }
    },

    /**
     * 设置dom class
     * @param {HTMLElement} el html元素
     * @param {String} name class名称
     */
    setClass: function (el, name) {
        if (Z.Util.isNil(el.className.baseVal)) {
            el.className = name;
        } else {
            el.className.baseVal = name;
        }
    },

    /**
     * 获取dom class
     * @param {String} name class名称
     * @retrun {String} class字符串
     */
    getClass: function (el) {
        return Z.Util.isNil(el.className.baseVal) ? el.className : el.className.baseVal;
    },

    // Borrowed from Leaflet
    // @function setOpacity(el: HTMLElement, opacity: Number)
    // Set the opacity of an element (including old IE support).
    // `opacity` must be a number from `0` to `1`.
    setOpacity: function (el, value) {

        if ('opacity' in el.style) {
            el.style.opacity = value;

        } else if ('filter' in el.style) {
            Z.DomUtil._setOpacityIE(el, value);
        }
    },

    _setOpacityIE: function (el, value) {
        var filter = false,
            filterName = 'DXImageTransform.Microsoft.Alpha';

        // filters collection throws an error if we try to retrieve a filter that doesn't exist
        try {
            filter = el.filters.item(filterName);
        } catch (e) {
            // don't set opacity to 1 if we haven't already set an opacity,
            // it isn't needed and breaks transparent pngs.
            if (value === 1) { return; }
        }

        value = Math.round(value * 100);

        if (filter) {
            filter.Enabled = (value !== 100);
            filter.Opacity = value;
        } else {
            el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
        }
    },

    /**
     * Copy the source canvas
     * @param  {Element|Canvas} src - source canvas
     * @return {Element|Canvas}     target canvas
     */
    copyCanvas:function (src) {
        if (Z.node) {
            return null;
        }
        var target = Z.DomUtil.createEl('canvas');
        target.width = src.width;
        target.height = src.height;
        target.getContext('2d').drawImage(src, 0, 0);
        return target;
    },

    /**
     * Test if the size of canvas is valid.
     * @function
     * @param  {maptalks.Size} - size
     * @return {Boolean}
     */
    testCanvasSize: (function () {
        if (Z.node) {
            return function () { return true; };
        }
          /**
           * @type {CanvasRenderingContext2D}
           */
        var context = null;

          /**
           * @type {ImageData}
           */
        var imageData = null;

        return function (size) {
            if (!context) {
                var _canvas = Z.DomUtil.createEl('canvas');
                _canvas.width = 1;
                _canvas.height = 1;
                context = _canvas.getContext('2d');
                imageData = context.createImageData(1, 1);
                var data = imageData.data;
                data[0] = 42;
                data[1] = 84;
                data[2] = 126;
                data[3] = 255;
            }
            var canvas = context.canvas;
            var good = size['width'] <= canvas.width && size['height'] <= canvas.height;
            if (!good) {
                canvas.width = size['width'];
                canvas.height = size['height'];
                var x = size['width'] - 1;
                var y = size['height'] - 1;
                context.putImageData(imageData, x, y);
                var result = context.getImageData(x, y, 1, 1);
                var arrEqual = true;
                for (var i = result.data.length - 1; i >= 0; i--) {
                    if (result.data[i] !== imageData.data[i]) {
                        arrEqual = false;
                        break;
                    }
                }
                good = arrEqual;
            }
            return good;
        };
    })(),


    /**
     * From Leaflet.DomUtil
     * Goes through the array of style names and returns the first name
     * that is a valid style name for an element. If no such name is found,
     * it returns false. Useful for vendor-prefixed styles like `transform`.
     * @param  {String[]} props
     * @return {Boolean}
     */
    testProp: function (props) {

        var style = document.documentElement.style;

        for (var i = 0; i < props.length; i++) {
            if (props[i] in style) {
                return props[i];
            }
        }
        return false;
    },


    /**
     * Based on Leaflet.DomUtil.
     * Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
     * and optionally scaled by `scale`. Does not have an effect if the browser doesn't support 3D CSS transforms.
     * Also support set a transform matrix.
     * @param {HTMLElement} el
     * @param {maptalks.Point} offset
     * @param {Number} scale
     */
    setTransform: function (el, offset, scale) {
        if (offset instanceof Z.Matrix) {
            el.style[Z.DomUtil.TRANSFORM] =  offset.toCSS();
            return this;
        }
        var pos = offset || new Z.Point(0, 0);
        el.style[Z.DomUtil.TRANSFORM] =
            (Z.Browser.ie3d ?
                'translate(' + pos.x + 'px,' + pos.y + 'px)' :
                'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
            (scale ? ' scale(' + scale + ')' : '');

        return this;
    }

};

/**
 * Alias for [addDomEvent]{@link maptalks.DomUtil.addDomEvent}
 * @param {HTMLElement} obj     - dom element to listen on
 * @param {String} typeArr      - event types, seperated by space
 * @param {Function} handler    - listener function
 * @param {Object} context      - function context
 * @static
 * @function
 * @return {maptalks.DomUtil}
 */
Z.DomUtil.on = Z.DomUtil.addDomEvent;

/**
* Alias for [removeDomEvent]{@link maptalks.DomUtil.removeDomEvent}
* @param {HTMLElement} obj         - dom element
* @param {String} typeArr          - event types, separated by space
* @param {Function} handler        - listening function
* @static
* @function
* @return {maptalks.DomUtil}
*/
Z.DomUtil.off = Z.DomUtil.removeDomEvent;

(function () {
    if (Z.node) {
        return;
    }
    // Borrowed from Leaflet.DomUtil

    // prefix style property names

    /**
     * Vendor-prefixed fransform style name (e.g. `'webkitTransform'` for WebKit).
     * @property
     * @memberOf maptalks.DomUtil
     * @type {String}
     */
    Z.DomUtil.TRANSFORM = Z.DomUtil.testProp(
            ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);


})();



/**
 * This provides methods used for event handling. It's a mixin and not meant to be used directly.
 * @mixin
 */
Z.Eventable = {
    /**
     * Register a handler function to be called whenever this event is fired.
     *
     * @param {String} eventTypeArr     - event types to register, seperated by space if more than one.
     * @param {Function} handler                 - handler function to be called
     * @param {Object} [context=null]            - the context of the handler
     * @return {*} this
     * @instance
     */
    on: function (eventTypeArr, handler, context) {
        if (!eventTypeArr || !handler) { return this; }
        if (!this._eventMap) {
            this._eventMap = {};
        }
        var eventTypes = eventTypeArr.split(' ');
        var eventType;
        if (!context) { context = this; }
        var handlerChain, i, len;
        for (var j = 0, jl = eventTypes.length; j < jl; j++) {
            eventType = eventTypes[j].toLowerCase();
            handlerChain = this._eventMap[eventType];
            if (!handlerChain) {
                handlerChain = [];
                this._eventMap[eventType] = handlerChain;
            }
            for (i = 0, len = handlerChain.length; i < len; i++) {
                if (handler === handlerChain[i].handler && handlerChain[i].context === context) {
                    return this;
                }
            }
            handlerChain.push({
                handler:handler,
                context:context
            });
        }
        return this;
    },

    /**
     * Same as on, except the listener will only get fired once and then removed.
     *
     * @param {String} eventTypeArr     - event types to register, seperated by space if more than one.
     * @param {Function} handler                 - listener handler
     * @param {Object} [context=null]            - the context of the handler
     * @return {*} this
     * @instance
     */
    once: function (eventTypeArr, handler, context) {
        var me = this;
        var called = false;
        function onceHandler() {
            if (called) {
                return;
            }
            called = true;
            handler.apply(this, arguments);
            me.off(eventTypeArr, onceHandler, this);
        }
        return this.on(eventTypeArr, onceHandler, context);
    },

    /**
     * Unregister the event handler for the specified event types.
     *
     * @param {String} eventTypeArr    - event types to unregister, seperated by space if more than one.
     * @param {Function} handler                - listener handler
     * @param {Object} [context=null]           - the context of the handler
     * @return {*} this
     * @instance
     */
    off:function (eventTypeArr, handler, context) {
        if (!eventTypeArr || !this._eventMap || !handler) { return this; }
        var eventTypes = eventTypeArr.split(' ');
        var eventType, handlerChain;
        if (!context) { context = this; }
        var i;
        for (var j = 0, jl = eventTypes.length; j < jl; j++) {
            eventType = eventTypes[j].toLowerCase();
            handlerChain =  this._eventMap[eventType];
            if (!handlerChain) { return this; }
            for (i = handlerChain.length - 1; i >= 0; i--) {
                if (handler === handlerChain[i].handler && handlerChain[i].context === context) {
                    handlerChain.splice(i, 1);
                }
            }
        }
        return this;
    },

    _clearListeners:function (eventType) {
        if (!this._eventMap || !Z.Util.isString(eventType)) { return; }
        var handlerChain =  this._eventMap[eventType.toLowerCase()];
        if (!handlerChain) { return; }
        this._eventMap[eventType] = null;
    },

    _clearAllListeners:function () {
        this._eventMap = null;
    },

    /**
     * Returns true if any listener registered for the event type.
     *
     * @param {String} eventType - event type
     * @return {Boolean}
     * @instance
     */
    listens:function (eventType, handler, context) {
        if (!this._eventMap || !Z.Util.isString(eventType)) { return 0; }
        var handlerChain =  this._eventMap[eventType.toLowerCase()];
        if (!handlerChain) { return 0; }
        var count = 0;
        for (var i = 0, len = handlerChain.length; i < len; i++) {
            if (handler) {
                if (handler === handlerChain[i].handler &&
                    (Z.Util.isNil(context) || handlerChain[i].context === context)) {
                    return 1;
                }
            } else {
                count++;
            }
        }
        return count;
    },

   /**
    * Copy all the event listener to the target object
    * @param {Object} target - target object to copy to.
    * @return {*} this
    * @instance
    */
    copyEventListeners: function (target) {
        var eventMap = target._eventMap;
        if (!eventMap) { return this; }
        var handlerChain, i, len;
        for (var eventType in eventMap) {
            handlerChain = eventMap[eventType];
            for (i = 0, len = handlerChain.length; i < len; i++) {
                this.on(eventType, handlerChain[i].handler, handlerChain[i].context);
            }
        }
        return this;
    },

    /**
     * Fire an event, causing all handlers for that event name to run.
     *
     * @param  {String} eventType - an event type to fire
     * @param  {Object} param     - parameters for the listener function.
     * @return {*} this
     * @instance
     */
    fire:function () {
        if (this._eventParent) {
            return this._eventParent.fire.apply(this._eventParent, arguments);
        }
        return this._fire.apply(this, arguments);
    },

    /**
     * Set a event parent to handle all the events
     * @param {Any} parent - event parent
     * @return {Any} this
     */
    setEventParent:function (parent) {
        this._eventParent = parent;
        return this;
    },


    _fire:function (eventType, param) {
        if (!this._eventMap) { return this; }
        var handlerChain = this._eventMap[eventType.toLowerCase()];
        if (!handlerChain) { return this; }
        if (!param) {
            param = {};
        }
        param['type'] = eventType;
        param['target'] = this;
        //in case of deleting a listener in a execution, copy the handlerChain to execute.
        var queue = [].concat(handlerChain),
            context, bubble, passed;
        for (var i = 0, len = queue.length; i < len; i++) {
            if (!queue[i]) { continue; }
            context = queue[i].context;
            bubble = true;
            passed = Z.Util.extend({}, param);
            if (context) {
                bubble = queue[i].handler.call(context, passed);
            } else {
                bubble = queue[i].handler(passed);
            }
            //stops the event propagation if the handler returns false.
            if (bubble === false) {
                if (param['domEvent']) {
                    Z.DomUtil.stopPropagation(param['domEvent']);
                }
            }
        }
        return this;
    }
};

/**
* Alias for [on]{@link maptalks.Eventable.on}
*
* @param {String} eventTypeArr     - event types to register, seperated by space if more than one.
* @param {Function} handler                 - handler function to be called
* @param {Object} [context=null]            - the context of the handler
* @return {*} this
* @function
* @instance
* @memberOf maptalks.Eventable
* @name addEventListener
*/
Z.Eventable.addEventListener = Z.Eventable.on;
/**
 * Alias for [off]{@link maptalks.Eventable.off}
 *
 * @param {String} eventTypeArr    - event types to unregister, seperated by space if more than one.
 * @param {Function} handler                - listener handler
 * @param {Object} [context=null]           - the context of the handler
 * @return {*} this
 * @function
 * @instance
 * @memberOf maptalks.Eventable
 * @name removeEventListener
 */
Z.Eventable.removeEventListener = Z.Eventable.off;

/**
 * OOP facilities of the library. <br/>
 * Thanks to Leaflet's inspiration (http://www.leafletjs.com)
 * @see  [Original explanation by Leaflet]{@link http://leafletjs.com/reference.html#class}
 *
 * @class
 * @category core
 * @abstract
 */
Z.Class = function () {

};
/**
 * Extend a class with a prototype object with instance methods and properties.
 *
 * @param  {object} props - a literal object with instance properties or methods.
 * @return {maptalks.Class}
 * @static
 * @example
 *  var MyClass = L.Class.extend({
        initialize: function (greeter) {
            this.greeter = greeter;
            // class constructor
        },

        greet: function (name) {
            alert(this.greeter + ', ' + name)
        }
    });

    // create instance of MyClass, passing "Hello" to the constructor
    var a = new MyClass("Hello");

    // call greet method, alerting "Hello, World"
    a.greet("World");
 */
Z.Class.extend = function (props) {

    // extended class with the new prototype
    var NewClass = function () {
        // call the constructor
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }

        // call all constructor hooks
        if (this._initHooks) {
            this.callInitHooks();
        }
    };

    var parentProto = NewClass.__super__ = this.prototype;

    /** @lends maptalks.Class.prototype */
    var proto = Z.Util.create(parentProto);

    proto.constructor = NewClass;

    NewClass.prototype = proto;

    // inherit parent's statics
    for (var i in this) {
        if (i[0] !== '_' && this.hasOwnProperty(i) && i !== 'prototype') {
            NewClass[i] = this[i];
        }
    }

    // mix static properties into the class
    if (props.statics) {
        Z.Util.extend(NewClass, props.statics);
        delete props.statics;
    }

    // mix includes into the prototype
    if (props.includes) {
        Z.Util.extend.apply(null, [proto].concat(props.includes));
        delete props.includes;
    }

    // merge options
    if (proto.options) {
        props.options = Z.Util.extend(Z.Util.create(proto.options), props.options);
    }

    // exception definitions
    if (props.exceptionDefs) {
        var lang = Z.Browser.language;
        if (lang !== 'zh-CN') {
            lang = 'en-US'; //only support chinese and english now;
        }
        Z.Util.extend(proto, {exceptions:props.exceptionDefs[lang]});
        delete props.exceptionDefs;
    }

    // mix given properties into the prototype
    Z.Util.extend(proto, props);

    proto._initHooks = [];

    // add method for calling all hooks
    proto.callInitHooks = function () {

        if (this._initHooksCalled) { return; }

        if (parentProto.callInitHooks) {
            parentProto.callInitHooks.call(this);
        }

        this._initHooksCalled = true;

        for (var i = 0, len = proto._initHooks.length; i < len; i++) {
            proto._initHooks[i].call(this);
        }
    };

    /**
     * Get options without any parameter or update one (key, value) or more options (object).<br>
     * If the instance has a handler of the same name with the option key, the handler will be enabled or disabled when the option is updated.
     * @param  {object|string} options - options to update
     * @return {object|this}
     */
    proto.config = function (conf) {
        if (!conf) {
            var config = {};
            for (var p in this.options) {
                if (this.options.hasOwnProperty(p)) {
                    config[p] = this.options[p];
                }
            }
            return config;
        } else {
            if (arguments.length === 2) {
                var convert = {};
                convert[conf] = arguments[1];
                conf = convert;
            }
            for (var i in conf) {
                if (conf.hasOwnProperty(i)) {
                    this.options[i] = conf[i];
                    //handler
                    if (this[i] && (this[i] instanceof Z.Handler)) {
                        if (conf[i]) {
                            this[i].enable();
                        } else {
                            this[i].disable();
                        }
                    }
                }
            }
            //callback when set config
            if (this.onConfig) {
                this.onConfig(conf);
            }
        }
        return this;
    };

    return NewClass;
};


/**
 * method for adding properties to prototype
 * @param  {object} props - additional instance methods or properties
 * @static
 */
Z.Class.include = function () {
    var sources = arguments;
    for (var j = 0, len = sources.length; j < len; j++) {
        Z.Util.extend(this.prototype, sources[j]);
    }

};

/**
 * merge new default options to the Class
 * @param  {object} options - default options.
 * @static
 */
Z.Class.mergeOptions = function (options) {
    Z.Util.extend(this.prototype.options, options);
};

/**
 * add a constructor hook
 * @param {string|function} fn - a hook function or name of the hook function and arguments
 * @static
 */
Z.Class.addInitHook = function (fn) { // (Function) || (String, args...)
    var args = Array.prototype.slice.call(arguments, 1);

    var init = typeof fn === 'function' ? fn : function () {
        this[fn].apply(this, args);
    };

    this.prototype._initHooks = this.prototype._initHooks || [];
    this.prototype._initHooks.push(init);
};

/**
 * Represents a coordinate point <br>
 * e.g. <br>
 * a geographical point with a certain latitude and longitude <br>
 * a point in a indoor room
 * @class
 * @category basic types
 * @param {Number} x - x value
 * @param {Number} y - y value
 */
Z.Coordinate = function (x, y) {
    if (!Z.Util.isNil(x) && !Z.Util.isNil(y)) {
        /**
         * @property {Number} x - value on X-Axis or longitude in degrees
         */
        this.x = +(x);
        /**
         * @property {Number} y - value on Y-Axis or Latitude in degrees
         */
        this.y = +(y);
    } else if (Z.Util.isArray(x)) {
        //数组
        this.x = +(x[0]);
        this.y = +(x[1]);
    } else if (!Z.Util.isNil(x['x']) && !Z.Util.isNil(x['y'])) {
        //对象
        this.x = +(x['x']);
        this.y = +(x['y']);
    }
    if (this.isNaN()) {
        throw new Error('coordinate is NaN');
    }
};

Z.Util.extend(Z.Coordinate.prototype, /** @lends maptalks.Coordinate.prototype */{
    /**
     * Returns a copy of the coordinate
     * @return {maptalks.Coordinate} copy
     */
    copy:function () {
        return new Z.Coordinate(this.x, this.y);
    },

    //destructive add, to improve performance in some circumstances.
    _add: function (x, y) {
        if (x instanceof Z.Coordinate) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y;
        }
        return this;
    },
    /**
     * Returns the result of addition of another coordinate.
     * @param {maptalks.Coordinate} coordinate - coordinate to add
     * @return {maptalks.Coordinate} result
     */
    add:function (x, y) {
        var nx, ny;
        if (x instanceof Z.Coordinate) {
            nx = this.x + x.x;
            ny = this.y + x.y;
        } else {
            nx = this.x + x;
            ny = this.y + y;
        }
        return new Z.Coordinate(nx, ny);
    },

    //destructive substract
    _substract: function (x, y) {
        if (x instanceof Z.Coordinate) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y;
        }
        return this;
    },

    /**
     * Returns the result of subtraction of another coordinate.
     * @param {maptalks.Coordinate} coordinate - coordinate to substract
     * @return {maptalks.Coordinate} result
     */
    substract:function (x, y) {
        var nx, ny;
        if (x instanceof Z.Coordinate) {
            nx = this.x - x.x;
            ny = this.y - x.y;
        } else {
            nx = this.x - x;
            ny = this.y - y;
        }
        return new Z.Coordinate(nx, ny);
    },

    /**
     * Returns the result of multiplication of the current coordinate by the given number.
     * @param {Number} ratio - ratio to multi
     * @return {maptalks.Coordinate} result
     */
    multi: function (ratio) {
        return new Z.Coordinate(this.x * ratio, this.y * ratio);
    },

    _multi: function (ratio) {
        this.x *= ratio;
        this.y *= ratio;
        return this;
    },

    /**
     * Compare with another coordinate to see whether they are equal.
     * @param {maptalks.Coordinate} c2 - coordinate to compare
     * @return {Boolean}
     */
    equals:function (c2) {
        if (!Z.Util.isCoordinate(c2)) {
            return false;
        }
        return this.x === c2.x && this.y === c2.y;
    },

    isNaN:function () {
        return isNaN(this.x) || isNaN(this.y);
    },

    /**
     * Convert the coordinate to a number array [x, y]
     * @return {Number[]} number array
     */
    toArray:function () {
        return [this.x, this.y];
    },

    /**
     * toJSON
     * @return {Object} json
     */
    toJSON: function () {
        return {
            x : this.x,
            y : this.y
        };
    }
});

/**
 * Represents a 2d point.<br>
 * Can be created in serveral ways:
 * @example
 * var point = new maptalks.Point(1000, 1000);
 * @example
 * var point = new maptalks.Point([1000,1000]);
 * @example
 * var point = new maptalks.Point({x:1000, y:1000});
 * @class
 * @category basic types
 * @param {Number} x - x value
 * @param {Number} y - y value
 */
Z.Point = function (x, y) {
    if (!Z.Util.isNil(x) && !Z.Util.isNil(y)) {
        /**
         * @property x {Number} - x value
         */
        this.x = x;
        /**
         * @property y {Number} - y value
         */
        this.y = y;
    } else if (!Z.Util.isNil(x.x) && !Z.Util.isNil(x.y)) {
        //对象
        this.x = x.x;
        this.y = x.y;
    } else if (Z.Util.isArrayHasData(x)) {
        this.x = x[0];
        this.y = x[1];
    }
    if (this.isNaN()) {
        throw new Error('point is NaN');
    }
};

Z.Util.extend(Z.Point.prototype, /** @lends maptalks.Point.prototype */{
    _abs:function () {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    },
    /**
     * Returns a copy of the point
     * @return {maptalks.Point} copy
     */
    copy:function () {
        return new Z.Point(this.x, this.y);
    },

    _round:function () {
        this.x = Z.Util.round(this.x);
        this.y = Z.Util.round(this.y);
        return this;
    },

    round:function () {
        return new Z.Point(Z.Util.round(this.x), Z.Util.round(this.y));
    },

    /**
     * Compare with another point to see whether they are equal.
     * @param {maptalks.Point} c2 - point to compare
     * @return {Boolean}
     */
    equals:function (p) {
        return this.x === p.x && this.y === p.y;
    },

    /**
     * Returns the distance between the current and the given point.
     * @param  {maptalks.Point} point - another point
     * @return {Number} distance
     */
    distanceTo: function (point) {
        var x = point.x - this.x,
            y = point.y - this.y;
        return Math.sqrt(x * x + y * y);
    },

    //Destructive add
    _add: function (x, y) {
        if (x instanceof Z.Point) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y;
        }
        return this;
    },

    /**
     * Returns the result of addition of another point.
     * @param {maptalks.Point} point - point to add
     * @return {maptalks.Point} result
     */
    add: function (x, y) {
        var nx, ny;
        if (x instanceof Z.Point) {
            nx = this.x + x.x;
            ny = this.y + x.y;
        } else {
            nx = this.x + x;
            ny = this.y + y;
        }
        return new Z.Point(nx, ny);
    },

    _substract: function (x, y) {
        if (x instanceof Z.Point) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y;
        }
        return this;
    },

    /**
     * Returns the result of subtraction of another point.
     * @param {maptalks.Point} point - point to substract
     * @return {maptalks.Point} result
     */
    substract: function (x, y) {
        var nx, ny;
        if (x instanceof Z.Point) {
            nx = this.x - x.x;
            ny = this.y - x.y;
        } else {
            nx = this.x - x;
            ny = this.y - y;
        }
        return new Z.Point(nx, ny);
    },

    //破坏性方法
    _multi: function (ratio) {
        this.x *= ratio;
        this.y *= ratio;
        return this;
    },

    /**
     * Returns the result of multiplication of the current point by the given number.
     * @param {Number} ratio - ratio to multi
     * @return {maptalks.Point} result
     */
    multi: function (ratio) {
        return new Z.Point(this.x * ratio, this.y * ratio);
    },

    isNaN:function () {
        return isNaN(this.x) || isNaN(this.y);
    },

    /**
     * toJSON
     * @return {Object} json
     */
    toJSON: function () {
        return {
            x : this.x,
            y : this.y
        };
    }
});

/**
 * Represents a size.
 * @class
 * @category basic types
 * @param {Number} width - width value
 * @param {Number} height - height value
 */
Z.Size = function (width, height) {
    /**
     * @property {Number} width - width
     */
    this.width = width;
    /**
     * @property {Number} height - height
     */
    this.height = height;
};

Z.Util.extend(Z.Size.prototype, /** @lends maptalks.Size.prototype */{
    /**
     * Returns a copy of the size
     * @return {maptalks.Size} copy
     */
    copy:function () {
        return new Z.Size(this['width'], this['height']);
    },
    /**
     * Returns the result of addition of another size.
     * @param {maptalks.Size} size - size to add
     * @return {maptalks.Size} result
     */
    add:function (size) {
        return new Z.Size(this['width'] + size['width'], this['height'] + size['height']);
    },
    /**
     * Compare with another size to see whether they are equal.
     * @param {maptalks.Size} size - size to compare
     * @return {Boolean}
     */
    equals:function (size) {
        return this['width'] === size['width'] && this['height'] === size['height'];
    },
    /**
     * Returns the result of multiplication of the current size by the given number.
     * @param {Number} ratio - ratio to multi
     * @return {maptalks.Size} result
     */
    multi:function (ratio) {
        return new Z.Size(this['width'] * ratio, this['height'] * ratio);
    },
    _multi:function (ratio) {
        this['width'] *= ratio;
        this['height'] *= ratio;
        return this;
    },
    _round:function () {
        this['width'] = Z.Util.round(this['width']);
        this['height'] = Z.Util.round(this['height']);
        return this;
    },
    toPoint:function () {
        return new Z.Point(this['width'], this['height']);
    },

    toArray: function () {
        return [this['width'], this['height']];
    },

    /**
     * toJSON
     * @return {Object} json
     */
    toJSON: function () {
        return {
            'width' : this['width'],
            'height': this['height']
        };
    }
});


/**
 * Represent CRS defined by [GeoJSON]{@link http://geojson.org/geojson-spec.html#coordinate-reference-system-objects}
 *
 * @class
 * @category geo
 * @param {String} type          - type of the CRS
 * @param {Object} properties    - CRS's properties
 */
Z.CRS = function (type, properties) {
    this.type = type;
    this.properties = properties;
};

/**
 * Create a [proj4]{@link https://github.com/OSGeo/proj.4} style CRS used by maptalks <br>
 * @example
 * {
 *     "type"       : "proj4",
 *     "properties" : {
 *         "proj"   : "+proj=longlat +datum=WGS84 +no_defs"
 *     }
 * }
 * var crs_wgs84 = maptalks.CRS.createProj4("+proj=longlat +datum=WGS84 +no_defs");
 * @static
 * @param  {String} proj - a proj4 projection string.
 * @return {maptalks.CRS}
 */
Z.CRS.createProj4 = function (proj) {
    return new Z.CRS('proj4', {
        'proj': proj
    });
};

//some common CRS definitions
/**
 * Predefined CRS of well-known WGS84 (aka EPSG:4326)
 * @type {maptalks.CRS}
 * @static
 * @constant
 */
Z.CRS.WGS84 = Z.CRS.createProj4('+proj=longlat +datum=WGS84 +no_defs');
/**
 * Alias for maptalks.CRS.WGS84
 * @type {maptalks.CRS}
 * @static
 * @constant
 */
Z.CRS.EPSG4326 = Z.CRS.WGS84;
/**
 * Projected Coordinate System used by google maps that has the following alias: 'EPSG:3785', 'GOOGLE', 'EPSG:900913'
 * @type {maptalks.CRS}
 * @static
 * @constant
 */
Z.CRS.EPSG3857 = Z.CRS.createProj4('+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');
/**
 * A CRS represents a simple Cartesian coordinate system. <br>
 * Maps x, y directly, is useful for maps of flat surfaces (e.g. indoor maps, game maps).
 * @type {maptalks.CRS}
 * @static
 * @constant
 */
Z.CRS.IDENTITY = Z.CRS.createProj4('+proj=identity +no_defs');
/**
 * Official coordinate system in China (aka EPSG:4490), in most cases, it can be considered the same with WGS84.
 * @type {maptalks.CRS}
 * @see  {@link http://spatialreference.org/ref/sr-org/7408/}
 * @static
 * @constant
 */
Z.CRS.CGCS2000 = Z.CRS.createProj4('+proj=longlat +datum=CGCS2000');
/**
 * Alias for maptalks.CRS.CGCS2000
 * @type {maptalks.CRS}
 * @static
 * @constant
 */
Z.CRS.EPSG4490 = Z.CRS.CGCS2000;
/**
 * Projection used by [Baidu Map]{@link http://map.baidu.com}, a popular web map service in China.
 * @type {maptalks.CRS}
 * @static
 * @constant
 */
Z.CRS.BD09LL = Z.CRS.createProj4('+proj=longlat +datum=BD09');
/**
 * A encrypted CRS usded in the most online map services in China..
 * @type {maptalks.CRS}
 * @see {@link https://en.wikipedia.org/wiki/Restrictions_on_geographic_data_in_China}
 * @static
 * @constant
 */
Z.CRS.GCJ02 = Z.CRS.createProj4('+proj=longlat +datum=GCJ02');

/**
 * Represent a bounding box on the map, a rectangular geographical area with minimum and maximum coordinates. <br>
 * There are serveral ways to create a extent:
 * @class
 * @category basic types
 * @param {Number} x1   - x of coordinate 1
 * @param {Number} y1   - y of coordinate 1
 * @param {Number} x2   - x of coordinate 2
 * @param {Number} y2   - y of coordinate 2
 * @example
 * //with 4 numbers
 * var extent = new maptalks.Extent(100, 10, 120, 20);
 * @example
 * //with 2 coordinates
 * var extent = new maptalks.Extent(new maptalks.Coordinate(100, 10), new maptalks.Coordinate(120, 20));
 * @example
 * //with a json object containing xmin, ymin, xmax and ymax
 * var extent = new maptalks.Extent({xmin : 100, ymin: 10, xmax: 120, ymax:20});
 * @example
 * var extent1 = new maptalks.Extent(100, 10, 120, 20);
 * //with another extent
 * var extent2 = new maptalks.Extent(extent1);
 */
Z.Extent = function (p1, p2, p3, p4) {
    this._clazz = Z.Coordinate;
    this._initialize(p1, p2, p3, p4);
};

Z.Util.extend(Z.Extent.prototype, /** @lends maptalks.Extent.prototype */{
    _initialize:function (p1, p2, p3, p4) {
        /**
         * @property {Number} xmin - minimum x
         */
        this.xmin = null;
        /**
         * @property {Number} xmax - maximum x
         */
        this.xmax = null;
        /**
         * @property {Number} ymin - minimum y
         */
        this.ymin = null;
        /**
         * @property {Number} ymax - maximum y
         */
        this.ymax = null;
        if (Z.Util.isNil(p1)) {
            return;
        }
        //Constructor 1: all numbers
        if (Z.Util.isNumber(p1) &&
            Z.Util.isNumber(p2) &&
            Z.Util.isNumber(p3) &&
            Z.Util.isNumber(p4)) {
            this['xmin'] = Math.min(p1, p3);
            this['ymin'] = Math.min(p2, p4);
            this['xmax'] = Math.max(p1, p3);
            this['ymax'] = Math.max(p2, p4);
            return;
        } else if (Z.Util.isNumber(p1.x) &&
            Z.Util.isNumber(p2.x) &&
            Z.Util.isNumber(p1.y) &&
            Z.Util.isNumber(p2.y)) {
            //Constructor 2: two coordinates
            if (p1.x > p2.x) {
                this['xmin'] = p2.x;
                this['xmax'] = p1.x;
            } else {
                this['xmin'] = p1.x;
                this['xmax'] = p2.x;
            }
            if (p1.y > p2.y) {
                this['ymin'] = p2.y;
                this['ymax'] = p1.y;
            } else {
                this['ymin'] = p1.y;
                this['ymax'] = p2.y;
            }
            //constructor 3: another extent or a object containing xmin, ymin, xmax and ymax
        } else if (Z.Util.isNumber(p1['xmin']) &&
                Z.Util.isNumber(p1['xmax']) &&
                Z.Util.isNumber(p1['ymin']) &&
                Z.Util.isNumber(p1['ymax'])) {
            this['xmin'] = p1['xmin'];
            this['ymin'] = p1['ymin'];
            this['xmax'] = p1['xmax'];
            this['ymax'] = p1['ymax'];
        }
    },

    _add: function (p) {
        this['xmin'] += p.x;
        this['ymin'] += p.y;
        this['xmax'] += p.x;
        this['ymax'] += p.y;
        return this;
    },

    add: function (p) {
        return new this.constructor(this['xmin'] + p.x, this['ymin'] + p.y, this['xmax'] + p.x, this['ymax'] + p.y);
    },

    round:function () {
        return new this.constructor(Z.Util.round(this['xmin']), Z.Util.round(this['ymin']),
            Z.Util.round(this['xmax']), Z.Util.round(this['ymax']));
    },

    _round:function () {
        this['xmin'] = Z.Util.round(this['xmin']);
        this['ymin'] = Z.Util.round(this['ymin']);
        this['xmax'] = Z.Util.round(this['xmax']);
        this['ymax'] = Z.Util.round(this['ymax']);
        return this;
    },

    /**
     * Get the minimum point
     * @return {maptalks.Coordinate}
     */
    getMin:function () {
        return new this._clazz(this['xmin'], this['ymin']);
    },

    /**
     * Get the maximum point
     * @return {maptalks.Coordinate}
     */
    getMax:function () {
        return new this._clazz(this['xmax'], this['ymax']);
    },


    /**
     * Get center of the extent.
     * @return {maptalks.Coordinate}
     */
    getCenter:function () {
        return new this._clazz((this['xmin'] + this['xmax']) / 2, (this['ymin'] + this['ymax']) / 2);
    },

    /**
     * Whether the extent is valid
     * @protected
     * @return {Boolean}
     */
    isValid:function () {
        return Z.Util.isNumber(this['xmin']) &&
                Z.Util.isNumber(this['ymin']) &&
                Z.Util.isNumber(this['xmax']) &&
                Z.Util.isNumber(this['ymax']);
    },


    /**
     * Compare with another extent to see whether they are equal.
     * @param  {maptalks.Extent}  ext2 - extent to compare
     * @return {Boolean}
     */
    equals:function (ext2) {
        return (this['xmin'] === ext2['xmin'] &&
            this['xmax'] === ext2['xmax'] &&
            this['ymin'] === ext2['ymin'] &&
            this['ymax'] === ext2['ymax']);
    },

    /**
     * Whether it intersects with another extent
     * @param  {maptalks.Extent}  ext2 - another extent
     * @return {Boolean}
     */
    intersects:function (ext2) {
        var rxmin = Math.max(this['xmin'], ext2['xmin']);
        var rymin = Math.max(this['ymin'], ext2['ymin']);
        var rxmax = Math.min(this['xmax'], ext2['xmax']);
        var rymax = Math.min(this['ymax'], ext2['ymax']);
        var intersects = !((rxmin > rxmax) || (rymin > rymax));
        return intersects;
    },

    /**
     * Whether the extent contains the input point.
     * @param  {maptalks.Coordinate|Number[]} coordinate - input point
     * @returns {Boolean}
     */
    contains: function (coordinate) {
        var x, y;
        var c = new this._clazz(coordinate);
        x = c.x;
        y = c.y;
        return (x >= this.xmin) &&
            (x <= this.xmax) &&
            (y >= this.ymin) &&
            (y <= this.ymax);
    },

    /**
     * Get the width of the Extent
     * @return {Number}
     */
    getWidth:function () {
        return this['xmax'] - this['xmin'];
    },

    /**
     * Get the height of the Extent
     * @return {Number}
     */
    getHeight:function () {
        return this['ymax'] - this['ymin'];
    },


    __combine:function (extent) {
        var xmin = this['xmin'];
        if (!Z.Util.isNumber(xmin)) {
            xmin = extent['xmin'];
        } else if (Z.Util.isNumber(extent['xmin'])) {
            if (xmin > extent['xmin']) {
                xmin = extent['xmin'];
            }
        }

        var xmax = this['xmax'];
        if (!Z.Util.isNumber(xmax)) {
            xmax = extent['xmax'];
        } else if (Z.Util.isNumber(extent['xmax'])) {
            if (xmax < extent['xmax']) {
                xmax = extent['xmax'];
            }
        }

        var ymin = this['ymin'];
        if (!Z.Util.isNumber(ymin)) {
            ymin = extent['ymin'];
        } else if (Z.Util.isNumber(extent['ymin'])) {
            if (ymin > extent['ymin']) {
                ymin = extent['ymin'];
            }
        }

        var ymax = this['ymax'];
        if (!Z.Util.isNumber(ymax)) {
            ymax = extent['ymax'];
        } else if (Z.Util.isNumber(extent['ymax'])) {
            if (ymax < extent['ymax']) {
                ymax = extent['ymax'];
            }
        }
        return [xmin, ymin, xmax, ymax];
    },

    _combine:function (extent) {
        if (!extent) {
            return this;
        }
        var ext = this.__combine(extent);
        this['xmin'] = ext[0];
        this['ymin'] = ext[1];
        this['xmax'] = ext[2];
        this['ymax'] = ext[3];
        return this;
    },

    /**
     * Combine it with another extent to a larger extent.
     * @param  {maptalks.Extent} extent - another extent
     * @returns {maptalks.Extent} extent combined
     */
    combine:function (extent) {
        if (!extent) {
            return this;
        }
        var ext = this.__combine(extent);
        return new this.constructor(ext[0], ext[1], ext[2], ext[3]);
    },

    /**
     * Gets the intersection extent of this and another extent.
     * @param  {maptalks.Extent} extent - another extent
     * @return {maptalks.Extent} intersection extent
     */
    intersection:function (extent) {
        if (!this.intersects(extent)) {
            return null;
        }
        return new this.constructor(Math.max(this['xmin'], extent['xmin']), Math.max(this['ymin'], extent['ymin']),
            Math.min(this['xmax'], extent['xmax']), Math.min(this['ymax'], extent['ymax'])
            );
    },

    /**
     * Expand the extent by distance
     * @param  {maptalks.Size|Number} distance  - distance to expand
     * @returns {maptalks.Extent} a new extent expanded from
     */
    expand:function (distance) {
        if (distance instanceof Z.Size) {
            return new this.constructor(this['xmin'] - distance['width'], this['ymin'] - distance['height'], this['xmax'] + distance['width'], this['ymax'] + distance['height']);
        } else {
            return new this.constructor(this['xmin'] - distance, this['ymin'] - distance, this['xmax'] + distance, this['ymax'] + distance);
        }
    },

    _expand:function (distance) {
        if (distance instanceof Z.Size) {
            this['xmin'] -= distance['width'];
            this['ymin'] -= distance['height'];
            this['xmax'] += distance['width'];
            this['ymax'] += distance['height'];
        } else {
            this['xmin'] -= distance;
            this['ymin'] -= distance;
            this['xmax'] += distance;
            this['ymax'] += distance;
        }
        return this;
    },

    /**
     * Get extent's JSON object.
     * @return {Object} jsonObject
     * @example
     * // {xmin : 100, ymin: 10, xmax: 120, ymax:20}
     * var json = extent.toJSON();
     */
    toJSON:function () {
        return {
            'xmin':this['xmin'],
            'ymin':this['ymin'],
            'xmax':this['xmax'],
            'ymax':this['ymax']
        };
    },

    /**
     * Get a coordinate array of extent's rectangle area, containing 5 coordinates in which the first equals with the last.
     * @return {maptalks.Coordinate[]} coordinates array
     */
    toArray:function () {
        var xmin = this['xmin'],
            ymin = this['ymin'],
            xmax = this['xmax'],
            ymax = this['ymax'];
        return [
            new this._clazz([xmin, ymax]), new this._clazz([xmax, ymax]),
            new this._clazz([xmax, ymin]), new this._clazz([xmin, ymin]),
            new this._clazz([xmin, ymax])
        ];
    },

    /**
     * Get a copy of the extent.
     * @return {maptalks.Extent} copy
     */
    copy:function () {
        return new this.constructor(this['xmin'], this['ymin'], this['xmax'], this['ymax']);
    }
});

/**
 * Represent a bounding box on 2d surface , a rectangular area with minimum and maximum points. <br>
 * There are serveral ways to create a PointExtent:
 * @class
 * @category basic types
 * @param {Number} x1   - x of point 1
 * @param {Number} y1   - y of point 1
 * @param {Number} x2   - x of point 2
 * @param {Number} y2   - y of point 2
 * @extends {maptalks.Extent}
 * @example
 * //with 4 numbers
 * var extent = new maptalks.PointExtent(100, 10, 120, 20);
 * @example
 * //with 2 points
 * var extent = new maptalks.PointExtent(new maptalks.Point(100, 10), new maptalks.Point(120, 20));
 * @example
 * //with a json object containing xmin, ymin, xmax and ymax
 * var extent = new maptalks.PointExtent({xmin : 100, ymin: 10, xmax: 120, ymax:20});
 * @example
 * var extent1 = new maptalks.PointExtent(100, 10, 120, 20);
 * //with another extent
 * var extent2 = new maptalks.PointExtent(extent1);
 */
Z.PointExtent = function (p1, p2, p3, p4) {
    this._clazz = Z.Point;
    this._initialize(p1, p2, p3, p4);
};

Z.Util.extend(Z.PointExtent.prototype, Z.Extent.prototype, /** @lends maptalks.PointExtent.prototype */{
    /**
     * Get size of the PointExtent
     * @return {maptalks.Size}
     */
    getSize:function () {
        return new Z.Size(this.getWidth(), this.getHeight());
    }
});

/*!
	2D Transformation Matrix v2.0

	(c) Epistemex 2014-2015
	www.epistemex.com
	By Ken Nilsen
	Contributions by leeoniya.
	License: MIT, header required.
*/

/**
 * 2D transformation matrix object initialized with identity matrix.<br>
 *
 * The matrix can synchronize a canvas context by supplying the context
 * as an argument, or later apply current absolute transform to an
 * existing context.<br>
 *
 * All values are handled as floating point values.<br>
 *
 * @param {CanvasRenderingContext2D} [context] - Optional context to sync with Matrix
 * @prop {number} a - scale x
 * @prop {number} b - shear y
 * @prop {number} c - shear x
 * @prop {number} d - scale y
 * @prop {number} e - translate x
 * @prop {number} f - translate y
 * @prop {CanvasRenderingContext2D|null} [context=null] - set or get current canvas context
 * @protected
 * @constructor
 */
Z.Matrix = function(context) {

	var me = this;
	me._t = me.transform;

	me.a = me.d = 1;
	me.b = me.c = me.e = me.f = 0;

	me.context = context;

	// reset canvas transformations (if any) to enable 100% sync.
	if (context) context.setTransform(1, 0, 0, 1, 0, 0);
};

var Matrix = Z.Matrix;

Z.Matrix.prototype = {

	/**
	 * Concatenates transforms of this matrix onto the given child matrix and
	 * returns a new matrix. This instance is used on left side.
	 *
	 * @param {Matrix} cm - child matrix to apply concatenation to
	 * @returns {Matrix}
	 */
	concat: function(cm) {
		return this.clone()._t(cm.a, cm.b, cm.c, cm.d, cm.e, cm.f);
	},

	/**
	 * Flips the horizontal values.
	 */
	flipX: function() {
		return this._t(-1, 0, 0, 1, 0, 0);
	},

	/**
	 * Flips the vertical values.
	 */
	flipY: function() {
		return this._t(1, 0, 0, -1, 0, 0);
	},

	/**
	 * Reflects incoming (velocity) vector on the normal which will be the
	 * current transformed x axis. Call when a trigger condition is met.
	 *
	 * NOTE: BETA, simple implementation
	 *
	 * @param {number} x - vector end point for x (start = 0)
	 * @param {number} y - vector end point for y (start = 0)
	 * @returns {{x: number, y: number}}
	 */
	reflectVector: function(x, y) {

		var v = this.applyToPoint(0, 1),
			d = 2 * (v.x * x + v.y * y);

		x -= d * v.x;
		y -= d * v.y;

		return {x:x, y:y};
	},

	/**
	 * Short-hand to reset current matrix to an identity matrix.
	 */
	reset: function() {
		return this.setTransform(1, 0, 0, 1, 0, 0);
	},

	/**
	 * Rotates current matrix accumulative by angle.
	 * @param {number} angle - angle in radians
	 */
	rotate: function(angle) {
		var cos = Math.cos(angle),
			sin = Math.sin(angle);
		return this._t(cos, sin, -sin, cos, 0, 0);
	},

	/**
	 * Converts a vector given as x and y to angle, and
	 * rotates (accumulative).
	 * @param x
	 * @param y
	 * @returns {*}
	 */
	rotateFromVector: function(x, y) {
		return this.rotate(Math.atan2(y, x));
	},

	/**
	 * Helper method to make a rotation based on an angle in degrees.
	 * @param {number} angle - angle in degrees
	 */
	rotateDeg: function(angle) {
		return this.rotate(angle * Math.PI / 180);
	},

	/**
	 * Scales current matrix uniformly and accumulative.
	 * @param {number} f - scale factor for both x and y (1 does nothing)
	 */
	scaleU: function(f) {
        if (f === 1) {
            return this;
        }
		return this._t(f, 0, 0, f, 0, 0);
	},

	/**
	 * Scales current matrix accumulative.
	 * @param {number} sx - scale factor x (1 does nothing)
	 * @param {number} sy - scale factor y (1 does nothing)
	 */
	scale: function(sx, sy) {
		return this._t(sx, 0, 0, sy, 0, 0);
	},

	/**
	 * Scales current matrix on x axis accumulative.
	 * @param {number} sx - scale factor x (1 does nothing)
	 */
	scaleX: function(sx) {
		return this._t(sx, 0, 0, 1, 0, 0);
	},

	/**
	 * Scales current matrix on y axis accumulative.
	 * @param {number} sy - scale factor y (1 does nothing)
	 */
	scaleY: function(sy) {
		return this._t(1, 0, 0, sy, 0, 0);
	},

	/**
	 * Apply shear to the current matrix accumulative.
	 * @param {number} sx - amount of shear for x
	 * @param {number} sy - amount of shear for y
	 */
	shear: function(sx, sy) {
		return this._t(1, sy, sx, 1, 0, 0);
	},

	/**
	 * Apply shear for x to the current matrix accumulative.
	 * @param {number} sx - amount of shear for x
	 */
	shearX: function(sx) {
		return this._t(1, 0, sx, 1, 0, 0);
	},

	/**
	 * Apply shear for y to the current matrix accumulative.
	 * @param {number} sy - amount of shear for y
	 */
	shearY: function(sy) {
		return this._t(1, sy, 0, 1, 0, 0);
	},

	/**
	 * Apply skew to the current matrix accumulative.
	 * @param {number} ax - angle of skew for x
	 * @param {number} ay - angle of skew for y
	 */
	skew: function(ax, ay) {
		return this.shear(Math.tan(ax), Math.tan(ay));
	},

	/**
	 * Apply skew for x to the current matrix accumulative.
	 * @param {number} ax - angle of skew for x
	 */
	skewX: function(ax) {
		return this.shearX(Math.tan(ax));
	},

	/**
	 * Apply skew for y to the current matrix accumulative.
	 * @param {number} ay - angle of skew for y
	 */
	skewY: function(ay) {
		return this.shearY(Math.tan(ay));
	},

	/**
	 * Set current matrix to new absolute matrix.
	 * @param {number} a - scale x
	 * @param {number} b - shear y
	 * @param {number} c - shear x
	 * @param {number} d - scale y
	 * @param {number} e - translate x
	 * @param {number} f - translate y
	 */
	setTransform: function(a, b, c, d, e, f) {
		var me = this;
		me.a = a;
		me.b = b;
		me.c = c;
		me.d = d;
		me.e = e;
		me.f = f;
		return me._x();
	},

	/**
	 * Translate current matrix accumulative.
	 * @param {number} tx - translation for x
	 * @param {number} ty - translation for y
	 */
	translate: function(tx, ty) {
		return this._t(1, 0, 0, 1, tx, ty);
	},

	/**
	 * Translate current matrix on x axis accumulative.
	 * @param {number} tx - translation for x
	 */
	translateX: function(tx) {
		return this._t(1, 0, 0, 1, tx, 0);
	},

	/**
	 * Translate current matrix on y axis accumulative.
	 * @param {number} ty - translation for y
	 */
	translateY: function(ty) {
		return this._t(1, 0, 0, 1, 0, ty);
	},

	/**
	 * Multiplies current matrix with new matrix values.
	 * @param {number} a2 - scale x
	 * @param {number} b2 - shear y
	 * @param {number} c2 - shear x
	 * @param {number} d2 - scale y
	 * @param {number} e2 - translate x
	 * @param {number} f2 - translate y
	 */
	transform: function(a2, b2, c2, d2, e2, f2) {

		var me = this,
			a1 = me.a,
			b1 = me.b,
			c1 = me.c,
			d1 = me.d,
			e1 = me.e,
			f1 = me.f;

		/* matrix order (canvas compatible):
		* ace
		* bdf
		* 001
		*/
		me.a = a1 * a2 + c1 * b2;
		me.b = b1 * a2 + d1 * b2;
		me.c = a1 * c2 + c1 * d2;
		me.d = b1 * c2 + d1 * d2;
		me.e = a1 * e2 + c1 * f2 + e1;
		me.f = b1 * e2 + d1 * f2 + f1;

		return me._x();
	},

	/**
	 * Divide this matrix on input matrix which must be invertible.
	 * @param {Matrix} m - matrix to divide on (divisor)
	 * @returns {Matrix}
	 */
	divide: function(m) {

		if (!m.isInvertible())
			throw "Input matrix is not invertible";

		var im = m.inverse();

		return this._t(im.a, im.b, im.c, im.d, im.e, im.f);
	},

	/**
	 * Divide current matrix on scalar value != 0.
	 * @param {number} d - divisor (can not be 0)
	 * @returns {Matrix}
	 */
	divideScalar: function(d) {

		var me = this;
		me.a /= d;
		me.b /= d;
		me.c /= d;
		me.d /= d;
		me.e /= d;
		me.f /= d;

		return me._x();
	},

	/**
	 * Get an inverse matrix of current matrix. The method returns a new
	 * matrix with values you need to use to get to an identity matrix.
	 * Context from parent matrix is not applied to the returned matrix.
	 * @returns {Matrix}
	 */
	inverse: function() {

		if (this.isIdentity()) {
			return new Matrix();
		}
		else if (!this.isInvertible()) {
			throw "Matrix is not invertible.";
		}
		else {
			var me = this,
				a = me.a,
				b = me.b,
				c = me.c,
				d = me.d,
				e = me.e,
				f = me.f,

				m = new Matrix(),
				dt = a * d - b * c;	// determinant(), skip DRY here...

			m.a = d / dt;
			m.b = -b / dt;
			m.c = -c / dt;
			m.d = a / dt;
			m.e = (c * f - d * e) / dt;
			m.f = -(a * f - b * e) / dt;

			return m;
		}
	},

	/**
	 * Interpolate this matrix with another and produce a new matrix.
	 * t is a value in the range [0.0, 1.0] where 0 is this instance and
	 * 1 is equal to the second matrix. The t value is not constrained.
	 *
	 * Context from parent matrix is not applied to the returned matrix.
	 *
	 * Note: this interpolation is naive. For animation use the
	 * intrpolateAnim() method instead.
	 *
	 * @param {Matrix} m2 - the matrix to interpolate with.
	 * @param {number} t - interpolation [0.0, 1.0]
	 * @param {CanvasRenderingContext2D} [context] - optional context to affect
	 * @returns {Matrix} - new instance with the interpolated result
	 */
	interpolate: function(m2, t, context) {

		var me = this,
			m = context ? new Matrix(context) : new Matrix();

		m.a = me.a + (m2.a - me.a) * t;
		m.b = me.b + (m2.b - me.b) * t;
		m.c = me.c + (m2.c - me.c) * t;
		m.d = me.d + (m2.d - me.d) * t;
		m.e = me.e + (m2.e - me.e) * t;
		m.f = me.f + (m2.f - me.f) * t;

		return m._x();
	},

	/**
	 * Interpolate this matrix with another and produce a new matrix.
	 * t is a value in the range [0.0, 1.0] where 0 is this instance and
	 * 1 is equal to the second matrix. The t value is not constrained.
	 *
	 * Context from parent matrix is not applied to the returned matrix.
	 *
	 * Note: this interpolation method uses decomposition which makes
	 * it suitable for animations (in particular where rotation takes
	 * places).
	 *
	 * @param {Matrix} m2 - the matrix to interpolate with.
	 * @param {number} t - interpolation [0.0, 1.0]
	 * @param {CanvasRenderingContext2D} [context] - optional context to affect
	 * @returns {Matrix} - new instance with the interpolated result
	 */
	interpolateAnim: function(m2, t, context) {

		var me = this,
			m = context ? new Matrix(context) : new Matrix(),
			d1 = me.decompose(),
			d2 = m2.decompose(),
			rotation = d1.rotation + (d2.rotation - d1.rotation) * t,
			translateX = d1.translate.x + (d2.translate.x - d1.translate.x) * t,
			translateY = d1.translate.y + (d2.translate.y - d1.translate.y) * t,
			scaleX = d1.scale.x + (d2.scale.x - d1.scale.x) * t,
			scaleY = d1.scale.y + (d2.scale.y - d1.scale.y) * t
			;

		m.translate(translateX, translateY);
		m.rotate(rotation);
		m.scale(scaleX, scaleY);

		return m._x();
	},

	/**
	 * Decompose the current matrix into simple transforms using either
	 * QR (default) or LU decomposition. Code adapted from
	 * http://www.maths-informatique-jeux.com/blog/frederic/?post/2013/12/01/Decomposition-of-2D-transform-matrices
	 *
	 * The result must be applied in the following order to reproduce the current matrix:
	 *
	 *     QR: translate -> rotate -> scale -> skewX
	 *     LU: translate -> skewY  -> scale -> skewX
	 *
	 * @param {boolean} [useLU=false] - set to true to use LU rather than QR algorithm
	 * @returns {*} - an object containing current decomposed values (rotate, skew, scale, translate)
	 */
	decompose: function(useLU) {

		var me = this,
			a = me.a,
			b = me.b,
			c = me.c,
			d = me.d,
			acos = Math.acos,
			atan = Math.atan,
			sqrt = Math.sqrt,
			pi = Math.PI,

			translate = {x: me.e, y: me.f},
			rotation  = 0,
			scale     = {x: 1, y: 1},
			skew      = {x: 0, y: 0},

			determ = a * d - b * c;	// determinant(), skip DRY here...

		if (useLU) {
			if (a) {
				skew = {x:atan(c/a), y:atan(b/a)};
				scale = {x:a, y:determ/a};
			}
			else if (b) {
				rotation = pi * 0.5;
				scale = {x:b, y:determ/b};
				skew.x = atan(d/b);
			}
			else { // a = b = 0
				scale = {x:c, y:d};
				skew.x = pi * 0.25;
			}
		}
		else {
			// Apply the QR-like decomposition.
			if (a || b) {
				var r = sqrt(a*a + b*b);
				rotation = b > 0 ? acos(a/r) : -acos(a/r);
				scale = {x:r, y:determ/r};
				skew.x = atan((a*c + b*d) / (r*r));
			}
			else if (c || d) {
				var s = sqrt(c*c + d*d);
				rotation = pi * 0.5 - (d > 0 ? acos(-c/s) : -acos(c/s));
				scale = {x:determ/s, y:s};
				skew.y = atan((a*c + b*d) / (s*s));
			}
			else { // a = b = c = d = 0
				scale = {x:0, y:0};		// = invalid matrix
			}
		}

		return {
			scale    : scale,
			translate: translate,
			rotation : rotation,
			skew     : skew
		};
	},

	/**
	 * Returns the determinant of the current matrix.
	 * @returns {number}
	 */
	determinant : function() {
		return this.a * this.d - this.b * this.c;
	},

	/**
	 * Apply current matrix to x and y point.
	 * Returns a point object.
	 *
	 * @param {number} x - value for x
	 * @param {number} y - value for y
	 * @returns {{x: number, y: number}} A new transformed point object
	 */
	applyToPoint: function(x, y) {

		var me = this;

		return {
			x: x * me.a + y * me.c + me.e,
			y: x * me.b + y * me.d + me.f
		};
	},

    applyToPointInstance:function(point) {
        var p = this.applyToPoint(point.x, point.y);
        return new Z.Point(p);
    },

	/**
	 * Apply current matrix to array with point objects or point pairs.
	 * Returns a new array with points in the same format as the input array.
	 *
	 * A point object is an object literal:
	 *
	 * {x: x, y: y}
	 *
	 * so an array would contain either:
	 *
	 * [{x: x1, y: y1}, {x: x2, y: y2}, ... {x: xn, y: yn}]
	 *
	 * or
	 * [x1, y1, x2, y2, ... xn, yn]
	 *
	 * @param {Array} points - array with point objects or pairs
	 * @returns {Array} A new array with transformed points
	 */
	applyToArray: function(points) {

		var i = 0, p, l,
			mxPoints = [];

		if (typeof points[0] === 'number') {

			l = points.length;

			while(i < l) {
				p = this.applyToPoint(points[i++], points[i++]);
				mxPoints.push(p.x, p.y);
			}
		}
		else {
			for(; p = points[i]; i++) {
				mxPoints.push(new Z.Point(this.applyToPoint(p.x, p.y)));
			}
		}

		return mxPoints;
	},

	/**
	 * Apply current matrix to a typed array with point pairs. Although
	 * the input array may be an ordinary array, this method is intended
	 * for more performant use where typed arrays are used. The returned
	 * array is regardless always returned as a Float32Array.
	 *
	 * @param {*} points - (typed) array with point pairs
	 * @param {boolean} [use64=false] - use Float64Array instead of Float32Array
	 * @returns {*} A new typed array with transformed points
	 */
	applyToTypedArray: function(points, use64) {

		var i = 0, p,
			l = points.length,
			mxPoints = use64 ? new Float64Array(l) : new Float32Array(l);

		while(i < l) {
			p = this.applyToPoint(points[i], points[i+1]);
			mxPoints[i++] = p.x;
			mxPoints[i++] = p.y;
		}

		return mxPoints;
	},

	/**
	 * Apply to any canvas 2D context object. This does not affect the
	 * context that optionally was referenced in constructor unless it is
	 * the same context.
	 * @param {CanvasRenderingContext2D} context
	 */
	applyToContext: function(context) {
		var me = this;
		context.setTransform(me.a, me.b, me.c, me.d, me.e, me.f);
		return me;
	},

	/**
	 * Returns true if matrix is an identity matrix (no transforms applied).
	 * @returns {boolean} True if identity (not transformed)
	 */
	isIdentity: function() {
		var me = this;
		return (me._q(me.a, 1) &&
				me._q(me.b, 0) &&
				me._q(me.c, 0) &&
				me._q(me.d, 1) &&
				me._q(me.e, 0) &&
				me._q(me.f, 0));
	},

	/**
	 * Returns true if matrix is invertible
	 * @returns {boolean}
	 */
	isInvertible: function() {
		return !this._q(this.determinant(), 0)
	},

	/**
	 * Test if matrix is valid.
	 */
	isValid : function() {
		return !this._q(this.a * this.d, 0);
	},

	/**
	 * Clones current instance and returning a new matrix.
	 * @param {boolean} [noContext=false] don't clone context reference if true
	 * @returns {Matrix}
	 */
	clone : function(noContext) {
		var me = this,
			m = new Matrix();
		m.a = me.a;
		m.b = me.b;
		m.c = me.c;
		m.d = me.d;
		m.e = me.e;
		m.f = me.f;
		if (!noContext) m.context = me.context;

		return m;
	},

	/**
	 * Compares current matrix with another matrix. Returns true if equal
	 * (within epsilon tolerance).
	 * @param {Matrix} m - matrix to compare this matrix with
	 * @returns {boolean}
	 */
	isEqual: function(m) {

		var me = this,
			q = me._q;

		return (q(me.a, m.a) &&
				q(me.b, m.b) &&
				q(me.c, m.c) &&
				q(me.d, m.d) &&
				q(me.e, m.e) &&
				q(me.f, m.f));
	},

	/**
	 * Returns an array with current matrix values.
	 * @returns {Array}
	 */
	toArray: function() {
		var me = this;
		return [me.a, me.b, me.c, me.d, me.e, me.f];
	},

	/**
	 * Generates a string that can be used with CSS `transform:`.
	 * @returns {string}
	 */
	toCSS: function() {
		return "matrix(" + this.toArray() + ")";
	},

	/**
	 * Returns a JSON compatible string of current matrix.
	 * @returns {string}
	 */
	toJSON: function() {
		var me = this;
		return '{"a":' + me.a + ',"b":' + me.b + ',"c":' + me.c + ',"d":' + me.d + ',"e":' + me.e + ',"f":' + me.f + '}';
	},

	/**
	 * Returns a string with current matrix as comma-separated list.
	 * @returns {string}
	 */
	toString: function() {
		return "" + this.toArray();
	},

	/**
	 * Compares floating point values with some tolerance (epsilon)
	 * @param {number} f1 - float 1
	 * @param {number} f2 - float 2
	 * @returns {boolean}
	 * @private
	 */
	_q: function(f1, f2) {
		return Math.abs(f1 - f2) < 1e-14;
	},

	/**
	 * Apply current absolute matrix to context if defined, to sync it.
	 * @private
	 */
	_x: function() {
		var me = this;
		if (me.context)
			me.context.setTransform(me.a, me.b, me.c, me.d, me.e, me.f);
		return me;
	}
};

Z.Matrix.prototype.multi = function(s) {
    var matrix = this;
    var copy = matrix.clone();
        copy.a = matrix.a * 2;
        copy.b = matrix.b * 2;
        copy.c = matrix.c * 2;
        copy.d = matrix.d * 2;
        copy.e = matrix.e * 2;
        copy.f = matrix.f * 2;
    return copy;
}

//@namespace
Z.animation = {};

/**
 * @classdesc
 * Utilities for animation
 * @class
 * @category animation
 */
Z.Animation = {
    /**
     * @property {Object} speed         - predefined animation speed
     * @property {Number} speed.slow    - 2000ms
     * @property {Number} speed.normal  - 1000ms
     * @property {Number} speed.fast    - 500ms
     */
    speed:{
        'slow'   : 2000,
        'normal' : 1000,
        'fast'   : 500
    },

    /**
     * resolve styles for animation, get a style group of start style, styles to animate and end styles.
     * @param  {Object} styles - styles to resolve
     * @return {Object[]}  styles resolved
     * @private
     */
    _resolveStyles:function (styles) {
        if (!styles) {
            return null;
        }
        //resolve a child styles.
        function resolveChild(child) {
            if (!Z.Util.isArray(child)) {
                return Z.Animation._resolveStyles(child);
            }
            var start = [], d = [], dest = [];
            for (var i = 0; i < child.length; i++) {
                var styles = Z.Animation._resolveStyles(child[i]);
                if (styles) {
                    start.push(styles[0]);
                    d.push(styles[1]);
                    dest.push(styles[2]);
                }
            }
            if (start.length === 0) {
                return null;
            } else {
                return [start, d, dest];
            }
        }
        // resolve a style value.
        function resolveVal(val) {
            var values = val,
                clazz;
            //val is just a destination value, so we set start value to 0 or a 0-point or a 0-coordinate.
            if (!Z.Util.isArray(val)) {
                if (Z.Util.isNumber(val)) {
                    values = [0, val];
                } else if (val instanceof Z.Point || val instanceof Z.Coordinate) {
                    clazz = val.constructor;
                    values = [new clazz(0, 0), val];
                } else {
                    throw new Error(val + ' is not supported in animation styles.');
                }
            }
            //val is a array and val[0] is the start value and val[1] is the destination value.
            var v1 = values[0],
                v2 = values[1];
            if (Z.Util.isNumber(v1) && Z.Util.isNumber(v2)) {
                if (v1 === v2) {
                    return null;
                }
                return [v1, v2 - v1, v2];
            } else if (Z.Util.isArray(v1) || v1 instanceof Z.Coordinate || v1 instanceof Z.Point) {
                // is a coordinate (array or a coordinate) or a point
                if (Z.Util.isArray(v1)) {
                    v1 = new Z.Coordinate(v1);
                    v2 = new Z.Coordinate(v2);
                } else {
                    clazz = v1.constructor;
                    v1 = new clazz(v1);
                    v2 = new clazz(v2);
                }
                if (v1.equals(v2)) {
                    //a Coordinate or a Point to be eql with each other
                    return null;
                }
                return [v1, v2.substract(v1), v2];
            } else {
                throw new Error(values + ' is not supported in animation styles.');
            }
        }

        function isChild(val) {
            if (!Z.Util.isArray(val) && val.constructor === Object) {
                return true;
            } else if (Z.Util.isArray(val) && val[0].constructor === Object) {
                return true;
            }
            return false;
        }

        var d = {}, start = {}, dest = {};
        for (var p in styles) {
            if (styles.hasOwnProperty(p)) {
                var values = styles[p];
                var childStyles;
                if (isChild(values)) {
                    childStyles = resolveChild(values);
                } else {
                    childStyles = resolveVal(values);
                }
                if (childStyles) {
                    start[p] = childStyles[0];
                    d[p] = childStyles[1];
                    dest[p] = childStyles[2];
                }
            }
        }
        return [start, d, dest];
    },

    /**
     * Generate a framing function
     * @param  {Object[]} styles        - animation style group
     * @param  {Object} [options=null]  - options
     * @param  {Object} [options.easing=null]  - animation easing
     * @return {Function} framing function helps to generate animation frames.
     */
    framing:function (styles, options) {
        if (!options) {
            options = {};
        }
        var easing = options['easing'] ? Z.animation.Easing[options['easing']] : Z.animation.Easing.linear;
        if (!easing) { easing = Z.animation.Easing.linear; }
        var dStyles, startStyles, destStyles;
        styles = Z.Animation._resolveStyles(styles);
        if (styles) {
            startStyles = styles[0];
            dStyles = styles[1];
            destStyles = styles[2];
        }
        var deltaStyles = function (delta, _startStyles, _dStyles) {
            if (!_startStyles || !_dStyles) {
                return null;
            }
            var result = {};
            for (var p in _dStyles) {
                if (_dStyles.hasOwnProperty(p)) {
                    var s = _startStyles[p], d = _dStyles[p];
                    if (Z.Util.isNumber(d)) {
                        //e.g. radius, width, height
                        result[p] = s + delta * d;
                    } else if (Z.Util.isArray(d)) {
                        //e.g. a composite symbol, element in array can only be a object.
                        var children = [];
                        for (var i = 0; i < d.length; i++) {
                            children.push(deltaStyles(delta, s[i], d[i]));
                        }
                        result[p] = children;
                    } else {
                        //e.g. translate or a child
                        var clazz = d.constructor;
                        if (clazz === Object) {
                            result[p] = deltaStyles(delta, s, d);
                        } else if (s instanceof Z.Point || s instanceof Z.Coordinate) {
                            result[p] = s.add(d.multi(delta));
                        }
                    }
                }
            }
            return result;
        };
        return function (elapsed, duration) {
            var state, d;
            if (elapsed < 0) {
                state = {
                    'playState' : 'idle',
                    'delta'   : 0
                };
                d = startStyles;
            } else if (elapsed <  duration) {
                var delta = easing(elapsed / duration);
                state = {
                    'playState' : 'running',
                    'delta' : delta
                };
                d = deltaStyles(delta, startStyles, dStyles);
            } else {
                state = {
                    'playState' : 'finished',
                    'delta' : 1
                };
                d = destStyles;
            }
            state['startStyles'] = startStyles;
            state['destStyles'] = destStyles;
            return new Z.animation.Frame(state, d);
        };

    },

    _requestAnimFrame:function (fn) {
        if (!this._frameQueue) {
            this._frameQueue = [];
        }
        this._frameQueue.push(fn);
        this._a();
    },

    _a:function () {
        if (!this._animationFrameId) {
            this._animationFrameId = Z.Util.requestAnimFrame(Z.Util.bind(Z.Animation._run, Z.Animation));
        }
    },

    _run:function () {
        if (this._frameQueue.length) {
            var running = this._frameQueue;
            this._frameQueue = [];
            for (var i = 0, len = running.length; i < len; i++) {
                running[i]();
            }
            if (this._frameQueue.length) {
                this._animationFrameId = Z.Util.requestAnimFrame(Z.Util.bind(Z.Animation._run, Z.Animation));
            } else {
                delete this._animationFrameId;
            }
        }
    },

    /**
     * Get a animation player
     * @param  {Object} styles  - styles to animate
     * @param  {Object} options - animation options
     * @param  {Function} step  - callback function for animation steps
     * @return {maptalks.animation.Player} player
     */
    animate : function (styles, options, step) {
        if (!options) {
            options = {};
        }
        var animation = Z.Animation.framing(styles, options);
        return new Z.animation.Player(animation, options, step);
    }
};

/**
 * @classdesc
 * [Web Animation API]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Animation} style animation player
 * @param {Function} animation - animation [framing]{@link maptalks.Animation.framing} function
 * @param {Object} options     - animation options
 * @param  {Function} step  - callback function for animation steps
 * @class
 * @category animation
 * @memberOf maptalks.animation
 * @name Player
 */
Z.animation.Player = function (animation, options, step) {
    this._animation = animation;
    this._options = options;
    this._stepFn = step;
    this.playState = 'idle';
    this.ready = true;
    this.finished = false;
};

Z.Util.extend(Z.animation.Player.prototype, /** @lends maptalks.animation.Player.prototype */{
    _prepare:function () {
        var options = this._options;
        var duration = options['speed'];
        if (Z.Util.isString(duration)) { duration = Z.Animation.speed[duration]; }
        if (!duration) { duration = Z.Animation.speed['normal']; }
        this.duration = duration;
    },
    /**
     * Start or resume the animation
     * @return {maptalks.animation.Player} this
     */
    play:function () {
        if (this.playState !== 'idle' && this.playState !== 'paused') {
            return this;
        }
        if (this.playState === 'idle') {
            this.currentTime = 0;
            this._prepare();
        }
        var now = Z.Util.now();
        if (!this.startTime) {
            var options = this._options;
            this.startTime = options['startTime'] ? options['startTime'] : now;
        }
        this._playStartTime = Math.max(now, this.startTime);
        this._run();
        return this;
    },
    /**
     * Pause the animation
     * @return {maptalks.animation.Player} this
     */
    pause:function () {
        this.playState = 'paused';
        this.duration = this.duration - this.currentTime;
        return this;
    },
    /**
     * Cancel the animation play and ready to play again
     * @return {maptalks.animation.Player} this
     */
    cancel:function () {
        this.playState = 'idle';
        this.finished = false;
        return this;
    },
    /**
     * Finish the animation play, and can't be played any more.
     * @return {maptalks.animation.Player} this
     */
    finish:function () {
        this.playState = 'finished';
        this.finished = true;
        return this;
    },
    reverse:function () {

    },
    _run:function () {
        if (this.playState === 'finished' || this.playState === 'paused') {
            return;
        }
        var me = this;
        var now = Z.Util.now();
        //elapsed, duration
        var frame = this._animation(now - this._playStartTime, this.duration);
        this.playState = frame.state['playState'];
        var step = this._stepFn;
        if (this.playState === 'idle') {
            setTimeout(Z.Util.bind(this._run, this), this.startTime - now);
        } else if (this.playState === 'running') {
            this._animeFrameId = Z.Animation._requestAnimFrame(function () {
                me.currentTime = now - me._playStartTime;
                if (step) {
                    step(frame);
                }
                me._run();
            });
        } else if (this.playState === 'finished') {
            this.finished = true;
            //finished
            if (step) {
                Z.Util.requestAnimFrame(function () {
                    step(frame);
                });
            }
        }

    }
});

/**
 * @classdesc
 * Easing functions for anmation, from openlayers 3
 * @class
 * @category animation
 * @memberOf maptalks.animation
 * @name Easing
 */
Z.animation.Easing = {
        /**
         * Start slow and speed up.
         * @param {number} t Input between 0 and 1.
         * @return {number} Output between 0 and 1.
         */
    in : function (t) {
        return Math.pow(t, 2);
    },


        /**
         * Start fast and slow down.
         * @param {number} t Input between 0 and 1.
         * @return {number} Output between 0 and 1.
         */
    out : function (t) {
        return 1 - Z.animation.Easing.in(1 - t);
    },


        /**
         * Start slow, speed up, and then slow down again.
         * @param {number} t Input between 0 and 1.
         * @return {number} Output between 0 and 1.
         */
    inAndOut : function (t) {
        return 3 * t * t - 2 * t * t * t;
    },


        /**
         * Maintain a constant speed over time.
         * @param {number} t Input between 0 and 1.
         * @return {number} Output between 0 and 1.
         */
    linear : function (t) {
        return t;
    },


        /**
         * Start slow, speed up, and at the very end slow down again.  This has the
         * same general behavior as {@link inAndOut}, but the final slowdown
         * is delayed.
         * @param {number} t Input between 0 and 1.
         * @return {number} Output between 0 and 1.
         */
    upAndDown : function (t) {
        if (t < 0.5) {
            return Z.animation.Easing.inAndOut(2 * t);
        } else {
            return 1 - Z.animation.Easing.inAndOut(2 * (t - 0.5));
        }
    }
};

/**
 * @classdesc
 * Animation Frame used internally n animation player.
 * @class
 * @category animation
 * @memberOf maptalks.animation
 * @name Frame
 * @param {Object} state  - animation state
 * @param {Object} styles - styles to animate
 */
Z.animation.Frame = function (state, styles) {
    this.state = state;
    this.styles = styles;
};

Z.Canvas = {

    createCanvas:function (width, height, canvasClass) {
        var canvas;
        if (!Z.node) {
            canvas = Z.DomUtil.createEl('canvas');
            canvas.width = width;
            canvas.height = height;
        } else {
            //can be node-canvas or any other canvas mock
            canvas = new canvasClass(width, height);
        }
        return canvas;
    },

    setDefaultCanvasSetting:function (ctx) {
        ctx.lineWidth = 1;
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.fillStyle = 'rgba(255,255,255,0)';
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        var fontSize = 11;
        ctx.font = fontSize + 'px monospace';
        ctx.shadowBlur = null;
        ctx.shadowColor = null;
        if (ctx.setLineDash) {
            ctx.setLineDash([]);
        }
        ctx.globalAlpha = 1;
    },

    prepareCanvasFont:function (ctx, style) {
        ctx.font = Z.symbolizer.TextMarkerSymbolizer.getFont(style);
        var fill = style['textFill'];
        if (!fill) { fill = Z.Symbolizer.DEFAULT_TEXT_COLOR; }
        ctx.fillStyle = this.getRgba(fill, style['textOpacity']);
    },

    prepareCanvas:function (ctx, style, resources) {
        if (!style) {
            return;
        }
        var strokeWidth = style['lineWidth'];
        if (!Z.Util.isNil(strokeWidth) && ctx.lineWidth !== strokeWidth) {
            ctx.lineWidth = strokeWidth;
        }
        var strokeColor = style['linePatternFile'] || style['lineColor'] || Z.Symbolizer.DEFAULT_STROKE_COLOR;
        if (Z.Util.isCssUrl(strokeColor) && resources) {
            Z.Canvas._setStrokePattern(ctx, strokeColor, strokeWidth, resources);
            //line pattern will override stroke-dasharray
            style['lineDasharray'] = [];
        } else if (Z.Util.isGradient(strokeColor)) {
            if (style['lineGradientExtent']) {
                ctx.strokeStyle = Z.Canvas._createGradient(ctx, strokeColor, style['lineGradientExtent']);
            } else {
                ctx.strokeStyle = 'rgba(0,0,0,1)';
            }
        } else if (ctx.strokeStyle !== strokeColor) {
            ctx.strokeStyle = strokeColor;
        }
        if (style['lineJoin'] && ctx.lineJoin !== style['lineJoin']) {
            ctx.lineJoin = style['lineJoin'];
        }
        if (style['lineCap'] && ctx.lineCap !== style['lineCap']) {
            ctx.lineCap = style['lineCap'];
        }
        if (ctx.setLineDash && Z.Util.isArrayHasData(style['lineDasharray'])) {
            ctx.setLineDash(style['lineDasharray']);
        }
        var fill = style['polygonPatternFile'] || style['polygonFill'] || Z.Symbolizer.DEFAULT_FILL_COLOR;
        if (Z.Util.isCssUrl(fill)) {
            var fillImgUrl = Z.Util.extractCssUrl(fill);
            var fillTexture = resources.getImage([fillImgUrl, null, null]);
            if (!fillTexture) {
                //if the linestring has a arrow and a linePatternFile, polygonPatternFile will be set with the linePatternFile.
                fillTexture = resources.getImage([fillImgUrl + '-texture', null, strokeWidth]);
            }
            if (Z.Util.isSVG(fillImgUrl) && (fillTexture instanceof Image) && (Z.Browser.edge || Z.Browser.ie)) {
                //opacity of svg img painted on canvas is always 1, so we paint svg on a canvas at first.
                var w = fillTexture.width || 20,
                    h = fillTexture.height || 20;
                var canvas = Z.Canvas.createCanvas(w, h);
                Z.Canvas.image(canvas.getContext('2d'), fillTexture, 0, 0, w, h);
                fillTexture = canvas;
            }
            if (!fillTexture) {
                if (!Z.Browser.phantomjs) {
                    console.warn('img not found for', fillImgUrl);
                }
            } else {
                ctx.fillStyle = ctx.createPattern(fillTexture, 'repeat');
            }

        } else if (Z.Util.isGradient(fill)) {
            if (style['polygonGradientExtent']) {
                ctx.fillStyle = Z.Canvas._createGradient(ctx, fill, style['polygonGradientExtent']);
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0)';
            }
        } else if (ctx.fillStyle !== fill) {
            ctx.fillStyle = fill;
        }
    },

    _createGradient: function (ctx, g, extent) {
        var gradient = null, places = g['places'],
            min = extent.getMin(),
            max = extent.getMax(),
            width = extent.getWidth(),
            height = extent.getHeight();
        if (!g['type'] || g['type'] === 'linear') {
            if (!places) {
                places = [min.x, min.y, max.x, min.y];
            } else {
                if (places.length !== 4) {
                    throw new Error('A linear gradient\'s places should have 4 numbers.');
                }
                places = [
                    min.x + places[0] * width, min.y + places[1] * height,
                    min.x + places[2] * width, min.y + places[3] * height
                ];
            }
            gradient = ctx.createLinearGradient.apply(ctx, places);
        } else if (g['type'] === 'radial') {
            if (!places) {
                var c = extent.getCenter()._round();
                places = [c.x, c.y, c.x - min.x, c.x, c.y, 0];
            } else {
                if (places.length !== 6) {
                    throw new Error('A radial gradient\'s places should have 6 numbers.');
                }
                places = [
                    min.x + places[0] * width, min.y + places[1] * height, width * places[2],
                    min.x + places[3] * width, min.y + places[4] * height, width * places[5]
                ];
            }
            gradient = ctx.createRadialGradient.apply(ctx, places);
        }
        g['colorStops'].forEach(function (stop) {
            gradient.addColorStop.apply(gradient, stop);
        });
        return gradient;
    },

    _setStrokePattern: function (ctx, strokePattern, strokeWidth, resources) {
        var imgUrl = Z.Util.extractCssUrl(strokePattern);
        var imageTexture;
        if (Z.node) {
            imageTexture = resources.getImage([imgUrl, null, strokeWidth]);
        } else {
            imageTexture = resources.getImage([imgUrl + '-texture', null, strokeWidth]);
            if (!imageTexture) {
                var imageRes = resources.getImage([imgUrl, null, strokeWidth]);
                if (imageRes) {
                    var w;
                    if (!imageRes.width || !imageRes.height) {
                        w = strokeWidth;
                    } else {
                        w = Z.Util.round(imageRes.width * strokeWidth / imageRes.height);
                    }
                    var patternCanvas = this.createCanvas(w, strokeWidth, ctx.canvas.constructor);
                    Z.Canvas.image(patternCanvas.getContext('2d'), imageRes, 0, 0, w, strokeWidth);
                    resources.addResource([imgUrl + '-texture', null, strokeWidth], patternCanvas);
                    imageTexture = patternCanvas;
                }
            }
        }
        if (imageTexture) {
            ctx.strokeStyle = ctx.createPattern(imageTexture, 'repeat');
        } else if (!Z.Browser.phantomjs) {
            console.warn('img not found for', imgUrl);
        }
    },

    clearRect:function (ctx, x1, y1, x2, y2) {
        ctx.clearRect(x1, y1, x2, y2);
    },

    fillCanvas:function (ctx, fillOpacity, x, y) {
        var isPattern = Z.Canvas._isPattern(ctx.fillStyle);
        if (Z.Util.isNil(fillOpacity)) {
            fillOpacity = 1;
        }
        var alpha;
        if (fillOpacity < 1) {
            alpha = ctx.globalAlpha;
            ctx.globalAlpha *= fillOpacity;
        }
        if (isPattern) {
            x = Z.Util.round(x);
            y = Z.Util.round(y);
            ctx.translate(x, y);
        }
        ctx.fill();
        if (isPattern) {
            ctx.translate(-x, -y);
        }
        if (fillOpacity < 1) {
            ctx.globalAlpha = alpha;
        }
    },

    // hexColorRe: /^#([0-9a-f]{6}|[0-9a-f]{3})$/i,

    // support #RRGGBB/#RGB now.
    // if color was like [red, orange...]/rgb(a)/hsl(a), op will not combined to result
    getRgba:function (color, op) {
        if (Z.Util.isNil(op)) {
            op = 1;
        }
        if (color[0] !== '#') {
            return color;
        }
        var r, g, b;
        if (color.length === 7) {
            r = parseInt(color.substring(1, 3), 16);
            g = parseInt(color.substring(3, 5), 16);
            b = parseInt(color.substring(5, 7), 16);
        } else {
            r = parseInt(color.substring(1, 2), 16) * 17;
            g = parseInt(color.substring(2, 3), 16) * 17;
            b = parseInt(color.substring(3, 4), 16) * 17;
        }
        return 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
    },

    image:function (ctx, img, x, y, width, height) {
        x = Z.Util.round(x);
        y = Z.Util.round(y);
        try {
            if (Z.Util.isNumber(width) && Z.Util.isNumber(height)) {
                ctx.drawImage(img, x, y, Z.Util.round(width), Z.Util.round(height));
            } else {
                ctx.drawImage(img, x, y);
            }
        } catch (error) {
            console.warn('error when drawing image on canvas:', error);
            console.warn(img);
        }

    },

    text:function (ctx, text, pt, style, textDesc) {
        // pt = pt.add(new Z.Point(style['textDx'], style['textDy']));
        this._textOnMultiRow(ctx, textDesc['rows'], style, pt, textDesc['size'], textDesc['rawSize']);
    },

    _textOnMultiRow: function (ctx, texts, style, point, splitTextSize, textSize) {
        var ptAlign = Z.StringUtil.getAlignPoint(splitTextSize, style['textHorizontalAlignment'], style['textVerticalAlignment']);
        var lineHeight = textSize['height'] + style['textLineSpacing'];
        var basePoint = point.add(0, ptAlign.y);
        var text, rowAlign;
        for (var i = 0, len = texts.length; i < len; i++) {
            text = texts[i]['text'];
            rowAlign = Z.StringUtil.getAlignPoint(texts[i]['size'], style['textHorizontalAlignment'], style['textVerticalAlignment']);
            Z.Canvas._textOnLine(ctx, text, basePoint.add(rowAlign.x, i * lineHeight), style['textHaloRadius'], style['textHaloFill']);
        }
    },

    _textOnLine: function (ctx, text, pt, textHaloRadius, textHaloFill) {
        //http://stackoverflow.com/questions/14126298/create-text-outline-on-canvas-in-javascript
        //根据text-horizontal-alignment和text-vertical-alignment计算绘制起始点偏移量
        pt = pt._round();
        ctx.textBaseline = 'top';
        if (textHaloRadius) {
            ctx.miterLimit = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            var lineWidth = (textHaloRadius * 2 - 1);
            ctx.lineWidth = Z.Util.round(lineWidth);
            ctx.strokeStyle = textHaloFill;
            ctx.strokeText(text, pt.x, pt.y);
            ctx.lineWidth = 1;
            ctx.miterLimit = 10; //default
        }

        ctx.fillText(text, pt.x, pt.y);
    },

    fillText:function (ctx, text, point, rgba) {
        ctx.fillStyle = rgba;
        ctx.fillText(text, point.x, point.y);
    },

    _stroke:function (ctx, strokeOpacity, x, y) {
        var isPattern = Z.Canvas._isPattern(ctx.strokeStyle) && !Z.Util.isNil(x) && !Z.Util.isNil(y);
        if (Z.Util.isNil(strokeOpacity)) {
            strokeOpacity = 1;
        }
        var alpha;
        if (strokeOpacity < 1) {
            alpha = ctx.globalAlpha;
            ctx.globalAlpha *= strokeOpacity;
        }
        if (isPattern) {
            x = Z.Util.round(x);
            y = Z.Util.round(y);
            ctx.translate(x, y);
        }
        ctx.stroke();
        if (isPattern) {
            ctx.translate(-x, -y);
        }
        if (strokeOpacity < 1) {
            ctx.globalAlpha = alpha;
        }
    },

    _path:function (ctx, points, lineDashArray, lineOpacity, ignoreStrokePattern) {
        function fillWithPattern(p1, p2) {
            var degree = Z.Util.computeDegree(p1, p2);
            ctx.save();
            ctx.translate(p1.x, p1.y - ctx.lineWidth / 2 / Math.cos(degree));
            ctx.rotate(degree);
            Z.Canvas._stroke(ctx, lineOpacity);
            ctx.restore();
        }
        function drawDashLine(startPoint, endPoint, dashArray) {
          //https://davidowens.wordpress.com/2010/09/07/html-5-canvas-and-dashed-lines/
          //
          // Our growth rate for our line can be one of the following:
          //   (+,+), (+,-), (-,+), (-,-)
          // Because of this, our algorithm needs to understand if the x-coord and
          // y-coord should be getting smaller or larger and properly cap the values
          // based on (x,y).
            var fromX = startPoint.x, fromY = startPoint.y,
                toX = endPoint.x, toY = endPoint.y;
            var pattern = dashArray;
            var lt = function (a, b) { return a <= b; };
            var gt = function (a, b) { return a >= b; };
            var capmin = function (a, b) { return Math.min(a, b); };
            var capmax = function (a, b) { return Math.max(a, b); };

            var checkX = {thereYet: gt, cap: capmin};
            var checkY = {thereYet: gt, cap: capmin};

            if (fromY - toY > 0) {
                checkY.thereYet = lt;
                checkY.cap = capmax;
            }
            if (fromX - toX > 0) {
                checkX.thereYet = lt;
                checkX.cap = capmax;
            }

            ctx.moveTo(fromX, fromY);
            var offsetX = fromX;
            var offsetY = fromY;
            var idx = 0, dash = true;
            var ang, len;
            while (!(checkX.thereYet(offsetX, toX) && checkY.thereYet(offsetY, toY))) {
                ang = Math.atan2(toY - fromY, toX - fromX);
                len = pattern[idx];

                offsetX = checkX.cap(toX, offsetX + (Math.cos(ang) * len));
                offsetY = checkY.cap(toY, offsetY + (Math.sin(ang) * len));

                if (dash) {
                    ctx.lineTo(offsetX, offsetY);
                } else {
                    ctx.moveTo(offsetX, offsetY);
                }

                idx = (idx + 1) % pattern.length;
                dash = !dash;
            }
        }
        if (!Z.Util.isArrayHasData(points)) { return; }

        var isDashed = Z.Util.isArrayHasData(lineDashArray);
        var isPatternLine = (ignoreStrokePattern === true ? false : Z.Canvas._isPattern(ctx.strokeStyle));
        var point, prePoint, nextPoint;
        for (var i = 0, len = points.length; i < len; i++) {
            point = points[i]._round();
            if (!isDashed || ctx.setLineDash) { //IE9+
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
                if (isPatternLine && i > 0) {
                    prePoint = points[i - 1]._round();
                    fillWithPattern(prePoint, point);
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                }
            } else if (isDashed) {
                if (i === len - 1) {
                    break;
                }
                nextPoint = points[i + 1]._round();
                drawDashLine(point, nextPoint, lineDashArray, isPatternLine);
            }
        }
    },

    path:function (ctx, points, lineOpacity, fillOpacity, lineDashArray) {
        ctx.beginPath();
        Z.Canvas._path(ctx, points, lineDashArray, lineOpacity);
        Z.Canvas._stroke(ctx, lineOpacity);
    },

    polygon:function (ctx, points, lineOpacity, fillOpacity, lineDashArray) {
        function fillPolygon(points, i, op) {
            Z.Canvas.fillCanvas(ctx, op, points[i][0].x, points[i][0].y);
        }
        var isPatternLine = Z.Canvas._isPattern(ctx.strokeStyle),
            fillFirst = (Z.Util.isArrayHasData(lineDashArray) && !ctx.setLineDash) || isPatternLine;
        if (!Z.Util.isArrayHasData(points[0])) {
            points = [points];
        }
        var op, i, len;
        if (fillFirst) {
            //因为canvas只填充moveto,lineto,lineto的空间, 而dashline的moveto不再构成封闭空间, 所以重新绘制图形轮廓用于填充
            ctx.save();
            for (i = 0, len = points.length; i < len; i++) {
                Z.Canvas._ring(ctx, points[i], null, 0, true);
                op = fillOpacity;
                if (i > 0) {
                    ctx.globalCompositeOperation = 'destination-out';
                    op = 1;
                }
                fillPolygon(points, i, op);
                if (i > 0) {
                    ctx.globalCompositeOperation = 'source-over';
                } else {
                    ctx.fillStyle = '#fff';
                }
                Z.Canvas._stroke(ctx, 0);
            }
            ctx.restore();
        }
        for (i = 0, len = points.length; i < len; i++) {

            Z.Canvas._ring(ctx, points[i], lineDashArray, lineOpacity);

            if (!fillFirst) {
                op = fillOpacity;
                if (i > 0) {
                    ctx.globalCompositeOperation = 'destination-out';
                    op = 1;
                }
                fillPolygon(points, i, op);
                if (i > 0) {
                    //return to default compositeOperation to display strokes.
                    ctx.globalCompositeOperation = 'source-over';
                } else {
                    ctx.fillStyle = '#fff';
                }
            }
            Z.Canvas._stroke(ctx, lineOpacity);
        }

    },

    _ring:function (ctx, ring, lineDashArray, lineOpacity, ignoreStrokePattern) {
        var isPatternLine = (ignoreStrokePattern === true ? false : Z.Canvas._isPattern(ctx.strokeStyle));
        if (isPatternLine && !ring[0].equals(ring[ring.length - 1])) {
            ring = ring.concat([ring[0]]);
        }
        ctx.beginPath();
        Z.Canvas._path(ctx, ring, lineDashArray, lineOpacity, ignoreStrokePattern);
        if (!isPatternLine) {
            ctx.closePath();
        }
    },

    /**
     * draw an arc from p1 to p2 with degree of (p1, center) and (p2, center)
     * @param  {Context} ctx    canvas context
     * @param  {Point} p1      point 1
     * @param  {Point} p2      point 2
     * @param  {Number} degree arc degree between p1 and p2
     */
    _arcBetween : function (ctx, p1, p2, degree) {
        var a = degree * Math.PI / 180,
            dist = p1.distanceTo(p2),
            //radius of circle
            r = dist / 2 / Math.sin(a / 2);
        //angle between p1 and p2
        var p1p2 = Math.asin((p2.y - p1.y) / dist);
        if (p1.x > p2.x) {
            p1p2 = Math.PI - p1p2;
        }
        //angle between circle center and p2
        var cp2 = 90 * Math.PI / 180 - a / 2,
            da = p1p2 - cp2;

        var dx = Math.cos(da) * r,
            dy = Math.sin(da) * r,
            cx = p1.x + dx,
            cy = p1.y + dy;

        var startAngle = Math.asin((p2.y - cy) / r);
        if (cx > p2.x) {
            startAngle = Math.PI - startAngle;
        }
        var endAngle = startAngle + a;

        ctx.beginPath();
        ctx.arc(Z.Util.round(cx), Z.Util.round(cy), Z.Util.round(r), startAngle, endAngle);
    },

    _lineTo:function (ctx, p) {
        ctx.lineTo(p.x, p.y);
    },

    bezierCurveAndFill:function (ctx, points, lineOpacity, fillOpacity) {
        ctx.beginPath();
        var start = points[0]._round();
        ctx.moveTo(start.x, start.y);
        Z.Canvas._bezierCurveTo.apply(Z.Canvas, [ctx].concat(points.splice(1)));
        Z.Canvas.fillCanvas(ctx, fillOpacity);
        Z.Canvas._stroke(ctx, lineOpacity);
    },

    _bezierCurveTo:function (ctx, p1, p2, p3) {
        p1 = p1._round();
        p2 = p2._round();
        p3 = p3._round();
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    },

    _quadraticCurveTo:function (ctx, p1, p2) {
        p1 = p1._round();
        p2 = p2._round();
        ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
    },

    //各种图形的绘制方法
    ellipse:function (ctx, pt, width, height, lineOpacity, fillOpacity) {
        function bezierEllipse(x, y, a, b) {
            var k = 0.5522848,
                ox = a * k, // 水平控制点偏移量
                oy = b * k; // 垂直控制点偏移量
            ctx.beginPath();
           //从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
            ctx.moveTo(x - a, y);
            Z.Canvas._bezierCurveTo(ctx, new Z.Point(x - a, y - oy), new Z.Point(x - ox, y - b), new Z.Point(x, y - b));
            Z.Canvas._bezierCurveTo(ctx, new Z.Point(x + ox, y - b), new Z.Point(x + a, y - oy), new Z.Point(x + a, y));
            Z.Canvas._bezierCurveTo(ctx, new Z.Point(x + a, y + oy), new Z.Point(x + ox, y + b), new Z.Point(x, y + b));
            Z.Canvas._bezierCurveTo(ctx, new Z.Point(x - ox, y + b), new Z.Point(x - a, y + oy), new Z.Point(x - a, y));
            ctx.closePath();
            Z.Canvas.fillCanvas(ctx, fillOpacity, pt.x - width, pt.y - height);
            Z.Canvas._stroke(ctx, lineOpacity, pt.x - width, pt.y - height);
        }
        pt = pt._round();
        if (width === height) {
            //如果高宽相同,则直接绘制圆形, 提高效率
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, Z.Util.round(width), 0, 2 * Math.PI);
            Z.Canvas.fillCanvas(ctx, fillOpacity, pt.x - width, pt.y - height);
            Z.Canvas._stroke(ctx, lineOpacity, pt.x - width, pt.y - height);
        } else {
            bezierEllipse(pt.x, pt.y, width, height);
        }

    },

    rectangle:function (ctx, pt, size, lineOpacity, fillOpacity) {
        pt = pt._round();
        ctx.beginPath();
        ctx.rect(pt.x, pt.y,
            Z.Util.round(size['width']), Z.Util.round(size['height']));
        Z.Canvas.fillCanvas(ctx, fillOpacity, pt.x, pt.y);
        Z.Canvas._stroke(ctx, lineOpacity, pt.x, pt.y);
    },

    sector:function (ctx, pt, size, angles, lineOpacity, fillOpacity) {
        var startAngle = angles[0],
            endAngle = angles[1];
        function sector(ctx, x, y, radius, startAngle, endAngle) {
            var rad = Math.PI / 180;
            var sDeg = rad * -endAngle;
            var eDeg = rad * -startAngle;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, sDeg, eDeg);
            ctx.lineTo(x, y);
            Z.Canvas.fillCanvas(ctx, fillOpacity, x - radius, y - radius);
            Z.Canvas._stroke(ctx, lineOpacity, x - radius, y - radius);
        }
        pt = pt._round();
        sector(ctx, pt.x, pt.y, size, startAngle, endAngle);
    },

    _isPattern : function (style) {
        return !Z.Util.isString(style) && !('addColorStop' in style);
    }
};

(function () {
    var Ajax;
    if (Z.node) {
        var urlParser = require('url'),
            http = require('http'),
            https = require('https');

        Ajax = {
            get: function (url, cb) {
                var parsed = urlParser.parse(url);
                this._getClient(parsed.protocol)
                    .get(url, this._wrapCallback(cb))
                    .on('error', cb);
                return this;
            },

            post: function (options, postData, cb) {
                var reqOpts = urlParser.parse(options.url);
                reqOpts.method = 'POST';
                if (options.headers) {
                    reqOpts.headers = options.headers;
                }
                var req = this._getClient(reqOpts.protocol).request(reqOpts, this._wrapCallback(cb));

                req.on('error', cb);

                if (!Z.Util.isString(postData)) {
                    postData = JSON.stringify(postData);
                }

                req.write(postData);
                req.end();
                return this;
            },

            _wrapCallback : function (cb) {
                return function (res) {
                    var data = [],
                        isBuffer = false;
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        if (chunk instanceof Buffer) {
                            isBuffer = true;
                        }
                        data.push(chunk);
                    });
                    res.on('end', function () {
                        cb(null, isBuffer ? Buffer.concat(data).toString('utf8') : data.join(''));
                    });
                };
            },

            _getClient: function (protocol) {
                if (!this._client) {
                    this._client = (protocol && protocol === 'https:') ? https : http;
                }
                return this._client;
            }
        };
    } else {
        Ajax = {
            get: function (url, cb) {
                var client = this._getClient(cb);
                client.open('GET', url, true);
                client.send(null);
                return this;
            },

            post: function (options, postData, cb) {
                var client = this._getClient(cb);
                client.open('POST', options.url, true);
                if (options.headers && 'setRequestHeader' in client) {
                    for (var p in options.headers) {
                        if (options.headers.hasOwnProperty(p)) {
                            client.setRequestHeader(p, options.headers[p]);
                        }
                    }
                }
                if (!Z.Util.isString(postData)) {
                    postData = JSON.stringify(postData);
                }
                client.send(postData);
                return this;
            },

            _wrapCallback: function (client, cb) {
                var me = this;
                return function () {
                    if (client.withCredentials !== undefined || me._isIE8()) {
                        cb(null, client.responseText);
                    } else if (client.readyState === 4) {
                        if (client.status === 200) {
                            cb(null, client.responseText);
                        } else {
                            if (client.status === 0) {
                                return;
                            }
                            cb(null, '{"success":false,"error":\"Status:' + client.status + ',' + client.statusText + '\"}');
                        }
                    }
                };
            },

            _isIE8: function () {
                return Z.Browser.ie && document.documentMode === 8;
            },

            _getClient: function (cb) {
                /*eslint-disable no-empty, no-undef*/
                var client;
                if (this._isIE8()) {
                    try {
                        client = new XDomainRequest();
                    } catch (e) {}
                }
                try { client = new XMLHttpRequest(); } catch (e) {}
                try { client = new ActiveXObject('Msxml2.XMLHTTP'); } catch (e) {}
                try { client = new ActiveXObject('Microsoft.XMLHTTP'); } catch (e) {}

                if (this._isIE8() || client.withCredentials !== undefined) {
                    //Cross Domain request in IE 8
                    client.onload = this._wrapCallback(client, cb);
                } else {
                    client.onreadystatechange = this._wrapCallback(client, cb);
                }

                return client;
                /*eslint-enable no-empty, no-undef*/
            }
        };
    }

    /**
     * Load a resource
     * @param {String} url          - resource url
     * @param {Function} callback   - callback function when completed.
     * @static
     */
    Ajax.getResource = function (url, cb) {
        return this.get(url, cb);
    };


    /**
     * Load a json.
     * @param {String} url          - json's url
     * @param {Function} callback   - callback function when completed.
     * @static
     */
    Ajax.getJSON = function (url, cb) {
        var callback = function (err, resp) {
            var data = resp ? Z.Util.parseJSON(resp) : null;
            cb(err, data);
        };
        return Ajax.getResource(url, callback);
    };

    Z.Util.getJSON = Ajax.getJSON;

    Z.Ajax = Ajax;
})();

/*!
    Feature Filter by

    (c) mapbox 2016
    www.mapbox.com
    License: MIT, header required.
*/
(function () {
    var types = ['Unknown', 'Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection'];

    /**
     * Given a filter expressed as nested arrays, return a new function
     * that evaluates whether a given feature (with a .properties or .tags property)
     * passes its test.
     *
     * @param {Array} filter mapbox gl filter
     * @returns {Function} filter-evaluating function
     */
    function createFilter(filter) {
        return new Function('f', 'var p = (f && f.properties || {}); return ' + compile(filter));
    }

    function compile(filter) {
        if (!filter) return 'true';
        var op = filter[0];
        if (filter.length <= 1) return op === 'any' ? 'false' : 'true';
        var str =
            op === '==' ? compileComparisonOp(filter[1], filter[2], '===', false) :
            op === '!=' ? compileComparisonOp(filter[1], filter[2], '!==', false) :
            op === '<' ||
            op === '>' ||
            op === '<=' ||
            op === '>=' ? compileComparisonOp(filter[1], filter[2], op, true) :
            op === 'any' ? compileLogicalOp(filter.slice(1), '||') :
            op === 'all' ? compileLogicalOp(filter.slice(1), '&&') :
            op === 'none' ? compileNegation(compileLogicalOp(filter.slice(1), '||')) :
            op === 'in' ? compileInOp(filter[1], filter.slice(2)) :
            op === '!in' ? compileNegation(compileInOp(filter[1], filter.slice(2))) :
            op === 'has' ? compileHasOp(filter[1]) :
            op === '!has' ? compileNegation(compileHasOp([filter[1]])) :
            'true';
        return '(' + str + ')';
    }

    function compilePropertyReference(property) {
        return property[0] === '$' ? 'f.' + property.substring(1) : 'p[' + JSON.stringify(property) + ']';
    }

    function compileComparisonOp(property, value, op, checkType) {
        var left = compilePropertyReference(property);
        var right = property === '$type' ? Z.Util.indexOfArray(value, types) : JSON.stringify(value);
        return (checkType ? 'typeof ' + left + '=== typeof ' + right + '&&' : '') + left + op + right;
    }

    function compileLogicalOp(expressions, op) {
        return Z.Util.mapArray(expressions, compile).join(op);
    }

    function compileInOp(property, values) {
        if (property === '$type') values = Z.Util.mapArray(values, function (value) { return Z.Util.indexOfArray(value, types); });
        var left = JSON.stringify(values.sort(compare));
        var right = compilePropertyReference(property);

        if (values.length <= 200) return 'maptalks.Util.indexOfArray(' + right + ', ' + left + ') !== -1';
        return 'function(v, a, i, j) {' +
            'while (i <= j) { var m = (i + j) >> 1;' +
            '    if (a[m] === v) return true; if (a[m] > v) j = m - 1; else i = m + 1;' +
            '}' +
        'return false; }(' + right + ', ' + left + ',0,' + (values.length - 1) + ')';
    }

    function compileHasOp(property) {
        return JSON.stringify(property) + ' in p';
    }

    function compileNegation(expression) {
        return '!(' + expression + ')';
    }

    // Comparison function to sort numbers and strings
    function compare(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    Z.Util.createFilter = createFilter;

    Z.Util.getFilterFeature = function (geometry) {
        var json = geometry._toJSON(),
            g = json['feature'];
        g['type'] = Z.Util.indexOfArray(g['geometry']['type'], types);
        g['subType'] = json['subType'];
        return g;
    };
})();



(function ()  {

    function createFunction(parameters, defaultType) {
        var fun;

        if (!isFunctionDefinition(parameters)) {
            fun = function() { return parameters; };
            fun.isFeatureConstant = true;
            fun.isZoomConstant = true;

        } else {
            var zoomAndFeatureDependent = typeof parameters.stops[0][0] === 'object';
            var featureDependent = zoomAndFeatureDependent || parameters.property !== undefined;
            var zoomDependent = zoomAndFeatureDependent || !featureDependent;
            var type = parameters.type || defaultType || 'exponential';

            var innerFun;
            if (type === 'exponential') {
                innerFun = evaluateExponentialFunction;
            } else if (type === 'interval') {
                innerFun = evaluateIntervalFunction;
            } else if (type === 'categorical') {
                innerFun = evaluateCategoricalFunction;
            } else {
                throw new Error('Unknown function type "' + type + '"');
            }

            if (zoomAndFeatureDependent) {
                var featureFunctions = {};
                var featureFunctionStops = [];
                for (var s = 0; s < parameters.stops.length; s++) {
                    var stop = parameters.stops[s];
                    if (featureFunctions[stop[0].zoom] === undefined) {
                        featureFunctions[stop[0].zoom] = {
                            zoom: stop[0].zoom,
                            type: parameters.type,
                            property: parameters.property,
                            stops: []
                        };
                    }
                    featureFunctions[stop[0].zoom].stops.push([stop[0].value, stop[1]]);
                }

                for (var z in featureFunctions) {
                    featureFunctionStops.push([featureFunctions[z].zoom, createFunction(featureFunctions[z])]);
                }
                fun = function(zoom, feature) {
                    return evaluateExponentialFunction({ stops: featureFunctionStops, base: parameters.base }, zoom)(zoom, feature);
                };
                fun.isFeatureConstant = false;
                fun.isZoomConstant = false;

            } else if (zoomDependent) {
                fun = function(zoom) {
                    return innerFun(parameters, zoom);
                };
                fun.isFeatureConstant = true;
                fun.isZoomConstant = false;
            } else {
                fun = function(zoom, feature) {
                    return innerFun(parameters, feature[parameters.property]);
                };
                fun.isFeatureConstant = false;
                fun.isZoomConstant = true;
            }
        }

        return fun;
    }

    function evaluateCategoricalFunction(parameters, input) {
        for (var i = 0; i < parameters.stops.length; i++) {
            if (input === parameters.stops[i][0]) {
                return parameters.stops[i][1];
            }
        }
        return parameters.stops[0][1];
    }

    function evaluateIntervalFunction(parameters, input) {
        for (var i = 0; i < parameters.stops.length; i++) {
            if (input < parameters.stops[i][0]) break;
        }
        return parameters.stops[Math.max(i - 1, 0)][1];
    }

    function evaluateExponentialFunction(parameters, input) {
        var base = parameters.base !== undefined ? parameters.base : 1;

        var i = 0;
        while (true) {
            if (i >= parameters.stops.length) break;
            else if (input <= parameters.stops[i][0]) break;
            else i++;
        }

        if (i === 0) {
            return parameters.stops[i][1];

        } else if (i === parameters.stops.length) {
            return parameters.stops[i - 1][1];

        } else {
            return interpolate(
                input,
                base,
                parameters.stops[i - 1][0],
                parameters.stops[i][0],
                parameters.stops[i - 1][1],
                parameters.stops[i][1]
            );
        }
    }


    function interpolate(input, base, inputLower, inputUpper, outputLower, outputUpper) {
        if (typeof outputLower === 'function') {
            return function() {
                var evaluatedLower = outputLower.apply(undefined, arguments);
                var evaluatedUpper = outputUpper.apply(undefined, arguments);
                return interpolate(input, base, inputLower, inputUpper, evaluatedLower, evaluatedUpper);
            };
        } else if (outputLower.length) {
            return interpolateArray(input, base, inputLower, inputUpper, outputLower, outputUpper);
        } else {
            return interpolateNumber(input, base, inputLower, inputUpper, outputLower, outputUpper);
        }
    }

    function interpolateNumber(input, base, inputLower, inputUpper, outputLower, outputUpper) {
        var difference =  inputUpper - inputLower;
        var progress = input - inputLower;

        var ratio;
        if (base === 1) {
            ratio = progress / difference;
        } else {
            ratio = (Math.pow(base, progress) - 1) / (Math.pow(base, difference) - 1);
        }

        return (outputLower * (1 - ratio)) + (outputUpper * ratio);
    }

    function interpolateArray(input, base, inputLower, inputUpper, outputLower, outputUpper) {
        var output = [];
        for (var i = 0; i < outputLower.length; i++) {
            output[i] = interpolateNumber(input, base, inputLower, inputUpper, outputLower[i], outputUpper[i]);
        }
        return output;
    }

    function isFunctionDefinition(value) {
        return value && typeof value === 'object' && value.stops;
    }


    Z.Util.isFunctionDefinition = isFunctionDefinition;

    Z.Util.interpolated = function(parameters) {
        return createFunction(parameters, 'exponential');
    };

    Z.Util['piecewise-constant'] = function(parameters) {
        return createFunction(parameters, 'interval');
    };

    Z.Util.loadFunctionTypes = function (obj, argFn) {
        if (!obj) {
            return null;
        }
        var result = {},
            props = [], p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                props.push(p);
            }
        }
        for (var i = 0, len = props.length; i < len; i++) {
            p = props[i];
            if (Z.Util.isFunctionDefinition(obj[p])) {
                result['_' + p] = obj[p];
                (function (_p) {
                    Object.defineProperty(result, _p, {
                        get: function () {
                            if (!this['__fn_' + _p]) {
                                this['__fn_' + _p] = Z.Util.interpolated(this['_' + _p]);
                            }
                            return this['__fn_' + _p].apply(this, argFn());
                        },
                        set: function (v) {
                            this['_' + _p] = v;
                        },
                        configurable : true,
                        enumerable : true
                    });
                })(p);
            } else {
                result[p] = obj[p];
            }
        }
        return result;
    }

})();

/**
 * Transformation between projected coordinates and base 2d point system.
 * @class
 * @category geo
 * @protected
 * @classdesc
 * A core class used internally for mapping map's (usually geographical) coordinates to 2d points to view stuffs on a map.<br>
 * The base 2d point system is a fixed system that is consistent with HTML coordinate system: on X-Axis, left is smaller and right is larger; on Y-Axis, top is smaller and bottom is larger. <br>
 * As map's coordinates may not be in the same order(e.g. on a mercator projected earth, top is larger and bottom is smaller), <br>
 * transformation provides mapping functions to map arbitrary coordinates system to the fixed 2d point system. <br>
 * How to transform is decided by the constructor parameters which is a 4 number array [a, b, c, d]:<br>
 * a : the order scale of X-axis values 1 means right is larger and -1 means the reverse, left is larger;<br>
 * b : the order scale of Y-axis values 1 means bottom is larger and -1 means the reverse, top is larger;<br>
 * c : x of the origin point of the projected coordinate system <br>
 * d : y of the origin point of the projected coordinate system <br>
 * <br>
 * e.g.: Transformation parameters for Google map: [1, -1, -20037508.34, 20037508.34] <br>
 * <br>
 * Parameter scale in transform/untransform method is used to scale the result 2d points on map's different zoom levels.
 */
Z.Transformation = function (matrix) {
    this.matrix = matrix;
};

Z.Util.extend(Z.Transformation.prototype,  /** @lends maptalks.Transformation.prototype */{

    /**
     * Transform a projected coordinate to a 2d point.
     * @param  {Number[]|maptalks.Coordinate} coordinates - projected coordinate to transform
     * @param  {Number} scale                              - transform scale
     * @return {maptalks.Point} 2d point.
     */
    transform : function (coordinates, scale) {
        return new Z.Point(
            this.matrix[0] * (coordinates.x - this.matrix[2]) / scale,
            this.matrix[1] * (coordinates.y - this.matrix[3]) / scale
            );
    },

    /**
     * Transform a 2d point to a projected coordinate.
     * @param  {maptalks.Point} point   - 2d point
     * @param  {Number} scale           - transform scale
     * @return {maptalks.Coordinate}  projected coordinate.
     */
    untransform : function (point, scale) {
        return new Z.Coordinate(
            point.x * scale / this.matrix[0] + this.matrix[2],
            point.y * scale / this.matrix[1] + this.matrix[3]
            );
    }
});

/**
 * @namespace
 */
Z.measurer = {};

/**
 * Utilities with measurers.<br>
 * Measurer is a object containing methods for geographical computations such as length and area measuring, etc.
 * @class
 * @category geo
 * @protected
 */
Z.MeasurerUtil = {
    /**
     * Get a measurer instance.
     * @param  {String} name - code of the measurer: 'EPSG:4326', 'Identity', 'BAIDU'
     * @return {Object} a measurer object
     */
    getInstance:function (name) {
        if (!name) {
            return Z.MeasurerUtil.DEFAULT;
        }
        for (var p in Z.measurer) {
            if (Z.measurer.hasOwnProperty(p)) {
                var mName = Z.measurer[p]['measure'];
                if (!mName) {
                    continue;
                }
                if (name.toLowerCase() === mName.toLowerCase()) {
                    return Z.measurer[p];
                }
            }
        }
        return null;
    },

    /**
     * The default measurer: WGS84Sphere
     * @type {Object}
     */
    DEFAULT: Z.measurer.WGS84Sphere
};

Z.measurer.Sphere = function (radius) {
    this.radius = radius;
};

Z.Util.extend(Z.measurer.Sphere.prototype, {
    rad: function (a) { return a * Math.PI / 180; },

    measureLength:function (c1, c2) {
        if (!c1 || !c2) { return 0; }
        var b = this.rad(c1.y), d = this.rad(c2.y), e = b - d, f = this.rad(c1.x) - this.rad(c2.x);
        b = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(e / 2), 2) + Math.cos(b) * Math.cos(d) * Math.pow(Math.sin(f / 2), 2))); b *= this.radius;
        return Math.round(b * 1E4) / 1E4;
    },
    measureArea:function (coordinates) {
        var a = this.radius * Math.PI / 180,
            b = 0,
            c = coordinates,
            d = c.length;
        if (d < 3) { return 0; }
        for (var i = 0; i < d - 1; i++) {
            var e = c[i],
                f = c[i + 1];
            b += e.x * a * Math.cos(e.y * Math.PI / 180) * f.y * a - f.x * a * Math.cos(f.y * Math.PI / 180) * e.y * a;
        }
        d = c[i];
        c = c[0];
        b += d.x * a * Math.cos(d.y * Math.PI / 180) * c.y * a - c.x * a * Math.cos(c.y * Math.PI / 180) * d.y * a;
        return 0.5 * Math.abs(b);
    },
    locate:function (c, xDist, yDist) {
        if (!c) { return null; }
        if (!xDist) { xDist = 0; }
        if (!yDist) { yDist = 0; }
        if (!xDist && !yDist) { return c; }
        var dx = Math.abs(xDist);
        var dy = Math.abs(yDist);
        var ry = this.rad(c.y);
        var rx = this.rad(c.x);
        var sy = Math.sin(dy / (2 * this.radius)) * 2;
        ry = ry + sy * (yDist > 0 ? 1 : -1);
        var sx = 2 * Math.sqrt(Math.pow(Math.sin(dx / (2 * this.radius)), 2) / Math.pow(Math.cos(ry), 2));
        rx = rx + sx * (xDist > 0 ? 1 : -1);
        return new Z.Coordinate(rx * 180 / Math.PI, ry * 180 / Math.PI);
    }
});

/**
 * WGS84 Sphere measurer.
 * @class
 * @category geo
 * @protected
 * @memberOf maptalks.measurer
 * @name WGS84Sphere
 */
Z.measurer.WGS84Sphere = {
    'measure' : 'EPSG:4326',
    sphere : new Z.measurer.Sphere(6378137),
    /**
     * Measure the length between 2 coordinates.
     * @param  {maptalks.Coordinate} c1
     * @param  {maptalks.Coordinate} c2
     * @return {Number}
     */
    measureLength: function () {
        return this.sphere.measureLength.apply(this.sphere, arguments);
    },
    /**
     * Measure the area closed by the given coordinates.
     * @param  {maptalks.Coordinate[]} coordinates
     * @return {number}
     */
    measureArea: function () {
        return this.sphere.measureArea.apply(this.sphere, arguments);
    },
    /**
     * Locate a coordinate from the given source coordinate with a x-axis distance and a y-axis distance.
     * @param  {maptalks.Coordinate} c     - source coordinate
     * @param  {Number} xDist              - x-axis distance
     * @param  {Number} yDist              - y-axis distance
     * @return {maptalks.Coordinate}
     */
    locate: function () {
        return this.sphere.locate.apply(this.sphere, arguments);
    }
};

/**
 * Baidu sphere measurer
 * @class
 * @category geo
 * @protected
 * @memberOf maptalks.measurer
 * @name BaiduSphere
 */
Z.measurer.BaiduSphere = {
    'measure' : 'BAIDU',
    sphere : new Z.measurer.Sphere(6370996.81),
    /**
     * Measure the length between 2 coordinates.
     * @param  {maptalks.Coordinate} c1
     * @param  {maptalks.Coordinate} c2
     * @return {Number}
     */
    measureLength: function () {
        return this.sphere.measureLength.apply(this.sphere, arguments);
    },
    /**
     * Measure the area closed by the given coordinates.
     * @param  {maptalks.Coordinate[]} coordinates
     * @return {number}
     */
    measureArea: function () {
        return this.sphere.measureArea.apply(this.sphere, arguments);
    },
    /**
     * Locate a coordinate from the given source coordinate with a x-axis distance and a y-axis distance.
     * @param  {maptalks.Coordinate} c     - source coordinate
     * @param  {Number} xDist              - x-axis distance
     * @param  {Number} yDist              - y-axis distance
     * @return {maptalks.Coordinate}
     */
    locate: function () {
        return this.sphere.locate.apply(this.sphere, arguments);
    }
};

/**
 * Identity measurer, a measurer for Cartesian coordinate system.
 *
 * @class
 * @category geo
 * @protected
 * @memberOf maptalks.measurer
 * @name Identity
 */
Z.measurer.Identity = {
    /**
     * the code of the measurer, used by [MeasurerUtil]{@link maptalks.MeasurerUtil} to as its key get measurer instance.
     * @static
     * @type {String}
     */
    'measure' : 'IDENTITY',
    /**
     * Measure the length between 2 coordinates.
     * @param  {maptalks.Coordinate} c1
     * @param  {maptalks.Coordinate} c2
     * @return {Number}
     * @static
     */
    measureLength:function (c1, c2) {
        if (!c1 || !c2) { return 0; }
        try {
            return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
        } catch (err) {
            return 0;
        }
    },
    /**
     * Measure the area closed by the given coordinates.
     * @param  {maptalks.Coordinate[]} coordinates
     * @return {number}
     * @static
     */
    measureArea:function (coordinates) {
        if (!Z.Util.isArrayHasData(coordinates)) {
            return 0;
        }
        var area = 0;
        for (var i = 0, len = coordinates.length; i < len; i++) {
            var c1 = coordinates[i];
            var c2 = null;
            if (i === len - 1) {
                c2 = coordinates[0];
            } else {
                c2 = coordinates[i + 1];
            }
            area += c1.x * c2.y - c1.y * c2.x;
        }
        return Math.abs(area / 2);
    },

    /**
     * Locate a coordinate from the given source coordinate with a x-axis distance and a y-axis distance.
     * @param  {maptalks.Coordinate} c     - source coordinate
     * @param  {Number} xDist              - x-axis distance
     * @param  {Number} yDist              - y-axis distance
     * @return {maptalks.Coordinate}
     * @static
     */
    locate:function (c, xDist, yDist) {
        if (!c) { return null; }
        if (!xDist) { xDist = 0; }
        if (!yDist) { yDist = 0; }
        if (!xDist && !yDist) { return c; }
        return new Z.Coordinate(c.x + xDist, c.y + yDist);
    }
};

/**
 * @namespace
 */
Z.projection = {};

/**
 * Common Methods of Projections.
 * @mixin
 * @protected
 * @memberOf maptalks.projection
 * @name Common
 */
Z.projection.Common = {
    /**
     * Project a geographical coordinate to a projected coordinate (2d coordinate)
     * @param  {maptalks.Coordinate} p - coordinate to project
     * @return {maptalks.Coordinate}
     * @static
     */
    project:function () {},
    /**
     * Unproject a projected coordinate to a geographical coordinate (2d coordinate)
     * @param  {maptalks.Coordinate} p - coordinate to project
     * @return {maptalks.Coordinate}
     * @static
     */
    unproject:function () {},
    /**
     * Project a group of geographical coordinates to projected coordinates.
     * @param  {maptalks.Coordinate[]|maptalks.Coordinate[][]|maptalks.Coordinate[][][]} coordinates - coordinates to project
     * @return {maptalks.Coordinate[]|maptalks.Coordinate[][]|maptalks.Coordinate[][][]}
     * @static
     */
    projectCoords:function (coordinates) {
        return Z.Util.mapArrayRecursively(coordinates, this.project, this);
    },

    /**
     * Unproject a group of projected coordinates to geographical coordinates.
     * @param  {maptalks.Coordinate[]|maptalks.Coordinate[][]|maptalks.Coordinate[][][]} projCoords - projected coordinates to unproject
     * @return {maptalks.Coordinate[]|maptalks.Coordinate[][]|maptalks.Coordinate[][][]}
     * @static
     */
    unprojectCoords:function (projCoords) {
        return Z.Util.mapArrayRecursively(projCoords, this.unproject, this);
    }
};

/**
 * Well-known projection used by Google maps or Open Street Maps, aka Mercator Projection.<br>
 * It is map's default projection.
 * @class
 * @category geo
 * @protected
 * @memberOf maptalks.projection
 * @name EPSG3857
 * @mixes maptalks.projection.Common
 * @mixes maptalks.measurer.WGS84Sphere
 */
Z.projection.EPSG3857 = Z.Util.extend({}, Z.projection.Common, /** @lends maptalks.projection.EPSG3857 */{
    /**
     * "EPSG:3857", Code of the projection, used by [View]{@link maptalks.View} to get projection instance.
     * @type {String}
     * @constant
     */
    code : 'EPSG:3857',
    rad : Math.PI / 180,
    metersPerDegree : 2.003750834E7 / 180,
    maxLatitude : 85.0511287798,

    project: function (lnglat) {
        var rad = this.rad,
            metersPerDegree = this.metersPerDegree,
            max = this.maxLatitude;
        var lng = lnglat.x, lat = Math.max(Math.min(max, lnglat.y), -max);
        var c;
        if (lat === 0) {
            c = 0;
        } else {
            c = Math.log(Math.tan((90 + lat) * rad / 2)) / rad;
        }
        return new Z.Coordinate(lng * metersPerDegree, c * metersPerDegree);
    },

    unproject: function (pLnglat) {
        var x = pLnglat.x,
            y = pLnglat.y;
        var rad = this.rad,
            metersPerDegree = this.metersPerDegree;
        var c;
        if (y === 0) {
            c = 0;
        } else {
            c = y / metersPerDegree;
            c = (2 * Math.atan(Math.exp(c * rad)) - Math.PI / 2) / rad;
        }
        return new Z.Coordinate(x / metersPerDegree, c);
    }
}, Z.measurer.WGS84Sphere);

Z.projection.DEFAULT = Z.projection.EPSG3857;

/**
 * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
 *
 * @class
 * @category geo
 * @protected
 * @memberOf maptalks.projection
 * @name EPSG4326
 * @mixes maptalks.projection.Common
 * @mixes maptalks.measurer.WGS84Sphere
 */
Z.projection.EPSG4326 = Z.Util.extend({}, Z.projection.Common, /** @lends maptalks.projection.EPSG4326 */{
    /**
     * "EPSG:4326", Code of the projection, used by [View]{@link maptalks.View} to get projection instance.
     * @type {String}
     * @constant
     */
    code : 'EPSG:4326',
    project:function (p) {
        return new Z.Coordinate(p.x, p.y);
    },
    unproject:function (p) {
        return new Z.Coordinate(p.x, p.y);
    }
}, Z.measurer.WGS84Sphere);

/**
 * Projection used by [Baidu Map]{@link http://map.baidu.com}
 * @class
 * @category geo
 * @protected
 * @memberOf maptalks.projection
 * @name BAIDU
 * @mixes maptalks.projection.Common
 * @mixes maptalks.measurer.BaiduSphere
 */
Z.projection.BAIDU = Z.Util.extend({}, Z.projection.Common, /** @lends maptalks.projection.BAIDU */{
    /**
     * "BAIDU", Code of the projection, used by [View]{@link maptalks.View} to get projection instance.
     * @type {String}
     * @constant
     */
    code : 'BAIDU',

    project:function (p) {
        return this.convertLL2MC(p);
    },

    unproject:function (p) {
        return this.convertMC2LL(p);
    }
}, Z.measurer.BaiduSphere, {
    EARTHRADIUS: 6370996.81,
    MCBAND: [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0],
    LLBAND: [75, 60, 45, 30, 15, 0],
    MC2LL: [[1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2], [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86], [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37], [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06], [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4], [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5]],
    LL2MC: [[-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5], [0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5], [0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5], [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5], [-0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5], [-0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]],

    convertMC2LL: function (cB) {
        var cC, cE;
        cC = {x:Math.abs(cB.x), y:Math.abs(cB.y)};
        for (var cD = 0, len = this.MCBAND.length; cD < len; cD++) {
            if (cC.y >= this.MCBAND[cD]) {
                cE = this.MC2LL[cD];
                break;
            }
        }
        var T = this.convertor(cB, cE);
        var result = new Z.Coordinate(T.x.toFixed(6), T.y.toFixed(6));
        return result;
    },
    convertLL2MC: function (T) {
        var cB, cD, cC, len;
        T.x = this.getLoop(T.x, -180, 180);
        T.y = this.getRange(T.y, -74, 74);
        cB = new Z.Coordinate(T.x, T.y);
        for (cC = 0, len = this.LLBAND.length; cC < len; cC++) {
            if (cB.y >= this.LLBAND[cC]) {
                cD = this.LL2MC[cC];
                break;
            }
        }
        if (!cD) {
            for (cC = this.LLBAND.length - 1; cC >= 0; cC--) {
                if (cB.y <= -this.LLBAND[cC]) {
                    cD = this.LL2MC[cC];
                    break;
                }
            }
        }
        var cE = this.convertor(T, cD);
        var result = new Z.Coordinate(cE.x.toFixed(2), cE.y.toFixed(2));
        return result;
    },
    convertor: function (cC, cD) {
        if (!cC || !cD) {
            return null;
        }
        var T = cD[0] + cD[1] * Math.abs(cC.x);
        var cB = Math.abs(cC.y) / cD[9];
        var cE = cD[2] + cD[3] * cB + cD[4] * cB * cB +
                cD[5] * cB * cB * cB + cD[6] * cB * cB * cB * cB +
                cD[7] * cB * cB * cB * cB * cB +
                cD[8] * cB * cB * cB * cB * cB * cB;
        T *= (cC.x < 0 ? -1 : 1);
        cE *= (cC.y < 0 ? -1 : 1);
        return new Z.Coordinate(T, cE);
    },
    toRadians: function (T) {
        return Math.PI * T / 180;
    },
    toDegrees: function (T) {
        return (180 * T) / Math.PI;
    },
    getRange: function (cC, cB, T) {
        if (cB != null) {
            cC = Math.max(cC, cB);
        }
        if (T != null) {
            cC = Math.min(cC, T);
        }
        return cC;
    },
    getLoop: function (cC, cB, T) {
        while (cC > T) {
            cC -= T - cB;
        }
        while (cC < cB) {
            cC += T - cB;
        }
        return cC;
    }
});

/**
 * A projection based on Cartesian coordinate system.<br>
 * This projection maps x, y directly, it is useful for maps of flat surfaces (e.g. indoor maps, game maps).
 * @class
 * @category geo
 * @protected
 * @memberOf maptalks.projection
 * @name IDENTITY
 * @mixes maptalks.projection.Common
 * @mixes maptalks.measurer.Identity
 */
Z.projection.IDENTITY = Z.Util.extend({}, Z.projection.Common, /** @lends maptalks.projection.IDENTITY */{
    /**
     * "IDENTITY", Code of the projection, used by [View]{@link maptalks.View} to get projection instance.
     * @type {String}
     * @constant
     */
    code : 'IDENTITY',
    project:function (p) {
        return p.copy();
    },
    unproject:function (p) {
        return p.copy();
    }
}, Z.measurer.Identity);

/**
 * Base class for all the interaction handlers
 * @class
 * @category handler
 * @extends maptalks.Class
 * @mixins maptalks.Eventable
 * @abstract
 * @protected
 */
Z.Handler = Z.Class.extend(/** @lends maptalks.Handler.prototype */{
    includes: Z.Eventable,

    initialize: function (target) {
        this.target = target;
    },

    /**
     * Enables the handler
     * @return {maptalks.Handler} this
     */
    enable: function () {
        if (this._enabled) { return this; }
        this._enabled = true;
        this.addHooks();
        return this;
    },

    /**
     * Disablesthe handler
     * @return {maptalks.Handler} this
     */
    disable: function () {
        if (!this._enabled) { return this; }
        this._enabled = false;
        this.removeHooks();
        return this;
    },

    /**
     * Returns true if the handler is enabled.
     * @return {Boolean}
     */
    enabled: function () {
        return !!this._enabled;
    }
});

/**
 * A mixin, to enable a class with [interaction handlers]{@link maptalks.Handler}
 * @protected
 * @mixin
 */
Z.Handlerable = {
    /**
     * Register a handler
     * @param {String} name       - name of the handler
     * @param {maptalks.Handler}  - handler class
     * @return {*} this
     */
    addHandler: function (name, handlerClass) {
        if (!handlerClass) { return this; }
        if (!this._handlers) {
            this._handlers = [];
        }
        //handler已经存在
        if (this[name]) {
            this[name].enable();
            return this;
        }

        var handler = this[name] = new handlerClass(this);

        this._handlers.push(handler);

        if (this.options[name]) {
            handler.enable();
        }
        return this;
    },

    /**
     * Removes a handler
     * @param {String} name       - name of the handler
     * @return {*} this
     */
    removeHandler: function (name) {
        if (!name) { return this; }
        var handler = this[name];
        if (handler) {
            //handler registered
            var hit = Z.Util.indexOfArray(handler, this._handlers);
            if (hit >= 0) {
                this._handlers.splice(hit, 1);
            }
            this[name].disable();
            delete this[name];
        }
        return this;
    },

    _clearHandlers: function () {
        for (var i = 0, len = this._handlers.length; i < len; i++) {
            this._handlers[i].disable();
        }
    }
};

/**
 * Drag handler
 * @class
 * @category handler
 * @protected
 * @extends maptalks.Handler
 */
Z.Handler.Drag = Z.Handler.extend(/** @lends maptalks.Handler.Drag.prototype */{

    START: Z.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
    END: {
        mousedown: 'mouseup',
        touchstart: 'touchend',
        pointerdown: 'touchend',
        MSPointerDown: 'touchend'
    },
    MOVE: {
        mousedown: 'mousemove',
        touchstart: 'touchmove',
        pointerdown: 'touchmove',
        MSPointerDown: 'touchmove'
    },

    initialize:function (dom) {
        this.dom = dom;
    },

    enable:function () {
        if (!this.dom) { return; }
        Z.DomUtil.on(this.dom, this.START.join(' '), this.onMouseDown, this);
    },


    disable:function () {
        if (!this.dom) { return; }
        Z.DomUtil.off(this.dom, this.START.join(' '), this.onMouseDown);
    },

    onMouseDown:function (event) {
        if (Z.Util.isNumber(event.button) && event.button === 2) {
            //不响应右键事件
            return;
        }
        var dom = this.dom;
        if (dom.setCapture) {
            dom.setCapture();
        } else if (window.captureEvents) {
            window.captureEvents(window['Event'].MOUSEMOVE | window['Event'].MOUSEUP);
        }
        dom['ondragstart'] = function () { return false; };
        this.moved = false;
        var actual = event.touches ? event.touches[0] : event;
        this.startPos = new Z.Point(actual.clientX, actual.clientY);
        //2015-10-26 fuzhen 改为document, 解决鼠标移出地图容器后的不可控现象
        Z.DomUtil.on(document, this.MOVE[event.type], this.onMouseMove, this)
            .on(document, this.END[event.type], this.onMouseUp, this);
        this.fire('mousedown', {
            'domEvent' : event,
            'mousePos': new Z.Point(actual.clientX, actual.clientY)
        });
    },

    onMouseMove:function (event) {
        if (event.touches && event.touches.length > 1) {
            return;
        }
        var actual = event.touches ? event.touches[0] : event;

        var newPos = new Z.Point(actual.clientX, actual.clientY),
            offset = newPos.substract(this.startPos);
        if (!offset.x && !offset.y) {
            return;
        }
        if (!this.moved) {
            /**
             * 触发dragstart事件
             * @event dragstart
             * @return {Object} mousePos: {'left': 0px, 'top': 0px}
             */
            this.fire('dragstart', {
                'domEvent' : event,
                'mousePos':this.startPos.copy()
            });
            this.moved = true;
        } else {
             /**
             * 触发dragging事件
             * @event dragging
             * @return {Object} mousePos: {'left': 0px, 'top': 0px}
             */
            this.fire('dragging', {
                'domEvent' : event,
                'mousePos': new Z.Point(actual.clientX, actual.clientY)
            });
        }
    },

    onMouseUp:function (event) {
        var dom = this.dom;
        var actual = event.changedTouches ? event.changedTouches[0] : event;
        for (var i in this.MOVE) {
            Z.DomUtil
                .off(document, this.MOVE[i], this.onMouseMove, this)
                .off(document, this.END[i], this.onMouseUp, this);
        }
        if (dom['releaseCapture']) {
            dom['releaseCapture']();
        } else if (window.captureEvents) {
            window.captureEvents(window['Event'].MOUSEMOVE | window['Event'].MOUSEUP);
        }
        if (this.moved/* && this.moving*/) {
            /**
             * 触发dragend事件
             * @event dragend
             * @return {Object} mousePos: {'left': 0px, 'top': 0px}
             */
            this.fire('dragend', {
                'domEvent' : event,
                'mousePos': new Z.Point(parseInt(actual.clientX, 0), parseInt(actual.clientY, 0))
            });
        }
        this.fire('mouseup', {
            'domEvent' : event,
            'mousePos': new Z.Point(parseInt(actual.clientX, 0), parseInt(actual.clientY, 0))
        });
    }
});

/**
 * @classdesc
 * The parent class for all the map tools
 * @class
 * @abstract
 * @category maptool
 * @extends maptalks.Class
 * @mixins maptalks.Eventable
 * @param {options} [options=null] - construct options
 */
Z.MapTool = Z.Class.extend(/** @lends maptalks.MapTool.prototype */{
    includes: [Z.Eventable],

    /**
     * Adds the map tool to a map instance.
     * @param {maptalks.Map} map
     * @return {maptalks.MapTool} this
     */
    addTo: function (map) {
        if (!map) {
            return this;
        }
        this._map = map;
        var key = '_tool' + this.name;
        if (map[key]) {
            map[key].disable();
        }
        if (this._onAdd) {
            this._onAdd();
        }
        this.enable();
        map[key] = this;

        this._fireEvent('add');
        return this;
    },

    getMap:function () {
        return this._map;
    },

    /**
     * Enable the map tool.
     * @return {maptalks.MapTool} this
     */
    enable:function () {
        var map = this._map;
        if (!map || this._enabled) { return this; }
        this._enabled = true;
        this._switchEvents('off');
        if (this._loadResources) {
            this._loadResources(this._registerEvents);
        } else {
            this._registerEvents();
        }

        if (this._onEnable) {
            this._onEnable();
        }
        this._fireEvent('enable');
        return this;
    },

    /**
     * Disable the map tool
     * @return {maptalks.MapTool} this
     */
    disable:function () {
        if (!this._enabled || !this._map) {
            return this;
        }
        this._enabled = false;
        this._switchEvents('off');
        if (this._onDisable) {
            this._onDisable();
        }
        this._fireEvent('disable');
        return this;
    },

    /**
     * Returns whether the tool is enabled
     * @return {Boolean} true | false
     */
    isEnabled: function () {
        if (!this._enabled) {
            return false;
        }
        return true;
    },

    _registerEvents: function () {
        this._switchEvents('on');
    },

    _switchEvents: function (to) {
        var events = this._getEvents();
        if (events) {
            for (var p in events) {
                if (events.hasOwnProperty(p)) {
                    this._map[to](p, events[p], this);
                }
            }
        }
    },

    _fireEvent:function (eventName, param) {
        if (!param) {
            param = {};
        }
        this.fire(eventName, param);
    }
});

/**
 * @classdesc
 * A map tool to help draw geometries on the map
 * @class
 * @category maptool
 * @extends maptalks.Class
 * @mixins maptalks.Eventable
 * @param {options} [options=null] - construct options
 */
Z.DrawTool = Z.MapTool.extend(/** @lends maptalks.DrawTool.prototype */{

    options:{
        'symbol' : {
            'lineColor':'#000',
            'lineWidth':2,
            'lineOpacity':1,
            'polygonFill' : '#fff',
            'polygonOpacity' : 0.3
        },
        'mode' : null,
        'once' : false
    },

    initialize: function (options) {
        Z.Util.setOptions(this, options);
        this._checkMode();
    },

    /**
     * 设置绘图模式
     * @param {Number} mode 绘图模式
     * @expose
     */
    setMode:function (mode) {
        if (this._geometry) {
            this._geometry.remove();
            delete this._geometry;
        }
        this._switchEvents('off');
        this.options['mode'] = mode;
        this._checkMode();
        if (this.isEnabled()) {
            this._switchEvents('on');
        }
        return this;
    },

    /**
     * 获得drawtool的绘制样式
     * @return {Object} 绘制样式
     * @expose
     */
    getSymbol:function () {
        var symbol = this.options['symbol'];
        if (symbol) {
            return Z.Util.extendSymbol(symbol);
        } else {
            return Z.Util.extendSymbol(this.options['symbol']);
        }
    },

    /**
     * 设置drawtool的绘制样式
     * @param {Object} symbol 绘制样式
     * @expose
     */
    setSymbol:function (symbol) {
        if (!symbol) {
            return this;
        }
        this.options['symbol'] = symbol;
        if (this._geometry) {
            this._geometry.setSymbol(symbol);
        }
        return this;
    },

    /**
     * Get current mode of draw tool
     * @return {String} mode
     */
    getMode: function () {
        if (this.options['mode']) {
            return this.options['mode'].toLowerCase();
        }
        return null;
    },

    _onAdd: function () {
        this._checkMode();
    },

    _onEnable:function () {

        var map = this.getMap();
        this._mapDraggable = map.options['draggable'];
        this._mapDoubleClickZoom = map.options['doubleClickZoom'];
        this._autoBorderPanning = map.options['autoBorderPanning'];
        map.config({
            'autoBorderPanning' : true,
            'draggable': false,
            'doubleClickZoom':false
        });
        this._drawToolLayer = this._getDrawLayer();
        return this;
    },

    _checkMode: function () {
        var mode = this.getMode();
        if (!mode) {
            throw new Error('drawtool\'s mode is null.');
        }
        var modes = ['circle', 'ellipse', 'rectangle', 'point', 'linestring', 'polygon'];
        for (var i = 0; i < modes.length; i++) {
            if (mode === modes[i]) {
                return true;
            }
        }
        throw new Error('invalid mode for drawtool : ' + this.options['mode']);
    },

    _onDisable:function () {
        var map = this.getMap();
        map.config({
            'autoBorderPanning' : this._autoBorderPanning,
            'draggable': this._mapDraggable,
            'doubleClickZoom' : this._mapDoubleClickZoom
        });
        delete this._autoBorderPanning;
        delete this._mapDraggable;
        delete this._mapDoubleClickZoom;
        this._endDraw();
        map.removeLayer(this._getDrawLayer());
        return this;
    },

    _loadResources:function (onComplete) {
        var symbol = this.getSymbol();
        var resources = Z.Util.getExternalResources(symbol);
        if (Z.Util.isArrayHasData(resources)) {
            //load external resources at first
            this._drawToolLayer._getRenderer()._loadResources(resources, onComplete, this);
        } else {
            onComplete.call(this);
        }

    },

    _getProjection:function () {
        return this._map.getProjection();
    },

    _getEvents: function () {
        var mode = this.getMode();
        if (mode === 'polygon' || mode === 'linestring') {
            return {
                'click' : this._clickForPath,
                'mousemove' : this._mousemoveForPath,
                'dblclick'  : this._dblclickForPath
            };
        } else if (mode === 'point') {
            return {
                'click' : this._clickForPoint
            };
        } else {
            return {
                'mousedown' : this._mousedownToDraw
            };
        }
    },

    _addGeometryToStage:function (geometry) {
        var drawLayer = this._getDrawLayer();
        drawLayer.addGeometry(geometry);
    },

    _clickForPoint: function (param) {
        var geometry = new Z.Marker(param['coordinate']);
        if (this.options['symbol'] && this.options.hasOwnProperty('symbol')) {
            geometry.setSymbol(this.options['symbol']);
        }
        this._geometry = geometry;
        this._endDraw();
    },

    _clickForPath:function (param) {
        var containerPoint = this._getMouseContainerPoint(param);
        var coordinate = this._containerPointToLonlat(containerPoint);
        var symbol = this.getSymbol();
        if (!this._geometry) {
            //无论画线还是多边形, 都是从线开始的
            this._geometry = new Z.Polyline([coordinate]);

            if (symbol) {
                this._geometry.setSymbol(symbol);
            }
            this._addGeometryToStage(this._geometry);
            /**
             * drawstart event
             * @event maptalks.DrawTool#drawstart
             * @type {Object}
             */
            this._fireEvent('drawstart', param);
        } else {
            var path = this._getLonlats();
            path.push(coordinate);
            if (this.getMode() === 'polygon' && path.length === 3) {
                var polygon = new Z.Polygon([path]);
                if (symbol) {
                    var pSymbol = Z.Util.extendSymbol(symbol, {'lineOpacity':0});
                    polygon.setSymbol(pSymbol);
                }
                this._polygon = polygon;
                this._addGeometryToStage(polygon);

            }
                //这一行代码取消注释后, 会造成dblclick无法响应, 可能是存在循环调用,造成浏览器无法正常响应事件
            this._setLonlats(path);

            /**
             * 触发drawvertex事件：端点绘制事件，当为多边形或者多折线绘制了一个新的端点后会触发此事件
             * @event maptalks.DrawTool#drawvertex
             * @type {Object}
             */
            this._fireEvent('drawvertex', param);

        }
    },

    _mousemoveForPath : function (param) {
        if (!this._geometry) { return; }
        var containerPoint = this._getMouseContainerPoint(param);
        if (!this._isValidContainerPoint(containerPoint)) { return; }
        var coordinate = this._containerPointToLonlat(containerPoint);

        var path = this._getLonlats();
        var tailPath = [path[path.length - 1], coordinate];
        if (!this._movingTail) {
            var symbol = Z.Util.decreaseSymbolOpacity(this.getSymbol(), 0.5);
            this._movingTail = new Z.LineString(tailPath, {
                'symbol' : symbol
            });
            this._addGeometryToStage(this._movingTail);
        } else {
            this._movingTail.setCoordinates(tailPath);
        }
        param['geometry'] = this._geometry;
        this._fireEvent('mousemove', param);
    },

    _dblclickForPath:function (param) {
        if (!this._geometry) { return; }
        var containerPoint = this._getMouseContainerPoint(param);
        if (!this._isValidContainerPoint(containerPoint)) { return; }
        var coordinate = this._containerPointToLonlat(containerPoint);
        var path = this._getLonlats();
        path.push(coordinate);
        if (path.length < 2) { return; }
        //去除重复的端点
        var nIndexes = [],
            mode = this.getMode();
        var i, len;
        for (i = 1, len = path.length; i < len; i++) {
            if (path[i].x === path[i - 1].x && path[i].y === path[i - 1].y) {
                nIndexes.push(i);
            }
        }
        for (i = nIndexes.length - 1; i >= 0; i--) {
            path.splice(nIndexes[i], 1);
        }

        if (path.length < 2 || (mode === 'polygon' && path.length < 3)) {
            return;
        }
        this._geometry.remove();
        if (this._movingTail) {
            this._movingTail.remove();
        }
        delete this._movingTail;
        if (this._polygon) {
            this._polygon.remove();
        }
        if (mode === 'polygon') {
            this._geometry = new Z.Polygon([path]);
            var symbol = this.getSymbol();
            if (symbol) {
                this._geometry.setSymbol(symbol);
            }
            this._addGeometryToStage(this._geometry);
        } else {
            this._geometry.setCoordinates(path);
        }
        this._endDraw(param);
    },

    _mousedownToDraw : function (param) {
        var me = this;
        function genGeometry(coordinate) {
            var symbol = me.getSymbol();
            var geometry = me._geometry;
            var _map = me._map;
            var center;
            switch (me.getMode()) {
            case 'circle':
                if (!geometry) {
                    geometry = new Z.Circle(coordinate, 0);
                    geometry.setSymbol(symbol);
                    me._addGeometryToStage(geometry);
                    break;
                }
                center = geometry.getCenter();
                var radius = _map.computeLength(center, coordinate);
                geometry.setRadius(radius);
                break;
            case 'ellipse':
                if (!geometry) {
                    geometry = new Z.Ellipse(coordinate, 0, 0);
                    geometry.setSymbol(symbol);
                    me._addGeometryToStage(geometry);
                    break;
                }
                center = geometry.getCenter();
                var rx = _map.computeLength(center, new Z.Coordinate({x:coordinate.x, y:center.y}));
                var ry = _map.computeLength(center, new Z.Coordinate({x:center.x, y:coordinate.y}));
                geometry.setWidth(rx * 2);
                geometry.setHeight(ry * 2);
                break;
            case 'rectangle':
                if (!geometry) {
                    geometry = new Z.Rectangle(coordinate, 0, 0);
                    geometry.setSymbol(symbol);
                    me._addGeometryToStage(geometry);
                    break;
                }
                var nw = geometry.getCoordinates();
                var width = _map.computeLength(nw, new Z.Coordinate({x:coordinate.x, y:nw.y}));
                var height = _map.computeLength(nw, new Z.Coordinate({x:nw.x, y:coordinate.y}));
                geometry.setWidth(width);
                geometry.setHeight(height);
                break;
            }
            me._geometry = geometry;

        }
        function onMouseMove(_event) {
            if (!this._geometry) {
                return false;
            }
            var containerPoint = this._getMouseContainerPoint(_event);
            if (!this._isValidContainerPoint(containerPoint)) { return false; }
            var coordinate = this._containerPointToLonlat(containerPoint);
            genGeometry(coordinate);
            return false;
        }
        var onMouseUp = function (_event) {
            if (!this._geometry) {
                return false;
            }
            var containerPoint = this._getMouseContainerPoint(_event);
            if (this._isValidContainerPoint(containerPoint)) {
                var coordinate = this._containerPointToLonlat(containerPoint);
                genGeometry(coordinate);
            }
            this._map.off('mousemove', onMouseMove, this);
            this._map.off('mouseup', onMouseUp, this);
            this._endDraw(param);
            return false;
        };
        var containerPoint = this._getMouseContainerPoint(param);
        if (!this._isValidContainerPoint(containerPoint)) { return false; }
        var coordinate = this._containerPointToLonlat(containerPoint);
        this._fireEvent('drawstart', param);
        genGeometry(coordinate);
        this._map.on('mousemove', onMouseMove, this);
        this._map.on('mouseup', onMouseUp, this);
        return false;
    },

    _endDraw: function (param) {
        if (!this._geometry) {
            return;
        }
        var target = this._geometry.copy();
        this._geometry.remove();
        delete this._geometry;
        if (!param) {
            param = {};
        }
        param['geometry'] = target;
          /**
           * 绘制结束事件
           * @event maptalks.DrawTool#drawend
           * @type {Object}
           */
        this._fireEvent('drawend', param);
        if (this.options['once']) {
            this.disable();
        }
    },

    /**
     * Get coordinates of polyline or polygon
     * @private
     */
    _getLonlats:function () {
        if (this._geometry.getShell) {
            return this._geometry.getShell();
        }
        return this._geometry.getCoordinates();
    },

    _setLonlats:function (lonlats) {
        if (this._geometry instanceof Z.Polygon) {
            this._geometry.setCoordinates([lonlats]);

        } else if (this._geometry instanceof Z.Polyline) {
            this._geometry.setCoordinates(lonlats);
        }
        if (this._polygon) {
            this._polygon.setCoordinates([lonlats]);
        }
    },

    /**
     * Get container point of the mouse event
     * @param  {Event} event -  mouse event
     * @return {maptalks.Point}
     * @private
     */
    _getMouseContainerPoint:function (event) {
        Z.DomUtil.stopPropagation(event['domEvent']);
        var result = event['containerPoint'];
        return result;
    },

    /**
     * Convert a containerPoint to a coordinates
     * @param  {maptalks.Point} containerPoint - container point
     * @return {maptalks.Coordinate}
     * @private
     */
    _containerPointToLonlat:function (containerPoint) {
        var projection = this._getProjection(),
            map = this._map;

        //projected pLonlat
        var pLonlat = map._containerPointToPrj(containerPoint);
        return projection.unproject(pLonlat);
    },

    _isValidContainerPoint:function (containerPoint) {
        var mapSize = this._map.getSize();
        var w = mapSize['width'],
            h = mapSize['height'];
        if (containerPoint.x < 0 || containerPoint.y < 0) {
            return false;
        } else if (containerPoint.x > w || containerPoint.y > h) {
            return false;
        }
        return true;
    },

    _getDrawLayer:function () {
        var drawLayerId = Z.internalLayerPrefix + 'drawtool';
        var drawToolLayer = this._map.getLayer(drawLayerId);
        if (!drawToolLayer) {
            drawToolLayer = new Z.VectorLayer(drawLayerId, {'drawImmediate' : true});
            this._map.addLayer(drawToolLayer);
        }
        return drawToolLayer;
    },

    _fireEvent:function (eventName, param) {
        if (!param) {
            param = {};
        }
        if (!param['geometry'] && this._geometry) {
            param['geometry'] = this._geometry;
        }
        Z.MapTool.prototype._fireEvent.call(this, eventName, param);
    }

});

/**
 * @classdesc
 * A map tool to help measure distance on the map
 * @class
 * @category maptool
 * @extends maptalks.DrawTool
 * @mixins maptalks.Eventable
 * @param {options} [options=null] - construct options
 */
Z.DistanceTool = Z.DrawTool.extend(/** @lends maptalks.DistanceTool.prototype */{

    options:{
        'mode' : 'LineString',
        'language' : 'zh-CN', //'en-US'
        'metric': true,
        'imperial': false,
        'symbol' : {
            'lineColor':'#000', //'#3388ff',
            'lineWidth':3,
            'lineOpacity':1
        },
        'vertexSymbol' : {
            'markerType'        : 'ellipse',
            'markerFill'        : '#fff', //"#d0d2d6",
            'markerLineColor'   : '#000',
            'markerLineWidth'   : 3,
            'markerWidth'       : 10,
            'markerHeight'      : 10
        },
        'labelOptions' : {
            'symbol':{
                'textWrapCharacter' : '\n',
                'textFaceName' : 'monospace',
                'textLineSpacing' : 1,
                'textHorizontalAlignment' : 'right',
                'markerLineColor' : '#b4b3b3',
                'textDx' : 15
            },
            'boxPadding'   :   new Z.Size(6, 4)
        }
    },

    initialize: function (options) {
        Z.Util.setOptions(this, options);
        this.on('enable', this._afterEnable, this)
            .on('disable', this._afterDisable, this);
        this._measureLayers = [];
    },

    /**
     * Clear the measurements
     * @return {maptalks.DistanceTool} this
     */
    clear:function () {
        if (Z.Util.isArrayHasData(this._measureLayers)) {
            for (var i = 0; i < this._measureLayers.length; i++) {
                this._measureLayers[i].remove();
            }
        }
        delete this._lastMeasure;
        delete this._lastVertex;
        this._measureLayers = [];
        return this;
    },

    /**
     * Get the VectorLayers with the geometries drawn on the map during measuring.
     * @return {maptalks.Layer[]}
     */
    getMeasureLayers:function () {
        return this._measureLayers;
    },

    /**
     * Get last measuring result
     * @return {Number}
     */
    getLastMeasure:function () {
        if (!this._lastMeasure) {
            return 0;
        }
        return this._lastMeasure;
    },

    _measure:function (toMeasure) {
        var map = this.getMap();
        var length;
        if (toMeasure instanceof Z.Geometry) {
            length = map.computeGeometryLength(toMeasure);
        } else if (Z.Util.isArray(toMeasure)) {
            length = Z.GeoUtils.computeLength(toMeasure, map.getProjection());
        }
        this._lastMeasure = length;
        var units;
        if (this.options['language'] === 'zh-CN') {
            units = [' 米', ' 公里', ' 英尺', ' 英里'];
        } else {
            units = [' m', ' km', ' feet', ' mile'];
        }
        var content = '';
        if (this.options['metric']) {
            content += length < 1000 ? length.toFixed(0) + units[0] : (length / 1000).toFixed(2) + units[1];
        }
        if (this.options['imperial']) {
            length *= 3.2808399;
            if (content.length > 0) {
                content += '\n';
            }
            content += length < 5280 ? length.toFixed(0) + units[2] : (length / 5280).toFixed(2) + units[3];
        }
        return content;
    },

    _registerMeasureEvents:function () {
        this.on('drawstart', this._msOnDrawStart, this)
            .on('drawvertex', this._msOnDrawVertex, this)
            .on('mousemove', this._msOnMouseMove, this)
            .on('drawend', this._msOnDrawEnd, this);
    },

    _afterEnable:function () {
        this._registerMeasureEvents();
    },

    _afterDisable:function () {
        this.off('drawstart', this._msOnDrawStart, this)
            .off('drawvertex', this._msOnDrawVertex, this)
            .off('mousemove', this._msOnMouseMove, this)
            .off('drawend', this._msOnDrawEnd, this);
    },

    _msOnDrawStart:function (param) {
        var map = this.getMap();
        var guid = Z.Util.GUID();
        var layerId = 'distancetool_' + guid;
        var markerLayerId = 'distancetool_markers_' + guid;
        if (!map.getLayer(layerId)) {
            this._measureLineLayer = new maptalks.VectorLayer(layerId, {'drawImmediate' : true}).addTo(map);
            this._measureMarkerLayer = new maptalks.VectorLayer(markerLayerId, {'drawImmediate' : true}).addTo(map);
        } else {
            this._measureLineLayer = map.getLayer(layerId);
            this._measureMarkerLayer = map.getLayer(markerLayerId);
        }
        this._measureLayers.push(this._measureLineLayer);
        this._measureLayers.push(this._measureMarkerLayer);
        //start marker
        new maptalks.Marker(param['coordinate'], {
            'symbol' : this.options['vertexSymbol']
        }).addTo(this._measureMarkerLayer);
        var content = (this.options['language'] === 'zh-CN' ? '起点' : 'start');
        var startLabel = new maptalks.Label(content, param['coordinate'], this.options['labelOptions']);
        this._measureMarkerLayer.addGeometry(startLabel);
    },

    _msOnMouseMove:function (param) {
        var ms = this._measure(param['geometry'].getCoordinates().concat([param['coordinate']]));
        if (!this._tailMarker) {
            var symbol = Z.Util.extendSymbol(this.options['vertexSymbol']);
            symbol['markerWidth'] /= 2;
            symbol['markerHeight'] /= 2;
            this._tailMarker = new maptalks.Marker(param['coordinate'], {
                'symbol' : symbol
            }).addTo(this._measureMarkerLayer);
            this._tailLabel = new maptalks.Label(ms, param['coordinate'], this.options['labelOptions'])
                .addTo(this._measureMarkerLayer);
        }
        this._tailMarker.setCoordinates(param['coordinate']);
        this._tailLabel.setContent(ms);
        this._tailLabel.setCoordinates(param['coordinate']);

    },

    _msOnDrawVertex:function (param) {
        var geometry = param['geometry'];
        //vertex marker
        new maptalks.Marker(param['coordinate'], {
            'symbol' : this.options['vertexSymbol']
        }).addTo(this._measureMarkerLayer);
        var length = this._measure(geometry);
        var vertexLabel = new maptalks.Label(length, param['coordinate'], this.options['labelOptions']);
        this._measureMarkerLayer.addGeometry(vertexLabel);
        this._lastVertex = vertexLabel;
    },

    _msOnDrawEnd:function (param) {
        this._clearTailMarker();
        var size = this._lastVertex.getSize();
        if (!size) {
            size = new Z.Size(10, 10);
        }
        this._addClearMarker(this._lastVertex.getCoordinates(), size['width']);
        var geo = param['geometry'].copy();
        geo.addTo(this._measureLineLayer);
        this._lastMeasure = geo.getLength();
    },

    _addClearMarker:function (coordinates, dx) {
        var endMarker = new maptalks.Marker(coordinates, {
            'symbol' : [
                {
                    'markerType' : 'x',
                    'markerWidth' : 10,
                    'markerHeight' : 10,
                    'markerDx' : 20 + dx
                },
                {
                    'markerType' : 'square',
                    'markerFill' : '#ffffff',
                    'markerLineColor' : '#b4b3b3',
                    'markerLineWidth' : 2,
                    'markerWidth' : 15,
                    'markerHeight' : 15,
                    'markerDx' : 20 + dx
                }
            ]
        });
        var measureLineLayer = this._measureLineLayer,
            measureMarkerLayer = this._measureMarkerLayer;
        endMarker.on('click', function () {
            measureLineLayer.remove();
            measureMarkerLayer.remove();
            //return false to stop propagation of event.
            return false;
        }, this);
        endMarker.addTo(this._measureMarkerLayer);
    },

    _clearTailMarker:function () {
        if (this._tailMarker) {
            this._tailMarker.remove();
            delete this._tailMarker;
        }
        if (this._tailLabel) {
            this._tailLabel.remove();
            delete this._tailLabel;
        }
    }

});


/**
 * @classdesc
 * A map tool to help measure area on the map
 * @class
 * @category maptool
 * @extends maptalks.DistanceTool
 * @param {options} [options=null]          - construct options, including options defined in [DistanceTool]{@link maptalks.DistanceTool}
 * @param {options} [options.symbol=null]   - symbol of lines drawn during measuring
 */
Z.AreaTool = Z.DistanceTool.extend(/** @lends maptalks.AreaTool.prototype */{

    options:{
        'mode' : 'Polygon',
        'symbol' : {
            'lineColor':'#000000',
            'lineWidth':2,
            'lineOpacity':1,
            'lineDasharray': '',
            'polygonFill' : '#ffffff',
            'polygonOpacity' : 0.5
        }
    },

    initialize: function (options) {
        Z.Util.setOptions(this, options);
        this.on('enable', this._afterEnable, this)
            .on('disable', this._afterDisable, this);
        this._measureLayers = [];
    },

    _measure:function (toMeasure) {
        var map = this.getMap();
        var area;
        if (toMeasure instanceof Z.Geometry) {
            area = map.computeGeometryArea(toMeasure);
        } else if (Z.Util.isArray(toMeasure)) {
            area = Z.GeoUtils.computeArea(toMeasure, map.getProjection());
        }
        this._lastMeasure = area;
        var units;
        if (this.options['language'] === 'zh-CN') {
            units = [' 平方米', ' 平方公里', ' 平方英尺', ' 平方英里'];
        } else {
            units = [' sq.m', ' sq.km', ' sq.ft', ' sq.mi'];
        }
        var content = '';
        if (this.options['metric']) {
            content += area < 1E6 ? area.toFixed(0) + units[0] : (area / 1E6).toFixed(2) + units[1];
        }
        if (this.options['imperial']) {
            area *= 3.2808399;
            if (content.length > 0) {
                content += '\n';
            }
            var sqmi = 5280 * 5280;
            content += area < sqmi ? area.toFixed(0) + units[2] : (area / sqmi).toFixed(2) + units[3];
        }
        return content;
    },

    _msOnDrawVertex:function (param) {
        var vertexMarker = new maptalks.Marker(param['coordinate'], {
            'symbol' : this.options['vertexSymbol']
        }).addTo(this._measureMarkerLayer);

        this._lastVertex = vertexMarker;
    },

    _msOnDrawEnd:function (param) {
        this._clearTailMarker();

        var ms = this._measure(param['geometry']);
        var endLabel = new maptalks.Label(ms, param['coordinate'], this.options['labelOptions'])
                        .addTo(this._measureMarkerLayer);
        var size = endLabel.getSize();
        if (!size) {
            size = new Z.Size(10, 10);
        }
        this._addClearMarker(param['coordinate'], size['width']);
        var geo = param['geometry'].copy();
        geo.addTo(this._measureLineLayer);
        this._lastMeasure = geo.getArea();
    }
});

/**
 * @classdesc
 * A class internally used by tile layer helps to descibe tile system used by different tile services.<br>
 * Similar with [transformation]{@link maptalks.Transformation}, it contains 4 numbers: <br>
 * sx : the order of X-axis tile index, 1 means right is larger and -1 means the reverse, left is larger;<br>
 * sy : the order of Y-axis tile index, 1 means top is larger and -1 means the reverse, bottom is larger;<br>
 * ox : x of the origin point of the world's projected coordinate system <br>
 * oy : y of the origin point of the world's projected coordinate system <br>
 * @see {@link http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification}
 * @class
 * @category layer
 * @protected
 */
Z.TileSystem = function (sx, sy, ox, oy) {
    if (Z.Util.isArray(sx)) {
        this.scale =  {x : sx[0], y : sx[1]};
        this.origin = {x : sx[2], y : sx[3]};
    } else {
        this.scale =  {x : sx, y : sy};
        this.origin = {x : ox, y : oy};
    }
};

Z.Util.extend(Z.TileSystem, /** @lends maptalks.TileSystem */{
    /**
     * The most common used tile system, used by google maps, bing maps and amap, soso maps in China.
     * @see {@link https://en.wikipedia.org/wiki/Web_Mercator}
     * @constant
     * @static
     */
    'web-mercator' : new Z.TileSystem([1, -1, -20037508.34, 20037508.34]),

    /**
     * Predefined tile system for TMS tile system, A tile system published by [OSGEO]{@link http://www.osgeo.org/}. <br>
     * Also used by mapbox's [mbtiles]{@link https://github.com/mapbox/mbtiles-spec} specification.
     * @see {@link http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification}
     * @constant
     * @static
     */
    'tms-global-mercator' : new Z.TileSystem([1, 1, -20037508.34, -20037508.34]),

    /**
     * Another tile system published by [OSGEO]{@link http://www.osgeo.org/}, based on EPSG:4326 SRS.
     * @see {@link http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic}
     * @constant
     * @static
     */
    'tms-global-geodetic' : new Z.TileSystem([1, 1, -180, -90]),

    /**
     * Tile system used by [baidu]{@link http://map.baidu.com}
     * @constant
     * @static
     */
    'baidu' : new Z.TileSystem([1, 1, 0, 0])
});

/**
 * Get the default tile system's code for the projection.
 * @function
 * @static
 * @memberOf maptalks.TileSystem
 * @name  getDefault
 * @param  {Object} projection      - a projection object
 * @return {String} tile system code
 */
Z.TileSystem.getDefault = function (projection) {
    if (projection['code'].toLowerCase() === 'baidu') {
        return 'baidu';
    } else if (projection['code'].toLowerCase() === 'EPSG:4326'.toLowerCase()) {
        return 'tms-global-geodetic';
    } else {
        return 'web-mercator';
    }
};

/**
 * Tile config for tile layers, a utilities class for tile layers to render tiles
 * @class
 * @category layer
 * @extends {maptalks.Class}
 * @protected
 * @param {maptalks.TileSystem} tileSystem  - tileSystem
 * @param {maptalks.Extent} fullExtent      - fullExtent of the tile layer
 * @param {maptalks.Size} tileSize          - tile size
 */
Z.TileConfig = Z.Class.extend(/** @lends maptalks.TileConfig.prototype */{

        //根据不同的语言定义不同的错误信息
    exceptionDefs:{
        'en-US':{
            'INVALID_TILESYSTEM':'Invalid TileSystem'
        },
        'zh-CN':{
            'INVALID_TILESYSTEM':'无效的TileSystem'
        }
    },


    initialize:function (tileSystem, fullExtent, tileSize) {
        this.tileSize = tileSize;
        this.fullExtent = fullExtent;
        this.prepareTileInfo(tileSystem, fullExtent);
    },

    prepareTileInfo:function (tileSystem, fullExtent) {
        if (Z.Util.isString(tileSystem)) {
            tileSystem = Z.TileSystem[tileSystem.toLowerCase()];
        } else if (Z.Util.isArray(tileSystem)) {
            tileSystem = new Z.TileSystem(tileSystem);
        }

        if (!tileSystem) {
            throw new Error(this.exceptions['INVALID_TILESYSTEM']);
        }
        this.tileSystem = tileSystem;

            //自动计算transformation
        var a = fullExtent['right'] > fullExtent['left'] ? 1 : -1,
            b = fullExtent['top'] > fullExtent['bottom'] ? -1 : 1,
            c = tileSystem['origin']['x'],
            d = tileSystem['origin']['y'];
        this.transformation = new Z.Transformation([a, b, c, d]);
            //计算transform后的以像素为单位的原点
        tileSystem['transOrigin'] = this.transformation.transform(tileSystem['origin'], 1);
    },

    getTileIndex:function (point, res) {
        var tileSystem = this.tileSystem, tileSize = this['tileSize'],
            transOrigin = tileSystem['transOrigin'],
            delta = 1E-7;

        var tileX = Math.floor(delta + (point.x - transOrigin.x) / (tileSize['width'] * res));
        var tileY = -Math.floor(delta + (point.y - transOrigin.y) / (tileSize['height'] * res));

        return {'x':tileSystem['scale']['x'] * tileX, 'y':tileSystem['scale']['y'] * tileY};
    },

    /**
     * 根据中心点投影坐标, 计算中心点对应的瓦片和瓦片内偏移量
     * @param  {*} pLonlat   [description]
     * @param  {*} res [description]
     * @return {*}           [description]
     */
    getCenterTile:function (pLonlat, res) {
        var tileSystem = this.tileSystem,
            tileSize = this['tileSize'];
        var point = this.transformation.transform(pLonlat, 1);
        var tileIndex = this.getTileIndex(point, res);

        var tileLeft = tileIndex['x'] * tileSize['width'];
        var tileTop = tileIndex['y'] * tileSize['height'];

        var offsetLeft = Math.round(point.x / res - tileSystem['scale']['x'] * tileLeft);
        var offsetTop = Math.round(point.y / res + tileSystem['scale']['y'] * tileTop);

            //如果x方向为左大右小
        if (tileSystem['scale']['x'] < 0) {
            tileIndex['x'] -= 1;
        }
            //如果y方向上大下小
        if (tileSystem['scale']['y'] > 0) {
            tileIndex['y'] -= 1;
        }

            //有可能tileIndex超出世界范围
        tileIndex = this.getNeighorTileIndex(tileIndex['y'], tileIndex['x'], 0, 0, true);

        return {'x':tileIndex['x'], 'y':tileIndex['y'], 'offsetLeft':offsetLeft, 'offsetTop':offsetTop};
    },

    /**
     * 根据给定的瓦片编号,和坐标编号偏移量,计算指定的瓦片编号
     * @param  {*} tileY   [description]
     * @param  {*} tileX   [description]
     * @param  {*} offsetY [description]
     * @param  {*} offsetX [description]
     * @param  {*} zoomLevel [description]
     * @return {*}         [description]
     */
    getNeighorTileIndex:function (tileY, tileX, offsetY, offsetX, res, isRepeatWorld) {
        var tileSystem = this.tileSystem;
        var x = (tileX + tileSystem['scale']['x'] * offsetX);
        var y = (tileY - tileSystem['scale']['y'] * offsetY);
            //连续世界瓦片计算
        if (isRepeatWorld) {
            var ext = this._getTileFullIndex(res);
            if (x < ext['xmin']) {
                x = ext['xmax'] - (ext['xmin'] - x) % (ext['xmax'] - ext['xmin']);
                if (x === ext['xmax']) {
                    x = ext['xmin'];
                }
            } else if (x >= ext['xmax']) {
                x = ext['xmin'] + (x - ext['xmin']) % (ext['xmax'] - ext['xmin']);
            }

            if (y >= ext['ymax']) {
                y = ext['ymin'] + (y - ext['ymin']) % (ext['ymax'] - ext['ymin']);
            } else if (y < ext['ymin']) {
                y = ext['ymax'] - (ext['ymin'] - y) % (ext['ymax'] - ext['ymin']);
                if (y === ext['ymax']) {
                    y = ext['ymin'];
                }
            }
        }
        return {'x':x, 'y':y};
    },

    _getTileFullIndex:function (res) {
        var ext = this.fullExtent;
        var transformation = this.transformation;
        var nwIndex = this.getTileIndex(transformation.transform(new Z.Coordinate(ext['left'], ext['right']), 1), res);
        var seIndex = this.getTileIndex(transformation.transform(new Z.Coordinate(ext['right'], ext['bottom']), 1), res);
        return new Z.Extent(nwIndex, seIndex);
    },

    /**
     * 计算瓦片左下角的大地投影坐标
     * @param  {*} tileY     [description]
     * @param  {*} tileX     [description]
     * @param  {*} res       [description]
     * @return {*}           [description]
     */
    getTileProjectedSw: function (tileY, tileX, res) {
        var tileSystem = this.tileSystem;
        var tileSize = this['tileSize'];
        var y = tileSystem['origin']['y'] + tileSystem['scale']['y'] * (tileY + (tileSystem['scale']['y'] === 1 ? 0 : 1)) * (res * tileSize['height']);
        var x = tileSystem['scale']['x'] * (tileX + (tileSystem['scale']['x'] === 1 ? 0 : 1)) * res * tileSize['width'] + tileSystem['origin']['x'];
        return [x, y];
    }


});

if (typeof Promise !== 'undefined') {
    //built in Promise
    Z.Promise = Promise;
} else {
// zousan - A Lightning Fast, Yet Very Small Promise A+ Compliant Implementation
// https://github.com/bluejava/zousan
// Version 2.2.2

/* jshint asi: true, browser: true */
/* global setImmediate, console */
(function(_global){

        "use strict";

        var
            STATE_PENDING,                  // These are the three possible states (PENDING remains undefined - as intended)
            STATE_FULFILLED = "fulfilled",      // a promise can be in.  The state is stored
            STATE_REJECTED = "rejected",        // in this.state as read-only

            _undefined,                     // let the obfiscator compress these down
            _undefinedString = "undefined";     // by assigning them to variables (debatable "optimization")

        // See http://www.bluejava.com/4NS/Speed-up-your-Websites-with-a-Faster-setTimeout-using-soon
        // This is a very fast "asynchronous" flow control - i.e. it yields the thread and executes later,
        // but not much later. It is far faster and lighter than using setTimeout(fn,0) for yielding threads.
        // Its also faster than other setImmediate shims, as it uses Mutation Observer and "mainlines" successive
        // calls internally.
        // WARNING: This does not yield to the browser UI loop, so by using this repeatedly
        //      you can starve the UI and be unresponsive to the user.
        // This is an even FASTER version of https://gist.github.com/bluejava/9b9542d1da2a164d0456 that gives up
        // passing context and arguments, in exchange for a 25x speed increase. (Use anon function to pass context/args)
        var soon = (function() {

                var fq = [], // function queue;
                    fqStart = 0, // avoid using shift() by maintaining a start pointer - and remove items in chunks of 1024 (bufferSize)
                    bufferSize = 1024

                function callQueue()
                {
                    while(fq.length - fqStart) // this approach allows new yields to pile on during the execution of these
                    {
                        fq[fqStart](); // no context or args..
                        fq[fqStart++] = _undefined  // increase start pointer and dereference function just called
                        if(fqStart == bufferSize)
                        {
                            fq.splice(0,bufferSize);
                            fqStart = 0;
                        }
                    }
                }

                // run the callQueue function asyncrhonously, as fast as possible
                var cqYield = (function() {

                        // This is the fastest way browsers have to yield processing
                        if(typeof MutationObserver !== _undefinedString)
                        {
                            // first, create a div not attached to DOM to "observe"
                            var dd = document.createElement("div");
                            var mo = new MutationObserver(callQueue);
                            mo.observe(dd, { attributes: true });

                            return function() { dd.setAttribute("a",0); } // trigger callback to
                        }

                        // if No MutationObserver - this is the next best thing - handles Node and MSIE
                        if(typeof setImmediate !== _undefinedString)
                            return function() { setImmediate(callQueue) }

                        // final fallback - shouldn't be used for much except very old browsers
                        return function() { setTimeout(callQueue,0) }
                    })();

                // this is the function that will be assigned to soon
                // it takes the function to call and examines all arguments
                return function(fn) {

                        // push the function and any remaining arguments along with context
                        fq.push(fn);

                        if((fq.length - fqStart) == 1) // upon adding our first entry, kick off the callback
                            cqYield();
                    };

            })();

        // -------- BEGIN our main "class" definition here -------------

        function Zousan(func)
        {
            //  this.state = STATE_PENDING; // Inital state (PENDING is undefined, so no need to actually have this assignment)
            //this.c = [];          // clients added while pending.   <Since 1.0.2 this is lazy instantiation>

            // If a function was specified, call it back with the resolve/reject functions bound to this context
            if(func)
            {
                var me = this;
                func(
                    function(arg) { me.resolve(arg) },  // the resolve function bound to this context.
                    function(arg) { me.reject(arg) })   // the reject function bound to this context
            }
        }

        Zousan.prototype = {    // Add 6 functions to our prototype: "resolve", "reject", "then", "catch", "finally" and "timeout"

                resolve: function(value)
                {
                    if(this.state !== STATE_PENDING)
                        return;

                    if(value === this)
                        return this.reject(new TypeError("Attempt to resolve promise with self"));

                    var me = this; // preserve this

                    if(value && (typeof value === "function" || typeof value === "object"))
                    {
                        try
                        {
                            var first = true; // first time through?
                            var then = value.then;
                            if(typeof then === "function")
                            {
                                // and call the value.then (which is now in "then") with value as the context and the resolve/reject functions per thenable spec
                                then.call(value,
                                    function(ra) { if(first) { first=false; me.resolve(ra);}  },
                                    function(rr) { if(first) { first=false; me.reject(rr); } });
                                return;
                            }
                        }
                        catch(e)
                        {
                            if(first)
                                this.reject(e);
                            return;
                        }
                    }

                    this.state = STATE_FULFILLED;
                    this.v = value;

                    if(me.c)
                        soon(function() {
                                for(var n=0, l=me.c.length;n<l;n++)
                                    resolveClient(me.c[n],value);
                            });
                },

                reject: function(reason)
                {
                    if(this.state !== STATE_PENDING)
                        return;

                    this.state = STATE_REJECTED;
                    this.v = reason;

                    var clients = this.c;
                    if(clients)
                        soon(function() {
                                for(var n=0, l=clients.length;n<l;n++)
                                    rejectClient(clients[n],reason);
                            });
                    else
                        if(!Zousan.suppressUncaughtRejectionError)
                            console.log("You upset Zousan. Please catch rejections: ",reason,reason.stack);
                },

                then: function(onF,onR)
                {
                    var p = new Zousan();
                    var client = {y:onF,n:onR,p:p};

                    if(this.state === STATE_PENDING)
                    {
                         // we are pending, so client must wait - so push client to end of this.c array (create if necessary for efficiency)
                        if(this.c)
                            this.c.push(client);
                        else
                            this.c = [client];
                    }
                    else // if state was NOT pending, then we can just immediately (soon) call the resolve/reject handler
                    {
                        var s = this.state, a = this.v;
                        soon(function() { // we are not pending, so yield script and resolve/reject as needed
                                if(s === STATE_FULFILLED)
                                    resolveClient(client,a);
                                else
                                    rejectClient(client,a);
                            });
                    }

                    return p;
                },

                "catch": function(cfn) { return this.then(null,cfn); }, // convenience method
                "finally": function(cfn) { return this.then(cfn,cfn); }, // convenience method

                // new for 1.2  - this returns a new promise that times out if original promise does not resolve/reject before the time specified.
                // Note: this has no effect on the original promise - which may still resolve/reject at a later time.
                "timeout" : function(ms,timeoutMsg)
                {
                    timeoutMsg = timeoutMsg || "Timeout"
                    var me = this;
                    return new Zousan(function(resolve,reject) {

                            setTimeout(function() {
                                    reject(Error(timeoutMsg));  // This will fail silently if promise already resolved or rejected
                                }, ms);

                            me.then(function(v) { resolve(v) },     // This will fail silently if promise already timed out
                                    function(er) { reject(er) });       // This will fail silently if promise already timed out

                        })
                }

            }; // END of prototype function list

        function resolveClient(c,arg)
        {
            if(typeof c.y === "function")
            {
                try {
                        var yret = c.y.call(_undefined,arg);
                        c.p.resolve(yret);
                    }
                catch(err) { c.p.reject(err) }
            }
            else
                c.p.resolve(arg); // pass this along...
        }

        function rejectClient(c,reason)
        {
            if(typeof c.n === "function")
            {
                try
                {
                    var yret = c.n.call(_undefined,reason);
                    c.p.resolve(yret);
                }
                catch(err) { c.p.reject(err) }
            }
            else
                c.p.reject(reason); // pass this along...
        }

        // "Class" functions follow (utility functions that live on the Zousan function object itself)

        Zousan.resolve = function(val) { var z = new Zousan(); z.resolve(val); return z; }

        Zousan.reject = function(err) { var z = new Zousan(); z.reject(err); return z; }

        Zousan.all = function(pa)
        {
            var results = [ ], rc = 0, retP = new Zousan(); // results and resolved count

            function rp(p,i)
            {
                if(typeof p.then !== "function")
                    p = Zousan.resolve(p);
                p.then(
                        function(yv) { results[i] = yv; rc++; if(rc == pa.length) retP.resolve(results); },
                        function(nv) { retP.reject(nv); }
                    );
            }

            for(var x=0;x<pa.length;x++)
                rp(pa[x],x);

            // For zero length arrays, resolve immediately
            if(!pa.length)
                retP.resolve(results);

            return retP;
        }

        // If this appears to be a commonJS environment, assign Zousan as the module export
        // if(typeof module != _undefinedString && module.exports)     // jshint ignore:line
        //     module.exports = Zousan;    // jshint ignore:line

        // If this appears to be an AMD environment, define Zousan as the module export (commented out until confirmed works with r.js)
        //if(global.define && global.define.amd)
        //  global.define([], function() { return Zousan });

        // Make Zousan a global variable in all environments
        // global.Zousan = Zousan;

        // make soon accessable from Zousan
        // Zousan.soon = soon;

        //by maptalks
        _global.Promise = Zousan;

        // make soon accessable from Zousan
        // Zousan.soon = soon;

    })(/*typeof global != "undefined" ? global : this*//* by maptalks*/Z);   // jshint ignore:line
}

/**
 * Common methods for classes can be rendered, e.g. Map, Layers
 * @mixin
 * @protected
 */
Z.Renderable = {
    /**
     * Register a renderer class with the given name.
     * @param  {String} name  - renderer's register key
     * @param  {Function} clazz - renderer's class, a function (not necessarily a [maptalks.Class]{@link maptalks.Class}).
     * @static
     * @return {*} this
     */
    registerRenderer : function (name, clazz) {
        if (!this._regRenderers) {
            this._regRenderers = {};
        }
        this._regRenderers[name.toLowerCase()] = clazz;
        return this;
    },

    /**
     * Get the registered renderer class by the given name
     * @param  {String} name  - renderer's register key
     * @return {Function} renderer's class
     * @static
     */
    getRendererClass : function (name) {
        if (!this._regRenderers) {
            return null;
        }
        return this._regRenderers[name.toLowerCase()];
    }
};

/**
 * @classdesc
 * Base class for all the layers, defines common methods that all the layer classes share.
 * @class
 * @category layer
 * @abstract
 * @extends maptalks.Class
 * @mixes maptalks.Eventable
 * @mixes maptalks.Renderable
 */
Z.Layer = Z.Class.extend(/** @lends maptalks.Layer.prototype */{

    includes: Z.Eventable,

    /**
     * @property {Object}  [options=null] - base options of layer.
     * @property {Number}  [options.minZoom=-1] - the minimum zoom to display the layer, set to -1 to unlimit it.
     * @property {Number}  [options.maxZoom=-1] - the maximum zoom to display the layer, set to -1 to unlimit it.
     * @property {Boolean} [options.visible=true] - whether to display the layer.
     * @property {Number}  [options.opacity=1] - opacity of the layer, from 0 to 1.
     * @property {String}  [options.renderer=canvas] - renderer type. Don't change it if you are not sure about it. About renderer, see [TODO]{@link tutorial.renderer}.
     */
    options:{
        //最大最小可视范围, null表示不受限制
        'minZoom':null,
        'maxZoom':null,
        //图层是否可见
        'visible':true,
        'opacity': 1,
        'renderer' : 'canvas'
    },

    initialize:function (id, opts) {
        this.setId(id);
        Z.Util.setOptions(this, opts);
    },


     /**
     * load the tile layer, can't be overrided by sub-classes
     */
    load:function () {
        if (!this.getMap()) { return this; }
        this._initRenderer();
        var zIndex = this.getZIndex();
        if (this._prepareLoad()) {
            if (this._renderer) {
                if (!Z.Util.isNil(zIndex)) {
                    this._renderer.setZIndex(zIndex);
                }
                this._renderer.render();
            }
        }
        return this;
    },

    /**
     * Get the layer id
     * @returns {String|Number} id
     */
    getId:function () {
        return this._id;
    },

    /**
     * Set a new id to the layer
     * @param {String|Number} id - new layer id
     * @return {maptalks.Layer} this
     * @fires maptalks.Layer#idchange
     */
    setId:function (id) {
        //TODO 设置id可能造成map无法找到layer
        var old = this._id;
        this._id = id;
        /**
         * idchange event.
         *
         * @event maptalks.Layer#idchange
         * @type {Object}
         * @property {String} type - idchange
         * @property {maptalks.Layer} target    - the layer fires the event
         * @property {String|Number} old        - value of the old id
         * @property {String|Number} new        - value of the new id
         */
        this.fire('idchange', {'old':old, 'new':id});
        return this;
    },

    /**
     * Adds itself to a map.
     * @param {maptalks.Map} map - map added to
     * @return {maptalks.Layer} this
     */
    addTo:function (map) {
        map.addLayer(this);
        return this;
    },

    /**
     * Set a z-index to the layer
     * @param {Number} zIndex - layer's z-index
     * @return {maptalks.Layer} this
     */
    setZIndex:function (zIndex) {
        this._zIndex = zIndex;
        if (this.map) {
            var layerList = this._getLayerList();
            this.map._sortLayersByZIndex(layerList);
        }
        if (this._renderer) {
            this._renderer.setZIndex(zIndex);
        }
        return this;
    },

    /**
     * Get the layer's z-index
     * @return {Number}
     */
    getZIndex:function () {
        return this._zIndex;
    },

    /**
     * If the layer is rendered by HTML5 Canvas 2d.
     * @return {Boolean}
     * @protected
     */
    isCanvasRender:function () {
        var renderer = this._getRenderer();
        if (renderer) {
            return renderer.isCanvasRender();
        }
        return false;
    },

    /**
     * Get the map that the layer added to
     * @returns {maptalks.Map}
     */
    getMap:function () {
        if (this.map) {
            return this.map;
        }
        return null;
    },


    /**
     * Brings the layer to the top of all the layers
     * @returns {maptalks.Layer} this
     */
    bringToFront:function () {
        var layers = this._getLayerList();
        if (!layers) {
            return this;
        }
        var topLayer = layers[layers.length - 1];
        if (layers.length === 1 || topLayer === this) {
            return this;
        }
        var max = topLayer.getZIndex();
        this.setZIndex(max + 1);
        return this;
    },

    /**
     * Brings the layer under the bottom of all the layers
     * @returns {maptalks.Layer} this
     */
    bringToBack:function () {
        var layers = this._getLayerList();
        if (!layers) {
            return this;
        }
        var bottomLayer = layers[0];
        if (layers.length === 1 || bottomLayer === this) {
            return this;
        }
        var min = bottomLayer.getZIndex();
        this.setZIndex(min - 1);
        return this;
    },

    /**
     * Show the layer
     * @returns {maptalks.Layer} this
     */
    show:function () {
        if (!this.options['visible']) {
            this.options['visible'] = true;
            if (this._getRenderer()) {
                this._getRenderer().show();
            }
        }
        this.fire('show');
        return this;
    },

    /**
     * Hide the layer
     * @returns {maptalks.Layer} this
     */
    hide:function () {
        if (this.options['visible']) {
            this.options['visible'] = false;
            if (this._getRenderer()) {
                this._getRenderer().hide();
            }
        }
        this.fire('hide');
        return this;
    },

    isLoaded:function () {
        if (!this._renderer) {
            return false;
        }
        return this._renderer.isLoaded();
    },

    /**
     * Whether the layer is visible now.
     * @return {Boolean}
     */
    isVisible:function () {
        if (Z.Util.isNumber(this.options['opacity']) && this.options['opacity'] <= 0) {
            return false;
        }
        var map = this.getMap();
        if (map) {
            var zoom = map.getZoom();
            if ((!Z.Util.isNil(this.options['maxZoom']) && this.options['maxZoom'] < zoom) ||
                    (!Z.Util.isNil(this.options['minZoom']) && this.options['minZoom'] > zoom)) {
                return false;
            }
        }

        if (Z.Util.isNil(this.options['visible'])) {
            this.options['visible'] = true;
        }
        return this.options['visible'];
    },

    /**
     * Remove itself from the map added to.
     * @returns {maptalks.Layer} this
     */
    remove:function () {
        if (this.map) {
            this.map.removeLayer(this);
        }
        return this;
    },

    /**
     * Get the mask geometry of the layer
     * @return {maptalks.Geometry}
     */
    getMask:function () {
        return this._mask;
    },

    /**
     * Set a mask geometry on the layer, only the area in the mask will be displayed.
     * @param {maptalks.Geometry} mask - mask geometry, can only be a Marker with vector symbol, a Polygon or a MultiPolygon
     * @returns {maptalks.Layer} this
     */
    setMask:function (mask) {
        if (!((mask instanceof Z.Marker && Z.symbolizer.VectorMarkerSymbolizer.test(mask.getSymbol())) ||
                mask instanceof Z.Polygon || mask instanceof Z.MultiPolygon)) {
            throw new Error('mask has to be a Marker with vector symbol, a Polygon or a MultiPolygon');
        }

        if (mask instanceof Z.Marker) {
            mask.setSymbol(Z.Util.extendSymbol(mask.getSymbol(), {
                'markerLineWidth': 0,
                'markerFillOpacity': 1
            }));
        } else {
            mask.setSymbol({
                'lineWidth':0,
                'polygonOpacity':1
            });
        }
        mask._bindLayer(this);
        this._mask = mask;
        if (!this.getMap() || this.getMap()._isBusy()) {
            return this;
        }
        if (this._getRenderer()) {
            this._getRenderer().render();
        }
        return this;
    },

    /**
     * Remove the mask
     * @returns {maptalks.Layer} this
     */
    removeMask:function () {
        delete this._mask;
        if (!this.getMap() || this.getMap()._isBusy()) {
            return this;
        }
        if (this._getRenderer()) {
            this._getRenderer().render();
        }
        return this;
    },

    _refreshMask: function () {
        if (this._mask) {
            this._mask._onZoomEnd();
        }
    },

    /**
     * Prepare Layer's loading, this is a method intended to be overrided by subclasses.
     * @return {Boolean} true to continue, false to cease.
     * @protected
     */
    _prepareLoad:function () {
        return true;
    },

    _onRemove:function () {
        this._switchEvents('off', this);
        this._removeEvents();
        if (this._renderer) {
            this._switchEvents('off', this._renderer);
            this._renderer.remove();
            delete this._renderer;
        }
        delete this.map;
    },

    _bindMap:function (map, zIndex) {
        if (!map) { return; }
        this.map = map;
        this.setZIndex(zIndex);
        this._registerEvents();
        if (this._getEvents && this._getEvents()) {
            this._switchEvents('on', this);
        }
        this.fire('add');
    },

    _initRenderer:function () {
        var renderer = this.options['renderer'];
        if (!this.constructor.getRendererClass) {
            return;
        }
        var clazz = this.constructor.getRendererClass(renderer);
        if (!clazz) {
            return;
        }
        this._renderer = new clazz(this);
        this._renderer.setZIndex(this.getZIndex());
        this._switchEvents('on', this._renderer);
    },

    _switchEvents: function (to, emitter) {
        if (emitter && emitter._getEvents) {
            var events = emitter._getEvents();
            if (events) {
                var map = this.getMap();
                for (var p in events) {
                    if (events.hasOwnProperty(p)) {
                        map[to](p, events[p], emitter);
                    }
                }
            }
        }
    },

    _registerEvents: function () {
        this.getMap().on('_zoomend', this._refreshMask, this);
    },

    _removeEvents: function () {
        this.getMap().off('_zoomend', this._refreshMask, this);
    },

    _getRenderer:function () {
        return this._renderer;
    },

    _getLayerList:function () {
        if (!this.map) { return null; }
        return this.map._layers;
    }
});

Z.Util.extend(Z.Layer, Z.Renderable);



/**
 * @classdesc
 * A layer used to display tiled map services, such as [google maps]{@link http://maps.google.com}, [open street maps]{@link http://www.osm.org}
 * @class
 * @category layer
 * @extends maptalks.Layer
 * @param {String|Number} id - tile layer's id
 * @param {Object} [options=null] - construct options
 * @param {Boolean} [options.debug=false] - if set to true, tile's border will be drawn and tile's xyz coordinate will be drawn on the left top corner.
 * @param {*} options.* - any other option defined in [maptalks.Layer]{@link maptalks.Layer#options}
 */
Z.TileLayer = Z.Layer.extend(/** @lends maptalks.TileLayer.prototype */{

    options: {
        'errorTileUrl'  : null,
        'urlTemplate'   : null,
        'subdomains'    : null,

        'gradualLoading' : true,

        'repeatWorld'   : true,

        'renderWhenPanning' : false,
        //移图时地图的更新间隔, 默认为0即实时更新, -1表示不更新.如果效率较慢则可改为适当的值
        'renderSpanWhenPanning' : (function () { return Z.Browser.mobile ? -1 : 100; })(),

        'crossOrigin' : null,

        'tileSize' : {
            'width'   : 256,
            'height'  : 256
        },

        'tileSystem' : null,
        'debug'      : false,

        'baseLayerRenderer' : (function () { return Z.node ? 'canvas' : 'dom'; })(),

        'renderer'   : 'canvas'
    },


    /**
     * Get tile size of the tile layer
     * @return {maptalks.Size}
     */
    getTileSize:function () {
        var size = this.options['tileSize'];
        return new Z.Size(size['width'], size['height']);
    },

    /**
     * Clear the layer
     * @return {maptalks.TileLayer} this
     */
    clear:function () {
        if (this._renderer) {
            this._renderer.clear();
        }
        this.fire('clear');
        return this;
    },

    _initRenderer:function () {
        var renderer = this.options['renderer'];
        if (this.getMap().getBaseLayer() === this) {
            renderer = this.options['baseLayerRenderer'];
            if (this.getMap()._getRenderer()._isCanvasContainer) {
                renderer = 'canvas';
            }
        }
        if (!this.constructor.getRendererClass) {
            return;
        }
        var clazz = this.constructor.getRendererClass(renderer);
        if (!clazz) {
            return;
        }
        this._renderer = new clazz(this);
        this._renderer.setZIndex(this.getZIndex());
        this._switchEvents('on', this._renderer);
    },

    /**
     * initialize [tileConfig]{@link maptalks.TileConfig} for the tilelayer
     * @private
     */
    _initTileConfig:function () {
        var map = this.getMap();
        this._defaultTileConfig = new Z.TileConfig(Z.TileSystem.getDefault(map.getProjection()), map.getFullExtent(), this.getTileSize());
        if (this.options['tileSystem']) {
            this._tileConfig = new Z.TileConfig(this.options['tileSystem'], map.getFullExtent(), this.getTileSize());
        }
    },

    _getTileConfig:function () {
        if (!this._defaultTileConfig) {
            this._initTileConfig();
        }
        var tileConfig = this._tileConfig;
        if (tileConfig) { return tileConfig; }
        var map = this.getMap();
        //inherit baselayer's tileconfig
        if (map && map.getBaseLayer() && map.getBaseLayer()._getTileConfig) {
            return map.getBaseLayer()._getTileConfig();
        }
        return this._defaultTileConfig;
    },

    _getTiles:function (containerSize) {
        // rendWhenReady = false;
        var map = this.getMap();
        if (!map) {
            return null;
        }
        if (!this.isVisible()) {
            return null;
        }

        var tileConfig = this._getTileConfig();
        if (!tileConfig) { return null; }

        var tileSize = this.getTileSize(),
            zoom = map.getZoom(),
            res = map._getResolution(),
            mapViewPoint = map.offsetPlatform();

        var mapW = map.width,
            mapH = map.height;
            //中心瓦片信息,包括瓦片编号,和中心点在瓦片上相对左上角的位置
        var centerTile =  tileConfig.getCenterTile(map._getPrjCenter(), res);
        //计算中心瓦片的top和left偏移值
        var centerPoint = new Z.Point(+(mapW / 2 - centerTile['offsetLeft']),
                                                +(mapH / 2 - centerTile['offsetTop']))._round();
        if (!containerSize || !(containerSize instanceof Z.Size)) {
            containerSize = new Z.Size(mapW, mapH);
        }
        //中心瓦片上下左右的瓦片数
        var top = Math.ceil(Math.abs((containerSize['height'] - mapH) / 2 + centerPoint.y) / tileSize['height']),
            left = Math.ceil(Math.abs((containerSize['width'] - mapW) / 2 + centerPoint.x) / tileSize['width']),
            bottom = Math.ceil(Math.abs((containerSize['height'] - mapH) / 2 + mapH - centerPoint.y) / tileSize['height']),
            right = Math.ceil(Math.abs((containerSize['width'] - mapW) / 2 + mapW - centerPoint.x) / tileSize['width']);

    //  只加中心的瓦片，用做调试
    //  var centerTileImg = this._createTileImage(centerPoint.x,centerPoint.y,this.config._getTileUrl(centerTile['topIndex'],centerTile['leftIndex'],zoom),tileSize['height'],tileSize['width']);
    //  tileContainer.appendChild(centerTileImg);

        var tiles = [];
        var fullExtent = new Z.PointExtent();
        //TODO 瓦片从中心开始加起
        for (var i = -(left); i < right; i++) {
            for (var j = -(top); j <= bottom; j++) {
                var tileIndex = tileConfig.getNeighorTileIndex(centerTile['y'], centerTile['x'], j, i, res, this.options['repeatWorld']);
                var tileLeft = centerPoint.x + tileSize['width'] * i - mapViewPoint.x;
                var tileTop = centerPoint.y + tileSize['height'] * j - mapViewPoint.y;
                var tileUrl = this._getTileUrl(tileIndex['x'], tileIndex['y'], zoom);
                var tileId = [tileIndex['y'], tileIndex['x'], zoom, tileLeft, tileTop].join('__');
                var tileDesc = {
                    'url' : tileUrl,
                    'viewPoint': new Z.Point(tileLeft, tileTop),
                    'id'  : tileId,
                    'zoom' : zoom
                };
                tiles.push(tileDesc);
                fullExtent = fullExtent.combine(new Z.PointExtent(
                        tileDesc['viewPoint'],
                        tileDesc['viewPoint'].add(tileSize['width'], tileSize['height'])
                        )
                    );
            }
        }

        //瓦片排序, 地图中心的瓦片排在末尾, 末尾的瓦片先载入
        tiles.sort(function (a, b) {
            return (b['viewPoint'].distanceTo(centerPoint) - a['viewPoint'].distanceTo(centerPoint));
        });
        return {
            'tiles' : tiles,
            'fullExtent' : fullExtent
        };
    },

    _getTileUrl:function (x, y, z) {
        if (!this.options['urlTemplate']) {
            return this.options['errorTileUrl'];
        }
        var urlTemplate = this.options['urlTemplate'];
        if (Z.Util.isFunction(urlTemplate)) {
            return urlTemplate(x, y, z);
        }
        var domain = '';
        if (this.options['subdomains']) {
            var subdomains = this.options['subdomains'];
            if (Z.Util.isArrayHasData(subdomains)) {
                var length = subdomains.length;
                var s = (x + y) % length;
                if (s < 0) {
                    s = 0;
                }
                domain = subdomains[s];
            }
        }
        var data = {
            'x' : x,
            'y' : y,
            'z' : z,
            's' : domain
        };
        return urlTemplate.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            var value = data[key];

            if (value === undefined) {
                throw new Error('No value provided for variable ' + str);

            } else if (typeof value === 'function') {
                value = value(data);
            }
            return value;
        });
    }
});

/**
 * Export the tile layer's profile json. <br>
 * Layer's profile is a snapshot of the layer in JSON format. <br>
 * It can be used to reproduce the instance by [fromJSON]{@link maptalks.Layer#fromJSON} method
 * @return {Object} layer's profile JSON
 */
Z.TileLayer.prototype.toJSON = function () {
    var profile = {
        'type':'TileLayer',
        'id':this.getId(),
        'options' : this.config()
    };
    return profile;
};

/**
 * Reproduce a TileLayer from layer's profile JSON.
 * @param  {Object} layerJSON - layer's profile JSON
 * @return {maptalks.TileLayer}
 * @static
 * @private
 * @function
 */
Z.TileLayer._fromJSON = function (layerJSON) {
    if (!layerJSON || layerJSON['type'] !== 'TileLayer') { return null; }
    return new Z.TileLayer(layerJSON['id'], layerJSON['options']);
};

Z.CanvasTileLayer = Z.TileLayer.extend({
});

/**
 * Export the CanvasTileLayer's profile json. <br>
 * Layer's profile is a snapshot of the layer in JSON format. <br>
 * It can be used to reproduce the instance by [fromJSON]{@link maptalks.Layer#fromJSON} method
 * @return {Object} layer's profile JSON
 */
Z.CanvasTileLayer.prototype.toJSON = function () {
    var profile = {
        'type':'CanvasTileLayer',
        'id':this.getId(),
        'options' : this.config()
    };
    return profile;
};

/**
 * Reproduce a CanvasTileLayer from layer's profile JSON.
 * @param  {Object} layerJSON - layer's profile JSON
 * @return {maptalks.TileLayer}
 * @static
 * @private
 * @function
 */
Z.CanvasTileLayer._fromJSON = function (layerJSON) {
    if (!layerJSON || layerJSON['type'] !== 'CanvasTileLayer') { return null; }
    return new Z.CanvasTileLayer(layerJSON['id'], layerJSON['options']);
};

/**
 * @classdesc
 * Base class of all the layers that can add/remove geometries.
 * @class
 * @category layer
 * @abstract
 * @extends {maptalks.Layer}
 */
Z.OverlayLayer = Z.Layer.extend(/** @lends maptalks.OverlayLayer.prototype */{
    exceptionDefs:{
        'en-US':{
            'DUPLICATE_GEOMETRY_ID':'Duplicate ID for the geometry',
            'INVALID_GEOMETRY':'invalid geometry to add to layer.'
        },
        'zh-CN':{
            'DUPLICATE_GEOMETRY_ID':'重复的Geometry ID',
            'INVALID_GEOMETRY':'不合法的Geometry, 无法被加入图层.'
        }
    },


    /**
     * Get a geometry by its id
     * @param  {String|Number} id   - id of the geometry
     * @return {maptalks.Geometry}
     */
    getGeometryById:function (id) {
        return this._getGeometryById(id);
    },

    /**
     * Get all the geometries on the layer or the ones filtered.
     * @param {Function} filter  - a function to filter the layer
     * @param {Object} context   - context of the filter context
     * @return {maptalks.Geometry[]}
     */
    getGeometries:function (filter, context) {
        return this._getGeometries(filter, context);
    },

    /**
     * Get count of the geometries
     * @return {Number} count
     */
    getCount: function () {
        if (!this._counter) {
            return 0;
        }
        return this._counter;
    },

    /**
     * Travels among the geometries the layer has.
     * @param  {Function} fn - a callback function
     * @param  {*} context   - callback's context
     * @return {maptalks.OverlayLayer} this
     */
    forEach:function (fn, context) {
        var cache = this._geoCache;
        var counter = 0;
        for (var g in cache) {
            if (cache.hasOwnProperty(g)) {
                if (!context) {
                    fn(cache[g], counter++);
                } else {
                    fn.call(context, cache[g], counter++);
                }
            }
        }
        return this;
    },

    /**
     * creates a GeometryCollection with all elements that pass the test implemented by the provided function.
     * @param  {Function} fn      - Function to test each geometry
     * @param  {*} context        - Function's context
     * @return {maptalks.GeometryCollection} A GeometryCollection with all elements that pass the test
     */
    filter: function (fn, context) {
        var selected = [];
        if (Z.Util.isFunction(fn)) {
            if (fn) {
                this.forEach(function (geometry) {
                    if (context ? fn.call(context, geometry) : fn(geometry)) {
                        selected.push(geometry);
                    }
                });
            }
        } else {
            var filter = Z.Util.createFilter(fn);
            this.forEach(function (geometry) {
                var g = Z.Util.getFilterFeature(geometry);
                if (filter(g)) {
                    selected.push(geometry);
                }
            }, this);
        }
        return selected.length > 0 ? new Z.GeometryCollection(selected) : null;
    },

    /**
     * Whether the layer is empty.
     * @return {Boolean}
     */
    isEmpty:function () {
        return this._counter === 0;
    },

    /**
     * Adds one or more geometries to the layer
     * @param {maptalks.Geometry|maptalks.Geometry[]} geometries - one or more geometries
     * @param {Boolean} fitView                                  - automatically set the map to a fit center and zoom for the geometries
     * @return {maptalks.OverlayLayer} this
     */
    addGeometry:function (geometries, fitView) {
        return this._addGeometry(geometries, fitView);
    },

    /**
     * Removes one or more geometries from the layer
     * @param  {String|String[]|maptalks.Geometry|maptalks.Geometry[]} geometries - geometry ids or geometries to remove
     * @returns {maptalks.OverlayLayer} this
     */
    removeGeometry:function (geometries) {
        return this._removeGeometry(geometries);
    },

    /**
     * Clear all geometries in this layer
     * @returns {maptalks.OverlayLayer} this
     */
    clear:function () {
        return this._clear();
    },

    _initCache: function () {
        if (!this._geoCache) {
            this._geoCache = {};
            this._geoMap = {};
            this._counter = 0;
        }
    },

    _getGeometryById:function (id) {
        if (Z.Util.isNil(id) || id === '') {
            return null;
        }
        if (!this._geoMap[id]) {
            return null;
        }
        return this._geoMap[id];
    },

    _getGeometries:function (filter, context) {
        var cache = this._geoCache;
        var result = [],
            geometry;
        for (var p in cache) {
            if (cache.hasOwnProperty(p)) {
                geometry = cache[p];
                if (filter) {
                    var filtered;
                    if (context) {
                        filtered = filter.call(context, geometry);
                    } else {
                        filtered = filter(geometry);
                    }
                    if (!filtered) {
                        continue;
                    }
                }
                result.push(geometry);
            }
        }
        return result;
    },


    _addGeometry:function (geometries, fitView) {
        if (!geometries) { return this; }
        if (!Z.Util.isArray(geometries)) {
            return this._addGeometry([geometries], fitView);
        } else if (!Z.Util.isArrayHasData(geometries)) {
            return this;
        }
        this._initCache();
        var fitCounter = 0;
        var centerSum = new Z.Coordinate(0, 0);
        var extent = null,
            geo, geoId, internalId, geoCenter, geoExtent,
            style = this.getStyle ? this.getStyle() : null;
        for (var i = 0, len = geometries.length; i < len; i++) {
            geo = geometries[i];
            if (!(geo instanceof Z.Geometry)) {
                geo = Z.Geometry.fromJSON(geo);
            }
            if (!geo) {
                throw new Error(this.exceptions['INVALID_GEOMETRY']);
            }
            geoId = geo.getId();
            if (!Z.Util.isNil(geoId)) {
                if (!Z.Util.isNil(this._geoMap[geoId])) {
                    throw new Error(this.exceptions['DUPLICATE_GEOMETRY_ID'] + ':' + geoId);
                }
                this._geoMap[geoId] = geo;
            }
            internalId = Z.Util.GUID();
            //内部全局唯一的id
            geo._setInternalId(internalId);
            this._geoCache[internalId] = geo;
            this._counter++;
            geo._bindLayer(this);
            if (fitView) {
                geoCenter = geo.getCenter();
                geoExtent = geo.getExtent();
                if (geoCenter && geoExtent) {
                    centerSum._add(geoCenter);
                    if (extent == null) {
                        extent = geoExtent;
                    } else {
                        extent = extent._combine(geoExtent);
                    }
                    fitCounter++;
                }
            }
            if (style) {
                this._styleGeometry(geo);
            }
            geo._fireEvent('addend', {'geometry':geo});
        }
        var map = this.getMap();
        if (map) {
            this._getRenderer().render(geometries);
            if (fitView && extent) {
                var z = map.getFitZoom(extent);
                var center = centerSum._multi(1 / fitCounter);
                map.setCenterAndZoom(center, z);
            }
        }
        this.fire('addgeo', {'geometries':geometries});
        return this;
    },

    _removeGeometry:function (geometries) {
        if (!Z.Util.isArray(geometries)) {
            return this._removeGeometry([geometries]);
        }
        for (var i = geometries.length - 1; i >= 0; i--) {
            if (!(geometries[i] instanceof Z.Geometry)) {
                geometries[i] = this.getGeometryById(geometries[i]);
            }
            if (!geometries[i] || this !== geometries[i].getLayer()) continue;
            geometries[i].remove();
        }
        this.fire('removegeo', {'geometries':geometries});
        return this;
    },

    _clear:function () {
        this.forEach(function (geo) {
            geo.remove();
        });
        this._geoMap = {};
        this._geoCache = {};
        this.fire('clear');
        return this;
    },

    /**
     * Called when geometry is being removed to clear the context concerned.
     * @param  {maptalks.Geometry} geometry - the geometry instance to remove
     * @private
     */
    _onGeometryRemove:function (geometry) {
        if (!geometry) { return; }
        //考察geometry是否属于该图层
        if (this !== geometry.getLayer()) {
            return;
        }
        var internalId = geometry._getInternalId();
        if (Z.Util.isNil(internalId)) {
            return;
        }
        var geoId = geometry.getId();
        if (!Z.Util.isNil(geoId)) {
            delete this._geoMap[geoId];
        }
        delete this._geoCache[internalId];
        this._counter--;
        if (this._getRenderer()) {
            this._getRenderer().render();
        }
    }
});

Z.OverlayLayer.addInitHook(function () {
    this._initCache();
});

/**
 * @classdesc
 * A layer for managing and rendering geometries.
 * @class
 * @category layer
 * @extends {maptalks.OverlayLayer}
 * @param {String|Number} id - layer's id
 * @param {Object} [options=null] - construct options
 * @param {Boolean} [options.debug=false] - whether the geometries on the layer is in debug mode.
 * @param {Boolean} [options.enableSimplify=false] - whether to simplify geometries before rendering.
 * @param {String} [options.cursor=default] - the cursor style of the layer
 * @param {Boolean} [options.geometryEvents=true] - enable/disable firing geometry events
 * @param {Number} [options.thresholdOfTransforming=50] - threshold of points number to update points while transforming.
 * @param {*} options.* - any other option defined in [maptalks.Layer]{@link maptalks.Layer#options}
 */
Z.VectorLayer = Z.OverlayLayer.extend(/** @lends maptalks.VectorLayer.prototype */{

    options:{
        'debug'                     : false,
        'enableSimplify'            : true,
        'cursor'                    : 'pointer',
        'geometryEvents'            : true,
        'thresholdOfTransforming'    : 150,
        'drawImmediate'             : false,
        'drawOnce'                  : false,
        'defaultIconSize'           : [20, 20],
        'cacheSvgOnCanvas'          : true
    },

    getStyle: function () {
        if (!this._style) {
            return null;
        }
        return this._style;
    },

    setStyle: function (style) {
        this._style = style;
        this._cookedStyles = this._compileStyle(style);
        this.forEach(function (geometry) {
            this._styleGeometry(geometry);
        }, this);
        return this;
    },

    removeStyle: function () {
        if (!this._style) {
            return this;
        }
        delete this._style;
        delete this._cookedStyles;
        this.forEach(function (geometry) {
            geometry._setExternSymbol(null);
        }, this);
        return this;
    },

    _styleGeometry: function (geometry) {
        var g = Z.Util.getFilterFeature(geometry);
        for (var i = 0, len = this._cookedStyles.length; i < len; i++) {
            if (this._cookedStyles[i]['filter'](g) === true) {
                geometry._setExternSymbol(this._cookedStyles[i]['symbol']);
                return true;
            }
        }
        return false;
    },

    _compileStyle: function (styles) {
        if (!Z.Util.isArray(styles)) {
            return this._compileStyle([styles]);
        }
        var cooked = [];
        for (var i = 0; i < styles.length; i++) {
            cooked.push({
                'filter' : Z.Util.createFilter(styles[i]['filter']),
                'symbol' : styles[i].symbol
            });
        }
        return cooked;
    }
});

/**
 * Export the vector layer's profile json. <br>
 * @param  {Object} [options=null] - export options
 * @param  {Object} [options.geometries=null] - If not null and the layer is a [OverlayerLayer]{@link maptalks.OverlayLayer},
 *                                            the layer's geometries will be exported with the given "options.geometries" as a parameter of geometry's toJSON.
 * @param  {maptalks.Extent} [options.clipExtent=null] - if set, only the geometries intersectes with the extent will be exported.
 * @return {Object} layer's profile JSON
 */
Z.VectorLayer.prototype.toJSON = function (options) {
    if (!options) {
        options = {};
    }
    var profile = {
        'type'    : 'VectorLayer',
        'id'      : this.getId(),
        'options' : this.config()
    };
    if ((Z.Util.isNil(options['style']) || options['style']) && this.getStyle()) {
        profile['style'] = this.getStyle();
    }
    if (Z.Util.isNil(options['geometries']) || options['geometries']) {
        var clipExtent;
        if (options['clipExtent']) {
            clipExtent = new Z.Extent(options['clipExtent']);
        }
        var geoJSONs = [];
        var geometries = this.getGeometries(),
            geoExt,
            json;
        for (var i = 0, len = geometries.length; i < len; i++) {
            geoExt = geometries[i].getExtent();
            if (!geoExt || (clipExtent && !clipExtent.intersects(geoExt))) {
                continue;
            }
            json = geometries[i].toJSON(options['geometries']);
            if (json['symbol'] && this.getStyle()) {
                json['symbol'] = geometries[i]._symbolBeforeStyle ? Z.Util.extend({}, geometries[i]._symbolBeforeStyle) : null;
            }
            geoJSONs.push(json);
        }
        profile['geometries'] = geoJSONs;
    }
    return profile;
};

/**
 * Reproduce a VectorLayer from layer's profile JSON.
 * @param  {Object} layerJSON - layer's profile JSON
 * @return {maptalks.VectorLayer}
 * @static
 * @private
 * @function
 */
Z.VectorLayer._fromJSON = function (profile) {
    if (!profile || profile['type'] !== 'VectorLayer') { return null; }
    var layer = new Z.VectorLayer(profile['id'], profile['options']);
    var geoJSONs = profile['geometries'];
    var geometries = [],
        geo;
    for (var i = 0; i < geoJSONs.length; i++) {
        geo = Z.Geometry.fromJSON(geoJSONs[i]);
        if (geo) {
            geometries.push(geo);
        }
    }
    layer.addGeometry(geometries);
    if (profile['style']) {
        layer.setStyle(profile['style']);
    }
    return layer;
};

/**
 * @classdesc
 * A sub class of maptalks.VectorLayer supports GeoJSON.
 * @class
 * @category layer
 * @extends {maptalks.VectorLayer}
 * @param {String|Number} id - layer's id
 * @param {Object}        json - GeoJSON objects
 * @param {Object} [options=null] - construct options
 * @param {*} options.* - any other option defined in [maptalks.VectorLayer]{@link maptalks.VectorLayer#options}
 */
Z.GeoJSONLayer = Z.VectorLayer.extend(/** @lends maptalks.GeoJSONLayer.prototype */{

    initialize: function (id, json, options) {
        this.setId(id);
        Z.Util.setOptions(this, options);
        var geometries = this._parse(json);
        this.addGeometry(geometries);
    },

    _parse: function (json) {
        json = Z.Util.parseJSON(json);
        return Z.Geometry.fromJSON(json);
    },

    /**
     * Export the GeoJSONLayer's profile json. <br>
     * @param  {Object} [options=null] - export options
     * @param  {Object} [options.geometries=null] - If not null and the layer is a [OverlayerLayer]{@link maptalks.OverlayLayer},
     *                                            the layer's geometries will be exported with the given "options.geometries" as a parameter of geometry's toJSON.
     * @param  {maptalks.Extent} [options.clipExtent=null] - if set, only the geometries intersectes with the extent will be exported.
     * @return {Object} layer's profile JSON
     */
    toJSON: function (options) {
        var profile = Z.VectorLayer.prototype.toJSON.call(this, options);
        profile['type'] = 'GeoJSONLayer';
        var json = [];
        if (profile['geometries']) {
            var g;
            for (var i = 0, len = profile['geometries'].length; i < len; i++) {
                g = profile['geometries'][i]['feature'];
                if (!g['id'] && !g['properties']) {
                    g = g['geometry'];
                }
                json.push(g);
            }
            delete profile['geometries'];
        }
        profile['geojson'] = json;
        return profile;
    }
});

/**
 * Reproduce a GeoJSONLayer from layer's profile JSON.
 * @param  {Object} layerJSON - layer's profile JSON
 * @return {maptalks.GeoJSONLayer}
 * @static
 * @private
 * @function
 */
Z.GeoJSONLayer._fromJSON = function (profile) {
    if (!profile || profile['type'] !== 'GeoJSONLayer') { return null; }
    var layer = new Z.GeoJSONLayer(profile['id'], profile['geojson'], profile['options']);
    if (profile['style']) {
        layer.setStyle(profile['style']);
    }
    return layer;
};

/**
 * @classdesc
 * Base class for all the geometries, it is not intended to be instantiated but extended. <br/>
 * It defines common methods that all the geometry classes share.
 *
 * @class
 * @category geometry
 * @abstract
 * @extends maptalks.Class
 * @mixins maptalks.Eventable
 * @mixins maptalks.Handlerable
 * @mixins maptalks.ui.Menu.Mixin
 */
Z.Geometry = Z.Class.extend(/** @lends maptalks.Geometry.prototype */{
    includes: [Z.Eventable, Z.Handlerable],

    exceptionDefs:{
        'en-US':{
            'DUPLICATE_LAYER':'Geometry cannot be added to two or more layers at the same time.',
            'INVALID_GEOMETRY_IN_COLLECTION':'Geometry is not valid for collection,index:',
            'NOT_ADD_TO_LAYER':'This operation needs geometry to be on a layer.'
        },
        'zh-CN':{
            'DUPLICATE_LAYER':'Geometry不能被重复添加到多个图层上.',
            'INVALID_GEOMETRY_IN_COLLECTION':'添加到集合中的Geometry是不合法的, index:',
            'NOT_ADD_TO_LAYER':'Geometry必须添加到某个图层上才能作此操作.'
        }
    },
    /** @lends maptalks.Geometry */
    statics:{
        /**
         * Type of [Point]{@link http://geojson.org/geojson-spec.html#point}
         * @constant
         */
        'TYPE_POINT' : 'Point',
        /**
         * Type of [LineString]{@link http://geojson.org/geojson-spec.html#linestring}
         * @constant
         */
        'TYPE_LINESTRING' : 'LineString',
        /**
         * Type of [Polygon]{@link http://geojson.org/geojson-spec.html#polygon}
         * @constant
         */
        'TYPE_POLYGON' : 'Polygon',
        /**
         * Type of [MultiPoint]{@link http://geojson.org/geojson-spec.html#multipoint}
         * @constant
         */
        'TYPE_MULTIPOINT' : 'MultiPoint',
        /**
         * Type of [MultiLineString]{@link http://geojson.org/geojson-spec.html#multilinestring}
         * @constant
         */
        'TYPE_MULTILINESTRING' : 'MultiLineString',
        /**
         * Type of [MultiPolygon]{@link http://geojson.org/geojson-spec.html#multipolygon}
         * @constant
         */
        'TYPE_MULTIPOLYGON' : 'MultiPolygon',
        /**
         * Type of [GeometryCollection]{@link http://geojson.org/geojson-spec.html#geometrycollection}
         * @constant
         */
        'TYPE_GEOMETRYCOLLECTION' : 'GeometryCollection'
    },

    /**
     * @property {Object} options                       - geometry options
     * @property {Boolean} [options.id=null]           - id of the geometry
     * @property {Boolean} [options.visible=true]       - whether the geometry is visible.
     * @property {Boolean} [options.editable=true]       - whether the geometry can be edited.
     * @property {String} [options.cursor=null]       - cursor style when mouseover the geometry, same as the definition in CSS.
     * @property {Number} [options.shadowBlue=0]       - level of the shadow around the geometry, see [MDN's explanation]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowBlur}
     * @property {String} [options.shadowColor=black]       - color of the shadow around the geometry, a CSS style color
     * @property {String} [options.measure=EPSG:4326]       - the measure code for the geometry, defines {@tutorial measureGeometry how it can be measured}.
     * @property {Boolean} [options.draggable=false]    - whether the geometry can be dragged.
     * @property {Boolean} [options.dragShadow=false]   - if true, during geometry dragging, a shadow will be dragged before geometry was moved.
     * @property {Boolean} [options.draggableAxis=null] - if set, geometry can only be dragged along the specified axis, possible values: x, y
     */
    options:{
        'id'        : null,
        'visible'   : true,
        'editable'  : true,
        'cursor'    : null,
        'shadowBlur' : 0,
        'shadowColor' : 'black',
        'measure' : 'EPSG:4326' // BAIDU, IDENTITY
    },

    /**
     * Adds the geometry to a layer
     * @param {maptalks.Layer} layer    - layer add to
     * @param {Boolean} fitview         - automatically set the map to a fit center and zoom for the geometry
     * @return {maptalks.Geometry} this
     */
    addTo:function (layer, fitview) {
        layer.addGeometry(this, fitview);
        return this;
    },

    /**
     * Get the layer which this geometry added to.
     * @returns {maptalks.Layer} - layer added to
     */
    getLayer:function () {
        if (!this._layer) { return null; }
        return this._layer;
    },

    /**
     * Get the map which this geometry added to
     * @returns {maptalks.Map} - map added to
     */
    getMap:function () {
        if (!this._layer) { return null; }
        return this._layer.getMap();
    },

    /**
     * Gets geometry's id. Id is set by setId or constructor options.
     * @returns {String|Number} geometry的id
     */
    getId:function () {
        return this._id;
    },

    /**
     * Set geometry's id.
     * @param {String} id - new id
     * @returns {maptalks.Geometry} this
     * @fires maptalks.Geometry#idchange
     */
    setId:function (id) {
        var oldId = this.getId();
        this._id = id;
        //FIXME _idchanged没有被图层监听, layer.getGeometryById会出现bug
        /**
         * idchange event.
         *
         * @event maptalks.Geometry#idchange
         * @type {Object}
         * @property {String} type - idchange
         * @property {maptalks.Geometry} target - the geometry fires the event
         * @property {String|Number} old        - value of the old id
         * @property {String|Number} new        - value of the new id
         */
        this._fireEvent('idchange', {'old':oldId, 'new':id});
        return this;
    },

    /**
     * Get geometry's properties. Defined by GeoJSON as [feature's properties]{@link http://geojson.org/geojson-spec.html#feature-objects}.
     *
     * @returns {Object} properties
     */
    getProperties:function () {
        if (!this.properties) {
            if (this._getParent()) {
                return this._getParent().getProperties();
            }
            return null;
        }
        return this.properties;
    },

    /**
     * Set a new properties to geometry.
     * @param {Object} properties - new properties
     * @returns {maptalks.Geometry} this
     * @fires maptalks.Geometry#propertieschange
     */
    setProperties:function (properties) {
        var old = this.properties;
        this.properties = Z.Util.isObject(properties) ? Z.Util.extend({}, properties) : properties;
        /**
         * propertieschange event, thrown when geometry's properties is changed.
         *
         * @event maptalks.Geometry#propertieschange
         * @type {Object}
         * @property {String} type - propertieschange
         * @property {maptalks.Geometry} target - the geometry fires the event
         * @property {String|Number} old        - value of the old properties
         * @property {String|Number} new        - value of the new properties
         */
        this._fireEvent('propertieschange', {'old':old, 'new':properties});
        return this;
    },

    /**
     * Get type of the geometry, e.g. "Point", "LineString"
     * @returns {String} type of the geometry
     */
    getType:function () {
        return this.type;
    },


    /**
     * Get symbol of the geometry
     * @returns {Object} geometry's symbol
     */
    getSymbol:function () {
        var s = this._symbol;
        if (s) {
            if (!Z.Util.isArray(s)) {
                return Z.Util.extend({}, s);
            } else {
                return Z.Util.extendSymbol(s);
            }
        }
        return null;
    },

    /**
     * Set a new symbol to style the geometry.
     * @param {Object} symbol - new symbol
     * @see {@tutorial symbol Style a geometry with symbols}
     * @return {maptalks.Geometry} this
     * @fires maptalks.Geometry#symbolchange
     */
    setSymbol:function (symbol) {
        this._symbol = this._prepareSymbol(symbol);
        this._onSymbolChanged();
        return this;
    },

    /**
     * Returns the first coordinate of the geometry.
     * @return {maptalks.Coordinate} First Coordinate
     */
    getFirstCoordinate:function () {
        if (this instanceof Z.GeometryCollection) {
            var geometries = this.getGeometries();
            if (!geometries || !Z.Util.isArrayHasData(geometries)) {
                return null;
            }
            return geometries[0].getFirstCoordinate();
        }
        var coordinates = this.getCoordinates();
        if (!Z.Util.isArray(coordinates)) {
            return coordinates;
        }
        var first = coordinates;
        do {
            first = first[0];
        } while (Z.Util.isArray(first));
        return first;
    },

    /**
     * Returns the last coordinate of the geometry.
     * @return {maptalks.Coordinate} Last Coordinate
     */
    getLastCoordinate:function () {
        if (this instanceof Z.GeometryCollection) {
            var geometries = this.getGeometries();
            if (!geometries || !Z.Util.isArrayHasData(geometries)) {
                return null;
            }
            return geometries[geometries.length - 1].getLastCoordinate();
        }
        var coordinates = this.getCoordinates();
        if (!Z.Util.isArray(coordinates)) {
            return coordinates;
        }
        var last = coordinates;
        do {
            last = last[last.length - 1];
        } while (Z.Util.isArray(last));
        return last;
    },

    /**
     * Get the geometry's extent
     * @returns {maptalksExtent} geometry's extent
     */
    getExtent:function () {
        var prjExt = this._getPrjExtent();
        if (prjExt) {
            var p = this._getProjection();
            return new Z.Extent(p.unproject(new Z.Coordinate(prjExt['xmin'], prjExt['ymin'])), p.unproject(new Z.Coordinate(prjExt['xmax'], prjExt['ymax'])));
        } else {
            return this._computeExtent(this._getMeasurer());
        }

    },

    /**
     * Whehter the geometry contains the input container point.
     * @param  {maptalks.Point} point - input container point
     * @param  {Number} t - tolerance in pixel
     * @return {Boolean}
     */
    containsPoint: function (containerPoint, t) {
        if (!this.getMap()) {
            throw new Error('The geometry is required to be on a map to perform "containsPoint".');
        }
        return this._containsPoint(this.getMap().containerPointToViewPoint(containerPoint), t);
    },

    /**
     * Get size in pixel of the geometry, size may vary in different zoom levels.
     * @returns {maptalks.Size}
     */
    getSize: function () {
        var map = this.getMap();
        if (!map) {
            return null;
        }
        var pxExtent = this._getPainter().getViewExtent();
        return new Z.Size(Math.round(Math.abs(pxExtent['xmax'] - pxExtent['xmin'])),
            Math.round(Math.abs(pxExtent['ymax'] - pxExtent['ymin'])));
    },

    /**
     * Get the geographical center of the geometry.
     * @returns {maptalks.Coordinate}
     */
    getCenter:function () {
        return this._computeCenter(this._getMeasurer()).copy();
    },

    /**
     * Show the geometry.
     * @return {maptalks.Geometry} this
     * @fires maptalks.Geometry#show
     */
    show:function () {
        this.options['visible'] = true;
        if (this.getMap()) {
            var painter = this._getPainter();
            if (painter) {
                painter.show();
            }
            /**
             * show event
             *
             * @event maptalks.Geometry#show
             * @type {Object}
             * @property {String} type - show
             * @property {maptalks.Geometry} target - the geometry fires the event
             */
            this._fireEvent('show');
        }
        return this;
    },

    /**
     * Hide the geometry
     * @return {maptalks.Geometry} this
     * @fires maptalks.Geometry#hide
     */
    hide:function () {
        this.options['visible'] = false;
        if (this.getMap()) {
            var painter = this._getPainter();
            if (painter) {
                painter.hide();
            }
            /**
             * hide event
             *
             * @event maptalks.Geometry#hide
             * @type {Object}
             * @property {String} type - hide
             * @property {maptalks.Geometry} target - the geometry fires the event
             */
            this._fireEvent('hide');
        }
        return this;
    },

    /**
     * Whether the geometry is visible
     * @returns {Boolean}
     */
    isVisible:function () {
        if (!this.options['visible']) {
            return false;
        }
        var symbol = this._getInternalSymbol();
        if (!symbol) {
            return true;
        }
        if (Z.Util.isArray(symbol)) {
            if (symbol.length === 0) {
                return true;
            }
            for (var i = 0, len = symbol.length; i < len; i++) {
                if (Z.Util.isNil(symbol[i]['opacity']) || symbol[i]['opacity'] > 0) {
                    return true;
                }
            }
            return false;
        } else {
            return (Z.Util.isNil(symbol['opacity']) || (Z.Util.isNumber(symbol['opacity']) && symbol['opacity'] > 0));
        }
    },

    /**
     * Translate or move the geometry by the given offset.
     * @param  {maptalks.Coordinate} offset - translate offset
     * @return {maptalks.Geometry} this
     */
    translate:function (offset) {
        if (!offset) {
            return this;
        }
        offset = new Z.Coordinate(offset);
        if (offset.x === 0 && offset.y === 0) {
            return this;
        }
        var coordinates = this.getCoordinates();
        if (coordinates) {
            if (Z.Util.isArray(coordinates)) {
                var translated = Z.Util.mapArrayRecursively(coordinates, function (coord) {
                    return coord.add(offset);
                });
                this.setCoordinates(translated);
            } else {
                this.setCoordinates(coordinates.add(offset));
            }
        }
        return this;
    },

    /**
     * flash the geometry, show and hide by certain internal for times of count.
     *
     * @param {Number} [interval=100]     - interval of flash, in millisecond (ms)
     * @param {Number} [count=4]          - flash times
     * @param {Function} [cb=null]        - callback function when flash ended
     * @param {*} [context=null]          - callback context
     * @return {maptalks.Geometry} this
     */
    flash: function (interval, count, cb, context) {
        if (!interval) {
            interval = 100;
        }
        if (!count) {
            count = 4;
        }
        var me = this;
        count *= 2;
        if (this._flashTimeout) {
            clearTimeout(this._flashTimeout);
        }
        function flashGeo() {
            if (count === 0) {
                me.show();
                if (cb) {
                    if (context) {
                        cb.call(context);
                    } else {
                        cb();
                    }
                }
                return;
            }

            if (count % 2 === 0) {
                me.hide();
            } else {
                me.show();
            }
            count--;
            me._flashTimeout = setTimeout(flashGeo, interval);
        }
        this._flashTimeout = setTimeout(flashGeo, interval);
        return this;
    },

    /**
     * Returns a copy of the geometry without the event listeners.
     * @returns {maptalks.Geometry} copy
     */
    copy:function () {
        var json = this.toJSON();
        //FIXME symbol信息没有被拷贝过来
        var ret = Z.Geometry.fromJSON(json);
        //restore visibility
        ret.options['visible'] = true;
        return ret;
    },


    /**
     * remove itself from the layer if any.
     * @returns {maptalks.Geometry} this
     * @fires maptalks.Geometry#removestart
     * @fires maptalks.Geometry#remove
     */
    remove:function () {
        var layer = this.getLayer();
        if (!layer) {
            return this;
        }
        /**
         * removestart event.
         *
         * @event maptalks.Geometry#removestart
         * @type {Object}
         * @property {String} type - removestart
         * @property {maptalks.Geometry} target - the geometry fires the event
         */
        this._fireEvent('removestart');

        this._unbind();
        /**
         * remove event.
         *
         * @event maptalks.Geometry#remove
         * @type {Object}
         * @property {String} type - remove
         * @property {maptalks.Geometry} target - the geometry fires the event
         */
        this._fireEvent('remove');
        return this;
    },

    /**
     * Exports a GeoJSON [geometry]{@link http://geojson.org/geojson-spec.html#feature-objects} (part of a feature) out of the geometry.
     * @return {Object} GeoJSON Geometry
     */
    toGeoJSONGeometry:function () {
        var gJson = this._exportGeoJSONGeometry();
        return gJson;
    },

    /**
     * Exports a GeoJSON feature out of the geometry.
     * @param {Object} [opts=null]              - export options
     * @param {Boolean} [opts.geometry=true]    - whether export geometry
     * @param {Boolean} [opts.properties=true]  - whether export properties
     * @returns {Object} GeoJSON Feature
     */
    toGeoJSON:function (opts) {
        if (!opts) {
            opts = {};
        }
        var feature = {
            'type':'Feature',
            'geometry':null
        };
        if (Z.Util.isNil(opts['geometry']) || opts['geometry']) {
            var geoJSON = this._exportGeoJSONGeometry();
            feature['geometry'] = geoJSON;
        }
        var id = this.getId();
        if (!Z.Util.isNil(id)) {
            feature['id'] = id;
        }
        var properties;
        if (Z.Util.isNil(opts['properties']) || opts['properties']) {
            properties = this._exportProperties();
        }
        feature['properties'] = properties;
        return feature;
    },

    /**
     * Export a profile json out of the geometry. <br>
     * Besides exporting the feature object, a profile json also contains symbol, construct options and infowindow info.<br>
     * The profile json can be stored somewhere else and be used to reproduce the geometry later.<br>
     * Due to the problem of serialization for functions, event listeners and contextmenu are not included in profile json.
     * @example
     *     // an example of a profile json.
     * var profile = {
            "feature": {
                  "type": "Feature",
                  "id" : "point1",
                  "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
                  "properties": {"prop0": "value0"}
            },
            //construct options.
            "options":{
                "draggable" : true
            },
            //symbol
            "symbol":{
                "markerFile"  : "http://foo.com/icon.png",
                "markerWidth" : 20,
                "markerHeight": 20
            },
            //infowindow info
            "infowindow" : {
                "options" : {
                    "style" : "black"
                },
                "title" : "this is a infowindow title",
                "content" : "this is a infowindow content"
            }
        };
     * @param {Object}  [options=null]          - export options
     * @param {Boolean} [opts.geometry=true]    - whether export feature's geometry
     * @param {Boolean} [opts.properties=true]  - whether export feature's properties
     * @param {Boolean} [opts.options=true]     - whether export construct options
     * @param {Boolean} [opts.symbol=true]      - whether export symbol
     * @param {Boolean} [opts.infoWindow=true]  - whether export infowindow
     * @return {Object} profile json object
     */
    toJSON:function (options) {
        //一个Graphic的profile
        /*
            //因为响应函数无法被序列化, 所以menu, 事件listener等无法被包含在graphic中
        }*/
        if (!options) {
            options = {};
        }
        var json = this._toJSON(options);
        var other = this._exportGraphicOptions(options);
        Z.Util.extend(json, other);
        return json;
    },

    /**
     * Get the geographic length of the geometry.
     * @returns {Number} geographic length
     */
    getLength:function () {
        return this._computeGeodesicLength(this._getMeasurer());
    },

    /**
     * Get the geographic area of the geometry.
     * @returns {Number} geographic area
     * @expose
     */
    getArea:function () {
        return this._computeGeodesicArea(this._getMeasurer());
    },

    /**
     * Get the connect points for [ConnectorLine]{@link maptalks.ConnectorLine}
     * @return {maptalks.Coordinate[]} connect points
     * @private
     */
    _getConnectPoints: function () {
        return [this.getCenter()];
    },

    //options initializing
    _initOptions:function (opts) {
        if (!opts) {
            opts = {};
        }
        var symbol = opts['symbol'];
        var properties = opts['properties'];
        var id = opts['id'];
        Z.Util.setOptions(this, opts);
        delete this.options['symbol'];
        delete this.options['id'];
        delete this.options['properties'];
        if (symbol) {
            this.setSymbol(symbol);
        }
        if (properties) {
            this.setProperties(properties);
        }
        if (!Z.Util.isNil(id)) {
            this.setId(id);
        }
    },

    //调用prepare时,layer已经注册到map上
    _bindLayer:function (layer) {
         //Geometry不允许被重复添加到多个图层上
        if (this.getLayer()) {
            throw new Error(this.exceptions['DUPLICATE_LAYER']);
        }
        this._layer = layer;
        //如果投影发生改变,则清除掉所有的投影坐标属性
        this._clearProjection();
        this.callInitHooks();
    },

    _prepareSymbol:function (symbol) {
        if (Z.Util.isArray(symbol)) {
            var cookedSymbols = [];
            for (var i = 0; i < symbol.length; i++) {
                cookedSymbols.push(Z.Util.convertResourceUrl(symbol[i]));
            }
            return cookedSymbols;
        } else {
            return Z.Util.convertResourceUrl(symbol);
        }
    },

    /**
     * Sets a external symbol to the geometry, e.g. style from VectorLayer's setStyle
     * @private
     * @param {Object} symbol - external symbol
     */
    _setExternSymbol: function (symbol) {
        this._externSymbol = this._prepareSymbol(symbol);
        this._onSymbolChanged();
        return this;
    },

    _getInternalSymbol:function () {
        if (this._symbol) {
            return this._symbol;
        } else if (this._externSymbol) {
            return this._externSymbol;
        } else if (this.options['symbol']) {
            return this.options['symbol'];
        }
        return null;
    },


    _getPrjExtent:function () {
        var p = this._getProjection();
        if (!this._extent && p) {
            var ext = this._computeExtent(p);
            if (ext) {
                var isAntiMeridian = this.options['antiMeridian'];
                if (isAntiMeridian && isAntiMeridian !== 'default') {
                    var firstCoordinate = this.getFirstCoordinate();
                    if (isAntiMeridian === 'continuous') {
                        if (ext['xmax'] - ext['xmin'] > 180) {
                            if (firstCoordinate.x > 0) {
                                ext['xmin'] += 360;
                            } else {
                                ext['xmax'] -= 360;
                            }
                        }
                    }
                    if (ext['xmax'] < ext['xmin']) {
                        var tmp = ext['xmax'];
                        ext['xmax'] = ext['xmin'];
                        ext['xmin'] = tmp;
                    }
                }
                this._extent = new Z.Extent(p.project(new Z.Coordinate(ext['xmin'], ext['ymin'])),
                    p.project(new Z.Coordinate(ext['xmax'], ext['ymax'])));
            }

        }
        return this._extent;
    },

    _unbind:function () {
        var layer = this.getLayer();
        if (!layer) {
            return;
        }
        //contextmenu
        this._unbindMenu();
        //infowindow
        this._unbindInfoWindow();
        if (this.isEditing()) {
            this.endEdit();
        }
        this._removePainter();
        if (this._onRemove) {
            this._onRemove();
        }
        layer._onGeometryRemove(this);
        delete this._layer;
        delete this._internalId;
        delete this._extent;
    },

    _getInternalId:function () {
        return this._internalId;
    },

    //只能被图层调用
    _setInternalId:function (id) {
        this._internalId = id;
    },

    _getMeasurer:function () {
        if (this._getProjection()) {
            return this._getProjection();
        }
        return Z.MeasurerUtil.getInstance(this.options['measure']);
    },

    _getProjection:function () {
        var map = this.getMap();
        if (map && map.getProjection()) {
            return map.getProjection();
        }
        return null;
    },

    //获取geometry样式中依赖的外部图片资源
    _getExternalResources:function () {
        var geometry = this;
        var symbol = geometry._getInternalSymbol();
        var resources = Z.Util.getExternalResources(this._interpolateSymbol(symbol));
        return resources;
    },

    _interpolateSymbol: function (symbol) {
        var result;
        if (Z.Util.isArray(symbol)) {
            result = [];
            for (var i = 0; i < symbol.length; i++) {
                result.push(this._interpolateSymbol(symbol[i]));
            }
            return result;
        }
        result = {};
        for (var p in symbol) {
            if (symbol.hasOwnProperty(p)) {
                if (Z.Util.isFunctionDefinition(symbol[p])) {
                    if (!this.getMap()) {
                        result[p] = null;
                    } else {
                        result[p] = Z.Util.interpolated(symbol[p])(this.getMap().getZoom(), this.getProperties());
                    }
                } else {
                    result[p] = symbol[p];
                }
            }
        }
        return result;
    },

    _getPainter:function () {
        if (this.getMap() && !this._painter) {
            if (this instanceof Z.GeometryCollection) {
                this._painter = new Z.CollectionPainter(this);
            } else {
                this._painter = new Z.Painter(this);
            }
        }
        return this._painter;
    },

    _removePainter:function () {
        if (this._painter) {
            this._painter.remove();
        }
        delete this._painter;
    },

    _onZoomEnd:function () {
        if (this._painter) {
            this._painter.onZoomEnd();
        }
    },

    _isEditingOrDragging:function () {
        return ((this.isEditing && this.isEditing()) || (this.isDragging && this.isDragging()));
    },

    _onShapeChanged:function () {
        this._extent = null;
        var painter = this._getPainter();
        if (painter) {
            painter.repaint();
        }
        /**
         * shapechange event.
         *
         * @event maptalks.Geometry#shapechange
         * @type {Object}
         * @property {String} type - shapechange
         * @property {maptalks.Geometry} target - the geometry fires the event
         */
        this._fireEvent('shapechange');
    },

    _onPositionChanged:function () {
        this._extent = null;
        var painter = this._getPainter();
        if (painter) {
            painter.repaint();
        }
        /**
         * positionchange event.
         *
         * @event maptalks.Geometry#positionchange
         * @type {Object}
         * @property {String} type - positionchange
         * @property {maptalks.Geometry} target - the geometry fires the event
         */
        this._fireEvent('positionchange');
    },

    _onSymbolChanged:function () {
        var painter = this._getPainter();
        if (painter) {
            painter.refreshSymbol();
        }
        /**
         * symbolchange event.
         *
         * @event maptalks.Geometry#symbolchange
         * @type {Object}
         * @property {String} type - symbolchange
         * @property {maptalks.Geometry} target - the geometry fires the event
         */
        this._fireEvent('symbolchange');
    },
    /**
     * Set a parent to the geometry, which is usually a MultiPolygon, GeometryCollection, etc
     * @param {maptalks.GeometryCollection} geometry - parent geometry
     * @private
     */
    _setParent:function (geometry) {
        if (geometry) {
            this._parent = geometry;
        }
    },

    _getParent:function () {
        return this._parent;
    },

    _fireEvent:function (eventName, param) {
        this.fire(eventName, param);
    },

    _toJSON: function (options) {
        return {
            'feature' : this.toGeoJSON(options)
        };
    },

    _exportGraphicOptions:function (options) {
        var json = {};
        if (Z.Util.isNil(options['options']) || options['options']) {
            json['options'] = this.config();
        }
        if (Z.Util.isNil(options['symbol']) || options['symbol']) {
            json['symbol'] = this.getSymbol();
        }
        if (Z.Util.isNil(options['infoWindow']) || options['infoWindow']) {
            if (this._infoWinOptions) {
                json['infoWindow'] = this._infoWinOptions;
            }
        }
        return json;
    },

    _exportGeoJSONGeometry:function () {
        var points = this.getCoordinates();
        var coordinates = Z.GeoJSON.toNumberArrays(points);
        return {
            'type'        : this.getType(),
            'coordinates' : coordinates
        };
    },

    _exportProperties: function () {
        var properties = null;
        var geoProperties = this.getProperties();
        if (geoProperties) {
            if (Z.Util.isObject(geoProperties)) {
                properties = Z.Util.extend({}, geoProperties);
            } else {
                geoProperties = properties;
            }
        }
        return properties;
    }

});

/**
 * Produce a geometry from one or more [profile json]{@link maptalks.Geometry#toJSON} or GeoJSON.
 * @static
 * @param  {Object} json - a geometry's profile json or a geojson
 * @return {maptalks.Geometry} geometry
 * @example
 * var profile = {
        "feature": {
              "type": "Feature",
              "id" : "point1",
              "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
              "properties": {"prop0": "value0"}
        },
        //construct options.
        "options":{
            "draggable" : true
        },
        //symbol
        "symbol":{
            "markerFile"  : "http://foo.com/icon.png",
            "markerWidth" : 20,
            "markerHeight": 20
        }
    };
    var marker = maptalks.Geometry.fromJSON(profile);
 */
Z.Geometry.fromJSON = function (json) {
    if (Z.Util.isArray(json)) {
        var result = [], c;
        for (var i = 0, len = json.length; i < len; i++) {
            c = Z.Geometry.fromJSON(json[i]);
            if (Z.Util.isArray(json)) {
                result = result.concat(c);
            } else {
                result.push(c);
            }
        }
        return result;
    }

    if (json && !json['feature']) {
        return Z.GeoJSON.toGeometry(json);
    }
    var geometry;
    if (json['subType']) {
        geometry = Z[json['subType']]._fromJSON(json);
        if (!Z.Util.isNil(json['feature']['id'])) {
            geometry.setId(json['feature']['id']);
        }
    } else {
        var feature = json['feature'];
        geometry = Z.GeoJSON.toGeometry(feature);
        if (json['options']) {
            geometry.config(json['options']);
        }
    }
    if (json['symbol']) {
        geometry.setSymbol(json['symbol']);
    }
    if (json['infoWindow']) {
        geometry.setInfoWindow(json['infoWindow']);
    }
    return geometry;
};


Z.Geometry._getMarkerPathURL = function (symbol) {
    if (!symbol['markerPath']) {
        return null;
    }
    var op, styles =  Z.symbolizer.VectorMarkerSymbolizer.translateToSVGStyles(symbol);
    //context.globalAlpha doesn't take effect with drawing SVG in IE9/10/11 and EGDE, so set opacity in SVG element.
    if (Z.Util.isNumber(symbol['markerOpacity'])) {
        op = symbol['markerOpacity'];
    }
    if (Z.Util.isNumber(symbol['opacity'])) {
        op *= symbol['opacity'];
    }
    var p, svgStyles = {};
    if (styles) {
        for (p in styles['stroke']) {
            if (styles['stroke'].hasOwnProperty(p)) {
                if (!Z.Util.isNil(styles['stroke'][p])) {
                    svgStyles[p] = styles['stroke'][p];
                }
            }
        }
        for (p in styles['fill']) {
            if (styles['fill'].hasOwnProperty(p)) {
                if (!Z.Util.isNil(styles['fill'][p])) {
                    svgStyles[p] = styles['fill'][p];
                }
            }
        }
    }

    var pathes = Z.Util.isArray(symbol['markerPath']) ? symbol['markerPath'] : [symbol['markerPath']];
    var i, path, pathesToRender = [];
    for (i = 0; i < pathes.length; i++) {
        path = Z.Util.isString(pathes[i]) ? {'path' : pathes[i]} : pathes[i];
        path = Z.Util.extend({}, path, svgStyles);
        path['d'] = path['path'];
        delete path['path'];
        pathesToRender.push(path);
    }
    var svg = ['<svg version="1.1"', 'xmlns="http://www.w3.org/2000/svg"'];
    if (op < 1) {
        svg.push('opacity="' + op + '"');
    }
    if (symbol['markerWidth'] && symbol['markerHeight']) {
        svg.push('height="' + symbol['markerHeight'] + '" width="' + symbol['markerWidth'] + '"');
    }
    if (symbol['markerPathWidth'] && symbol['markerPathHeight']) {
        svg.push('viewBox="0 0 ' + symbol['markerPathWidth'] + ' ' + symbol['markerPathHeight'] + '"');
    }
    svg.push('preserveAspectRatio="none"');
    svg.push('><defs></defs>');

    for (i = 0; i < pathesToRender.length; i++) {
        var strPath = '<path ';
        for (p in pathesToRender[i]) {
            if (pathesToRender[i].hasOwnProperty(p)) {
                strPath += ' ' + p + '="' + pathesToRender[i][p] + '"';
            }
        }
        strPath += '></path>';
        svg.push(strPath);
    }
    svg.push('</svg>');
    var b64 = 'data:image/svg+xml;base64,' + Z.Util.btoa(svg.join(' '));
    return b64;
};

Z.Geometry.include(/** @lends maptalks.Geometry.prototype */{
    /**
     * Start to edit
     * @param {Object} [options=null]        - edit options
     * @param {Object} [options.symbol=null] - symbol for the geometry during editing
     * @return {maptalks.Geometry} this
     */
    startEdit: function (opts) {
        if (!this.getMap() || !this.options['editable']) {
            return this;
        }
        this.endEdit();
        this._editor = new Z.GeometryEditor(this, opts);
        this._editor.start();
        this.fire('editstart');
        return this;
    },

    /**
     * End editing.
     * @return {maptalks.Geometry} this
     */
    endEdit: function () {
        if (this._editor) {
            this._editor.stop();
            delete this._editor;
            this.fire('editend');
        }
        return this;
    },

    /**
     * Whether the geometry collection is being edited.
     * @return {Boolean}
     */
    isEditing: function () {
        if (this._editor) {
            return this._editor.isEditing();
        }
        return false;
    }

});

Z.Geometry.mergeOptions({

    'draggable': false,

    'dragShadow' : true,

    'draggableAxis' : null
});

/**
 * Drag handler for geometries.
 * @class
 * @category handler
 * @protected
 * @extends {maptalks.Handler}
 */
Z.Geometry.Drag = Z.Handler.extend(/** @lends maptalks.Geometry.Drag.prototype */{
    dragStageLayerId : Z.internalLayerPrefix + '_drag_stage',

    START: Z.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],

    addHooks: function () {
        this.target.on(this.START.join(' '), this._startDrag, this);

    },
    removeHooks: function () {
        this.target.off(this.START.join(' '), this._startDrag, this);

    },

    _startDrag: function (param) {
        var map = this.target.getMap();
        if (!map) {
            return;
        }
        var parent = this.target._getParent();
        if (parent) {
            return;
        }
        if (this.isDragging()) {
            return;
        }
        var domEvent = param['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }
        this.target.on('click', this._endDrag, this);
        this._lastPos = param['coordinate'];
        this._prepareMap();
        this._prepareDragHandler();
        this._dragHandler.onMouseDown(param['domEvent']);
        this._moved = false;
        /**
         * drag start event
         * @event maptalks.Geometry#dragstart
         * @type {Object}
         * @property {String} type                    - dragstart
         * @property {String} target                  - the geometry fires event
         * @property {maptalks.Coordinate} coordinate - coordinate of the event
         * @property {maptalks.Point} containerPoint  - container point of the event
         * @property {maptalks.Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this.target._fireEvent('dragstart', param);
    },

    _prepareMap:function () {
        var map = this.target.getMap();
        this._mapDraggable = map.options['draggable'];
        this._mapHitDetect = map.options['hitDetect'];
        map._trySetCursor('move');
        map.config({
            'hitDetect' : false,
            'draggable' : false
        });
    },

    _prepareDragHandler:function () {
        var map = this.target.getMap();
        this._dragHandler = new Z.Handler.Drag(map._panels.mapWrapper || map._containerDOM);
        this._dragHandler.on('dragging', this._dragging, this);
        this._dragHandler.on('mouseup', this._endDrag, this);
        this._dragHandler.enable();
    },

    _prepareShadow:function () {
        var target = this.target;
        this._prepareDragStageLayer();
        if (this._shadow) {
            this._shadow.remove();
        }

        this._shadow = target.copy();
        var shadow = this._shadow;
        if (target.options['dragShadow']) {
            var symbol = Z.Util.decreaseSymbolOpacity(shadow._getInternalSymbol(), 0.5);
            shadow.setSymbol(symbol);
        }
        shadow.setId(null);
        //copy connectors
        var shadowConnectors = [];
        if (Z.ConnectorLine._hasConnectors(target)) {
            var connectors = Z.ConnectorLine._getConnectors(target);

            for (var i = 0; i < connectors.length; i++) {
                var targetConn = connectors[i];
                var connOptions = targetConn.config(),
                    connSymbol = targetConn._getInternalSymbol();
                connOptions['symbol'] = connSymbol;
                var conn;
                if (targetConn.getConnectSource() === target) {
                    conn = new maptalks.ConnectorLine(shadow, targetConn.getConnectTarget(), connOptions);
                } else {
                    conn = new maptalks.ConnectorLine(targetConn.getConnectSource(), shadow, connOptions);
                }
                shadowConnectors.push(conn);
            }
        }
        this._shadowConnectors = shadowConnectors;
        this._dragStageLayer.bringToFront().addGeometry(shadowConnectors.concat(shadow));
    },

    _onTargetUpdated:function () {
        if (this._shadow) {
            this._shadow.setSymbol(this.target.getSymbol());
        }
    },

    _prepareDragStageLayer:function () {
        var map = this.target.getMap(),
            layer = this.target.getLayer();
        this._dragStageLayer = map.getLayer(this.dragStageLayerId);
        if (!this._dragStageLayer) {
            this._dragStageLayer = new Z.VectorLayer(this.dragStageLayerId, {'drawImmediate' : true});
            map.addLayer(this._dragStageLayer);
        }
        //copy resources to avoid repeat resource loading.
        this._dragStageLayer._getRenderer()._resources = layer._getRenderer()._resources;
    },

    _dragging: function (param) {
        var target = this.target;
        var map = target.getMap(),
            eventParam = map._parseEvent(param['domEvent']);

        var domEvent = eventParam['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }

        if (!this._moved) {
            this._moved = true;
            target.on('symbolchange', this._onTargetUpdated, this);
            // this._prepareMap();
            this._isDragging = true;
            this._prepareShadow();
            if (!target.options['dragShadow']) {
                target.hide();
            }
            this._shadow._fireEvent('dragstart', eventParam);
            return;
        }
        if (!this._shadow) {
            return;
        }
        var axis = this._shadow.options['draggableAxis'];
        var currentPos = eventParam['coordinate'];
        if (!this._lastPos) {
            this._lastPos = currentPos;
        }
        var dragOffset = currentPos.substract(this._lastPos);
        if (axis === 'x') {
            dragOffset.y = 0;
        } else if (axis === 'y') {
            dragOffset.x = 0;
        }
        this._lastPos = currentPos;
        this._shadow.translate(dragOffset);
        if (!target.options['dragShadow']) {
            target.translate(dragOffset);
        }
        eventParam['dragOffset'] = dragOffset;
        this._shadow._fireEvent('dragging', eventParam);

        /**
         * dragging event
         * @event maptalks.Geometry#dragging
         * @type {Object}
         * @property {String} type                    - dragging
         * @property {String} target                  - the geometry fires event
         * @property {maptalks.Coordinate} coordinate - coordinate of the event
         * @property {maptalks.Point} containerPoint  - container point of the event
         * @property {maptalks.Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        target._fireEvent('dragging', eventParam);

    },

    _endDrag: function (param) {
        var target = this.target,
            map = target.getMap();
        if (this._dragHandler) {
            target.off('click', this._endDrag, this);
            this._dragHandler.disable();
            delete this._dragHandler;
        }
        if (!map) {
            return;
        }
        var eventParam;
        if (map) {
            eventParam = map._parseEvent(param['domEvent']);
        }
        target.off('symbolchange', this._onTargetUpdated, this);

        if (!target.options['dragShadow']) {
            target.show();
        }
        var shadow = this._shadow;
        if (shadow) {
            if (target.options['dragShadow']) {
                target.setCoordinates(shadow.getCoordinates());
            }
            shadow._fireEvent('dragend', eventParam);
            shadow.remove();
            delete this._shadow;
        }
        if (this._shadowConnectors) {
            map.getLayer(this.dragStageLayerId).removeGeometry(this._shadowConnectors);
            delete this._shadowConnectors;
        }
        delete this._lastPos;

        //restore map status
        map._trySetCursor('default');
        if (Z.Util.isNil(this._mapDraggable)) {
            this._mapDraggable = true;
        }
        map.config({
            'hitDetect': this._mapHitDetect,
            'draggable': this._mapDraggable
        });

        delete this._autoBorderPanning;
        delete this._mapDraggable;
        this._isDragging = false;
        /**
         * dragend event
         * @event maptalks.Geometry#dragend
         * @type {Object}
         * @property {String} type                    - dragend
         * @property {String} target                  - the geometry fires event
         * @property {maptalks.Coordinate} coordinate - coordinate of the event
         * @property {maptalks.Point} containerPoint  - container point of the event
         * @property {maptalks.Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        target._fireEvent('dragend', eventParam);

    },

    isDragging:function () {
        if (!this._isDragging) {
            return false;
        }
        return true;
    }


});

Z.Geometry.addInitHook('addHandler', 'draggable', Z.Geometry.Drag);

Z.Geometry.include(/** @lends maptalks.Geometry.prototype */{
    /**
     * Whether the geometry is being dragged.
     * @reutrn {Boolean}
     */
    isDragging: function () {
        if (this._getParent()) {
            return this._getParent().isDragging();
        }
        if (this['draggable']) {
            return this['draggable'].isDragging();
        }
        return false;
    }
});

Z.Geometry.include(/** @lends maptalks.Geometry.prototype */{
    /**
     * The event handler for all the events.
     * @param  {Event} event - dom event
     * @private
     */
    _onEvent: function (event) {
        if (!this.getMap()) {
            return;
        }
        var eventType = this._getEventTypeToFire(event);
        if (eventType === 'contextmenu' && this.listens('contextmenu')) {
            Z.DomUtil.stopPropagation(event);
            Z.DomUtil.preventDefault(event);
        }
        var params = this._getEventParams(event);
        this._fireEvent(eventType, params);
    },

    _getEventTypeToFire:function (originalEvent) {
        var eventType = originalEvent.type;
        //change event type to contextmenu
        if (eventType === 'click' || eventType === 'mousedown') {
            if (originalEvent.button === 2) {
                eventType = 'contextmenu';
            }
        }
        return eventType;
    },

    /**
     * Generate event parameters
     * @param  {Event} event - dom event
     * @return {Object}
     * @private
     */
    _getEventParams: function (e) {
        var map = this.getMap();
        var eventParam = {
            'domEvent':e
        };
        var actual = e.touches ? e.touches[0] : e;
        if (actual) {
            var containerPoint = Z.DomUtil.getEventContainerPoint(actual, map._containerDOM);
            eventParam['coordinate'] = map.containerPointToCoordinate(containerPoint);
            eventParam['containerPoint'] = containerPoint;
            eventParam['viewPoint'] = map.containerPointToViewPoint(containerPoint);
        }
        return eventParam;
    },

    /**
     * mouse over event handler
     * @param  {Event} event - mouseover dom event
     * @private
     */
    _onMouseOver: function (event) {
        if (!this.getMap()) {
            return;
        }
        var originalEvent = event;
        var params = this._getEventParams(originalEvent);
        /**
         * mouseover event for geometry
         * @event maptalks.Geometry#mouseover
         * @type {Object}
         * @property {String} type                    - mouseover
         * @property {String} target                  - the geometry fires mouseover
         * @property {maptalks.Coordinate} coordinate - coordinate of the event
         * @property {maptalks.Point} containerPoint  - container point of the event
         * @property {maptalks.Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this._fireEvent('mouseover', params);
    },

    /**
     * mouse out event handler
     * @param  {Event} event - mouseout dom event
     * @private
     */
    _onMouseOut: function (event) {
        if (!this.getMap()) {
            return;
        }
        var originalEvent = event;
        var params = this._getEventParams(originalEvent);
        /**
         * mouseout event for geometry
         * @event maptalks.Geometry#mouseout
         * @type {Object}
         * @property {String} type                    - mouseout
         * @property {String} target                  - the geometry fires mouseout
         * @property {maptalks.Coordinate} coordinate - coordinate of the event
         * @property {maptalks.Point} containerPoint  - container point of the event
         * @property {maptalks.Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this._fireEvent('mouseout', params);
    }
});

Z.Geometry.include(/** @lends maptalks.Geometry.prototype */{
    /**
     * Animate the geometry according to the given options.
     * @param  {Object}   styles   - styles to animate
     * @param  {Object}   options  - animation options
     * @param  {Function} callback - step function when animating
     * @return {maptalks.animation.Player} animation player
     */
    animate:function (styles, options, callback) {
        if (Z.Util.isFunction(options)) {
            callback = options;
            options = null;
        }
        var map = this.getMap(),
            projection = this._getProjection(),
            symbol = this._getInternalSymbol(),
            stylesToAnimate = this._prepareAnimationStyles(styles),
            preTranslate, isFocusing;

        if (options) { isFocusing = options['focus']; }
        delete this._animationStarted;

        var player = Z.Animation.animate(stylesToAnimate, options, Z.Util.bind(function (frame) {
            if (!this._animationStarted && isFocusing) {
                map._onMoveStart();
            }
            var styles = frame.styles;
            for (var p in styles) {
                if (p !== 'symbol' && p !== 'translate' && styles.hasOwnProperty(p)) {
                    var fnName = 'set' + p[0].toUpperCase() + p.substring(1);
                    this[fnName](styles[p]);
                }
            }
            var translate = styles['translate'];
            if (translate) {
                var toTranslate = translate;
                if (preTranslate) {
                    toTranslate = translate.substract(preTranslate);
                }
                preTranslate = translate;
                this.translate(toTranslate);
            }
            var dSymbol = styles['symbol'];
            if (dSymbol) {
                this.setSymbol(Z.Util.extendSymbol(symbol, dSymbol));
            }
            if (isFocusing) {
                var pcenter = projection.project(this.getCenter());
                map._setPrjCenterAndMove(pcenter);
                if (player.playState !== 'running') {
                    map._onMoveEnd();
                } else {
                    map._onMoving();
                }
            }
            this._fireAnimateEvent(player.playState);
            if (callback) {
                callback(frame);
            }
        }, this));

        return player.play();
    },
    /**
     * prepare styles for animation
     * @return {Object} symbol to animate
     * @private
     */
    _prepareAnimationStyles:function (styles) {
        var symbol = this._getInternalSymbol();
        var stylesToAnimate = {};
        for (var p in styles) {
            if (styles.hasOwnProperty(p)) {
                var v = styles[p],
                    sp;
                if (p !== 'translate' && p !== 'symbol') {
                    //this.getRadius() / this.getWidth(), etc.
                    var fnName = 'get' + p[0].toUpperCase() + p.substring(1);
                    var current = this[fnName]();
                    stylesToAnimate[p] = [current, v];
                } else if (p === 'symbol') {
                    var symbolToAnimate;
                    if (Z.Util.isArray(styles['symbol'])) {
                        if (!Z.Util.isArray(symbol)) {
                            throw new Error('geometry\'symbol isn\'t a composite symbol, while the symbol in styles is.');
                        }
                        symbolToAnimate = [];
                        var symbolInStyles = styles['symbol'];
                        for (var i = 0; i < symbolInStyles.length; i++) {
                            if (!symbolInStyles[i]) {
                                symbolToAnimate.push(null);
                                continue;
                            }
                            var a = {};
                            for (sp in symbolInStyles[i]) {
                                if (symbolInStyles[i].hasOwnProperty(sp)) {
                                    a[sp] = [symbol[i][sp], symbolInStyles[i][sp]];
                                }
                            }
                            symbolToAnimate.push(a);
                        }
                    } else {
                        if (Z.Util.isArray(symbol)) {
                            throw new Error('geometry\'symbol is a composite symbol, while the symbol in styles isn\'t.');
                        }
                        symbolToAnimate = {};
                        for (sp in v) {
                            if (v.hasOwnProperty(sp)) {
                                symbolToAnimate[sp] = [symbol[sp], v[sp]];
                            }
                        }
                    }
                    stylesToAnimate['symbol'] = symbolToAnimate;
                } else if (p === 'translate') {
                    stylesToAnimate['translate'] = new Z.Coordinate(v);
                }
            }
        }
        return stylesToAnimate;
    },

    _fireAnimateEvent:function (playState) {
        if (playState === 'finished') {
            delete this._animationStarted;
            this._fireEvent('animateend');
        } else if (playState === 'running') {
            if (this._animationStarted) {
                this._fireEvent('animating');
            } else {
                this._fireEvent('animatestart');
                this._animationStarted = true;
            }

        }
    }
});

/**
 * @classdesc Base class for all the geometry classes besides [maptalks.Marker]{@link maptalks.Marker}. <br/>
 * @class
 * @category geometry
 * @abstract
 * @extends maptalks.Geometry
 */
Z.Vector = Z.Geometry.extend(/** @lends maptalks.Vector.prototype */{
    /**
     * @property {Object} options - Vector's options
     * @property {Object} options.symbol - Vector's default symbol
     */
    options:{
        'symbol':{
            'lineColor' : '#000',
            'lineWidth' : 1,
            'lineOpacity' : 1,

            'polygonFill' : '#fff', //default color in cartoCSS
            'polygonOpacity' : 1,
            'opacity' : 1
        }
    },

    _hitTestTolerance: function () {
        var symbol = this._getInternalSymbol();
        var w;
        if (Z.Util.isArray(symbol)) {
            w = 0;
            for (var i = 0; i < symbol.length; i++) {
                if (Z.Util.isNumber(symbol[i]['lineWidth'])) {
                    if (symbol[i]['lineWidth'] > w) {
                        w = symbol[i]['lineWidth'];
                    }
                }
            }
        } else {
            w = symbol['lineWidth'];
        }
        return w ? w / 2 : 1.5;
    }
});

/**
 * Common methods for geometry classes that base on a center, e.g. Marker, Circle, Ellipse , etc
 * @mixin
 */
Z.Geometry.Center = {
    /**
     * Get geometry's center
     * @return {maptalks.Coordinate} - center of the geometry
     */
    getCoordinates:function () {
        return this._coordinates;
    },

    /**
     * Set a new center to the geometry
     * @param {maptalks.Coordinate|Number[]} coordinates - new center
     * @return {maptalks.Geometry} this
     * @fires maptalks.Geometry#positionchange
     */
    setCoordinates:function (coordinates) {
        var center = new Z.Coordinate(coordinates);
        if (center.equals(this._coordinates)) {
            return this;
        }
        this._coordinates = center;
        if (!this.getMap()) {
            this._onPositionChanged();
            return this;
        }
        var projection = this._getProjection();
        this._setPrjCoordinates(projection.project(this._coordinates));
        return this;
    },

    //Gets view point of the geometry's center
    _getCenterViewPoint:function () {
        var pcenter = this._getPrjCoordinates();
        if (!pcenter) { return null; }
        var map = this.getMap();
        if (!map) {
            return null;
        }
        return map._prjToViewPoint(pcenter);
    },

    _getPrjCoordinates:function () {
        var projection = this._getProjection();
        if (!projection) { return null; }
        if (!this._pcenter) {
            if (this._coordinates) {
                this._pcenter = projection.project(this._coordinates);
            }
        }
        return this._pcenter;
    },

    //Set center by projected coordinates
    _setPrjCoordinates:function (pcenter) {
        this._pcenter = pcenter;
        this._onPositionChanged();
    },

    //update cached variables if geometry is updated.
    _updateCache:function () {
        delete this._extent;
        var projection = this._getProjection();
        if (this._pcenter && projection) {
            this._coordinates = projection.unproject(this._pcenter);
        }
    },

    _clearProjection:function () {
        this._pcenter = null;
    },

    _computeCenter:function () {
        return this._coordinates;
    }
};

/**
 * Common methods for geometry classes based on coordinates arrays, e.g. LineString, Polygon
 * @mixin maptalks.Geometry.Poly
 */
Z.Geometry.Poly = {
    /**
     * Transform projected coordinates to view points
     * @param  {maptalks.Coordinate[]} prjCoords  - projected coordinates
     * @returns {maptalks.Point[]}
     * @private
     */
    _getPathViewPoints:function (prjCoords) {
        var result = [];
        if (!Z.Util.isArrayHasData(prjCoords)) {
            return result;
        }
        var map = this.getMap(),
            fullExtent = map.getFullExtent(),
            projection = this._getProjection();
        var anti = this.options['antiMeridian'],
            isClip = map.options['clipFullExtent'],
            isSimplify = this.getLayer() && this.getLayer().options['enableSimplify'],
            tolerance = 2 * map._getResolution(),
            isMulti = Z.Util.isArray(prjCoords[0]);
        if (isSimplify && !isMulti) {
            prjCoords = Z.Simplify.simplify(prjCoords, tolerance, false);
        }
        var i, len, p, pre, current, dx, dy, my,
            part1 = [], part2 = [], part = part1;
        for (i = 0, len = prjCoords.length; i < len; i++) {
            p = prjCoords[i];
            if (isMulti) {
                part.push(this._getPathViewPoints(p));
                continue;
            }
            if (Z.Util.isNil(p) || (isClip && !fullExtent.contains(p))) {
                continue;
            }
            if (i > 0 && (anti === 'continuous' || anti === 'split')) {
                current = projection.unproject(p);
                if (anti === 'split' || !pre) {
                    pre = projection.unproject(prjCoords[i - 1]);
                }
                if (pre && current) {
                    dx = current.x - pre.x;
                    dy = current.y - pre.y;
                    if (Math.abs(dx) > 180) {
                        if (anti === 'continuous') {
                            current = this._anti(current, dx);
                            pre = current;
                            p = projection.project(current);
                        } else if (anti === 'split') {
                            if (dx > 0) {
                                my = pre.y + dy * (pre.x - (-180)) / (360 - dx) * (pre.y > current.y ? -1 : 1);
                                part.push(map.coordinateToViewPoint(new Z.Coordinate(-180, my)));
                                part = part === part1 ? part2 : part1;
                                part.push(map.coordinateToViewPoint(new Z.Coordinate(180, my)));

                            } else {
                                my = pre.y + dy * (180 - pre.x) / (360 + dx) * (pre.y > current.y ? 1 : -1);
                                part.push(map.coordinateToViewPoint(new Z.Coordinate(180, my)));
                                part = part === part1 ? part2 : part1;
                                part.push(map.coordinateToViewPoint(new Z.Coordinate(-180, my)));

                            }
                        }
                    }
                }
            }
            part.push(map._prjToViewPoint(p));
        }
        if (part2.length > 0) {
            result = [part1, part2];
        } else {
            result = part;
        }
        return result;
    },

    _anti: function (c, dx) {
        if (dx > 0) {
            return c.substract(180 * 2, 0);
        } else {
            return c.add(180 * 2, 0);
        }
    },

    _setPrjCoordinates:function (prjPoints) {
        this._prjCoords = prjPoints;
        this._onShapeChanged();
    },

    _getPrjCoordinates:function () {
        if (!this._prjCoords) {
            var points = this._coordinates;
            this._prjCoords = this._projectCoords(points);
        }
        return this._prjCoords;
    },

    //update cached variables if geometry is updated.
    _updateCache:function () {
        delete this._extent;
        var projection = this._getProjection();
        if (!projection) {
            return;
        }
        if (this._prjCoords) {
            this._coordinates = this._unprojectCoords(this._getPrjCoordinates());
        }
        if (this._prjHoles) {
            this._holes = this._unprojectCoords(this._getPrjHoles());
        }
    },

    _clearProjection:function () {
        this._prjCoords = null;
        if (this._prjHoles) {
            this._prjHoles = null;
        }
    },

    _projectCoords:function (points) {
        var projection = this._getProjection();
        if (projection) {
            return projection.projectCoords(points);
        }
        return null;
    },

    _unprojectCoords:function (prjPoints) {
        var projection = this._getProjection();
        if (projection) {
            return projection.unprojectCoords(prjPoints);
        }
        return null;
    },

    _computeCenter:function () {
        var ring = this._coordinates;
        if (!Z.Util.isArrayHasData(ring)) {
            return null;
        }
        var sumx = 0, sumy = 0;
        var counter = 0;
        var size = ring.length;
        for (var i = 0; i < size; i++) {
            if (ring[i]) {
                if (Z.Util.isNumber(ring[i].x) && Z.Util.isNumber(ring[i].y)) {
                    sumx += ring[i].x;
                    sumy += ring[i].y;
                    counter++;
                }
            }
        }
        return new Z.Coordinate(sumx / counter, sumy / counter);
    },

    _computeExtent:function () {
        var ring = this._coordinates;
        if (!Z.Util.isArrayHasData(ring)) {
            return null;
        }
        var rings = [ring];
        if (this.hasHoles && this.hasHoles()) {
            rings = rings.concat(this.getHoles());
        }
        return this._computeCoordsExtent(rings);
    },

     /**
      * Compute extent of a group of coordinates
      * @param  {maptalks.Coordinate[]} coords  - coordinates
      * @returns {maptalks.Extent}
      * @private
      */
    _computeCoordsExtent: function (coords) {
        var result = null,
            anti = this.options['antiMeridian'];
        var ext, p, dx, pre;
        for (var i = 0, len = coords.length; i < len; i++) {
            for (var j = 0, jlen = coords[i].length; j < jlen; j++) {
                p = coords[i][j];
                if (j > 0 && anti) {
                    if (!pre) {
                        pre = coords[i][j - 1];
                    }
                    dx = p.x - pre.x;
                    if (Math.abs(dx) > 180) {
                        p = this._anti(p, dx);
                        pre = p;
                    }
                }
                ext = new Z.Extent(p, p);
                result = ext.combine(result);
            }

        }
        return result;
    }
};

/**
 * @classdesc
 * Represents a Point type Geometry.
 * @class
 * @category geometry
 * @extends maptalks.Geometry
 * @mixes maptalks.Geometry.Center
 * @param {maptalks.Coordinate} center      - center of the marker
 * @param {Object} [options=null]           - specific construct options for marker, also support options defined in [Geometry]{@link maptalks.Geometry#options}
 * @param {Object} [options.symbol=object]  - default symbol of the marker.
 * @example
 * var marker = new maptalks.Marker([100, 0], {
 *     id : 'marker-id'
 * });
 */
Z.Marker = Z.Geometry.extend(/** @lends maptalks.Marker.prototype */{
    includes:[Z.Geometry.Center],

    type: Z.Geometry['TYPE_POINT'],
    /**
     * @property {Object} [options=null]           - options for marker, also support options defined in [Geometry]{@link maptalks.Geometry#options}
     * @property {Object} [options.symbol=object]  - default symbol of the marker.
     */
    options:{
        'symbol': {
            'markerType'    : 'path',
            'markerPath'    : [
                {
                    'path' : 'M8 23l0 0 0 0 0 0 0 0 0 0c-4,-5 -8,-10 -8,-14 0,-5 4,-9 8,-9l0 0 0 0c4,0 8,4 8,9 0,4 -4,9 -8,14z M5,9 a3,3 0,1,0,0,-0.9Z',
                    'fill' : '#DE3333'
                }
            ],
            'markerPathWidth' : 16,
            'markerPathHeight' : 23,
            'markerWidth'   : 24,
            'markerHeight'  : 34
        }
    },

    initialize:function (coordinates, opts) {
        this._coordinates = new Z.Coordinate(coordinates);
        this._initOptions(opts);
    },

    /**
     * Can be edited, only marker with a vector symbol, vector path symbol or a image symbol can be edited.
     * @return {Boolean}
     * @private
     */
    _canEdit:function () {
        var symbol = this._getInternalSymbol();
        if (Z.Util.isArray(symbol)) {
            return false;
        }
        return Z.symbolizer.VectorMarkerSymbolizer.test(symbol) || Z.symbolizer.VectorPathMarkerSymbolizer.test(symbol) ||
                    Z.symbolizer.ImageMarkerSymbolizer.test(symbol);
    },

    _containsPoint: function (point) {
        var pxExtent = this._getPainter().getViewExtent();
        return pxExtent.contains(point);
    },

    _computeExtent: function () {
        var coordinates = this.getCenter();
        if (!coordinates) { return null; }
        return new Z.Extent(coordinates, coordinates);
    },

    _computeGeodesicLength:function () {
        return 0;
    },

    _computeGeodesicArea:function () {
        return 0;
    }
});

/**
 * @classdesc
 * Represents point type geometry for text labels.<br>
 * A label is used to draw text (with a box background if specified) on a particular coordinate.
 * @class
 * @category geometry
 * @extends maptalks.Marker
 * @param {String} content                          - Label's text content
 * @param {maptalks.Coordinate} coordinates         - center
 * @param {Object} [options=null]                   - construct options, includes options defined in [Marker]{@link maptalks.Marker#options}
 * @param {Boolean} [options.box=true]              - whether to display a background box wrapping the label text.
 * @param {Boolean} [options.boxAutoSize=true]      - whether to set the size of the background box automatically to fit for the label text.
 * @param {Boolean} [options.boxMinWidth=0]         - the minimum width of the background box.
 * @param {Boolean} [options.boxMinHeight=0]        - the minimum height of the background box.
 * @param {Boolean} [options.boxPadding=maptalks.Size(12,8)] - padding of the label text to the border of the background box.
 * @param {Boolean} [options.boxTextAlign=middle]   - text align in the box, possible values:left, middle, right
 * @example
 * var label = new maptalks.Label('This is a label',[100,0]);
 * label.addTo(vectorLayer);
 */
Z.Label = Z.Marker.extend(/** @lends maptalks.Label.prototype */{
    /**
     * @property {Object} defaultSymbol Default symbol of the label text
     * @static
     */
    defaultSymbol : {
        'textFaceName'  : 'monospace',
        'textSize': 12,
        'textWrapBefore': false,
        'textWrapCharacter': '\n',
        'textLineSpacing': 8,
        'textHorizontalAlignment': 'middle', //left middle right
        'textVerticalAlignment': 'middle' //top middle bottom
    },

    /**
     * @property {Object} defaultSymbol Default symbol of the background box
     * @static
     */
    defaultBoxSymbol:{
        'markerType':'square',
        'markerLineColor': '#ff0000',
        'markerLineWidth': 2,
        'markerLineOpacity': 1,
        'markerFill': '#ffffff'
    },

    /**
     * @property {Object} [options=null]                   - label's options, also including options of [Marker]{@link maptalks.Marker#options}
     * @property {Boolean} [options.box=true]              - whether to display a background box wrapping the label text.
     * @property {Boolean} [options.boxAutoSize=true]      - whether to set the size of the background box automatically to fit for the label text.
     * @property {Boolean} [options.boxMinWidth=0]         - the minimum width of the background box.
     * @property {Boolean} [options.boxMinHeight=0]        - the minimum height of the background box.
     * @property {Boolean} [options.boxPadding=maptalks.Size(12,8)] - padding of the label text to the border of the background box.
     * @property {Boolean} [options.boxTextAlign=middle]   - text align in the box, possible values:left, middle, right
     */
    options: {
        'box'          :   true,
        'boxAutoSize'  :   true,
        'boxMinWidth'  :   0,
        'boxMinHeight' :   0,
        'boxPadding'   :   new Z.Size(12, 8),
        'boxTextAlign' :   'middle'
    },

    initialize: function (content, coordinates, options) {
        this._content = content;
        this._coordinates = new Z.Coordinate(coordinates);
        this._initOptions(options);
        this._registerEvents();
        this._refresh();
    },

    /**
     * Get text content of the label
     * @returns {String}
     */
    getContent: function () {
        return this._content;
    },

    /**
     * Set a new text content to the label
     * @return {maptalks.Label} this
     * @fires maptalks.Label#contentchange
     */
    setContent: function (content) {
        var old = this._content;
        this._content = content;
        this._refresh();
        /**
         * an event when changing label's text content
         * @event maptalks.Label#contentchange
         * @type {Object}
         * @property {String} type - contentchange
         * @property {maptalks.Label} target - label fires the event
         * @property {String} old - old content
         * @property {String} new - new content
         */
        this._fireEvent('contentchange', {'old':old, 'new':content});
        return this;
    },

    getSymbol: function () {
        if (this._labelSymbolChanged) {
            return Z.Geometry.prototype.getSymbol.call(this);
        }
        return null;
    },

    setSymbol:function (symbol) {
        if (!symbol || symbol === this.options['symbol']) {
            this._labelSymbolChanged = false;
            symbol = {};
        } else {
            this._labelSymbolChanged = true;
        }
        var cooked = this._prepareSymbol(symbol);
        var s = this._getDefaultLabelSymbol();
        Z.Util.extend(s, cooked);
        this._symbol = s;
        this._refresh();
        return this;
    },

    onConfig:function (conf) {
        var isRefresh = false;
        for (var p in conf) {
            if (conf.hasOwnProperty(p)) {
                if (p.indexOf('box') >= 0) {
                    isRefresh = true;
                    break;
                }
            }
        }
        if (isRefresh) {
            this._refresh();
        }
    },

    _getInternalSymbol:function () {
        return this._symbol;
    },

    _getDefaultLabelSymbol: function () {
        var s = {};
        Z.Util.extend(s, this.defaultSymbol);
        if (this.options['box']) {
            Z.Util.extend(s, this.defaultBoxSymbol);
        }
        return s;
    },

    _toJSON:function (options) {
        return {
            'feature' : this.toGeoJSON(options),
            'subType' : 'Label',
            'content' : this._content
        };
    },

    _refresh:function () {
        var symbol = this.getSymbol() || this._getDefaultLabelSymbol();
        symbol['textName'] = this._content;
        if (this.options['box']) {
            if (!symbol['markerType']) {
                symbol['markerType'] = 'square';
            }
            var size;
            var padding = this.options['boxPadding'];
            if (this.options['boxAutoSize'] || this.options['boxTextAlign']) {
                size = Z.StringUtil.splitTextToRow(this._content, symbol)['size'];
            }
            if (this.options['boxAutoSize']) {
                symbol['markerWidth'] = size['width'] + padding['width'] * 2;
                symbol['markerHeight'] = size['height'] + padding['height'] * 2;
            }
            if (this.options['boxMinWidth']) {
                if (!symbol['markerWidth'] || symbol['markerWidth'] < this.options['boxMinWidth']) {
                    symbol['markerWidth'] = this.options['boxMinWidth'];
                }
            }
            if (this.options['boxMinHeight']) {
                if (!symbol['markerHeight'] || symbol['markerHeight'] < this.options['boxMinHeight']) {
                    symbol['markerHeight'] = this.options['boxMinHeight'];
                }
            }
            var align = this.options['boxTextAlign'];
            if (align) {
                var textAlignPoint = Z.StringUtil.getAlignPoint(size, symbol['textHorizontalAlignment'], symbol['textVerticalAlignment']),
                    dx = symbol['textDx'] || 0,
                    dy = symbol['textDy'] || 0;
                textAlignPoint = textAlignPoint._add(dx, dy);
                symbol['markerDx'] = textAlignPoint.x;
                symbol['markerDy'] = textAlignPoint.y + size['height'] / 2;
                if (align === 'left') {
                    symbol['markerDx'] += symbol['markerWidth'] / 2 - padding['width'];
                } else if (align === 'right') {
                    symbol['markerDx'] -= symbol['markerWidth'] / 2 - size['width'] - padding['width'];
                } else {
                    symbol['markerDx'] += size['width'] / 2;
                }
            }
        }
        this._symbol = symbol;
        this._onSymbolChanged();
    },

    _registerEvents: function () {
        this.on('shapechange', this._refresh, this);
        this.on('remove', this._onLabelRemove, this);
        return this;
    },

    _onLabelRemove:function () {
        this.off('shapechange', this._refresh, this);
        this.off('remove', this._onLabelRemove, this);
    }
});

Z.Label._fromJSON = function (json) {
    var feature = json['feature'];
    var label = new Z.Label(json['content'], feature['geometry']['coordinates'], json['options']);
    label.setProperties(feature['properties']);
    return label;
};

 /**
 * @classdesc
 *     Geometry class for polygon type
 * @class
 * @category geometry
 * @extends maptalks.Vector
 * @mixins maptalks.Geometry.Poly
 * @param {Number[][]|Number[][][]|maptalks.Coordinate[]|maptalks.Coordinate[][]} coordinates - coordinates, shell coordinates or all the rings.
 * @param {Object} [options=null] - specific construct options for Polygon, also support options defined in [Vector]{@link maptalks.Vector#options} and [Geometry]{@link maptalks.Geometry#options}
 */
Z.Polygon = Z.Vector.extend(/** @lends maptalks.Polygon.prototype */{

    includes:[Z.Geometry.Poly],

    type:Z.Geometry['TYPE_POLYGON'],

    exceptionDefs:{
        'en-US':{
            'INVALID_COORDINATES':'invalid coordinates for polygon.'
        },
        'zh-CN':{
            'INVALID_COORDINATES':'对于多边形无效的坐标.'
        }
    },

    /**
     * @property {String} [options.antiMeridian=default] - antiMeridian
     */
    options:{
        'antiMeridian' : 'default'
    },

    initialize:function (coordinates, opts) {
        this.setCoordinates(coordinates);
        this._initOptions(opts);
    },

    /**
     * Set coordinates to the polygon
     * @param {Number[][]|Number[][][]|maptalks.Coordinate[]|maptalks.Coordinate[][]} coordinates - new coordinates
     * @return {maptalks.Polygon} this
     */
    setCoordinates:function (coordinates) {
        if (!coordinates) {
            this._coordinates = null;
            this._holes = null;
            this._projectRings();
            return this;
        }
        var rings = Z.GeoJSON.toCoordinates(coordinates);
        var len = rings.length;
        if (!Z.Util.isArray(rings[0])) {
            this._coordinates = this._trimRing(rings);
        } else {
            this._coordinates = this._trimRing(rings[0]);
            if (len > 1) {
                var holes = [];
                for (var i = 1; i < len; i++) {
                    if (!rings[i]) {
                        continue;
                    }
                    holes.push(this._trimRing(rings[i]));
                }
                this._holes = holes;
            }
        }

        this._projectRings();
        return this;
    },

    /**
     * Gets polygons's coordinates
     * @returns {maptalks.Coordinate[][]}
     */
    getCoordinates:function () {
        if (!this._coordinates) {
            return [];
        }
        if (Z.Util.isArrayHasData(this._holes)) {
            var holes = [];
            for (var i = 0; i < this._holes.length; i++) {
                holes.push(this._closeRing(this._holes[i]));
            }
            return [this._closeRing(this._coordinates)].concat(holes);
        }
        return [this._closeRing(this._coordinates)];
    },

    /**
     * Gets shell coordinates of the polygon
     * @returns {maptalks.Coordinate[]}
     */
    getShell:function () {
        return this._coordinates;
    },


    /**
     * Gets holes' coordinates of the polygon if it has.
     * @returns {maptalks.Coordinate[][]}
     */
    getHoles:function () {
        if (this.hasHoles()) {
            return this._holes;
        }
        return null;
    },

    /**
     * Whether the polygon has any holes inside.
     * @returns {Boolean}
     */
    hasHoles:function () {
        if (Z.Util.isArrayHasData(this._holes)) {
            if (Z.Util.isArrayHasData(this._holes[0])) {
                return true;
            }
        }
        return false;
    },

    _projectRings:function () {
        if (!this.getMap()) {
            this._onShapeChanged();
            return;
        }
        this._prjCoords = this._projectCoords(this._coordinates);
        this._prjHoles = this._projectCoords(this._holes);
        this._onShapeChanged();
    },

    _cleanRing:function (ring) {
        for (var i = ring.length - 1; i >= 0; i--) {
            if (!ring[i]) {
                ring.splice(i, 1);
            }
        }
    },

    /**
     * 检查ring是否合法, 并返回ring是否闭合
     * @param  {*} ring [description]
     * @private
     */
    _checkRing:function (ring) {
        this._cleanRing(ring);
        if (!ring || !Z.Util.isArrayHasData(ring)) {
            return false;
        }
        var lastPoint = ring[ring.length - 1];
        var isClose = true;
        // var least = 4;
        if (ring[0].x !== lastPoint.x || ring[0].y !== lastPoint.y) {
            // least = 3;
            isClose = false;
        }
        // if (ring.length < least) {
            //throw new Error(this.exceptions['INVALID_COORDINATES']+', ring length is only '+ring.length);
        // }
        return isClose;
    },

    /**
     * 如果最后一个端点与第一个端点相同, 则去掉最后一个端点
     * @private
     */
    _trimRing:function (ring) {
        var isClose = this._checkRing(ring);
        if (Z.Util.isArrayHasData(ring) && isClose) {
            return ring.slice(0, ring.length - 1);
        } else {
            return ring;
        }
    },

    /**
     * 如果最后一个端点与第一个端点不同, 则在最后增加与第一个端点相同的点
     * @private
     */
    _closeRing:function (ring) {
        var isClose = this._checkRing(ring);
        if (Z.Util.isArrayHasData(ring) && !isClose) {
            return ring.concat([new Z.Coordinate(ring[0].x, ring[0].y)]);
        } else {
            return ring;
        }
    },


    _getPrjHoles:function () {
        if (!this._prjHoles) {
            this._prjHoles = this._projectCoords(this._holes);
        }
        return this._prjHoles;
    },

    _computeGeodesicLength:function (measurer) {
        var rings = this.getCoordinates();
        if (!Z.Util.isArrayHasData(rings)) {
            return 0;
        }
        var result = 0;
        for (var i = 0, len = rings.length; i < len; i++) {
            result += Z.GeoUtils.computeLength(rings[i], measurer);
        }
        return result;
    },

    _computeGeodesicArea:function (measurer) {
        var rings = this.getCoordinates();
        if (!Z.Util.isArrayHasData(rings)) {
            return 0;
        }
        var result = measurer.measureArea(rings[0]);
        //holes
        for (var i = 1, len = rings.length; i < len; i++) {
            result -= measurer.measureArea(rings[i]);

        }
        return result;
    },

    _containsPoint: function (point, tolerance) {
        var t = Z.Util.isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            pxExtent = this._getPainter().getViewExtent().expand(t);
        function isContains(points) {
            var c = Z.GeoUtils.pointInsidePolygon(point, points);
            if (c) {
                return c;
            }

            var i, j, p1, p2,
                len = points.length;

            for (i = 0, j = len - 1; i < len; j = i++) {
                p1 = points[i];
                p2 = points[j];

                if (Z.GeoUtils.distanceToSegment(point, p1, p2) <= t) {
                    return true;
                }
            }

            return false;
        }

        point = new Z.Point(point.x, point.y);

        if (!pxExtent.contains(point)) { return false; }

        // screen points
        var points = this._getPathViewPoints(this._getPrjCoordinates()),
            isSplitted = Z.Util.isArray(points[0]);
        if (isSplitted) {
            for (var i = 0; i < points.length; i++) {
                if (isContains(points[i])) {
                    return true;
                }
            }
            return false;
        } else {
            return isContains(points);
        }

    }
});

/**
 * @classdesc Represents a LineString type Geometry.
 * @class
 * @category geometry
 * @extends {maptalks.Vector}
 * @mixes   {maptalks.Geometry.Poly}
 * @param {maptalks.Coordinate[]|Number[][]} coordinates - coordinates of the line string
 * @param {Object} [options=null] - specific construct options for LineString, also support options defined in [Vector]{@link maptalks.Vector#options} and [Geometry]{@link maptalks.Geometry#options}
 * @param {Number} [options.antiMeridian=default]            - antimeridian
 * @param {Number} [options.arrowStyle=null]                 - style of arrow, if not null, arrows will be drawn, possible values: classic
 * @param {Number} [options.arrowPlacement=vertex-last]      - arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
 */
Z.LineString = Z.Polyline = Z.Vector.extend(/** @lends maptalks.LineString.prototype */{
    includes:[Z.Geometry.Poly],

    type:Z.Geometry['TYPE_LINESTRING'],

    /**
    * @property {Object} [options=null] - specific construct options for LineString, also support options defined in [Vector]{@link maptalks.Vector#options} and [Geometry]{@link maptalks.Geometry#options}
    * @property {Number} [options.antiMeridian=default]            - antimeridian
    * @property {Number} [options.arrowStyle=null]                 - style of arrow, if not null, arrows will be drawn, possible values: classic
    * @property {Number} [options.arrowPlacement=vertex-last]      - arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
    */
    options:{
        'antiMeridian' : 'default',
        'arrowStyle' : null,
        'arrowPlacement' : 'vertex-last' //vertex-first, vertex-last, vertex-firstlast, point
    },

    initialize:function (coordinates, opts) {
        this.setCoordinates(coordinates);
        this._initOptions(opts);
    },

    /**
     * Set new coordinates to the line string
     * @param {maptalks.Coordinate[]|Number[][]} coordinates - new coordinates
     * @fires maptalks.Geometry#shapechange
     * @return {maptalks.LineString} this
     */
    setCoordinates:function (coordinates) {
        if (!coordinates) {
            this._coordinates = null;
            this._setPrjCoordinates(null);
            return this;
        }
        this._coordinates = Z.GeoJSON.toCoordinates(coordinates);
        if (this.getMap()) {
            this._setPrjCoordinates(this._projectCoords(this._coordinates));
        } else {
            this._onShapeChanged();
        }
        return this;
    },

    /**
     * Get coordinates of the line string
     * @return {maptalks.Coordinate[]|Number[][]} coordinates
     */
    getCoordinates:function () {
        if (!this._coordinates) {
            return [];
        }
        return this._coordinates;
    },

    _computeGeodesicLength:function (measurer) {
        return Z.GeoUtils.computeLength(this.getCoordinates(), measurer);
    },

    _computeGeodesicArea:function () {
        return 0;
    },

    _containsPoint: function (point, tolerance) {
        var t = Z.Util.isNil(tolerance) ? this._hitTestTolerance() : tolerance;
        function isContains(points) {
            var i, p1, p2,
                len = points.length;

            for (i = 0, len = points.length; i < len - 1; i++) {
                p1 = points[i];
                p2 = points[i + 1];

                if (Z.GeoUtils.distanceToSegment(point, p1, p2) <= t) {
                    return true;
                }
            }
            return false;
        }
        var map = this.getMap(),
            extent = this._getPrjExtent(),
            nw = new Z.Coordinate(extent.xmin, extent.ymax),
            se = new Z.Coordinate(extent.xmax, extent.ymin),
            pxMin = map._prjToViewPoint(nw),
            pxMax = map._prjToViewPoint(se),
            pxExtent = new Z.PointExtent(pxMin.x - t, pxMin.y - t,
                                    pxMax.x + t, pxMax.y + t);
        if (t < 2) {
            t = 2;
        }
        point = new Z.Point(point.x, point.y);

        if (!pxExtent.contains(point)) { return false; }

        // screen points
        var points = this._getPathViewPoints(this._getPrjCoordinates()),
            isSplitted = points.length > 0 && Z.Util.isArray(points[0]);
        if (isSplitted) {
            for (var i = 0; i < points.length; i++) {
                if (isContains(points[i])) {
                    return true;
                }
            }
            return false;
        } else {
            return isContains(points);
        }

    }

});

/**
 * @classdesc Curve style LineString
 * @class
 * @category geometry
 * @extends {maptalks.LineString}
 * @param {maptalks.Coordinate[]|Number[][]} coordinates - coordinates of the line string
 * @param {Object} options - construct options of LineString, specific construct options for circle, also support options defined in [LineString]{@link maptalks.LineString#options}
 * @param {Number} [options.curveType=1]            - curve type of the curve line: 0 - straight line; 1: circle arc; 2: quadratic curve; 3: bezier curve
 * @param {Number} [options.arcDegree=90]           - arc's degree if curveType is 1 (circle arc).
 */
Z.CurveLine = Z.LineString.extend({
    options:{
        'curveType'   : 1,
        'arcDegree'     : 90
    },

    _toJSON:function (options) {
        return {
            'feature' : this.toGeoJSON(options),
            'subType' : 'CurveLine'
        };
    },

    _getRenderCanvasResources:function () {
        //draw a triangle arrow
        var prjVertexes = this._getPrjCoordinates();
        var points = this._getPathViewPoints(prjVertexes);
        var arcDegree = this.options['arcDegree'],
            curveType = this.options['curveType'];
        var me = this;
        var fn = function (_ctx, _points, _lineOpacity) {
            var curveFn, degree;
            switch (curveType) {
            case 0 : curveFn = Z.Canvas._lineTo; degree = 1; break;
            case 1 : curveFn = Z.Canvas._arcBetween; degree = 1; break;
            case 2 : curveFn = Z.Canvas._quadraticCurveTo; degree = 2; break;
            case 3 : curveFn = Z.Canvas._bezierCurveTo; degree = 3; break;
            }
            var i, len = _points.length;
            _ctx.beginPath();
            for (i = 0; i < len; i += degree) {
                var p = _points[i].round();
                if (i === 0) {
                    _ctx.moveTo(p.x, p.y);
                }
                var left = len - i;
                if (left <= degree) {
                    if (left === 2) {
                        p = _points[len - 1];
                        _ctx.lineTo(p.x, p.y);
                    } else if (left === 3) {
                        Z.Canvas._quadraticCurveTo(_ctx, _points[len - 2], _points[len - 1]);
                    }
                } else {
                    var points = [];
                    for (var ii = 0; ii < degree; ii++) {
                        points.push(_points[i + ii + 1]);
                    }
                    var args = [_ctx].concat(points);
                    if (curveFn === Z.Canvas._arcBetween) {
                        //arc start point
                        args.splice(1, 0, p);
                        args = args.concat([arcDegree]);
                    }
                    curveFn.apply(Z.Canvas, args);
                    Z.Canvas._stroke(_ctx, this.style['lineOpacity']);
                }
            }
            Z.Canvas._stroke(_ctx, this.style['lineOpacity']);
            if (_ctx.setLineDash) {
                //remove line dash effect if any
                _ctx.setLineDash([]);
            }
            if (me.options['arrowStyle'] && _points.length >= 2) {
                var placement = me.options['arrowPlacement'];
                if (placement === 'vertex-first' || placement === 'vertex-firstlast') {
                    me._arrow(_ctx, _points[1], _points[0], _lineOpacity, me.options['arrowStyle']);
                }
                if (placement === 'vertex-last' || placement === 'vertex-firstlast') {
                    me._arrow(_ctx, _points[_points.length - 2], _points[_points.length - 1], _lineOpacity, me.options['arrowStyle']);
                }
                //besizerCurves doesn't have point arrows
                if ((curveType === 0 || curveType === 1) && placement === 'point') {
                    for (i = 0, len = _points.length - 1; i < len; i++) {
                        me._arrow(_ctx, _points[i], _points[i + 1], _lineOpacity, me.options['arrowStyle']);
                    }
                }
            }

        };
        return {
            'fn' : fn,
            'context' : [points]
        };
    }
});

Z.CurveLine._fromJSON = function (json) {
    var feature = json['feature'];
    var curveLine = new Z.CurveLine(feature['geometry']['coordinates'], json['options']);
    curveLine.setProperties(feature['properties']);
    return curveLine;
};

/**
 * A connector line geometry can connect geometries and ui components with each other. <br>
 * Can be
 * @class
 * @category geometry
 * @extends maptalks.CurveLine
 * @param {maptalks.Geometry|maptalks.Control|maptalks.UIComponent} src     - source to connect
 * @param {maptalks.Geometry|maptalks.Control|maptalks.UIComponent} target  - target to connect
 * @param {Object} [options=null]                   - construct options, also support options defined in the parent class [maptalks.CurveLine]{@link maptalks.CurveLine#options}
 * @param {Number} [options.curveType=0]            - curve type of the connector
 * @param {String} [options.showOn=always]          - when to show the connector line, possible values: 'moving', 'click', 'mouseover', 'always'
 */
Z.ConnectorLine = Z.CurveLine.extend(/** @lends maptalks.CurveLine.prototype */{

    /**
     * @property {Object} options - specific options of circle, also support options defined in the parent class [maptalks.CurveLine]{@link maptalks.CurveLine#options}
     * @param {Number} [options.curveType=0] - curve type of the connector
     * @param {String} [options.showOn=always]          - when to show the connector line, possible values: 'moving', 'click', 'mouseover', 'always'
     */
    options: {
        curveType : 0,
        showOn : 'always'
    },

    initialize: function (src, target, options) {
        this._connSource = src;
        this._connTarget = target;
        this._registEvents();
        this._initOptions(options);
    },

    /**
     * Gets the source of the connector line.
     * @return {maptalks.Geometry|maptalks.Control|maptalks.UIComponent}
     */
    getConnectSource:function () {
        return this._connSource;
    },

    /**
     * Sets the source to the connector line.
     * @param {maptalks.Geometry|maptalks.Control|maptalks.UIComponent} src
     * @return {maptalks.ConnectorLine} this
     */
    setConnectSource:function (src) {
        this._onRemove();
        this._connSource = src;
        this._updateCoordinates();
        this._registEvents();
        return this;
    },

    /**
     * Gets the target of the connector line.
     * @return {maptalks.Geometry|maptalks.Control|maptalks.UIComponent}
     */
    getConnectTarget:function () {
        return this._connTarget;
    },

    /**
     * Sets the target to the connector line.
     * @param {maptalks.Geometry|maptalks.Control|maptalks.UIComponent} target
     * @return {maptalks.ConnectorLine} this
     */
    setConnectTarget:function (target) {
        this._onRemove();
        this._connTarget = target;
        this._updateCoordinates();
        this._registEvents();
        return this;
    },

    _updateCoordinates:function () {
        var map = this.getMap();
        if (!map) {
            map = this._connSource.getMap();
        }
        if (!map) {
            map = this._connTarget.getMap();
        }
        if (!map) {
            return;
        }
        var srcPoints = this._connSource._getConnectPoints();
        var targetPoints = this._connTarget._getConnectPoints();
        var minDist = 0;
        var oldCoordinates = this.getCoordinates();
        var c1, c2;
        for (var i = 0, len = srcPoints.length; i < len; i++) {
            var p1 = srcPoints[i];
            for (var j = 0, length = targetPoints.length; j < length; j++) {
                var p2 = targetPoints[j];
                var dist = map.computeLength(p1, p2);
                if (i === 0 && j === 0) {
                    c1 = p1;
                    c2 = p2;
                    minDist = dist;
                } else if (dist < minDist) {
                    c1 = p1;
                    c2 = p2;
                }
            }
        }
        if (!Z.Util.isArrayHasData(oldCoordinates) || (!oldCoordinates[0].equals(c1) || !oldCoordinates[1].equals(c2))) {
            this.setCoordinates([c1, c2]);
        }
    },

    _onRemove: function () {
        Z.Util.removeFromArray(this, this._connSource.__connectors);
        Z.Util.removeFromArray(this, this._connTarget.__connectors);
        this._connSource.off('dragging positionchange', this._updateCoordinates, this)
                        .off('remove', this._onRemove, this);
        this._connTarget.off('dragging positionchange', this._updateCoordinates, this)
                        .off('remove', this._onRemove, this);
        this._connSource.off('dragstart mousedown mouseover', this._showConnect, this);
        this._connSource.off('dragend mouseup mouseout', this.hide, this);
        this._connSource.off('show', this._showConnect, this).off('hide', this.hide, this);
        this._connTarget.off('show', this._showConnect, this).off('hide', this.hide, this);
    },

    _showConnect:function () {
        if (!this._connSource || !this._connTarget) {
            return;
        }
        if ((this._connSource instanceof Z.Control || this._connSource.isVisible()) &&
            (this._connTarget instanceof Z.Control || this._connTarget.isVisible())) {
            this._updateCoordinates();
            this.show();
        }
    },

    _registEvents: function () {
        if (!this._connSource.__connectors) {
            this._connSource.__connectors = [];
        }
        if (!this._connTarget.__connectors) {
            this._connTarget.__connectors = [];
        }
        this._connSource.__connectors.push(this);
        this._connTarget.__connectors.push(this);
        this._connSource.on('dragging positionchange', this._updateCoordinates, this)
                        .on('remove', this.remove, this);
        this._connTarget.on('dragging positionchange', this._updateCoordinates, this)
                        .on('remove', this.remove, this);
        this._connSource.on('show', this._showConnect, this).on('hide', this.hide, this);
        this._connTarget.on('show', this._showConnect, this).on('hide', this.hide, this);
        var trigger = this.options['showOn'];
        this.hide();
        if (trigger === 'moving') {
            this._connSource.on('dragstart', this._showConnect, this).on('dragend', this.hide, this);
            this._connTarget.on('dragstart', this._showConnect, this).on('dragend', this.hide, this);
        } else if (trigger === 'click') {
            this._connSource.on('mousedown', this._showConnect, this).on('mouseup', this.hide, this);
            this._connTarget.on('mousedown', this._showConnect, this).on('mouseup', this.hide, this);
        } else if (trigger === 'mouseover') {
            this._connSource.on('mouseover', this._showConnect, this).on('mouseout', this.hide, this);
            this._connTarget.on('mouseover', this._showConnect, this).on('mouseout', this.hide, this);
        } else {
            this._showConnect();
        }
    },
    _isEditingOrDragging:function () {
        return ((!(this._connSource instanceof Z.Control) && this._connSource._isEditingOrDragging()) ||
            (!(this._connTarget instanceof Z.Control) && this._connTarget._isEditingOrDragging()));
    }
});


Z.Util.extend(Z.ConnectorLine, {
    _hasConnectors:function (geometry) {
        return (!Z.Util.isNil(geometry.__connectors) && geometry.__connectors.length > 0);
    },

    _getConnectors:function (geometry) {
        return geometry.__connectors;
    }
});

/**
 * @classdesc
 * Represents a Ellipse Geometry, a child class of [maptalks.Polygon]{@link maptalks.Polygon}. <br>
 *     It means it shares all the methods defined in [maptalks.Polygon]{@link maptalks.Polygon} besides some overrided ones.
 * @class
 * @category geometry
 * @extends maptalks.Polygon
 * @mixes maptalks.Geometry.Center
 * @param {maptalks.Coordinate} center  - center of the ellipse
 * @param {Number} width                - width of the ellipse
 * @param {Number} height                - height of the ellipse
 * @param {Object} [options=null]   - specific construct options for ellipse, also support options defined in [Polygon]{@link maptalks.Polygon#options}
 * @param {Number} [options.numberOfShellPoints=60]   - number of shell points when exporting the ellipse's shell coordinates as a polygon.
 * @example
 * var ellipse = new maptalks.Ellipse([100, 0], 1000, 500, {
 *     id : 'ellipse-id'
 * });
 */
Z.Ellipse = Z.Polygon.extend(/** @lends maptalks.Ellipse.prototype */{
    includes:[Z.Geometry.Center],

    options:{
        'numberOfShellPoints':60
    },


    initialize:function (coordinates, width, height, opts) {
        this._coordinates = new Z.Coordinate(coordinates);
        this.width = width;
        this.height = height;
        this._initOptions(opts);
    },

    /**
     * Get ellipse's width
     * @return {Number}
     */
    getWidth:function () {
        return this.width;
    },

    /**
     * Set new width to ellipse
     * @param {Number} width - new width
     * @fires maptalks.Geometry#shapechange
     * @return {maptalks.Ellipse} this
     */
    setWidth:function (width) {
        this.width = width;
        this._onShapeChanged();
        return this;
    },

    /**
     * Get ellipse's height
     * @return {Number}
     */
    getHeight:function () {
        return this.height;
    },

    /**
     * Set new height to ellipse
     * @param {Number} height - new height
     * @fires maptalks.Geometry#shapechange
     * @return {maptalks.Ellipse} this
     */
    setHeight:function (height) {
        this.height = height;
        this._onShapeChanged();
        return this;
    },

    /**
     * Gets the shell of the circle as a polygon, number of the shell points is decided by [options.numberOfShellPoints]{@link maptalks.Circle#options}
     * @return {maptalks.Coordinate[]} - shell coordinates
     */
    getShell:function () {
        var measurer = this._getMeasurer();
        var center = this.getCoordinates();
        var numberOfPoints = this.options['numberOfShellPoints'];
        var width = this.getWidth(),
            height = this.getHeight();
        var shell = [];
        var s = Math.pow(width, 2) * Math.pow(height, 2),
            sx = Math.pow(width, 2),
            sy = Math.pow(height, 2);
        for (var i = 0; i < numberOfPoints; i++) {
            var rad = (360 * i / numberOfPoints) * Math.PI / 180;
            var dx = Math.sqrt(s / (sx * Math.pow(Math.tan(rad), 2) + sy));
            var dy = Math.sqrt(s / (sy * Math.pow(1 / Math.tan(rad), 2) + sx));
            var vertex = measurer.locate(center, dx, dy);
            shell.push(vertex);
        }
        return shell;
    },

    /**
     * Ellipse won't have any holes, always returns null
     * @return {null}
     */
    getHoles:function () {
        return null;
    },

    _containsPoint: function (point, tolerance) {
        var map = this.getMap(),
            t = Z.Util.isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            pa = map.distanceToPixel(this.width / 2, 0),
            pb = map.distanceToPixel(0, this.height / 2),
            a = pa.width,
            b = pb.height,
            c = Math.sqrt(Math.abs(a * a - b * b)),
            xfocus = a >= b;
        var center = this._getCenterViewPoint();
        var f1, f2, d;
        if (xfocus) {
            f1 = new Z.Point(center.x - c, center.y);
            f2 = new Z.Point(center.x + c, center.y);
            d = a * 2;
        } else {
            f1 = new Z.Point(center.x, center.y - c);
            f2 = new Z.Point(center.x, center.y + c);
            d = b * 2;
        }
        point = new Z.Point(point.x, point.y);

        /*
         L1 + L2 = D
         L1 + t >= L1'
         L2 + t >= L2'
         D + 2t >= L1' + L2'
         */
        return point.distanceTo(f1) + point.distanceTo(f2) <= d + 2 * t;
    },

    _computeExtent:function (measurer) {
        if (!measurer || !this._coordinates || Z.Util.isNil(this.width) || Z.Util.isNil(this.height)) {
            return null;
        }
        var width = this.getWidth(),
            height = this.getHeight();
        var p1 = measurer.locate(this._coordinates, width / 2, height / 2);
        var p2 = measurer.locate(this._coordinates, -width / 2, -height / 2);
        return new Z.Extent(p1, p2);
    },

    _computeGeodesicLength:function () {
        if (Z.Util.isNil(this.width) || Z.Util.isNil(this.height)) {
            return 0;
        }
        //L=2πb+4(a-b)
        //近似值
        var longer = (this.width > this.height ? this.width : this.height);
        return 2 * Math.PI * longer / 2 - 4 * Math.abs(this.width - this.height);
    },

    _computeGeodesicArea:function () {
        if (Z.Util.isNil(this.width) || Z.Util.isNil(this.height)) {
            return 0;
        }
        return Math.PI * this.width * this.height / 4;
    },

    _exportGeoJSONGeometry: function () {
        var coordinates = Z.GeoJSON.toNumberArrays([this.getShell()]);
        return {
            'type' : 'Polygon',
            'coordinates' : coordinates
        };
    },

    _toJSON:function (options) {
        var opts = Z.Util.extend({}, options);
        var center = this.getCenter();
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type' : 'Polygon'
        };
        return {
            'feature'   : feature,
            'subType'   : 'Ellipse',
            'coordinates'  : [center.x, center.y],
            'width'     : this.getWidth(),
            'height'    : this.getHeight()
        };
    }

});

Z.Ellipse._fromJSON = function (json) {
    var feature = json['feature'];
    var ellipse = new Z.Ellipse(json['coordinates'], json['width'], json['height'], json['options']);
    ellipse.setProperties(feature['properties']);
    return ellipse;
};

/**
 * @classdesc
 * Represents a Circle Geometry, a child class of [maptalks.Polygon]{@link maptalks.Polygon}. <br>
 *     It means it shares all the methods defined in [maptalks.Polygon]{@link maptalks.Polygon} besides some overrided ones.
 * @class
 * @category geometry
 * @extends maptalks.Polygon
 * @mixes maptalks.Geometry.Center
 * @param {maptalks.Coordinate} center - center of the circle
 * @param {Number} radius           - radius of the circle
 * @param {Object} [options=null]   - specific construct options for circle, also support options defined in [Polygon]{@link maptalks.Polygon#options}
 * @param {Number} [options.numberOfShellPoints=60]   - number of shell points when exporting the circle's shell coordinates as a polygon.
 * @example
 * var circle = new maptalks.Circle([100, 0], 1000, {
 *     id : 'circle-id'
 * });
 */
Z.Circle = Z.Polygon.extend(/** @lends maptalks.Circle.prototype */{
    includes:[Z.Geometry.Center],

    /**
     * @property {Object} options - specific options of circle, also support options defined in [Polygon]{@link maptalks.Polygon#options}
     * @property {Number} [options.numberOfShellPoints=60]   - number of shell points when converting the circle to a polygon.
     */
    options:{
        'numberOfShellPoints':60
    },

    initialize:function (coordinates, radius, opts) {
        this._coordinates = new Z.Coordinate(coordinates);
        this._radius = radius;
        this._initOptions(opts);
    },

    /**
     * Get radius of the circle
     * @return {Number}
     */
    getRadius:function () {
        return this._radius;
    },

    /**
     * Set a new radius to the circle
     * @param {Number} radius - new radius
     * @return {maptalks.Circle} this
     * @fires maptalks.Geometry#shapechange
     */
    setRadius:function (radius) {
        this._radius = radius;
        this._onShapeChanged();
        return this;
    },

    /**
     * Gets the shell of the circle as a polygon, number of the shell points is decided by [options.numberOfShellPoints]{@link maptalks.Circle#options}
     * @return {maptalks.Coordinate[]} - shell coordinates
     */
    getShell:function () {
        var measurer = this._getMeasurer();
        var center = this.getCoordinates();
        var numberOfPoints = this.options['numberOfShellPoints'];
        var radius = this.getRadius();
        var shell = [];
        for (var i = 0; i < numberOfPoints; i++) {
            var rad = (360 * i / numberOfPoints) * Math.PI / 180;
            var dx = radius * Math.cos(rad);
            var dy = radius * Math.sin(rad);
            var vertex = measurer.locate(center, dx, dy);
            shell.push(vertex);
        }
        return shell;
    },

    /**
     * Circle won't have any holes, always returns null
     * @return {null}
     */
    getHoles:function () {
        return null;
    },

    _containsPoint: function (point, tolerance) {
        var center = this._getCenterViewPoint(),
            size = this.getSize(),
            t = Z.Util.isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            pc = new Z.Point(center.x, center.y),
            pp = new Z.Point(point.x, point.y);

        return pp.distanceTo(pc) <= size.width / 2 + t;
    },

    _computeExtent:function (measurer) {
        if (!measurer || !this._coordinates || Z.Util.isNil(this._radius)) {
            return null;
        }

        var radius = this._radius;
        var p1 = measurer.locate(this._coordinates, radius, radius);
        var p2 = measurer.locate(this._coordinates, -radius, -radius);
        return new Z.Extent(p1, p2);
    },

    _computeGeodesicLength:function () {
        if (Z.Util.isNil(this._radius)) {
            return 0;
        }
        return Math.PI * 2 * this._radius;
    },

    _computeGeodesicArea:function () {
        if (Z.Util.isNil(this._radius)) {
            return 0;
        }
        return Math.PI * Math.pow(this._radius, 2);
    },

    _exportGeoJSONGeometry: function () {
        var coordinates = Z.GeoJSON.toNumberArrays([this.getShell()]);
        return {
            'type' : 'Polygon',
            'coordinates' : coordinates
        };
    },

    _toJSON:function (options) {
        var center = this.getCenter();
        var opts = Z.Util.extend({}, options);
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type' : 'Polygon'
        };
        return {
            'feature' : feature,
            'subType' : 'Circle',
            'coordinates'  : [center.x, center.y],
            'radius'  : this.getRadius()
        };
    }

});

Z.Circle._fromJSON = function (json) {
    var feature = json['feature'];
    var circle = new Z.Circle(json['coordinates'], json['radius'], json['options']);
    circle.setProperties(feature['properties']);
    return circle;
};

/**
 * @classdesc
 * Represents a sector Geometry, a child class of [maptalks.Polygon]{@link maptalks.Polygon}. <br>
 *     It means it shares all the methods defined in [maptalks.Polygon]{@link maptalks.Polygon} besides some overrided ones.
 * @class
 * @category geometry
 * @extends maptalks.Polygon
 * @mixes maptalks.Geometry.Center
 * @param {maptalks.Coordinate} center - center of the sector
 * @param {Number} radius           - radius of the sector
 * @param {Number} startAngle       - start angle of the sector
 * @param {Number} endAngle         - end angle of the sector
 * @param {Object} [options=null]   - specific construct options for sector, also support options defined in [Polygon]{@link maptalks.Polygon#options}
 * @param {Number} [options.numberOfShellPoints=60]   - number of shell points when exporting the sector's shell coordinates as a polygon.
 * @example
 * var sector = new maptalks.Sector([100, 0], 1000, 30, 120, {
 *     id : 'sector-id'
 * });
 */
Z.Sector = Z.Polygon.extend(/** @lends maptalks.Sector.prototype */{
    includes:[Z.Geometry.Center],

    /**
     * @property {Object} options - specific options of sector, also support options defined in [Polygon]{@link maptalks.Polygon#options}
     * @property {Number} [options.numberOfShellPoints=60]   - number of shell points when converting the sector to a polygon.
     */
    options:{
        'numberOfShellPoints':60
    },


    initialize:function (coordinates, radius, startAngle, endAngle, opts) {
        this._coordinates = new Z.Coordinate(coordinates);
        this._radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this._initOptions(opts);
    },

    /**
     * Get radius of the sector
     * @return {Number}
     */
    getRadius:function () {
        return this._radius;
    },

    /**
     * Set a new radius to the sector
     * @param {Number} radius - new radius
     * @return {maptalks.Sector} this
     * @fires maptalks.Geometry#shapechange
     */
    setRadius:function (radius) {
        this._radius = radius;
        this._onShapeChanged();
        return this;
    },

    /**
     * Get the sector's start angle
     * @return {Number}
     */
    getStartAngle:function () {
        return this.startAngle;
    },

    /**
     * Set a new start angle to the sector
     * @param {Number} startAngle
     * @return {maptalks.Sector} this
     * @fires maptalksGeometry#shapechange
     */
    setStartAngle:function (startAngle) {
        this.startAngle = startAngle;
        this._onShapeChanged();
        return this;
    },

    /**
     * Get the sector's end angle
     * @return {Number}
     */
    getEndAngle:function () {
        return this.endAngle;
    },

    /**
     * Set a new end angle to the sector
     * @param {Number} endAngle
     * @return {maptalks.Sector} this
     * @fires maptalksGeometry#shapechange
     */
    setEndAngle:function (endAngle) {
        this.endAngle = endAngle;
        this._onShapeChanged();
        return this;
    },

    /**
     * Gets the shell of the sector as a polygon, number of the shell points is decided by [options.numberOfShellPoints]{@link maptalks.Sector#options}
     * @return {maptalks.Coordinate[]} - shell coordinates
     */
    getShell:function () {
        var measurer = this._getMeasurer();
        var center = this.getCoordinates();
        var numberOfPoints = this.options['numberOfShellPoints'];
        var radius = this.getRadius();
        var shell = [];
        var angle = this.getEndAngle() - this.getStartAngle();
        for (var i = 0; i < numberOfPoints; i++) {
            var rad = (angle * i / numberOfPoints + this.getStartAngle()) * Math.PI / 180;
            var dx = radius * Math.cos(rad);
            var dy = radius * Math.sin(rad);
            var vertex = measurer.locate(center, dx, dy);
            shell.push(vertex);
        }
        return shell;

    },

    /**
     * Sector won't have any holes, always returns null
     * @return {null}
     */
    getHoles:function () {
        return null;
    },

    _containsPoint: function (point, tolerance) {
        var center = this._getCenterViewPoint(),
            t = Z.Util.isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            size = this.getSize(),
            pc = center,
            pp = point,
            x = pp.x - pc.x,
            y = pc.y - pp.y,
            atan2 = Math.atan2(y, x),
            // [0.0, 360.0)
            angle = atan2 < 0 ? (atan2 + 2 * Math.PI) * 360 / (2 * Math.PI) :
                atan2 * 360 / (2 * Math.PI);
        var sAngle = this.startAngle % 360,
            eAngle = this.endAngle % 360;
        var between = false;
        if (sAngle > eAngle) {
            between = !(angle > eAngle && angle < sAngle);
        } else {
            between = (angle >= sAngle && angle <= eAngle);
        }

        // TODO: tolerance
        return pp.distanceTo(pc) <= (size.width / 2 + t) && between;
    },

    _computeExtent:function (measurer) {
        if (!measurer || !this._coordinates || Z.Util.isNil(this._radius)) {
            return null;
        }

        var radius = this._radius;
        var p1 = measurer.locate(this._coordinates, radius, radius);
        var p2 = measurer.locate(this._coordinates, -radius, -radius);
        return new Z.Extent(p1, p2);
    },

    _computeGeodesicLength:function () {
        if (Z.Util.isNil(this._radius)) {
            return 0;
        }
        return Math.PI * 2 * this._radius * Math.abs(this.startAngle - this.endAngle) / 360 + 2 * this._radius;
    },

    _computeGeodesicArea:function () {
        if (Z.Util.isNil(this._radius)) {
            return 0;
        }
        return Math.PI * Math.pow(this._radius, 2) * Math.abs(this.startAngle - this.endAngle) / 360;
    },

    _exportGeoJSONGeometry: function () {
        var coordinates = Z.GeoJSON.toNumberArrays([this.getShell()]);
        return {
            'type' : 'Polygon',
            'coordinates' : coordinates
        };
    },

    _toJSON:function (options) {
        var opts = Z.Util.extend({}, options);
        var center = this.getCenter();
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type' : 'Polygon'
        };
        return {
            'feature'   :  feature,
            'subType'   :  'Sector',
            'coordinates'  :  [center.x, center.y],
            'radius'    :  this.getRadius(),
            'startAngle':  this.getStartAngle(),
            'endAngle'  :  this.getEndAngle()
        };
    }

});

Z.Sector._fromJSON = function (json) {
    var feature = json['feature'];
    var sector = new Z.Sector(json['coordinates'], json['radius'], json['startAngle'], json['endAngle'], json['options']);
    sector.setProperties(feature['properties']);
    return sector;
};

/**
 * @classdesc
 * Represents a Rectangle geometry, a child class of [maptalks.Polygon]{@link maptalks.Polygon}. <br>
 *     It means it shares all the methods defined in [maptalks.Polygon]{@link maptalks.Polygon} besides some overrided ones.
 * @class
 * @category geometry
 * @extends {maptalks.Polygon}
 * @param {maptalks.Coordinate} coordinates  - northwest of the rectangle
 * @param {Number} width                     - width of the rectangle
 * @param {Number} height                    - height of the rectangle
 * @param {Object} [options=null]            - options defined in [Polygon]{@link maptalks.Polygon#options}
 * @example
 * var rectangle = new maptalks.Rectangle([100, 0], 1000, 500, {
 *     id : 'rectangle-id'
 * });
 */
Z.Rectangle = Z.Polygon.extend(/** @lends maptalks.Rectangle.prototype */{

    initialize:function (coordinates, width, height, opts) {
        this._coordinates = new Z.Coordinate(coordinates);
        this._width = width;
        this._height = height;
        this._initOptions(opts);
    },


    /**
     * Get coordinates of rectangle's northwest
     * @return {maptalks.Coordinate}
     */
    getCoordinates:function () {
        return this._coordinates;
    },

    /**
     * Set a new coordinate for northwest of the rectangle
     * @param {maptalks.Coordinate} nw - coordinates of new northwest
     * @return {maptalks.Rectangle} this
     * @fires maptalks.Geometry#positionchange
     */
    setCoordinates:function (nw) {
        this._coordinates = new Z.Coordinate(nw);

        if (!this._coordinates || !this.getMap()) {
            this._onPositionChanged();
            return this;
        }
        var projection = this._getProjection();
        this._setPrjCoordinates(projection.project(this._coordinates));
        return this;
    },

    /**
     * Get rectangle's width
     * @return {Number}
     */
    getWidth:function () {
        return this._width;
    },

    /**
     * Set new width to the rectangle
     * @param {Number} width - new width
     * @fires maptalks.Geometry#shapechange
     * @return {maptalks.Rectangle} this
     */
    setWidth:function (width) {
        this._width = width;
        this._onShapeChanged();
        return this;
    },

    /**
     * Get rectangle's height
     * @return {Number}
     */
    getHeight:function () {
        return this._height;
    },

    /**
     * Set new height to rectangle
     * @param {Number} height - new height
     * @fires maptalks.Geometry#shapechange
     * @return {maptalks.Rectangle} this
     */
    setHeight:function (height) {
        this._height = height;
        this._onShapeChanged();
        return this;
    },

   /**
     * Gets the shell of the rectangle as a polygon
     * @return {maptalks.Coordinate[]} - shell coordinates
     */
    getShell:function () {
        var measurer = this._getMeasurer();
        var nw = this._coordinates;
        var map = this.getMap();
        var r = -1;
        if (map) {
            var fExt = map.getFullExtent();
            if (fExt['bottom'] > fExt['top']) {
                r = 1;
            }
        }
        var points = [];
        points.push(nw);
        points.push(measurer.locate(nw, this._width, 0));
        points.push(measurer.locate(nw, this._width, r * this._height));
        points.push(measurer.locate(nw, 0, r * this._height));
        points.push(nw);
        return points;

    },

    /**
     * Rectangle won't have any holes, always returns null
     * @return {null}
     */
    getHoles:function () {
        return null;
    },

    _getPrjCoordinates:function () {
        var projection = this._getProjection();
        if (!projection) { return null; }
        if (!this._pnw) {
            if (this._coordinates) {
                this._pnw = projection.project(this._coordinates);
            }
        }
        return this._pnw;
    },


    _setPrjCoordinates:function (pnw) {
        this._pnw = pnw;
        this._onPositionChanged();
    },


    //update cached variables if geometry is updated.
    _updateCache:function () {
        delete this._extent;
        var projection = this._getProjection();
        if (this._pnw && projection) {
            this._coordinates = projection.unproject(this._pnw);
        }
    },

    _clearProjection:function () {
        this._pnw = null;
    },

    _computeCenter:function (measurer) {
        return measurer.locate(this._coordinates, this._width / 2, -this._height / 2);
    },

    _containsPoint: function (point, tolerance) {
        var map = this.getMap(),
            t = Z.Util.isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            sp = map.coordinateToViewPoint(this._coordinates),
            pxSize = map.distanceToPixel(this._width, this._height);

        var pxMin = new Z.Point(sp.x, sp.y),
            pxMax = new Z.Point(sp.x + pxSize.width, sp.y + pxSize.height),
            pxExtent = new Z.PointExtent(pxMin.x - t, pxMin.y - t,
                                    pxMax.x + t, pxMax.y + t);

        point = new Z.Point(point.x, point.y);

        return pxExtent.contains(point);
    },

    _computeExtent:function (measurer) {
        if (!measurer || !this._coordinates || Z.Util.isNil(this._width) || Z.Util.isNil(this._height)) {
            return null;
        }
        var width = this.getWidth(),
            height = this.getHeight();
        var p1 = measurer.locate(this._coordinates, width, -height);
        return new Z.Extent(p1, this._coordinates);
    },

    _computeGeodesicLength:function () {
        if (Z.Util.isNil(this._width) || Z.Util.isNil(this._height)) {
            return 0;
        }
        return 2 * (this._width + this._height);
    },

    _computeGeodesicArea:function () {
        if (Z.Util.isNil(this._width) || Z.Util.isNil(this._height)) {
            return 0;
        }
        return this._width * this._height;
    },

    _exportGeoJSONGeometry: function () {
        var coordinates = Z.GeoJSON.toNumberArrays([this.getShell()]);
        return {
            'type' : 'Polygon',
            'coordinates' : coordinates
        };
    },

    _toJSON:function (options) {
        var opts = Z.Util.extend({}, options);
        var nw = this.getCoordinates();
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type' : 'Polygon'
        };
        return {
            'feature'    :  feature,
            'subType'    :  'Rectangle',
            'coordinates': [nw.x, nw.y],
            'width'      : this.getWidth(),
            'height'     : this.getHeight()
        };
    }

});

Z.Rectangle._fromJSON = function (json) {
    var feature = json['feature'];
    var rect = new Z.Rectangle(json['coordinates'], json['width'], json['height'], json['options']);
    rect.setProperties(feature['properties']);
    return rect;
};

/**
 * @classdesc
 * Represents a GeometryCollection.
 * @class
 * @category geometry
 * @extends maptalks.Geometry
 * @param {maptalks.Geometry[]} geometries - GeometryCollection's geometries
 */
Z.GeometryCollection = Z.Geometry.extend(/** @lends maptalks.GeometryCollection.prototype */{
    type:Z.Geometry['TYPE_GEOMETRYCOLLECTION'],

    exceptionDefs:{
        'en-US':{
            'INVALID_GEOMETRY':'invalid geometry for collection.'
        },
        'zh-CN':{
            'INVALID_GEOMETRY':'无效的Geometry被加入到collection中.'
        }
    },

    initialize:function (geometries, opts) {
        this._initOptions(opts);
        this.setGeometries(geometries);
    },

    /**
     * Set new geometries to the geometry collection
     * @param {maptalks.Geometry[]} geometries
     * @return {maptalks.GeometryCollection} this
     */
    setGeometries:function (_geometries) {
        var geometries = this._checkGeometries(_geometries);
        //Set the collection as child geometries' parent.
        if (Z.Util.isArray(geometries)) {
            for (var i = geometries.length - 1; i >= 0; i--) {
                geometries[i]._initOptions(this.config());
                geometries[i]._setParent(this);
                geometries[i].setEventParent(this);
                geometries[i].setSymbol(this.getSymbol());
            }
        }
        this._geometries = geometries;
        if (this.getLayer()) {
            this._bindGeometriesToLayer();
            this._onShapeChanged();
        }
        return this;
    },

    /**
     * Get geometries of the geometry collection
     * @return {maptalks.Geometry[]}
     */
    getGeometries:function () {
        if (!this._geometries) {
            return [];
        }
        return this._geometries;
    },

    /**
     * Travels among the geometries the collection has.
     * @param  {Function} fn - a callback function
     * @param  {*} context   - callback's context
     * @return {maptalks.GeometryCollection} this
     */
    forEach: function (fn, context) {
        var geometries = this.getGeometries();
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            if (!context) {
                fn(geometries[i], i);
            } else {
                fn.call(context, geometries[i], i);
            }
        }
        return this;
    },

    /**
     * creates a GeometryCollection with all elements that pass the test implemented by the provided function.
     * @param  {Function} fn      - Function to test each geometry
     * @param  {*} context        - Function's context
     * @return {maptalks.GeometryCollection} A GeometryCollection with all elements that pass the test
     */
    filter: function () {
        return Z.VectorLayer.prototype.filter.apply(this, arguments);
    },

    /**
     * Translate or move the geometry collection by the given offset.
     * @param  {maptalks.Coordinate} offset - translate offset
     * @return {maptalks.GeometryCollection} this
     */
    translate:function (offset) {
        if (!offset) {
            return this;
        }
        if (this.isEmpty()) {
            return this;
        }
        this.forEach(function (geometry) {
            if (geometry && geometry.translate) {
                geometry.translate(offset);
            }
        });
        return this;
    },

    /**
     * Whether the geometry collection is empty
     * @return {Boolean}
     */
    isEmpty:function () {
        return !Z.Util.isArrayHasData(this.getGeometries());
    },

    /**
     * remove itself from the layer if any.
     * @returns {maptalks.Geometry} this
     * @fires maptalks.Geometry#removestart
     * @fires maptalks.Geometry#remove
     */
    remove:function () {
        this.forEach(function (geometry) {
            geometry._unbind();
        });
        return Z.Geometry.prototype.remove.apply(this, arguments);
    },

    /**
     * Show the geometry collection.
     * @return {maptalks.GeometryCollection} this
     * @fires maptalks.Geometry#show
     */
    show:function () {
        this.options['visible'] = true;
        this.forEach(function (geometry) {
            geometry.show();
        });
        return this;
    },

    /**
     * Hide the geometry collection.
     * @return {maptalks.GeometryCollection} this
     * @fires maptalks.Geometry#hide
     */
    hide:function () {
        this.options['visible'] = false;
        this.forEach(function (geometry) {
            geometry.hide();
        });
        return this;
    },

    setSymbol:function (symbol) {
        symbol = this._prepareSymbol(symbol);
        this._symbol = symbol;
        this.forEach(function (geometry) {
            geometry.setSymbol(symbol);
        });
        this._onSymbolChanged();
        return this;
    },

    onConfig:function (config) {
        this.forEach(function (geometry) {
            geometry.config(config);
        });
    },

    _setExternSymbol:function (symbol) {
        symbol = this._prepareSymbol(symbol);
        this._externSymbol = symbol;
        this.forEach(function (geometry) {
            geometry._setExternSymbol(symbol);
        });
        this._onSymbolChanged();
        return this;
    },

    /**
     * bind this geometry collection to a layer
     * @param  {maptalks.Layer} layer
     * @private
     */
    _bindLayer:function () {
        Z.Geometry.prototype._bindLayer.apply(this, arguments);
        this._bindGeometriesToLayer();
    },

    _bindGeometriesToLayer:function () {
        var layer = this.getLayer();
        this.forEach(function (geometry) {
            geometry._bindLayer(layer);
        });
    },

    /**
     * Check whether the type of geometries is valid
     * @param  {maptalks.Geometry[]} geometries - geometries to check
     * @private
     */
    _checkGeometries:function (geometries) {
        if (geometries && !Z.Util.isArray(geometries)) {
            if (geometries instanceof Z.Geometry) {
                return [geometries];
            } else {
                throw new Error(this.exceptions['INVALID_GEOMETRY']);
            }
        } else if (Z.Util.isArray(geometries)) {
            for (var i = 0, len = geometries.length; i < len; i++) {
                if (!(geometries[i] instanceof Z.Geometry)) {
                    throw new Error(this.exceptions['INVALID_GEOMETRY']);
                }
            }
            return geometries;
        }
        return null;
    },

    _updateCache:function () {
        delete this._extent;
        if (this.isEmpty()) {
            return;
        }
        this.forEach(function (geometry) {
            if (geometry && geometry._updateCache) {
                geometry._updateCache();
            }
        });
    },

    _removePainter:function () {
        if (this._painter) {
            this._painter.remove();
        }
        delete this._painter;
        this.forEach(function (geometry) {
            geometry._removePainter();
        });
    },

    _computeCenter:function (projection) {
        if (!projection || this.isEmpty()) {
            return null;
        }
        var sumX = 0, sumY = 0, counter = 0;
        var geometries = this.getGeometries();
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            var center = geometries[i]._computeCenter(projection);
            if (center) {
                sumX += center.x;
                sumY += center.y;
                counter++;
            }
        }
        if (counter === 0) {
            return null;
        }
        return new Z.Coordinate(sumX / counter, sumY / counter);
    },

    _containsPoint: function (point, t) {
        if (this.isEmpty()) {
            return false;
        }
        var i, len;
        var geometries = this.getGeometries();
        for (i = 0, len = geometries.length; i < len; i++) {
            if (geometries[i]._containsPoint(point, t)) {
                return true;
            }
        }

        return false;
    },

    _computeExtent:function (projection) {
        if (this.isEmpty()) {
            return null;
        }
        var geometries = this.getGeometries();
        var result = null;
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            var geoExtent = geometries[i]._computeExtent(projection);
            if (geoExtent) {
                result = geoExtent.combine(result);
            }
        }
        return result;
    },



    _computeGeodesicLength:function (projection) {
        if (!projection || this.isEmpty()) {
            return 0;
        }
        var geometries = this.getGeometries();
        var result = 0;
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            result += geometries[i]._computeGeodesicLength(projection);
        }
        return result;
    },

    _computeGeodesicArea:function (projection) {
        if (!projection || this.isEmpty()) {
            return 0;
        }
        var geometries = this.getGeometries();
        var result = 0;
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            result += geometries[i]._computeGeodesicArea(projection);
        }
        return result;
    },


    _exportGeoJSONGeometry:function () {
        var geoJSON = [];
        if (!this.isEmpty()) {
            var geometries = this.getGeometries();
            for (var i = 0, len = geometries.length; i < len; i++) {
                if (!geometries[i]) {
                    continue;
                }
                geoJSON.push(geometries[i]._exportGeoJSONGeometry());
            }
        }
        return {
            'type':         'GeometryCollection',
            'geometries':   geoJSON
        };
    },

    _clearProjection:function () {
        if (this.isEmpty()) {
            return;
        }
        var geometries = this.getGeometries();
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            geometries[i]._clearProjection();
        }

    },

    /**
     * Get connect points if being connected by [ConnectorLine]{@link maptalks.ConnectorLine}
     * @private
     * @return {maptalks.Coordinate[]}
     */
    _getConnectPoints: function () {
        var extent = this.getExtent();
        var anchors = [
            new Z.Coordinate(extent.xmin, extent.ymax),
            new Z.Coordinate(extent.xmax, extent.ymin),
            new Z.Coordinate(extent.xmin, extent.ymin),
            new Z.Coordinate(extent.xmax, extent.ymax)
        ];
        return anchors;
    },

//----------覆盖Geometry中的编辑相关方法-----------------


    startEdit:function (opts) {
        if (this.isEmpty()) {
            return this;
        }
        if (!opts) {
            opts = {};
        }
        if (opts['symbol']) {
            this._originalSymbol = this.getSymbol();
            this.setSymbol(opts['symbol']);
        }
        this._draggbleBeforeEdit = this.options['draggable'];
        this.config('draggable', false);
        var geometries = this.getGeometries();
        for (var i = 0, len = geometries.length; i < len; i++) {
            geometries[i].startEdit(opts);
        }
        this._editing = true;
        this.hide();
        var me = this;
        setTimeout(function () {
            me.fire('editstart');
        }, 1);
        return this;
    },


    endEdit:function () {
        if (this.isEmpty()) {
            return this;
        }
        var geometries = this.getGeometries();
        for (var i = 0, len = geometries.length; i < len; i++) {
            geometries[i].endEdit();
        }
        if (this._originalSymbol) {
            this.setSymbol(this._originalSymbol);
            delete this._originalSymbol;
        }
        this._editing = false;
        this.show();
        this.config('draggable', this._draggbleBeforeEdit);
        this.fire('editend');
        return this;
    },


    isEditing:function () {
        if (!this._editing) {
            return false;
        }
        return true;
    }
});

/**
 * Common methods for MultiPoint, MultiLineString and MultiPolygon
 * @mixin maptalks.Geometry.MultiPoly
 */
Z.Geometry.MultiPoly = {
    /**
     * Get coordinates of the collection
     * @return {maptalks.Coordinate[]|maptalks.Coordinate[][]|maptalks.Coordinate[][][]} coordinates
     */
    getCoordinates:function () {
        var coordinates = [];
        var geometries = this.getGeometries();
        if (!Z.Util.isArray(geometries)) {
            return null;
        }
        for (var i = 0, len = geometries.length; i < len; i++) {
            coordinates.push(geometries[i].getCoordinates());
        }
        return coordinates;
    },

    /**
     * Set new coordinates to the collection
     * @param {maptalks.Coordinate[]|maptalks.Coordinate[][]|maptalks.Coordinate[][][]} coordinates
     * @returns {maptalks.Geometry} this
     * @fires maptalk.Geometry#shapechange
     */
    setCoordinates:function (coordinates) {
        if (Z.Util.isArrayHasData(coordinates)) {
            var geometries = [];
            for (var i = 0, len = coordinates.length; i < len; i++) {
                var p = new this.GeometryType(coordinates[i], this.config());
                geometries.push(p);
            }
            this.setGeometries(geometries);
        } else {
            this.setGeometries([]);
        }
        return this;
    },

    _initData:function (data) {
        if (Z.Util.isArrayHasData(data)) {
            if (data[0] instanceof this.GeometryType) {
                this.setGeometries(data);
            } else {
                this.setCoordinates(data);
            }
        }
    },

    _checkGeometries:function (geometries) {
        if (Z.Util.isArray(geometries)) {
            for (var i = 0, len = geometries.length; i < len; i++) {
                if (geometries[i] && !(geometries[i] instanceof this.GeometryType)) {
                    throw new Error(this.exceptions['INVALID_GEOMETRY_IN_COLLECTION'] + i);
                }
            }
        }
        return geometries;
    },

    //override _exportGeoJSONGeometry in GeometryCollection
    _exportGeoJSONGeometry:function () {
        var points = this.getCoordinates();
        var coordinates = Z.GeoJSON.toNumberArrays(points);
        return {
            'type':this.getType(),
            'coordinates': coordinates
        };
    }
};

/**
 * @classdesc
 * Represents a Geometry type of MultiPoint.
 * @class
 * @category geometry
 * @extends maptalks.GeometryCollection
 * @mixes maptalks.Geometry.MultiPoly
 * @param {Number[][]|maptalks.Coordinate[]|maptalks.Marker[]} data - construct data, coordinates or a array of markers
 * @param {Object} [options=null]           - specific construct options for MultiPoint, also support options defined in [Geometry]{@link maptalks.Geometry#options}
 * @param {Object} [options.symbol=object]  - default symbol of the MultiPoint.
 */
Z.MultiPoint = Z.GeometryCollection.extend(/** @lends maptalks.MultiPoint.prototype */{
    includes:[Z.Geometry.MultiPoly],

    GeometryType:Z.Marker,

    /**
     * @property {String} type - MultiPoint
     * @static
     */
    type:Z.Geometry['TYPE_MULTIPOINT'],

    initialize:function (data, opts) {
        this._initOptions(opts);
        this._initData(data);
    }
});

/**
 * @classdesc
 * Represents a Geometry type of MultiLineString
 * @class
 * @category geometry
 * @extends maptalks.GeometryCollection
 * @mixes maptalks.Geometry.MultiPoly
 * @param {Number[][][]|maptalks.Coordinate[][]|maptalks.LineString[]} data - construct data, coordinates or a array of linestrings
 * @param {Object} [options=null]           - options defined in [Geometry]{@link maptalks.Geometry#options}
 */
Z.MultiLineString = Z.MultiPolyline = Z.GeometryCollection.extend(/** @lends maptalks.MultiLineString.prototype */{

    includes:[Z.Geometry.MultiPoly],

    GeometryType:Z.Polyline,

    type:Z.Geometry['TYPE_MULTILINESTRING'],

    initialize:function (data, opts) {
        this._initOptions(opts);
        this._initData(data);
    }
});

/**
 * @classdesc
 * Represents a Geometry type of MultiPolygon
 * @class
 * @category geometry
 * @category geometry
 * @extends maptalks.GeometryCollection
 * @mixes maptalks.Geometry.MultiPoly
 * @param {Number[][][][]|maptalks.Coordinate[][][]|maptalks.Polygon[]} data - construct data, coordinates or a array of polygons
 * @param {Object} [options=null]           - options defined in [Geometry]{@link maptalks.Geometry#options}
 */
Z.MultiPolygon = Z.GeometryCollection.extend(/** @lends maptalks.MultiPolygon.prototype */{
    includes:[Z.Geometry.MultiPoly],
    GeometryType:Z.Polygon,

    type:Z.Geometry['TYPE_MULTIPOLYGON'],

    initialize:function (data, opts) {
        this._initOptions(opts);
        this._initData(data);
    }
});

/**
 * GeoJSON utilities
 * @class
 * @category geometry
*  @memberOf maptalks
 * @name GeoJSON
 */
Z.GeoJSON = {

    /**
     * Convert one or more GeoJSON objects to a geometry
     * @param  {String|Object|Object[]} json - json objects or json string
     * @return {maptalks.Geometry|maptalks.Geometry[]}
     */
    toGeometry:function (geoJSON) {
        if (Z.Util.isString(geoJSON)) {
            geoJSON = Z.Util.parseJSON(geoJSON);
        }
        if (Z.Util.isArray(geoJSON)) {
            var resultGeos = [];
            for (var i = 0, len = geoJSON.length; i < len; i++) {
                var geo = this._convert(geoJSON[i]);
                if (Z.Util.isArray(geo)) {
                    resultGeos = resultGeos.concat(geo);
                } else {
                    resultGeos.push(geo);
                }
            }
            return resultGeos;
        } else {
            var resultGeo = this._convert(geoJSON);
            return resultGeo;
        }

    },

    /**
     * Convert one or more maptalks.Coordinate objects to GeoJSON style coordinates
     * @param  {maptalks.Coordinate|maptalks.Coordinate[]} coordinates - coordinates to convert
     * @return {Number[]|Number[][]}
     * @example
     * // result is [[100,0], [101,1]]
     * var jsonCoords = maptalks.GeoJSON.toNumberArrays([new maptalks.Coordinate(100,0), new maptalks.Coordinate(101,1)]);
     */
    toNumberArrays:function (coordinates) {
        if (!Z.Util.isArray(coordinates)) {
            return [coordinates.x, coordinates.y];
        }
        return Z.Util.mapArrayRecursively(coordinates, function (coord) {
            return [coord.x, coord.y];
        });
    },

    /**
     * Convert one or more GeoJSON style coordiantes to maptalks.Coordinate objects
     * @param  {Number[]|Number[][]} coordinates - coordinates to convert
     * @return {maptalks.Coordinate|maptalks.Coordinate[]}
     */
    toCoordinates:function (coordinates) {
        if (Z.Util.isNumber(coordinates[0]) && Z.Util.isNumber(coordinates[1])) {
            return new Z.Coordinate(coordinates);
        }
        var result = [];
        for (var i = 0, len = coordinates.length; i < len; i++) {
            var child = coordinates[i];
            if (Z.Util.isArray(child)) {
                if (Z.Util.isNumber(child[0])) {
                    result.push(new Z.Coordinate(child));
                } else {
                    result.push(this.toCoordinates(child));
                }
            } else {
                result.push(new Z.Coordinate(child));
            }
        }
        return result;
    },

    /**
     * Convert single GeoJSON object
     * @param  {Object} geoJSONObj - a GeoJSON object
     * @return {maptalks.Geometry}
     * @private
     */
    _convert:function (json) {
        if (!json || Z.Util.isNil(json['type'])) {
            return null;
        }
        var options = {};

        var type = json['type'];
        if (type === 'Feature') {
            var g = json['geometry'];
            var geometry = this._convert(g);
            if (!geometry) {
                return null;
            }
            geometry.setId(json['id']);
            geometry.setProperties(json['properties']);
            return geometry;
        } else if (type === 'FeatureCollection') {
            var features = json['features'];
            if (!features) {
                return null;
            }
            //返回geometry数组
            var result = Z.GeoJSON.toGeometry(features);
            return result;
        } else if (Z.Util.indexOfArray(type,
            ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon']) >= 0) {
            var clazz = (type === 'Point' ? 'Marker' : type);
            return new Z[clazz](json['coordinates'], options);
        } else if (type === 'GeometryCollection') {
            var geometries = json['geometries'];
            if (!Z.Util.isArrayHasData(geometries)) {
                return new Z.GeometryCollection();
            }
            var mGeos = [];
            var size = geometries.length;
            for (var i = 0; i < size; i++) {
                mGeos.push(this._convert(geometries[i]));
            }
            return new Z.GeometryCollection(mGeos, options);
        } else if (type === 'Circle') {
            return new Z.Circle(json['coordinates'], json['radius'], options);
        } else if (type === 'Ellipse' || type === 'Rectangle') {
            return new Z[type](json['coordinates'], json['width'], json['height'], options);
        } else if (type === 'Sector') {
            return new Z.Sector(json['coordinates'], json['radius'], json['startAngle'], json['endAngle'], options);
        }
        return null;
    }
};

/**
 * Geometry editor used internally for geometry editing.
 * @class
 * @category geometry
 * @protected
 * @extends maptalks.Class
 * @mixes maptalks.Eventable
 * @param {maptalks._shadow} geometry 待编辑图形
 * @param {Object} opts 属性
 */
Z.GeometryEditor = Z.Class.extend(/** @lends maptalks.GeometryEditor.prototype */{
    includes: [Z.Eventable],

    editStageLayerIdPrefix : Z.internalLayerPrefix + '_edit_stage_',

    initialize:function (geometry, opts) {
        this._geometry = geometry;
        if (!this._geometry) { return; }
        Z.Util.setOptions(this, opts);
    },

    getMap:function () {
        return this._geometry.getMap();
    },

    prepare:function () {
        var map = this.getMap();
        if (!map) { return; }
        /**
         * 保存原有的symbol
         */
        if (this.options['symbol']) {
            this._originalSymbol = this._geometry.getSymbol();
            this._geometry.setSymbol(this.options['symbol']);
        }

        this._prepareEditStageLayer();
    },

    _prepareEditStageLayer:function () {
        var map = this.getMap();
        var guid = Z.Util.GUID();
        this._editStageLayer = map.getLayer(this.editStageLayerIdPrefix + guid);
        if (!this._editStageLayer) {
            this._editStageLayer = new Z.VectorLayer(this.editStageLayerIdPrefix + guid, {'drawImmediate' : true});
            map.addLayer(this._editStageLayer);
        }
    },

    /**
     * 开始编辑
     */
    start:function () {
        if (!this._geometry || !this._geometry.getMap() || this._geometry.editing) { return; }
        this.editing = true;
        var geometry = this._geometry;
        this._geometryDraggble = geometry.options['draggable'];
        geometry.config('draggable', false);
        this.prepare();
        //edits are applied to a shadow of geometry to improve performance.
        var shadow = geometry.copy();
        //geometry copy没有将event复制到新建的geometry,对于编辑这个功能会存在一些问题
        //原geometry上可能绑定了其它监听其click/dragging的事件,在编辑时就无法响应了.
        shadow.copyEventListeners(geometry);
        if (geometry._getParent()) {
            shadow.copyEventListeners(geometry._getParent());
        }
        //drag shadow by center handle instead.
        shadow.setId(null).config({'draggable': false});

        this._shadow = shadow;
        geometry.hide();
        if (geometry instanceof Z.Marker ||
                geometry instanceof Z.Circle ||
                geometry instanceof Z.Rectangle ||
                geometry instanceof Z.Ellipse) {
            //ouline has to be added before shadow to let shadow on top of it, otherwise shadow's events will be overrided by outline
            this._createOrRefreshOutline();
        }
        this._editStageLayer.bringToFront().addGeometry(shadow);
        if (!(geometry instanceof Z.Marker)) {
            this._createCenterHandle();
        } else {
            shadow.config('draggable', true);
            shadow.on('dragend', this._onShadowDragEnd, this);
        }
        if (geometry instanceof Z.Marker) {
            this.createMarkerEditor();
        } else if (geometry instanceof Z.Circle) {
            this.createCircleEditor();
        } else if (geometry instanceof Z.Rectangle) {
            this.createEllipseOrRectEditor();
        } else if (geometry instanceof Z.Ellipse) {
            this.createEllipseOrRectEditor();
        } else if (geometry instanceof Z.Sector) {
            // TODO: createSectorEditor
        } else if ((geometry instanceof Z.Polygon) ||
                   (geometry instanceof Z.Polyline)) {
            this.createPolygonEditor();
        }

    },

    /**
     * 结束编辑
     * @return {*} [description]
     */
    stop:function () {
        var map = this.getMap();
        if (!map) {
            return;
        }
        if (this._shadow) {
            this._update();
            this._shadow._clearAllListeners();
            this._shadow.remove();
            delete this._shadow;
        }
        this._geometry.config('draggable', this._geometryDraggble);
        delete this._geometryDraggble;
        this._geometry.show();

        this._editStageLayer.remove();
        if (Z.Util.isArrayHasData(this._eventListeners)) {
            for (var i = this._eventListeners.length - 1; i >= 0; i--) {
                var listener = this._eventListeners[i];
                listener[0].off(listener[1], listener[2], this);
            }
            this._eventListeners = [];
        }
        this._refreshHooks = [];
        if (this.options['symbol']) {
            this._geometry.setSymbol(this._originalSymbol);
            delete this._originalSymbol;
        }
        this.editing = false;
    },

    isEditing:function () {
        if (Z.Util.isNil(this.editing)) {
            return false;
        }
        return this.editing;
    },

    _onShadowDragEnd:function () {
        this._update();
        this._refresh();
    },

    _update:function () {
        //update geographical properties from shadow to geometry
        this._geometry.setCoordinates(this._shadow.getCoordinates());
        if (this._geometry.getRadius) {
            this._geometry.setRadius(this._shadow.getRadius());
        }
        if (this._geometry.getWidth) {
            this._geometry.setWidth(this._shadow.getWidth());
        }
        if (this._geometry.getHeight) {
            this._geometry.setHeight(this._shadow.getHeight());
        }
        if (this._geometry.getStartAngle) {
            this._geometry.setStartAngle(this._shadow.getStartAngle());
        }
        if (this._geometry.getEndAngle) {
            this._geometry.setEndAngle(this._shadow.getEndAngle());
        }
    },

    _updateAndFireEvent:function (eventName) {
        if (!this._shadow) {
            return;
        }
        this._update();
        this._geometry.fire(eventName);
    },

    /**
     * create rectangle outline of the geometry
     */
    _createOrRefreshOutline:function () {
        var geometry = this._geometry,
            map = this.getMap(),
            outline = this._editOutline;

        var pixelExtent = geometry._getPainter().getViewExtent(),
            size = pixelExtent.getSize();
        var nw = map.viewPointToCoordinate(pixelExtent.getMin());
        var width = map.pixelToDistance(size['width'], 0),
            height = map.pixelToDistance(0, size['height']);
        if (!outline) {
            outline = new Z.Rectangle(nw, width, height, {
                'symbol':{
                    'lineWidth' : 1,
                    'lineColor' : '6b707b'
                }
            });
            this._editStageLayer.addGeometry(outline);
            this._editOutline = outline;
            this._addRefreshHook(this._createOrRefreshOutline);
        } else {
            outline.setCoordinates(nw);
            outline.setWidth(width);
            outline.setHeight(height);
        }

        return outline;
    },


    _createCenterHandle:function () {
        var me = this;
        var center = this._shadow.getCenter();
        var shadow;
        var handle = me.createHandle(center, {
            'markerType' : 'ellipse',
            'dxdy'       : new Z.Point(0, 0),
            'cursor'     : 'move',
            onDown:function () {
                shadow = this._shadow.copy();
                var symbol = Z.Util.decreaseSymbolOpacity(shadow._getInternalSymbol(), 0.5);
                shadow.setSymbol(symbol).addTo(this._editStageLayer);
            },
            onMove:function (v, param) {
                var dragOffset = param['dragOffset'];
                if (shadow) {
                    shadow.translate(dragOffset);
                    this._geometry.translate(dragOffset);
                }
            },
            onUp:function () {
                if (shadow) {
                    this._shadow.setCoordinates(this._geometry.getCoordinates());
                    shadow.remove();
                    me._refresh();
                }
            }
        });
        this._addRefreshHook(function () {
            var center = this._shadow.getCenter();
            handle.setCoordinates(center);
        });
    },

    _createHandleInstance:function (coordinate, opts) {
        var symbol = {
            'markerType'        : opts['markerType'],
            'markerFill'        : '#ffffff', //"#d0d2d6",
            'markerLineColor'   : '#000000',
            'markerLineWidth'   : 2,
            'markerWidth'       : 10,
            'markerHeight'      : 10,
            'markerDx'          : opts['dxdy'].x,
            'markerDy'          : opts['dxdy'].y
        };
        if (opts['symbol']) {
            Z.Util.extend(symbol, opts['symbol']);
        }
        var handle = new Z.Marker(coordinate, {
            'draggable' : true,
            'dragShadow' : false,
            'draggableAxis' : opts['axis'],
            'cursor'    : opts['cursor'],
            'symbol'    : symbol
        });
        return handle;
    },

    createHandle:function (coordinate, opts) {
        if (!opts) {
            opts = {};
        }
        var map = this.getMap();
        var handle = this._createHandleInstance(coordinate, opts);
        var me = this;
        function onHandleDragstart(param) {
            if (opts.onDown) {
                opts.onDown.call(me, param['viewPoint'], param);
            }
        }
        function onHandleDragging(param) {
            me._hideContext();
            var viewPoint = map._prjToViewPoint(handle._getPrjCoordinates());
            if (opts.onMove) {
                opts.onMove.call(me, viewPoint, param);
            }
        }
        function onHandleDragEnd(ev) {
            if (opts.onUp) {
                opts.onUp.call(me, ev);
            }
        }
        handle.on('dragstart', onHandleDragstart, this);
        handle.on('dragging', onHandleDragging, this);
        handle.on('dragend', onHandleDragEnd, this);
        //拖动移图
        if (opts.onRefresh) {
            handle['maptalks--editor-refresh-fn'] = opts.onRefresh;
        }
        this._editStageLayer.addGeometry(handle);
        return handle;
    },

    /**
     * create resize handles for geometry that can resize.
     * @param {Array} blackList handle indexes that doesn't display, to prevent change a geometry's coordinates
     * @param {fn} onHandleMove callback
     */
    _createResizeHandles:function (blackList, onHandleMove) {
        //cursor styles.
        var cursors = [
            'nw-resize', 'n-resize', 'ne-resize',
            'w-resize',            'e-resize',
            'sw-resize', 's-resize', 'se-resize'
        ];
        //defines draggableAxis of resize handle
        var axis = [
            null, 'y', null,
            'x',       'x',
            null, 'y', null
        ];
        var geometry = this._geometry;
        function getResizeAnchors(ext) {
            return [
                ext.getMin(),
                new Z.Point((ext['xmax'] + ext['xmin']) / 2, ext['ymin']),
                new Z.Point(ext['xmax'], ext['ymin']),
                new Z.Point(ext['xmin'], (ext['ymax'] + ext['ymin']) / 2),
                new Z.Point(ext['xmax'], (ext['ymax'] + ext['ymin']) / 2),
                new Z.Point(ext['xmin'], ext['ymax']),
                new Z.Point((ext['xmax'] + ext['xmin']) / 2, ext['ymax']),
                ext.getMax()
            ];
        }
        if (!blackList) {
            blackList = [];
        }
        var resizeHandles = [];
        var anchorIndexes = {};
        var me = this, map = this.getMap();
        var fnLocateHandles = function () {
            var pExt = geometry._getPainter().getViewExtent(),
                anchors = getResizeAnchors(pExt);
            for (var i = 0; i < anchors.length; i++) {
                //ignore anchors in blacklist
                if (Z.Util.isArrayHasData(blackList)) {
                    var isBlack = false;
                    for (var ii = blackList.length - 1; ii >= 0; ii--) {
                        if (blackList[ii] === i) {
                            isBlack = true;
                            break;
                        }
                    }
                    if (isBlack) {
                        continue;
                    }
                }
                var anchor = anchors[i],
                    coordinate = map.viewPointToCoordinate(anchor);
                if (resizeHandles.length < anchors.length - blackList.length) {
                    var handle = me.createHandle(coordinate, {
                        'markerType' : 'square',
                        'dxdy'       : new Z.Point(0, 0),
                        'cursor'     : cursors[i],
                        'axis'       : axis[i],
                        onMove:(function (_index) {
                            return function (handleViewPoint) {
                                onHandleMove(handleViewPoint, _index);
                            };
                        })(i),
                        onUp:function () {
                            me._refresh();
                        }
                    });
                    handle.setId(i);
                    anchorIndexes[i] = resizeHandles.length;
                    resizeHandles.push(handle);
                } else {
                    resizeHandles[anchorIndexes[i]].setCoordinates(coordinate);
                }
            }

        };

        fnLocateHandles();
        //refresh hooks to refresh handles' coordinates
        this._addRefreshHook(fnLocateHandles);
        return resizeHandles;
    },

    /**
     * 标注和自定义标注编辑器
     */
    createMarkerEditor:function () {

        var marker = this._shadow,
            geometryToEdit = this._geometry,
            map = this.getMap(),
            resizeHandles;
        function onZoomStart() {
            if (Z.Util.isArrayHasData(resizeHandles)) {
                for (var i = resizeHandles.length - 1; i >= 0; i--) {
                    resizeHandles[i].hide();
                }
            }
            if (this._editOutline) {
                this._editOutline.hide();
            }
        }
        function onZoomEnd() {
            this._refresh();
            if (Z.Util.isArrayHasData(resizeHandles)) {
                for (var i = resizeHandles.length - 1; i >= 0; i--) {
                    resizeHandles[i].show();
                }
            }
            if (this._editOutline) {
                this._editOutline.show();
            }
        }
        if (!marker._canEdit()) {
            console.warn('A marker can\'t be resized with symbol:', marker.getSymbol());
            return;
        }
        //only image marker and vector marker can be edited now.

        var symbol = marker._getInternalSymbol();
        var dxdy = new Z.Point(0, 0);
        if (Z.Util.isNumber(symbol['markerDx'])) {
            dxdy.x = symbol['markerDx'];
        }
        if (Z.Util.isNumber(symbol['markerDy'])) {
            dxdy.y = symbol['markerDy'];
        }

        var blackList = null;

        if (Z.symbolizer.VectorMarkerSymbolizer.test(symbol)) {
            if (symbol['markerType'] === 'pin' || symbol['markerType'] === 'pie' || symbol['markerType'] === 'bar') {
                //as these types of markers' anchor stands on its bottom
                blackList = [5, 6, 7];
            }
        } else if (Z.symbolizer.ImageMarkerSymbolizer.test(symbol) ||
                    Z.symbolizer.VectorPathMarkerSymbolizer.test(symbol)) {
            blackList = [5, 6, 7];
        }

        //defines what can be resized by the handle
        //0: resize width; 1: resize height; 2: resize both width and height.
        var resizeAbilities = [
            2, 1, 2,
            0,    0,
            2, 1, 2
        ];

        resizeHandles = this._createResizeHandles(null, function (handleViewPoint, i) {
            if (blackList && Z.Util.indexOfArray(i, blackList) >= 0) {
                //need to change marker's coordinates
                var newCoordinates = map.viewPointToCoordinate(handleViewPoint);
                var coordinates = marker.getCoordinates();
                newCoordinates.x = coordinates.x;
                marker.setCoordinates(newCoordinates);
                geometryToEdit.setCoordinates(newCoordinates);
                //coordinates changed, and use mirror handle instead to caculate width and height
                var mirrorHandle = resizeHandles[resizeHandles.length - 1 - i];
                var mirrorViewPoint = map.coordinateToViewPoint(mirrorHandle.getCoordinates());
                handleViewPoint = mirrorViewPoint;
            }

            //caculate width and height
            var viewCenter = marker._getCenterViewPoint().add(dxdy),
                symbol = marker._getInternalSymbol();
            var wh = handleViewPoint.substract(viewCenter);
            //if this marker's anchor is on its bottom, height doesn't need to multiply by 2.
            var r = blackList ? 1 : 2;
            var width = Math.abs(wh.x) * 2,
                height = Math.abs(wh.y) * r;
            var ability = resizeAbilities[i];
            if (ability === 0 || ability === 2) {
                symbol['markerWidth'] = width;
            }
            if (ability === 1 || ability === 2) {
                symbol['markerHeight'] = height;
            }
            marker.setSymbol(symbol);
            geometryToEdit.setSymbol(symbol);
        });
        this._addListener([map, 'zoomstart', onZoomStart]);
        this._addListener([map, 'zoomend', onZoomEnd]);

    },

    /**
     * 圆形编辑器
     * @return {*} [description]
     */
    createCircleEditor:function () {
        var shadow = this._shadow,
            circle = this._geometry;
        var map = this.getMap();
        this._createResizeHandles(null, function (handleViewPoint) {
            var viewCenter = shadow._getCenterViewPoint();
            var wh = handleViewPoint.substract(viewCenter);
            var w = Math.abs(wh.x),
                h = Math.abs(wh.y);
            var r;
            if (w > h) {
                r = map.pixelToDistance(w, 0);
            } else {
                r = map.pixelToDistance(0, h);
            }
            shadow.setRadius(r);
            circle.setRadius(r);
        });
    },

    /**
     * editor of ellipse or rectangle
     * @return {*} [description]
     */
    createEllipseOrRectEditor:function () {
        //defines what can be resized by the handle
        //0: resize width; 1: resize height; 2: resize both width and height.
        var resizeAbilities = [
            2, 1, 2,
            0,    0,
            2, 1, 2
        ];
        var shadow = this._shadow,
            geometryToEdit = this._geometry;
        var map = this.getMap();
        //handles in blackList will change geometry's coordinates
        var blackList = null;
        var isRect = this._geometry instanceof Z.Rectangle;
        if (isRect) {
            //resize handles to hide for rectangle
            blackList = [0, 1, 2, 3, 5];
        }
        var resizeHandles = this._createResizeHandles(null, function (handleViewPoint, i) {
            var viewCenter;
            //ratio of width and height
            var r;
            if (isRect) {
                //change rectangle's coordinates
                if (blackList && Z.Util.indexOfArray(i, blackList) >= 0) {
                    var coordinates = shadow.getCoordinates(),
                        handleCoordinates = map.viewPointToCoordinate(handleViewPoint);
                    var newCoordinates;
                    var mirrorHandle = resizeHandles[7];
                    var mirrorViewPoint = map.coordinateToViewPoint(mirrorHandle.getCoordinates());
                    switch (i) {
                    case 0:
                        newCoordinates = handleCoordinates;
                        break;
                    case 1:
                        newCoordinates = new Z.Coordinate(coordinates.x, handleCoordinates.y);
                        break;
                    case 2:
                        newCoordinates = new Z.Coordinate(coordinates.x, handleCoordinates.y);
                        mirrorViewPoint = new Z.Point(handleViewPoint.x, mirrorViewPoint.y);
                        break;
                    case 3:
                        newCoordinates = new Z.Coordinate(handleCoordinates.x, coordinates.y);
                        break;
                    case 5:
                        newCoordinates = new Z.Coordinate(handleCoordinates.x, coordinates.y);
                        mirrorViewPoint = new Z.Point(mirrorViewPoint.x, handleViewPoint.y);
                        break;
                    default:
                        newCoordinates = null;
                    }
                    shadow.setCoordinates(newCoordinates);
                    geometryToEdit.setCoordinates(newCoordinates);

                    handleViewPoint = mirrorViewPoint;
                }
                r = 1;
                viewCenter = map._prjToViewPoint(shadow._getPrjCoordinates());
            } else {
                r = 2;
                viewCenter = shadow._getCenterViewPoint();
            }
            var wh = handleViewPoint.substract(viewCenter);
            var ability = resizeAbilities[i];
            var w = map.pixelToDistance(Math.abs(wh.x), 0);
            var h = map.pixelToDistance(0, Math.abs(wh.y));
            if (ability === 0 || ability === 2) {
                shadow.setWidth(w * r);
                geometryToEdit.setWidth(w * r);
            }
            if (ability === 1 || ability === 2) {
                shadow.setHeight(h * r);
                geometryToEdit.setHeight(h * r);
            }
            // me._updateAndFireEvent('shapechange');
        });
    },

    /**
     * 多边形和多折线的编辑器
     * @return {*} [description]
     */
    createPolygonEditor:function () {

        var map = this.getMap(),
            shadow = this._shadow,
            me = this,
            projection = map.getProjection();
        var verticeLimit = shadow instanceof Z.Polygon ? 3 : 2;
        var propertyOfVertexRefreshFn = 'maptalks--editor-refresh-fn',
            propertyOfVertexIndex = 'maptalks--editor-vertex-index';
        var vertexHandles = [],
            newVertexHandles = [];
        function getVertexCoordinates() {
            if (shadow instanceof Z.Polygon) {
                var coordinates = shadow.getCoordinates()[0];
                return coordinates.slice(0, coordinates.length - 1);
            } else {
                return shadow.getCoordinates();
            }

        }
        function getVertexPrjCoordinates() {
            return shadow._getPrjCoordinates();
        }
        function onVertexAddOrRemove() {
            //restore index property of each handles.
            var i;
            for (i = vertexHandles.length - 1; i >= 0; i--) {
                vertexHandles[i][propertyOfVertexIndex] = i;
            }
            for (i = newVertexHandles.length - 1; i >= 0; i--) {
                newVertexHandles[i][propertyOfVertexIndex] = i;
            }
        }

        function removeVertex(param) {
            var handle = param['target'],
                index = handle[propertyOfVertexIndex];
            var prjCoordinates = getVertexPrjCoordinates();
            if (prjCoordinates.length <= verticeLimit) {
                return;
            }
            prjCoordinates.splice(index, 1);
            shadow._setPrjCoordinates(prjCoordinates);
            shadow._updateCache();
            //remove vertex handle
            vertexHandles.splice(index, 1)[0].remove();
            //remove two neighbor "new vertex" handles
            if (index < newVertexHandles.length) {
                newVertexHandles.splice(index, 1)[0].remove();
            }
            var nextIndex;
            if (index === 0) {
                nextIndex = newVertexHandles.length - 1;
            } else {
                nextIndex = index - 1;
            }
            newVertexHandles.splice(nextIndex, 1)[0].remove();
            //add a new "new vertex" handle.
            newVertexHandles.splice(nextIndex, 0, createNewVertexHandle.call(me, nextIndex));
            onVertexAddOrRemove();
        }
        function moveVertexHandle(handleViewPoint, index) {
            var vertice = getVertexPrjCoordinates();
            var nVertex = map._viewPointToPrj(handleViewPoint);
            var pVertex = vertice[index];
            pVertex.x = nVertex.x;
            pVertex.y = nVertex.y;
            shadow._updateCache();
            shadow._onShapeChanged();
            var nextIndex;
            if (index === 0) {
                nextIndex = newVertexHandles.length - 1;
            } else {
                nextIndex = index - 1;
            }
            //refresh two neighbor "new vertex" handles.
            if (newVertexHandles[index]) {
                newVertexHandles[index][propertyOfVertexRefreshFn]();
            }
            if (newVertexHandles[nextIndex]) {
                newVertexHandles[nextIndex][propertyOfVertexRefreshFn]();
            }

            me._updateAndFireEvent('shapechange');
        }
        function createVertexHandle(index) {
            var vertex = getVertexCoordinates()[index];
            var handle = me.createHandle(vertex, {
                'markerType' : 'square',
                'dxdy'       : new Z.Point(0, 0),
                'cursor'     : 'pointer',
                'axis'       : null,
                onMove:function (handleViewPoint) {
                    moveVertexHandle(handleViewPoint, handle[propertyOfVertexIndex]);
                },
                onRefresh:function () {
                    vertex = getVertexCoordinates()[handle[propertyOfVertexIndex]];
                    handle.setCoordinates(vertex);
                },
                onUp:function () {
                    me._refresh();
                }
            });
            handle[propertyOfVertexIndex] = index;
            handle.on('contextmenu', removeVertex);
            return handle;
        }
        function createNewVertexHandle(index) {
            var vertexCoordinates = getVertexCoordinates();
            var nextVertex;
            if (index + 1 >= vertexCoordinates.length) {
                nextVertex = vertexCoordinates[0];
            } else {
                nextVertex = vertexCoordinates[index + 1];
            }
            var vertex = vertexCoordinates[index].add(nextVertex).multi(1 / 2);
            var handle = me.createHandle(vertex, {
                'markerType' : 'square',
                'symbol'     : {'opacity' : 0.4},
                'dxdy'       : new Z.Point(0, 0),
                'cursor'     : 'pointer',
                'axis'       : null,
                onDown:function () {
                    var prjCoordinates = getVertexPrjCoordinates();
                    var vertexIndex = handle[propertyOfVertexIndex];
                    //add a new vertex
                    var pVertex = projection.project(handle.getCoordinates());
                    //update shadow's vertice
                    prjCoordinates.splice(vertexIndex + 1, 0, pVertex);
                    shadow._setPrjCoordinates(prjCoordinates);
                    shadow._updateCache();

                    var symbol = handle.getSymbol();
                    delete symbol['opacity'];
                    handle.setSymbol(symbol);

                    //add two "new vertex" handles
                    newVertexHandles.splice(vertexIndex, 0, createNewVertexHandle.call(me, vertexIndex), createNewVertexHandle.call(me, vertexIndex + 1));
                    me._updateAndFireEvent('shapechange');
                },
                onMove:function (handleViewPoint) {
                    moveVertexHandle(handleViewPoint, handle[propertyOfVertexIndex] + 1);
                },
                onUp:function () {
                    var vertexIndex = handle[propertyOfVertexIndex];
                    //remove this handle
                    Z.Util.removeFromArray(handle, newVertexHandles);
                    handle.remove();
                    //add a new vertex handle
                    vertexHandles.splice(vertexIndex + 1, 0, createVertexHandle.call(me, vertexIndex + 1));
                    onVertexAddOrRemove();
                },
                onRefresh:function () {
                    vertexCoordinates = getVertexCoordinates();
                    var vertexIndex = handle[propertyOfVertexIndex];
                    var nextIndex;
                    if (vertexIndex === vertexCoordinates.length - 1) {
                        nextIndex = 0;
                    } else {
                        nextIndex = vertexIndex + 1;
                    }
                    var refreshVertex = vertexCoordinates[vertexIndex].add(vertexCoordinates[nextIndex]).multi(1 / 2);
                    handle.setCoordinates(refreshVertex);
                }
            });
            handle[propertyOfVertexIndex] = index;
            return handle;
        }
        var vertexCoordinates = getVertexCoordinates();
        for (var i = 0, len = vertexCoordinates.length; i < len; i++) {
            vertexHandles.push(createVertexHandle.call(this, i));
            if (i < len - 1) {
                newVertexHandles.push(createNewVertexHandle.call(this, i));
            }
        }
        if (shadow instanceof Z.Polygon) {
            //1 more vertex handle for polygon
            newVertexHandles.push(createNewVertexHandle.call(this, vertexCoordinates.length - 1));
        }
        this._addRefreshHook(function () {
            var i;
            for (i = newVertexHandles.length - 1; i >= 0; i--) {
                newVertexHandles[i][propertyOfVertexRefreshFn]();
            }
            for (i = vertexHandles.length - 1; i >= 0; i--) {
                vertexHandles[i][propertyOfVertexRefreshFn]();
            }
        });
    },

    _refresh:function () {
        if (this._refreshHooks) {
            for (var i = this._refreshHooks.length - 1; i >= 0; i--) {
                this._refreshHooks[i].call(this);
            }
        }
    },

    _hideContext:function () {
        if (this._geometry) {
            this._geometry.closeMenu();
            this._geometry.closeInfoWindow();
        }
    },

    _addListener:function (listener) {
        if (!this._eventListeners) {
            this._eventListeners = [];
        }
        this._eventListeners.push(listener);
        listener[0].on(listener[1], listener[2], this);
    },

    _addRefreshHook:function (fn) {
        if (!fn) {
            return;
        }
        if (!this._refreshHooks) {
            this._refreshHooks = [];
        }
        this._refreshHooks.push(fn);
    }

});

Z.Label.include(/** @lends maptalks.Label.prototype */{
    /**
     * Start to edit the label text
     * @return {maptalks.Label} this
     */
    startEditText: function () {
        if (!this.getMap()) {
            return this;
        }
        this.hide();
        this.endEditText();
        this._prepareEditor();
        this.fire('edittextstart', this);
        return this;
    },

    /**
     * End label text edit.
     * @return {maptalks.Label} this
     */
    endEditText: function () {
        if (this._textEditor) {
            var content = this._textEditor.innerText;
            this.setContent(content);
            this.show();
            Z.DomUtil.off(this._textEditor, 'mousedown dblclick', Z.DomUtil.stopPropagation)
                .off(this._textEditor, 'blur', this.endEditText, this);
            Z.DomUtil.removeDomNode(this._container);
            delete this._container;
            delete this._textEditor;
            this.fire('edittextend', this);
        }
        return this;
    },

    /**
     * Whether the label is being edited text.
     * @return {Boolean}
     */
    isEditingText: function () {
        if (this._container) {
            return true;
        }
        return false;
    },

    getEditor: function () {
        return this._textEditor;
    },

    _prepareEditor:function () {
        var map = this.getMap(),
            zIndex = map._panels.control.style.zIndex + 1,
            viewPoint = this._computeViewPoint();
        this._container = Z.DomUtil.createEl('div');
        this._container.style.cssText = 'position:absolute;top:' + viewPoint['y'] +
                                    'px;left:' + viewPoint['x'] + 'px;z-index:' + zIndex + ';';
        map._panels.ui.appendChild(this._container);
        this._textEditor = this._createEditor();
        this._container.appendChild(this._textEditor);
    },


    _computeViewPoint: function () {
        var map = this.getMap(),
            symbol = this._getInternalSymbol(),
            labelSize = this.getSize(),
            dx = symbol['textDx'] || 0,
            dy = symbol['textDy'] || 0,
            align = Z.StringUtil.getAlignPoint(labelSize, symbol['textHorizontalAlignment'], symbol['textVerticalAlignment'])
                    .add(dx, dy),
            viewPoint = map.coordinateToViewPoint(this.getCenter()).add(align);
        return viewPoint;
    },

    _createEditor: function () {
        var labelSize = this.getSize(),
            symbol = this._getInternalSymbol() || {},
            width = labelSize['width'] || 100,
            // height = labelSize['height'] || 100,
            textColor = symbol['textFill'] || '#000000',
            textSize = symbol['textSize'] || 12,
            fill = symbol['markerFill'] || '#3398CC',
            lineColor = symbol['markerLineColor'] || '#ffffff',
            spacing = symbol['textLineSpacing'] || 0,
            editor = Z.DomUtil.createEl('div');
        editor.contentEditable = true;
        editor.style.cssText = 'background: ' + fill + ';' +
            'border: 1px solid ' + lineColor + ';' +
            'color: ' + textColor + ';' +
            'font-size: ' + textSize + 'px;' +
            'width: ' + (width + 10) + 'px;' +
            // 'height: '+(height - spacing) +'px;'+
            // 'min-height: '+(height - spacing)+'px;'+
            // 'max-height: 300px;'+
            'margin-left: auto;' +
            'margin-right: auto;' +
            'line-height: ' + (textSize + spacing) + 'px;' +
            'outline: 0;' +
            'word-wrap: break-word;' +
            'overflow-x: hidden;' +
            'overflow-y: auto;' +
            '-webkit-user-modify: read-write-plaintext-only;';
        var content = this.getContent();
        editor.innerText = content;
        Z.DomUtil.on(editor, 'mousedown dblclick', Z.DomUtil.stopPropagation)
            .on(editor, 'blur', this.endEditText, this);
        return editor;
    }

});

Z.View = function (options) {
    if (!options) {
        options = {};
    }
    this.options = options;
    this._initView();
};

Z.Util.extend(Z.View.prototype, {
    defaultView: {
        'EPSG:3857' : {
            'resolutions' : (function () {
                var resolutions = [];
                var d = 2 * 6378137 * Math.PI;
                for (var i = 0; i < 21; i++) {
                    resolutions[i] = d / (256 * Math.pow(2, i));
                }
                return resolutions;
            })(),
            'fullExtent': {
                'top'   : 6378137 * Math.PI,
                'left'  : -6378137 * Math.PI,
                'bottom': -6378137 * Math.PI,
                'right' : 6378137 * Math.PI
            }
        },
        'EPSG:4326' : {
            'fullExtent': {
                'top':90,
                'left':-180,
                'bottom':-90,
                'right':180
            },
            'resolutions' : (function () {
                var resolutions = [];
                for (var i = 0; i < 21; i++) {
                    resolutions[i] = 180 / (Math.pow(2, i) * 128);
                }
                return resolutions;
            })()
        },
        'BAIDU' : {
            'resolutions' : (function () {
                var res = Math.pow(2, 18);
                var resolutions = [];
                for (var i = 0; i < 20; i++) {
                    resolutions[i] = res;
                    res *= 0.5;
                }
                resolutions[0] = null;
                resolutions[1] = null;
                resolutions[2] = null;
                return resolutions;
            })(),
            'fullExtent' : {
                'top':33554432,
                'left':-33554432,
                'bottom':-33554432,
                'right':33554432
            }
        }

    },

    _initView : function () {
        var projection = this.options['projection'];
        if (projection) {
            if (Z.Util.isString(projection)) {
                for (var p in Z.projection) {
                    if (Z.projection.hasOwnProperty(p)) {
                        var regName = Z.projection[p]['code'];
                        if (regName && regName.toLowerCase() === projection.toLowerCase()) {
                            projection = Z.projection[p];
                            break;
                        }
                    }
                }
            }
        } else {
            projection = Z.projection.DEFAULT;
        }
        if (!projection || Z.Util.isString(projection)) {
            throw new Error('must provide a valid projection in map\'s view.');
        }
        projection = Z.Util.extend({}, Z.projection.Common, projection);
        if (!projection.measureLength) {
            Z.Util.extend(projection, Z.MeasurerUtil.DEFAULT);
        }
        this._projection = projection;
        var defaultView,
            resolutions = this.options['resolutions'];
        if (!resolutions) {
            if (projection['code']) {
                defaultView = this.defaultView[projection['code']];
                if (defaultView) {
                    resolutions = defaultView['resolutions'];
                }
            }
            if (!resolutions) {
                throw new Error('must provide valid resolutions in map\'s view.');
            }
        }
        this._resolutions = resolutions;
        var fullExtent = this.options['fullExtent'];
        if (!fullExtent) {
            if (projection['code']) {
                defaultView = this.defaultView[projection['code']];
                if (defaultView) {
                    fullExtent = defaultView['fullExtent'];
                }
            }
            if (!fullExtent) {
                throw new Error('must provide a valid fullExtent in map\'s view.');
            }
        }
        if (!Z.Util.isNil(fullExtent['left'])) {
            this._fullExtent = new Z.Extent(new Z.Coordinate(fullExtent['left'], fullExtent['top']),
                            new Z.Coordinate(fullExtent['right'], fullExtent['bottom']));
        } else {
            //xmin, ymin, xmax, ymax
            this._fullExtent = new Z.Extent(fullExtent);
            fullExtent['left'] = fullExtent['xmin'];
            fullExtent['right'] = fullExtent['xmax'];
            fullExtent['top'] = fullExtent['ymax'];
            fullExtent['bottom'] = fullExtent['ymin'];
        }

        //set left, right, top, bottom value
        Z.Util.extend(this._fullExtent, fullExtent);

        var a = fullExtent['right'] >= fullExtent['left'] ? 1 : -1,
            b = fullExtent['top'] >= fullExtent['bottom'] ? -1 : 1;
        this._transformation = new Z.Transformation([a, b, 0, 0]);
    },

    getResolutions:function () {
        return this._resolutions;
    },

    getResolution:function (z) {
        return this._resolutions[z];
    },

    getProjection:function () {
        return this._projection;
    },

    getFullExtent:function () {
        return this._fullExtent;
    },

    getTransformation:function () {
        return this._transformation;
    },

    getMinZoom:function () {
        for (var i = 0; i < this._resolutions.length; i++) {
            if (!Z.Util.isNil(this._resolutions[i])) {
                return i;
            }
        }
        return 0;
    },

    getMaxZoom:function () {
        for (var i = this._resolutions.length - 1; i >= 0; i--) {
            if (!Z.Util.isNil(this._resolutions[i])) {
                return i;
            }
        }
        return this._resolutions.length - 1;
    }

});


(function () {
    function parse(arcConf) {
        var tileInfo = arcConf['tileInfo'],
            tileSize = {'width' : tileInfo['cols'], 'height' : tileInfo['rows']},
            resolutions = [],
            lods = tileInfo['lods'];
        for (var i = 0, len = lods.length; i < len; i++) {
            resolutions.push(lods[i]['resolution']);
        }
        var fullExtent = arcConf['fullExtent'],

            origin = tileInfo['origin'],
            tileSystem = [1, -1, origin['x'], origin['y']];
        delete fullExtent['spatialReference'];
        return {
            'view' : {
                'resolutions' : resolutions,
                'fullExtent' : fullExtent
            },
            'tileSystem' : tileSystem,
            'tileSize' : tileSize
        };
    }

    Z.View.loadArcgis = function (url, cb, context) {
        if (Z.Util.isString(url) && url.substring(0, 1) !== '{') {
            maptalks.Ajax.getJSON(url, function (err, json) {
                if (err) {
                    if (context) {
                        cb.call(context, err);
                    } else {
                        cb(err);
                    }
                    return;
                }
                var view = parse(json);
                if (context) {
                    cb.call(context, null, view);
                } else {
                    cb(null, view);
                }
            });
        } else {
            if (Z.Util.isString(url)) {
                url = Z.Util.parseJSON(url);
            }
            var view = parse(url);
            if (context) {
                cb.call(context, null, view);
            } else {
                cb(null, view);
            }

        }
        return this;
    };

})();

/**
 *
 * @class
 * @category map
 * @extends {maptalks.Class}
 *
 * @param {(string|HTMLElement|object)} container - The container to create the map on, can be:<br>
 *                                          1. A HTMLElement container.<br/>
 *                                          2. ID of a HTMLElement container.<br/>
 *                                          3. A canvas compatible container in node,
 *                                          e.g. [node-canvas]{@link https://github.com/Automattic/node-canvas},
 *                                              [canvas2svg]{@link https://github.com/gliffy/canvas2svg}
 * @param {Object} options - construct options
 * @param {(Number[]|maptalks.Coordinate)} options.center - initial center of the map.
 * @param {Number} options.zoom - initial zoom of the map.
 * @param {Object} [options.view=null] - map's view state, default is the common-used by google map or osm<br/>
 *                               use projection EPSG:3857 with resolutions
 * @param {maptalks.Layer} [options.baseLayer=null] - base layer that will be set to map initially.
 * @param {maptalks.Layer[]} [options.layers=null] - layers that will be added to map initially.
 * @param {*} options.* - any other option defined in [Map.options]{@link maptalks.Map#options}
 *
 * @mixes maptalks.Eventable
 * @mixes maptalks.Handlerable
 * @mixes maptalks.Renderable
 * @mixins maptalks.ui.Menu.Mixin
 *
 * @fires maptalks.Map#load
 * @fires maptalks.Map#viewchange
 * @fires maptalks.Map#baselayerload
 * @fires maptalks.Map#baselayerchangestart
 * @fires maptalks.Map#baselayerchangeend
 * @fires maptalks.Map#resize
 * @fires maptalks.Map#movestart
 * @fires maptalks.Map#moving
 * @fires maptalks.Map#moveend
 * @classdesc
 * The central class of the library, to create a map on a container.
 * @example
 * var map = new maptalks.Map("map",{
        center:     [180,0],
        zoom:  4,
        baseLayer : new maptalks.TileLayer("base",{
            urlTemplate:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains:['a','b','c']
        })
    });
 */
Z.Map = Z.Class.extend(/** @lends maptalks.Map.prototype */{

    includes: [Z.Eventable, Z.Handlerable],

    /**
     * @property {Object} options                                   - map's options, options must be updated by config method, eg: map.config('zoomAnimation', false);
     * @property {Boolean} [options.clipFullExtent=false]           - clip geometries outside map's full extent
     * @property {Boolean} [options.zoomAnimation=true]             - enable zooming animation
     * @property {Number}  [options.zoomAnimationDuration=250]      - zoom animation duration.
     * @property {Boolean} [options.zoomBackground=true]            - leaves a background after zooming.
     * @property {Boolean} [options.layerZoomAnimation=true]        - also animate layers when zooming.
     * @property {Boolean} [options.layerTransforming=true] - update points when transforming (e.g. zoom animation), this may bring drastic low performance when rendering a large number of points.
     * @property {Boolean} [options.panAnimation=true]              - continue to animate panning when draging or touching ended.
     * @property {Boolean} [options.panAnimationDuration=600]       - duration of pan animation.
     * @property {Boolean} [options.zoomable=true]                - whether to enable map zooming.
     * @property {Boolean} [options.enableInfoWindow=true]          - whether to enable infowindow opening on this map.
     * @property {Boolean} [options.maxZoom=null]                   - the maximum zoom the map can be zooming to.
     * @property {Boolean} [options.minZoom=null]                   - the minimum zoom the map can be zooming to.
     * @property {maptalks.Extent} [options.maxExtent=null]         - when maxExtent is set, map will be restricted to the give max extent and bouncing back when user trying to pan ouside the extent.
     *
     * options merged from handlers:
     * @property {Boolean} [options.draggable=true]                         - disable the map dragging if set to false.
     * @property {Boolean} [options.doublClickZoom=true]                    - whether to allow map to zoom by double click events.
     * @property {Boolean} [options.scrollWheelZoom=true]                   - whether to allow map to zoom by scroll wheel events.
     * @property {Boolean} [options.touchZoom=true]                         - whether to allow map to zoom by touch events.
     * @property {Boolean} [options.autoBorderPanning=false]                - whether to pan the map automatically if mouse moves on the border of the map
     * @property {Boolean} [options.geometryEvents=false]                   - enable/disable firing geometry events
     *
     * options merged from controls:
     * @property {Boolean|Object} [options.attributionControl=false]        - display the attribution control on the map if set to true or a object as the control construct option.
     * @property {Boolean|Object} [options.zoomControl=false]               - display the zoom control on the map if set to true or a object as the control construct option.
     * @property {Boolean|Object} [options.scaleControl=false]              - display the scale control on the map if set to true or a object as the control construct option.
     *
     * @property {String} [options.renderer=canvas]                 - renderer type. Don't change it if you are not sure about it. About renderer, see [TODO]{@link tutorial.renderer}.
     */
    options:{
        'clipFullExtent' : false,

        'zoomAnimation' : true,
        'zoomAnimationDuration' : 330,
        //still leave background after zooming, set it to false if baseLayer is a transparent layer
        'zoomBackground' : true,
        //controls whether other layers than base tilelayer will show during zoom animation.
        'layerZoomAnimation' : true,

        //economically transform, whether point symbolizers transforms during transformation (e.g. zoom animation)
        //set to true can prevent drastic low performance when number of point symbolizers is large.
        'layerTransforming' : true,

        'panAnimation':true,
        //default pan animation duration
        'panAnimationDuration' : 600,

        'zoomable':true,
        'enableInfoWindow':true,

        'hitDetect' : (function () { return !Z.Browser.mobile; })(),

        'maxZoom' : null,
        'minZoom' : null,
        'maxExtent' : null,

        'renderer' : 'canvas'
    },

    //Exception definitions in English and Chinese.
    exceptionDefs:{
        'en-US':{
            'INVALID_OPTION':'Invalid options provided.',
            'INVALID_CENTER':'Invalid Center',
            'INVALID_LAYER_ID':'Invalid id for the layer',
            'DUPLICATE_LAYER_ID':'the id of the layer is duplicate with another layer'
        },
        'zh-CN':{
            'INVALID_OPTION':'无效的option.',
            'INVALID_CENTER':'无效的中心点',
            'INVALID_LAYER_ID':'图层的id无效',
            'DUPLICATE_LAYER_ID':'重复的图层id'
        }
    },


    initialize:function (container, options) {

        if (!options) {
            throw new Error(this.exceptions['INVALID_OPTION']);
        }

        if (!options['center']) {
            throw new Error(this.exceptions['INVALID_CENTER']);
        }

        this._loaded = false;
        this._container = container;

        if (Z.Util.isString(this._container)) {
            this._containerDOM = document.getElementById(this._container);
            if (!this._containerDOM) {
                throw new Error('invalid container: \'' + container + '\'');
            }
        } else {
            this._containerDOM = container;
            if (Z.node) {
                //node环境中map的containerDOM即为模拟Canvas容器, 例如node-canvas
                //获取模拟Canvas类的类型, 用以在各图层的渲染器中构造Canvas
                this.CanvasClass = this._containerDOM.constructor;
            }
        }


        //Layer of Details, always derived from baseLayer
        this._panels = {};

        //Layers
        this._baseLayer = null;
        this._layers = [];

        //shallow copy options
        var opts = Z.Util.extend({}, options);

        this._zoomLevel = opts['zoom'];
        delete opts['zoom'];
        this._center = new Z.Coordinate(opts['center']);
        delete opts['center'];

        var baseLayer = opts['baseLayer'];
        delete opts['baseLayer'];
        var layers = opts['layers'];
        delete opts['layers'];

        Z.Util.setOptions(this, opts);
        this.setView(opts['view']);

        if (baseLayer) {
            this.setBaseLayer(baseLayer);
        }
        if (layers) {
            this.addLayer(layers);
        }

        this._mapViewPoint = new Z.Point(0, 0);

        this._initRenderer();
        this._getRenderer().initContainer();
        this._updateMapSize(this._getContainerDomSize());

        this._Load();
    },

    /**
     * Whether the map is loaded or not.
     * @return {Boolean}
     */
    isLoaded:function () {
        return this._loaded;
    },

    /**
     * Whether the map is rendered by canvas
     * @return {Boolean}
     * @protected
     * @example
     * var isCanvas = map.isCanvasRender();
     */
    isCanvasRender:function () {
        var renderer = this._getRenderer();
        if (renderer) {
            return renderer.isCanvasRender();
        }
        return false;
    },

    /**
     * Get the view of the Map.
     * @return {Object} map's view
     */
    getView: function () {
        if (!this._view) {
            return null;
        }
        return this._view;
    },

    /**
     * Change the view of the map. <br>
     * A view is a series of settings to decide the map presentation:<br>
     * 1. the projection.<br>
     * 2. zoom levels and resolutions. <br>
     * 3. full extent.<br>
     * there are some [predefined views]{@link http://www.foo.com}, and surely you can [define a custom one.]{@link http://www.foo.com}
     * @param {Object} view - view settings
     * @returns {maptalks.Map} this
     */
    setView:function (view) {
        var oldView = this._view;
        if (oldView && !view) {
            return this;
        }
        this._center = this.getCenter();
        this.options['view'] =  view;
        this._view = new Z.View(view);
        if (this.options['view'] && Z.Util.isFunction(this.options['view']['projection'])) {
            var projection = this._view.getProjection();
            //save projection code for map profiling (toJSON/fromJSON)
            this.options['view']['projection'] = projection['code'];
        }
        this._resetMapStatus();
        this._fireEvent('viewchange');
        return this;
    },

    /**
     * Callback when any option is updated
     * @private
     * @param  {Object} conf - options to update
     * @return {maptalks.Map}   this
     */
    onConfig:function (conf) {
        if (!Z.Util.isNil(conf['view'])) {
            this.setView(conf['view']);
        }
        return this;
    },

    /**
     * Get the projection of the map. <br>
     * Projection is an algorithm for map projection, e.g. well-known [Mercator Projection]{@link https://en.wikipedia.org/wiki/Mercator_projection}
     * @return {Object}
     */
    getProjection:function () {
        return this._view.getProjection();
    },

    /**
     * Get map's full extent, e.g. the world's full extent. <br>
     * Any geometries outside this extent will be clipped if clipFullExtent options is set true
     * @return {maptalks.Extent}
     */
    getFullExtent:function () {
        return this._view.getFullExtent();
    },

    /**
     * Set map's cursor style, same with CSS.
     * @param {String} cursor - cursor style
     * @returns {maptalks.Map} this
     */
    setCursor:function (cursor) {
        delete this._cursor;
        this._trySetCursor(cursor);
        this._cursor = cursor;
        return this;
    },

    /**
     * Get center of the map.
     * @return {maptalks.Coordinate}
     */
    getCenter:function () {
        if (!this._loaded || !this._prjCenter) { return this._center; }
        var projection = this.getProjection();
        return projection.unproject(this._prjCenter);
    },

    /**
     * Set a new center to the map.
     * @param {maptalks.Coordinate} center
     * @return {maptalks.Map} this
     */
    setCenter:function (center) {
        if (!center) {
            return this;
        }
        if (!this._verifyExtent(center)) {
            return this;
        }
        center = new Z.Coordinate(center);
        if (!this._loaded) {
            this._center = center;
            return this;
        }
        this._onMoveStart();
        var projection = this.getProjection();
        var _pcenter = projection.project(center);
        this._setPrjCenterAndMove(_pcenter);
        this._onMoveEnd();
        return this;
    },

    /**
     * Get map's size (width and height) in pixel.
     * @return {maptalks.Size}
     */
    getSize:function () {
        if (Z.Util.isNil(this.width) || Z.Util.isNil(this.height)) {
            return this._getContainerDomSize();
        }
        return new Z.Size(this.width, this.height);
    },

    /**
     * Get the geographical extent of map's current view extent.
     *
     * @return {maptalks.Extent}
     */
    getExtent:function () {
        return this.viewToExtent(this._getViewExtent());
    },

    /**
     * Get the max extent that the map is restricted to.
     * @return {maptalks.Extent}
     */
    getMaxExtent:function () {
        if (!this.options['maxExtent']) {
            return null;
        }
        return new Z.Extent(this.options['maxExtent']);
    },

    /**
     * Sets the max extent that the map is restricted to.
     * @param {maptalks.Extent}
     * @return {maptalks.Map} this
     */
    setMaxExtent:function (extent) {
        if (extent) {
            var maxExt = new Z.Extent(extent);
            this.options['maxExtent'] = maxExt;
            var center = this.getCenter();
            if (!this._verifyExtent(center)) {
                this.panTo(maxExt.getCenter());
            }
        } else {
            delete this.options['maxExtent'];
        }
        return this;
    },

    /**
     * Get map's current zoom.
     * @return {Number}
     */
    getZoom:function () {
        return this._zoomLevel;
    },

    /**
     * Caculate the target zoom if scaling from "fromZoom" by "scale"
     * @param  {Number} scale
     * @param  {Number} fromZoom
     * @return {Number}
     */
    getZoomForScale:function (scale, fromZoom) {
        if (Z.Util.isNil(fromZoom)) {
            fromZoom = this.getZoom();
        }
        var res = this._getResolution(fromZoom),
            resolutions = this._getResolutions(),
            min = Number.MAX_VALUE,
            hit = -1;
        for (var i = resolutions.length - 1; i >= 0; i--) {
            var test = Math.abs(res / resolutions[i] - scale);
            if (test < min) {
                min = test;
                hit = i;
            }
        }
        return hit;
    },

    /**
     * Sets the zoom of the map
     * @param {Number} zoom
     * @returns {maptalks.Map} this
     */
    setZoom:function (zoom) {
        if (this.options['zoomAnimation']) {
            this._zoomAnimation(zoom);
        } else {
            this._zoom(zoom);
        }
        return this;
    },

    /**
     * Get the max zoom that the map can be zoom to.
     * @return {Number}
     */
    getMaxZoom:function () {
        if (!Z.Util.isNil(this.options['maxZoom'])) {
            return this.options['maxZoom'];
        }
        var view = this.getView();
        if (!view) {
            return null;
        }
        return view.getResolutions().length - 1;
    },

    /**
     * Sets the max zoom that the map can be zoom to.
     * @param {Number} maxZoom
     * @returns {maptalks.Map} this
     */
    setMaxZoom:function (maxZoom) {
        var viewMaxZoom = this._view.getMaxZoom();
        if (maxZoom > viewMaxZoom) {
            maxZoom = viewMaxZoom;
        }
        if (maxZoom < this._zoomLevel) {
            this.setZoom(maxZoom);
        }
        this.options['maxZoom'] = maxZoom;
        return this;
    },

    /**
     * Get the min zoom that the map can be zoom to.
     * @return {Number}
     */
    getMinZoom:function () {
        if (!Z.Util.isNil(this.options['minZoom'])) {
            return this.options['minZoom'];
        }
        return 0;
    },

    /**
     * Sets the min zoom that the map can be zoom to.
     * @param {Number} minZoom
     * @return {maptalks.Map} this
     */
    setMinZoom:function (minZoom) {
        var viewMinZoom = this._view.getMinZoom();
        if (minZoom < viewMinZoom) {
            minZoom = viewMinZoom;
        }
        this.options['minZoom'] = minZoom;
        return this;
    },

    /**
     * zoom in
     * @return {maptalks.Map} this
     */
    zoomIn: function () {
        this.setZoom(this.getZoom() + 1);
        return this;
    },

    /**
     * zoom out
     * @return {maptalks.Map} this
     */
    zoomOut: function () {
        this.setZoom(this.getZoom() - 1);
        return this;
    },

    /**
     * Sets the center and zoom at the same time.
     * @param {maptalks.Coordinate} center
     * @param {Number} zoomLevel
     * @return {maptalks.Map} this
     */
    setCenterAndZoom:function (center, zoomLevel) {
        if (this._zoomLevel !== zoomLevel) {
            this.setCenter(center);
            if (!Z.Util.isNil(zoomLevel)) {
                this.setZoom(zoomLevel);
            }
        } else {
            this.setCenter(center);
        }
        return this;
    },


    /**
     * Caculate the zoom level that contains the given extent with the maximum zoom level possible.
     * @param {maptalks.Extent} extent
     * @return {Number}
     */
    getFitZoom: function (extent) {
        if (!extent || !(extent instanceof Z.Extent)) {
            return this._zoomLevel;
        }
        //点类型
        if (extent['xmin'] === extent['xmax'] && extent['ymin'] === extent['ymax']) {
            return this.getMaxZoom();
        }
        var projection = this.getProjection(),
            x = Math.abs(extent['xmin'] - extent['xmax']),
            y = Math.abs(extent['ymin'] - extent['ymax']),
            projectedExtent = projection.project({x:x, y:y}),
            resolutions = this._getResolutions(),
            xz = -1,
            yz = -1;
        for (var i = this.getMinZoom(), len = this.getMaxZoom(); i < len; i++) {
            if (Z.Util.round(projectedExtent.x / resolutions[i]) >= this.width) {
                if (xz === -1) {
                    xz = i;
                }
            }
            if (Z.Util.round(projectedExtent.y / resolutions[i]) >= this.height) {
                if (yz === -1) {
                    yz = i;
                }
            }
            if (xz > -1 && yz > -1) {
                break;
            }
        }
        var ret = xz < yz ? xz : yz;
        if (ret === -1) {
            ret = xz < yz ? yz : xz;
        }
        if (ret === -1) {
            return this.getMaxZoom();
        }
        return ret;
    },

    /**
     * Get the base layer of the map.
     * @return {maptalks.Layer}
     */
    getBaseLayer:function () {
        return this._baseLayer;
    },

    /**
     * Sets a new base layer to the map.<br>
     * Some events will be thrown such as baselayerchangestart, baselayerload, baselayerchangeend.
     * @param  {maptalks.Layer} baseLayer - new base layer
     * @return {maptalks.Map} this
     */
    setBaseLayer:function (baseLayer) {
        var isChange = false;
        if (this._baseLayer) {
            isChange = true;
            this._fireEvent('baselayerchangestart');
            this._baseLayer.remove();
        }
        if (baseLayer instanceof Z.TileLayer) {
            baseLayer.config({
                'renderWhenPanning':true
            });
            if (!baseLayer.options['tileSystem']) {
                baseLayer.config('tileSystem', Z.TileSystem.getDefault(this.getProjection()));
            }
        }
        baseLayer._bindMap(this, -1);
        this._baseLayer = baseLayer;
        function onbaseLayerload() {
            this._fireEvent('baselayerload');
            if (isChange) {
                isChange = false;
                this._fireEvent('baselayerchangeend');
            }
        }
        this._baseLayer.on('layerload', onbaseLayerload, this);
        if (this._loaded) {
            this._baseLayer.load();
        }
        return this;
    },

    /**
     * Remove the base layer from the map
     * @return {maptalks.Map} this
     */
    removeBaseLayer: function ()  {
        if (this._baseLayer) {
            this._baseLayer.remove();
            delete this._baseLayer;
            this._fireEvent('baselayerremove');
        }
        return this;
    },

    /**
     * Get the layers of the map, not including base layer (by getBaseLayer). <br>
     * A filter function can be given to exclude certain layers, eg exclude all the VectorLayers.
     * @param {function} [filter=null] - a filter function of layers, return false to exclude the given layer.
     * @return {maptalks.Layer[]}
     */
    getLayers:function (filter) {
        return this._getLayers(function (layer) {
            if (layer === this._baseLayer || layer.getId().indexOf(Z.internalLayerPrefix) >= 0) {
                return false;
            }
            if (filter) {
                return filter(layer);
            }
            return true;
        });
    },

    /**
     * Get the layer with the given id.
     * @param  {String} id - layer id
     * @return {maptalks.Layer}
     */
    getLayer:function (id) {
        if (!id || !this._layerCache || !this._layerCache[id]) {
            return null;
        }
        return this._layerCache[id];
    },

    /**
     * Add a new layer on the top of the map.
     * @param  {maptalks.Layer} layer - Any valid layer object
     * @return {maptalks.Map} this
     */
    addLayer:function (layers) {
        if (!layers) {
            return this;
        }
        if (!Z.Util.isArray(layers)) {
            return this.addLayer([layers]);
        }
        if (!this._layerCache) {
            this._layerCache = {};
        }
        for (var i = 0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            var id = layer.getId();
            if (Z.Util.isNil(id)) {
                throw new Error(this.exceptions['INVALID_LAYER_ID'] + ':' + id);
            }
            if (this._layerCache[id]) {
                throw new Error(this.exceptions['DUPLICATE_LAYER_ID'] + ':' + id);
            }
            this._layerCache[id] = layer;
            layer._bindMap(this, this._layers.length);
            this._layers.push(layer);
            if (this._loaded) {
                layer.load();
            }
        }
        return this;
    },

    /**
     * Remove a layer from the map
     * @param  {string|maptalks.Layer} layer - id of the layer or a layer object
     * @return {maptalks.Map} this
     */
    removeLayer: function (layers) {
        if (!layers) {
            return this;
        }
        if (!Z.Util.isArray(layers)) {
            return this.removeLayer([layers]);
        }
        for (var i = 0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            if (!(layer instanceof Z.Layer)) {
                layer = this.getLayer(layer);
            }
            if (!layer) {
                continue;
            }
            var map = layer.getMap();
            if (!map || map !== this) {
                continue;
            }
            this._removeLayer(layer, this._layers);
            if (this._loaded) {
                layer._onRemove();
            }
            var id = layer.getId();
            if (this._layerCache) {
                delete this._layerCache[id];
            }
            layer.fire('remove');
        }
        return this;
    },

    /**
     * Sort layers according to the order provided, the last will be on the top.
     * @param  {string[]|maptalks.Layer[]} layers - layers or layer ids to sort
     * @return {maptalks.Map} this
     */
    sortLayers:function (layers) {
        if (!layers || !Z.Util.isArray(layers)) {
            return this;
        }
        var layersToOrder = [];
        var minZ = Number.MAX_VALUE;
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (Z.Util.isString(layers[i])) {
                layer = this.getLayer(layer);
            }
            if (!(layer instanceof Z.Layer) || !layer.getMap() || layer.getMap() !== this) {
                throw new Error('It must be a layer added to this map to order.');
            }
            if (layer.getZIndex() < minZ) {
                minZ = layer.getZIndex();
            }
            layersToOrder.push(layer);
        }
        for (var ii = 0; ii < layersToOrder.length; ii++) {
            layersToOrder[ii].setZIndex(minZ + ii);
        }
        return this;
    },

    /**
     * Exports image from the map's canvas.
     * @param {Object} options - options
     * @param {String} [options.mimeType=image/png] - mime type of the image
     * @param {Boolean} [options.save=false] - whether pop a file save dialog to save the export image.
     * @param {String} [options.filename=export] - specify the file name, if options.save is true.
     * @return {String} image of base64 format.
     */
    toDataURL: function (options) {
        if (!options) {
            options = {};
        }
        var mimeType = options['mimeType'];
        if (!mimeType) {
            mimeType = 'image/png';
        }
        var save = options['save'];
        var renderer = this._getRenderer();
        if (renderer) {
            var file = options['filename'];
            if (!file) {
                file = 'export';
            }
            var dataURL =  renderer.toDataURL(mimeType);
            if (save && dataURL) {
                var imgURL = dataURL;

                var dlLink = document.createElement('a');
                dlLink.download = file;
                dlLink.href = imgURL;
                dlLink.dataset.downloadurl = [mimeType, dlLink.download, dlLink.href].join(':');

                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);
            }
            return dataURL;
        }
        return null;
    },

    /**
     * Converts a coordinate to the 2D point in the specific zoom level.
     * @param  {maptalks.Coordinate} coordinate - coordinate
     * @param  {Number} zoom       - zoom level
     * @return {maptalks.Point}  2D point
     */
    coordinateToPoint: function (coordinate, zoom) {
        var prjCoord = this.getProjection().project(coordinate);
        return this._prjToPoint(prjCoord, zoom);
    },

    /**
     * Converts a 2D point to a coordinate
     * @param  {maptalks.Point} point - 2D point
     * @param  {Number} zoom  - zoom level
     * @return {maptalks.Coordinate} coordinate
     */
    pointToCoordinate: function (point, zoom) {
        var prjCoord = this._pointToPrj(point, zoom);
        return this.getProjection().unproject(prjCoord);
    },

    /**
     * Converts a geographical coordinate to the [view point]{@link http://www.foo.com}.<br>
     * It is useful for placing overlays or ui controls on the map.
     * @param {maptalks.Coordinate} coordinate
     * @return {maptalks.Point}
     */
    coordinateToViewPoint: function (coordinate) {
        return this._prjToViewPoint(this.getProjection().project(coordinate));
    },

    /**
     * Converts a view point to the geographical coordinate.
     * @param {maptalks.Point} viewPoint
     * @return {maptalks.Coordinate}
     */
    viewPointToCoordinate: function (viewPoint) {
        return this.getProjection().unproject(this._viewPointToPrj(viewPoint));
    },

    /**
     * Convert a geographical coordinate to the container point.
     * @param {maptalks.Coordinate}
     * @return {maptalks.Point}
     */
    coordinateToContainerPoint: function (coordinate) {
        var pCoordinate = this.getProjection().project(coordinate);
        return this._prjToContainerPoint(pCoordinate);
    },

    /**
     * Converts a container point to geographical coordinate.
     * @param {maptalks.Point}
     * @return {maptalks.Coordinate}
     */
    containerPointToCoordinate: function (containerPoint) {
        var pCoordinate = this._containerPointToPrj(containerPoint);
        return this.getProjection().unproject(pCoordinate);
    },

    /**
     * Converts a container point to the view point.
     *
     * @param {maptalks.Point}
     * @returns {maptalks.Point}
     */
    containerPointToViewPoint: function (containerPoint) {
        return containerPoint.substract(this.offsetPlatform());
    },

    /**
     * Converts a view point to the container point.
     *
     * @param {maptalks.Point}
     * @returns {maptalks.Point}
     */
    viewPointToContainerPoint: function (viewPoint) {
        return viewPoint.add(this.offsetPlatform());
    },

    /**
     * Converts a view points extent to the geographic extent.
     * @param  {maptalks.PointExtent} viewExtent - view points extent
     * @return {maptalks.Extent}  geographic extent
     */
    viewToExtent:function (viewExtent) {
        var projection = this.getProjection();
        if (!projection) {
            return null;
        }
        var res = this._getResolution();
        if (Z.Util.isNil(res)) {
            return null;
        }
        var viewCenter = this._getViewExtent().getCenter();
        var prjCenter = this._getPrjCenter();
        var min = viewExtent.getMin();
        var max = viewExtent.getMax();

        var dist1 = viewCenter.substract(min),
            dist2 = viewCenter.substract(max);
        var c1 = projection.unproject(new Z.Coordinate(prjCenter.x - dist1.x * res, prjCenter.y + dist1.y * res));
        var c2 = projection.unproject(new Z.Coordinate(prjCenter.x - dist2.x * res, prjCenter.y + dist2.y * res));
        return new Z.Extent(c1, c2);
    },

    /**
     * Converts a container points extent to the geographic extent.
     * @param  {maptalks.PointExtent} containerExtent - containeproints extent
     * @return {maptalks.Extent}  geographic extent
     */
    containerToExtent:function (containerExtent) {
        var viewExtent = new Z.PointExtent(
                this.containerPointToViewPoint(containerExtent.getMin()),
                this.containerPointToViewPoint(containerExtent.getMax())
            );
        return this.viewToExtent(viewExtent);
    },

    /**
     * Checks if the map container size changed and updates the map if so.<br>
     * It is called in a setTimeout call.
     * @return {maptalks.Map} this
     */
    checkSize:function () {
        if (this._resizeTimeout) {
            clearTimeout(this._resizeTimeout);
        }
        var me = this;
        function resize() {
            var watched = me._getContainerDomSize();
            var oldHeight = me.height;
            var oldWidth = me.width;
            if (watched['width'] === oldWidth && watched['height'] === oldHeight) {
                return;
            }
            me._updateMapSize(watched);
            var resizeOffset = new Z.Point((oldWidth - watched.width) / 2, (oldHeight - watched.height) / 2);
            me._offsetCenterByPixel(resizeOffset);

            /**
             * resize event when map container's size changes
             * @event maptalks.Map#resize
             * @type {Object}
             * @property {String} type - resize
             * @property {maptalks.Map} target - map fires the event
             */
            me._fireEvent('resize');
        }

        this._resizeTimeout = setTimeout(function () {
            resize();
            setTimeout(function () {
                resize();
            }, 1);

        }, 100);

        return this;
    },

    /**
     * Converts a geographical distance to the pixel length.<br>
     * The value varis with difference zoom level.
     *
     * @param  {Number} xDist - distance on X axis.
     * @param  {Number} yDist - distance on Y axis.
     * @return {maptalks.Size} result.width: pixel length on X axis; result.height: pixel length on Y axis
     */
    distanceToPixel: function (xDist, yDist) {
        var projection = this.getProjection();
        if (!projection) {
            return null;
        }
        var center = this.getCenter(),
            target = projection.locate(center, xDist, yDist),
            res = this._getResolution();

        var width = !xDist ? 0 : (projection.project(new Z.Coordinate(target.x, center.y)).x - projection.project(center).x) / res;
        var height = !yDist ? 0 : (projection.project(new Z.Coordinate(center.x, target.y)).y - projection.project(center).y) / res;
        return new Z.Size(Math.abs(width), Math.abs(height));
    },

    /**
     * Converts pixel length to geographical distance.
     *
     * @param  {Number} width -
     * @param  {Number} height 纵轴像素长度
     * @return {Number}  distance
     */
    pixelToDistance:function (width, height) {
        var projection = this.getProjection();
        if (!projection) {
            return null;
        }
        //计算前刷新scales
        var center = this.getCenter(),
            pcenter = this._getPrjCenter(),
            res = this._getResolution();
        var pTarget = new Z.Coordinate(pcenter.x + width * res, pcenter.y + height * res);
        var target = projection.unproject(pTarget);
        return projection.measureLength(target, center);
    },

    /**
     * 返回距离coordinate坐标距离为dx, dy的坐标
     * @param  {maptalks.Coordinate} coordinate 坐标
     * @param  {Number} dx         x轴上的距离, 地图CRS为经纬度时,单位为米, 地图CRS为像素时, 单位为像素
     * @param  {Number} dy         y轴上的距离, 地图CRS为经纬度时,单位为米, 地图CRS为像素时, 单位为像素
     * @return {maptalks.Coordinate}            新的坐标
     */
    locate:function (coordinate, dx, dy) {
        return this.getProjection().locate(new Z.Coordinate(coordinate), dx, dy);
    },

    /**
    * Returns an object with different map panels (to build customized layers or overlays).
    * @returns {Object}
    */
    getPanel: function () {
        return this._getRenderer().getPanel();
    },

//-----------------------------------------------------------

    /**
     * whether map is busy
     * @private
     * @return {Boolean}
     */
    _isBusy:function () {
        return this._zooming/* || this._moving*/;
    },

    /**
     * try to change cursor when map is not setCursored
     * @private
     * @param  {String} cursor css cursor
     */
    _trySetCursor:function (cursor) {
        if (!this._cursor && !this._priorityCursor) {
            if (!cursor) {
                cursor = 'default';
            }
            this._setCursorToPanel(cursor);
        }
        return this;
    },

    _setPriorityCursor:function (cursor) {
        if (!cursor) {
            var hasCursor = false;
            if (this._priorityCursor) {
                hasCursor = true;
            }
            delete this._priorityCursor;
            if (hasCursor) {
                this.setCursor(this._cursor);
            }
        } else {
            this._priorityCursor = cursor;
            this._setCursorToPanel(cursor);
        }
        return this;
    },

    _setCursorToPanel:function (cursor) {
        var panel = this.getPanel();
        if (panel && panel.style) {
            panel.style.cursor = cursor;
        }
    },

     /**
     * Get map's extent in view points.
     * @return {maptalks.PointExtent}
     * @private
     */
    _getViewExtent:function () {
        var size = this.getSize();
        var offset = this.offsetPlatform();
        var min = new Z.Point(0, 0);
        var max = new Z.Point(size['width'], size['height']);
        return new Z.PointExtent(min.substract(offset), max.substract(offset));
    },

    _setPrjCenterAndMove:function (pcenter) {
        var offset = this._getPixelDistance(pcenter);
        this._setPrjCenter(pcenter);
        this.offsetPlatform(offset);
    },

    //remove a layer from the layerList
    _removeLayer:function (layer, layerList) {
        if (!layer || !layerList) { return; }
        var index = Z.Util.indexOfArray(layer, layerList);
        if (index > -1) {
            layerList.splice(index, 1);

            for (var j = 0, jlen = layerList.length; j < jlen; j++) {
                if (layerList[j].setZIndex) {
                    layerList[j].setZIndex(j);
                }
            }
        }
    },

    _sortLayersByZIndex:function (layerList) {
        layerList.sort(function (a, b) {
            return a.getZIndex() - b.getZIndex();
        });
    },


    _onMoveStart:function () {
        this._originCenter = this.getCenter();
        this._enablePanAnimation = false;
        this._moving = true;
        this._trySetCursor('move');
        /**
         * movestart event
         * @event maptalks.Map#movestart
         * @type {Object}
         * @property {String} type - movestart
         * @property {maptalks.Map} target - map fires the event
         */
        this._fireEvent('movestart');
    },

    _onMoving:function () {
        /**
         * moving event
         * @event maptalks.Map#moving
         * @type {Object}
         * @property {String} type - moving
         * @property {maptalks.Map} target - map fires the event
         */
        this._fireEvent('moving');
    },

    _onMoveEnd:function () {
        this._moving = false;
        this._trySetCursor('default');
        /**
         * moveend event
         * @event maptalks.Map#moveend
         * @type {Object}
         * @property {String} type - moveend
         * @property {maptalks.Map} target - map fires the event
         */
        this._fireEvent('moveend');
        if (!this._verifyExtent(this.getCenter())) {
            var moveTo = this._originCenter;
            if (!this._verifyExtent(moveTo)) {
                moveTo = this.getMaxExtent().getCenter();
            }
            this.panTo(moveTo);
        }
    },

    /**
     * Gets pixel lenth from pcenter to map's current center.
     * @param  {maptalks.Coordinate} pcenter - a projected coordinate
     * @return {maptalks.Point}
     * @private
     */
    _getPixelDistance:function (pCoord) {
        var center = this._getPrjCenter();
        var pxCenter = this._prjToContainerPoint(center);
        var pxCoord = this._prjToContainerPoint(pCoord);
        var dist = new Z.Point(-pxCoord.x + pxCenter.x, pxCenter.y - pxCoord.y);
        return dist;
    },

    _fireEvent:function (eventName, param) {
        //fire internal events at first
        this.fire('_' + eventName, param);
        this.fire(eventName, param);
    },

    _Load:function () {
        this._resetMapStatus();
        this._registerDomEvents();
        this._loadAllLayers();
        this._loaded = true;
        this._callOnLoadHooks();
        this._fireEvent('load');
    },

    _initRenderer:function () {
        var renderer = this.options['renderer'];
        var clazz = Z.Map.getRendererClass(renderer);
        this._renderer = new clazz(this);
    },

    _getRenderer:function () {
        return this._renderer;
    },

    _loadAllLayers:function () {
        function loadLayer(layer) {
            if (layer) {
                layer.load();
            }
        }
        if (this._baseLayer) { this._baseLayer.load(); }
        this._eachLayer(loadLayer, this.getLayers());
    },



    /**
     * Gets layers that fits for the filter
     * @param  {fn} filter - filter function
     * @return {maptalks.Layer[]}
     * @private
     */
    _getLayers:function (filter) {
        var layers = this._baseLayer ? [this._baseLayer].concat(this._layers) : this._layers;
        var result = [];
        for (var i = 0; i < layers.length; i++) {
            if (!filter || filter.call(this, layers[i])) {
                result.push(layers[i]);
            }
        }
        return result;
    },

    _eachLayer:function (fn) {
        if (arguments.length < 2) { return; }
        var layerLists = Array.prototype.slice.call(arguments, 1);
        if (layerLists && !Z.Util.isArray(layerLists)) {
            layerLists = [layerLists];
        }
        var layers = [];
        for (var i = 0, len = layerLists.length; i < len; i++) {
            layers = layers.concat(layerLists[i]);
        }
        for (var j = 0, jlen = layers.length; j < jlen; j++) {
            fn.call(fn, layers[j]);
        }
    },

    //Check and reset map's status when map'sview is changed.
    _resetMapStatus:function () {
        var maxZoom = this.getMaxZoom(),
            minZoom = this.getMinZoom();
        var viewMaxZoom = this._view.getMaxZoom(),
            viewMinZoom = this._view.getMinZoom();
        if (!maxZoom || maxZoom === -1 || maxZoom > viewMaxZoom) {
            this.setMaxZoom(viewMaxZoom);
        }
        if (!minZoom || minZoom === -1 || minZoom < viewMinZoom) {
            this.setMinZoom(viewMinZoom);
        }
        maxZoom = this.getMaxZoom();
        minZoom = this.getMinZoom();
        if (maxZoom < minZoom) {
            this.setMaxZoom(minZoom);
        }
        if (!this._zoomLevel || this._zoomLevel > maxZoom) {
            this._zoomLevel = maxZoom;
        }
        if (this._zoomLevel < minZoom) {
            this._zoomLevel = minZoom;
        }
        delete this._prjCenter;
        var projection = this.getProjection();
        this._prjCenter = projection.project(this._center);
    },

    _getContainerDomSize:function () {
        if (!this._containerDOM) { return null; }
        var containerDOM = this._containerDOM,
            width, height;
        if (!Z.Util.isNil(containerDOM.width) && !Z.Util.isNil(containerDOM.height)) {
            width = containerDOM.width;
            height = containerDOM.height;
            if (Z.Browser.retina && containerDOM[Z.renderer.tilelayer.Canvas.prototype.propertyOfTileId]) {
                //is a canvas tile of CanvasTileLayer
                width /= 2;
                height /= 2;
            }
        } else if (!Z.Util.isNil(containerDOM.clientWidth) && !Z.Util.isNil(containerDOM.clientHeight)) {
            width = parseInt(containerDOM.clientWidth, 0);
            height = parseInt(containerDOM.clientHeight, 0);
        } else {
            throw new Error('can not get size of container');
        }
        return new Z.Size(width, height);
    },

    _updateMapSize:function (mSize) {
        this.width = mSize['width'];
        this.height = mSize['height'];
        this._getRenderer().updateMapSize(mSize);
        return this;
    },

    /**
     * Gets projected center of the map
     * @return {maptalks.Coordinate}
     * @private
     */
    _getPrjCenter:function () {
        return this._prjCenter;
    },

    _setPrjCenter:function (pcenter) {
        this._prjCenter = pcenter;
    },

    _verifyExtent:function (center) {
        if (!center) {
            return false;
        }
        var maxExt = this.getMaxExtent();
        if (!maxExt) {
            return true;
        }
        return maxExt.contains(new Z.Coordinate(center));
    },

    /**
     * Move map's center by pixels.
     * @param  {maptalks.Point} pixel - pixels to move, the relation between value and direction is as:
     * -1,1 | 1,1
     * ------------
     *-1,-1 | 1,-1
     * @private
     * @returns {maptalks.Coordinate} the new projected center.
     */
    _offsetCenterByPixel:function (pixel) {
        var posX = this.width / 2 - pixel.x,
            posY = this.height / 2 - pixel.y;
        var pCenter = this._containerPointToPrj(new Z.Point(posX, posY));
        this._setPrjCenter(pCenter);
        return pCenter;
    },

    /**
     * offset map platform panel.
     *
     * @param  {maptalks.Point} offset - offset in pixel to move
     * @return {maptalks.Map} this
     */
    /**
     * Gets map platform panel's current view point.
     * @return {maptalks.Point}
     */
    offsetPlatform:function (offset) {
        if (!offset) {
            return this._mapViewPoint;
        } else {
            this._getRenderer().offsetPlatform(offset);
            this._mapViewPoint = this._mapViewPoint.add(offset);
            return this;
        }
    },

    _resetMapViewPoint:function () {
        this._mapViewPoint = new Z.Point(0, 0);
    },

    /**
     * Get map's current resolution
     * @return {Number} resolution
     * @private
     */
    _getResolution:function (zoom) {
        if (Z.Util.isNil(zoom)) {
            zoom = this.getZoom();
        }
        return this._view.getResolution(zoom);
    },

    _getResolutions:function () {
        return this._view.getResolutions();
    },

    /**
     * Converts the projected coordinate to a 2D point in the specific zoom
     * @param  {maptalks.Coordinate} pCoord - projected Coordinate
     * @param  {Number} zoom   - zoom level
     * @return {maptalks.Point} 2D point
     * @private
     */
    _prjToPoint:function (pCoord, zoom) {
        zoom = (zoom === undefined ? this.getZoom() : zoom);
        return this._view.getTransformation().transform(pCoord, this._getResolution(zoom));
    },

    /**
     * Converts the 2D point to projected coordinate
     * @param  {maptalks.Point} point - 2D point
     * @param  {Number} zoom   - zoom level
     * @return {maptalks.Coordinate} projected coordinate
     * @private
     */
    _pointToPrj:function (point, zoom) {
        zoom = (zoom === undefined ? this.getZoom() : zoom);
        return this._view.getTransformation().untransform(point, this._getResolution(zoom));
    },

    /**
     * transform container point to geographical projected coordinate
     *
     * @param  {maptalks.Point} containerPointt
     * @return {maptalks.Coordinate}
     * @private
     */
    _containerPointToPrj:function (containerPoint) {
        var centerPoint = this._prjToPoint(this._getPrjCenter());
        //容器的像素坐标方向是固定方向的, 和html标准一致, 即从左到右增大, 从上到下增大
        var point = new Z.Point(centerPoint.x + containerPoint.x - this.width / 2, centerPoint.y + containerPoint.y - this.height / 2);
        return this._pointToPrj(point);
    },

    /**
     * transform view point to geographical projected coordinate
     * @param  {maptalks.Point} viewPoint
     * @return {maptalks.Coordinate}
     * @private
     */
    _viewPointToPrj:function (viewPoint) {
        return this._containerPointToPrj(this.viewPointToContainerPoint(viewPoint));
    },

    /**
     * transform geographical projected coordinate to container point
     * @param  {maptalks.Coordinate} pCoordinate
     * @return {maptalks.Point}
     * @private
     */
    _prjToContainerPoint:function (pCoordinate) {
        var centerPoint = this._prjToPoint(this._getPrjCenter());
        var point = this._prjToPoint(pCoordinate);
        return new Z.Point(
            this.width / 2 + point.x - centerPoint.x,
            this.height / 2 + point.y - centerPoint.y
            );
    },

    /**
     * transform geographical projected coordinate to view point
     * @param  {maptalks.Coordinate} pCoordinate
     * @return {maptalks.Point}
     * @private
     */
    _prjToViewPoint:function (pCoordinate) {
        var containerPoint = this._prjToContainerPoint(pCoordinate);
        return this._containerPointToViewPoint(containerPoint);
    },

    //destructive containerPointToViewPoint
    _containerPointToViewPoint: function (containerPoint) {
        if (!containerPoint) { return null; }
        var platformOffset = this.offsetPlatform();
        return containerPoint._substract(platformOffset);
    }
});




//--------------hooks after map loaded----------------
Z.Map.prototype._callOnLoadHooks = function () {
    var proto = Z.Map.prototype;
    for (var i = 0, len = proto._onLoadHooks.length; i < len; i++) {
        proto._onLoadHooks[i].call(this);
    }
};

/**
 * Add hooks for additional codes when map's loading complete, useful for plugin developping.
 * @param {function} fn
 * @returns {maptalks.Map}
 * @static
 * @protected
 */
Z.Map.addOnLoadHook = function (fn) { // (Function) || (String, args...)
    var args = Array.prototype.slice.call(arguments, 1);

    var onload = typeof fn === 'function' ? fn : function () {
        this[fn].apply(this, args);
    };

    this.prototype._onLoadHooks = this.prototype._onLoadHooks || [];
    this.prototype._onLoadHooks.push(onload);
    return this;
};


Z.Util.extend(Z.Map, Z.Renderable);

Z.Map.include(/** @lends maptalks.Map.prototype */{
    /**
     * Pan to the given coordinate
     * @param {maptalks.Coordinate} coordinate - coordinate to pan to
     * @param {Object} [options=null] - pan options
     * @param {Boolean} [options.animation=null] - whether pan with animation
     * @param {Boolean} [options.duration=600] - pan animation duration
     * @return {maptalks.Map} this
     */
    panTo:function (coordinate, options) {
        if (!coordinate) {
            return this;
        }
        var map = this;
        coordinate = new Z.Coordinate(coordinate);
        var dest = this.coordinateToViewPoint(coordinate),
            current = this.coordinateToViewPoint(this.getCenter());
        return this._panBy(dest.substract(current), options, function () {
            var c = map.getProjection().project(coordinate);
            map._setPrjCenterAndMove(c);
        });
    },

    /**
     * Pan the map by the give point
     * @param  {maptalks.Point} point - distance to pan, in pixel
     * @param {Object} [options=null] - pan options
     * @param {Boolean} [options.animation=null] - whether pan with animation
     * @param {Boolean} [options.duration=600] - pan animation duration
     * @return {maptalks.Map} this
     */
    panBy:function (offset, options) {
        return this._panBy(offset, options);
    },

    _panBy: function (offset, options, cb) {
        if (!offset) {
            return this;
        }
        offset = new Z.Point(offset).multi(-1);
        this._onMoveStart();
        if (!options) {
            options = {};
        }
        if (typeof (options['animation']) === 'undefined' || options['animation']) {
            this._panAnimation(offset, options['duration'], cb);
        } else {
            this.offsetPlatform(offset);
            this._offsetCenterByPixel(offset);
            this._onMoving();
            if (cb) {
                cb();
            }
            this._onMoveEnd();
        }
        return this;
    },

    _panAnimation:function (offset, t, onFinish) {
        this._getRenderer().panAnimation(offset, t, onFinish);
    }

});

Z.Map.include(/** @lends maptalks.Map.prototype */{
    _zoom:function (nextZoomLevel, origin, startScale) {
        if (!this.options['zoomable']) { return; }
        this._originZoomLevel = this.getZoom();
        nextZoomLevel = this._checkZoomLevel(nextZoomLevel);
        this._onZoomStart(nextZoomLevel);
        var zoomOffset;
        if (origin) {
            origin = new Z.Point(this.width / 2, this.height / 2);
            zoomOffset = this._getZoomCenterOffset(nextZoomLevel, origin, startScale);
        }
        this._onZoomEnd(nextZoomLevel, zoomOffset);
    },

    _zoomAnimation:function (nextZoomLevel, origin, startScale) {
        if (!this.options['zoomable']) { return; }
        if (Z.Util.isNil(startScale)) {
            startScale = 1;
        }
        if (Z.Util.isNil(this._originZoomLevel)) {
            this._originZoomLevel = this.getZoom();
        }
        nextZoomLevel = this._checkZoomLevel(nextZoomLevel);
        if (this._originZoomLevel === nextZoomLevel) {
            return;
        }

        this._onZoomStart(nextZoomLevel);
        if (!origin) {
            origin = new Z.Point(this.width / 2, this.height / 2);
        }
        this._startZoomAnimation(startScale, origin, nextZoomLevel);
    },

    _startZoomAnimation:function (startScale, transOrigin, nextZoomLevel) {
        var me = this;
        var resolutions = this._getResolutions();
        var endScale = resolutions[this._originZoomLevel] / resolutions[nextZoomLevel];
        var zoomOffset = this._getZoomCenterOffset(nextZoomLevel, transOrigin, startScale);
        if (zoomOffset.x === 0 && zoomOffset.y === 0) {
            //center is out of maxExtent
            transOrigin = new Z.Point(this.width / 2, this.height / 2);
        }
        var duration = this.options['zoomAnimationDuration'] * Math.abs(endScale - startScale) / Math.abs(endScale - 1);
        this._getRenderer().onZoomStart(
            {
                startScale : startScale,
                endScale : endScale,
                origin : transOrigin,
                duration : duration
            },
            function () {
                me._onZoomEnd(nextZoomLevel, zoomOffset);
            }
        );
    },

    _onZoomStart: function (nextZoomLevel) {
        this._zooming = true;
        this._enablePanAnimation = false;
        this._fireEvent('zoomstart', {'from' : this._originZoomLevel, 'to': nextZoomLevel});
    },

    _onZoomEnd:function (nextZoomLevel, zoomOffset) {
        this._zoomLevel = nextZoomLevel;
        if (zoomOffset) {
            this._offsetCenterByPixel(zoomOffset._multi(-1));
        }
        var _originZoomLevel = this._originZoomLevel;
        this._originZoomLevel = nextZoomLevel;
        this._getRenderer().onZoomEnd();
        this._zooming = false;
        /**
          * zoomend event
          * @event maptalks.Map#zoomend
          * @type {Object}
          * @property {String} type                    - zoomend
          * @property {String} target                  - the map fires event
          * @property {Number} from                    - zoom level zooming from
          * @property {Number} to                      - zoom level zooming to
          */
        this._fireEvent('zoomend', {'from' : _originZoomLevel, 'to': nextZoomLevel});
        this.checkSize();
    },


    _checkZoomLevel:function (nextZoomLevel) {
        var maxZoom = this.getMaxZoom(),
            minZoom = this.getMinZoom();
        if (nextZoomLevel < minZoom) {
            nextZoomLevel = minZoom;
        }
        if (nextZoomLevel > maxZoom) {
            nextZoomLevel = maxZoom;
        }
        return nextZoomLevel;
    },

    _getZoomCenterOffset:function (nextZoomLevel, origin, startScale) {
        if (Z.Util.isNil(startScale)) {
            startScale = 1;
        }
        var resolutions = this._getResolutions();
        var zScale;
        var zoomOffset;
        if (nextZoomLevel < this._originZoomLevel) {
            zScale = resolutions[nextZoomLevel + 1] / resolutions[nextZoomLevel];
            zoomOffset = new Z.Point(
                    -(origin.x - this.width / 2) * (startScale - zScale),
                    -(origin.y - this.height / 2) * (startScale - zScale)
                );
        } else {
            zScale = resolutions[nextZoomLevel - 1] / resolutions[nextZoomLevel];
            zoomOffset = new Z.Point(
                    (origin.x - this.width / 2) * (zScale - startScale),
                    (origin.y - this.height / 2) * (zScale - startScale)
                );
        }

        var newCenter = this.containerPointToCoordinate(new Z.Point(this.width / 2 + zoomOffset.x, this.height / 2 + zoomOffset.y));
        if (!this._verifyExtent(newCenter)) {
            return new Z.Point(0, 0);
        }

        return zoomOffset;
    },

    _getZoomMillisecs:function () {
        return 600;
    }
});

/**
 * Methods of topo computations
 */
Z.Map.include(/** @lends maptalks.Map.prototype */{
    /**
     * Caculate distance of two coordinates.
     * @param {Number[]|maptalks.Coordinate} coord1 - coordinate 1
     * @param {Number[]|maptalks.Coordinate} coord2 - coordinate 2
     * @return {Number} distance
     */
    computeLength: function (coord1, coord2) {
        if (!this.getProjection()) { return null; }
        var p1 = new Z.Coordinate(coord1),
            p2 = new Z.Coordinate(coord2);
        if (p1.equals(p2)) { return 0; }
        return this.getProjection().measureLength(p1, p2);
    },

    /**
     * Caculate a geometry's length.
     * @param {maptalks.Geometry} geometry - geometry to caculate
     * @return {Number} length
     */
    computeGeometryLength:function (geometry) {
        return geometry._computeGeodesicLength(this.getProjection());
    },

    /**
     * Caculate a geometry's area.
     * @param  {maptalks.Geometry} geometry - geometry to caculate
     * @return {Number} area
     */
    computeGeometryArea:function (geometry) {
        return geometry._computeGeodesicArea(this.getProjection());
    },

    /**
     * Identify the geometries on the given coordinate.
     * @param {Object} opts - the identify options
     * @param {maptalks.Coordinate} opts.coordinate - coordinate to identify
     * @param {Object}   opts.layers        - the layers to perform identify on.
     * @param {Function} [opts.filter=null] - filter function of the result geometries, return false to exclude.
     * @param {Number}   [opts.count=null]  - limit of the result count.
     * @param {Boolean}  [opts.includeInternals=false] - whether to identify the internal layers.
     * @param {Function} callback           - the callback function using the result geometries as the parameter.
     * @return {maptalks.Map} this
     */
    identify: function (opts, callback) {
        if (!opts) {
            return this;
        }
        var reqLayers = opts['layers'];
        if (!Z.Util.isArrayHasData(reqLayers)) {
            return this;
        }
        var layers = [];
        var i, len;
        for (i = 0, len = reqLayers.length; i < len; i++) {
            if (Z.Util.isString(reqLayers[i])) {
                layers.push(this.getLayer(reqLayers[i]));
            } else {
                layers.push(reqLayers[i]);
            }
        }
        var point = this.coordinateToViewPoint(opts['coordinate'])._round();
        var fn = callback,
            filter = opts['filter'];
        var hits = [],
            isEnd = false;
        for (i = layers.length - 1; i >= 0; i--) {
            if (isEnd) {
                break;
            }
            var layer = layers[i];
            if (!layer || !layer.getMap() || (!opts['includeInternals'] && layer.getId().indexOf(Z.internalLayerPrefix) >= 0)) {
                continue;
            }
            var allGeos = layers[i].getGeometries();
            for (var j = allGeos.length - 1; j >= 0; j--) {
                var geo = allGeos[j];
                if (!geo || !geo.isVisible()) {
                    continue;
                }
                var pxExtent = !geo._getPainter() ? null : geo._getPainter().getViewExtent();
                if (!pxExtent || !pxExtent.contains(point)) {
                    continue;
                }
                if (geo._containsPoint(point) && (!filter || (filter && filter(geo)))) {
                    hits.push(geo);
                    if (opts['count']) {
                        if (hits.length >= opts['count']) {
                            isEnd = true;
                            break;
                        }
                    }
                }
            }
        }
        fn.call(this, hits);
        return this;
    }

});

Z.Map.include(/** @lends maptalks.Map.prototype */{
    _registerDomEvents: function (remove) {
        var events = /**
                      * mousedown event
                      * @event maptalks.Map#mousedown
                      * @type {Object}
                      * @property {String} type                    - mousedown
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'mousedown ' +
                     /**
                      * mouseup event
                      * @event maptalks.Map#mouseup
                      * @type {Object}
                      * @property {String} type                    - mouseup
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'mouseup ' +
                     /**
                      * mouseover event
                      * @event maptalks.Map#mouseover
                      * @type {Object}
                      * @property {String} type                    - mouseover
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'mouseover ' +
                     /**
                      * mouseout event
                      * @event maptalks.Map#mouseout
                      * @type {Object}
                      * @property {String} type                    - mouseout
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'mouseout ' +
                     /**
                      * mousemove event
                      * @event maptalks.Map#mousemove
                      * @type {Object}
                      * @property {String} type                    - mousemove
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'mousemove ' +
                     /**
                      * click event
                      * @event maptalks.Map#click
                      * @type {Object}
                      * @property {String} type                    - click
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'click ' +
                     /**
                      * dblclick event
                      * @event maptalks.Map#dblclick
                      * @type {Object}
                      * @property {String} type                    - dblclick
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'dblclick ' +
                     /**
                      * contextmenu event
                      * @event maptalks.Map#contextmenu
                      * @type {Object}
                      * @property {String} type                    - contextmenu
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'contextmenu ' +
                     /**
                      * keypress event
                      * @event maptalks.Map#keypress
                      * @type {Object}
                      * @property {String} type                    - keypress
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'keypress ' +
                     /**
                      * touchstart event
                      * @event maptalks.Map#touchstart
                      * @type {Object}
                      * @property {String} type                    - touchstart
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'touchstart ' +
                     /**
                      * touchmove event
                      * @event maptalks.Map#touchmove
                      * @type {Object}
                      * @property {String} type                    - touchmove
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'touchmove ' +
                     /**
                      * touchend event
                      * @event maptalks.Map#touchend
                      * @type {Object}
                      * @property {String} type                    - touchend
                      * @property {String} target                  - the map fires event
                      * @property {maptalks.Coordinate} coordinate - coordinate of the event
                      * @property {maptalks.Point} containerPoint  - container point of the event
                      * @property {maptalks.Point} viewPoint       - view point of the event
                      * @property {Event} domEvent                 - dom event
                      */
                     'touchend ';
        //phantomjs will crash when registering events on canvasContainer
        var dom = this._panels.mapWrapper || this._containerDOM;
        if (remove) {
            Z.DomUtil.removeDomEvent(dom, events, this._handleDOMEvent, this);
        } else {
            Z.DomUtil.addDomEvent(dom, events, this._handleDOMEvent, this);
        }

    },

    _handleDOMEvent: function (e) {
        if (this._ignoreEvent(e)) {
            return;
        }
        var type = e.type;
        this._fireDOMEvent(this, e, type);
    },

    _ignoreEvent: function (domEvent) {
        //ignore events originated from control doms.
        if (!domEvent || !this._panels.control) {
            return false;
        }
        var target = domEvent.srcElement || domEvent.target;
        if (target) {
            while (target && target !== this._containerDOM) {
                if (target.className === 'maptalks-control') {
                    return true;
                }
                target = target.parentNode;
            }

        }
        return false;
    },

    _parseEvent:function (e, type) {
        var eventParam = {
            'domEvent': e
        };
        if (type !== 'keypress') {
            var actual = e.touches ? e.touches[0] : e;
            if (actual) {
                var containerPoint = Z.DomUtil.getEventContainerPoint(actual, this._containerDOM);
                eventParam['coordinate'] = this.containerPointToCoordinate(containerPoint);
                eventParam['containerPoint'] = containerPoint;
                eventParam['viewPoint'] = this.containerPointToViewPoint(containerPoint);
            }
        }
        return eventParam;
    },

    _fireDOMEvent: function (target, e, type) {
        var eventParam = this._parseEvent(e, type);

        //阻止右键菜单
        if (type === 'contextmenu') {
            Z.DomUtil.preventDefault(e);
        }
        if (type === 'mousedown' || type === 'click') {
            var button = e.button;
            if (button === 2) {
                type = 'contextmenu';
            }
        }
        this._fireEvent(type, eventParam);
    }
});

Z.Map.include(/** @lends maptalks.Map.prototype */{
    /**
     * Request for the full screen
     * @return {maptalks.Map} this
     */
    requestFullScreen: function () {
        /**
          * fullscreenstart event
          * @event maptalks.Map#fullscreenstart
          * @type {Object}
          * @property {String} type                    - fullscreenstart
          * @property {String} target                  - the map fires event
          */
        this._fireEvent('fullscreenstart');
        this._requestFullScreen(this._containerDOM);
        /**
          * fullscreenend event
          * @event maptalks.Map#fullscreenend
          * @type {Object}
          * @property {String} type                    - fullscreenend
          * @property {String} target                  - the map fires event
          */
        this._fireEvent('fullscreenend');
        return this;
    },

    /**
     * Cancel full screen
     * @return {maptalks.Map} this
     */
    cancelFullScreen: function () {
        this._cancelFullScreen(this._containerDOM);
        /**
          * cancelfullscreen event
          * @event maptalks.Map#cancelfullscreen
          * @type {Object}
          * @property {String} type                    - cancelfullscreen
          * @property {String} target                  - the map fires event
          */
        this._fireEvent('cancelfullscreen');
        return this;
    },

    _requestFullScreen: function (dom) {
        if (dom.requestFullScreen) {
            dom.requestFullScreen();
        } else if (dom.mozRequestFullScreen) {
            dom.mozRequestFullScreen();
        } else if (dom.webkitRequestFullScreen) {
            dom.webkitRequestFullScreen();
        } else if (dom.msRequestFullScreen) {
            dom.msRequestFullScreen();
        } else {
            var features = 'fullscreen=1,status=no,resizable=yes,top=0,left=0,scrollbars=no,' +
                'titlebar=no,menubar=no,location=no,toolbar=no,z-look=yes,' +
                'width=' + (screen.availWidth - 8) + ',height=' + (screen.availHeight - 45);
            var newWin = window.open(location.href, '_blank', features);
            if (newWin !== null) {
                window.opener = null;
                //关闭父窗口
                window.close();
            }
        }
    },

    _cancelFullScreen: function () {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else {
            var features = 'fullscreen=no,status=yes,resizable=yes,scrollbars=no,' +
                'titlebar=no,menubar=yes,location=yes,toolbar=yes,z-look=yes';
            var newWin = window.open(location.href, '_blank', features);
            if (newWin !== null) {
                window.opener = null;
                //关闭父窗口
                window.close();
            }
        }
    }
});

/** Profile **/

/**
 * Reproduce a Layer from layer's profile JSON.
 * @param  {Object} layerJSON - layer's profile JSON
 * @return {maptalks.Layer}
 * @static
 * @function
 */
Z.Layer.fromJSON = function (layerJSON) {
    if (!layerJSON) { return null; }
    var layerType = layerJSON['type'];
    if (layerType === 'vector') {
        layerType = layerJSON['type'] = 'VectorLayer';
    } else if (layerType === 'dynamic') {
        layerType = layerJSON['type'] = 'DynamicLayer';
    } else if (layerType === 'tile') {
        layerType = layerJSON['type'] = 'TileLayer';
    }
    if (typeof Z[layerType] === 'undefined' || !Z[layerType]._fromJSON) {
        throw new Error('unsupported layer type:' + layerType);
    }
    return Z[layerType]._fromJSON(layerJSON);
};

Z.Map.include(/** @lends maptalks.Map.prototype */{
    /**
     * @property {String}  - Version of the [profile]{@link maptalks.Map#toJSON} JSON schema.
     * @constant
     * @static
     */
    'PROFILE_VERSION' : '1.0',
    /**
     * Export the map's profile json. <br>
     * Map's profile is a snapshot of the map in JSON format. <br>
     * It can be used to reproduce the instance by [fromJSON]{@link maptalks.Map#fromJSON} method
     * @param  {Object} [options=null] - export options
     * @param  {Boolean|Object} [options.baseLayer=null] - whether to export base layer's profile, if yes, it will be used as layer's toJSON options.
     * @param  {Boolean|maptalks.Extent} [options.clipExtent=null] - if set with an extent instance, only the geometries intersectes with the extent will be exported.
     *                                                             If set to true, map's current extent will be used.
     * @param  {Boolean|Object|Object[]} [options.layers=null] - whether to export other layers' profile, if yes, it will be used as layer's toJSON options.
     *                                                        It can also be a array of layer export options with a "id" attribute to filter the layers to export.
     * @return {Object} layer's profile JSON
     */
    toJSON:function (options) {
        if (!options) {
            options = {};
        }
        var profile = {
            'version': this['PROFILE_VERSION'],
            'extent' : this.getExtent().toJSON()
        };
        profile['options'] = this.config();
        profile['options']['center'] = this.getCenter();
        profile['options']['zoom'] = this.getZoom();

        var baseLayer = this.getBaseLayer();
        if ((Z.Util.isNil(options['baseLayer']) || options['baseLayer']) && baseLayer) {
            profile['baseLayer'] = baseLayer.toJSON(options['baseLayer']);
        }
        var extraLayerOptions = {};
        if (options['clipExtent']) {
            //if clipExtent is set, only geometries intersecting with extent will be exported.
            //clipExtent's value can be an extent or true (map's current extent)
            if (options['clipExtent'] === true)  {
                extraLayerOptions['clipExtent'] = this.getExtent();
            } else {
                extraLayerOptions['clipExtent'] = options['clipExtent'];
            }
        }
        var i, len, layers, opts,
            layersJSON = [];
        if (Z.Util.isNil(options['layers']) || (options['layers'] && !Z.Util.isArray(options['layers']))) {
            layers = this.getLayers();
            for (i = 0, len = layers.length; i < len; i++) {
                if (!layers[i].toJSON) {
                    continue;
                }
                opts = Z.Util.extend({}, Z.Util.isObject(options['layers']) ? options['layers'] : {}, extraLayerOptions);
                layersJSON.push(layers[i].toJSON(opts));
            }
            profile['layers'] = layersJSON;
        } else if (Z.Util.isArrayHasData(options['layers'])) {
            layers = options['layers'];
            for (i = 0; i < layers.length; i++) {
                var exportOption = layers[i];
                var layer = this.getLayer(exportOption['id']);
                if (!layer.toJSON) {
                    continue;
                }
                opts = Z.Util.extend({}, exportOption['options'], extraLayerOptions);
                layersJSON.push(layer.toJSON(opts));
            }
            profile['layers'] = layersJSON;
        } else {
            profile['layers'] = [];
        }
        return profile;
    }
});

/**
 * Reproduce a map from map's profile JSON.
 * @param {(string|HTMLElement|object)} container - The container to create the map on, can be:<br>
 *                                          1. A HTMLElement container.<br/>
 *                                          2. ID of a HTMLElement container.<br/>
 *                                          3. A canvas compatible container in node,
 *                                          e.g. [node-canvas]{@link https://github.com/Automattic/node-canvas},
 *                                              [canvas2svg]{@link https://github.com/gliffy/canvas2svg}
 * @param  {Object} mapJSON - map's profile JSON
 * @param  {Object} [options=null] - options
 * @param  {Object} [options.baseLayer=null] - whether to import the baseLayer
 * @param  {Object} [options.layers=null]    - whether to import the layers
 * @return {maptalks.Map}
 * @static
 * @function
 */
Z.Map.fromJSON = function (container, profile, options) {
    if (!container || !profile) {
        return null;
    }
    if (!options) {
        options = {};
    }
    var map = new Z.Map(container, profile['options']);
    if (Z.Util.isNil(options['baseLayer']) || options['baseLayer']) {
        var baseLayer = Z.Layer.fromJSON(profile['baseLayer']);
        if (baseLayer) {
            map.setBaseLayer(baseLayer);
        }
    }
    if (Z.Util.isNil(options['layers']) || options['layers']) {
        var layers = [];
        var layerJSONs = profile['layers'];
        for (var i = 0; i < layerJSONs.length; i++) {
            var layer = Z.Layer.fromJSON(layerJSONs[i]);
            layers.push(layer);
        }
        map.addLayer(layers);
    }

    return map;
};

Z.Map.mergeOptions({
    'draggable': true
});

Z.Map.Drag = Z.Handler.extend({
    addHooks: function () {
        var map = this.target;
        if (!map) { return; }
        this.dom = map._panels.mapWrapper || map._containerDOM;
        this._dragHandler = new Z.Handler.Drag(this.dom);
        this._dragHandler.on('mousedown', this._onMouseDown, this)
            .on('dragstart', this._onDragStart, this)
            .on('dragging', this._onDragging, this)
            .on('dragend', this._onDragEnd, this)
            .enable();
    },

    removeHooks: function () {
        this._dragHandler.off('mousedown', this._onMouseDown, this)
                .off('dragstart', this._onDragStart, this)
                .off('dragging', this._onDragging, this)
                .off('dragend', this._onDragEnd, this)
                .disable();
        delete this._dragHandler;
    },

    _ignore: function (param) {
        if (!param || !param.domEvent) {
            return false;
        }
        return this.target._ignoreEvent(param.domEvent);
    },


    _onMouseDown:function (param) {
        if (this._ignore(param)) {
            return;
        }
        if (this.target._panAnimating) {
            this.target._enablePanAnimation = false;
        }
    },

    _onDragStart:function (param) {
        if (this._ignore(param)) {
            return;
        }
        var map = this.target;
        this.startDragTime = new Date().getTime();
        var domOffset = map.offsetPlatform();
        this.startLeft = domOffset.x;
        this.startTop = domOffset.y;
        this.preX = param['mousePos'].x;
        this.preY = param['mousePos'].y;
        this.startX = this.preX;
        this.startY = this.preY;
        map._onMoveStart();
    },

    _onDragging:function (param) {
        if (this._ignore(param)) {
            return;
        }
        Z.DomUtil.preventDefault(param['domEvent']);
        if (this.startLeft === undefined) {
            return;
        }
        var map = this.target;
        var mx = param['mousePos'].x,
            my = param['mousePos'].y;
        var nextLeft = (this.startLeft + mx - this.startX);
        var nextTop = (this.startTop + my - this.startY);
        var mapPos = map.offsetPlatform();
        var offset = new Z.Point(nextLeft, nextTop)._substract(mapPos);
        map.offsetPlatform(offset);
        map._offsetCenterByPixel(offset);
        map._onMoving();
    },

    _onDragEnd:function (param) {
        if (this._ignore(param)) {
            return;
        }
        Z.DomUtil.preventDefault(param['domEvent']);
        if (this.startLeft === undefined) {
            return;
        }
        var map = this.target;
        var t = new Date().getTime() - this.startDragTime;
        var domOffset = map.offsetPlatform();
        var xSpan =  domOffset.x - this.startLeft;
        var ySpan =  domOffset.y - this.startTop;

        delete this.startLeft;
        delete this.startTop;
        delete this.preX;
        delete this.preY;
        delete this.startX;
        delete this.startY;

        if (t < 280 && Math.abs(ySpan) + Math.abs(xSpan) > 5) {
            var distance = new Z.Point(xSpan * Math.ceil(500 / t), ySpan * Math.ceil(500 / t)).multi(0.5);
            t = 5 * t * (Math.abs(distance.x) + Math.abs(distance.y)) / 600;
            map._panAnimation(distance._multi(2 / 3), t);
        } else {
            map._onMoveEnd();
        }

    }
});

Z.Map.addInitHook('addHandler', 'draggable', Z.Map.Drag);

Z.Map.mergeOptions({
    'autoBorderPanning': false
});

Z.Map.AutoBorderPanning = Z.Handler.extend({
    //threshold to trigger panning, in px
    threshold : 10,
    //number of px to move when panning is triggered
    step : 4,

    addHooks: function () {
        this._dom = this.target._containerDOM;
        Z.DomUtil.on(this._dom, 'mousemove', this._onMouseMove, this);
        Z.DomUtil.on(this._dom, 'mouseout', this._onMouseOut, this);
    },

    removeHooks: function () {
        this._cancelPan();
        Z.DomUtil.off(this._dom, 'mousemove', this._onMouseMove, this);
        Z.DomUtil.off(this._dom, 'mouseout', this._onMouseOut, this);
    },

    _onMouseMove: function (event) {
        var eventParam = this.target._parseEvent(event);
        var mousePos = eventParam['containerPoint'];
        var size = this.target.getSize();
        var tests = [mousePos.x, size['width'] - mousePos.x,
                mousePos.y, size['height'] - mousePos.y];

        var min = Math.min.apply(Math, tests),
            absMin = Math.abs(min);

        if (absMin === 0 || absMin > this.threshold) {
            this._cancelPan();
            return;
        }
        var step = this.step;
        var offset = new Z.Point(0, 0);
        if (tests[0] === min) {
            offset.x = -step;
        } else if (tests[1] === min) {
            offset.x = step;
        }
        if (tests[2] === min) {
            offset.y = -step;
        } else if (tests[3] === min) {
            offset.y = step;
        }
        this._stepOffset = offset;
        this._pan();
    },

    _onMouseOut: function () {
        this._cancelPan();
    },

    _cancelPan:function () {
        delete this._stepOffset;
        if (this._animationId) {
            Z.Util.cancelAnimFrame(this._animationId);
            delete this._animationId;
        }
    },

    _pan:function () {
        if (this._stepOffset) {
            this.target.panBy(this._stepOffset, {
                'animation':false
            });
            this._animationId = Z.Util.requestAnimFrame(Z.Util.bind(this._pan, this));
        }
    }
});

Z.Map.addInitHook('addHandler', 'autoBorderPanning', Z.Map.AutoBorderPanning);

Z.Map.mergeOptions({
    'doubleClickZoom': true
});

Z.Map.DoubleClickZoom = Z.Handler.extend({
    addHooks: function () {
        this.target.on('_dblclick', this._onDoubleClick, this);
    },

    removeHooks: function () {
        this.target.off('_dblclick', this._onDoubleClick, this);
    },

    _onDoubleClick: function (param) {
        var map = this.target;
        if (map.options['doubleClickZoom']) {
            var oldZoom = map.getZoom(),
                zoom = param['domEvent']['shiftKey'] ? Math.ceil(oldZoom) - 1 : Math.floor(oldZoom) + 1;
            map._zoomAnimation(zoom, param['containerPoint']);
        }

    }
});

Z.Map.addInitHook('addHandler', 'doubleClickZoom', Z.Map.DoubleClickZoom);

Z.Map.mergeOptions({
    'scrollWheelZoom': true
});

Z.Map.ScrollWheelZoom = Z.Handler.extend({
    addHooks: function () {
        Z.DomUtil.addDomEvent(this.target._containerDOM, 'mousewheel', this._onWheelScroll, this);
    },

    removeHooks: function () {
        Z.DomUtil.removeDomEvent(this.target._containerDOM, 'mousewheel', this._onWheelScroll);
    },

    _onWheelScroll: function (evt) {
        var map = this.target;
        var _containerDOM = map._containerDOM;
        Z.DomUtil.preventDefault(evt);
        Z.DomUtil.stopPropagation(evt);
        if (map._zooming) { return false; }
        var _levelValue = 0;
        _levelValue += (evt.wheelDelta ? evt.wheelDelta : evt.detail) > 0 ? 1 : -1;
        if (evt.detail) {
            _levelValue *= -1;
        }
        var mouseOffset = Z.DomUtil.getEventContainerPoint(evt, _containerDOM);
        if (this._wheelExecutor) {
            clearTimeout(this._wheelExecutor);
        }
        this._wheelExecutor = setTimeout(function () {
            map._zoomAnimation(map.getZoom() + _levelValue, mouseOffset);
        }, 40);

        return false;
    }
    /*_onWheelScroll: function (evt) {
        var map = this.target;
        var containerDOM = map._containerDOM;
        Z.DomUtil.preventDefault(evt);
        Z.DomUtil.stopPropagation(evt);

        if (map._zooming || this._scaling) {return;}
        if (this._wheelExecutor) {
            clearTimeout(this._wheelExecutor);
        }
        this._scaling = true;
        var level = 0;
        level += (evt.wheelDelta?evt.wheelDelta:evt.detail) > 0 ? 1 : -1;
        if (evt.detail) {
            level *= -1;
        }
        var zoomPoint = Z.DomUtil.getEventContainerPoint(evt, containerDOM);
        if (Z.Util.isNil(this._targetZoom)) {
            this._targetZoom = map.getZoom();
        }
        var preZoom = this._targetZoom;
        this._targetZoom += level;
        this._targetZoom = map._checkZoomLevel(this._targetZoom);
        var scale = map._getResolution(map.getZoom())/map._getResolution(this._targetZoom);
        var preScale = map._getResolution(map.getZoom())/map._getResolution(preZoom);
        var render = map._getRenderer();
        var me = this;
        render.onZoomStart(preScale, scale, zoomPoint, 100, function() {
            me._scaling = false;
            map._zoom(me._targetZoom, zoomPoint);
            me._wheelExecutor = setTimeout(function () {
                console.log('zoomend');
                map._onZoomEnd(me._targetZoom);
                delete me._targetZoom;
            },100);
        });
        return false;
    }*/
});

Z.Map.addInitHook('addHandler', 'scrollWheelZoom', Z.Map.ScrollWheelZoom);

Z.Map.mergeOptions({
    'touchZoom': true,
    'touchZoomOrigin' : 'center'
});

//handler to zoom map by pinching
Z.Map.TouchZoom = Z.Handler.extend({
    addHooks: function () {
        Z.DomUtil.addDomEvent(this.target._containerDOM, 'touchstart', this._onTouchStart, this);
    },

    removeHooks: function () {
        Z.DomUtil.removeDomEvent(this.target._containerDOM, 'touchstart', this._onTouchStart);
    },

    _onTouchStart:function (event) {
        var map = this.target;
        if (!event.touches || event.touches.length !== 2 || map._zooming) { return; }
        var container = map._containerDOM;
        var p1 = Z.DomUtil.getEventContainerPoint(event.touches[0], container),
            p2 = Z.DomUtil.getEventContainerPoint(event.touches[1], container);

        this._startDist = p1.distanceTo(p2);
        this._startZoom = map.getZoom();
        if (map.options['touchZoomOrigin'] === 'pinch') {
            this._preOrigin = p1.add(p2)._multi(1 / 2);
        } else {
            var size = map.getSize();
            this._preOrigin = new Z.Point(size['width'] / 2, size['height'] / 2);
        }


        map._zooming = true;

        Z.DomUtil.addDomEvent(document, 'touchmove', this._onTouchMove, this)
            .addDomEvent(document, 'touchend', this._onTouchEnd, this);

        Z.DomUtil.preventDefault(event);
        map._fireEvent('touchzoomstart');
    },

    _onTouchMove:function (event) {
        var map = this.target;
        if (!event.touches || event.touches.length !== 2 || !map._zooming) { return; }
        var container = map._containerDOM,
            p1 = Z.DomUtil.getEventContainerPoint(event.touches[0], container),
            p2 = Z.DomUtil.getEventContainerPoint(event.touches[1], container),
            scale = p1.distanceTo(p2) / this._startDist;
        var origin;
        if (map.options['touchZoomOrigin'] === 'pinch') {
            origin = p1.add(p2)._multi(1 / 2);
        } else {
            var size = map.getSize();
            origin = new Z.Point(size['width'] / 2, size['height'] / 2);
        }
        var offset = this._preOrigin.substract(origin);
        map.offsetPlatform(offset);
        map._offsetCenterByPixel(offset);
        this._preOrigin = origin;
        this._scale = scale;

        var renderer = map._getRenderer();

        var matrix = renderer.getZoomMatrix(scale, origin, Z.Browser.retina);
        renderer.transform(matrix);

        Z.DomUtil.preventDefault(event);
    },

    _onTouchEnd:function () {
        var map = this.target;
        if (!map._zooming) {
            map._zooming = false;
            return;
        }
        map._zooming = false;

        Z.DomUtil
            .off(document, 'touchmove', this._onTouchMove, this)
            .off(document, 'touchend', this._onTouchEnd, this);

        var scale = this._scale;
        var zoom = map.getZoomForScale(scale);
        if (zoom === -1) {
            zoom = map.getZoom();
        }
        map._fireEvent('touchzoomend');
        map._zoomAnimation(zoom, this._preOrigin, this._scale);
    }
});


Z.Map.addInitHook('addHandler', 'touchZoom', Z.Map.TouchZoom);

Z.Map.mergeOptions({
    'geometryEvents': true
});

Z.Map.GeometryEvents = Z.Handler.extend({
    EVENTS: 'mousedown mouseup mousemove click dblclick contextmenu touchstart touchmove touchend',

    addHooks: function () {
        var map = this.target;
        var dom = map._panels.canvasContainer;
        if (dom) {
            Z.DomUtil.on(dom, this.EVENTS, this._identifyGeometryEvents, this);
        }

    },

    removeHooks: function () {
        var map = this.target;
        var dom = map._panels.canvasContainer;
        if (dom) {
            Z.DomUtil.off(dom, this.EVENTS, this._identifyGeometryEvents, this);
        }
    },

    _identifyGeometryEvents: function (domEvent) {
        var map = this.target;
        var vectorLayers = map._getLayers(function (layer) {
            if (layer instanceof Z.VectorLayer) {
                return true;
            }
            return false;
        });
        if (map._isBusy() || !vectorLayers || vectorLayers.length === 0) {
            return;
        }
        var layers = [];
        for (var i = 0; i < vectorLayers.length; i++) {
            if (vectorLayers[i].options['geometryEvents']) {
                layers.push(vectorLayers[i]);
            }
        }
        if (layers.length === 0) {
            return;
        }
        var eventType = domEvent.type,
            containerPoint = Z.DomUtil.getEventContainerPoint(domEvent, map._containerDOM),
            coordinate = map.containerPointToCoordinate(containerPoint);
        var geometryCursorStyle = null;
        var identifyOptions = {
            'includeInternals' : true,
            //return only one geometry on top,
            'filter':function (geometry) {
                var eventToFire = geometry._getEventTypeToFire(domEvent);
                if (eventType === 'mousemove') {
                    if (!geometryCursorStyle && geometry.options['cursor']) {
                        geometryCursorStyle = geometry.options['cursor'];
                    }
                    if (!geometry.listens('mousemove') && !geometry.listens('mouseover')) {
                        return false;
                    }
                } else if (!geometry.listens(eventToFire)) {
                    return false;
                }

                return true;
            },
            'count' : 1,
            'coordinate' : coordinate,
            'layers': layers
        };
        var callback = Z.Util.bind(fireGeometryEvent, this);
        var me = this;
        if (this._queryIdentifyTimeout) {
            Z.Util.cancelAnimFrame(this._queryIdentifyTimeout);
        }
        if (eventType === 'mousemove'  || eventType === 'touchmove') {
            this._queryIdentifyTimeout = Z.Util.requestAnimFrame(function () {
                map.identify(identifyOptions, callback);
            });
        } else {
            map.identify(identifyOptions, callback);
        }

        function fireGeometryEvent(geometries) {
            var i;
            if (eventType === 'mousemove') {
                var geoMap = {};
                if (Z.Util.isArrayHasData(geometries)) {
                    for (i = geometries.length - 1; i >= 0; i--) {
                        geoMap[geometries[i]._getInternalId()] = geometries[i];
                        geometries[i]._onEvent(domEvent);
                        //the first geometry is on the top, so ignore the latter cursors.
                        geometries[i]._onMouseOver(domEvent);
                    }
                }

                map._setPriorityCursor(geometryCursorStyle);

                var oldTargets = me._prevMouseOverTargets;
                me._prevMouseOverTargets = geometries;
                if (Z.Util.isArrayHasData(oldTargets)) {
                    for (i = oldTargets.length - 1; i >= 0; i--) {
                        var oldTarget = oldTargets[i];
                        var oldTargetId = oldTargets[i]._getInternalId();
                        if (geometries && geometries.length > 0) {
                            var mouseout = true;
                            /**
                            * 鼠标经过的新位置中不包含老的目标geometry
                            */
                            if (geoMap[oldTargetId]) {
                                mouseout = false;
                            }
                            if (mouseout) {
                                oldTarget._onMouseOut(domEvent);
                            }
                        } else { //鼠标新的位置不包含任何geometry，将触发之前target的mouseOut事件
                            oldTarget._onMouseOut(domEvent);
                        }
                    }
                }

            } else {
                if (!geometries || geometries.length === 0) { return; }
                // for (i = geometries.length - 1; i >= 0; i--) {
                geometries[geometries.length - 1]._onEvent(domEvent);
                // }
            }
        }

    }
});

Z.Map.addInitHook('addHandler', 'geometryEvents', Z.Map.GeometryEvents);

    /**
 * @namespace
 */
Z.renderer = {};


/**
 * @classdesc
 * Base Class for all the renderer based on HTML5 Canvas2D
 * @abstract
 * @class
 * @protected
 * @memberOf maptalks.renderer
 * @name Canvas
 * @extends {maptalks.Class}
 */
Z.renderer.Canvas = Z.Class.extend(/** @lends maptalks.renderer.Canvas.prototype */{
    isCanvasRender:function () {
        return true;
    },

    render:function () {
        this._prepareRender();
        if (!this.getMap()) {
            return;
        }
        if (!this._layer.isVisible()) {
            this._complete();
            return;
        }
        if (this.checkResources) {
            var me = this, args = arguments;
            var resources = this.checkResources.apply(this, args);
            if (Z.Util.isArrayHasData(resources)) {
                this._loadResources(resources).then(function () {
                    if (me._layer) {
                        me.draw.apply(me, args);
                    }
                });
            } else {
                this.draw.apply(this, args);
            }
        } else {
            this.draw.apply(this, arguments);
        }
    },

    remove: function () {
        if (this._onRemove) {
            this._onRemove();
        }
        delete this._canvas;
        delete this._context;
        delete this._viewExtent;
        delete this._resources;
        Z.renderer.Canvas.prototype._requestMapToRender.call(this);
        delete this._layer;
    },

    getMap: function () {
        if (!this._layer) {
            return null;
        }
        return this._layer.getMap();
    },

    getLayer:function () {
        return this._layer;
    },

    getCanvasImage:function () {
        if (!this._canvas) {
            return null;
        }
        if ((this._layer.isEmpty && this._layer.isEmpty()) || !this._viewExtent) {
            return null;
        }
        if (this.isBlank && this.isBlank()) {
            return null;
        }
        var size = this._viewExtent.getSize();
        var point = this._viewExtent.getMin();
        return {'image':this._canvas, 'layer':this._layer, 'point':this.getMap().viewPointToContainerPoint(point), 'size':size};
    },

    isLoaded:function () {
        if (this._loaded) {
            return true;
        }
        return false;
    },

    /**
     * 显示图层
     */
    show: function () {
        var mask = this._layer.getMask();
        if (mask) {
            mask._onZoomEnd();
        }
        this.render();
    },

    /**
     * 隐藏图层
     */
    hide: function () {
        this._clearCanvas();
        this._requestMapToRender();
    },

    setZIndex: function () {
        this._requestMapToRender();
    },

    getRenderZoom: function () {
        return this._renderZoom;
    },

    /**
     *
     * @param  {ViewPoint} point ViewPoint
     * @return {Boolean}       true|false
     */
    hitDetect:function (point) {
        if (!this._context || (this._layer.isEmpty && this._layer.isEmpty()) || this._errorThrown) {
            return false;
        }
        var viewExtent = this.getMap()._getViewExtent();
        var size = viewExtent.getSize();
        var leftTop = viewExtent.getMin();
        var detectPoint = point.substract(leftTop);
        if (detectPoint.x < 0 || detectPoint.x > size['width'] || detectPoint.y < 0 || detectPoint.y > size['height']) {
            return false;
        }
        try {
            var imgData = this._context.getImageData(detectPoint.x, detectPoint.y, 1, 1).data;
            if (imgData[3] > 0) {
                return true;
            }
        } catch (error) {
            if (!this._errorThrown) {
                console.warn('hit detect failed with tainted canvas, some geometries have external resources in another domain:\n', error);
                this._errorThrown = true;
            }
            //usually a CORS error will be thrown if the canvas uses resources from other domain.
            //this may happen when a geometry is filled with pattern file.
            return false;
        }
        return false;

    },

    /**
     * loadResource from resourceUrls
     * @param  {String[]} resourceUrls    - Array of urls to load
     * @param  {Function} onComplete          - callback after loading complete
     * @param  {Object} context         - callback's context
     */
    _loadResources:function (resourceUrls) {
        if (!this._resources) {
            this._resources = new Z.renderer.Canvas.Resources();
        }
        var resources = this._resources,
            promises = [];
        if (Z.Util.isArrayHasData(resourceUrls)) {
            var cache = {}, url;
            for (var i = resourceUrls.length - 1; i >= 0; i--) {
                url = resourceUrls[i];
                if (!url || cache[url.join('-')]) {
                    continue;
                }
                cache[url.join('-')] = 1;
                if (!resources.isResourceLoaded(url)) {
                    //closure it to preserve url's value
                    promises.push(new Z.Promise(this._promiseResource(url)));
                }
            }
        }
        return Z.Promise.all(promises);
    },

    _promiseResource: function (url) {
        var me = this, resources = this._resources,
            crossOrigin = this._layer.options['crossOrigin'];
        return function (resolve) {
            if (resources.isResourceLoaded(url)) {
                resolve({});
                return;
            }
            var img = new Image();
            if (crossOrigin) {
                img['crossOrigin'] = crossOrigin;
            }
            if (Z.Util.isSVG(url[0]) && !Z.node) {
                //amplify the svg image to reduce loading.
                if (url[1]) { url[1] *= 2; }
                if (url[2]) { url[2] *= 2; }
            }
            img.onload = function () {
                me._cacheResource(url, this);
                resolve({});
            };
            img.onabort = function (err) {
                console.warn('image loading aborted: ' + url[0]);
                if (err) {
                    console.warn(err);
                }
                resolve({});
            };
            img.onerror = function (err) {
                // console.warn('image loading failed: ' + url[0]);
                if (err && !Z.Browser.phantomjs) {
                    console.warn(err);
                }
                resources.markErrorResource(url);
                resolve({});
            };
            Z.Util.loadImage(img,  url);
        };

    },

    _cacheResource: function (url, img) {
        if (!this._layer) {
            return;
        }
        var w = url[1], h = url[2];
        if (this._layer.options['cacheSvgOnCanvas'] && Z.Util.isSVG(url[0]) === 1 && (Z.Browser.edge || Z.Browser.ie)) {
            //opacity of svg img painted on canvas is always 1, so we paint svg on a canvas at first.
            if (Z.Util.isNil(w)) {
                w = img.width || this._layer.options['defaultIconSize'][0];
            }
            if (Z.Util.isNil(h)) {
                h = img.height || this._layer.options['defaultIconSize'][1];
            }
            var canvas = Z.Canvas.createCanvas(w, h);
            Z.Canvas.image(canvas.getContext('2d'), img, 0, 0, w, h);
            img = canvas;
        }
        this._resources.addResource(url, img);
    },

    _prepareRender: function () {
        this._renderZoom = this.getMap().getZoom();
        this._viewExtent = this.getMap()._getViewExtent();
        this._loaded = false;
    },

    _requestMapToRender: function () {
        if (this.getMap()) {
            if (this._context) {
                this._layer.fire('renderend', {'context' : this._context});
            }
            this.getMap()._getRenderer().render();
        }
    },

    _fireLoadedEvent: function () {
        this._loaded = true;
        if (this._layer) {
            this._layer.fire('layerload');
        }
    },

    _complete: function () {
        this._requestMapToRender();
        this._fireLoadedEvent();
    },

    _createCanvas:function () {
        if (this._canvas) {
            return;
        }
        var map = this.getMap();
        var size = map.getSize();
        var r = Z.Browser.retina ? 2 : 1;
        this._canvas = Z.Canvas.createCanvas(r * size['width'], r * size['height'], map.CanvasClass);
        this._context = this._canvas.getContext('2d');
        if (Z.Browser.retina) {
            this._context.scale(2, 2);
        }
        Z.Canvas.setDefaultCanvasSetting(this._context);
    },

    _resizeCanvas:function (canvasSize) {
        if (!this._canvas) {
            return;
        }
        var size;
        if (!canvasSize) {
            var map = this.getMap();
            size = map.getSize();
        } else {
            size = canvasSize;
        }
        var r = Z.Browser.retina ? 2 : 1;
        //only make canvas bigger, never smaller
        if (this._canvas.width >= r * size['width'] && this._canvas.height >= r * size['height']) {
            return;
        }
        //retina support
        this._canvas.height = r * size['height'];
        this._canvas.width = r * size['width'];
        if (Z.Browser.retina) {
            this._context.scale(2, 2);
        }
    },

    _clearCanvas:function () {
        if (!this._canvas) {
            return;
        }
        Z.Canvas.clearRect(this._context, 0, 0, this._canvas.width, this._canvas.height);
    },

    _prepareCanvas:function () {
        if (this._clipped) {
            this._context.restore();
            this._clipped = false;
        }
        if (!this._canvas) {
            this._createCanvas();
        } else {
            this._clearCanvas();
        }
        var mask = this.getLayer().getMask();
        if (!mask) {
            return null;
        }
        var maskViewExtent = mask._getPainter().getViewExtent();
        if (!maskViewExtent.intersects(this._viewExtent)) {
            return maskViewExtent;
        }
        this._context.save();
        mask._getPainter().paint();
        this._context.clip();
        this._clipped = true;
        this._layer.fire('renderstart', {'context' : this._context});
        return maskViewExtent;
    },

    getPaintContext:function () {
        if (!this._context) {
            return null;
        }
        return [this._context, this._resources];
    },

    _getEvents: function () {
        return {
            '_zoomend' : this._onZoomEnd,
            '_resize'  : this._onResize,
            '_moveend' : this._onMoveEnd
        };
    },

    _onZoomEnd: function () {
        this.render();
    },

    _onMoveEnd: function () {
        this.render();
    },

    _onResize: function () {
        this._resizeCanvas();
        this.render();
    }
});

Z.renderer.Canvas.Resources = function () {
    this._resources = {};
    this._errors = {};
};

Z.Util.extend(Z.renderer.Canvas.Resources.prototype, {
    addResource:function (url, img) {
        this._resources[url[0]] = {
            image : img,
            width : +url[1],
            height : +url[2]
        };
    },

    isResourceLoaded:function (url) {
        if (this._errors[this._getImgUrl(url)]) {
            return true;
        }
        var img = this._resources[this._getImgUrl(url)];
        if (!img) {
            return false;
        }
        if (+url[1] > img.width || +url[2] > img.height) {
            return false;
        }
        return true;
    },

    getImage:function (url) {
        if (!this.isResourceLoaded(url) || this._errors[this._getImgUrl(url)]) {
            return null;
        }
        return this._resources[this._getImgUrl(url)].image;
    },

    markErrorResource:function (url) {
        this._errors[this._getImgUrl(url)] = 1;
    },

    _getImgUrl: function (url) {
        if (!Z.Util.isArray(url)) {
            return url;
        }
        return url[0];
    }
});

/**
 * @namespace
 */
Z.renderer.map = {};

/**
 * @classdesc
 * Base class for all the map renderers.
 * @class
 * @abstract
 * @protected
 * @memberOf maptalks.renderer.map
 * @name Renderer
 * @extends {maptalks.Class}
 */
Z.renderer.map.Renderer = Z.Class.extend(/** @lends Z.renderer.map.Renderer.prototype */{

    /**
     * get Transform Matrix for zooming
     * @param  {Number} scale  scale
     * @param  {Point} origin Transform Origin
     */
    getZoomMatrix:function (scale, origin, retina) {
        //matrix for layers to transform
        var view = this.map.containerPointToViewPoint(origin);
        var matrices  = {
            'container' : new Z.Matrix().translate(origin.x, origin.y)
                        .scaleU(scale).translate(-origin.x, -origin.y),
            'view'      : new Z.Matrix().translate(view.x, view.y)
                        .scaleU(scale).translate(-view.x, -view.y)
        };

        if (retina) {
            origin = origin.multi(2);
            matrices['retina'] = new Z.Matrix().translate(origin.x, origin.y)
                        .scaleU(scale).translate(-origin.x, -origin.y);
        }
        // var scale = matrices['container'].decompose()['scale'];
        matrices['scale'] = {x:scale, y:scale};
        return matrices;
    },

    panAnimation:function (distance, t, onFinish) {
        distance = new Z.Point(distance);
        var map = this.map;
        if (map.options['panAnimation']) {
            var duration;
            if (!t) {
                duration = map.options['panAnimationDuration'];
            } else {
                duration = t;
            }
            map._enablePanAnimation = true;
            map._panAnimating = true;
            var preDist = null;
            var player = Z.Animation.animate({
                'distance' : distance
            }, {
                'easing' : 'out',
                'speed' : duration
            }, function (frame) {
                if (!map._enablePanAnimation) {
                    player.finish();
                    map._panAnimating = false;
                    map._onMoveEnd();
                    return;
                }

                if (player.playState === 'running' && frame.styles['distance']) {
                    var dist = frame.styles['distance']._round();
                    if (!preDist) {
                        preDist = dist;
                    }
                    var offset = dist.substract(preDist);
                    map.offsetPlatform(offset);
                    map._offsetCenterByPixel(offset);
                    preDist = dist;
                    map._onMoving();
                } else if (player.playState === 'finished') {
                    map._panAnimating = false;
                    if (onFinish) {
                        onFinish();
                    }
                    map._onMoveEnd();
                }
            });
            player.play();
        } else {
            map._onMoveEnd();
        }
    },

    /**
     * 获取地图容器偏移量或更新地图容器偏移量
     * @param  {Point} offset 偏移量
     * @return {this | Point}
     */
    offsetPlatform:function (offset) {
        if (!this.map._panels.mapPlatform) {
            return this;
        }
        var mapPlatform = this.map._panels.mapPlatform;
        Z.DomUtil.offsetDom(mapPlatform, this.map.offsetPlatform().add(offset)._round());
        return this;
    },

    resetContainer:function () {
        this.map._resetMapViewPoint();
        if (this.map._panels.mapPlatform) {
            Z.DomUtil.offsetDom(this.map._panels.mapPlatform, new Z.Point(0, 0));
            this._resetCanvasContainer();
        }
    },

    _resetCanvasContainer: function () {
        var mapPos = this.map.offsetPlatform();
        var pos = mapPos.multi(-1)._round();
        this.map._panels.canvasContainer._pos = pos;
        Z.DomUtil.offsetDom(this.map._panels.canvasContainer, pos);
    },

    _getCanvasContainerPos: function () {
        if (this.map._panels && this.map._panels.canvasContainer) {
            return this.map._panels.canvasContainer._pos;
        }
        return null;
    },

    onZoomEnd:function () {
        this.resetContainer();
    }
});

/**
 * @classdesc
 * Renderer class based on HTML5 Canvas2d for maps.
 * @class
 * @protected
 * @memberOf maptalks.renderer.map
 * @name Canvas
 * @extends {Z.renderer.map.Renderer}
 * @param {maptalks.Map} map - map for the renderer
 */
Z.renderer.map.Canvas = Z.renderer.map.Renderer.extend(/** @lends Z.renderer.map.Canvas.prototype */{
    initialize:function (map) {
        this.map = map;
        //container is a <canvas> element
        this._isCanvasContainer = !!map._containerDOM.getContext;
        this._registerEvents();
    },

    isCanvasRender:function () {
        return true;
    },

    /**
     * 基于Canvas的渲染方法, layers总定义了要渲染的图层
     */
    render:function () {
        this.map._fireEvent('renderstart', {'context' : this._context});
        if (!this._canvas) {
            this._createCanvas();
        }
        var zoom = this.map.getZoom();
        var layers = this._getAllLayerToTransform();

        if (!this._updateCanvasSize()) {
            this._clearCanvas();
        }

        var mwidth = this._canvas.width,
            mheight = this._canvas.height;
        this._drawBackground();

        for (var i = 0, len = layers.length; i < len; i++) {
            if (!layers[i].isVisible() || !layers[i].isCanvasRender()) {
                continue;
            }
            var renderer = layers[i]._getRenderer();
            if (renderer && renderer.getRenderZoom() === zoom) {
                var layerImage = this._getLayerImage(layers[i]);
                if (layerImage && layerImage['image']) {
                    this._drawLayerCanvasImage(layers[i], layerImage, mwidth, mheight);
                }
            }
        }

        this.map._fireEvent('renderend', {'context' : this._context});
    },

    onZoomStart:function (options, fn) {
        if (Z.Browser.ielt9) {
            fn.call(this);
            return;
        }
        var map = this.map;
        this._clearCanvas();
        if (!map.options['zoomAnimation']) {
            fn.call(this);
            return;
        }
        var baseLayer = map.getBaseLayer(),
            baseLayerImage = this._getLayerImage(baseLayer);
        if (baseLayerImage) {
            this._storeBackground(baseLayerImage);
        }
        var layersToTransform = map.options['layerZoomAnimation'] ? null : [baseLayer],
            matrix;
        if (options.startScale === 1) {
            this._beforeTransform();
        }

        if (this._context) { this._context.save(); }
        var player = Z.Animation.animate(
            {
                'scale'  : [options.startScale, options.endScale]
            },
            {
                'easing' : 'out',
                'speed'  : options.duration
            },
            Z.Util.bind(function (frame) {
                matrix = this.getZoomMatrix(frame.styles['scale'], options.origin, Z.Browser.retina);
                if (player.playState === 'finished') {
                    this._afterTransform(matrix);
                    if (this._context) { this._context.restore(); }
                    fn.call(this);
                } else if (player.playState === 'running') {
                    this.transform(matrix, layersToTransform);
                    map._fireEvent('zooming', {'matrix' : matrix});
                }
            }, this)
        ).play();
    },

    /**
     * 对图层进行仿射变换
     * @param  {Matrix} matrix 变换矩阵
     * @param  {maptalks.Layer[]} layersToTransform 参与变换和绘制的图层
     */
    transform:function (matrix, layersToTransform) {
        var mwidth = this._canvas.width,
            mheight = this._canvas.height;
        var layers = layersToTransform || this._getAllLayerToTransform();
        this._clearCanvas();
        //automatically disable updatePointsWhileTransforming with mobile browsers.
        var transformLayers = !Z.Browser.mobile && this.map.options['layerTransforming'];
        if (!transformLayers) {
            this._context.save();
            this._applyTransform(matrix);
        }

        for (var i = 0, len = layers.length; i < len; i++) {
            if (!layers[i].isVisible()) {
                continue;
            }
            var renderer = layers[i]._getRenderer();
            if (renderer) {
                var transformed = false;
                if (renderer.transform) {
                    transformed = renderer.transform(matrix);
                }
                if (transformLayers && !transformed) {
                    this._context.save();
                    this._applyTransform(matrix);
                }

                var layerImage = this._getLayerImage(layers[i]);
                if (layerImage && layerImage['image']) {
                    this._drawLayerCanvasImage(layers[i], layerImage, mwidth, mheight);
                }
                if (transformLayers && !transformed) {
                    this._context.restore();
                }
            }
        }
        if (!transformLayers) {
            this._context.restore();
        }
    },

    updateMapSize:function (mSize) {
        if (!mSize || this._isCanvasContainer) { return; }
        var width = mSize['width'],
            height = mSize['height'];
        var panels = this.map._panels;
        panels.mapWrapper.style.width = width + 'px';
        panels.mapWrapper.style.height = height + 'px';
        panels.mapPlatform.style.width = width + 'px';
        panels.mapPlatform.style.height = height + 'px';
        panels.canvasContainer.style.width = width + 'px';
        panels.canvasContainer.style.height = height + 'px';
        panels.control.style.width = width + 'px';
        panels.control.style.height = height + 'px';
        this._updateCanvasSize();
    },

    getPanel: function () {
        if (this._isCanvasContainer) {
            return this.map._containerDOM;
        }
        return this.map._panels.mapWrapper;
    },

    toDataURL:function (mimeType) {
        if (!this._canvas) {
            return null;
        }
        return this._canvas.toDataURL(mimeType);
    },

    _getLayerImage: function (layer) {
        if (layer && layer._getRenderer() && layer._getRenderer().getCanvasImage) {
            return layer._getRenderer().getCanvasImage();
        }
        return null;
    },

    _beforeTransform: function () {
        var map = this.map;
        // redraw the map to prepare for zoom transforming.
        // if startScale is not 1 (usually by touchZoom on mobiles), it means map is already transformed and doesn't need redraw
        if (!map.options['layerZoomAnimation']) {
            var baseLayer = map.getBaseLayer(),
                baseLayerImage = this._getLayerImage(baseLayer);
            //zoom animation with better performance, only animate baseLayer, ignore other layers.
            if (baseLayerImage) {
                var width = this._canvas.width, height = this._canvas.height;
                this._drawLayerCanvasImage(baseLayer, baseLayerImage, width, height);
            }
        } else {
            //default zoom animation, animate all the layers.
            this.render();
        }
    },

    _afterTransform: function (matrix) {
        delete this._transMatrix;
        this._clearCanvas();
        this._applyTransform(matrix);
        this._drawBackground();
    },

    _applyTransform : function (matrix) {
        matrix = Z.Browser.retina ? matrix['retina'] : matrix['container'];
        matrix.applyToContext(this._context);
    },

    _getCountOfGeosToDraw: function () {
        var layers = this._getAllLayerToTransform(),
            geos, renderer,
            total = 0;
        for (var i = layers.length - 1; i >= 0; i--) {
            renderer = layers[i]._getRenderer();
            if ((layers[i] instanceof Z.VectorLayer) &&
                layers[i].isVisible() && !layers[i].isEmpty() && renderer._hasPointSymbolizer) {
                geos = renderer._geosToDraw;
                if (geos) {
                    total += renderer._geosToDraw.length;
                }
            }
        }
        return total;
    },

    /**
     * initialize container DOM of panels
     */
    initContainer:function () {
        var panels = this.map._panels;
        function createContainer(name, className, cssText, enableSelect) {
            var c = Z.DomUtil.createEl('div', className);
            if (cssText) {
                c.style.cssText = cssText;
            }
            panels[name] = c;
            if (!enableSelect) {
                Z.DomUtil.preventSelection(c);
            }
            return c;
        }
        var containerDOM = this.map._containerDOM;

        if (this._isCanvasContainer) {
            //container is a <canvas> element.
            return;
        }

        containerDOM.innerHTML = '';

        var control = createContainer('control', 'maptalks-control', null, true);
        var mapWrapper = createContainer('mapWrapper', 'maptalks-wrapper', 'position:absolute;overflow:hidden;', true);
        var mapPlatform = createContainer('mapPlatform', 'maptalks-platform', 'position:absolute;top:0px;left:0px;', true);
        var ui = createContainer('ui', 'maptalks-ui', 'position:absolute;top:0px;left:0px;border:none;', true);
        var layer = createContainer('layer', 'maptalks-layer', 'position:absolute;left:0px;top:0px;');
        var canvasContainer = createContainer('canvasContainer', 'maptalks-layer-canvas', 'position:absolute;top:0px;left:0px;border:none;');

        mapPlatform.style.zIndex = 300;
        canvasContainer.style.zIndex = 100;
        ui.style.zIndex = 300;
        control.style.zIndex = 400;

        containerDOM.appendChild(mapWrapper);

        mapPlatform.appendChild(ui);
        mapPlatform.appendChild(canvasContainer);
        mapPlatform.appendChild(layer);
        mapWrapper.appendChild(mapPlatform);
        mapWrapper.appendChild(control);

        this.resetContainer();
        var mapSize = this.map._getContainerDomSize();
        this.updateMapSize(mapSize);
    },

    _drawLayerCanvasImage:function (layer, layerImage, mwidth, mheight) {
        if (!layer || !layerImage || mwidth === 0 || mheight === 0) {
            return;
        }
        var point = layerImage['point'].multi(Z.Browser.retina ? 2 : 1);
        var canvasImage = layerImage['image'];
        if (point.x + canvasImage.width <= 0 || point.y + canvasImage.height <= 0) {
            return;
        }
        var containerPos = this._getCanvasContainerPos();
        if (containerPos) {
            var offset = this.map.offsetPlatform().multi(-1)._substract(containerPos);
            if (Z.Browser.retina) { offset._multi(2); }
            point = point.add(offset);

        }
        //opacity of the layer image
        var op = layer.options['opacity'];
        if (!Z.Util.isNumber(op)) {
            op = 1;
        }
        if (op <= 0) {
            return;
        }
        var imgOp = layerImage['opacity'];
        if (!Z.Util.isNumber(imgOp)) {
            imgOp = 1;
        }
        if (imgOp <= 0) {
            return;
        }
        var alpha = this._context.globalAlpha;

        if (op < 1) {
            this._context.globalAlpha *= op;
        }
        if (imgOp < 1) {
            this._context.globalAlpha *= imgOp;
        }

        if (Z.node) {
            var context = canvasImage.getContext('2d');
            if (context.getSvg) {
                 //canvas2svg
                canvasImage = context;
            }
        }
        // point._round();
        this._context.drawImage(canvasImage, Z.Util.round(point.x), Z.Util.round(point.y));
        this._context.globalAlpha = alpha;
    },

    _storeBackground: function (baseLayerImage) {
        if (baseLayerImage) {
            var map = this.map;
            this._canvasBg = Z.DomUtil.copyCanvas(baseLayerImage['image']);
            this._canvasBgRes = map._getResolution();
            this._canvasBgCoord = map.containerPointToCoordinate(baseLayerImage['point']);
        }
    },

    _drawBackground:function () {
        var map = this.map;
        if (this._canvasBg) {
            var scale = this._canvasBgRes / map._getResolution();
            var p = map.coordinateToContainerPoint(this._canvasBgCoord)._multi(Z.Browser.retina ? 2 : 1);
            Z.Canvas.image(this._context, this._canvasBg, p.x, p.y, this._canvasBg.width * scale, this._canvasBg.height * scale);
        }
    },

    _getAllLayerToTransform:function () {
        return this.map._getLayers();
    },

    _clearCanvas:function () {
        if (!this._canvas) {
            return;
        }
        Z.Canvas.clearRect(this._context, 0, 0, this._canvas.width, this._canvas.height);
    },

    _updateCanvasSize: function () {
        if (!this._canvas || this._isCanvasContainer) {
            return false;
        }
        var map = this.map;
        var mapSize = map.getSize();
        var canvas = this._canvas;
        var r = Z.Browser.retina ? 2 : 1;
        if (mapSize['width'] * r === canvas.width && mapSize['height'] * r === canvas.height) {
            return false;
        }
        //retina屏支持

        canvas.height = r * mapSize['height'];
        canvas.width = r * mapSize['width'];
        if (canvas.style) {
            canvas.style.width = mapSize['width'] + 'px';
            canvas.style.height = mapSize['height'] + 'px';
        }

        return true;
    },

    _createCanvas:function () {
        if (this._isCanvasContainer) {
            this._canvas = this.map._containerDOM;
        } else {
            this._canvas = Z.DomUtil.createEl('canvas');
            this._updateCanvasSize();
            this.map._panels.canvasContainer.appendChild(this._canvas);
        }
        this._context = this._canvas.getContext('2d');
    },

    /**
     * 设置地图的watcher, 用来监视地图容器的大小变化
     * @ignore
     */
    _onResize:function () {
        delete this._canvasBg;
        this.map.checkSize();
    },

    _registerEvents:function () {
        var map = this.map;
        map.on('_baselayerchangestart', function () {
            delete this._canvasBg;
        }, this);
        map.on('_baselayerload', function () {
            var baseLayer = map.getBaseLayer();
            if (!map.options['zoomBackground'] || baseLayer.getMask()) {
                delete this._canvasBg;
            }
        }, this);

        map.on('_zoomstart', function () {
            delete this._canvasBg;
            this._clearCanvas();
        }, this);
        if (typeof window !== 'undefined') {
            Z.DomUtil.on(window, 'resize', this._onResize, this);
        }
        if (!Z.Browser.mobile && Z.Browser.canvas) {
            this._onMapMouseMove = function (param) {
                if (map._isBusy() || map._moving || !map.options['hitDetect']) {
                    return;
                }
                if (this._hitDetectTimeout) {
                    Z.Util.cancelAnimFrame(this._hitDetectTimeout);
                }
                this._hitDetectTimeout = Z.Util.requestAnimFrame(function () {
                    var vp = param['viewPoint'];
                    var layers = map._getLayers();
                    var hit = false,
                        cursor;
                    for (var i = layers.length - 1; i >= 0; i--) {
                        var layer = layers[i];
                        if (layer._getRenderer() && layer._getRenderer().hitDetect) {
                            if (layer.options['cursor'] !== 'default' && layer._getRenderer().hitDetect(vp)) {
                                cursor = layer.options['cursor'];
                                hit = true;
                                break;
                            }
                        }
                    }
                    if (hit) {
                        map._trySetCursor(cursor);
                    } else {
                        map._trySetCursor('default');
                    }
                });

            };
            map.on('_mousemove', this._onMapMouseMove, this);
        }


        if (this._isCanvasContainer) {
            map.on('_moving _moveend', function () {
                this.render();
            }, this);
        } else {
            map.on('_moveend', function () {
                this._resetCanvasContainer();
                this.render();
            }, this);
        }
    }
});

Z.Map.registerRenderer('canvas', Z.renderer.map.Canvas);

Z.TileLayer.TileCache = function (capacity) {
    this._queue = [];
    this._cache = {};
    if (!capacity) {
        capacity = 128;
    }
    this.capacity = capacity;
};

Z.Util.extend(Z.TileLayer.TileCache.prototype, {
    add:function (key, tile) {
        this._cache[key] = tile;
        this._queue.push(key);
        this._expireCache();
    },

    get:function (key) {
        return this._cache[key];
    },

    remove:function (key) {
        delete this._cache[key];
    },

    _expireCache:function () {
        if (this._expTimeout) {
            clearTimeout(this._expTimeout);
        }
        var me = this;
        this._expTimeout = setTimeout(function () {
            var len = me._queue.length;
            if (len > me.capacity) {
                var expir = me._queue.splice(0, len - me.capacity);
                for (var i = expir.length - 1; i >= 0; i--) {
                    delete me._cache[expir[i]];
                }
            }
        }, 1000);

    }
});

/**
 * @namespace
 */
Z.renderer.tilelayer = {};

/**
 * @classdesc
 * Renderer class based on HTML5 Canvas2D for TileLayers
 * @class
 * @protected
 * @memberOf maptalks.renderer.tilelayer
 * @name Canvas
 * @extends {maptalks.renderer.Canvas}
 * @param {maptalks.TileLayer} layer - layer of the renderer
 */
Z.renderer.tilelayer.Canvas = Z.renderer.Canvas.extend(/** @lends Z.renderer.tilelayer.Canvas.prototype */{

    propertyOfPointOnTile   : '--maptalks-tile-point',
    propertyOfTileId        : '--maptalks-tile-id',
    propertyOfTileZoom      : '--maptalks-tile-zoom',

    initialize:function (layer) {
        this._layer = layer;
        this._mapRender = layer.getMap()._getRenderer();
        this._tileCache = new Z.TileLayer.TileCache();
        this._tileQueue = {};
    },

    clear:function () {
        this._clearCanvas();
        this._requestMapToRender();
    },

    clearExecutors:function () {
        clearTimeout(this._loadQueueTimeout);
    },

    draw:function () {
        var layer = this._layer;
        var tileGrid = layer._getTiles();
        if (!tileGrid) {
            this._complete();
            return;
        }
        if (!this._tileRended) {
            this._tileRended = {};
        }
        var tileRended = this._tileRended;
        this._tileRended = {};

        var tiles = tileGrid['tiles'],
            tileCache = this._tileCache,
            tileSize = layer.getTileSize();

        this._viewExtent = tileGrid['fullExtent'];
        if (!this._canvas) {
            this._createCanvas();
        }
        this._resizeCanvas(tileGrid['fullExtent'].getSize());
        var maskViewExtent = this._prepareCanvas();
        if (maskViewExtent && !maskViewExtent.intersects(this._viewExtent)) {
            this._complete();
            return;
        }

        //遍历瓦片
        this._totalTileToLoad = this._tileToLoadCounter = 0;
        var tile, tileId, cached, tileViewExtent;
        for (var i = tiles.length - 1; i >= 0; i--) {
            tile = tiles[i];
            tileId = tiles[i]['id'];
            //如果缓存中已存有瓦片, 则从不再请求而从缓存中读取.
            cached = tileRended[tileId] || tileCache.get(tileId);
            tileViewExtent = new Z.PointExtent(tile['viewPoint'],
                                tile['viewPoint'].add(tileSize.toPoint()));
            if (!this._viewExtent.intersects(tileViewExtent)) {
                continue;
            }
            this._totalTileToLoad++;
            if (cached) {
                this._drawTile(tile['viewPoint'], cached);
                this._tileRended[tileId] = cached;
            } else {

                this._tileToLoadCounter++;
                this._tileQueue[tileId + '@' + tile['viewPoint'].toString()] = tile;
            }
        }

        if (this._tileToLoadCounter === 0) {
            this._complete();
        } else {
            if (this._tileToLoadCounter < this._totalTileToLoad) {
                this._requestMapToRender();
            }
            this._scheduleLoadTileQueue();
        }
    },

    getCanvasImage:function () {
        if (this._renderZoom !== this.getMap().getZoom() || !this._canvas) {
            return null;
        }
        var gradualOpacity = null;
        if (this._gradualLoading && this._totalTileToLoad && this._layer.options['gradualLoading']) {
            gradualOpacity = ((this._totalTileToLoad - this._tileToLoadCounter) / this._totalTileToLoad) * 1.5;
            if (gradualOpacity > 1) {
                gradualOpacity = 1;
            }
        }
        var size = this._viewExtent.getSize();
        var point = this._viewExtent.getMin();
        return {'image':this._canvas, 'layer':this._layer, 'point':this.getMap().viewPointToContainerPoint(point), 'size':size, 'opacity':gradualOpacity};
    },

    _scheduleLoadTileQueue:function () {

        if (this._loadQueueTimeout) {
            Z.Util.cancelAnimFrame(this._loadQueueTimeout);
        }

        var me = this;
        this._loadQueueTimeout = Z.Util.requestAnimFrame(function () { me._loadTileQueue(); });
    },

    _loadTileQueue:function () {
        var me = this;
        function onTileLoad() {
            if (!Z.node) {
                me._tileCache.add(this[me.propertyOfTileId], this);
                me._tileRended[this[me.propertyOfTileId]] = this;
            }
            me._drawTileAndRequest(this);
        }
        function onTileError() {
            me._clearTileRectAndRequest(this);
        }
        var tileId, tile;
        for (var p in this._tileQueue) {
            if (this._tileQueue.hasOwnProperty(p)) {
                tileId = p.split('@')[0];
                tile = this._tileQueue[p];
                delete this._tileQueue[p];
                if (!this._tileCache[tileId]) {
                    this._loadTile(tileId, tile, onTileLoad, onTileError);
                } else {
                    this._drawTileAndRequest(this._tileCache[tileId]);
                }

            }
        }

    },


    _loadTile:function (tileId, tile, onTileLoad, onTileError) {
        var crossOrigin = this._layer.options['crossOrigin'];
        var tileSize = this._layer.getTileSize();
        var tileImage = new Image();
        tileImage.width = tileSize['width'];
        tileImage.height = tileSize['height'];
        tileImage[this.propertyOfTileId] = tileId;
        tileImage[this.propertyOfPointOnTile] = tile['viewPoint'];
        tileImage[this.propertyOfTileZoom] = tile['zoom'];
        tileImage.onload = onTileLoad;
        tileImage.onabort = onTileError;
        tileImage.onerror = onTileError;
        if (crossOrigin) {
            tileImage.crossOrigin = crossOrigin;
        }
        Z.Util.loadImage(tileImage, [tile['url']]);
    },


    _drawTile:function (point, tileImage) {
        if (!point) {
            return;
        }
        var tileSize = this._layer.getTileSize();
        var leftTop = this._viewExtent.getMin();
        Z.Canvas.image(this._context, tileImage,
            point.x - leftTop.x, point.y - leftTop.y,
            tileSize['width'], tileSize['height']);
        if (this._layer.options['debug']) {
            var p = point.substract(leftTop);
            this._context.save();
            this._context.strokeStyle = 'rgb(0,0,0)';
            this._context.fillStyle = 'rgb(0,0,0)';
            this._context.strokeWidth = 10;
            this._context.font = '15px monospace';
            Z.Canvas.rectangle(this._context, p, tileSize, 1, 0);
            var xyz = tileImage[this.propertyOfTileId].split('__');
            Z.Canvas.fillText(this._context, 'x:' + xyz[1] + ',y:' + xyz[0] + ',z:' + xyz[2], p.add(10, 20), 'rgb(0,0,0)');
            this._context.restore();
        }
        tileImage = null;
    },

    /**
     * 绘制瓦片, 并请求地图重绘
     * @param  {Point} point        瓦片左上角坐标
     * @param  {Image} tileImage 瓦片图片对象
     */
    _drawTileAndRequest:function (tileImage) {
        //sometimes, layer may be removed from map here.
        if (!this.getMap()) {
            return;
        }
        var zoom = this.getMap().getZoom();
        if (zoom !== tileImage[this.propertyOfTileZoom]) {
            return;
        }
        this._tileToLoadCounter--;
        var point = tileImage[this.propertyOfPointOnTile];
        this._drawTile(point, tileImage);

        if (!Z.node) {
            var tileSize = this._layer.getTileSize();
            var viewExtent = this.getMap()._getViewExtent();
            if (viewExtent.intersects(new Z.PointExtent(point, point.add(tileSize['width'], tileSize['height'])))) {
                this._requestMapToRender();
            }
        }
        if (this._tileToLoadCounter === 0) {
            this._onTileLoadComplete();
        }
    },

    _onTileLoadComplete:function () {
        //In browser, map will be requested to render once a tile was loaded.
        //but in node, map will be requested to render when the layer is loaded.
        if (Z.node) {
            this._requestMapToRender();
        }
        this._fireLoadedEvent();
    },

    /**
     * 清除瓦片区域, 并请求地图重绘
     * @param  {Point} point        瓦片左上角坐标
     */
    _clearTileRectAndRequest:function (tileImage) {
        if (!this.getMap()) {
            return;
        }
        var zoom = this.getMap().getZoom();
        if (zoom !== tileImage[this.propertyOfTileZoom]) {
            return;
        }
        if (!Z.node) {
            this._requestMapToRender();
        }
        this._tileToLoadCounter--;
        if (this._tileToLoadCounter === 0) {
            this._onTileLoadComplete();
        }
    },

    /**
     * @override
     */
    _requestMapToRender:function () {
        if (Z.node) {
            if (this.getMap() && !this.getMap()._isBusy()) {
                this._mapRender.render();
            }
            return;
        }
        if (this._mapRenderRequest) {
            Z.Util.cancelAnimFrame(this._mapRenderRequest);
        }
        var me = this;
        this._mapRenderRequest = Z.Util.requestAnimFrame(function () {
            if (me.getMap() && !me.getMap()._isBusy()) {
                me._mapRender.render();
            }
        });
    },

    _onMoveEnd: function () {
        this._gradualLoading = false;
        this.render();
    },

    _onZoomEnd: function () {
        this._gradualLoading = true;
        this.render();
    },

    _onResize: function () {
        this._resizeCanvas();
        this.render();
    },

    _onRemove: function () {
        delete this._tileCache;
        delete this._tileQueue;
        delete this._mapRender;
    }
});

Z.TileLayer.registerRenderer('canvas', Z.renderer.tilelayer.Canvas);

/**
 * @classdesc
 * A renderer based on HTML Doms for TileLayers.
 * It is implemented based on Leaflet's GridLayer, and all the credits belongs to Leaflet.
 * @class
 * @protected
 * @memberOf maptalks.renderer.tilelayer
 * @name Dom
 * @extends {maptalks.Class}
 * @param {maptalks.TileLayer} layer - layer of the renderer
 */
Z.renderer.tilelayer.Dom = Z.Class.extend(/** @lends Z.renderer.tilelayer.Dom.prototype */{

    initialize:function (layer) {
        this._layer = layer;
        this._tiles = {};
        this._fadeAnimated = true;
    },

    getMap:function () {
        return this._layer.getMap();
    },

    show: function () {
        if (this._container) {
            this.render();
            this._container.style.display = '';
        }
    },

    hide: function () {
        if (this._container) {
            this._container.style.display = 'none';
            this.clear();
        }
    },

    remove:function () {
        this._removeLayerContainer();
    },

    clear:function () {
        this._removeAllTiles();
        this._clearLayerContainer();
    },

    setZIndex: function (z) {
        this._zIndex = z;
        if (this._container) {
            this._container.style.zIndex = z;
        }
    },

    isCanvasRender: function () {
        return false;
    },

    render:function () {
        var layer = this._layer;
        if (!this._container) {
            this._createLayerContainer();
        }
        var tileGrid = layer._getTiles();
        if (!tileGrid) {
            return;
        }
        var tiles = tileGrid['tiles'],
            queue = [];


        if (this._tiles) {
            for (var p in this._tiles) {
                this._tiles[p].current = false;
            }
        }

        var tile;
        for (var i = tiles.length - 1; i >= 0; i--) {
            tile = tiles[i];
            if (this._tiles[tile['id']]) {
                //tile is already added
                this._tiles[tile['id']].current = true;
                continue;
            }
            tile.current = true;
            queue.push(tile);
        }
        if (queue.length > 0) {
            var fragment = document.createDocumentFragment();
            for (i = 0; i < queue.length; i++) {
                fragment.appendChild(this._loadTile(queue[i]));
            }
            this._getTileContainer().appendChild(fragment);
        }
    },

    transform: function (matrices) {
        if (!this._canTransform()) {
            return false;
        }
        var zoom = this.getMap().getZoom();
        if (this._levelContainers[zoom]) {
            Z.DomUtil.setTransform(this._levelContainers[zoom], matrices['view']);
            // Z.DomUtil.setTransform(this._levelContainers[zoom], new Z.Point(matrices['view'].e, matrices['view'].f), matrices.scale.x);
        }
        return false;
    },

    _loadTile: function (tile) {
        this._tiles[tile['id']] = tile;
        return this._createTile(tile, Z.Util.bind(this._tileReady, this));
    },

    _createTile: function (tile, done) {
        var tileSize = this._layer.getTileSize();
        var tileImage = Z.DomUtil.createEl('img');

        tile['el'] = tileImage;

        Z.DomUtil.on(tileImage, 'load', Z.Util.bind(this._tileOnLoad, this, done, tile));
        Z.DomUtil.on(tileImage, 'error', Z.Util.bind(this._tileOnError, this, done, tile));

        if (this._layer.options['crossOrigin']) {
            tile.crossOrigin = this._layer.options['crossOrigin'];
        }

        tileImage.style.position = 'absolute';
        tileImage.style.left = Math.floor(tile['viewPoint'].x) + 'px';
        tileImage.style.top  = Math.floor(tile['viewPoint'].y) + 'px';

        tileImage.alt = '';
        tileImage.width = tileSize['width'];
        tileImage.height = tileSize['height'];

        Z.DomUtil.setOpacity(tileImage, 0);

        tileImage.src = tile['url'];

        return tileImage;
    },

    _tileReady: function (err, tile) {
        if (err) {
            this._layer.fire('tileerror', {
                error: err,
                tile: tile
            });
        }

        tile.loaded = Z.Util.now();

        if (this._fadeAnimated) {
            Z.Util.cancelAnimFrame(this._fadeFrame);
            this._fadeFrame = Z.Util.requestAnimFrame(Z.Util.bind(this._updateOpacity, this));
        } else {
            Z.DomUtil.setOpacity(tile['el'], 1);
            tile.active = true;
            this._pruneTiles();
        }

        this._layer.fire('tileload', {
            tile: tile
        });

        if (this._noTilesToLoad()) {
            this._layer.fire('layerload');

            if (Z.Browser.ielt9) {
                Z.Util.requestAnimFrame(this._pruneTiles, this);
            } else {
                if (this._pruneTimeout) {
                    clearTimeout(this._pruneTimeout);
                }
                var timeout = this.getMap() ? this.getMap().options['zoomAnimationDuration'] : 250,
                    pruneLevels = this.getMap() ? !this.getMap().options['zoomBackground'] : true;
                // Wait a bit more than 0.2 secs (the duration of the tile fade-in)
                // to trigger a pruning.
                this._pruneTimeout = setTimeout(Z.Util.bind(this._pruneTiles, this, pruneLevels), timeout + 100);
            }
        }
    },

    _tileOnLoad: function (done, tile) {
        // For https://github.com/Leaflet/Leaflet/issues/3332
        if (Z.Browser.ielt9) {
            setTimeout(Z.Util.bind(done, this, null, tile), 0);
        } else {
            done.call(this, null, tile);
        }
    },

    _tileOnError: function (done, tile) {
        var errorUrl = this._layer.options['errorTileUrl'];
        if (errorUrl) {
            tile['el'].src = errorUrl;
        } else {
            tile['el'].style.display = 'none';
        }
        done.call(this, 'error', tile);
    },

    _updateOpacity: function () {
        if (!this.getMap()) { return; }

        // IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
        if (Z.Browser.ielt9) {
            return;
        }

        Z.DomUtil.setOpacity(this._container, this._layer.options['opacity']);

        var now = Z.Util.now(),
            nextFrame = false;
        var tile, fade;
        for (var key in this._tiles) {
            tile = this._tiles[key];
            if (!tile.current || !tile.loaded) { continue; }

            fade = Math.min(1, (now - tile.loaded) / 200);

            Z.DomUtil.setOpacity(tile['el'], fade);
            if (!nextFrame && fade < 1) {
                nextFrame = true;
            }
        }

        if (nextFrame) {
            Z.Util.cancelAnimFrame(this._fadeFrame);
            this._fadeFrame = Z.Util.requestAnimFrame(Z.Util.bind(this._updateOpacity, this));
        }
    },

    _noTilesToLoad: function () {
        for (var key in this._tiles) {
            if (!this._tiles[key].loaded) { return false; }
        }
        return true;
    },

    _pruneTiles: function (pruneLevels) {
        var map = this.getMap();
        if (!map) {
            return;
        }

        var key,
            zoom = map.getZoom();

        if (!this._layer.isVisible()) {
            this._removeAllTiles();
            return;
        }

        for (key in this._tiles) {
            if (this._tiles[key].zoom === zoom && !this._tiles[key].current) {
                this._removeTile(key);
            }
        }

        if (pruneLevels) {
            for (key in this._tiles) {
                if (this._tiles[key].zoom !== zoom) {
                    this._removeTile(key);
                }
            }
            for (var z in this._levelContainers) {
                if (+z !== zoom) {
                    Z.DomUtil.removeDomNode(this._levelContainers[z]);
                    this._removeTilesAtZoom(z);
                    delete this._levelContainers[z];
                }
            }
        }

    },

    _removeTile: function (key) {
        var tile = this._tiles[key];
        if (!tile) { return; }

        Z.DomUtil.removeDomNode(tile.el);

        delete this._tiles[key];

        // @event tileunload: TileEvent
        // Fired when a tile is removed (e.g. when a tile goes off the screen).
        this._layer.fire('tileunload', {
            tile: tile
        });
    },

    _removeTilesAtZoom: function (zoom) {
        for (var key in this._tiles) {
            if (+this._tiles[key]['zoom'] !== +zoom) {
                continue;
            }
            this._removeTile(key);
        }
    },

    _removeAllTiles: function () {
        for (var key in this._tiles) {
            this._removeTile(key);
        }
    },

    _getTileContainer: function () {
        if (!this._levelContainers) {
            this._levelContainers = {};
        }
        var zoom = this.getMap().getZoom();
        if (!this._levelContainers[zoom]) {
            var container = this._levelContainers[zoom] = Z.DomUtil.createEl('div', 'maptalks-tilelayer-level');
            container.style.cssText = 'position:absolute;left:0px;top:0px;';
            container.style.willChange = 'transform';
            this._container.appendChild(container);
        }
        return this._levelContainers[zoom];
    },

    _createLayerContainer: function () {
        var container = this._container = Z.DomUtil.createEl('div', 'maptalks-tilelayer');
        container.style.cssText = 'position:absolute;left:0px;top:0px;';
        if (this._zIndex) {
            container.style.zIndex = this._zIndex;
        }
        this.getMap()._panels['layer'].appendChild(container);
    },

    _clearLayerContainer:function () {
        if (this._container) {
            this._container.innerHTML = '';
        }
        delete this._levelContainers;
    },

    _removeLayerContainer:function () {
        if (this._container) {
            Z.DomUtil.removeDomNode(this._container);
        }
        delete this._levelContainers;
    },

    _getEvents:function () {
        var events = {
            '_zoomstart'    : this._onZoomStart,
            '_zoomend'      : this._onZoomEnd,
            '_moveend _resize' : this.render,
            '_movestart'    : this._onMoveStart
        };
        if (!this._onMapMoving && this._layer.options['renderWhenPanning']) {
            var rendSpan = this._layer.options['renderSpanWhenPanning'];
            if (Z.Util.isNumber(rendSpan) && rendSpan >= 0) {
                if (rendSpan > 0) {
                    this._onMapMoving = Z.Util.throttle(function () {
                        this.render();
                    }, rendSpan, this);
                } else {
                    this._onMapMoving = function () {
                        this.render();
                    };
                }
            }
        }
        if (this._onMapMoving) {
            events['_moving'] = this._onMapMoving;
        }
        return events;
    },

    _canTransform: function () {
        return Z.Browser.any3d || Z.Browser.ie9;
    },

    _onMoveStart: function () {
        // this._fadeAnimated = false;
    },

    _onZoomStart: function () {
        this._fadeAnimated = true;
        this._pruneTiles(true);
        this._zoomStartPos = this.getMap().offsetPlatform();
        if (!this._canTransform()) {
            this._container.style.display = 'none';
        }
    },

    _onZoomEnd: function (param) {
        if (this._pruneTimeout) {
            clearTimeout(this._pruneTimeout);
        }
        this.render();
        if (this._levelContainers) {
            if (this._canTransform()) {
                if (this._levelContainers[param.from] && this._zoomStartPos) {
                    this._levelContainers[param.from].style.left = this._zoomStartPos.x + 'px';
                    this._levelContainers[param.from].style.top = this._zoomStartPos.y + 'px';
                }
            } else {
                if (this._levelContainers[param.from]) {
                    this._levelContainers[param.from].style.display = 'none';
                }
                this._container.style.display = '';
            }
        }
    }
});

Z.TileLayer.registerRenderer('dom', Z.renderer.tilelayer.Dom);

Z.renderer.canvastilelayer = {};

Z.renderer.canvastilelayer.Canvas = Z.renderer.tilelayer.Canvas.extend({
    _loadTile:function (tileId, tile, onTileLoad, onTileError) {
        var tileSize = this._layer.getTileSize(),
            canvasClass = this._canvas.constructor,
            map = this.getMap();
        var r = Z.Browser.retina ? 2 : 1;
        var tileCanvas = Z.Canvas.createCanvas(tileSize['width'] * r, tileSize['height'] * r, canvasClass);

        tileCanvas[this.propertyOfTileId] = tileId;
        tileCanvas[this.propertyOfPointOnTile] = tile['viewPoint'];
        tileCanvas[this.propertyOfTileZoom] = tile['zoom'];
        this._layer.drawTile(tileCanvas, {
            'url' : tile['url'],
            'viewPoint' : tile['viewPoint'],
            'zoom' : tile['zoom'],
            'extent' : map.viewToExtent(new Z.PointExtent(tile['viewPoint'], tile['viewPoint'].add(tileSize.toPoint())))
        }, function (error) {
            if (error) {
                onTileError.call(tileCanvas);
                return;
            }
            onTileLoad.call(tileCanvas);
        });
    }
});

Z.CanvasTileLayer.registerRenderer('canvas', Z.renderer.canvastilelayer.Canvas);

/**
 * @namespace
 */
Z.renderer.vectorlayer = {};

/**
 * @classdesc
 * Renderer class based on HTML5 Canvas2D for VectorLayers
 * @class
 * @protected
 * @memberOf maptalks.renderer.vectorlayer
 * @name Canvas
 * @extends {maptalks.renderer.Canvas}
 * @param {maptalks.VectorLayer} layer - layer of the renderer
 */
Z.renderer.vectorlayer.Canvas = Z.renderer.Canvas.extend(/** @lends Z.renderer.vectorlayer.Canvas.prototype */{

    initialize:function (layer) {
        this._layer = layer;
        this._painted = false;
    },

    /**
     * render layer
     * @param  {maptalks.Geometry[]} geometries   geometries to render
     * @param  {Boolean} ignorePromise   whether escape step of promise
     */
    draw:function () {
        var me = this;
        this._clearTimeout();
        if (this._layer.isEmpty()) {
            this._complete();
            return;
        }
        if (this._layer.options['drawImmediate']) {
            this._drawImmediate();
        } else {
            this._renderTimeout = Z.Util.requestAnimFrame(function () {
                me._drawImmediate();
            });
        }
    },

    //redraw all the geometries with transform matrix
    //this may bring low performance if number of geometries is large.
    transform: function (matrix) {
        if (Z.Browser.mobile || !this.getMap().options['layerTransforming'] || this._layer.options['drawOnce'] || this._layer.getMask()) {
            return false;
        }
        //determin whether this layer should be transformed.
        //if all the geometries to render are vectors including polygons and linestrings,
        //disable transforming won't reduce user experience.
        if (!this._hasPointSymbolizer ||
            this.getMap()._getRenderer()._getCountOfGeosToDraw() > this._layer.options['thresholdOfTransforming']) {
            return false;
        }
        this._drawGeos(matrix);
        return true;
    },

    checkResources:function (geometries) {
        if (!this._painted && !geometries) {
            geometries = this._layer._geoCache;
        }
        if (!geometries) {
            return null;
        }
        var me = this,
            resources = [];
        var res, ii;
        function checkGeo(geo) {
            res = geo._getExternalResources();
            if (!Z.Util.isArrayHasData(res)) {
                return;
            }
            if (!me._resources) {
                resources = resources.concat(res);
            } else {
                for (ii = 0; ii < res.length; ii++) {
                    if (!me._resources.isResourceLoaded(res[ii])) {
                        resources.push(res[ii]);
                    }
                }
            }
        }

        if (Z.Util.isArrayHasData(geometries)) {
            for (var i = geometries.length - 1; i >= 0; i--) {
                checkGeo(geometries[i]);
            }
        } else {
            for (var p in geometries) {
                if (geometries.hasOwnProperty(p)) {
                    checkGeo(geometries[p]);
                }
            }
        }
        return resources;
    },


    isBlank: function () {
        return this._isBlank;
    },

    /**
     * Show and render
     * @override
     */
    show: function () {
        this._layer.forEach(function (geo) {
            geo._onZoomEnd();
        });
        Z.renderer.Canvas.prototype.show.apply(this, arguments);
    },

    _drawGeos:function (matrix) {
        var map = this.getMap();
        if (!map) {
            return;
        }
        var layer = this._layer;
        if (layer.isEmpty()) {
            this._resources = new Z.renderer.Canvas.Resources();
            this._fireLoadedEvent();
            return;
        }
        if (!layer.isVisible()) {
            this._fireLoadedEvent();
            return;
        }
        this._prepareToDraw();
        var viewExtent = this._viewExtent,
            maskViewExtent = this._prepareCanvas();
        if (maskViewExtent) {
            if (!maskViewExtent.intersects(viewExtent)) {
                this._fireLoadedEvent();
                return;
            }
            viewExtent = viewExtent.intersection(maskViewExtent);
        }
        this._displayExtent = viewExtent;
        this._forEachGeo(this._checkGeo, this);

        for (var i = 0, len = this._geosToDraw.length; i < len; i++) {
            this._geosToDraw[i]._getPainter().paint(matrix);
        }
    },

    _prepareToDraw: function () {
        this._isBlank = true;
        this._painted = true;
        this._hasPointSymbolizer = false;
        this._geosToDraw = [];
    },

    _checkGeo: function (geo) {
        if (!geo || !geo.isVisible() || !geo.getMap() ||
            !geo.getLayer() || (!geo.getLayer().isCanvasRender())) {
            return;
        }
        var painter = geo._getPainter(),
            viewExtent = painter.getViewExtent();
        if (!viewExtent || !viewExtent.intersects(this._displayExtent)) {
            return;
        }
        this._isBlank = false;
        if (painter.hasPointSymbolizer()) {
            this._hasPointSymbolizer = true;
        }
        this._geosToDraw.push(geo);
    },


    _forEachGeo: function (fn, context) {
        this._layer.forEach(fn, context);
    },

    /**
     * Renderer the layer immediately.
     */
    _drawImmediate:function () {
        this._clearTimeout();
        if (!this.getMap()) {
            return;
        }
        var map = this.getMap();
        if (!this._layer.isVisible() || this._layer.isEmpty()) {
            this._clearCanvas();
            this._complete();
            return;
        }
        var zoom = this.getMap().getZoom();
        if (this._layer.options['drawOnce']) {
            if (!this._canvasCache) {
                this._canvasCache = {};
            }
            if (this._viewExtent) {
                this._complete();
                return;
            } else if (this._canvasCache[zoom]) {
                this._canvas = this._canvasCache[zoom].canvas;
                var center = map._prjToPoint(map._getPrjCenter());
                this._viewExtent = this._canvasCache[zoom].viewExtent.add(this._canvasCache[zoom].center.substract(center));
                this._complete();
                return;
            } else {
                delete this._canvas;
            }
        }
        this._drawGeos();
        if (this._layer.options['drawOnce']) {
            if (!this._canvasCache[zoom]) {
                this._canvasCache[zoom] = {
                    'canvas'       : this._canvas,
                    'viewExtent'   : this._viewExtent,
                    'center'       : map._prjToPoint(map._getPrjCenter())
                };
            }
        }
        this._complete();
    },

    _onZoomEnd: function () {
        delete this._viewExtent;
        if (this._layer.isVisible()) {
            this._layer.forEach(function (geo) {
                geo._onZoomEnd();
            });
        }
        if (!this._painted) {
            this.render();
        } else {
            //_prepareRender is called in render not in _drawImmediate.
            //Thus _prepareRender needs to be called here
            this._prepareRender();
            this._drawImmediate();
        }
    },

    _onMoveEnd: function () {
        if (!this._painted) {
            this.render();
        } else {
            this._prepareRender();
            this._drawImmediate();
        }
    },

    _onResize: function () {
        this._resizeCanvas();
        if (!this._painted) {
            this.render();
        } else {
            delete this._canvasCache;
            delete this._viewExtent;
            this._prepareRender();
            this._drawImmediate();
        }
    },

    _onRemove:function () {
        delete this._canvasCache;
    },

    _clearTimeout:function () {
        if (this._renderTimeout) {
            //clearTimeout(this._renderTimeout);
            Z.Util.cancelAnimFrame(this._renderTimeout);
        }
    }
});


Z.VectorLayer.registerRenderer('canvas', Z.renderer.vectorlayer.Canvas);

if (Z.GeoJSONLayer) {
    Z.GeoJSONLayer.registerRenderer('canvas', Z.renderer.vectorlayer.Canvas);
}

/**
 * @namespace
 */
Z.symbolizer = {};
/**
 * @classdesc
 * Base class for all the symbolilzers, a symbolizers contains the following methods:
 * refresh: 刷新逻辑, 例如地图放大缩小时需要刷新像素坐标时
 * svg:     在svg/vml上的绘制逻辑
 * canvas:  在canvas上的绘制逻辑
 * show:    显示
 * hide:    隐藏
 * setZIndex:设置ZIndex
 * remove:  删除逻辑
 * test: 定义在类上, 测试传入的geometry和symbol是否应由该Symbolizer渲染
 * @class
 * @extends maptalks.Class
 * @abstract
 * @protected
 */
Z.Symbolizer = Z.Class.extend(/** @lends maptalks.Symbolizer.prototype */{
    getMap:function () {
        return this.geometry.getMap();
    }
});


Z.Symbolizer.resourceProperties = [
    'markerFile', 'polygonPatternFile', 'linePatternFile', 'markerFillPatternFile', 'markerLinePatternFile'
];

Z.Symbolizer.resourceSizeProperties = [
    ['markerWidth', 'markerHeight'], [], [null, 'lineWidth'], [], [null, 'markerLineWidth']
];

/**
 * @property {String[]} colorProperties - Symbol properties related with coloring
 * @static
 * @constant
 */
Z.Symbolizer.colorProperties = [
    'lineColor', 'polygonFill', 'markerFill', 'markerLineColor', 'textFill'
];

Z.Symbolizer.DEFAULT_STROKE_COLOR = '#000';
Z.Symbolizer.DEFAULT_FILL_COLOR = 'rgba(255,255,255,0)';
Z.Symbolizer.DEFAULT_TEXT_COLOR = '#000';

/**
 * Test if the property is a property related with coloring
 * @param {String} prop - property name to test
 * @static
 * @function
 * @return {Boolean}
 */
Z.Symbolizer.testColor = function (prop) {
    if (!prop || !Z.Util.isString(prop)) { return false; }
    if (Z.Util.indexOfArray(prop, Z.Symbolizer.colorProperties) >= 0) {
        return true;
    }
    return false;
};

/**
 * @classdesc
 * Base symbolizer class for all the symbolizers base on HTML5 Canvas2D
 * @abstract
 * @class
 * @protected
 * @memberOf maptalks.symbolizer
 * @name CanvasSymbolizer
 * @extends {maptalks.Symbolizer}
 */
Z.symbolizer.CanvasSymbolizer = Z.Symbolizer.extend(/** @lends maptalks.symbolizer.CanvasSymbolizer.prototype */{
    _prepareContext:function (ctx) {
        //for VectorPathMarkerSymbolizer, opacity is already added into SVG element.
        if (!(this instanceof Z.symbolizer.VectorPathMarkerSymbolizer)) {
            var symbol = this.symbol;
            if (Z.Util.isNumber(symbol['opacity'])) {
                if (ctx.globalAlpha !== symbol['opacity']) {
                    ctx.globalAlpha = symbol['opacity'];
                }
            } else if (ctx.globalAlpha !== 1) {
                ctx.globalAlpha = 1;
            }
        }
        var shadowBlur = this.geometry.options['shadowBlur'];
        if (Z.Util.isNumber(shadowBlur) && shadowBlur > 0) {
            ctx.shadowBlur = shadowBlur;
            ctx.shadowColor = this.geometry.options['shadowColor'];
        } else {
            ctx.shadowBlur = null;
            ctx.shadowColor = null;
        }
    },

    refresh:function () {
    },

    //所有point symbolizer的共同的remove方法
    remove:function () {
    },

    setZIndex:function () {
    },

    show:function () {
    },

    hide:function () {
    },

    _defineStyle: function (style) {
        var me = this;
        var argFn = function () {
            return [me.getMap().getZoom(), me.geometry.getProperties()];
        };

        return Z.Util.loadFunctionTypes(style, argFn);
    }
});

Z.symbolizer.StrokeAndFillSymbolizer = Z.symbolizer.CanvasSymbolizer.extend({

    defaultSymbol:{
        'lineColor' : '#000000',
        'lineWidth' : 1,
        'lineOpacity' : 1,
        'lineDasharray': [],
        'lineCap' : 'butt', //“butt”, “square”, “round”
        'lineJoin' : 'round', //“bevel”, “round”, “miter”
        'polygonFill': null,
        'polygonOpacity': 0
    },

    initialize:function (symbol, geometry) {
        this.symbol = symbol;
        this.geometry = geometry;
        if (geometry instanceof Z.Marker) {
            return;
        }
        this.style = this._defineStyle(this.translate());
    },

    symbolize:function (ctx, resources) {
        if (this.geometry instanceof Z.Marker) {
            return;
        }
        var style = this.style;
        if (style['polygonOpacity'] === 0 && style['lineOpacity'] === 0) {
            return;
        }
        var canvasResources = this._getRenderResources();
        this._prepareContext(ctx);
        if (Z.Util.isGradient(style['lineColor'])) {
            style['lineGradientExtent'] = this.geometry._getPainter().getContainerExtent()._expand(style['lineWidth'])._round();
        }
        if (Z.Util.isGradient(style['polygonFill'])) {
            style['polygonGradientExtent'] = this.geometry._getPainter().getContainerExtent()._round();
        }

        var points = canvasResources['context'][0],
            isSplitted = (this.geometry instanceof Z.Polygon && points.length === 2 && Z.Util.isArray(points[0][0])) ||
                        (this.geometry instanceof Z.LineString  && points.length === 2 && Z.Util.isArray(points[0]));
        if (isSplitted) {
            for (var i = 0; i < points.length; i++) {
                Z.Canvas.prepareCanvas(ctx, style, resources);
                canvasResources['fn'].apply(this, [ctx].concat([points[i]]).concat([
                    style['lineOpacity'], style['polygonOpacity'], style['lineDasharray']]));
            }
        } else {
            Z.Canvas.prepareCanvas(ctx, style, resources);
            canvasResources['fn'].apply(this, [ctx].concat(canvasResources['context']).concat([
                style['lineOpacity'], style['polygonOpacity'], style['lineDasharray']]));
        }

        if (ctx.setLineDash && Z.Util.isArrayHasData(style['lineDasharray'])) {
            ctx.setLineDash([]);
        }
    },

    getViewExtent:function () {
        if (this.geometry instanceof Z.Marker) {
            return null;
        }
        var map = this.getMap();
        var extent = this.geometry._getPrjExtent();
        if (!extent) {
            return null;
        }
        // this ugly implementation is to improve perf as we can
        // it tries to avoid creating instances to save cpu consumption.
        if (!this._extMin || !this._extMax) {
            this._extMin = new Z.Coordinate(0, 0);
            this._extMax = new Z.Coordinate(0, 0);
        }
        this._extMin.x = extent['xmin'];
        this._extMin.y = extent['ymin'];
        this._extMax.x = extent['xmax'];
        this._extMax.y = extent['ymax'];
        var min = map._prjToViewPoint(this._extMin),
            max = map._prjToViewPoint(this._extMax);
        if (!this._pxExtent) {
            this._pxExtent = new Z.PointExtent(min, max);
        } else {
            if (min.x < max.x) {
                this._pxExtent['xmin'] = min.x;
                this._pxExtent['xmax'] = max.x;
            } else {
                this._pxExtent['xmax'] = min.x;
                this._pxExtent['xmin'] = max.x;
            }
            if (min.y < max.y) {
                this._pxExtent['ymin'] = min.y;
                this._pxExtent['ymax'] = max.y;
            } else {
                this._pxExtent['ymax'] = min.y;
                this._pxExtent['ymin'] = max.y;
            }
        }
        return this._pxExtent._expand(this.style['lineWidth'] / 2);
    },

    _getRenderResources:function () {
        return this.geometry._getPainter()._getRenderResources();
    },

    translate:function () {
        var s = this.symbol;
        var d = this.defaultSymbol;
        var result = {};
        Z.Util.extend(result, d, s);
        if (result['lineWidth'] === 0) {
            result['lineOpacity'] = 0;
        }
        return result;
    }

});

Z.symbolizer.StrokeAndFillSymbolizer.test = function (symbol) {
    if (!symbol) {
        return false;
    }
    for (var p in symbol) {
        if (p.indexOf('polygon') >= 0 || p.indexOf('line') >= 0) {
            return true;
        }
    }
    return false;
};

/**
 * @classdesc
 * Base symbolizer class for all the point type symbol styles.
 * @abstract
 * @class
 * @protected
 * @memberOf maptalks.symbolizer
 * @name PointSymbolizer
 * @extends {maptalks.symbolizer.CanvasSymbolizer}
 */
Z.symbolizer.PointSymbolizer = Z.symbolizer.CanvasSymbolizer.extend(/** @lends maptalks.symbolizer.PointSymbolizer */{
    getViewExtent: function () {
        var extent = new Z.PointExtent();
        var markerExtent = this.getMarkerExtent();
        var min = markerExtent.getMin(),
            max = markerExtent.getMax();
        var renderPoints = this._getRenderPoints()[0];
        for (var i = renderPoints.length - 1; i >= 0; i--) {
            var point = renderPoints[i];
            extent = extent.combine(new Z.PointExtent(point.add(min), point.add(max)));
        }
        return extent;
    },

    _getRenderPoints: function () {
        return this.geometry._getPainter()._getRenderPoints(this.getPlacement());
    },

    /**
     * Get container points to draw on Canvas
     * @return {maptalks.Point[]}
     */
    _getRenderContainerPoints: function () {
        var points = this._getRenderPoints()[0],
            matrices = this.geometry._getPainter().getTransformMatrix(),
            matrix = matrices ? matrices['container'] : null,
            scale = matrices ? matrices['scale'] : null,
            dxdy = this.getDxDy(),
            layerViewPoint = this.geometry.getLayer()._getRenderer()._viewExtent.getMin();
        if (matrix) {
            dxdy = new Z.Point(dxdy.x / scale.x, dxdy.y / scale.y);
        }

        var containerPoints = Z.Util.mapArrayRecursively(points, function (point) {
            return point.substract(layerViewPoint)._add(dxdy);
        });
        if (matrix) {
            return matrix.applyToArray(containerPoints);
        }
        return containerPoints;
    },

    _getRotations: function () {
        return this._getRenderPoints()[1];
    }
});

Z.symbolizer.ImageMarkerSymbolizer = Z.symbolizer.PointSymbolizer.extend({

    initialize:function (symbol, geometry) {
        this.symbol = symbol;
        this.geometry = geometry;
        this.style = this._defineStyle(this.translate());
    },


    symbolize:function (ctx, resources) {
        var style = this.style;
        if (style['markerWidth'] === 0 || style['markerHeight'] === 0 || style['markerOpacity'] === 0) {
            return;
        }
        var cookedPoints = this._getRenderContainerPoints();
        if (!Z.Util.isArrayHasData(cookedPoints)) {
            return;
        }

        var img = this._getImage(resources);
        if (!img) {
            if (!Z.Browser.phantomjs) {
                console.warn('no img found for ' + (this.style['markerFile'] || this._url[0]));
            }
            return;
        }
        this._prepareContext(ctx);
        var width = style['markerWidth'];
        var height = style['markerHeight'];
        if (!Z.Util.isNumber(width) || !Z.Util.isNumber(height)) {
            width = img.width;
            height = img.height;
            style['markerWidth'] = width;
            style['markerHeight'] = height;
            var imgURL = [style['markerFile'], style['markerWidth'], style['markerHeight']];
            if (!resources.isResourceLoaded(imgURL)) {
                resources.addResource(imgURL, img);
            }
            this.geometry._getPainter()._removeCache();
        }
        var alpha;
        if (!(this instanceof Z.symbolizer.VectorPathMarkerSymbolizer) &&
            Z.Util.isNumber(style['markerOpacity']) && style['markerOpacity'] < 1)  {
            alpha = ctx.globalAlpha;
            ctx.globalAlpha *= style['markerOpacity'];
        }
        for (var i = 0, len = cookedPoints.length; i < len; i++) {
            //图片定位到中心底部
            Z.Canvas.image(ctx, img,
                cookedPoints[i].x - width / 2,
                cookedPoints[i].y - height,
                width, height);
        }
        if (alpha !== undefined) {
            ctx.globalAlpha = alpha;
        }
    },

    _getImage:function (resources) {
        var img = !resources ? null : resources.getImage([this.style['markerFile'], this.style['markerWidth'], this.style['markerHeight']]);
        return img;
    },

    getPlacement:function () {
        return this.symbol['markerPlacement'];
    },

    getDxDy:function () {
        var s = this.style;
        var dx = s['markerDx'],
            dy = s['markerDy'];
        return new Z.Point(dx, dy);
    },

    getMarkerExtent:function () {
        var width = this.style['markerWidth'],
            height = this.style['markerHeight'];
        var dxdy = this.getDxDy();
        var extent = new Z.PointExtent(dxdy.add(-width / 2, 0), dxdy.add(width / 2, -height));
        return extent;
    },

    translate:function () {
        var s = this.symbol;
        return {
            'markerFile' : s['markerFile'],
            'markerWidth' : s['markerWidth'] || null,
            'markerHeight' : s['markerHeight'] || null,
            'markerOpacity' : s['markerOpacity'] || 1,
            'markerDx' : s['markerDx'] || 0,
            'markerDy' : s['markerDy'] || 0
        };
    }
});


Z.symbolizer.ImageMarkerSymbolizer.test = function (symbol) {
    if (!symbol) {
        return false;
    }
    if (!Z.Util.isNil(symbol['markerFile'])) {
        return true;
    }
    return false;
};

Z.symbolizer.VectorMarkerSymbolizer = Z.symbolizer.PointSymbolizer.extend({

    defaultSymbol:{
        'markerType': 'ellipse', //<----- ellipse | cross | x | triangle | diamond | square | bar | pin等,默认ellipse

        'markerFill': '#0000ff', //blue as cartoCSS
        'markerFillOpacity': 1,
        'markerLineColor': '#000000', //black
        'markerLineWidth': 1,
        'markerLineOpacity': 1,
        'markerLineDasharray':[],
        'markerWidth': 10,
        'markerHeight': 10,

        'markerDx': 0,
        'markerDy': 0
    },

    initialize:function (symbol, geometry) {
        this.symbol = symbol;
        this.geometry = geometry;
        var style = this.translate();
        this.style = this._defineStyle(style);
        this.strokeAndFill = this._defineStyle(Z.symbolizer.VectorMarkerSymbolizer.translateLineAndFill(style));
    },

    symbolize:function (ctx, resources) {
        var style = this.style;
        if (style['markerWidth'] === 0 || style['markerHeight'] === 0 ||
            (style['polygonOpacity'] === 0 && style['lineOpacity'] === 0)) {
            return;
        }
        var cookedPoints = this._getRenderContainerPoints();
        if (!Z.Util.isArrayHasData(cookedPoints)) {
            return;
        }
        var strokeAndFill = this.strokeAndFill;
        this._prepareContext(ctx);
        if (Z.Util.isGradient(strokeAndFill['lineColor'])) {
            strokeAndFill['lineGradientExtent'] = this.geometry._getPainter().getContainerExtent()._expand(strokeAndFill['lineWidth'])._round();
        }
        if (Z.Util.isGradient(strokeAndFill['polygonFill'])) {
            strokeAndFill['polygonGradientExtent'] = this.geometry._getPainter().getContainerExtent()._round();
        }
        Z.Canvas.prepareCanvas(ctx, strokeAndFill, resources);
        this._drawMarkers(ctx, cookedPoints);
    },

    _drawMarkers: function (ctx, cookedPoints) {
        var style = this.style, strokeAndFill = this.strokeAndFill,
            markerType = style['markerType'].toLowerCase(),
            vectorArray = Z.symbolizer.VectorMarkerSymbolizer._getVectorPoints(markerType,
                            style['markerWidth'], style['markerHeight']),
            lineOpacity = strokeAndFill['lineOpacity'], fillOpacity = strokeAndFill['polygonOpacity'],
            j;
        var width = style['markerWidth'],
            height = style['markerHeight'],
            point, lineCap, angle;
        for (var i = cookedPoints.length - 1; i >= 0; i--) {
            point = cookedPoints[i];
            if (markerType === 'ellipse' || markerType === 'circle') {
                 //ellipse default
                Z.Canvas.ellipse(ctx, point, width / 2, height / 2, lineOpacity, fillOpacity);
            } else if (markerType === 'cross' || markerType === 'x') {
                for (j = vectorArray.length - 1; j >= 0; j--) {
                    vectorArray[j]._add(point);
                }
                //线类型
                Z.Canvas.path(ctx, vectorArray.slice(0, 2), lineOpacity);
                Z.Canvas.path(ctx, vectorArray.slice(2, 4), lineOpacity);
            } else if (markerType === 'diamond' || markerType === 'bar' || markerType === 'square' || markerType === 'triangle') {
                if (markerType === 'bar') {
                    point = point.add(0, -style['markerLineWidth'] / 2);
                }
                for (j = vectorArray.length - 1; j >= 0; j--) {
                    vectorArray[j]._add(point);
                }
                //面类型
                Z.Canvas.polygon(ctx, vectorArray, lineOpacity, fillOpacity);
            } else if (markerType === 'pin') {
                point = point.add(0, -style['markerLineWidth'] / 2);
                for (j = vectorArray.length - 1; j >= 0; j--) {
                    vectorArray[j]._add(point);
                }
                lineCap = ctx.lineCap;
                ctx.lineCap = 'round'; //set line cap to round to close the pin bottom
                Z.Canvas.bezierCurveAndFill(ctx, vectorArray, lineOpacity, fillOpacity);
                ctx.lineCap = lineCap;
            } else if (markerType === 'pie') {
                point = point.add(0, -style['markerLineWidth'] / 2);
                angle = Math.atan(width / 2 / height) * 180 / Math.PI;
                lineCap = ctx.lineCap;
                ctx.lineCap = 'round';
                Z.Canvas.sector(ctx, point, height, [90 - angle, 90 + angle], lineOpacity, fillOpacity);
                ctx.lineCap = lineCap;
            } else {
                throw new Error('unsupported markerType: ' + markerType);
            }
        }
    },

    getPlacement:function () {
        return this.symbol['markerPlacement'];
    },

    getDxDy:function () {
        var s = this.style;
        var dx = s['markerDx'],
            dy = s['markerDy'];
        return new Z.Point(dx, dy);
    },

    getMarkerExtent:function () {
        var dxdy = this.getDxDy(),
            style = this.style;
        var markerType = style['markerType'].toLowerCase();
        var width = style['markerWidth'],
            height = style['markerHeight'];
        var result;
        if (markerType  === 'bar' || markerType  === 'pie' || markerType  === 'pin') {
            result = new Z.PointExtent(dxdy.add(-width / 2, -height), dxdy.add(width / 2, 0));
        } else {
            result = new Z.PointExtent(dxdy.add(-width / 2, -height / 2), dxdy.add(width / 2, height / 2));
        }
        if (this.style['markerLineWidth']) {
            result = result.expand(this.style['markerLineWidth'] / 2);
        }
        return result;
    },

    translate: function () {
        var s = this.symbol;
        var d = this.defaultSymbol;
        var result = Z.Util.extend({}, d, s);
        //markerOpacity覆盖fillOpacity和lineOpacity
        if (Z.Util.isNumber(s['markerOpacity'])) {
            result['markerFillOpacity'] *= s['markerOpacity'];
            result['markerLineOpacity'] *= s['markerOpacity'];
        }
        return result;
    }
});


Z.symbolizer.VectorMarkerSymbolizer.translateLineAndFill = function (s) {
    var result = {
        'lineColor' : s['markerLineColor'],
        'linePatternFile' : s['markerLinePatternFile'],
        'lineWidth' : s['markerLineWidth'],
        'lineOpacity' : s['markerLineOpacity'],
        'lineDasharray': null,
        'lineCap' : 'butt',
        'lineJoin' : 'round',
        'polygonFill' : s['markerFill'],
        'polygonPatternFile' : s['markerFillPatternFile'],
        'polygonOpacity' : s['markerFillOpacity']
    };
    if (result['lineWidth'] === 0) {
        result['lineOpacity'] = 0;
    }
    return result;
};

Z.symbolizer.VectorMarkerSymbolizer.test = function (symbol) {
    if (!symbol) {
        return false;
    }
    if (Z.Util.isNil(symbol['markerFile']) && !Z.Util.isNil(symbol['markerType']) && (symbol['markerType'] !== 'path')) {
        return true;
    }
    return false;
};

Z.symbolizer.VectorMarkerSymbolizer.translateToSVGStyles = function (s) {
    var result = {
        'stroke' :{
            'stroke' : s['markerLineColor'],
            'stroke-width' : s['markerLineWidth'],
            'stroke-opacity' : s['markerLineOpacity'],
            'stroke-dasharray': null,
            'stroke-linecap' : 'butt',
            'stroke-linejoin' : 'round'
        },

        'fill' : {
            'fill'          : s['markerFill' ],
            'fill-opacity'  : s['markerFillOpacity']
        }
    };
    //vml和svg对linecap的定义不同
    if (result['stroke']['stroke-linecap'] === 'butt') {
        if (Z.Browser.vml) {
            result['stroke']['stroke-linecap'] = 'flat';
        }
    }
    if (result['stroke']['stroke-width'] === 0) {
        result['stroke']['stroke-opacity'] = 0;
    }
    return result;
};

Z.symbolizer.VectorMarkerSymbolizer._getVectorPoints = function (markerType, width, height) {
        //half height and half width
    var hh = Math.round(height / 2),
        hw = Math.round(width / 2);
    var left = 0, top = 0;
    var v0, v1, v2, v3;
    if (markerType === 'triangle') {
        v0 = new Z.Point(left, top - hh);
        v1 = new Z.Point(left - hw, top + hh);
        v2 = new Z.Point(left + hw, top + hh);
        return [v0, v1, v2];
    } else if (markerType === 'cross') {
        v0 = new Z.Point((left - hw), top);
        v1 = new Z.Point((left + hw), top);
        v2 = new Z.Point((left), (top - hh));
        v3 = new Z.Point((left), (top + hh));
        return [v0, v1, v2, v3];
    } else if (markerType === 'diamond') {
        v0 = new Z.Point((left - hw), top);
        v1 = new Z.Point(left, (top - hh));
        v2 = new Z.Point((left + hw), top);
        v3 = new Z.Point((left), (top + hh));
        return [v0, v1, v2, v3];
    } else if (markerType === 'square') {
        v0 = new Z.Point((left - hw), (top + hh));
        v1 = new Z.Point((left + hw), (top + hh));
        v2 = new Z.Point((left + hw), (top - hh));
        v3 = new Z.Point((left - hw), (top - hh));
        return [v0, v1, v2, v3];
    } else if (markerType === 'x') {
        v0 = new Z.Point(left - hw, top + hh);
        v1 = new Z.Point(left + hw, top - hh);
        v2 = new Z.Point(left + hw, top + hh);
        v3 = new Z.Point(left - hw, top - hh);
        return [v0, v1, v2, v3];
    } else if (markerType === 'bar') {
        v0 = new Z.Point((left - hw), (top - height));
        v1 = new Z.Point((left + hw), (top - height));
        v2 = new Z.Point((left + hw), top);
        v3 = new Z.Point((left - hw), top);
        return [v0, v1, v2, v3];
    } else if (markerType === 'pin') {
        var extWidth = height * Math.atan(hw / hh);
        v0 = new Z.Point(left, top);
        v1 = new Z.Point(left - extWidth, top - height);
        v2 = new Z.Point(left + extWidth, top - height);
        v3 = new Z.Point(left, top);
        return [v0, v1, v2, v3];
    }
    return null;
};

Z.symbolizer.VectorPathMarkerSymbolizer = Z.symbolizer.ImageMarkerSymbolizer.extend({

    initialize:function (symbol, geometry) {
        this.symbol = symbol;
        this.geometry = geometry;
        this._url = [Z.Geometry._getMarkerPathURL(symbol), symbol['markerWidth'], symbol['markerHeight']];
        this.style = this._defineStyle(this.translate());
        //IE must have a valid width and height to draw a svg image
        //otherwise, error will be thrown
        if (Z.Util.isNil(this.style['markerWidth'])) {
            this.style['markerWidth'] = 80;
        }
        if (Z.Util.isNil(this.style['markerHeight'])) {
            this.style['markerHeight'] = 80;
        }
    },

    _getImage:function (resources) {
        return !resources ? null : resources.getImage(this._url);
    }
});


Z.symbolizer.VectorPathMarkerSymbolizer.test = function (symbol) {
    if (!symbol) {
        return false;
    }
    if (Z.Util.isNil(symbol['markerFile']) && symbol['markerType'] === 'path') {
        return true;
    }
    return false;
};

Z.symbolizer.TextMarkerSymbolizer = Z.symbolizer.PointSymbolizer.extend({
    defaultSymbol:{
        'textFaceName'      : 'monospace',
        'textSize'          : 10,
        'textFont'          : null,
        'textFill'          : '#000',
        'textOpacity'       : 1,
        'textHaloFill'      : '#ffffff',
        'textHaloRadius'    : 0,
        'textWrapWidth'     : null,
        'textWrapBefore'    : false,
        'textWrapCharacter' : null,
        'textLineSpacing'   : 0,

        'textDx'            : 0,
        'textDy'            : 0,

        'textHorizontalAlignment' : 'middle', //left | middle | right | auto
        'textVerticalAlignment'   : 'middle',   // top | middle | bottom | auto
        'textAlign'               : 'center' //left | right | center | auto
    },

    initialize:function (symbol, geometry) {
        this.symbol = symbol;
        this.geometry = geometry;
        var style = this.translate();
        this.style = this._defineStyle(style);
        this.strokeAndFill = this._defineStyle(this.translateLineAndFill(style));
        var textContent = Z.StringUtil.replaceVariable(this.style['textName'], this.geometry.getProperties());
        this._descText(textContent);
    },

    symbolize:function (ctx, resources) {
        if (this.style['textSize'] === 0 || this.style['textOpacity'] === 0) {
            return;
        }
        var cookedPoints = this._getRenderContainerPoints();
        if (!Z.Util.isArrayHasData(cookedPoints)) {
            return;
        }
        var rotations = this._getRotations();
        var style = this.style,
            strokeAndFill = this.strokeAndFill;
        var textContent = Z.StringUtil.replaceVariable(this.style['textName'], this.geometry.getProperties());
        this._descText(textContent);
        this._prepareContext(ctx);
        Z.Canvas.prepareCanvas(ctx, strokeAndFill, resources);
        Z.Canvas.prepareCanvasFont(ctx, style);
        var p;
        for (var i = 0, len = cookedPoints.length; i < len; i++) {
            p = cookedPoints[i];
            if (rotations && !Z.Util.isNil(rotations[i])) {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(rotations[i]);
                p = new Z.Point(0, 0);
            }
            Z.Canvas.text(ctx, textContent, p, style, this.textDesc);
            if (rotations && !Z.Util.isNil(rotations[i])) {
                ctx.restore();
            }
        }
    },

    getPlacement:function () {
        return this.symbol['textPlacement'];
    },

    getDxDy:function () {
        var s = this.style;
        var dx = s['textDx'],
            dy = s['textDy'];
        return new Z.Point(dx, dy);
    },

    getMarkerExtent:function () {
        var dxdy = this.getDxDy(),
            style = this.style,
            size = this.textDesc['size'];
        var alignPoint = Z.StringUtil.getAlignPoint(size, style['textHorizontalAlignment'], style['textVerticalAlignment']);
        var alignW = alignPoint.x, alignH = alignPoint.y;
        return new Z.PointExtent(
            dxdy.add(alignW, alignH),
            dxdy.add(alignW + size['width'], alignH + size['height'])
        );
    },

    translate:function () {
        var s = this.symbol;
        var d = this.defaultSymbol;
        var result = Z.Util.extend({}, d, s);
        result['textName'] = s['textName'];
        return result;
    },

    translateLineAndFill:function (s) {
        return {
            'lineColor' : s['textHaloRadius'] ? s['textHaloFill'] : s['textFill'],
            'lineWidth' : s['textHaloRadius'],
            'lineOpacity' : s['textOpacity'],
            'lineDasharray' : null,
            'lineCap' : 'butt',
            'lineJoin' : 'round',
            'polygonFill' : s['textFill'],
            'polygonOpacity' : s['textOpacity']
        };
    },

    _descText : function (textContent) {
        this.textDesc = this._loadFromCache(textContent, this.style);
        if (!this.textDesc) {
            this.textDesc = Z.StringUtil.splitTextToRow(textContent, this.style);
            this._storeToCache(textContent, this.style, this.textDesc);
        }
    },

    _storeToCache: function (textContent, style, textDesc) {
        if (Z.node) {
            return;
        }
        if (!this.geometry['___text_symbol_cache']) {
            this.geometry['___text_symbol_cache'] = {};
        }
        this.geometry['___text_symbol_cache'][this._genCacheKey(style)] = textDesc;
    },

    _loadFromCache:function (textContent, style) {
        if (!this.geometry['___text_symbol_cache']) {
            return null;
        }
        return this.geometry['___text_symbol_cache'][this._genCacheKey(textContent, style)];
    },

    _genCacheKey: function (textContent, style) {
        var key = [textContent];
        for (var p in style) {
            if (style.hasOwnProperty(p) && p.length > 4 && p.substring(0, 4) === 'text') {
                key.push(p + '=' + style[p]);
            }
        }
        return key.join('-');
    }
});



Z.symbolizer.TextMarkerSymbolizer.test = function (symbol) {
    if (!symbol) {
        return false;
    }
    if (!Z.Util.isNil(symbol['textName'])) {
        return true;
    }
    return false;
};

Z.symbolizer.TextMarkerSymbolizer.getFont = function (style) {
    if (style['textFont']) {
        return style['textFont'];
    } else {
        return style['textSize'] + 'px ' + (style['textFaceName'][0] === '"' ? style['textFaceName'] : '"' + style['textFaceName'] + '"');
    }
};

Z.symbolizer.DebugSymbolizer = Z.symbolizer.PointSymbolizer.extend({

    styles:{
        'lineColor':'#000',
        'lineOpacity' : 1,
        'lineWidth' : 1
    },

    initialize:function (symbol, geometry) {
        this.symbol = symbol;
        this.geometry = geometry;
    },

    getPlacement:function () {
        return 'center';
    },

    getDxDy:function () {
        return new Z.Point(0, 0);
    },

    symbolize:function (ctx) {
        var geometry = this.geometry,
            layer = geometry.getLayer();
        if (!geometry.options['debug'] && !layer.options['debug']) {
            return;
        }
        var map = this.getMap();
        if (map._zooming) {
            return;
        }
        Z.Canvas.prepareCanvas(ctx, this.styles);
        var op = this.styles['lineOpacity'];

        //outline
        var pixelExtent = geometry._getPainter().getViewExtent(),
            size = pixelExtent.getSize();
        var nw = map.viewPointToContainerPoint(pixelExtent.getMin());
        Z.Canvas.rectangle(ctx, nw, size, op, 0);

        //center cross and id if have any.
        var points = this._getRenderContainerPoints();

        var id = this.geometry.getId();
        var cross = Z.symbolizer.VectorMarkerSymbolizer._getVectorPoints('cross', 10, 10);
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            if (!Z.Util.isNil(id)) {
                Z.Canvas.fillText(ctx, id, p.add(8, -4), 'rgba(0,0,0,1)');
            }
            var c = [];
            for (var ii = 0; ii < cross.length; ii++) {
                c.push(cross[ii].add(p));
            }
            Z.Canvas.path(ctx, c.slice(0, 2), op);
            Z.Canvas.path(ctx, c.slice(2, 4), op);
        }
    }

});

var Symboling = {};
//有中心点的图形的共同方法
Symboling.Center = {
    _getRenderPoints:function () {
        return [[this._getCenterViewPoint()], null];
    }
};
/**
 * 获取symbolizer所需的数据
 */
Z.Marker.include(Symboling.Center);

Z.Ellipse.include(Symboling.Center, {
    _getRenderSize:function () {
        var w = this.getWidth(),
            h = this.getHeight();
        var map = this.getMap();
        return map.distanceToPixel(w / 2, h / 2);
    }
});

Z.Circle.include(Symboling.Center, {
    _getRenderSize:function () {
        var radius = this.getRadius();
        var map = this.getMap();
        return map.distanceToPixel(radius, radius);
    }
});
//----------------------------------------------------
Z.Sector.include(Symboling.Center, {
    _getRenderSize:function () {
        var radius = this.getRadius();
        var map = this.getMap();
        return map.distanceToPixel(radius, radius);
    }
});
//----------------------------------------------------
Z.Rectangle.include({
    _getRenderPoints:function (placement) {
        if (placement === 'point') {
            var shell = this.getShell();
            var points = [];
            for (var i = 0, len = shell.length; i < len; i++) {
                points.push(this.getMap().coordinateToViewPoint(shell[i]));
            }
            return [points, null];
        } else {
            var domNw = this.getMap()._prjToViewPoint(this._getPrjCoordinates());
            return [[domNw], null];
        }
    },

    _getRenderSize:function () {
        var w = this.getWidth(),
            h = this.getHeight();
        var map = this.getMap();
        return map.distanceToPixel(w, h);
    }
});
//----------------------------------------------------
Symboling.Poly = {
    _getRenderPoints:function (placement) {
        var map = this.getMap();
        var points, rotations = null;
        if (placement === 'point') {
            points = this._getPathViewPoints(this._getPrjCoordinates());
            if (points && points.length > 0 && Z.Util.isArray(points[0])) {
                //anti-meridian
                points = points[0].concat(points[1]);
            }
        } else if (placement === 'line') {
            points = [];
            rotations = [];
            var vertice = this._getPathViewPoints(this._getPrjCoordinates()),
                isSplitted =  vertice.length > 0 && Z.Util.isArray(vertice[0]);
            var i, len;
            if (isSplitted) {
                //anti-meridian splitted
                var ring, ii, ilen;
                for (i = 1, len = vertice.length; i < len; i++) {
                    ring = vertice[i];
                    if (this instanceof Z.Polygon && ring.length > 0 && !ring[0].equals(ring[ring.length - 1])) {
                        ring.push(ring[0]);
                    }
                    for (ii = 1, ilen = ring.length; ii < ilen; ii++) {
                        points.push(ring[ii].add(ring[ii - 1])._multi(0.5));
                        rotations.push(Z.Util.computeDegree(ring[ii - 1], ring[ii]));
                    }
                }
            } else {
                if (this instanceof Z.Polygon && vertice.length > 0 && !vertice[0].equals(vertice[vertice.length - 1])) {
                    vertice.push(vertice[0]);
                }
                for (i = 1, len = vertice.length; i < len; i++) {
                    points.push(vertice[i].add(vertice[i - 1])._multi(0.5));
                    rotations.push(Z.Util.computeDegree(vertice[i - 1], vertice[i]));
                }
            }

        } else {
            var center = this.getCenter();
            var pcenter = this._getProjection().project(center);
            points = [map._prjToViewPoint(pcenter)];
        }
        return [points, rotations];
    }
};

Z.Polyline.include(Symboling.Poly);

Z.Polygon.include(Symboling.Poly);

//如果不支持canvas, 则不载入canvas的绘制逻辑
if (Z.Browser.canvas) {

    var ellipseReources = {
        _getRenderCanvasResources:function () {
            var map = this.getMap();
            var pcenter = this._getPrjCoordinates();
            var pt = map._prjToViewPoint(pcenter);
            var size = this._getRenderSize();
            return {
                'fn' : Z.Canvas.ellipse,
                'context' : [pt, size['width'], size['height']]
            };
        }
    };

    Z.Ellipse.include(ellipseReources);

    Z.Circle.include(ellipseReources);
    //----------------------------------------------------
    Z.Rectangle.include({
        _getRenderCanvasResources:function () {
            var map = this.getMap();
            var pt = map._prjToViewPoint(this._getPrjCoordinates());
            var size = this._getRenderSize();
            return {
                'fn' : Z.Canvas.rectangle,
                'context' : [pt, size]
            };
        }
    });
    //----------------------------------------------------
    Z.Sector.include({
        _getRenderCanvasResources:function () {
            var map = this.getMap();
            var pcenter = this._getPrjCoordinates();
            var pt = map._prjToViewPoint(pcenter);
            var size = this._getRenderSize();
            return {
                'fn' : Z.Canvas.sector,
                'context' : [pt, size['width'], [this.getStartAngle(), this.getEndAngle()]]
            };
        }

    });
    //----------------------------------------------------

    Z.Polyline.include({
        _arrow: function (ctx, prePoint, point, opacity, arrowStyle) {
            if (arrowStyle !== 'classic') {
                return;
            }
            var lineWidth = this._getInternalSymbol()['lineWidth'];
            if (!lineWidth) {
                lineWidth = 3;
            }
            //TODO 箭头与线宽度的比率相差近四倍,导致不太协调
            lineWidth = lineWidth / 2;
            var arrowWidth = lineWidth * 3,
                arrowHeight = lineWidth * 4,
                hh = arrowHeight / 2,
                hw = arrowWidth / 2;

            var v0 = new Z.Point(0, -hh),
                v1 = new Z.Point(Z.Util.round(-hw), Z.Util.round(hh)),
                v2 = new Z.Point(Z.Util.round(hw), Z.Util.round(hh));
            var pts = [v0, v1, v2];
            var angle = Math.atan2(point.x - prePoint.x, prePoint.y - point.y);
            var matrix = new Z.Matrix().translate(point.x, point.y).rotate(angle);
            var ptsToDraw = matrix.applyToArray(pts);
            Z.Canvas.polygon(ctx, ptsToDraw, opacity, opacity);
        },

        _getRenderCanvasResources:function () {
            //draw a triangle arrow

            var prjVertexes = this._getPrjCoordinates();
            var points = this._getPathViewPoints(prjVertexes);

            var me = this;
            var fn = function (_ctx, _points, _lineOpacity, _fillOpacity, _dasharray) {
                Z.Canvas.path(_ctx, _points, _lineOpacity, null, _dasharray);
                if (_ctx.setLineDash && Z.Util.isArrayHasData(_dasharray)) {
                    //remove line dash effect if any
                    _ctx.setLineDash([]);
                }
                if (me.options['arrowStyle'] && _points.length >= 2) {
                    var placement = me.options['arrowPlacement'];
                    if (placement === 'vertex-first' || placement === 'vertex-firstlast') {
                        me._arrow(_ctx, _points[1], _points[0], _lineOpacity, me.options['arrowStyle']);
                    }
                    if (placement === 'vertex-last' || placement === 'vertex-firstlast') {
                        me._arrow(_ctx, _points[_points.length - 2], _points[_points.length - 1], _lineOpacity, me.options['arrowStyle']);
                    }
                    if (placement === 'point') {
                        for (var i = 0, len = _points.length - 1; i < len; i++) {
                            me._arrow(_ctx, _points[i], _points[i + 1], _lineOpacity, me.options['arrowStyle']);
                        }
                    }
                }
            };
            return {
                'fn' : fn,
                'context' : [points]
            };
        }
    });

    Z.Polygon.include({
        _getRenderCanvasResources:function () {
            var prjVertexes = this._getPrjCoordinates(),
                points = this._getPathViewPoints(prjVertexes),
                //splitted by anti-meridian
                isSplitted = points.length > 0 && Z.Util.isArray(points[0]);
            if (isSplitted) {
                points = [[points[0]], [points[1]]];
            }
            var prjHoles = this._getPrjHoles();
            var holePoints = [];
            if (Z.Util.isArrayHasData(prjHoles)) {
                var hole;
                for (var i = 0; i < prjHoles.length; i++) {
                    hole = this._getPathViewPoints(prjHoles[i]);
                    if (isSplitted) {
                        if (Z.Util.isArray(hole)) {
                            points[0].push(hole[0]);
                            points[1].push(hole[1]);
                        } else {
                            points[0].push(hole);
                        }
                    } else {
                        holePoints.push(hole);
                    }

                }
            }
            var resource =  {
                'fn' : Z.Canvas.polygon,
                'context' : [isSplitted ? points : [points].concat(holePoints)]
            };
            return resource;
        }
    });
}

/**
 * @classdesc
 * Painter class for all geometry types except the collection types.
 * @class
 * @protected
 * @param {maptalks.Geometry} geometry - geometry to paint
 */
Z.Painter = Z.Class.extend(/** @lends maptalks.Painter.prototype */{


    initialize:function (geometry) {
        this.geometry = geometry;
        this.symbolizers = this._createSymbolizers();
    },

    getMap:function () {
        return this.geometry.getMap();
    },

    /**
     * 构造symbolizers
     * @return {*} [description]
     */
    _createSymbolizers:function () {
        var geoSymbol = this._getSymbol();
        var symbolizers = [];
        var regSymbolizers = Z.Painter.registerSymbolizers;
        var symbols = geoSymbol;
        if (!Z.Util.isArray(geoSymbol)) {
            symbols = [geoSymbol];
        }
        for (var ii = 0; ii < symbols.length; ii++) {
            var symbol = symbols[ii];
            for (var i = regSymbolizers.length - 1; i >= 0; i--) {
                if (regSymbolizers[i].test(symbol)) {
                    var symbolizer = new regSymbolizers[i](symbol, this.geometry);
                    symbolizers.push(symbolizer);
                    if (symbolizer instanceof Z.symbolizer.PointSymbolizer) {
                        this._hasPointSymbolizer = true;
                    }
                }
            }
        }
        if (symbolizers.length === 0) {
            throw new Error('no symbolizers can be created to draw, check the validity of the symbol.');
        }
        this._debugSymbolizer = new Z.symbolizer.DebugSymbolizer(symbol, this.geometry);
        return symbolizers;
    },

    hasPointSymbolizer:function () {
        return this._hasPointSymbolizer;
    },

    getTransformMatrix: function () {
        if (this._matrix) {
            return this._matrix;
        }
        return null;
    },

    /**
     * for point symbolizers
     * @return {maptalks.Point[]} points to render
     */
    _getRenderPoints:function (placement) {
        if (!this._renderPoints) {
            this._renderPoints = {};
        }
        if (!placement) {
            placement = 'default';
        }
        if (!this._renderPoints[placement]) {
            this._renderPoints[placement] = this.geometry._getRenderPoints(placement);
        }
        return this._renderPoints[placement];
    },

    /**
     * for strokeAndFillSymbolizer
     * @return {Object[]} resources to render vector
     */
    _getRenderResources:function () {
        if (!this._rendResources) {
            //render resources geometry returned are based on view points.
            this._rendResources = this.geometry._getRenderCanvasResources();
        }
        var matrices = this.getTransformMatrix(),
            matrix = matrices ? matrices['container'] : null,
            scale = matrices ? matrices['scale'] : null;
        var layerViewPoint = this.geometry.getLayer()._getRenderer()._viewExtent.getMin(),
            context = this._rendResources['context'],
            transContext = [],
        //refer to Geometry.Canvas
            points = context[0],
            containerPoints;
        //convert view points to container points needed by canvas
        if (Z.Util.isArray(points)) {
            containerPoints = Z.Util.mapArrayRecursively(points, function (point) {
                var cp = point.substract(layerViewPoint);
                if (matrix) {
                    return matrix.applyToPointInstance(cp);
                }
                return cp;
            });
        } else if (points instanceof Z.Point) {
            containerPoints = points.substract(layerViewPoint);
            if (matrix) {
                containerPoints = matrix.applyToPointInstance(containerPoints);
            }
        }
        transContext.push(containerPoints);

        //scale width ,height or radius if geometry has
        for (var i = 1, len = context.length; i < len; i++) {
            if (matrix) {
                if (Z.Util.isNumber(context[i]) || (context[i] instanceof Z.Size)) {
                    if (Z.Util.isNumber(context[i])) {
                        transContext.push(scale.x * context[i]);
                    } else {
                        transContext.push(new Z.Size(context[i].width * scale.x, context[i].height * scale.y));
                    }
                } else {
                    transContext.push(context[i]);
                }
            } else {
                transContext.push(context[i]);
            }
        }

        var resources = {
            'fn' : this._rendResources['fn'],
            'context' : transContext
        };

        return resources;
    },

    _getSymbol:function () {
        return this.geometry._getInternalSymbol();
    },

    /**
     * 绘制图形
     */
    paint: function (matrix) {
        var contexts = this.geometry.getLayer()._getRenderer().getPaintContext();
        if (!contexts || !this.symbolizers) {
            return;
        }
        this._matrix = matrix;
        var args = contexts.concat([this]);
        for (var i = this.symbolizers.length - 1; i >= 0; i--) {
            var symbolizer = this.symbolizers[i];
            symbolizer.symbolize.apply(symbolizer, args);
        }
        this._painted = true;
        this._debugSymbolizer.symbolize.apply(this._debugSymbolizer, args);
    },

    _eachSymbolizer:function (fn, context) {
        if (!this.symbolizers) {
            return;
        }
        if (!context) {
            context = this;
        }
        for (var i = this.symbolizers.length - 1; i >= 0; i--) {
            fn.apply(context, [this.symbolizers[i]]);
        }
    },

    //需要实现的接口方法
    getViewExtent:function () {
        if (!this._viewExtent) {
            if (this.symbolizers) {
                var viewExtent = new Z.PointExtent();
                var len = this.symbolizers.length - 1;
                for (var i = len; i >= 0; i--) {
                    viewExtent._combine(this.symbolizers[i].getViewExtent());
                }
                viewExtent._round();
                this._viewExtent = viewExtent;
            }
        }
        return this._viewExtent;
    },

    getContainerExtent : function () {
        var layerViewPoint = this.geometry.getLayer()._getRenderer()._viewExtent.getMin(),
            viewExtent = this.getViewExtent();
        var matrices = this.getTransformMatrix(),
            matrix = matrices ? matrices['container'] : null;
        var containerExtent = viewExtent.add(layerViewPoint._multi(-1));
        if (matrix) {
            containerExtent = new Z.PointExtent(
                    matrix.applyToPointInstance(containerExtent.getMin()),
                    matrix.applyToPointInstance(containerExtent.getMax())
                    );
        }
        return containerExtent;
    },

    setZIndex:function (change) {
        this._eachSymbolizer(function (symbolizer) {
            symbolizer.setZIndex(change);
        });
    },

    show:function () {
        if (!this._painted) {
            var layer = this.geometry.getLayer();
            if (!layer.isCanvasRender()) {
                this.paint();
            }
        } else {
            this._removeCache();
            this._refreshSymbolizers();
            this._eachSymbolizer(function (symbolizer) {
                symbolizer.show();
            });
        }
        this._requestToRender();
    },

    hide:function () {
        this._eachSymbolizer(function (symbolizer) {
            symbolizer.hide();
        });
        this._requestToRender();
    },

    onZoomEnd:function () {
        this._removeCache();
        this._refreshSymbolizers();
    },

    repaint:function () {
        this._removeCache();
        this._refreshSymbolizers();
        if (this.geometry.isVisible()) {
            this._requestToRender();
        }
    },

    _refreshSymbolizers:function () {
        this._eachSymbolizer(function (symbolizer) {
            symbolizer.refresh();
        });
    },

    _requestToRender:function () {
        var geometry = this.geometry,
            map = geometry.getMap();
        if (!map || map._isBusy()) {
            return;
        }
        var layer = geometry.getLayer(),
            renderer = layer._getRenderer();
        if (!renderer || !(layer instanceof Z.VectorLayer)) {
            return;
        }
        if (layer.isCanvasRender()) {
            renderer.render([geometry]);
        }
    },

    /**
     * symbol发生变化后, 刷新symbol
     */
    refreshSymbol:function () {
        this._removeCache();
        this._removeSymbolizers();
        this.symbolizers = this._createSymbolizers();
        if (!this.getMap()) {
            return;
        }
        if (this.geometry.isVisible()) {
            var layer = this.geometry.getLayer();
            if (layer.isCanvasRender()) {
                this._requestToRender();
            } else {
                this.paint();
            }
        }
    },

    remove:function () {
        this._removeCache();
        this._removeSymbolizers();
    },

    _removeSymbolizers:function () {
        this._eachSymbolizer(function (symbolizer) {
            symbolizer.remove();
        });
        delete this.symbolizers;
    },

    /**
     * 删除缓存属性
     */
    _removeCache:function () {
        delete this._renderPoints;
        delete this._rendResources;
        delete this._viewExtent;
    }
});

//注册的symbolizer
Z.Painter.registerSymbolizers = [
    Z.symbolizer.StrokeAndFillSymbolizer,
    Z.symbolizer.ImageMarkerSymbolizer,
    Z.symbolizer.VectorMarkerSymbolizer,
    Z.symbolizer.VectorPathMarkerSymbolizer,
    Z.symbolizer.TextMarkerSymbolizer
];

/**
 * @classdesc
 * Painter for collection type geometries
 * @class
 * @protected
 * @param {maptalks.GeometryCollection} geometry - geometry to paint
 */
Z.CollectionPainter = Z.Class.extend(/** @lends maptalks.CollectionPainter.prototype */{
    initialize:function (geometry) {
        this.geometry = geometry;
    },

    _eachPainter:function (fn) {
        var geometries = this.geometry.getGeometries();
        var painter;
        for (var i = 0, len = geometries.length; i < len; i++) {
            painter = geometries[i]._getPainter();
            if (!painter) {
                continue;
            }
            if (painter) {
                if (fn.call(this, painter) === false) {
                    break;
                }
            }
        }
    },

    paint:function (matrix) {
        if (!this.geometry) {
            return;
        }
        this._eachPainter(function (painter) {
            painter.paint(matrix);
        });
    },

    getViewExtent:function () {
        var  extent = new Z.PointExtent();
        this._eachPainter(function (painter) {
            extent = extent.combine(painter.getViewExtent());
        });
        return extent;
    },

    remove:function () {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.remove.apply(painter, args);
        });
    },

    setZIndex:function () {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.setZIndex.apply(painter, args);
        });
    },

    show:function () {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.show.apply(painter, args);
        });
    },

    hide:function () {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.hide.apply(painter, args);
        });
    },

    onZoomEnd:function () {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.onZoomEnd.apply(painter, args);
        });
    },

    repaint:function () {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.repaint.apply(painter, args);
        });
    },

    refreshSymbol:function () {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.refreshSymbol.apply(painter, args);
        });
    },

    hasPointSymbolizer:function () {
        var result = false;
        this._eachPainter(function (painter) {
            if (painter.hasPointSymbolizer()) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }
});

/**
 * @namespace
 */
Z.ui = {};
/**
 * @classdesc
 * Base class for all the ui component classes.
 *
 * Some instance methods subclasses needs to implement:
 *
 * 1. Optional, UI Dom's pixel offset from UI's coordinate
 * function getOffset : maptalks.Point
 *
 * 2. Method to create UI's Dom element
 * function buildOn : HTMLElement
 *
 * 3 Optional, to provide an event map to register event listeners.
 * function getEvents : void
 *
 * @class
 * @category ui
 * @abstract
 * @mixes maptalks.Eventable
 * @memberOf maptalks.ui
 * @name UIComponent
 */
Z.ui.UIComponent = Z.Class.extend(/** @lends maptalks.ui.UIComponent.prototype */{
    includes: [Z.Eventable],

    /**
     * @property {Object} options
     * @property {Boolean} [options.eventsToStop='mousedown dblclick']  - events to stop propagation from UI's Dom.
     * @property {Number}  [options.dx=0]     - pixel offset on x axis
     * @property {Number}  [options.dy=0]     - pixel offset on y axis
     * @property {Boolean} [options.autoPan=false]  - set it to false if you don't want the map to do panning animation to fit the opened UI.
     */
    options:{
        'eventsToStop' : 'mousedown dblclick',
        'dx'     : 0,
        'dy'     : 0,
        'autoPan' : false,
        'single' : true
    },

    initialize: function (options) {
        Z.Util.setOptions(this, options);
    },

    /**
     * Adds the UI Component to a geometry or a map
     * @param {maptalks.Geometry|maptalks.Map} owner - geometry or map to addto.
     * @returns {maptalks.ui.UIComponent} this
     */
    addTo:function (owner) {
        this._owner = owner;
        return this;
    },

    /**
     * Get the map instance it displayed
     * @return {maptalks.Map} map instance
     * @override
     */
    getMap:function () {
        if (this._owner instanceof Z.Map) {
            return this._owner;
        }
        return this._owner.getMap();
    },

    /**
     * Show the UI Component, if it is a global single one, it will close previous one.
     * @param {maptalks.Coordinate} - coordinate to show
     * @return {maptalks.ui.UIComponent} this
     */
    show: function (coordinate) {
        if (!coordinate) {
            throw new Error('UI\'s show coordinate is invalid');
        }
        this.fire('showstart');
        var map = this.getMap(),
            container = this._getUIContainer();
        if (!this.__uiDOM) {
            this._switchEvents('on');
        }
        this._coordinate = coordinate;
        this._removePrevDOM();
        var dom = this.__uiDOM = this.buildOn(map);
        if (!dom) {
            this.fire('showend');
            return this;
        }

        this._measureSize(dom);

        if (this._singleton()) {
            map[this._uiDomKey()] = dom;
        }

        var point = this._getPosition();

        dom.style.position = 'absolute';
        dom.style.left = point.x + 'px';
        dom.style.top  = point.y + 'px';
        dom.style.display = '';

        container.appendChild(dom);

        if (this.options['eventsToStop']) {
            Z.DomUtil.on(dom, this.options['eventsToStop'], Z.DomUtil.stopPropagation);
        }

        //autoPan
        if (this.options['autoPan']) {
            this._autoPan();
        }
        this.fire('showend');
        return this;
    },

    /**
     * Hide the UI Component.
     * @return {maptalks.ui.UIComponent} this
     */
    hide:function () {
        if (!this._getDOM()) {
            return this;
        }
        this._getDOM().style.display = 'none';
        this.fire('hide');
        return this;
    },

    /**
     * Decide whether the component is open
     * @returns {Boolean} true|false
     */
    isVisible:function () {
        return this._getDOM() && this._getDOM().style.display !== 'none';
    },

    /**
     * Remove the UI Component
     * @return {maptalks.ui.UIComponent} this
     */
    remove: function () {
        this.hide();
        this._switchEvents('off');
        delete this._owner;
        delete this._map;
        if (!this._singleton() && this.__uiDOM) {
            this._removePrevDOM();
        }
        this.fire('remove');
        return this;
    },

    /**
     * Get pixel size of the UI Component.
     * @return {maptalks.Size} size
     */
    getSize:function () {
        if (this._size) {
            return this._size.copy();
        } else {
            return null;
        }
    },

    getOwner: function () {
        return this._owner;
    },

    _getPosition : function () {
        var p = this.getMap().coordinateToViewPoint(this._coordinate)
                    ._add(this.options['dx'], this.options['dy']);
        if (this.getOffset) {
            var o = this.getOffset();
            if (o) { p._add(o); }
        }
        return p;
    },

    _getDOM : function () {
        return this.__uiDOM;
    },

    _autoPan : function () {
        var map = this.getMap(),
            dom = this._getDOM();
        var point = new Z.Point(parseInt(dom.style.left), parseInt(dom.style.top));
        var mapSize = map.getSize(),
            mapWidth = mapSize['width'],
            mapHeight = mapSize['height'];

        var containerPoint = map.viewPointToContainerPoint(point);
        var clientWidth = parseInt(dom.clientWidth),
            clientHeight = parseInt(dom.clientHeight);
        var left = 0, top = 0;
        if ((containerPoint.x) < 0) {
            left = -(containerPoint.x - clientWidth / 2);
        } else if ((containerPoint.x + clientWidth - 35) > mapWidth) {
            left = (mapWidth - (containerPoint.x + clientWidth * 3 / 2));
        }
        if (containerPoint.y < 0) {
            top = -containerPoint.y + 50;
        } else if (containerPoint.y > mapHeight) {
            top = (mapHeight - containerPoint.y - clientHeight) - 30;
        }
        if (top !== 0 || left !== 0) {
            map._panAnimation(new Z.Point(left, top), 600);
        }
    },

    /**
     * Measure dom's size
     * @param  {HTMLElement} dom - element to measure
     * @return {maptalks.Size} size
     * @private
     */
    _measureSize:function (dom) {
        var container = this._getUIContainer();
        dom.style.position = 'absolute';
        dom.style.left = -99999 + 'px';
        dom.style.top = -99999 + 'px';
        dom.style.display = '';
        container.appendChild(dom);
        this._size = new Z.Size(dom.clientWidth, dom.clientHeight);
        dom.style.display = 'none';
        return this._size;
    },

    /**
     * Remove previous UI DOM if it has.
     *
     * @private
     */
    _removePrevDOM:function () {
        if (this._onDOMRemove) {
            this._onDOMRemove();
        }
        if (this._singleton()) {
            var map = this.getMap(),
                key = this._uiDomKey();
            if (map[key]) {
                Z.DomUtil.removeDomNode(map[key]);
                delete map[key];
            }
            delete this.__uiDOM;
        } else if (this.__uiDOM) {
            Z.DomUtil.removeDomNode(this.__uiDOM);
            delete this.__uiDOM;
        }
    },

    /**
     * generate the cache key to store the singletong UI DOM
     * @private
     * @return {String} cache key
     */
    _uiDomKey:function () {
        return '__ui_' + this._getClassName();
    },

    _singleton:function () {
        return this.options['single'];
    },

    _getUIContainer : function () {
        return this.getMap()._panels['ui'];
    },

    _getClassName:function () {
        for (var p in Z.ui) {
            if (Z.ui.hasOwnProperty(p)) {
                if (p === 'UIComponent') {
                    continue;
                }
                if (this instanceof (Z.ui[p])) {
                    return p;
                }
            }
        }
        return null;
    },

    _switchEvents: function (to) {
        var events = this._getDefaultEvents();
        if (this.getEvents) {
            Z.Util.extend(events, this.getEvents());
        }
        if (events) {
            var map = this.getMap();
            for (var p in events) {
                if (events.hasOwnProperty(p)) {
                    map[to](p, events[p], this);
                }
            }
        }
    },

    _getDefaultEvents: function () {
        return {
            'zooming' : this._onZooming,
            'zoomend' : this._onZoomEnd
        };
    },

    _onZooming : function (param) {
        if (!this.isVisible() || !this._getDOM()) {
            return;
        }
        var dom = this._getDOM(),
            point = this.getMap().coordinateToViewPoint(this._coordinate),
            matrix = param['matrix']['view'];
        var p = matrix.applyToPointInstance(point)._add(this.options['dx'], this.options['dy']);
        if (this.getOffset) {
            var o = this.getOffset();
            if (o) { p._add(o); }
        }
        dom.style.left = p.x + 'px';
        dom.style.top  = p.y + 'px';
    },

    _onZoomEnd : function () {
        if (!this.isVisible() || !this._getDOM()) {
            return;
        }
        var dom = this._getDOM(),
            p = this._getPosition();
        dom.style.left = p.x + 'px';
        dom.style.top  = p.y + 'px';
    }
});

/**
 * @classdesc
 * Class for UI Marker, a html based marker positioned by geographic coordinate.
 *
 * As it's an actual html element, it:
 * 1. always on the top of all the map layers
 * 2. can't be snapped as it's not drawn on the canvas.
 *
 * @class
 * @category ui
 * @extends maptalks.ui.UIComponent
 * @param {Object} options - construct options
 * @memberOf maptalks.ui
 * @name UIMarker
 */
Z.ui.UIMarker = Z.ui.UIComponent.extend(/** @lends maptalks.ui.UIMarker.prototype */{

    includes: [Z.Handlerable],

    options : {
        'draggable': false,
        'single' : false,
        'content' : null
    },

    initialize: function (coordinate, options) {
        this._markerCoord = new Z.Coordinate(coordinate);
        Z.Util.setOptions(this, options);
    },

    setCoordinates: function (coordinates) {
        this._markerCoord = coordinates;
        if (this.isVisible()) {
            this.show();
        }
        return this;
    },

    getCoordinates: function () {
        return this._markerCoord;
    },

    setContent: function (content) {
        this.options['content'] = content;
        if (this.isVisible()) {
            this.show();
        }
        return this;
    },

    getContent: function () {
        return this.options['content'];
    },

    show: function (coordinates) {
        return Z.ui.UIComponent.prototype.show.call(this, coordinates || this._markerCoord);
    },

    buildOn: function () {
        var dom;
        if (Z.Util.isString(this.options['content'])) {
            dom = Z.DomUtil.createEl('div');
            dom.innerHTML = this.options['content'];
        } else {
            dom = this.options['content'];
        }
        this._registerDOMEvents(dom);
        return dom;
    },

    getOffset: function () {
        var size = this.getSize();
        return new Z.Point(-size['width'] / 2, -size['height'] / 2);
    },

    _onDOMRemove: function () {
        var dom = this._getDOM();
        this._removeDOMEvents(dom);
    },

    _domEvents : /**
                  * mousedown event
                  * @event maptalks.ui.UIMarker#mousedown
                  * @type {Object}
                  * @property {String} type                    - mousedown
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'mousedown ' +
                 /**
                  * mouseup event
                  * @event maptalks.ui.UIMarker#mouseup
                  * @type {Object}
                  * @property {String} type                    - mouseup
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'mouseup ' +
                 /**
                  * mouseover event
                  * @event maptalks.ui.UIMarker#mouseover
                  * @type {Object}
                  * @property {String} type                    - mouseover
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'mouseover ' +
                 /**
                  * mouseout event
                  * @event maptalks.ui.UIMarker#mouseout
                  * @type {Object}
                  * @property {String} type                    - mouseout
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'mouseout ' +
                 /**
                  * mousemove event
                  * @event maptalks.ui.UIMarker#mousemove
                  * @type {Object}
                  * @property {String} type                    - mousemove
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'mousemove ' +
                 /**
                  * click event
                  * @event maptalks.ui.UIMarker#click
                  * @type {Object}
                  * @property {String} type                    - click
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'click ' +
                 /**
                  * dblclick event
                  * @event maptalks.ui.UIMarker#dblclick
                  * @type {Object}
                  * @property {String} type                    - dblclick
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'dblclick ' +
                 /**
                  * contextmenu event
                  * @event maptalks.ui.UIMarker#contextmenu
                  * @type {Object}
                  * @property {String} type                    - contextmenu
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'contextmenu ' +
                 /**
                  * keypress event
                  * @event maptalks.ui.UIMarker#keypress
                  * @type {Object}
                  * @property {String} type                    - keypress
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'keypress ' +
                 /**
                  * touchstart event
                  * @event maptalks.ui.UIMarker#touchstart
                  * @type {Object}
                  * @property {String} type                    - touchstart
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'touchstart ' +
                 /**
                  * touchmove event
                  * @event maptalks.ui.UIMarker#touchmove
                  * @type {Object}
                  * @property {String} type                    - touchmove
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'touchmove ' +
                 /**
                  * touchend event
                  * @event maptalks.ui.UIMarker#touchend
                  * @type {Object}
                  * @property {String} type                    - touchend
                  * @property {String} target                  - the map fires event
                  * @property {maptalks.Coordinate} coordinate - coordinate of the event
                  * @property {maptalks.Point} containerPoint  - container point of the event
                  * @property {maptalks.Point} viewPoint       - view point of the event
                  * @property {Event} domEvent                 - dom event
                  */
                 'touchend',

    _registerDOMEvents: function (dom) {
        Z.DomUtil.on(dom, this._domEvents, this._onDomEvents, this);
    },

    _onDomEvents: function (e) {
        var event = this.getMap()._parseEvent(e, e.type);
        this.fire(e.type, event);
    },

    _removeDOMEvents: function (dom) {
        Z.DomUtil.off(dom, this._domEvents, this._onDomEvents, this);
    }

});

/**
 * Drag handler for maptalks.ui.UIMarker.
 * @class
 * @category handler
 * @protected
 * @extends {maptalks.Handler}
 */
Z.ui.UIMarker.Drag = Z.Handler.extend(/** @lends maptalks.ui.UIMarker.Drag.prototype */{

    START: Z.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],

    addHooks: function () {
        this.target.on(this.START.join(' '), this._startDrag, this);

    },

    removeHooks: function () {
        this.target.off(this.START.join(' '), this._startDrag, this);
    },

    _startDrag: function (param) {
        var domEvent = param['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }
        if (this.isDragging()) {
            return;
        }
        this.target.on('click', this._endDrag, this);
        this._lastPos = param['coordinate'];

        this._prepareDragHandler();
        this._dragHandler.onMouseDown(param['domEvent']);
        /**
         * drag start event
         * @event maptalks.ui.UIMarker#dragstart
         * @type {Object}
         * @property {String} type                    - dragstart
         * @property {String} target                  - the geometry fires event
         * @property {maptalks.Coordinate} coordinate - coordinate of the event
         * @property {maptalks.Point} containerPoint  - container point of the event
         * @property {maptalks.Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this.target.fire('dragstart', param);
    },

    _prepareDragHandler:function () {
        this._dragHandler = new Z.Handler.Drag(this.target._getDOM());
        this._dragHandler.on('mousedown', this._onMouseDown, this);
        this._dragHandler.on('dragging', this._dragging, this);
        this._dragHandler.on('mouseup', this._endDrag, this);
        this._dragHandler.enable();
    },

    _onMouseDown: function (param) {
        Z.DomUtil.stopPropagation(param['domEvent']);
    },

    _dragging: function (param) {
        var target = this.target,
            map = target.getMap(),
            eventParam = map._parseEvent(param['domEvent']),
            domEvent = eventParam['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }
        if (!this._isDragging) {
            this._isDragging = true;
            return;
        }
        var currentPos = eventParam['coordinate'];
        if (!this._lastPos) {
            this._lastPos = currentPos;
        }
        var dragOffset = currentPos.substract(this._lastPos);
        this._lastPos = currentPos;
        this.target.setCoordinates(this.target.getCoordinates().add(dragOffset));
        eventParam['dragOffset'] = dragOffset;

        /**
         * dragging event
         * @event maptalks.ui.UIMarker#dragging
         * @type {Object}
         * @property {String} type                    - dragging
         * @property {String} target                  - the geometry fires event
         * @property {maptalks.Coordinate} coordinate - coordinate of the event
         * @property {maptalks.Point} containerPoint  - container point of the event
         * @property {maptalks.Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        target.fire('dragging', eventParam);

    },

    _endDrag: function (param) {
        var target = this.target,
            map = target.getMap();
        if (this._dragHandler) {
            target.off('click', this._endDrag, this);
            this._dragHandler.disable();
            delete this._dragHandler;
        }
        delete this._lastPos;
        this._isDragging = false;
        if (!map) {
            return;
        }
        var eventParam = map._parseEvent(param['domEvent']);
        /**
         * dragend event
         * @event maptalks.ui.UIMarker#dragend
         * @type {Object}
         * @property {String} type                    - dragend
         * @property {String} target                  - the geometry fires event
         * @property {maptalks.Coordinate} coordinate - coordinate of the event
         * @property {maptalks.Point} containerPoint  - container point of the event
         * @property {maptalks.Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        target.fire('dragend', eventParam);

    },

    isDragging:function () {
        if (!this._isDragging) {
            return false;
        }
        return true;
    }
});

Z.ui.UIMarker.addInitHook('addHandler', 'draggable', Z.ui.UIMarker.Drag);

Z.ui.UIMarker.include(/** @lends maptalks.ui.UIMarker.prototype */{
    /**
     * Whether the uimarker is being dragged.
     * @reutrn {Boolean}
     */
    isDragging: function () {
        if (this['draggable']) {
            return this['draggable'].isDragging();
        }
        return false;
    }
});

/**
 * @classdesc
 * Class for info window, a popup on the map to display any useful infomation you wanted.
 * @class
 * @category ui
 * @extends maptalks.ui.UIComponent
 * @param {Object} options
 * @param {Boolean} [options.autoPan=true]  - set it to false if you don't want the map to do panning animation to fit the opened window.
 * @param {Number}  [options.width=300]     - default width
 * @param {Number}  [options.minHeight=120] - minimun height
 * @param {String|HTMLElement} [options.custom=false]  - set it to true if you want a customized infowindow, customized html codes or a HTMLElement is set to content.
 * @param {String}  [options.title=null]    - title of the infowindow.
 * @param {String}  options.content         - content of the infowindow.
 * @memberOf maptalks.ui
 * @name InfoWindow
 */
Z.ui.InfoWindow = Z.ui.UIComponent.extend(/** @lends maptalks.ui.InfoWindow.prototype */{

    /**
     * @property {Object} options
     * @property {Boolean} [options.autoPan=true]  - set it to false if you don't want the map to do panning animation to fit the opened window.
     * @property {Number}  [options.width=300]     - default width
     * @property {Number}  [options.minHeight=120] - minimun height
     * @property {String|HTMLElement} [options.custom=false]  - set it to true if you want a customized infowindow, customized html codes or a HTMLElement is set to content.
     * @property {String}  [options.title=null]    - title of the infowindow.
     * @property {String}  options.content         - content of the infowindow.
     */
    options: {
        'autoPan'   : true,
        'width'     : 300,
        'minHeight' : 120,
        'custom'    : false,
        'title'     : null,
        'content'   : null
    },

    /**
     * Set the content of the infowindow.
     * @param {String|HTMLElement} content - content of the infowindow.
     * return {maptalks.ui.InfoWindow} this
     */
    setContent:function (content) {
        this.options['content'] = content;
        if (this.isVisible()) {
            this.show(this._coordinate);
        }
        return this;
    },

    /**
     * Get content of  the infowindow.
     * @return {String|HTMLElement} - content of the infowindow
     */
    getContent:function () {
        return this.options['content'];
    },

    /**
     * Set the title of the infowindow.
     * @param {String|HTMLElement} title - title of the infowindow.
     * return {maptalks.ui.InfoWindow} this
     */
    setTitle:function (title) {
        this.options['title'] = title;
        if (this.isVisible()) {
            this.show(this._coordinate);
        }
        return this;
    },

    /**
     * Get title of  the infowindow.
     * @return {String|HTMLElement} - content of the infowindow
     */
    getTitle:function () {
        return this.options['title'];
    },

    buildOn: function () {
        var dom;
        if (this.options['custom']) {
            if (Z.Util.isString(this.options['content'])) {
                dom = Z.DomUtil.createEl('div');
                dom.innerHTML = this.options['content'];
                return dom;
            } else {
                return this.options['content'];
            }
        } else {
            dom = Z.DomUtil.createEl('div');
            dom.className = 'maptalks-msgBox';
            dom.style.width = this._getWindowWidth() + 'px';
            var content = '<em class="maptalks-ico"></em>';
            if (this.options['title']) {
                content += '<h2>' + this.options['title'] + '</h2>';
            }
            content += '<a href="javascript:void(0);" onclick="this.parentNode.style.display=\'none\';return false;" ' +
            ' class="maptalks-close"></a><div class="maptalks-msgContent">' + this.options['content'] + '</div>';
            dom.innerHTML = content;
            return dom;
        }
    },

    getOffset:function () {
        var size = this.getSize();
        var o = new Z.Point(-size['width'] / 2, -size['height'])._add(-4, -12);
        if (this.getOwner() instanceof Z.Marker) {
            var markerSize = this.getOwner().getSize();
            if (markerSize) {
                o._add(0,  -markerSize['height']);
            }
        }
        return o;
    },

    _getWindowWidth:function () {
        var defaultWidth = 300;
        var width = this.options['width'];
        if (!width) {
            width = defaultWidth;
        }
        return width;
    }
});

(function () {
    var defaultOptions = {
        'eventsToStop' : 'mousedown dblclick click',
        'autoPan': false,
        'width'  : 160,
        'custom' : false,
        'items'  : []
    };

    /**
     * @classdesc
     * Class for context menu, useful for interactions with right clicks on the map.
     *
     * Menu items is set to options.items or by setItems method.
     *
     * Normally items is a object array, containing:
     * 1. item object: {'item': 'This is a menu text', 'click': function() {alert('oops! You clicked!');)}}
     * 2. minus string "-", which will draw a splitor line on the menu.
     *
     * If options.custom is set to true, the menu is considered as a customized one. Then items is the customized html codes or HTMLElement.
     *
     * @class
     * @category ui
     * @extends maptalks.ui.UIComponent
     * @param {Object} options - construct options
     * @memberOf maptalks.ui
     * @name Menu
     */
    Z.ui.Menu = Z.ui.UIComponent.extend(/** @lends maptalks.ui.Menu.prototype */{

        /**
         * @property {Object} options
         * @property {Boolean} [options.autoPan=false]  - set it to false if you don't want the map to do panning animation to fit the opened menu.
         * @property {Number}  [options.width=160]      - default width
         * @property {String|HTMLElement} [options.custom=false]  - set it to true if you want a customized menu, customized html codes or a HTMLElement is set to items.
         * @property {Object[]|String|HTMLElement}  options.items   - html code or a html element is options.custom is true. Or a menu items array, containing: item objects, "-" as a splitor line
         */
        options: defaultOptions,

        /**
         * Set the items of the menu.
         * @param {Object[]|String|HTMLElement} items - items of the menu
         * return {maptalks.ui.Menu} this
         */
        setItems: function (items) {
            this.options['items'] = items;
            return this;
        },

        /**
         * Get items of  the menu.
         * @return {Object[]|String|HTMLElement} - items of the menu
         */
        getItems:function () {
            return this.options['items'];
        },

        buildOn:function () {
            if (this.options['custom']) {
                if (Z.Util.isString(this.options['items'])) {
                    var container = Z.DomUtil.createEl('div');
                    container.innerHTML = this.options['items'];
                    return container;
                } else {
                    return this.options['items'];
                }
            } else {
                var dom = Z.DomUtil.createEl('div');
                Z.DomUtil.addClass(dom, 'maptalks-menu');
                dom.style.width = this._getMenuWidth() + 'px';
                var arrow = Z.DomUtil.createEl('em');
                Z.DomUtil.addClass(arrow, 'maptalks-ico');
                var menuItems = this._createMenuItemDom();
                dom.appendChild(arrow);
                dom.appendChild(menuItems);
                return dom;
            }
        },

        /**
         * Offset of the menu DOM to fit the click position.
         * @return {maptalks.Point} offset
         * @private
         */
        getOffset:function () {
            return new Z.Point(-17, 10);
        },

        getEvents: function () {
            return {
                '_zoomstart _zoomend _movestart _dblclick _click' : this.hide
            };
        },

        _createMenuItemDom: function () {
            var me = this;
            var ul = Z.DomUtil.createEl('ul');
            Z.DomUtil.addClass(ul, 'maptalks-menu-items');
            var items = this.getItems();
            function onMenuClick(index) {
                return function () {
                    var result = this._callback({'target':me, 'owner':me._owner, 'index':index});
                    if (result === false) {
                        return;
                    }
                    me.hide();
                };
            }
            var item, itemDOM;
            for (var i = 0, len = items.length; i < len; i++) {
                item = items[i];
                if (item === '-' || item === '_') {
                    itemDOM = Z.DomUtil.createEl('li');
                    Z.DomUtil.addClass(itemDOM, 'maptalks-menu-splitter');
                } else {
                    itemDOM = Z.DomUtil.createEl('li');
                    itemDOM.innerHTML = item['item'];
                    itemDOM._callback = item['click'];
                    Z.DomUtil.on(itemDOM, 'click', (onMenuClick)(i));
                }
                ul.appendChild(itemDOM);
            }
            return ul;
        },

        _getMenuWidth:function () {
            var defaultWidth = 160;
            var width = this.options['width'];
            if (!width) {
                width = defaultWidth;
            }
            return width;
        }
    });

    /**
     * Mixin of the context menu methods.
     * @mixin
     * @memberOf maptalks.ui
     * @name Menu.Mixin
     */
    Z.ui.Menu.Mixin = {
        /**
        * Set a context menu
        * @param {Object} options - menu options
        * @return {*} this
        */
        setMenu: function (options) {
            this._menuOptions = options;

            if (this._menu) {
                Z.Util.setOptions(this._menu, Z.Util.extend(defaultOptions, options));
            } else {
                this.on('contextmenu', this._defaultOpenMenu, this);
            }
            return this;
        },

        /**
        * Open the context menu
        * @param {maptalks.Coordinate} [coordinate=null] - coordinate to open the context menu
        * @return {*} this
        */
        openMenu: function (coordinate) {
            var map = (this instanceof Z.Map) ? this : this.getMap();
            if (!coordinate) {
                coordinate = this.getCenter();
            }
            if (!this._menu) {
                if (this._menuOptions && map) {
                    this._bindMenu(this._menuOptions);
                    this._menu.show(coordinate);
                }
            } else {
                this._menu.show(coordinate);
            }
            return this;
        },

        /**
        * Set menu items to the context menu
        * @param {Object[]} items - menu items
        * @return {*} this
        */
        setMenuItems: function (items) {
            if (this._menuOptions) {
                if (Z.Util.isArray(items)) {
                    this._menuOptions['custom'] = false;
                }
                this._menuOptions['items'] = items;
            }
            if (this._menu) {
                if (Z.Util.isArray(items)) {
                    this._menu.config('custom', false);
                }
                this._menu.setItems(items);
            }
            return this;
        },

        /**
         * Get the context menu items
         * @return {Object[]}
         */
        getMenuItems:function () {
            if (this._menu) {
                return this._menu.getItems();
            } else {
                return null;
            }
        },

        /**
        * Close the contexnt menu
        * @return {*} this
        */
        closeMenu: function () {
            if (this._menu) {
                this._menu.hide();
            }
            return this;
        },

        /**
         * Remove the context menu
         * @return {*} this
         */
        removeMenu:function () {
            this.off('contextmenu', this._defaultOpenMenu, this);
            this._unbindMenu();
            delete this._menuOptions;
            return this;
        },

        _bindMenu: function (options) {
            this._menu = new Z.ui.Menu(options);
            this._menu.addTo(this);

            return this;
        },

        _unbindMenu:function () {
            if (this._menu) {
                this.closeMenu();
                this._menu.remove();
                delete this._menu;
            }
            return this;
        },

         /**
         * 应用没有注册contextmenu事件时, 默认在contextmenu事件时打开右键菜单
         * 如果注册过contextmenu事件, 则不做任何操作
         * @param  {*} param [description]
         * @return {*}       [description]
         * @default
         */
        _defaultOpenMenu:function (param) {
            if (this.listens('contextmenu') > 1) {
                return;
            } else {
                this.openMenu(param['coordinate']);
            }
        }
    };
})();

Z.Map.include(Z.ui.Menu.Mixin);

Z.Geometry.include(Z.ui.Menu.Mixin);

Z.Geometry.include(/** @lends maptalks.Geometry.prototype */{
    /**
     * Set info window settings to the geometry
     * @param {Object} options - construct [options]{@link maptalks.ui.InfoWindow#options} for the info window
     * @return {maptalks.Geometry} this
     */
    setInfoWindow:function (options) {
        this._infoWinOptions = Z.Util.extend({}, options);
        if (this._infoWindow) {
            Z.Util.setOptions(this._infoWindow, options);
        } else if (this.getMap()) {
            this._bindInfoWindow(this._infoWinOptions);
        }

        return this;
    },

    /**
     * Get info window's instance of infowindow if it has been already created.
     * @return {maptalks.ui.InfoWindow}
     */
    getInfoWindow:function () {
        if (!this._infoWindow) {
            return null;
        }
        return this._infoWindow;
    },

    /**
     * Open the info window.
     * @param  {maptalks.Coordinate} [coordinate=null] - coordinate to open the info window
     * @return {maptalks.Geometry} this
     */
    openInfoWindow:function (coordinate) {
        if (!this.getMap()) {
            return this;
        }
        if (!coordinate) {
            coordinate = this.getCenter();
        }
        if (!this._infoWindow) {
            if (this._infoWinOptions && this.getMap()) {
                this._bindInfoWindow(this._infoWinOptions);
                this._infoWindow.show(coordinate);
            }
        } else {
            this._infoWindow.show(coordinate);
        }
        return this;
    },

    /**
     * close the info window
     * @return {maptalks.Geometry} this
     */
    closeInfoWindow:function () {
        if (this._infoWindow) {
            this._infoWindow.hide();
        }
        return this;
    },

    /**
     * remove the info window
     * @return {maptalks.Geometry} this
     */
    removeInfoWindow:function () {
        this._unbindInfoWindow();
        delete this._infoWinOptions;
        delete this._infoWindow;
        return this;
    },

    _bindInfoWindow: function (options) {
        this._infoWindow = new Z.ui.InfoWindow(options);
        this._infoWindow.addTo(this);

        return this;
    },

    _unbindInfoWindow:function () {
        if (this._infoWindow) {
            this.closeInfoWindow();
            this._infoWindow.remove();
            delete this._infoWindow;
        }
        return this;
    }

});

/**
 * @namespace
 */
Z.control = {};

/**
 * Base class for all the map controls, you can extend it to build your own customized Control.
 * @class
 * @category control
 * @abstract
 * @extends maptalks.Class
 *
 * @mixes maptalks.Eventable
 *
 * @example
 * control.addTo(map);
 * //or you can also
 * map.addControl(control);
 */
Z.Control = Z.Class.extend(/** @lends maptalks.Control.prototype */{
    includes: [Z.Eventable],

    statics: /** @lends maptalks.Control */{
        /**
         * Predefined position constant: {'top': '20','left': '20'}
         * @constant
         * @type {Object}
         */
        'top_left' : {'top': '20', 'left': '20'},
        /**
         * Predefined position constant: {'top': '40','right': '60'}
         * @constant
         * @type {Object}
         */
        'top_right' : {'top': '40', 'right': '60'},
        /**
         * Predefined position constant: {'bottom': '20','left': '60'}
         * @constant
         * @type {Object}
         */
        'bottom_left' : {'bottom': '20', 'left': '60'},
        /**
         * Predefined position constant: {'bottom': '20','right': '60'}
         * @constant
         * @type {Object}
         */
        'bottom_right' : {'bottom': '20', 'right': '60'}
    },

    options:{

    },

    initialize: function (options) {
        if (options && options['position']) {
            var p = Z.Util.extend({}, options['position']);
            options['position'] = p;
        }
        Z.Util.setOptions(this, options);
    },

    /**
     * Adds the control to a map.
     * @param {maptalks.Map} map
     * @returns {maptalks.Control} this
     * @fires maptalks.Control#add
     */
    addTo: function (map) {
        this.remove();
        this._map = map;
        var controlContainer = map._panels.control;
        this.__ctrlContainer = Z.DomUtil.createEl('div');
        Z.DomUtil.setStyle(this.__ctrlContainer, 'position:absolute');
        Z.DomUtil.addStyle(this.__ctrlContainer, 'z-index', controlContainer.style.zIndex);
        // Z.DomUtil.on(this.__ctrlContainer, 'mousedown mousemove click dblclick contextmenu', Z.DomUtil.stopPropagation)
        var controlDom = this.buildOn(map);
        if (controlDom) {
            this._updatePosition();
            this.__ctrlContainer.appendChild(controlDom);
            controlContainer.appendChild(this.__ctrlContainer);
        }
        /**
         * add event.
         *
         * @event maptalks.Control#add
         * @type {Object}
         * @property {String} type - add
         * @property {maptalks.Control} target - the control instance
         */
        this.fire('add', {'dom' : controlContainer});
        return this;
    },

    /**
     * Get the map that the control is added to.
     * @return {maptalks.Map}
     */
    getMap:function () {
        return this._map;
    },

    /**
     * Get the position of the control
     * @return {Object}
     */
    getPosition: function () {
        return Z.Util.extend({}, this.options['position']);
    },

    /**
     * update the control's position
     * @param {Object} position - e.g.{'top': '40','left': '60'}
     * @return {maptalks.Control} this
     * @fires maptalks.Control#positionupdate
     */
    setPosition: function (position) {
        this.options['position'] = Z.Util.extend({}, position);
        this._updatePosition();
        return this;
    },

    /**
     * Get container point of the control.
     * @return {maptalks.Point}
     */
    getContainerPoint:function () {
        var position = this.options['position'];

        var size = this._map.getSize();
        var x, y;
        if (!Z.Util.isNil(position['top'])) {
            x = position['top'];
        } else if (!Z.Util.isNil(position['bottom'])) {
            x = size['height'] - position['bottom'];
        }
        if (!Z.Util.isNil(position['left'])) {
            y = position['left'];
        } else if (!Z.Util.isNil(position['right'])) {
            y = size['width'] - position['right'];
        }
        return new Z.Point(x, y);
    },

    /**
     * Get the container HTML dom element of the control.
     * @return {HTMLElement}
     */
    getContainer: function () {
        return this.__ctrlContainer;
    },

    /**
     * Show
     * @return {maptalks.Control} this
     */
    show: function () {
        this.__ctrlContainer.style.display = '';
        return this;
    },

    /**
     * Hide
     * @return {maptalks.Control} this
     */
    hide: function () {
        this.__ctrlContainer.style.display = 'none';
        return this;
    },

    /**
     * Whether the control is visible
     * @return {Boolean}
     */
    isVisible:function () {
        return (this.__ctrlContainer && this.__ctrlContainer.style.display === '');
    },

    /**
     * Remove itself from the map
     * @return {maptalks.Control} this
     * @fires maptalks.Control#remove
     */
    remove: function () {
        if (!this._map) {
            return this;
        }
        Z.DomUtil.removeDomNode(this.__ctrlContainer);
        if (this._onRemove) {
            this._onRemove(this._map);
        }
        delete this._map;
        delete this.__ctrlContainer;
        /**
         * remove event.
         *
         * @event maptalks.Control#remove
         * @type {Object}
         * @property {String} type - remove
         * @property {maptalks.Control} target - the control instance
         */
        this.fire('remove');
        return this;
    },

    _updatePosition: function () {
        var position = this.options['position'];
        for (var p in position) {
            if (position.hasOwnProperty(p)) {
                position[p] = parseInt(position[p]);
                this.__ctrlContainer.style[p] = position[p] + 'px';
            }
        }
        /**
         * Control's position update event.
         *
         * @event maptalks.Control#positionupdate
         * @type {Object}
         * @property {String} type - positionupdate
         * @property {maptalks.Control} target - the control instance
         * @property {Object} position - Position of the control, eg:{"top" : 100, "left" : 50}
         */
        this.fire('positionupdate', {
            'position' : Z.Util.extend({}, this.options['position'])
        });
    }

});


Z.Map.include(/** @lends maptalks.Map.prototype */{
    /**
     * Add a control on the map.
     * @param {maptalks.Control} control - contorl to add
     * @return {maptalks.Map} this
     */
    addControl: function (control) {
        //map container is a canvas, can't add control on it.
        if (this._containerDOM.getContext) {
            return this;
        }
        control.addTo(this);
        return this;
    },

    /**
     * Remove a control from the map.
     * @param {maptalks.Control} control - control to remove
     * @return {maptalks.Map} this
     */
    removeControl: function (control) {
        control.remove();
        return this;
    }

});

/**
 * @classdesc
 * A zoom control with buttons to zoomin/zoomout and a slider indicator for the zoom level.
 * @class
 * @category control
 * @extends maptalks.Control
 * @memberOf maptalks.control
 * @name Zoom
 * @param {Object}   options - construct options
 * @param {Object}   [options.position=maptalks.Control.top_left]  - position of the zoom control.
 * @param {Boolean}  [options.slider=true]                         - Whether to display the slider
 * @param {Boolean}  [options.zoomLevel=true]                      - Whether to display the text box of zoom level
 */
Z.control.Zoom = Z.Control.extend(/** @lends maptalks.control.Zoom.prototype */{

    /**
     * @property {Object}   options - options
     * @property {Object}   [options.position=maptalks.Control.top_left]  - position of the zoom control.
     * @property {Boolean}  [options.slider=true]                         - Whether to display the slider
     * @property {Boolean}  [options.zoomLevel=true]                      - Whether to display the text box of zoom level
     */
    options:{
        'position'  : Z.Control['top_left'],
        'slider'    : true,
        'zoomLevel' : true
    },

    buildOn: function (map) {
        this._map = map;
        var options = this.options;

        var dom = Z.DomUtil.createEl('div', 'maptalks-zoom');

        if (options['zoomLevel']) {
            var levelDOM = Z.DomUtil.createEl('span', 'maptalks-zoom-zoomlevel');
            dom.appendChild(levelDOM);
            this._levelDOM = levelDOM;
        }

        var zoomDOM = Z.DomUtil.createEl('div', 'maptalks-zoom-slider');

        var zoomInButton = Z.DomUtil.createEl('a', 'maptalks-zoom-zoomin');
        zoomInButton.href = 'javascript:;';
        zoomInButton.innerHTML = '+';
        zoomDOM.appendChild(zoomInButton);
        this._zoomInButton = zoomInButton;

        if (options['slider']) {
            var sliderDOM = Z.DomUtil.createEl('div', 'maptalks-zoom-slider-box');
            var ruler = Z.DomUtil.createEl('div', 'maptalks-zoom-slider-ruler');
            var reading = Z.DomUtil.createEl('span', 'maptalks-zoom-slider-reading');
            var dot = Z.DomUtil.createEl('span', 'maptalks-zoom-slider-dot');
            ruler.appendChild(reading);
            ruler.appendChild(dot);
            sliderDOM.appendChild(ruler);
            zoomDOM.appendChild(sliderDOM);
            this._sliderBox = sliderDOM;
            this._sliderRuler = ruler;
            this._sliderReading = reading;
            this._sliderDot = dot;
        }

        var zoomOutButton = Z.DomUtil.createEl('a', 'maptalks-zoom-zoomout');
        zoomOutButton.href = 'javascript:;';
        zoomOutButton.innerHTML = '-';
        zoomDOM.appendChild(zoomOutButton);
        this._zoomOutButton = zoomOutButton;

        dom.appendChild(zoomDOM);

        map.on('_zoomend _zoomstart _viewchange', this._update, this);

        this._update();
        this._registerDomEvents();

        return dom;
    },

    _update:function () {
        var map = this._map;
        if (this._sliderBox) {
            var pxUnit = 10;
            var totalRange = (map.getMaxZoom() - map.getMinZoom()) * pxUnit;
            this._sliderBox.style.height = totalRange + 6 + 'px';
            this._sliderRuler.style.height = totalRange + 'px';
            var zoomRange = (map.getZoom() - map.getMinZoom()) * pxUnit;
            this._sliderReading.style.height = zoomRange + 'px';
            this._sliderDot.style.bottom = zoomRange + 'px';
        }
        if (this._levelDOM) {
            this._levelDOM.innerHTML = map.getZoom();
        }

    },

    _registerDomEvents:function () {
        var map = this._map;
        if (this._zoomInButton) {
            Z.DomUtil.on(this._zoomInButton, 'click', map.zoomIn, map);
        }
        if (this._zoomOutButton) {
            Z.DomUtil.on(this._zoomOutButton, 'click', map.zoomOut, map);
        }
        //TODO slider dot拖放缩放逻辑还没有实现
    },

    _onRemove: function () {
        var map = this.getMap();
        map.off('_zoomend _zoomstart', this._onZoomEnd, this);
    }
});

Z.Map.mergeOptions({

    'zoomControl': false
});

Z.Map.addOnLoadHook(function () {
    if (this.options['zoomControl']) {
        this.zoomControl = new Z.control.Zoom(this.options['zoomControl']);
        this.addControl(this.zoomControl);
    }
});

/**
 * @classdesc
 * A control to allows to display attribution data in a small text box on the map.
 * @class
 * @category control
 * @extends maptalks.Control
 * @memberOf maptalks.control
 * @name Attribution
 * @param {Object} options - construct options
 * @param {String} options.content - content of the attribution control, HTML format
 */
Z.control.Attribution = Z.Control.extend(/** @lends maptalks.control.Attribution.prototype */{

    /**
     * @param {Object} options - options
     * @param {Object} [options.position={"bottom":0,"right":0}] - position of the control
     * @param {String} options.content  - content of the attribution control, HTML format
     */
    options:{
        'position' : {
            'bottom': '0',
            'right': '0'
        },
        'content' : '<a href="http://www.maptalks.org" target="_blank">Powered By MapTalks</a>'
    },

    buildOn: function () {
        this._attributionContainer = Z.DomUtil.createEl('div', 'maptalks-attribution');
        this._update();
        return this._attributionContainer;
    },

    /**
     * Set content of the attribution
     * @param {String} content - attribution content
     * @return {maptalks.control.Attribution} this
     */
    setContent: function (content) {
        this.options['content'] = content;
        this._update();
        return this;
    },

    _update: function () {
        if (!this._map) { return; }
        this._attributionContainer.innerHTML = this.options['content'];
    }
});

Z.Map.mergeOptions({

    'attributionControl' : false
});

Z.Map.addOnLoadHook(function () {
    if (this.options['attributionControl']) {
        this.attributionControl = new Z.control.Attribution(this.options['attributionControl']);
        this.addControl(this.attributionControl);
    }
});

/**
 * @classdesc
 * A control for map navigation.
 * @class
 * @category control
 * @extends maptalks.Control
 * @memberOf maptalks.control
 * @name Nav
 */
Z.control.Nav = Z.Control.extend(/** @lends maptalks.control.Nav.prototype */{

    options:{
        'position' : Z.Control['top_left']
    },

    buildOn: function () {
        return null;
    }

});

Z.Map.mergeOptions({

    'navControl' : false
});

Z.Map.addOnLoadHook(function () {
    if (this.options['navControl']) {
        this.navControl = new Z.control.Nav(this.options['navControl']);
        this.addControl(this.navControl);
    }
});

/**
 * @classdesc
 * Based on the implementation in Leaflet, a simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems.
 * @class
 * @category control
 * @extends maptalks.Control
 * @memberOf maptalks.control
 * @name Scale
 * @param {Object} [options=null] - construct options
 * @param {Object} [options.position=maptalks.Control.bottom_left]  - position of the scale control.
 * @param {Number} [options.maxWidth=100]               - max width of the scale control.
 * @param {Boolean} [options.metric=true]               - Whether to show the metric scale line (m/km).
 * @param {Boolean} [options.imperial=false]            - Whether to show the imperial scale line (mi/ft).
 */
Z.control.Scale = Z.Control.extend(/** @lends maptalks.control.Scale.prototype */{

    /**
     * @property {Object} [options=null] - options
     * @property {Object} [options.position=maptalks.Control.bottom_left]  - position of the scale control.
     * @property {Number} [options.maxWidth=100]               - max width of the scale control.
     * @property {Boolean} [options.metric=true]               - Whether to show the metric scale line (m/km).
     * @property {Boolean} [options.imperial=false]            - Whether to show the imperial scale line (mi/ft).
     */
    options:{
        'position' : Z.Control['bottom_left'],
        'maxWidth': 100,
        'metric': true,
        'imperial': false
    },

    buildOn: function (map) {
        this._map = map;
        this._scaleContainer = Z.DomUtil.createEl('div');
        this._addScales();
        map.on('zoomend', this._update, this);
        if (this._map._loaded) {
            this._update();
        }
        return this._scaleContainer;
    },

    _onRemove: function () {
        var map = this.getMap();
        map.off('zoomend', this._update, this);
    },

    _addScales: function () {
        var css = 'border: 2px solid #000000;border-top: none;line-height: 1.1;padding: 2px 5px 1px;' +
                          'color: #000000;font-size: 11px;text-align:center;white-space: nowrap;overflow: hidden' +
                          ';-moz-box-sizing: content-box;box-sizing: content-box;background: #fff; background: rgba(255, 255, 255, 0);';
        if (this.options['metric']) {
            this._mScale = Z.DomUtil.createElOn('div', css, this._scaleContainer);
        }
        if (this.options['imperial']) {
            this._iScale = Z.DomUtil.createElOn('div', css, this._scaleContainer);
        }
    },

    _update: function () {
        var map = this._map;
        var maxMeters = map.pixelToDistance(this.options['maxWidth'], 0);
        this._updateScales(maxMeters);
    },

    _updateScales: function (maxMeters) {
        if (this.options['metric'] && maxMeters) {
            this._updateMetric(maxMeters);
        }
        if (this.options['imperial'] && maxMeters) {
            this._updateImperial(maxMeters);
        }
    },

    _updateMetric: function (maxMeters) {
        var meters = this._getRoundNum(maxMeters),
            label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';

        this._updateScale(this._mScale, label, meters / maxMeters);
    },

    _updateImperial: function (maxMeters) {
        var maxFeet = maxMeters * 3.2808399,
            maxMiles, miles, feet;

        if (maxFeet > 5280) {
            maxMiles = maxFeet / 5280;
            miles = this._getRoundNum(maxMiles);
            this._updateScale(this._iScale, miles + ' mile', miles / maxMiles);

        } else {
            feet = this._getRoundNum(maxFeet);
            this._updateScale(this._iScale, feet + ' feet', feet / maxFeet);
        }
    },

    _updateScale: function (scale, text, ratio) {
        scale['style']['width'] = Math.round(this.options['maxWidth'] * ratio) + 'px';
        scale['innerHTML'] = text;
    },

    _getRoundNum: function (num) {
        var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
            d = num / pow10;

        d = d >= 10 ? 10 :
            d >= 5 ? 5 :
            d >= 3 ? 3 :
            d >= 2 ? 2 : 1;

        return pow10 * d;
    }
});

Z.Map.mergeOptions({
    'scaleControl' : false
});

Z.Map.addOnLoadHook(function () {
    if (this.options['scaleControl']) {
        this.scaleControl = new Z.control.Scale(this.options['scaleControl']);
        this.addControl(this.scaleControl);
    }
});

/**
 * @classdesc
 * Class for panel controls.
 * @class
 * @category control
 * @extends maptalks.Control
 * @memberOf maptalks.control
 * @name Panel
 * @param {Object} options - construct options
 * @param {Boolean} [options.draggable=true]            - whether the panel can be dragged
 * @param {Boolean} [options.custom=false]              - whether the panel's content is customized .
 * @param {String|HTMLElement} options.content          - panel's content, can be a dom element or a string.
 * @param {Boolean} [options.closeButton=true]          - whether to display the close button on the panel.
 */
Z.control.Panel = Z.Control.extend(/** @lends maptalks.control.Panel.prototype */{

    /**
     * @property {Object} options - options
     * @property {Boolean} [options.draggable=true]            - whether the panel can be dragged
     * @property {Boolean} [options.custom=false]              - whether the panel's content is customized .
     * @property {String|HTMLElement} options.content          - panel's content, can be a dom element or a string.
     * @property {Boolean} [options.closeButton=true]          - whether to display the close button on the panel.
     */
    options:{
        'position' : {
            'top'       : '0',
            'right'     : '0'
        },
        'draggable'     : true,
        'custom'        : false,
        'content'       : '',
        'closeButton'   : true
    },

    buildOn: function () {
        var dom;
        if (this.options['custom']) {
            if (Z.Util.isString(this.options['content'])) {
                dom = Z.DomUtil.createEl('div');
                dom.innerHTML = this.options['content'];
            } else {
                dom = this.options['content'];
            }
        } else {
            dom = Z.DomUtil.createEl('div', 'maptalks-panel');
            if (this.options['closeButton']) {
                var closeButton = Z.DomUtil.createEl('a', 'maptalks-close');
                closeButton.href = 'javascript:;';
                closeButton.onclick = function () {
                    dom.style.display = 'none';
                };
                dom.appendChild(closeButton);
            }

            var panelContent = Z.DomUtil.createEl('div', 'maptalks-panel-content');
            panelContent.innerHTML = this.options['content'];
            dom.appendChild(panelContent);
        }

        this.draggable = new Z.Handler.Drag(dom);

        this.draggable.on('mousedown', this._onMouseDown, this)
            .on('dragstart', this._onDragStart, this)
            .on('dragging', this._onDragging, this)
            .on('dragend', this._onDragEnd, this);

        if (this.options['draggable']) {
            this.draggable.enable();
        }

        return dom;
    },

    _onMouseDown: function (param) {
        Z.DomUtil.stopPropagation(param['domEvent']);
    },

    _onDragStart:function (param) {
        this._startPos = param['mousePos'];
        this._startPosition = Z.Util.extend({}, this.options['position']);
    },

    _onDragging:function (param) {
        var pos = param['mousePos'];
        var offset = pos.substract(this._startPos);

        var startPosition = this._startPosition;
        var position = this.options['position'];
        if (!Z.Util.isNil(position['top'])) {
            position['top'] = startPosition['top'] + offset.y;
        }
        if (!Z.Util.isNil(position['bottom'])) {
            position['bottom'] = startPosition['bottom'] - offset.y;
        }
        if (!Z.Util.isNil(position['left'])) {
            position['left'] = startPosition['left'] + offset.x;
        }
        if (!Z.Util.isNil(position['right'])) {
            position['right'] = startPosition['right'] - offset.x;
        }

        this._updatePosition();
    },

    _onDragEnd:function () {
        delete this._startPos;
        delete this._startPosition;
    },

    /**
     * 获取panel端点数组
     */
    _getConnectPoints: function () {
        var map = this._map;
        var containerPoint = this.getContainerPoint();
        var controlContainer = this.getContainer(),
            width = controlContainer.clientWidth,
            height = controlContainer.clientHeight;

        var anchors = [
            //top center
            map.containerPointToCoordinate(
                containerPoint.add(new Z.Point(Math.round(width / 2), 0))
            ),
            //middle right
            map.containerPointToCoordinate(
                containerPoint.add(new Z.Point(width, Math.round(height / 2)))
            ),
            //bottom center
            map.containerPointToCoordinate(
                containerPoint.add(new Z.Point(Math.round(width / 2), height))
            ),
            //middle left
            map.containerPointToCoordinate(
                containerPoint.add(new Z.Point(0, Math.round(height / 2)))
            )

        ];
        return anchors;
    }

});

/**
 * @classdesc
 * A toolbar control of the map.
 * @class
 * @category control
 * @extends maptalks.Control
 * @memberOf maptalks.control
 * @name Toolbar
 * @param {Object}   options - construct options
 * @param {Object}   [options.position=maptalks.Control.top_right]  - position of the toolbar control.
 * @param {Boolean}  [options.vertical=true]                        - Whether the toolbar is a vertical one.
 * @param {Object[]} options.items                                  - items on the toolbar
 */
Z.control.Toolbar = Z.Control.extend(/** @lends maptalks.control.Toolbar.prototype */{

    /**
     * @property {Object}   options - options
     * @property {Object}   [options.position=maptalks.Control.top_right]  - position of the toolbar control.
     * @property {Boolean}  [options.vertical=true]                        - Whether the toolbar is a vertical one.
     * @property {Object[]} options.items                                  - items on the toolbar
     */
    options:{
        'vertical' : false,
        'position' : Z.Control['top_right'],
        'items'     : {
            //default buttons
        }
    },

    buildOn: function (map) {
        this._map = map;
        var dom = Z.DomUtil.createEl('div');
        var ul = Z.DomUtil.createEl('ul', 'maptalks-toolbar-hx');
        dom.appendChild(ul);

        if (this.options['vertical']) {
            Z.DomUtil.addClass(dom, 'maptalks-toolbar-vertical');
        } else {
            Z.DomUtil.addClass(dom, 'maptalks-toolbar-horizonal');
        }
        var me = this;
        function onButtonClick(fn, index, childIndex, targetDom) {
            var item = me._getItems()[index];
            return function (e) {
                Z.DomUtil.stopPropagation(e);
                return fn({'target':item, 'index':index, 'childIndex': childIndex, 'dom': targetDom});
            };
        }

        var items = this.options['items'];
        if (Z.Util.isArrayHasData(items)) {
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                var li = Z.DomUtil.createEl('li');
                li.innerHTML = item['item'];
                li.style.cursor = 'pointer';
                if (item['click']) {
                    Z.DomUtil.on(li, 'click', (onButtonClick)(item['click'], i, null, li));
                }
                if (Z.Util.isArrayHasData(item['children'])) {
                    var dropMenu = this._createDropMenu(i);
                    li.appendChild(dropMenu);
                    li._menu = dropMenu;
                    Z.DomUtil.on(li, 'mouseover', function () {
                        this._menu.style.display = '';
                    });
                    Z.DomUtil.on(li, 'mouseout', function () {
                        this._menu.style.display = 'none';
                    });
                }
                ul.appendChild(li);
            }
        }
        return dom;
    },

    _createDropMenu:function (index) {
        var me = this;
        function onButtonClick(fn, index, childIndex) {
            var item = me._getItems()[index]['children'][childIndex];
            return function (e) {
                Z.DomUtil.stopPropagation(e);
                return fn({'target':item, 'index':index, 'childIndex': childIndex});
            };
        }
        var menuDom = Z.DomUtil.createEl('div', 'maptalks-dropMenu');
        menuDom.style.display = 'none';
        menuDom.appendChild(Z.DomUtil.createEl('em', 'maptalks-ico'));
        var menuUL = Z.DomUtil.createEl('ul');
        menuDom.appendChild(menuUL);
        var children = this._getItems()[index]['children'];
        var liWidth = 0, i, len;
        for (i = 0, len = children.length; i < len; i++) {
            var size = Z.StringUtil.stringLength(children[i]['item'], '12px');
            if (size.width > liWidth) {
                liWidth = size.width;
            }
        }
        for (i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            var li = Z.DomUtil.createEl('li');
            li.innerHTML = '<a href="javascript:;">' + child['item'] + '</a>';
            li.style.cursor = 'pointer';
            li.style.width = (liWidth + 30) + 'px';// 30 for li padding
            Z.DomUtil.on(li.childNodes[0], 'click', (onButtonClick)(child['click'], index, i));
            menuUL.appendChild(li);
        }
        return menuDom;
    },

    _getItems:function () {
        return this.options['items'];
    }
});

/**
 * Utilities for geo
 * @class
 * @protected
 */
Z.GeoUtils = {
    /**
     * caculate the distance from a point to a segment.
     * @param {maptalks.Point} p
     * @param {maptalks.Point} p1
     * @param {maptalks.Point} p2
     */
    distanceToSegment: function (p, p1, p2) {
        var x = p.x,
            y = p.y,
            x1 = p1.x,
            y1 = p1.y,
            x2 = p2.x,
            y2 = p2.y;

        var cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);
        if (cross <= 0) {
            // P->P1
            return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
        }
        var d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (cross >= d2) {
            // P->P2
            return Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
        }
        var r = cross / d2;
        var px = x1 + (x2 - x1) * r;
        var py = y1 + (y2 - y1) * r;
        // P->P(px,py)
        return Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
    },

    /**
     * 判断点坐标是否在面中
     * @param {maptalks.Polygon} 面对象
     * @param {maptalks.Coordinate} 点对象
     * @return {Boolean} true：点在面中
     */
    pointInsidePolygon: function (p, points) {
        var i, j, p1, p2,
            len = points.length;
        var c = false;

        for (i = 0, j = len - 1; i < len; j = i++) {
            p1 = points[i];
            p2 = points[j];
            if (((p1.y > p.y) !== (p2.y > p.y)) &&
                (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
                c = !c;
            }
        }

        return c;
    },

    computeLength:function (coordinates, measurer) {
        var result = 0;
        for (var i = 0, len = coordinates.length; i < len - 1; i++) {
            result += measurer.measureLength(coordinates[i], coordinates[i + 1]);
        }
        return result;
    },

    computeArea:function (coordinates, measurer) {
        return measurer.measureArea(coordinates);
    }
};

/**
 * A high-performance JavaScript polyline simplification library by Vladimir Agafonkin
 * @class
 * @protected
 * @author mourner
 * @link https://github.com/mourner/simplify-js
 */
Z.Simplify = {
	// square distance between 2 points
    getSqDist:function (p1, p2) {

        var dx = p1.x - p2.x,
            dy = p1.y - p2.y;

        return dx * dx + dy * dy;
    },

    // square distance from a point to a segment
    getSqSegDist:function (p, p1, p2) {

        var x = p1.x,
            y = p1.y,
            dx = p2.x - x,
            dy = p2.y - y;

        if (dx !== 0 || dy !== 0) {

            var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

            if (t > 1) {
                x = p2.x;
                y = p2.y;

            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }
        dx = p.x - x;
        dy = p.y - y;

        return dx * dx + dy * dy;
    },
    // rest of the code doesn't care about point format

    // basic distance-based simplification
    simplifyRadialDist:function (points, sqTolerance) {

        var prevPoint = points[0],
            newPoints = [prevPoint],
            point;

        for (var i = 1, len = points.length; i < len; i++) {
            point = points[i];

            if (this.getSqDist(point, prevPoint) > sqTolerance) {
                newPoints.push(point);
                prevPoint = point;
            }
        }

        if (prevPoint !== point) newPoints.push(point);

        return newPoints;
    },

    simplifyDPStep:function (points, first, last, sqTolerance, simplified) {
        var maxSqDist = sqTolerance,
            index;

        for (var i = first + 1; i < last; i++) {
            var sqDist = this.getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            if (index - first > 1) this.simplifyDPStep(points, first, index, sqTolerance, simplified);
            simplified.push(points[index]);
            if (last - index > 1) this.simplifyDPStep(points, index, last, sqTolerance, simplified);
        }
    },

    // simplification using Ramer-Douglas-Peucker algorithm
    simplifyDouglasPeucker:function (points, sqTolerance) {
        var last = points.length - 1;

        var simplified = [points[0]];
        this.simplifyDPStep(points, 0, last, sqTolerance, simplified);
        simplified.push(points[last]);

        return simplified;
    },

    // both algorithms combined for awesome performance
    simplify:function (points, tolerance, highestQuality) {

        if (points.length <= 2) return points;

        var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

        points = highestQuality ? points : this.simplifyRadialDist(points, sqTolerance);
        points = this.simplifyDouglasPeucker(points, sqTolerance);

        return points;
    }
};


function exportMaptalks() {
    var old = window['maptalks'];

    Z.noConflict = function () {
        window['maptalks'] = old;
        return this;
    };

    window['maptalks'] = Z;
}

if (Z.node) {
    exports = module.exports = Z;
} else if (typeof define === 'function' && define.amd) {
    define(Z);
}

if (typeof window !== 'undefined') {
    exportMaptalks(Z);
}


})();