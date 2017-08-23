/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(8);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	__webpack_require__(4);
	__webpack_require__(6);
	__webpack_require__(7);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var classlist = __webpack_require__(3);

	var elements = document.getElementsByClassName('lang-option');
	for (var i = 0; i < elements.length; i++) {
	  var element = elements[i];
	  element.addEventListener('click', function () {
	    var switcher = document.getElementsByClassName('lang-switch')[0];
	    classlist.toggleClass(switcher, '-en');
	  });
	}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	function addClass(elem, className) {
	  var classList = elem.classList;

	  if (!classList.contains(className)) {
	    classList.add(className);
	  }
	}

	function removeClass(elem, className) {
	  var classList = elem.classList;

	  if (classList.contains(className)) {
	    classList.remove(className);
	  }
	}

	function toggleClass(elem, className) {
	  var classList = elem.classList;

	  if (!classList.contains(className)) {
	    classList.add(className);
	  } else {
	    classList.remove(className);
	  }
	}

	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.toggleClass = toggleClass;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Clipboard */
	var tooltip = __webpack_require__(5);

	var copyBtn = document.getElementById('action-link-copy');
	copyBtn.addEventListener('mouseleave', tooltip.clearTooltip);
	copyBtn.addEventListener('blur', tooltip.clearTooltip);

	var clipboard = new Clipboard('#action-link-copy');
	var copied = document.getElementById('text-message-copied');
	var msg = copied ? copied.innerText : 'Copied';
	clipboard.on('success', function (e) {
	  e.clearSelection();
	  tooltip.showTooltip(e.trigger, msg);
	});


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	exports.clearTooltip = function (e) {
	  e.currentTarget.setAttribute('class', 'action-link');
	  e.currentTarget.removeAttribute('aria-label');
	};

	exports.showTooltip = function (elem, msg) {
	  elem.setAttribute('class', 'action-link tooltipped tooltipped-s');
	  elem.setAttribute('aria-label', msg);
	};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var classlist = __webpack_require__(3);

	var menuBtn = document.getElementsByClassName('menu-button')[0];
	menuBtn.addEventListener('click', function () {
	  var sidebar = document.getElementsByClassName('sidebar')[0];
	  classlist.toggleClass(sidebar, '-active');
	});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* global lunr */
	var classlist = __webpack_require__(3);

	var elements = document.getElementsByClassName('example');
	var $input = document.getElementById('example-search-input');
	var $button = document.getElementById('example-search-button');
	var elementLen = elements.length;
	var index = lunr.Index.load(window.SEARCH_INDEX);

	function search(value) {
	  var result = index.search(value);
	  var len = result.length;
	  var selected = {};
	  var i = 0;

	  for (i = 0; i < len; i++) {
	    selected[result[i].ref] = true;
	  }

	  for (i = 0; i < elementLen; i++) {
	    if (selected[i]) {
	      classlist.addClass(elements[i], 'on');
	    } else {
	      classlist.removeClass(elements[i], 'on');
	    }
	  }
	}

	function displayAll() {
	  for (var i = 0; i < elementLen; i++) {
	    classlist.addClass(elements[i], 'on');
	  }
	}

	function buildSearchHandler(doSearch) {
	  function searchHandler() {
	    var value = $input.value;

	    if (!value) {
	      displayAll();
	      return;
	    }

	    if (doSearch) {
	      search(value);
	    }
	  }
	  return searchHandler;
	}

	$input.addEventListener('input', buildSearchHandler(false));
	$input.addEventListener('keyup', function (event) {
	  if (event.keyCode === 13) {
	    buildSearchHandler(true)();
	  }
	});

	$button.addEventListener('click', buildSearchHandler(true));


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);