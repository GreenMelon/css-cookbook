webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = options.computed || (options.computed = {})
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(1474)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ignoreRibbonAlphabet = __webpack_require__(18);

var _ignoreRibbonAlphabet2 = _interopRequireDefault(_ignoreRibbonAlphabet);

var _ignoreRibbonSharp = __webpack_require__(102);

var _ignoreRibbonSharp2 = _interopRequireDefault(_ignoreRibbonSharp);

var _ignoreRibbonSquare = __webpack_require__(103);

var _ignoreRibbonSquare2 = _interopRequireDefault(_ignoreRibbonSquare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseAlphabet = {
    components: {
        RibbonAlphabet: _ignoreRibbonAlphabet2.default,
        RibbonSharp: _ignoreRibbonSharp2.default,
        RibbonSquare: _ignoreRibbonSquare2.default
    },

    data: function data() {
        return {
            size: 12,
            widthTimes: 4,
            heightTimes: 8
        };
    },


    computed: {
        halfWidth: function halfWidth() {
            return (1 + this.widthTimes + 1) * this.size / 2;
        },
        halfHeight: function halfHeight() {
            return (1 + this.heightTimes + 1) * this.size / 2;
        },
        halfSize: function halfSize() {
            return this.size / 2;
        }
    }
};

exports.default = baseAlphabet;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "875319dc57eda5b955031a731a94b2c6.jpg";

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "c2ab2feb87629dc8278f58c3d789d076.jpg";

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(89)('wks');
var uid = __webpack_require__(93);
var Symbol = __webpack_require__(9).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (factory) {
   true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) :
  factory();
}(function () { 'use strict';

  function iterator(input) {
    let index = 0, col = 1, line = 1;
    return {
      curr(n = 0) {
        return input[index + n];
      },
      end() {
        return input.length <= index;
      },
      info() {
        return { index, col, line };
      },
      index(n) {
        return (n === undefined ? index : index = n);
      },
      next() {
        let next = input[index++];
        if (next == '\n') line++, col = 0;
        else col++;
        return next;
      }
    };
  }

  // I'll make it work first
  function parse(it) {
    let word = '', marks = [];
    let groups = [], result = {};

    while(!it.end()) {
      let c = it.curr();
      if (c == '(') {
        marks.push(c);
        word = '';
      }
      else if (c == ')' || c == ',') {
        if (/^\-\-.+/.test(word)) {
          if (!result.name) {
            result.name = word;
          } else {
            if (!result.alternative) {
              result.alternative = [];
            }
            result.alternative.push({
              name: word
            });
          }
        }

        if (c == ')') {
          if (marks[marks.length - 1] == '(') {
            marks.pop();
          } else {
            throw new Error('bad match');
          }
        }

        if (c == ',') {
          if (!marks.length) {
            groups.push(result);
            result = {};
          }
        }

        word = '';
      }
      else if (!/\s/.test(c)) {
        word += c;
      }
      it.next();
    }

    if (marks.length) {
      return [];
    }

    if (result.name) {
      groups.push(result);
    }
    return groups;
  }

  function parse_var(input) {
    input = input.trim();
    let result = [];
    if (!/^var\(/.test(input)) {
      return result;
    }
    let it = iterator(input);
    try {
      result = parse(it);
    } catch (e) {
      console.error(e && e.message || 'Bad variables.');
    }
    return result;
  }

  function make_array(arr) {
    return Array.isArray(arr) ? arr : [arr];
  }

  function join(arr, spliter = '\n') {
    return (arr || []).join(spliter);
  }

  function last(arr) {
    return arr[arr.length - 1];
  }

  function first(arr) {
    return arr[0];
  }

  function shuffle(arr) {
    let ret = Array.from ? Array.from(arr) : arr.slice();
    let m = arr.length;
    while (m) {
      let i = ~~(Math.random() * m--);
      let t = ret[m];
      ret[m] = ret[i];
      ret[i] = t;
    }
    return ret;
  }

  function flat_map(arr, fn) {
    if (Array.prototype.flatMap) return arr.flatMap(fn);
    return arr.reduce((acc, x) => acc.concat(fn(x)), []);
  }

  const Tokens = {
    func(name = '') {
      return {
        type: 'func',
        name,
        arguments: []
      };
    },
    argument() {
      return {
        type: 'argument',
        value: []
      };
    },
    text(value = '') {
      return {
        type: 'text',
        value
      };
    },
    pseudo(selector = '') {
      return {
        type: 'pseudo',
        selector,
        styles: []
      };
    },
    cond(name = '') {
      return {
        type: 'cond',
        name,
        styles: [],
        arguments: []
      };
    },
    rule(property = '') {
      return {
        type: 'rule',
        property,
        value: []
      };
    },
    keyframes(name = '') {
      return {
        type: 'keyframes',
        name,
        steps: []
      }
    },

    step(name = '') {
      return {
        type: 'step',
        name,
        styles: []
      }
    }
  };

  const is = {
    white_space(c) {
      return /[\s\n\t]/.test(c);
    },
    line_break(c) {
      return /\n/.test(c);
    },
    number(n) {
      return !isNaN(n);
    },
    pair(n) {
      return ['"', '(', ')', "'"].includes(n);
    },
    pair_of(c, n) {
      return ({ '"': '"', "'": "'", '(': ')' })[c] == n;
    }
  };

  function throw_error(msg, { col, line }) {
    console.error(
      `(at line ${ line }, column ${ col }) ${ msg }`
    );
  }

  function get_text_value(input) {
    if (input.trim().length) {
      return is.number(+input) ? +input : input.trim()
    } else {
      return input;
    }
  }

  function read_until(fn) {
    return function(it, reset) {
      let index = it.index();
      let word = '';
      while (!it.end()) {
        let c = it.next();
        if (fn(c)) break;
        else word += c;
      }
      if (reset) {
        it.index(index);
      }
      return word;
    }
  }

  function read_word(it, reset) {
    let check = c => /[^\w@]/.test(c);
    return read_until(check)(it, reset);
  }

  function read_keyframe_name(it) {
    return read_until(c => /[\s\{]/.test(c))(it);
  }

  function read_line(it, reset) {
    let check = c => is.line_break(c) || c == '{';
    return read_until(check)(it, reset);
  }

  function read_step(it, extra) {
    let c, step = Tokens.step();
    while (!it.end()) {
      if ((c = it.curr()) == '}') break;
      if (is.white_space(c)) {
        it.next();
        continue;
      }
      else if (!step.name.length) {
        step.name = read_selector(it);
      }
      else {
        step.styles.push(read_rule(it, extra));
        if (it.curr() == '}') break;
      }
      it.next();
    }
    return step;
  }

  function read_steps(it, extra) {
    const steps = [];
    let c;
    while (!it.end()) {
      if ((c = it.curr()) == '}') break;
      else if (is.white_space(c)) {
        it.next();
        continue;
      }
      else {
        steps.push(read_step(it, extra));
      }
      it.next();
    }
    return steps;
  }

  function read_keyframes(it, extra) {
    let keyframes = Tokens.keyframes(), c;
    while (!it.end()) {
      if ((c = it.curr()) == '}') break;
      else if (!keyframes.name.length) {
        read_word(it);
        keyframes.name = read_keyframe_name(it);
        if (!keyframes.name.length) {
          throw_error('missing keyframes name', it.info());
          break;
        }
        continue;
      }
      else if (c == '{') {
        it.next();
        keyframes.steps = read_steps(it, extra);
        break;
      }
      it.next();
    }
    return keyframes;
  }

  function read_comments(it, flag = {}) {
    it.next();
    while (!it.end()) {
      let c = it.curr();
      if (flag.inline) {
        if (c == '\n') break;
      }
      else {
        if ((c = it.curr()) == '*' && it.curr(1) == '/') break;
      }
      it.next();
    }
    if (!flag.inline) {
      it.next(); it.next();
    }
  }

  function read_property(it) {
    let prop = '', c;
    while (!it.end()) {
      if ((c = it.curr()) == ':') break;
      else if (!is.white_space(c)) prop += c;
      it.next();
    }
    return prop;
  }

  function read_arguments(it) {
    let args = [], group = [], stack = [], arg = '', c;
    while (!it.end()) {
      c = it.curr();

      if ((/[\('"`]/.test(c) && it.curr(-1) !== '\\')) {
        if (stack.length) {
          if (c != '(' && c === last(stack)) {
            stack.pop();
          } else {
            stack.push(c);
          }
        } else {
          stack.push(c);
        }
        arg += c;
      }
      else if (c == '@') {
        if (!group.length) {
          arg = arg.trimLeft();
        }
        if (arg.length) {
          group.push(Tokens.text(arg));
          arg = '';
        }
        group.push(read_func(it));
      }
      else if (/[,)]/.test(c)) {
        if (stack.length) {
          if (c == ')') {
            stack.pop();
          }
          arg += c;
        }

        else {
          if (arg.length) {
            if (!group.length) {
              group.push(Tokens.text(get_text_value(arg)));
            } else {
              if (arg.length) {
                group.push(Tokens.text(arg));
              }
            }
          }

          args.push(normalize_argument(group));
          [group, arg] = [[], ''];

          if (c == ')') break;
        }
      }
      else {
        arg += c;
      }
      it.next();
    }
    return args;
  }

  function normalize_argument(group) {
    let result = group.map(arg => {
      if (arg.type == 'text' && typeof arg.value == 'string') {
        let value = String(arg.value);
        if (value.includes('`')) {
          arg.value = value = value.replace(/`/g, '"');
        }
        arg.value = value.replace(/\n+|\s+/g, ' ');
      }
      return arg;
    });

    let ft = first(result) || {};
    let ed = last(result) || {};
    if (ft.type == 'text' && ed.type == 'text') {
      let cf = first(ft.value);
      let ce  = last(ed.value);
      if (typeof ft.value == 'string' && typeof ed.value == 'string') {
        if (is.pair(cf) && is.pair_of(cf, ce)) {
          ft.value = ft.value.slice(1);
          ed.value = ed.value.slice(0, ed.value.length - 1);
        }
      }
    }
    return result;
  }

  function read_func(it) {
    let func = Tokens.func();
    let extra = '', name = '', c;
    while (!it.end()) {
      if ((c = it.curr()) == ')') break;
      if (c == '(') {
        it.next();
        func.name = name;
        func.arguments = read_arguments(it);
        if (/\d$/.test(name)) {
          func.name = name.split(/\d+/)[0];
          extra = name.split(/\D+/)[1];
        }
        if (extra.length) {
          func.arguments.unshift([{
            type: 'text',
            value: extra
          }]);
        }
        func.position = it.info().index;
        break;
      }
      else name += c;
      it.next();
    }
    return func;
  }

  function read_value(it) {
    let text = Tokens.text(), idx = 0, skip = true, c;
    const value = [], stack = [];
    value[idx] = [];

    while (!it.end()) {
      c = it.curr();

      if (skip && is.white_space(c)) {
        it.next();
        continue;
      } else {
        skip = false;
      }

      if (c == '\n' && !is.white_space(it.curr(-1))) {
        text.value += ' ';
      }
      else if (c == ',' && !stack.length) {
        if (text.value.length) {
          value[idx].push(text);
          text = Tokens.text();
        }
        value[++idx] = [];
        skip = true;
      }
      else if (/[;}]/.test(c)) {
        if (text.value.length) {
          value[idx].push(text);
          text = Tokens.text();
        }
        break;
      }
      else if (c == '@') {
        if (text.value.length) {
          value[idx].push(text);
          text = Tokens.text();
        }
        value[idx].push(read_func(it));
      }
      else if (!is.white_space(c) || !is.white_space(it.curr(-1))) {
        if (c == '(') stack.push(c);
        if (c == ')') stack.pop();
        text.value += c;
      }
      it.next();
    }
    if (text.value.length) {
      value[idx].push(text);
    }
    return value;
  }

  function read_selector(it) {
    let selector = '', c;
    while (!it.end()) {
      if ((c = it.curr()) == '{') break;
      else if (!is.white_space(c)) {
        selector += c;
      }
      it.next();
    }
    return selector;
  }

  function read_cond_selector(it) {
    let selector = { name: '', arguments: [] }, c;
    while (!it.end()) {
      if ((c = it.curr()) == '(') {
        it.next();
        selector.arguments = read_arguments(it);
      }
      else if (/[){]/.test(c)) break;
      else if (!is.white_space(c)) selector.name += c;
      it.next();
    }
    return selector;
  }

  function read_pseudo(it, extra) {
    let pseudo = Tokens.pseudo(), c;
    while (!it.end()) {
      if ((c = it.curr()) == '}') break;
      if (is.white_space(c)) {
        it.next();
        continue;
      }
      else if (!pseudo.selector) {
        pseudo.selector = read_selector(it);
      }
      else {
        let rule = read_rule(it, extra);
        if (rule.property == '@use') {
          pseudo.styles = pseudo.styles.concat(
            rule.value
          );
        } else {
          pseudo.styles.push(rule);
        }
        if (it.curr() == '}') break;
      }
      it.next();
    }
    return pseudo;
  }

  function read_rule(it, extra) {
    let rule = Tokens.rule(), c;
    while (!it.end()) {
      if ((c = it.curr()) == ';') break;
      else if (!rule.property.length) {
        rule.property = read_property(it);
        if (rule.property == '@use') {
          rule.value = read_var(it, extra);
          break;
        }
      }
      else {
        rule.value = read_value(it);
        break;
      }
      it.next();
    }
    return rule;
  }

  function read_cond(it, extra) {
    let cond = Tokens.cond(), c;
    while (!it.end()) {
      if ((c = it.curr()) == '}') break;
      else if (!cond.name.length) {
        Object.assign(cond, read_cond_selector(it));
      }
      else if (c == ':') {
        let pseudo = read_pseudo(it);
        if (pseudo.selector) cond.styles.push(pseudo);
      }
      else if (c == '@' && !read_line(it, true).includes(':')) {
        cond.styles.push(read_cond(it));
      }
      else if (!is.white_space(c)) {
        let rule = read_rule(it, extra);
        if (rule.property) cond.styles.push(rule);
        if (it.curr() == '}') break;
      }
      it.next();
    }
    return cond;
  }

  function read_property_value(extra, name) {
    let rule = '';
    if (extra && extra.get_custom_property_value) {
      rule = extra.get_custom_property_value(name);
    }
    return rule;
  }

  function evaluate_value(values, extra) {
    values.forEach && values.forEach(v => {
      if (v.type == 'text' && v.value) {
        let vars = parse_var(v.value);
        v.value = vars.reduce((ret, p) => {
          let rule = '', other = '', parsed;
          rule = read_property_value(extra, p.name);
          if (!rule && p.alternative) {
            p.alternative.every(n => {
              other = read_property_value(extra, n.name);
              if (other) {
                rule = other;
                return false;
              }
            });
          }
          try {
            parsed = parse$1(rule, extra);
          } catch (e) { }
          if (parsed) {
            ret.push.apply(ret, parsed);
          }
          return ret;
        }, []);
      }
      if (v.type == 'func' && v.arguments) {
        v.arguments.forEach(arg => {
          evaluate_value(arg, extra);
        });
      }
    });
  }

  function read_var(it, extra) {
    it.next();
    let groups = read_value(it) || [];
    return groups.reduce((ret, group) => {
      evaluate_value(group, extra);
      let [token] = group;
      if (token.value && token.value.length) {
        ret.push(...token.value);
      }
      return ret;
    }, []);
  }

  function parse$1(input, extra) {
    const it = iterator(input);
    const Tokens = [];
    while (!it.end()) {
      let c = it.curr();
      if (is.white_space(c)) {
        it.next();
        continue;
      }
      else if (c == '/' && it.curr(1) == '*') {
        read_comments(it);
      }
      else if (c == '/' && it.curr(1) == '/') {
        read_comments(it, { inline: true });
      }
      else if (c == ':') {
        let pseudo = read_pseudo(it, extra);
        if (pseudo.selector) Tokens.push(pseudo);
      }
      else if (c == '@' && read_word(it, true) === '@keyframes') {
        let keyframes = read_keyframes(it, extra);
        Tokens.push(keyframes);
      }
      else if (c == '@' && !read_line(it, true).includes(':')) {
        let cond = read_cond(it, extra);
        if (cond.name.length) Tokens.push(cond);
      }
      else if (!is.white_space(c)) {
        let rule = read_rule(it, extra);
        if (rule.property) Tokens.push(rule);
      }
      it.next();
    }
    return Tokens;
  }

  function apply_args(fn, ...args) {
    return args.reduce((f, arg) =>
      f.apply(null, make_array(arg)), fn
    );
  }

  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function maybe(cond, value) {
    if (!cond) return '';
    return (typeof value === 'function') ? value() : value;
  }

  function range(start, stop, step) {
    let count = 0, old = start;
    let initial = n => (n > 0 && n < 1) ? .1 : 1;
    let length = arguments.length;
    if (length == 1) [start, stop] = [initial(start), start];
    if (length < 3) step = initial(start);
    let range = [];
    while ((step >= 0 && start <= stop)
      || (step < 0 && start > stop)) {
      range.push(start);
      start += step;
      if (count++ >= 1000) break;
    }
    if (!range.length) range.push(old);
    return range;
  }

  function alias_for(obj, names) {
    Object.keys(names).forEach(n => {
      obj[n] = obj[names[n]];
    });
    return obj;
  }

  function is_letter(c) {
    return /^[a-zA-Z]$/.test(c);
  }

  function lazy(fn) {
    let wrap = () => fn;
    wrap.lazy = true;
    return wrap;
  }

  function sequence(count, fn) {
    let ret = [];
    for (let i = 0; i < count; ++i) {
      ret.push(fn(i));
    }
    return ret;
  }

  function cell_id(x, y, z) {
    return 'cell-' + x + '-' + y + '-' + z;
  }

  const [ min, max, total ] = [ 1, 32, 32 * 32 ];

  function parse_grid(size) {
    let [x, y, z] = (size + '')
      .replace(/\s+/g, '')
      .replace(/[,，xX]+/g, 'x')
      .split('x')
      .map(Number);

    const max_xy = (x == 1 || y == 1) ? total : max;
    const max_z = (x == 1 && y == 1) ? total : min;

    const ret = {
      x: clamp(x || min, 1, max_xy),
      y: clamp(y || x || min, 1, max_xy),
      z: clamp(z || min, 1, max_z)
    };

    return Object.assign({}, ret,
      { count: ret.x * ret.y * ret.z }
    );
  }

  function create_svg_url(svg, id) {
    if (id) {
      let blob = new Blob([svg], { type: 'image/svg+xml' });
      let url = URL.createObjectURL(blob);
      return `url(${ url }#${ id })`;
    }
    else {
      let encoded = encodeURIComponent(svg);
      return `url("data:image/svg+xml;utf8,${ encoded }")`;
    }
  }

  function normalize_svg(input) {
    const xmlns = 'xmlns="http://www.w3.org/2000/svg"';
    if (!input.includes('<svg')) {
      input = `<svg ${ xmlns }>${ input }</svg>`;
    }
    if (!input.includes('xmlns')) {
      input = input.replace(/<svg([\s>])/, `<svg ${ xmlns }$1`);
    }
    return input;
  }

  function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  function rand(start = 0, end = start) {
    if (arguments.length == 1) {
      start = start < 1 ? .1 : 1;
    }
    return lerp(start, end, Math.random());
  }

  function pick(...items) {
    let args = items.reduce((acc, n) => acc.concat(n), []);
    return args[~~(Math.random() * args.length)];
  }

  function unique_id(prefix = '') {
    return prefix + Math.random().toString(32).substr(2);
  }

  function by_unit(fn) {
    return (...args) => {
      let unit = get_unit(args);
      return restore(fn, unit).apply(null, args);
    }
  }

  function restore(fn, unit) {
    return (...args) => {
      args = args.map(str => Number(
        String(str).replace(/\D+$/g, '')
      ));
      let result = fn.apply(null, args);
      if (!unit.length) {
        return result;
      }
      if (Array.isArray(result)) {
        return result.map(n => n + unit);
      }
      return result + unit;
    }
  }

  function get_unit(values) {
    let unit = '';
    values.some(str => {
      let input = String(str).trim();
      if (!input) return '';
      let matched = input.match(/\d(\D+)$/);
      return (unit = matched ? matched[1] : '');
    });
    return unit;
  }

  function by_charcode(fn) {
    return (...args) => {
      let codes = args.map(n => String(n).charCodeAt(0));
      let result = fn.apply(null, codes);
      return Array.isArray(result)
        ? result.map(n => String.fromCharCode(n))
        : String.fromCharCode(result);
    }
  }

  /**
   * Based on the Shunting-yard algorithm.
   */

  function calc(input) {
    const expr = infix_to_postfix(input), stack = [];
    while (expr.length) {
      let top = expr.shift();
      if (/\d+/.test(top)) stack.push(top);
      else {
        let right = stack.pop();
        let left = stack.pop();
        stack.push(compute(
          top, Number(left), Number(right)
        ));
      }
    }
    return stack[0];
  }

  const operator = {
    '*': 3, '/': 3, '%': 3,
    '+': 2, '-': 2,
    '(': 1, ')': 1
  };

  function get_tokens(input) {
    let expr = String(input);
    let tokens = [], num = '';

    for (let i = 0; i < expr.length; ++i) {
      let c = expr[i];

      if (operator[c]) {
        if (c == '-' && expr[i - 1] == 'e') {
          num += c;
        }
        else if (!tokens.length && !num.length && /[+-]/.test(c)) {
          num += c;
        } else {
          let { type, value } = last(tokens) || {};
          if (type == 'operator'
              && !num.length
              && /[^()]/.test(c)
              && /[^()]/.test(value)) {
            num += c;
          } else {
            if (num.length) {
              tokens.push({ type: 'number', value: num });
              num = '';
            }
            tokens.push({ type: 'operator', value: c });
          }
        }
      }

      else if (/\S/.test(c)) {
        num += c;
      }
    }

    if (num.length) {
      tokens.push({ type: 'number', value: num });
    }

    return tokens;
  }

  function infix_to_postfix(input) {
    let tokens = get_tokens(input);
    const op_stack = [], expr = [];

    for (let i = 0; i < tokens.length; ++i) {
      let { type, value } = tokens[i];
      if (type == 'number') {
        expr.push(value);
      }

      else if (type == 'operator') {
        if (value == '(') {
          op_stack.push(value);
        }

        else if (value == ')') {
          while (op_stack.length && last(op_stack) != '(') {
            expr.push(op_stack.pop());
          }
          op_stack.pop();
        }

        else {
          while (op_stack.length && operator[last(op_stack)] >= operator[value]) {
            let op = op_stack.pop();
            if (!/[()]/.test(op)) expr.push(op);
          }
          op_stack.push(value);
        }
      }
    }

    while (op_stack.length) {
      expr.push(op_stack.pop());
    }

    return expr;
  }

  function compute(op, a, b) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      case '%': return a % b;
    }
  }

  const store = {};

  function memo$1(prefix, fn) {
    return (...args) => {
      let key = prefix + args.join('-');
      if (store[key]) return store[key];
      return (store[key] = fn.apply(null, args));
    }
  }

  function expand(fn) {
    return (...args) => fn.apply(null, flat_map(args, n =>
      String(n).startsWith('[') ? build_range(n) : n
    ));
  }

  function Type(type, value) {
    return { type, value };
  }

  function get_tokens$1(input) {
    let expr = String(input);
    let tokens = [], stack = [];
    if (!expr.startsWith('[') || !expr.endsWith(']')) {
      return tokens;
    }

    for (let i = 1; i < expr.length - 1; ++i) {
      let c = expr[i];
      if (c == '-' && expr[i - 1] == '-') {
        continue;
      }
      if (c == '-') {
        stack.push(c);
        continue;
      }
      if (last(stack) == '-') {
        stack.pop();
        let from = stack.pop();
        tokens.push(from
          ? Type('range', [ from, c ])
          : Type('char', c)
        );
        continue;
      }
      if (stack.length) {
        tokens.push(Type('char', stack.pop()));
      }
      stack.push(c);
    }
    if (stack.length) {
      tokens.push(Type('char', stack.pop()));
    }
    return tokens;
  }

  const build_range = memo$1('build_range', (input) => {
    let tokens = get_tokens$1(input);
    return flat_map(tokens, ({ type, value }) => {
      if (type == 'char') return value;
      let [ from, to ] = value;
      let reverse = false;
      if (from > to) {
        [from, to] = [ to, from ];
        reverse = true;
      }
      let result = by_charcode(range)(from, to);
      if (reverse) result.reverse();
      return result;
    });
  });

  const { cos, sin, sqrt, pow, PI } = Math;
  const DEG = PI / 180;

  function polygon(option, fn) {
    if (typeof arguments[0] == 'function') {
      fn = option;
      option = {};
    }

    if (!fn) {
      fn = t => [ cos(t), sin(t) ];
    }

    let split = option.split || 120;
    let scale = option.scale || 1;
    let start = DEG * (option.start || 0);
    let deg = option.deg ? (option.deg * DEG) : (PI / (split / 2));
    let points = [];

    for (let i = 0; i < split; ++i) {
      let t = start + deg * i;
      let [x, y] = fn(t);
      points.push(
        ((x * 50 * scale) + 50 + '% ') +
        ((y * 50 * scale) + 50 + '%')
      );
    }

    return option.type
      ? `polygon(${ option.type }, ${ points.join(',') })`
      : `polygon(${ points.join(',') })`;
  }

  function rotate(x, y, deg) {
    let rad = DEG * deg;
    return [
      x * cos(rad) - y * sin(rad),
      y * cos(rad) + x * sin(rad)
    ];
  }

  const shapes =  {

    circle() {
      return 'circle(49%)';
    },

    triangle() {
      return polygon({ split: 3, start: -90 }, t => [
        cos(t) * 1.1,
        sin(t) * 1.1 + .2
      ]);
    },

    rhombus() {
      return polygon({ split: 4 });
    },

    pentagon() {
      return polygon({ split: 5, start: 54 });
    },

    hexgon() {
      return polygon({ split: 6, start: 30 });
    },

    hexagon() {
      return polygon({ split: 6, start: 30 });
    },

    heptagon() {
      return polygon({ split: 7, start: -90 });
    },

    octagon() {
      return polygon({ split: 8, start: 22.5 });
    },

    star() {
      return polygon({ split: 5, start: 54, deg: 144 });
    },

    diamond() {
      return 'polygon(50% 5%, 80% 50%, 50% 95%, 20% 50%)';
    },

    cross() {
      return `polygon(
      5% 35%,  35% 35%, 35% 5%,  65% 5%,
      65% 35%, 95% 35%, 95% 65%, 65% 65%,
      65% 95%, 35% 95%, 35% 65%, 5% 65%
    )`;
    },

    clover(k = 3) {
      k = clamp(k, 3, 5);
      if (k == 4) k = 2;
      return polygon({ split: 240 }, t => {
        let x = cos(k * t) * cos(t);
        let y = cos(k * t) * sin(t);
        if (k == 3) x -= .2;
        if (k == 2) {
          x /= 1.1;
          y /= 1.1;
        }
        return [x, y];
      });
    },

    hypocycloid(k = 3) {
      k = clamp(k, 3, 6);
      let m = 1 - k;
      return polygon({ scale: 1 / k  }, t => {
        let x = m * cos(t) + cos(m * (t - PI));
        let y = m * sin(t) + sin(m * (t - PI));
        if (k == 3) {
          x = x * 1.1 - .6;
          y = y * 1.1;
        }
        return [x, y];
      });
    },

    astroid() {
      return shapes.hypocycloid(4);
    },

    infinity() {
      return polygon(t => {
        let a = .7 * sqrt(2) * cos(t);
        let b = (pow(sin(t), 2) + 1);
        return [
          a / b,
          a * sin(t) / b
        ]
      });
    },

    heart() {
      return polygon(t => {
        let x = .75 * pow(sin(t), 3);
        let y =
            cos(1 * t) * (13 / 18)
          - cos(2 * t) * (5 / 18)
          - cos(3 * t) / 18
          - cos(4 * t) / 18;
        return rotate(
          x * 1.2,
          (y + .2) * 1.1,
          180
        );
      });
    },

    bean() {
      return polygon(t => {
        let [a, b] = [pow(sin(t), 3), pow(cos(t), 3)];
        return rotate(
          (a + b) * cos(t) * 1.3 - .45,
          (a + b) * sin(t) * 1.3 - .45,
          -90
        );
      });
    },

    bicorn() {
      return polygon(t => rotate(
        cos(t),
        pow(sin(t), 2) / (2 + sin(t)) - .5,
        180
      ));
    },

    pear() {
      return polygon(t => [
        sin(t),
        (1 + sin(t)) * cos(t) / 1.4
      ]);
    },

    fish() {
      return polygon(t => [
        cos(t) - pow(sin(t), 2) / sqrt(2),
        sin(2 * t) / 2
      ]);
    },

    whale() {
      return polygon({ split: 240 }, t => {
        let r = 3.4 * (pow(sin(t), 2) - .5) * cos(t);
        return rotate(
          cos(t) * r + .75,
          sin(t) * r * 1.2,
          180
        );
      });
    },

    bud(n = 3) {
      n = clamp(n, 3, 10);
      return polygon({ split: 240 }, t => [
        ((1 + .2 * cos(n * t)) * cos(t)) * .8,
        ((1 + .2 * cos(n * t)) * sin(t)) * .8
      ]);
    },

    alien(...args) {
      let [a = 1, b = 1, c = 1, d = 1, e = 1]
        = args.map(n => clamp(n, 1, 9));
      return polygon({ split: 480, type: 'evenodd' }, t => [
        (cos(t * a) + cos(t * c) + cos(t * e)) * .31,
        (sin(t * b) + sin(t * d) + sin(t)) * .31
      ]);
    }

  };

  const Expose = {

    index({ count }) {
      return _ => count;
    },

    row({ x }) {
      return _ => x;
    },

    col({ y }) {
      return _ => y;
    },

    depth({ z }) {
      return _ => z;
    },

    size({ grid }) {
      return _ => grid.count;
    },

    ['size-row']({ grid }) {
      return _ => grid.x;
    },

    ['size-col']({ grid }) {
      return _ => grid.y;
    },

    ['size-depth']({ grid }) {
      return _ => grid.z;
    },

    id({ x, y, z }) {
      return _ => cell_id(x, y, z);
    },

    n({ idx }) {
      return _ => idx || 0;
    },

    pick({ context }) {
      return expand((...args) => (
        context.last_pick = pick(args)
      ));
    },

    ['pick-n']({ idx, context, position }) {
      let counter = 'pn-counter' + position;
      return expand((...args) => {
        if (!context[counter]) context[counter] = 0;
        context[counter] += 1;
        let max = args.length;
        let pos = ((idx === undefined ? context[counter] : idx) - 1) % max;
        return context.last_pick = args[pos];
      });
    },

    ['pick-d']({ idx, context, position }) {
      let counter = 'pd-counter' + position;
      let values = 'pd-values' + position;
      return expand((...args) => {
        if (!context[counter]) context[counter] = 0;
        context[counter] += 1;
        if (!context[values]) {
          context[values] = shuffle(args);
        }
        let max = args.length;
        let pos = ((idx === undefined ? context[counter] : idx) - 1) % max;
        return context.last_pick = context[values][pos];
      });
    },

    ['last-pick']({ context }) {
      return () => context.last_pick;
    },

    multiple: lazy((n, action) => {
      if (!action || !n) return '';
      let count = clamp(n(), 0, 65536);
      return sequence(count, i => action(i + 1)).join(',');
    }),

    ['multiple-with-space']: lazy((n, action) => {
      if (!action || !n) return '';
      let count = clamp(n(), 0, 65536);
      return sequence(count, i => action(i + 1)).join(' ');
    }),

    repeat: lazy((n, action) => {
      if (!action || !n) return '';
      let count = clamp(n(), 0, 65536);
      return sequence(count, i => action(i + 1)).join('');
    }),

    rand({ context }) {
      return (...args) => {
        let transform_type = args.every(is_letter)
          ? by_charcode
          : by_unit;
        let value = transform_type(rand).apply(null, args);
        return context.last_rand = value;
      };
    },

    ['rand-int']({ context }) {
      return (...args) => {
        let transform_type = args.every(is_letter)
          ? by_charcode
          : by_unit;
        let value = parseInt(
          transform_type(rand).apply(null, args)
        );
        return context.last_rand = value;
      }
    },

    ['last-rand']({ context }) {
      return () => context.last_rand;
    },

    calc() {
      return value => calc(value);
    },

    hex() {
      return value => parseInt(value).toString(16);
    },

    svg: lazy(input => {
      if (input === undefined) return '';
      let svg = normalize_svg(input().trim());
      return create_svg_url(svg);
    }),

    ['svg-filter']: lazy(input => {
      if (input === undefined) return '';
      let id = unique_id('filter-');
      let svg = normalize_svg(input().trim())
        .replace(
          /<filter([\s>])/,
          `<filter id="${ id }"$1`
        );
      return create_svg_url(svg, id);
    }),

    var() {
      return value => `var(${ value })`;
    },

    shape() {
      return memo('shape-function', (type = '', ...args) => {
        type = type.trim();
        if (typeof shapes[type] === 'function') {
          return shapes[type](args);
        }
        return '';
      });
    }

  };

  var Func = alias_for(Expose, {
    'm':  'multiple',
    'ms': 'multiple-with-space',

    'r':  'rand',
    'ri': 'rand-int',
    'lr': 'last-rand',

    'p':  'pick',
    'pn': 'pick-n',
    'pd': 'pick-d',
    'lp': 'last-pick',

    'i':  'index',
    'x':  'row',
    'y':  'col',
    'z':  'depth',

    'size-x': 'size-row',
    'size-y': 'size-col',
    'size-z': 'size-depth',

    // legacy names
    'multi': 'multiple',
    'pick-by-turn': 'pick-n',
    'max-row': 'size-row',
    'max-col': 'size-col'
  });

  const is_seperator = c => /[,，\s]/.test(c);

  function skip_seperator(it) {
    while (!it.end()) {
      if (!is_seperator(it.curr(1))) break;
      else it.next();
    }
  }

  function parse$2(input) {
    const it = iterator(input);
    const result = [], stack = [];
    let group = '';

    while (!it.end()) {
      let c = it.curr();
      if (c == '(') {
        group += c;
        stack.push(c);
      }

      else if (c == ')') {
        group += c;
        if (stack.length) {
          stack.pop();
        }
      }

      else if (stack.length) {
        group += c;
      }

      else if (is_seperator(c)) {
        result.push(group);
        group = '';
        skip_seperator(it);
      }

      else {
        group += c;
      }

      it.next();
    }

    if (group) {
      result.push(group);
    }

    return result;
  }

  let all = [];

  function get_props(arg) {
    if (!all.length) {
      let props = new Set();
      for (let n in document.head.style) {
        if (!n.startsWith('-')) {
          props.add(n.replace(/[A-Z]/g, '-$&').toLowerCase());
        }
      }
      if (!props.has('grid-gap')) {
        props.add('grid-gap');
      }
      all = Array.from(props);
    }
    return (arg && arg.test)
      ? all.filter(n => arg.test(n))
      : all;
  }

  function build_mapping(prefix) {
    let reg = new RegExp(`\\-?${ prefix }\\-?`);
    return get_props(reg)
      .map(n => n.replace(reg, ''))
      .reduce((obj, n) => { return obj[n] = n, obj }, {});
  }

  const props_webkit_mapping = build_mapping('webkit');
  const props_moz_mapping = build_mapping('moz');

  function prefixer(prop, rule) {
    if (props_webkit_mapping[prop]) {
      return `-webkit-${ rule } ${ rule }`;
    }
    else if (props_moz_mapping[prop]) {
      return `-moz-${ rule } ${ rule }`;
    }
    return rule;
  }

  var Property = {

    ['@size'](value, { is_special_selector }) {
      let [w, h = w] = parse$2(value);
      return `
      width: ${ w };
      height: ${ h };
      ${ is_special_selector ? '' : `
        --internal-cell-width: ${ w };
        --internal-cell-height: ${ h };
      `}
    `;
    },

    ['@min-size'](value) {
      let [w, h = w] = parse$2(value);
      return `min-width: ${ w }; min-height: ${ h };`;
    },

    ['@max-size'](value) {
      let [w, h = w] = parse$2(value);
      return `max-width: ${ w }; max-height: ${ h };`;
    },

    ['@place-cell']: (() => {
      let map_left_right = {
        'center': '50%', '0': '0%',
        'left': '0%', 'right': '100%',
        'top': '50%', 'bottom': '50%'
      };
      let map_top_bottom = {
        'center': '50%', '0': '0%',
        'top': '0%', 'bottom': '100%',
        'left': '50%', 'right': '50%',
      };

      return value => {
        let [left, top = '50%'] = parse$2(value);
        left = map_left_right[left] || left;
        top = map_top_bottom[top] || top;
        const cw = 'var(--internal-cell-width, 25%)';
        const ch = 'var(--internal-cell-height, 25%)';
        return `
        position: absolute;
        left: ${ left };
        top: ${ top };
        width: ${ cw };
        height: ${ ch };
        margin-left: calc(${ cw } / -2) !important;
        margin-top: calc(${ ch } / -2) !important;
        grid-area: unset !important;
      `;
      }
    })(),

    ['@grid'](value, options) {
      let [grid, size] = value.split('/').map(s => s.trim());
      return {
        grid: parse_grid(grid),
        size: size ? this['@size'](size, options) : ''
      };
    },

    ['@shape']: memo$1('shape-property', value => {
      let [type, ...args] = parse$2(value);
      let prop = 'clip-path';
      if (!shapes[type]) return '';
      let rules = `${ prop }: ${ shapes[type].apply(null, args) };`;
      return prefixer(prop, rules) + 'overflow: hidden;';
    }),

    ['@use'](rules) {
      if (rules.length > 2) {
        return rules;
      }
    }

  };

  function build_expr(expr) {
    return n => String(expr)
      .replace(/(\d+)(n)/g, '$1*' + n)
      .replace(/n/g, n);
  }

  function nth(input, curr, max) {
    let expr = build_expr(input);
    for (let i = 0; i <= max; ++i) {
      if (calc(expr(i)) == curr) return true;
    }
  }

  const is$1 = {
    even: n => !!(n % 2),
    odd:  n => !(n % 2)
  };

  function even_or_odd(expr) {
    return /^(even|odd)$/.test(expr);
  }

  var Selector = {

    at({ x, y }) {
      return (x1, y1) => (x == x1 && y == y1);
    },

    nth({ count, grid }) {
      return (...exprs) => exprs.some(expr =>
        even_or_odd(expr)
          ? is$1[expr](count - 1)
          : nth(expr, count, grid.count)
      );
    },

    row({ x, grid }) {
      return (...exprs) => exprs.some(expr =>
        even_or_odd(expr)
          ? is$1[expr](x - 1)
          : nth(expr, x, grid.x)
      );
    },

    col({ y, grid }) {
      return (...exprs) => exprs.some(expr =>
        even_or_odd(expr)
          ? is$1[expr](y - 1)
          : nth(expr, y, grid.y)
      );
    },

    even({ count }) {
      return _ => is$1.even(count - 1);
    },

    odd({ count }) {
      return _ => is$1.odd(count - 1);
    },

    random() {
      return (ratio = .5) => {
        if (ratio >= 1 && ratio <= 0) ratio = .5;
        return Math.random() < ratio;
      }
    }

  };

  // Expose all Math functions and constants.
  const methods = Object.getOwnPropertyNames(Math);

  var MathFunc = methods.reduce((expose, n) => {
    expose[n] = () => (...args) => {
      if (typeof Math[n] === 'number') return Math[n];
      return Math[n].apply(null, args.map(calc));
    };
    return expose;
  }, {});

  function is_host_selector(s) {
    return /^\:(host|doodle)/.test(s);
  }

  function is_parent_selector(s) {
    return /^\:(container|parent)/.test(s);
  }

  function is_special_selector(s) {
    return is_host_selector(s) || is_parent_selector(s);
  }

  class Rules {

    constructor(tokens) {
      this.tokens = tokens;
      this.rules = {};
      this.props = {};
      this.keyframes = {};
      this.grid = null;
      this.coords = [];
      this.reset();
    }

    reset() {
      this.styles = {
        host: '',
        container: '',
        cells: '',
        keyframes: ''
      };
      this.coords = [];
      for (let key in this.rules) {
        if (key.startsWith('#cell')) {
          delete this.rules[key];
        }
      }
    }

    add_rule(selector, rule) {
      let rules = this.rules[selector];
      if (!rules) {
        rules = this.rules[selector] = [];
      }

      rules.push.apply(rules, make_array(rule));
    }

    pick_func(name) {
      return Func[name] || MathFunc[name];
    }

    compose_aname(...args) {
      return args.join('-');
    }

    compose_selector({ x, y, z}, pseudo = '') {
      return `#${ cell_id(x, y, z) }${ pseudo }`;
    }

    compose_argument(argument, coords, idx) {
      let result = argument.map(arg => {
        if (arg.type == 'text') {
          return arg.value;
        }
        else if (arg.type == 'func') {
          let fn = this.pick_func(arg.name.substr(1));
          if (fn) {
            coords.idx = idx;
            coords.position = arg.position;
            let args = arg.arguments.map(n => {
              return fn.lazy
                ? idx => this.compose_argument(n, coords, idx)
                : this.compose_argument(n, coords, idx);
            });
            return apply_args(fn, coords, args);
          }
        }
      });

      return (result.length >= 2)
        ? result.join('')
        : result[0];
    }

    compose_value(value, coords) {
      if (!value || !value.reduce) return '';
      return value.reduce((result, val) => {
        switch (val.type) {
          case 'text': {
            result += val.value;
            break;
          }
          case 'func': {
            let fname = val.name.substr(1);
            let fn = this.pick_func(fname);
            if (fn) {
              coords.position = val.position;
              let args = val.arguments.map(arg => {
                if (fn.lazy) {
                  return idx => this.compose_argument(arg, coords, idx);
                } else {
                  return this.compose_argument(arg, coords);
                }
              });
              result += apply_args(fn, coords, args);
            }
          }
        }
        return result;
      }, '');
    }

    compose_rule(token, _coords, selector) {
      let coords = Object.assign({}, _coords);
      let prop = token.property;
      let value_group = token.value.reduce((ret, v) => {
        let composed = this.compose_value(v, coords);
        if (composed) ret.push(composed);
        return ret;
      }, []);

      let value = value_group.join(', ');

      if (/^animation(\-name)?$/.test(prop)) {
        this.props.has_animation = true;
        if (coords.count > 1) {
          let { count } = coords;
          switch (prop) {
            case 'animation-name': {
              value = value_group
                .map(n => this.compose_aname(n, count))
                .join(', ');
              break;
            }
            case 'animation': {
              value = value_group
                .map(n => {
                  let group = (n || '').split(/\s+/);
                  group[0] = this.compose_aname(group[0], count);
                  return group.join(' ');
                })
                .join(', ');
            }
          }
        }
      }

      if (prop == 'content') {
        if (!/["']|^none$|^(var|counter|counters|attr)\(/.test(value)) {
          value = `'${ value }'`;
        }
      }

      if (prop == 'transition') {
        this.props.has_transition = true;
      }

      let rule = `${ prop }: ${ value };`;
      rule = prefixer(prop, rule);

      if (prop == 'clip-path') {
        // fix clip bug
        rule += ';overflow: hidden;';
      }

      if (prop == 'width' || prop == 'height') {
        if (!is_special_selector(selector)) {
          rule += `--internal-cell-${ prop }: ${ value };`;
        }
      }

      if (Property[prop]) {
        let transformed = Property[prop](value, {
          is_special_selector: is_special_selector(selector)
        });
        switch (prop) {
          case '@grid': {
            if (is_host_selector(selector)) {
              this.grid = transformed.grid;
              rule = transformed.size || '';
            }
            break;
          }
          case '@place-cell': {
            if (!is_host_selector(selector)) {
              rule = transformed;
            }
          }
          case '@use': {
            if (token.value.length) {
              this.compose(coords, token.value);
            }
            rule = Property[prop](token.value);
          }
          default: {
            rule = transformed;
          }
        }
      }

      return rule;
    }

    compose(coords, tokens) {
      this.coords.push(coords);
      (tokens || this.tokens).forEach((token, i) => {
        if (token.skip) return false;
        switch (token.type) {
          case 'rule':
            this.add_rule(
              this.compose_selector(coords),
              this.compose_rule(token, coords)
            );
            break;

          case 'pseudo': {
            if (token.selector.startsWith(':doodle')) {
              token.selector = token.selector.replace(/^\:+doodle/, ':host');
            }
            let special = is_special_selector(token.selector);
            if (special) {
              token.skip = true;
            }
            token.selector.split(',').forEach(selector => {
              let pseudo = token.styles.map(s =>
                this.compose_rule(s, coords, selector)
              );
              let composed = special
                ? selector
                : this.compose_selector(coords, selector);
              this.add_rule(composed, pseudo);
            });

            break;
          }

          case 'cond': {
            let fn = Selector[token.name.substr(1)];
            if (fn) {
              let args = token.arguments.map(arg => {
                return this.compose_argument(arg, coords);
              });
              let result = apply_args(fn, coords, args);
              if (result) {
                this.compose(coords, token.styles);
              }
            }
            break;
          }

          case 'keyframes': {
            if (!this.keyframes[token.name]) {
              this.keyframes[token.name] = coords => `
              ${ join(token.steps.map(step => `
                ${ step.name } {
                  ${ join(
                    step.styles.map(s => this.compose_rule(s, coords))
                  )}
                }
              `)) }
            `;
            }
          }
        }
      });
    }

    output() {
      Object.keys(this.rules).forEach((selector, i) => {
        if (is_parent_selector(selector)) {
          this.styles.container += `
          .container {
            ${ join(this.rules[selector]) }
          }
        `;
        } else {
          let target = is_host_selector(selector) ? 'host' : 'cells';
          this.styles[target] += `
          ${ selector } {
            ${ join(this.rules[selector]) }
          }
        `;
        }
      });

      let keyframes = Object.keys(this.keyframes);
      this.coords.forEach((coords, i) => {
        keyframes.forEach(name => {
          let aname = this.compose_aname(name, coords.count);
          this.styles.keyframes += `
          ${ maybe(i == 0,
            `@keyframes ${ name } {
              ${ this.keyframes[name](coords) }
            }`
          )}
          @keyframes ${ aname } {
            ${ this.keyframes[name](coords) }
          }
        `;
        });
      });

      return {
        props: this.props,
        styles: this.styles,
        grid: this.grid
      }
    }
  }

  function generator(tokens, grid_size) {
    let rules = new Rules(tokens);
    let context = {};
    rules.compose({
      x: 1, y: 1, z: 1, count: 1, context: {},
      grid: { x: 1, y: 1, z: 1, count: 1 }
    });
    let { grid } = rules.output();
    if (grid) grid_size = grid;
    rules.reset();

    if (grid_size.z == 1) {
      for (let x = 1, count = 0; x <= grid_size.x; ++x) {
        for (let y = 1; y <= grid_size.y; ++y) {
          rules.compose({
            x, y, z: 1,
            count: ++count, grid: grid_size, context
          });
        }
      }
    }
    else {
      for (let z = 1, count = 0; z <= grid_size.z; ++z) {
        rules.compose({
          x: 1, y: 1, z,
          count: ++count, grid: grid_size, context
        });
      }
    }

    return rules.output();
  }

  class Doodle extends HTMLElement {
    constructor() {
      super();
      this.doodle = this.attachShadow({ mode: 'open' });
      this.extra = {
        get_custom_property_value: this.get_custom_property_value.bind(this)
      };
    }
    connectedCallback(again) {
      setTimeout(() => {
        let compiled;
        let use = this.getAttribute('use') || '';
        if (use) use = `@use:${ use };`;
        if (!this.innerHTML.trim() && !use) return false;
        try {
          let parsed = parse$1(use + this.innerHTML, this.extra);
          this.grid_size = parse_grid(this.getAttribute('grid'));
          compiled = generator(parsed, this.grid_size);
          compiled.grid && (this.grid_size = compiled.grid);
          this.build_grid(compiled);
        } catch (e) {
          this.innerHTML = '';
          console.error(e && e.message || 'Error in css-doodle.');
        }
        if (!again && this.hasAttribute('click-to-update')) {
          this.addEventListener('click', e => this.update());
        }
      });
    }

    get_custom_property_value(name) {
      return getComputedStyle(this).getPropertyValue(name)
        .trim()
        .replace(/^\(|\)$/g, '');
    }

    cell(x, y, z) {
      let cell = document.createElement('div');
      cell.id = cell_id(x, y, z);
      return cell;
    }

    build_grid(compiled) {
      const { has_transition, has_animation } = compiled.props;
      const { keyframes, host, container, cells } = compiled.styles;

      this.doodle.innerHTML = `
      <style>
        ${ this.style_basic() }
      </style>
      <style class="style-keyframes">
        ${ keyframes }
      </style>
      <style class="style-container">
        ${ this.style_size() }
        ${ host }
        ${ container }
      </style>
      <style class="style-cells">
        ${ (has_transition || has_animation) ? '' : cells }
      </style>
      <div class="container"></div>
    `;

      this.doodle.querySelector('.container')
        .appendChild(this.html_cells());

      if (has_transition || has_animation) {
        setTimeout(() => {
          this.set_style('.style-cells', cells);
        }, 50);
      }
    }

    inherit_props(p) {
      return get_props(/grid/)
        .map(n => `${ n }: inherit;`)
        .join('');
    }

    style_basic() {
      return `
      :host {
        display: block;
        visibility: visible;
        width: 1em;
        height: 1em;
      }
      .container {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        ${ this.inherit_props() }
      }
      .container div:empty {
        position: relative;
        line-height: 1;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `;
    }

    style_size() {
      let { x, y } = this.grid_size;
      return `
      :host {
        grid-template-rows: repeat(${ x }, 1fr);
        grid-template-columns: repeat(${ y }, 1fr);
      }
    `;
    }

    html_cells() {
      let { x, y, z } = this.grid_size;
      let root = document.createDocumentFragment();
      if (z == 1) {
        for (let i = 1; i <= x; ++i) {
          for (let j = 1; j <= y; ++j) {
            root.appendChild(this.cell(i, j, 1));
          }
        }
      }
      else {
        let temp = null;
        for (let i = 1; i <= z; ++i) {
          let cell = this.cell(1, 1, i);
          (temp || root).appendChild(cell);
          temp = cell;
        }
        temp = null;
      }
      return root;
    }

    set_style(selector, styles) {
      const el = this.shadowRoot.querySelector(selector);
      el && (el.styleSheet
        ? (el.styleSheet.cssText = styles )
        : (el.innerHTML = styles));
    }

    update(styles) {
      let use = this.getAttribute('use') || '';
      if (use) use = `@use:${ use };`;

      if (!styles) styles = this.innerHTML;
      this.innerHTML = styles;

      if (!this.grid_size) {
        this.grid_size = parse_grid(this.getAttribute('grid'));
      }

      const compiled = generator(parse$1(use + styles, this.extra), this.grid_size);

      if (compiled.grid) {
        let { x, y, z } = compiled.grid;
        let { x: gx, y: gy, z: gz } = this.grid_size;
        if (gx !== x || gy !== y || gz !== z) {
          Object.assign(this.grid_size, compiled.grid);
          return this.build_grid(compiled);
        }
        Object.assign(this.grid_size, compiled.grid);
      }

      else {
        let grid = parse_grid(this.getAttribute('grid'));
        let { x, y, z } = grid;
        let { x: gx, y: gy, z: gz } = this.grid_size;
        if (gx !== x || gy !== y || gz !== z) {
          Object.assign(this.grid_size, grid);
          return this.build_grid(
            generator(parse$1(use + styles, this.extra), this.grid_size)
          );
        }
      }

      this.set_style('.style-keyframes',
        compiled.styles.keyframes
      );

      if (compiled.props.has_animation) {
        this.set_style('.style-cells', '');
        this.set_style('.style-container', '');
      }

      setTimeout(() => {
        this.set_style('.style-container',
            this.style_size()
          + compiled.styles.host
          + compiled.styles.container
        );
        this.set_style('.style-cells',
          compiled.styles.cells
        );
      });
    }

    get grid() {
      return Object.assign({}, this.grid_size);
    }

    set grid(grid) {
      this.setAttribute('grid', grid);
      this.connectedCallback(true);
    }

    get use() {
      return this.getAttribute('use');
    }

    set use(use) {
      this.setAttribute('use', use);
      this.connectedCallback(true);
    }

    static get observedAttributes() {
      return ['grid', 'use'];
    }

    attributeChangedCallback(name, old_val, new_val) {
      if (old_val == new_val) {
        return false;
      }
      if (name == 'grid' && old_val) {
        this.grid = new_val;
      }
      if (name == 'use' && old_val) {
        this.use = new_val;
      }
    }
  }

  customElements.define('css-doodle', Doodle);

}));


/***/ }),
/* 9 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "22b38e18e3f11a07b1226997d574a0a4.png";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(22);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(86)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(16);
var createDesc = __webpack_require__(24);
module.exports = __webpack_require__(13) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(11);
var IE8_DOM_DEFINE = __webpack_require__(398);
var toPrimitive = __webpack_require__(413);
var dP = Object.defineProperty;

exports.f = __webpack_require__(13) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 17 */,
/* 18 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1275)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(221),
  /* template */
  __webpack_require__(999),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-ribbon-alphabet.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ignore-ribbon-alphabet.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3097d8f0", Component.options)
  } else {
    hotAPI.reload("data-v-3097d8f0", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 19 */,
/* 20 */,
/* 21 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(89)('keys');
var uid = __webpack_require__(93);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABOCAYAAACOqiAdAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwMi8yMi8xM9mZDVkAAAAfdEVYdFNvZnR3YXJlAE1hY3JvbWVkaWEgRmlyZXdvcmtzIDi1aNJ4AAACl0lEQVR4nO2bbW7CQAxEDeo9gZMlR4GTuT/QVpRkk13bM1mQR6r6Cz3NUz8I1oj2ZppUr9fulw2KMYOkGyLy/AK2ImFcoHZxrxBgKxLGDWoTtwYBtCJhQkD74rYgga1ImDDQtrgWSEArEiYUVBfXA3G0ImHCQeviLBBDKxIGAlqK80A6WpEwMJCEQxpakTBQkEAgG61IGDhIYJAVGAlDAQkU8gIjYbDSXkBnOZ2EERKGB1JV1Xmm/A6RMBSQQGErf7VJGDhIYLCN9wkkDBQkEFjDO1MSBgZaivPCOp6FSBgIaF2cFWZ4+iZhwkF1cb0wx+c9JEwoaFtcKyzgE0YSJgy0L24PFviZNgkTAmoTV4MBrigkjBvULu4dBrzbkTAuUJ+4AiNcikkYM+ikqtrzbDvPIo+HyDSBHp7JMffpsUy7sJPi6dMsjnZhJ8Xbp0kc7cJOSkSfXXG0CzspUX02xdEu7KRE9qmKo13YSYnusyqOdmEnBdFnIY52YScF1UeiISPJQ/YRBGQEeeg+goIcKY/RR2gX9i+Q9trnTLuwk0Lro0q8sJPC6CNI2JH/HNB9BAUb4e0Iso8gYCNIK0H1WYjzwkaSVoLosyrOChtRWkl0n6q4XtjI0koi+2yKa4V9grSSqD674vZgnyStJKJPk7ga7BOllXj7NIt7h32ytBJPn5+ex7PL5fn9fv+Og7Snz7kbprNMcut9WXfmWeSGx9j7dP185ib/L+3icpP/L23icpO/yL643OSvZltcbvKrqYvLTX5u8nOTb5GXm3yDvNzkG+TlJt8gLzf5hk65yR8cpKq5yTeABArLTX5UGyomN/kOTG7yHZjc5DswucnPTf4xmNzkHw1qE1eD5SbfAMtNvgGWm3z9BYVXGYp5QqaLAAAAAElFTkSuQmCC"

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1457)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(166),
  /* template */
  __webpack_require__(1181),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/a.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] a.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca5cf920", Component.options)
  } else {
    hotAPI.reload("data-v-ca5cf920", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1393)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(167),
  /* template */
  __webpack_require__(1119),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/a1.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] a1.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-812f071e", Component.options)
  } else {
    hotAPI.reload("data-v-812f071e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1392)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(168),
  /* template */
  __webpack_require__(1118),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/a2.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] a2.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8112d81c", Component.options)
  } else {
    hotAPI.reload("data-v-8112d81c", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1455)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(169),
  /* template */
  __webpack_require__(1179),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/b.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] b.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca40ca1e", Component.options)
  } else {
    hotAPI.reload("data-v-ca40ca1e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1454)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(170),
  /* template */
  __webpack_require__(1178),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/c.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] c.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca249b1c", Component.options)
  } else {
    hotAPI.reload("data-v-ca249b1c", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1453)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(171),
  /* template */
  __webpack_require__(1177),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/d.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] d.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca086c1a", Component.options)
  } else {
    hotAPI.reload("data-v-ca086c1a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1385)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(172),
  /* template */
  __webpack_require__(1111),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/d1.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] d1.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-76f1f364", Component.options)
  } else {
    hotAPI.reload("data-v-76f1f364", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1384)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(173),
  /* template */
  __webpack_require__(1110),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/d2.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] d2.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-76d5c462", Component.options)
  } else {
    hotAPI.reload("data-v-76d5c462", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1383)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(174),
  /* template */
  __webpack_require__(1109),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/d3.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] d3.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-76b99560", Component.options)
  } else {
    hotAPI.reload("data-v-76b99560", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1382)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(175),
  /* template */
  __webpack_require__(1108),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/d4.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] d4.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-769d665e", Component.options)
  } else {
    hotAPI.reload("data-v-769d665e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1452)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(176),
  /* template */
  __webpack_require__(1176),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/e.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] e.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c9ec3d18", Component.options)
  } else {
    hotAPI.reload("data-v-c9ec3d18", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1450)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(177),
  /* template */
  __webpack_require__(1174),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/f.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] f.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c9d00e16", Component.options)
  } else {
    hotAPI.reload("data-v-c9d00e16", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1449)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(178),
  /* template */
  __webpack_require__(1173),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/g.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] g.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c9b3df14", Component.options)
  } else {
    hotAPI.reload("data-v-c9b3df14", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1448)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(179),
  /* template */
  __webpack_require__(1172),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/h.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] h.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c997b012", Component.options)
  } else {
    hotAPI.reload("data-v-c997b012", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1447)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(180),
  /* template */
  __webpack_require__(1171),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/i.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] i.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c97b8110", Component.options)
  } else {
    hotAPI.reload("data-v-c97b8110", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1446)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(181),
  /* template */
  __webpack_require__(1170),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/j.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] j.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c95f520e", Component.options)
  } else {
    hotAPI.reload("data-v-c95f520e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1445)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(182),
  /* template */
  __webpack_require__(1169),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/k.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] k.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c943230c", Component.options)
  } else {
    hotAPI.reload("data-v-c943230c", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1444)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(183),
  /* template */
  __webpack_require__(1168),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/l.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] l.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c926f40a", Component.options)
  } else {
    hotAPI.reload("data-v-c926f40a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1443)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(184),
  /* template */
  __webpack_require__(1167),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/m.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] m.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c90ac508", Component.options)
  } else {
    hotAPI.reload("data-v-c90ac508", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1349)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(185),
  /* template */
  __webpack_require__(1073),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/m1.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] m1.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-583ab836", Component.options)
  } else {
    hotAPI.reload("data-v-583ab836", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1348)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(186),
  /* template */
  __webpack_require__(1072),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/m2.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] m2.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-581e8934", Component.options)
  } else {
    hotAPI.reload("data-v-581e8934", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1442)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(188),
  /* template */
  __webpack_require__(1166),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/n.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] n.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c8ee9606", Component.options)
  } else {
    hotAPI.reload("data-v-c8ee9606", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1441)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(190),
  /* template */
  __webpack_require__(1165),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/o.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] o.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c8d26704", Component.options)
  } else {
    hotAPI.reload("data-v-c8d26704", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1440)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(191),
  /* template */
  __webpack_require__(1164),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/p.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] p.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c8b63802", Component.options)
  } else {
    hotAPI.reload("data-v-c8b63802", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1439)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(192),
  /* template */
  __webpack_require__(1163),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/q.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] q.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c89a0900", Component.options)
  } else {
    hotAPI.reload("data-v-c89a0900", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1316)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(193),
  /* template */
  __webpack_require__(1041),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/q1.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] q1.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4a93f33e", Component.options)
  } else {
    hotAPI.reload("data-v-4a93f33e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1438)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(194),
  /* template */
  __webpack_require__(1162),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/r.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] r.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c87dd9fe", Component.options)
  } else {
    hotAPI.reload("data-v-c87dd9fe", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1437)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(195),
  /* template */
  __webpack_require__(1161),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/s.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] s.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c861aafc", Component.options)
  } else {
    hotAPI.reload("data-v-c861aafc", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1436)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(196),
  /* template */
  __webpack_require__(1160),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/t.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] t.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c8457bfa", Component.options)
  } else {
    hotAPI.reload("data-v-c8457bfa", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1435)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(197),
  /* template */
  __webpack_require__(1159),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/u.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] u.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c8294cf8", Component.options)
  } else {
    hotAPI.reload("data-v-c8294cf8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1434)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(198),
  /* template */
  __webpack_require__(1158),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/v.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] v.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c80d1df6", Component.options)
  } else {
    hotAPI.reload("data-v-c80d1df6", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1298)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(199),
  /* template */
  __webpack_require__(1022),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/v1.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] v1.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-39837d08", Component.options)
  } else {
    hotAPI.reload("data-v-39837d08", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1433)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(200),
  /* template */
  __webpack_require__(1157),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/w.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] w.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c7f0eef4", Component.options)
  } else {
    hotAPI.reload("data-v-c7f0eef4", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1295)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(201),
  /* template */
  __webpack_require__(1019),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/w1.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] w1.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3619cbca", Component.options)
  } else {
    hotAPI.reload("data-v-3619cbca", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1294)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(202),
  /* template */
  __webpack_require__(1018),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/w2.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] w2.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-35fd9cc8", Component.options)
  } else {
    hotAPI.reload("data-v-35fd9cc8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1432)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(204),
  /* template */
  __webpack_require__(1156),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/x.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] x.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c7d4bff2", Component.options)
  } else {
    hotAPI.reload("data-v-c7d4bff2", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1431)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(205),
  /* template */
  __webpack_require__(1155),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/y.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] y.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c7b890f0", Component.options)
  } else {
    hotAPI.reload("data-v-c7b890f0", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1273)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(206),
  /* template */
  __webpack_require__(997),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/y1.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] y1.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2f46694e", Component.options)
  } else {
    hotAPI.reload("data-v-2f46694e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1272)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(207),
  /* template */
  __webpack_require__(996),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/y2.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] y2.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2f2a3a4c", Component.options)
  } else {
    hotAPI.reload("data-v-2f2a3a4c", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1430)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(208),
  /* template */
  __webpack_require__(1154),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/z.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] z.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c79c61ee", Component.options)
  } else {
    hotAPI.reload("data-v-c79c61ee", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1269)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(209),
  /* template */
  __webpack_require__(992),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/z1.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] z1.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2bdcb810", Component.options)
  } else {
    hotAPI.reload("data-v-2bdcb810", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1268)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(210),
  /* template */
  __webpack_require__(991),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/z2.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] z2.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2bc0890e", Component.options)
  } else {
    hotAPI.reload("data-v-2bc0890e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1281)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(211),
  /* template */
  __webpack_require__(1005),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-numbers/0.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 0.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3435b3a9", Component.options)
  } else {
    hotAPI.reload("data-v-3435b3a9", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1282)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(212),
  /* template */
  __webpack_require__(1006),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-numbers/1.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 1.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3443cb2a", Component.options)
  } else {
    hotAPI.reload("data-v-3443cb2a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1283)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(213),
  /* template */
  __webpack_require__(1007),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-numbers/2.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 2.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3451e2ab", Component.options)
  } else {
    hotAPI.reload("data-v-3451e2ab", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1284)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(214),
  /* template */
  __webpack_require__(1008),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-numbers/3.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 3.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-345ffa2c", Component.options)
  } else {
    hotAPI.reload("data-v-345ffa2c", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1285)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(215),
  /* template */
  __webpack_require__(1009),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-numbers/4.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 4.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-346e11ad", Component.options)
  } else {
    hotAPI.reload("data-v-346e11ad", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1286)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(216),
  /* template */
  __webpack_require__(1010),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-numbers/5.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 5.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-347c292e", Component.options)
  } else {
    hotAPI.reload("data-v-347c292e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1287)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(217),
  /* template */
  __webpack_require__(1011),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-numbers/6.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 6.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-348a40af", Component.options)
  } else {
    hotAPI.reload("data-v-348a40af", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1288)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(218),
  /* template */
  __webpack_require__(1012),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-numbers/7.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 7.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-34985830", Component.options)
  } else {
    hotAPI.reload("data-v-34985830", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1289)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(219),
  /* template */
  __webpack_require__(1013),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-numbers/8.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 8.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-34a66fb1", Component.options)
  } else {
    hotAPI.reload("data-v-34a66fb1", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1290)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(220),
  /* template */
  __webpack_require__(1014),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-numbers/9.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 9.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-34b48732", Component.options)
  } else {
    hotAPI.reload("data-v-34b48732", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./404.vue": 98,
	"./animation/rotate/01.vue": 707,
	"./animation/rotate/loading.vue": 708,
	"./box-model/border/border-image/01.vue": 709,
	"./box-model/border/border-image/02.vue": 710,
	"./box-model/border/border-image/03.vue": 711,
	"./box-model/border/border-image/04.vue": 712,
	"./box-model/border/border-width/01.vue": 713,
	"./box-model/clip-path/01.vue": 714,
	"./box-model/clip/01.vue": 715,
	"./box-model/clip/circle.vue": 716,
	"./box-model/clip/reverse-clip-path-with-blend-modes.vue": 717,
	"./box-model/padding/left.vue": 718,
	"./element/a/01.vue": 719,
	"./element/a/02.vue": 720,
	"./element/dialog/01.vue": 721,
	"./element/dialog/02.vue": 722,
	"./element/image/image-set.vue": 723,
	"./element/image/sizes.vue": 724,
	"./element/image/srcset.vue": 725,
	"./element/image/usemap.vue": 726,
	"./element/li/01.vue": 727,
	"./element/progress/01.vue": 728,
	"./element/video/01.vue": 729,
	"./element/video/gif.vue": 730,
	"./element/video/mse.vue": 731,
	"./flex/01.vue": 732,
	"./flex/02.vue": 733,
	"./form/autocomplete/01.vue": 734,
	"./form/cancel-button/01.vue": 735,
	"./form/checkbox/01.vue": 736,
	"./form/checkbox/02.vue": 737,
	"./form/checkbox/03.vue": 738,
	"./form/cursor/01.vue": 739,
	"./form/input/file.vue": 740,
	"./form/input/number.vue": 741,
	"./form/spellcheck/01.vue": 742,
	"./formatting-model/align/vertical-align.vue": 743,
	"./formatting-model/column/column-count.vue": 744,
	"./formatting-model/shape/circle.vue": 745,
	"./formatting-model/shape/polygon.vue": 746,
	"./grid/01.vue": 747,
	"./grid/02.vue": 748,
	"./index.vue": 749,
	"./instances/button/01.vue": 750,
	"./instances/creative/animated-book.vue": 751,
	"./instances/creative/animated-weather-icons.vue": 752,
	"./instances/creative/float-center.vue": 753,
	"./instances/creative/heart-beat.vue": 754,
	"./instances/creative/hexagon.vue": 755,
	"./instances/creative/no-js-slider.vue": 756,
	"./instances/creative/rating.vue": 757,
	"./instances/creative/ribbon/alphabet.vue": 758,
	"./instances/creative/ribbon/card.vue": 759,
	"./instances/creative/ribbon/ignore-alphabets/a.vue": 28,
	"./instances/creative/ribbon/ignore-alphabets/a1.vue": 29,
	"./instances/creative/ribbon/ignore-alphabets/a2.vue": 30,
	"./instances/creative/ribbon/ignore-alphabets/b.vue": 31,
	"./instances/creative/ribbon/ignore-alphabets/c.vue": 32,
	"./instances/creative/ribbon/ignore-alphabets/d.vue": 33,
	"./instances/creative/ribbon/ignore-alphabets/d1.vue": 34,
	"./instances/creative/ribbon/ignore-alphabets/d2.vue": 35,
	"./instances/creative/ribbon/ignore-alphabets/d3.vue": 36,
	"./instances/creative/ribbon/ignore-alphabets/d4.vue": 37,
	"./instances/creative/ribbon/ignore-alphabets/e.vue": 38,
	"./instances/creative/ribbon/ignore-alphabets/f.vue": 39,
	"./instances/creative/ribbon/ignore-alphabets/g.vue": 40,
	"./instances/creative/ribbon/ignore-alphabets/h.vue": 41,
	"./instances/creative/ribbon/ignore-alphabets/i.vue": 42,
	"./instances/creative/ribbon/ignore-alphabets/j.vue": 43,
	"./instances/creative/ribbon/ignore-alphabets/k.vue": 44,
	"./instances/creative/ribbon/ignore-alphabets/l.vue": 45,
	"./instances/creative/ribbon/ignore-alphabets/m.vue": 46,
	"./instances/creative/ribbon/ignore-alphabets/m1.vue": 47,
	"./instances/creative/ribbon/ignore-alphabets/m2.vue": 48,
	"./instances/creative/ribbon/ignore-alphabets/m3.vue": 99,
	"./instances/creative/ribbon/ignore-alphabets/n.vue": 49,
	"./instances/creative/ribbon/ignore-alphabets/n1.vue": 100,
	"./instances/creative/ribbon/ignore-alphabets/o.vue": 50,
	"./instances/creative/ribbon/ignore-alphabets/p.vue": 51,
	"./instances/creative/ribbon/ignore-alphabets/q.vue": 52,
	"./instances/creative/ribbon/ignore-alphabets/q1.vue": 53,
	"./instances/creative/ribbon/ignore-alphabets/r.vue": 54,
	"./instances/creative/ribbon/ignore-alphabets/s.vue": 55,
	"./instances/creative/ribbon/ignore-alphabets/t.vue": 56,
	"./instances/creative/ribbon/ignore-alphabets/u.vue": 57,
	"./instances/creative/ribbon/ignore-alphabets/v.vue": 58,
	"./instances/creative/ribbon/ignore-alphabets/v1.vue": 59,
	"./instances/creative/ribbon/ignore-alphabets/w.vue": 60,
	"./instances/creative/ribbon/ignore-alphabets/w1.vue": 61,
	"./instances/creative/ribbon/ignore-alphabets/w2.vue": 62,
	"./instances/creative/ribbon/ignore-alphabets/w3.vue": 101,
	"./instances/creative/ribbon/ignore-alphabets/x.vue": 63,
	"./instances/creative/ribbon/ignore-alphabets/y.vue": 64,
	"./instances/creative/ribbon/ignore-alphabets/y1.vue": 65,
	"./instances/creative/ribbon/ignore-alphabets/y2.vue": 66,
	"./instances/creative/ribbon/ignore-alphabets/z.vue": 67,
	"./instances/creative/ribbon/ignore-alphabets/z1.vue": 68,
	"./instances/creative/ribbon/ignore-alphabets/z2.vue": 69,
	"./instances/creative/ribbon/ignore-numbers/0.vue": 70,
	"./instances/creative/ribbon/ignore-numbers/1.vue": 71,
	"./instances/creative/ribbon/ignore-numbers/2.vue": 72,
	"./instances/creative/ribbon/ignore-numbers/3.vue": 73,
	"./instances/creative/ribbon/ignore-numbers/4.vue": 74,
	"./instances/creative/ribbon/ignore-numbers/5.vue": 75,
	"./instances/creative/ribbon/ignore-numbers/6.vue": 76,
	"./instances/creative/ribbon/ignore-numbers/7.vue": 77,
	"./instances/creative/ribbon/ignore-numbers/8.vue": 78,
	"./instances/creative/ribbon/ignore-numbers/9.vue": 79,
	"./instances/creative/ribbon/ignore-ribbon-alphabet.vue": 18,
	"./instances/creative/ribbon/ignore-ribbon-sharp.vue": 102,
	"./instances/creative/ribbon/ignore-ribbon-square.vue": 103,
	"./instances/creative/ribbon/name.vue": 760,
	"./instances/creative/tai-chi-animate.vue": 761,
	"./instances/creative/tai-chi.vue": 762,
	"./instances/creative/text-animation.vue": 763,
	"./instances/css-doodle/01.vue": 764,
	"./instances/css-doodle/02.vue": 765,
	"./instances/css-doodle/03.vue": 766,
	"./instances/css-doodle/04.vue": 767,
	"./instances/css-doodle/05.vue": 768,
	"./instances/css-doodle/06.vue": 769,
	"./instances/css-doodle/07.vue": 770,
	"./instances/loader/01.vue": 771,
	"./instances/loader/02.vue": 772,
	"./instances/loader/03.vue": 773,
	"./instances/others/accordion.vue": 774,
	"./instances/others/ant-line.vue": 775,
	"./instances/others/callout.vue": 776,
	"./instances/others/color.vue": 777,
	"./instances/others/fading.vue": 778,
	"./instances/others/get-style.vue": 779,
	"./instances/others/lavalamp-menu.vue": 780,
	"./instances/others/photo-frame.vue": 781,
	"./instances/others/search.vue": 782,
	"./instances/others/suspend-bar.vue": 783,
	"./instances/others/typing-01.vue": 784,
	"./instances/others/typing-02.vue": 785,
	"./instances/show-more/01.vue": 786,
	"./instances/show-more/02.vue": 787,
	"./instances/show-more/03.vue": 788,
	"./pointer-events/pointer-events/01.vue": 789,
	"./pointer-events/touch-action/01.vue": 790,
	"./selector/after/01.vue": 791,
	"./selector/attr/01.vue": 792,
	"./selector/attr/02.vue": 793,
	"./selector/before/attr.vue": 794,
	"./selector/before/border-corner-shape.vue": 795,
	"./selector/before/broken-image.vue": 796,
	"./selector/before/counter.vue": 797,
	"./selector/before/input.vue": 798,
	"./selector/before/jiu-gong.vue": 799,
	"./selector/before/pointer-events.vue": 800,
	"./selector/before/quotes.vue": 801,
	"./selector/before/scalable-table.vue": 802,
	"./selector/blank/01.vue": 803,
	"./selector/custom-properties/var.vue": 804,
	"./selector/default/01.vue": 805,
	"./selector/empty/01.vue": 806,
	"./selector/first-letter/01.vue": 807,
	"./selector/first-line/01.vue": 808,
	"./selector/focus-visible/01.vue": 809,
	"./selector/focus-within/01.vue": 810,
	"./selector/form/password.vue": 811,
	"./selector/function/clamp.vue": 812,
	"./selector/function/max.vue": 813,
	"./selector/function/min.vue": 814,
	"./selector/indeterminate/01.vue": 815,
	"./selector/matches/01.vue": 816,
	"./selector/placeholder-shown/01.vue": 817,
	"./selector/read-only/01.vue": 818,
	"./selector/read-write/01.vue": 819,
	"./selector/selection/01.vue": 820,
	"./selector/specificity/01.vue": 821,
	"./selector/user-invalid/01.vue": 822,
	"./table/table-layout/01.vue": 823,
	"./transform/perspective/01.vue": 824,
	"./transform/rotate/pie.vue": 825,
	"./transform/rotateX/01.vue": 826,
	"./transform/rotateX/02.vue": 827,
	"./transform/rotateY/01.vue": 828,
	"./transform/rotateY/02.vue": 829,
	"./transform/rotateZ/hamburger-menu.vue": 830,
	"./transform/scaleX/underline-animation.vue": 831,
	"./transform/skew/parallelogram.vue": 832,
	"./transform/translate3d/01.vue": 833,
	"./typographic/font/font-family.vue": 834,
	"./typographic/font/font-size.vue": 835,
	"./typographic/font/font-smoothing.vue": 836,
	"./typographic/text-decoration/01.vue": 837,
	"./typographic/text-decoration/02.vue": 838,
	"./typographic/text-effect/blurry-text.vue": 839,
	"./typographic/text-effect/flash-light.vue": 840,
	"./typographic/text-effect/glitch.vue": 841,
	"./typographic/text-effect/image-text.vue": 842,
	"./typographic/text-effect/tear-paper.vue": 843,
	"./typographic/text-effect/text-outline.vue": 844,
	"./typographic/text-shadow/01.vue": 845,
	"./typographic/text-shadow/02.vue": 846,
	"./typographic/text-shadow/03.vue": 847,
	"./typographic/text-shadow/04.vue": 848,
	"./typographic/text/text-align-justify.vue": 849,
	"./typographic/text/text-align.vue": 850,
	"./typographic/text/text-fill-color.vue": 851,
	"./typographic/text/text-stroke.vue": 852,
	"./typographic/text/text-transform.vue": 853,
	"./typographic/text/writing-mode.vue": 854,
	"./typographic/wrap/line-clamp-01.vue": 855,
	"./typographic/wrap/line-clamp-02.vue": 856,
	"./typographic/wrap/overflow-wrap.vue": 857,
	"./visual/background-attachment/01.vue": 858,
	"./visual/background-blend-mode/01.vue": 859,
	"./visual/background-clip/01.vue": 860,
	"./visual/background-clip/02.vue": 861,
	"./visual/background-clip/03.vue": 862,
	"./visual/background-clip/04.vue": 863,
	"./visual/background-color/01.vue": 864,
	"./visual/background-image/01.vue": 865,
	"./visual/background-position/01.vue": 866,
	"./visual/background-repeat/01.vue": 867,
	"./visual/background-size/chessboard.vue": 868,
	"./visual/background/01.vue": 869,
	"./visual/border-radius/01.vue": 870,
	"./visual/border-radius/infinity.vue": 871,
	"./visual/border-radius/wave.vue": 872,
	"./visual/box-reflect/01.vue": 873,
	"./visual/box-shadow/01.vue": 874,
	"./visual/box-shadow/animate.vue": 875,
	"./visual/box-shadow/bulb.vue": 876,
	"./visual/box-shadow/emphasize.vue": 877,
	"./visual/box-shadow/loading.01.vue": 878,
	"./visual/box-shadow/loading.02.vue": 879,
	"./visual/box-shadow/mars.vue": 880,
	"./visual/box-shadow/monalisa.vue": 881,
	"./visual/box-shadow/moon.vue": 882,
	"./visual/box-shadow/multi-border.vue": 883,
	"./visual/box-shadow/oneside.vue": 884,
	"./visual/box-shadow/pointer-events.vue": 885,
	"./visual/conic-gradient/01.vue": 886,
	"./visual/conic-gradient/chessboard.vue": 887,
	"./visual/conic-gradient/circle.vue": 888,
	"./visual/cursor/01.vue": 889,
	"./visual/drop-shadow/01.vue": 890,
	"./visual/drop-shadow/02.vue": 891,
	"./visual/filter/01.vue": 892,
	"./visual/filter/all-effects.vue": 893,
	"./visual/filter/alpha.vue": 894,
	"./visual/filter/drop-shadow.vue": 895,
	"./visual/filter/frosted-glass.vue": 896,
	"./visual/filter/fusion.vue": 897,
	"./visual/filter/gradient-shadow.vue": 898,
	"./visual/filter/svg-filter.vue": 899,
	"./visual/linear-gradient/01.vue": 900,
	"./visual/linear-gradient/02.vue": 901,
	"./visual/linear-gradient/03.vue": 902,
	"./visual/linear-gradient/04.vue": 903,
	"./visual/linear-gradient/animation-01.vue": 904,
	"./visual/linear-gradient/animation-02.vue": 905,
	"./visual/linear-gradient/circle.vue": 906,
	"./visual/linear-gradient/flash-image-effect.vue": 907,
	"./visual/mask-image/01.vue": 908,
	"./visual/mask-image/02.vue": 909,
	"./visual/mix-blend-mode/01.vue": 910,
	"./visual/outline/01.vue": 911,
	"./visual/outline/outline-offset.vue": 912,
	"./visual/outline/outline-radius.vue": 913,
	"./visual/outline/outline-style.vue": 914,
	"./visual/radial-gradient/01.vue": 915,
	"./visual/radial-gradient/02.vue": 916,
	"./visual/radial-gradient/03.vue": 917,
	"./visual/radial-gradient/sunset.vue": 918,
	"./visual/repeating-linear-gradient/01.vue": 919,
	"./visual/visibility/01.vue": 920
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 80;

/***/ }),
/* 81 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(393);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(22);
var document = __webpack_require__(9).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 84 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(9);
var core = __webpack_require__(12);
var ctx = __webpack_require__(82);
var hide = __webpack_require__(15);
var has = __webpack_require__(14);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(16).f;
var has = __webpack_require__(14);
var TAG = __webpack_require__(7)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(12);
var global = __webpack_require__(9);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(87) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(399);
var defined = __webpack_require__(21);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(26);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(21);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 93 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.5.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2020-05-04T22:49Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.5.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( _i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.5
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2020-03-14
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem.namespaceURI,
		docElem = ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
					dataPriv.get( this, "events" ) || Object.create( null )
				)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();
						return result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px";
				tr.style.height = "1px";
				trChild.style.height = "9px";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = parseInt( trStyle.height ) > 3;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = (
					dataPriv.get( cur, "events" ) || Object.create( null )
				)[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script
			if ( !isSuccess && jQuery.inArray( "script", s.dataTypes ) > -1 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			if ( typeof props.top === "number" ) {
				props.top += "px";
			}
			if ( typeof props.left === "number" ) {
				props.left += "px";
			}
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
		return jQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),
/* 95 */,
/* 96 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM0NjI2QjFFOTYzQTExRTRBRTY4OUJFRTFCMUI0NzY0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM0NjI2QjFGOTYzQTExRTRBRTY4OUJFRTFCMUI0NzY0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzQ2MjZCMUM5NjNBMTFFNEFFNjg5QkVFMUIxQjQ3NjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzQ2MjZCMUQ5NjNBMTFFNEFFNjg5QkVFMUIxQjQ3NjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz58lLogAAAHbklEQVR42txaaWxUVRR+85yWUkCKCKHuiEYom0tQqqiEsAQLES1KguBGFCLIoiguSKNAxCUi4haNgrjAD0UN0KgFFwQr0KCsWgVDWWwUYmuR0g3G78h3w+Hy3syb6bQlnuSjzJv35t7vnv3MhCKRiBNUnts8weuyCzQDLgauBLoDnYBzgDZAKu+rAcqBvcBOYCuwHigGqoGjsdZ/qMfLvu+FncQkxA1eAtwMDCWBlBjPnQf0UK/rSGgF8BHwE0lF4t1QIkSaA72A8STQ3ElcZP1LiakkNJ+aqmwQIjArufdC4DFgNE3KljqFKuBvnrBD82sNpHHdsLV+M2pX8AEwG/iFn5UcIiDRCn9uAWYBmdbbR3h6pcAaYB2wHdgFlKmNyFoZNK9u9Kc+wNnUqt7LSGAA8ASwhAdSPyIgIRt/BJjoQeAAsBp4H1gJHIryUdV8fx9QCLxJAv2A24C+QDu1J/n/6zS7WXwuMSIgcQH+vERf0CInXSC3AEX18JHD9AtBT+BhYBDQVt0zjiZ9H6Odd/TxC78kIafWX12WEPkzT2ix0zAiPvIk0AU4TV0XzY9BCN4RmAhIdCCJIepyLfAFMCnaySRJxI/mATeoPORw/btBZp9XMvNy7EctEjX0gxGNQEJkN9dayOhnZCAwA3tsHZUIbnAZnSZaTi3hcEwMZ062yOGNJZladf1eCQ7cq69GLgKeVq/F7j4TR4M6jzpNI3Koy61sP5s+dDIRMEyjSbVX70vJMAUkDjtNJ6KNycAWdS2DJtbcSyOXA3eo11LgzQSJX52mF/GZPOAvde1WIPsEImAmkWEKi0FjUgUgsSSOxTISqN0ksKQHvPcTIN+qkqfQkpww/hNiFauTnmTsOQEXkFB9E9CVJ/cpS/NYBAbxRKvoh4UB6qpnmNc68PVgWRccNhrTGs6izUSpNdDGxgAkzgCmA6+yGpaFpGnoGOUZSXJ3AYuAB1iELmLdFYrRj0jJ/xX3aD5rhG6KtDbkhBYE1MYVDIda+psP95HzJalZ5b9UEaNYHceSBVaJnyOf5bKz66bekKz5ZRw2nuLjL37S1srW+nqQ3mY1TdiE485iXkLkKrUZsdG1UGHQxCd112brmvjXd1GekSj4g8f1b6yo5Gde1SRTpwJW7zBbVN0YfR9H1Cmmj0jVei5JvEfn9RMJ63Np0j25ZgH7juqA6xbSz4wCuoc5KNDlyLY4iMj9y5issoA9VuLykyL61mXcfKFy4CCyjYkyzVQkYZ6kkUp2dvHKrgSeEzNalWCCLAEO0kdFMl3LMSuCtJWngPxj7bOFa0WQaqvSPFUlwurYRK4U1/mfiGtpoFk9hnaNKWZAaCqBOpeDBCOnB8yueliXLEmJ496W1j4PCZG96kI6S4hYIvfdzs5xVBJIDOcw405x3IA9fSv1ulTM6DeroOvKuB6r4p3IWqsjk+iOBEl0ZELtxXJjLbN/NMmyNLjTtUoMIdY7wOIHVamexclKfVrZnqpSqAjwTLY1KtoiRNYrhxci16C+j6XeA6xCy3kyo1mSxyuTaE6pPBwZQe2PMTSUe69VQUkarUIhIoPi7epemcVeHyCOy5z3Rb5uzZprjtXz+0l7DjlmqIQsc6yvndjfk/Rh2R9SRei2MPuP5Uq96Tyl/BgfKM/JVwCZHNu0oVay+exKHtIhFeGkZRjAHiJbJeO3eChVAQ7BDggybq0MPbtpfIgkNih1/SmtKErmHy21en3wmcCDdFhX1Wwl/JwK1bu0Z1RsoczieWJ/ABKdWZ+dpSwjG/tc5+KfCMc+y9QDMgmfFtDOD3DOlMuRptFqF5roUKIvA4Mhsco5/lXF/oBrTVP9usjnJli5qlmZa2XOgdBAbhxFnEw57gFudI5N8CWEl9K05P0/GFhecY4NqmVyuZROHkTEHIdYI6wXjDnqcmQDE9xINVjIA5kiEC2JY/60m91eG55+Gg+miqTKGO3iETGlmTRjIx+zm/2vcDxhGo9Nizl86xz/fiLC8c4IPFDj4yONUVct5kAupCygD/a0yWvSaBLS49aH5DA6NZVIWB5mjYqm253sSd+PcGQv+WCcFWpl9nQ/+4DG0sQ8+pKeRi6UMA9tlEUlQjJik29zGmikhvlmMnvzhpRMBp9hanBoJi2jQWKPVz/iNXL5HX8mcOxiJJURaQUXaCjJ4Rq5FgkpTMd5kfDViNKMTFheYza2c0c+E9mWJBGQHDOVIbadx8xrLEgUR+sQow3DdnJ+9IZHNh/JhPQuiaYksHkJ//1YgBawt7FJvMOiNOpgPBTkRzUMALLxp6xYboZ6lcwfYorrGFFKGCaPqENrxaYoixPO61gApnu02OLMeRz4lfFg60eEZFJY60xnTPeSWhI7QhLlanqYykq3pXP85xt+WlzK0mWrnikkhQjJhHh6VzMUDw4wrIiocBpNjtJU51OzlY71K6Fk/swpwjJjFfuR7owuOSwSXZ98EG3zxQwcHwKbnIC/3aovEb2Bw6zPiug7xu7l91idmAtaKvOp5SGUck6wWfmTOf1IoiHvXwEGANHpH4vhXIxDAAAAAElFTkSuQmCC"

/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAMAAAAJixmgAAAAM1BMVEUAAAD////v7+/f39/Pz8+/v7+vr6+fn5+Pj49/f39vb29fX19PT08/Pz8vLy8fHx8PDw8au9cPAAAACXBIWXMAAG66AABuugHW3rEXAAAIT0lEQVR42u2da2OrIAyGI4gIyOX//9rTtVtP1wpyCa5Q8nWzvo9gEgICTB9mMIAH8AAewAN4AA/gATyAB/AAHsADeAAP4AE8gAfwqxGuDFzNKE7TrqWP15ImgNkGv2xj51z7R8CzhhfTkbLZ3rXzewNL2DVZ+9o/AiYGPGZIzWv/CtivGcAddM3Z+a9FJYZzeC/EQdXEha7FJEYE1gC5qsPP6uK63hFYwIHJZH/138T7AVM4NG90YsfX0rcD1seidY1r/wo4opG8TVxy7Z8BqxjR2/61W8y16s2A51Vol/cmHr/9Tot1fjsv/SV9keH4wveu4uFoJheKqRF9tET45tL6pf9tcBVGiFUKAIvyMJu9/zY+2qWlisey74l2Jez6t6WSsHolHrLaXGC7kmqyqta0mMoBVqympspFPCJsGrAVpK6i+lXLRccD66W6nCJgylZxNRbshfTutN3en+9/VMGAy9jtXiub/wSYrr/jrd0EO3Rg2j90CDkqJrbfb4Ze6cnAbH+Ao/0Z4NWBSd9g2O+o5tVzq+VEYBZIIK2cvTmY2RW5GG8+NUsbuBM7CZgcjW7sipL90tUejb7IGcCzixkI8lJcHjNodKw+MIc4c7Kgmal0kbfhtYFjeUvy4WVLuAmvC5zCm5cUk8M3t4wYavIeZxP+HKUWcRLwDDmmoxVxnXWDuRYwsZBnVkQ0MxXZP08qAW+Qb0cObCn68TrACxRZoGSzZLy5v2ypAUwKRd2Kci99m3KF8MOkArAEFHNaCc6uxoXSDudXJT4whbc2ig6s3htYYQO/eQPHNzH00cDxTQydNHB0E8OpLrqmSUxg4t4fODIWxwELaMAEHnALDewpeucBc2jCOBqwbQPYYgE30sBxTRwDbFoB1jjADJoxhgKs2wHWGMAUGjKKAKxaAlblwE01cEQTQwfDhqT8ErrIKhOGENDDsOHR1kJg2xqwLQPm0JzxImDbHrApAWbQoLECYN0isM4HnqFJo9nAqk1glQtMoVEjmcCiVWCRB9xaVhlXvwwAr9Cs8Sxg2y6wzQHm0LCxDGDdMrBOB2bQtNFkYNU2sEoFptC4kURg0TqwSANuN+k4Sj6gw5gUTD6gu6TjoPIBPcakUPIB6AuF3zwyQZcxKZB8QIdJRzAyQZcxKRCZoM+Y5I9M0GdM8kcm6DQmeSMTdBqTvJEJeo1JvjETtD7lnxqZXoFdT8D2GJhDV7YcApu+gPUR8AydGT0AVr0ByzAwcb0BuzAwh+6MB4FNf8A6BDxDh0YDwKpHYOkH7s9lvbot6Nxlvbgt6Nxlvbgt6N1lPbst6HVg6BskQq8DQ98gEdD26XhnY7vAW7/Aag+YQMdGdoDXnoH5DrDpGVi/AlPo2ugLsOwbeH0Btn0D22fgGTq3+QlY9g4sn4Bd78D2N/AC8CF9Gjqu7ez2aUjo0XYTy21zt+V5h+s0M+LrR0RJqpOuxT4CR/To7Xn/PsozRxvmPnZhmch5WuYH4CMf7dmbn+TsvakKy6TZWuQDcPh/beAjEW5LeNOJC7TY/8DhrCN88gJJW1ltyqZni7TQO3Do/8zhVrdzimZWsmaoUMt6Bw78l4rYh4yo/AZOaeJSLeYHmEYMMsIWXTwQBR8blGsh38A8olCAtAMVy18Hh6CFfwNvxfeIJs4HxtCivoFdWR9K6dXZwCha7A14jouYKJsU5QIjaZmvwJ7nkXokLDH1nBaWlvUKvIVLBNE21wtLWFq2K7CLbQuM7T6zEg80Le4LeP9h2IxzX2JOCchJLRG1zBfgtTQKpMWmjMEDohZ+AVbBqmaa2UTiqKQUU4u6AJvisJeYJqYWADC1mAuwN+vMsMgZyLQSD6qWCZjHfedZhTlmXC0zcDQ3UWnhE64WDsJbG8ixCnOQuFoEbHh+scqcHLKWDTTma1PhJUbWosHhpHLVNktA1rKfRxccmYo+SXWKloIDgNE/XDxFy8cBz28EPI8WHsADOFnLx4WljhOPy9j0s1JLs5tLdzx40CA/a3goYf2sAsB6folHC/bdaJQJXfEl3tXCTi7ivR6mfrzgCLmIt1+mFVWC0v5p01RVCUzeMq08qxCvve6H6rMK8fICvJwz1eKC9fTVnTPVslyAySmTaeYgulBzymQa8c8P406XHq84Ck0zoWm5zQ/z+hPiovB5YWnhV2BSfckDL3UBWFrIbRWPqryoBWGFFY6Wn2VLrOZSIaTVXiha2HSw1hJFKscJbAha7mst/bdB6IwyrTPKii8GvwP7M6TiBZ0q1b8qqKXlYYF4yFuULdnV6RFU19LCH4ADdylalG1yciRTR8v3s4fjimb+snuXVa2groaWn3pvzLeHuR9WuMxpktnha3n59jC8DU/epzN1CkV5Wu7nIUJs1Tr946h1yrYVW8v/ej5ERMD7s036/E1NBaZwtTxkAxDjHXNMT0WGe1KM2dvWIugdS26RV4LDfPyP0aLSbkulvHFrkXMm1etsIObmqdhmtA7n30AMixiDF4/4d3Sssa8lDi8WcXhfSwxiLF4c4ufsB3+7ZTxeDOKXbA+wb2LohGjUYD98QL5JeTxCjMd7D3/3JI/8bVvUhG75O27IvYe/fxrPktetHZ8qGM8Us7/+x3eEWE4jazpVMaqxmncKnXuYehe3TtVsTW1k7V3PBpkFhKwKW4HvSnqTbd5hrRfkaBep6FTZaDSyCXqS8KHpE4u5jauPe0OO6djqYHEmHHamo+rJxsl0kmFogZj7LNLTt606j/aHWXlci5FLjBaIvRNbpX7Atlrd11udbZQJpR+wjZZr9CpjmD7MBvAAHsADeAAP4AE8gAfwAB7AA3gAD+ABPIAHcPP2D466nAWuE9WLAAAAAElFTkSuQmCC"

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(112),
  /* template */
  __webpack_require__(939),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/404.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] 404.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0aa08f8e", Component.options)
  } else {
    hotAPI.reload("data-v-0aa08f8e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1347)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(187),
  /* template */
  __webpack_require__(1071),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/m3.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] m3.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-58025a32", Component.options)
  } else {
    hotAPI.reload("data-v-58025a32", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1338)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(189),
  /* template */
  __webpack_require__(1062),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/n1.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] n1.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-54d106f8", Component.options)
  } else {
    hotAPI.reload("data-v-54d106f8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1293)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(203),
  /* template */
  __webpack_require__(1017),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-alphabets/w3.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] w3.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-35e16dc6", Component.options)
  } else {
    hotAPI.reload("data-v-35e16dc6", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1241)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(222),
  /* template */
  __webpack_require__(965),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-ribbon-sharp.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ignore-ribbon-sharp.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1c31daa5", Component.options)
  } else {
    hotAPI.reload("data-v-1c31daa5", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1305)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(223),
  /* template */
  __webpack_require__(1031),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/pages/instances/creative/ribbon/ignore-ribbon-square.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ignore-ribbon-square.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-410efc72", Component.options)
  } else {
    hotAPI.reload("data-v-410efc72", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = __webpack_require__(391);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _index = __webpack_require__(385);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotFound = function NotFound() {
    return Promise.resolve().then(__webpack_require__.bind(null, 98));
};

var files = __webpack_require__(80);

var dynamicRoutes = files.keys().map(function (key) {
    var component = files(key);
    var path = key.replace(/(\.\/|\.vue)/g, '').replace('/index', '');
    var route = {
        path: '/' + path,
        component: component
    };
    return route;
});

var pageRoutes = dynamicRoutes.map(function (i) {
    return i.path;
}).map(function (i) {
    return i.split('/');
}).filter(function (i) {
    return i.length > 2;
}).reduce(function (all, i) {
    if (!all.includes(i[1])) {
        all.push(i[1]);
    }
    return all;
}, []).map(function (i) {
    return {
        path: '/' + i,
        component: (0, _index2.default)(i)
    };
});

var routes = [{
    path: '/',
    redirect: '/index'
}].concat((0, _toConsumableArray3.default)(dynamicRoutes), (0, _toConsumableArray3.default)(pageRoutes), [{
    path: '*',
    component: NotFound
}]);

exports.default = routes;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _focus = __webpack_require__(386);

var _focus2 = _interopRequireDefault(_focus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var directives = {
    focus: _focus2.default
};

exports.default = directives;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _subfix = __webpack_require__(387);

var _subfix2 = _interopRequireDefault(_subfix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filters = {
    subfix: _subfix2.default
};

exports.default = filters;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1373)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(108),
  /* template */
  __webpack_require__(1099),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/caigua/caigua/css-cookbook/app/app.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] app.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6fa17aed", Component.options)
  } else {
    hotAPI.reload("data-v-6fa17aed", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_modules__ = __webpack_require__(706);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_modules___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_modules__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_categories__ = __webpack_require__(705);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_categories___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_categories__);
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            modules: [{
                name: 'animation',
                route: '/animation'
            }, {
                name: 'box model',
                route: '/box-model'
            }, {
                name: 'element',
                route: '/element'
            }, {
                name: 'Form',
                route: '/Form'
            }, {
                name: 'formatting model',
                route: '/formatting-model'
            }, {
                name: 'instances',
                route: '/instances'
            }, {
                name: 'pointer events',
                route: '/pointer-events'
            }, {
                name: 'selector',
                route: '/selector'
            }, {
                name: 'table',
                route: '/table'
            }, {
                name: 'transform',
                route: '/transform'
            }, {
                name: 'typographic',
                route: '/typographic'
            }, {
                name: 'visual',
                route: '/visual'
            }, {
                name: 'flex',
                route: '/flex'
            }, {
                name: 'grid',
                route: '/grid'
            }]
        };
    }
});

/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            dir: '',
            baseRoute: '',
            categories: []
        };
    },

    mounted() {
        this.baseRoute = `/${this.dir}`;
        this.getTableOfContents(this.dir);
    },

    methods: {
        getTableOfContents(name) {
            const files = __webpack_require__(80);

            const paths = files.keys().map(i => {
                const { alias } = files(i);
                return {
                    path: i.replace(/(\.\/|\.vue)/g, ''),
                    alias
                };
            }).filter(i => i.path.startsWith(name) && !i.path.includes('ignore')).map(i => ({
                alias: i.alias,
                path: i.path.replace(`${name}/`, '').split('/')
            }));

            const { categories } = this;

            paths.forEach(i => {
                this.createNode(i, categories);
            });
        },

        createNode(item, nodes) {
            const { path, alias } = item;
            const name = path.shift();
            const idx = nodes.findIndex(i => i.name === name);
            if (idx < 0) {
                nodes.push({
                    name,
                    alias: path.length === 0 ? alias : '',
                    childrens: []
                });
                if (path.length !== 0) {
                    this.createNode(item, nodes[nodes.length - 1].childrens);
                }
            } else {
                this.createNode(item, nodes[idx].childrens);
            }
        }
    }
});

/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



const categories = __WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    props: {
        baseRoute: {
            type: String,
            default: ''
        },

        categories: {
            type: Array,
            default: []
        }
    },

    methods: {
        isParent(c) {
            return c.childrens.length > 0;
        },

        getBaseRoute(c) {
            if (c.name) {
                return `${this.baseRoute}/${c.name}`;
            }
            return this.baseRoute;
        },

        getRoutePath(c) {
            return `${this.baseRoute}/${c.name}`;
        },

        getRouteName(c) {
            return c.alias || c.name;
        }
    }
});

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.component('categories', categories);

/* harmony default export */ __webpack_exports__["default"] = (categories);

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



const Modules = __WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    props: {
        modules: {
            type: Array,
            default: []
        }
    },
    data() {
        return {};
    },
    methods: {},
    mounted() {}
});

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.component('modules', Modules);

/* harmony default export */ __webpack_exports__["default"] = (Modules);

/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            option: {
                width: {
                    top: 26,
                    right: 26,
                    bottom: 26,
                    left: 26
                },
                outset: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                slice: {
                    top: 26,
                    right: 26,
                    bottom: 26,
                    left: 26
                },
                repeat: 'stretch'
            },
            directions: ['top', 'right', 'bottom', 'left'],
            boborderImageSliceOptions: {
                min: 0,
                max: 100
            },
            boborderImageWidthOptions: {
                min: 0,
                max: 100
            },
            boborderImageOutsetOptions: {
                min: 0,
                max: 26
            },
            boborderImageRepeatOptions: ['stretch', 'round', 'repeat', 'space', 'stretch round', 'stretch repeat', 'stretch space', 'round stretch', 'round repeat', 'round space', 'repeat stretch', 'repeat round', 'repeat space', 'space stretch', 'space round', 'space repeat']
        };
    },

    computed: {},

    methods: {
        getAttribute(attr, unit) {
            const {
                top,
                right,
                bottom,
                left
            } = this.option[attr];

            return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
        }
    }
});

/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 边框宽度可继承
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 背景裁切
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 渐变圆环
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 123 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 124 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// padding-left 百分比
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 125 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            isLogin: 0
        };
    },
    methods: {
        beforeSkip(evt, hasHref) {
            if (hasHref) {
                console.log('yes');
            } else {
                console.log('no');
                evt.preventDefault();

                if (+this.isLogin) {
                    // 方法1: window.open
                    // window.open('//baidu.com');

                    // 方法2: 创建 a 标签
                    // const a = document.createElement('a');
                    // a.href = '//baidu.com';
                    // a.target = '_blank';
                    // document.body.append(a);
                    // a.click();

                    // 如果有超过一秒的延时 (Chrome 提示：已拦截弹出式窗口)
                    setTimeout(function () {
                        window.open('//baidu.com');
                    }, 1001);
                } else {
                    alert('未登录');
                }
            }
        }
    }
});

/***/ }),
/* 126 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// footer notes
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            isShow: false,
            dialog: null
        };
    },
    methods: {
        init() {
            const main = document.getElementById('main');
            const dialog = document.createElement('dialog');
            dialog.innerText = 'This is a dialog !';

            this.dialog = dialog;
            main.appendChild(dialog);
        },
        toggle() {
            const { dialog } = this;
            this.isShow = !this.isShow;

            if (this.isShow) {
                dialog.show();
            } else {
                dialog.close();
            }
        }
    },
    mounted() {
        this.init();
    }
});

/***/ }),
/* 128 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    methods: {
        openDialog() {
            window.dialog.showModal();
        },
        closeDialog(event) {
            const rect = event.target.getBoundingClientRect();

            if (rect.left > event.clientX || rect.right < event.clientX || rect.top > event.clientY || rect.bottom < event.clientY) {
                window.dialog.close();
            }
        }
    }
});

/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 132 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    mounted() {
        this.getProgressPosition();
        this.getProgressLabels();
    },
    methods: {
        getProgressPosition() {
            const { position } = progress;
            console.log({ position }); // 50 / 100 === 0.5. 如果没有确定的 value, 那么 position 就是 1
        },
        getProgressLabels() {
            const { labels } = progress;
            console.log(labels);
        }
    }
});

/***/ }),
/* 135 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            src: 'http://www.caiguazai.com/796795205.mp4',
            video: {}
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.video = window.video;
            console.log('video', video);
        },
        toggleControls() {
            this.video.controls = !this.video.controls;
        },
        play() {
            this.video.play();
        },
        pause() {
            this.video.pause();
        }
    }
});

/***/ }),
/* 136 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//

// 用 img 播放 mp4 文件
/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            src: 'http://www.caiguazai.com/796795205.mp4'
        };
    }
});

/***/ }),
/* 137 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// Media Source Extensions
/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            src: 'http://www.caiguazai.com/796795205.mp4',
            video: null
        };
    },
    methods: {
        init() {
            this.video = window.video;

            const videoElement = document.querySelector('video');

            if (window.MediaSource) {
                const mediaSource = new MediaSource();
                videoElement.src = URL.createObjectURL(mediaSource);
                mediaSource.addEventListener('sourceopen', sourceOpen);
            } else {
                console.log("The Media Source Extensions API is not supported.");
            }

            function sourceOpen(e) {
                URL.revokeObjectURL(videoElement.src);

                const mime = 'video/webm; codecs="opus, vp9"';
                const mediaSource = e.target;
                const sourceBuffer = mediaSource.addSourceBuffer(mime);
                const videoUrl = 'droid.webm';

                fetch(videoUrl).then(response => {
                    return response.arrayBuffer();
                }).then(arrayBuffer => {
                    sourceBuffer.addEventListener('updateend', e => {
                        if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
                            mediaSource.endOfStream();
                        }
                    });

                    sourceBuffer.appendBuffer(arrayBuffer);
                });
            }
        }
    },
    mounted() {
        this.init();
    }
});

/***/ }),
/* 138 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    alias: '总览',

    data() {
        return {
            groups: [{
                className: 'flex-start',
                color: 'tomato',
                items: [1, 2, 3, 4, 5]
            }, {
                className: 'flex-end',
                color: 'gold',
                items: [1, 2, 3, 4, 5]
            }, {
                className: 'center',
                color: 'deepskyblue',
                items: [1, 2, 3, 4, 5]
            }, {
                className: 'space-between',
                color: 'lightgreen',
                items: [1, 2, 3, 4, 5]
            }, {
                className: 'space-around',
                color: 'hotpink',
                items: [1, 2, 3, 4, 5]
            }, {
                className: 'space-evenly',
                color: 'crimson',
                items: [1, 2, 3, 4, 5]
            }]
        };
    }
});

/***/ }),
/* 139 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    alias: 'order 排序',

    data() {
        return {
            list: [{
                name: '0',
                order: 0
            }, {
                name: '1',
                order: 1
            }, {
                name: '2',
                order: 2
            }, {
                name: '3',
                order: 1
            }]
        };
    }
});

/***/ }),
/* 140 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            articles: ['https://blog.niceue.com/front-end-development/Remove-forced-yellow-input-background-in-Chrome.html', 'http://stackoverflow.com/questions/2338102/override-browser-form-filling-and-input-highlighting-with-html-css', 'http://labs.enonic.com/articles/remove-forced-yellow-input-background-in-chrome']
        };
    },
    methods: {
        save() {}
    }
});

/***/ }),
/* 141 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 142 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            controls: [{
                type: 'checkbox',
                value: 1
            }, {
                type: 'checkbox',
                value: 2
            }, {
                type: 'radio',
                value: 1
            }, {
                type: 'radio',
                value: 2
            }]
        };
    }
});

/***/ }),
/* 143 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 144 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 145 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 146 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 147 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 148 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            a: 'xxxxx',
            b: 'yyyyy'
        };
    },
    methods: {
        select(e) {
            __WEBPACK_IMPORTED_MODULE_0_jquery___default()(e.target).select();
        }
    }
});

/***/ }),
/* 149 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 150 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            text: 'hello darkness my old friend, i have come to talk with you again.'
        };
    }
});

/***/ }),
/* 151 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            isShape: false
        };
    },
    methods: {
        toggleShape() {
            this.isShape = !this.isShape;
        }
    }
});

/***/ }),
/* 152 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            isShape: true
        };
    },
    methods: {
        toggleShape() {
            this.isShape = !this.isShape;
        }
    }
});

/***/ }),
/* 153 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    alias: '总览',

    data() {
        return {
            groups: [6, 6, 6, 6]
        };
    }
});

/***/ }),
/* 154 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    alias: '瀑布流',

    data() {
        return {
            count: 15
        };
    },

    methods: {
        getRandomHeight() {
            const height = `${Math.random() * 200 + 300}px`;
            return height;
        }
    }
});

/***/ }),
/* 155 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__images_blue_sky_jpg__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__images_blue_sky_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__images_blue_sky_jpg__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            preview1: __webpack_require__(5),
            preview2: __WEBPACK_IMPORTED_MODULE_0__images_blue_sky_jpg___default.a
        };
    }
});

/***/ }),
/* 156 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    alias: '3D 按钮'
});

/***/ }),
/* 157 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 158 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 159 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 两列排版的文章
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 160 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 161 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 六边形
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 162 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            images: ['https://lh3.googleusercontent.com/-PcDDGh9C6Uk/UUoRYu8TmGI/AAAAAAAAADk/bVCVnUEott4/s1231/2.jpeg.jpg', 'https://lh5.googleusercontent.com/-ImESS5vXwTQ/UUoRZtDDdwI/AAAAAAAAAD0/mBlvPxXMuDU/s1231/3.jpeg.jpg', 'https://lh3.googleusercontent.com/-a4HykmTjnLw/UUoRZ9AOzNI/AAAAAAAAAD8/bsVqg8naI2o/s1231/4.jpeg.jpg', 'https://lh5.googleusercontent.com/-lmIWz4ADxc0/UUoRaFjdNXI/AAAAAAAAAEI/widPZMMiBVM/s1231/5.jpeg.jpg']
        };
    },

    methods: {
        getSlider(value, step, total) {
            const index = (value + step + total) % total;
            return `no-js-slider-${index}`;
        }
    }
});

/***/ }),
/* 163 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            stars: new Array(5).fill(0).map((i, index) => index + 1).reverse()
        };
    }
});

/***/ }),
/* 164 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ignore_ribbon_alphabet__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ignore_ribbon_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ignore_ribbon_alphabet__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ignore_alphabets_a__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ignore_alphabets_a___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__ignore_alphabets_a__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ignore_alphabets_a1__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ignore_alphabets_a1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ignore_alphabets_a1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ignore_alphabets_a2__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ignore_alphabets_a2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__ignore_alphabets_a2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ignore_alphabets_b__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ignore_alphabets_b___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__ignore_alphabets_b__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ignore_alphabets_c__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ignore_alphabets_c___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__ignore_alphabets_c__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ignore_alphabets_d__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ignore_alphabets_d___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__ignore_alphabets_d__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ignore_alphabets_d1__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ignore_alphabets_d1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__ignore_alphabets_d1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ignore_alphabets_d2__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ignore_alphabets_d2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__ignore_alphabets_d2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ignore_alphabets_d3__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ignore_alphabets_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__ignore_alphabets_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ignore_alphabets_d4__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ignore_alphabets_d4___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__ignore_alphabets_d4__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ignore_alphabets_e__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ignore_alphabets_e___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__ignore_alphabets_e__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ignore_alphabets_f__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ignore_alphabets_f___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__ignore_alphabets_f__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ignore_alphabets_g__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ignore_alphabets_g___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__ignore_alphabets_g__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ignore_alphabets_h__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ignore_alphabets_h___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__ignore_alphabets_h__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ignore_alphabets_i__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ignore_alphabets_i___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__ignore_alphabets_i__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ignore_alphabets_j__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ignore_alphabets_j___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__ignore_alphabets_j__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ignore_alphabets_k__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ignore_alphabets_k___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__ignore_alphabets_k__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ignore_alphabets_l__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ignore_alphabets_l___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18__ignore_alphabets_l__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ignore_alphabets_m__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ignore_alphabets_m___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19__ignore_alphabets_m__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ignore_alphabets_m1__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ignore_alphabets_m1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20__ignore_alphabets_m1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ignore_alphabets_m2__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ignore_alphabets_m2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21__ignore_alphabets_m2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ignore_alphabets_m3__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ignore_alphabets_m3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22__ignore_alphabets_m3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ignore_alphabets_n__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ignore_alphabets_n___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_23__ignore_alphabets_n__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ignore_alphabets_n1__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ignore_alphabets_n1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_24__ignore_alphabets_n1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ignore_alphabets_o__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ignore_alphabets_o___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_25__ignore_alphabets_o__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ignore_alphabets_p__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ignore_alphabets_p___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_26__ignore_alphabets_p__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ignore_alphabets_q__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ignore_alphabets_q___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_27__ignore_alphabets_q__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ignore_alphabets_q1__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ignore_alphabets_q1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_28__ignore_alphabets_q1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ignore_alphabets_r__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ignore_alphabets_r___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_29__ignore_alphabets_r__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ignore_alphabets_s__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ignore_alphabets_s___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_30__ignore_alphabets_s__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__ignore_alphabets_t__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__ignore_alphabets_t___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_31__ignore_alphabets_t__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ignore_alphabets_u__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ignore_alphabets_u___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_32__ignore_alphabets_u__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ignore_alphabets_v__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ignore_alphabets_v___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_33__ignore_alphabets_v__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ignore_alphabets_v1__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ignore_alphabets_v1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_34__ignore_alphabets_v1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__ignore_alphabets_w__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__ignore_alphabets_w___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_35__ignore_alphabets_w__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__ignore_alphabets_w1__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__ignore_alphabets_w1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_36__ignore_alphabets_w1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__ignore_alphabets_w2__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__ignore_alphabets_w2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_37__ignore_alphabets_w2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__ignore_alphabets_w3__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__ignore_alphabets_w3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_38__ignore_alphabets_w3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__ignore_alphabets_x__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__ignore_alphabets_x___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_39__ignore_alphabets_x__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__ignore_alphabets_y__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__ignore_alphabets_y___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_40__ignore_alphabets_y__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__ignore_alphabets_y1__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__ignore_alphabets_y1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_41__ignore_alphabets_y1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__ignore_alphabets_y2__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__ignore_alphabets_y2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_42__ignore_alphabets_y2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__ignore_alphabets_z__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__ignore_alphabets_z___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_43__ignore_alphabets_z__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ignore_alphabets_z1__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ignore_alphabets_z1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_44__ignore_alphabets_z1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__ignore_alphabets_z2__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__ignore_alphabets_z2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_45__ignore_alphabets_z2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__ignore_numbers_0__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__ignore_numbers_0___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_46__ignore_numbers_0__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__ignore_numbers_1__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__ignore_numbers_1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_47__ignore_numbers_1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__ignore_numbers_2__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__ignore_numbers_2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_48__ignore_numbers_2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__ignore_numbers_3__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__ignore_numbers_3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_49__ignore_numbers_3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__ignore_numbers_4__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__ignore_numbers_4___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_50__ignore_numbers_4__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__ignore_numbers_5__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__ignore_numbers_5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_51__ignore_numbers_5__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__ignore_numbers_6__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__ignore_numbers_6___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_52__ignore_numbers_6__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__ignore_numbers_7__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__ignore_numbers_7___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_53__ignore_numbers_7__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__ignore_numbers_8__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__ignore_numbers_8___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_54__ignore_numbers_8__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__ignore_numbers_9__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__ignore_numbers_9___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_55__ignore_numbers_9__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


























































/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        RibbonAlphabet: __WEBPACK_IMPORTED_MODULE_0__ignore_ribbon_alphabet___default.a,
        AlphabetA: __WEBPACK_IMPORTED_MODULE_1__ignore_alphabets_a___default.a,
        AlphabetA1: __WEBPACK_IMPORTED_MODULE_2__ignore_alphabets_a1___default.a,
        AlphabetA2: __WEBPACK_IMPORTED_MODULE_3__ignore_alphabets_a2___default.a,
        AlphabetB: __WEBPACK_IMPORTED_MODULE_4__ignore_alphabets_b___default.a,
        AlphabetC: __WEBPACK_IMPORTED_MODULE_5__ignore_alphabets_c___default.a,
        AlphabetD: __WEBPACK_IMPORTED_MODULE_6__ignore_alphabets_d___default.a,
        AlphabetD1: __WEBPACK_IMPORTED_MODULE_7__ignore_alphabets_d1___default.a,
        AlphabetD2: __WEBPACK_IMPORTED_MODULE_8__ignore_alphabets_d2___default.a,
        AlphabetD3: __WEBPACK_IMPORTED_MODULE_9__ignore_alphabets_d3___default.a,
        AlphabetD4: __WEBPACK_IMPORTED_MODULE_10__ignore_alphabets_d4___default.a,
        AlphabetE: __WEBPACK_IMPORTED_MODULE_11__ignore_alphabets_e___default.a,
        AlphabetF: __WEBPACK_IMPORTED_MODULE_12__ignore_alphabets_f___default.a,
        AlphabetG: __WEBPACK_IMPORTED_MODULE_13__ignore_alphabets_g___default.a,
        AlphabetH: __WEBPACK_IMPORTED_MODULE_14__ignore_alphabets_h___default.a,
        AlphabetI: __WEBPACK_IMPORTED_MODULE_15__ignore_alphabets_i___default.a,
        AlphabetJ: __WEBPACK_IMPORTED_MODULE_16__ignore_alphabets_j___default.a,
        AlphabetK: __WEBPACK_IMPORTED_MODULE_17__ignore_alphabets_k___default.a,
        AlphabetL: __WEBPACK_IMPORTED_MODULE_18__ignore_alphabets_l___default.a,
        AlphabetM: __WEBPACK_IMPORTED_MODULE_19__ignore_alphabets_m___default.a,
        AlphabetM1: __WEBPACK_IMPORTED_MODULE_20__ignore_alphabets_m1___default.a,
        AlphabetM2: __WEBPACK_IMPORTED_MODULE_21__ignore_alphabets_m2___default.a,
        AlphabetM3: __WEBPACK_IMPORTED_MODULE_22__ignore_alphabets_m3___default.a,
        AlphabetN: __WEBPACK_IMPORTED_MODULE_23__ignore_alphabets_n___default.a,
        AlphabetN1: __WEBPACK_IMPORTED_MODULE_24__ignore_alphabets_n1___default.a,
        AlphabetO: __WEBPACK_IMPORTED_MODULE_25__ignore_alphabets_o___default.a,
        AlphabetP: __WEBPACK_IMPORTED_MODULE_26__ignore_alphabets_p___default.a,
        AlphabetQ: __WEBPACK_IMPORTED_MODULE_27__ignore_alphabets_q___default.a,
        AlphabetQ1: __WEBPACK_IMPORTED_MODULE_28__ignore_alphabets_q1___default.a,
        AlphabetR: __WEBPACK_IMPORTED_MODULE_29__ignore_alphabets_r___default.a,
        AlphabetS: __WEBPACK_IMPORTED_MODULE_30__ignore_alphabets_s___default.a,
        AlphabetT: __WEBPACK_IMPORTED_MODULE_31__ignore_alphabets_t___default.a,
        AlphabetU: __WEBPACK_IMPORTED_MODULE_32__ignore_alphabets_u___default.a,
        AlphabetV: __WEBPACK_IMPORTED_MODULE_33__ignore_alphabets_v___default.a,
        AlphabetV1: __WEBPACK_IMPORTED_MODULE_34__ignore_alphabets_v1___default.a,
        AlphabetW: __WEBPACK_IMPORTED_MODULE_35__ignore_alphabets_w___default.a,
        AlphabetW1: __WEBPACK_IMPORTED_MODULE_36__ignore_alphabets_w1___default.a,
        AlphabetW2: __WEBPACK_IMPORTED_MODULE_37__ignore_alphabets_w2___default.a,
        AlphabetW3: __WEBPACK_IMPORTED_MODULE_38__ignore_alphabets_w3___default.a,
        AlphabetX: __WEBPACK_IMPORTED_MODULE_39__ignore_alphabets_x___default.a,
        AlphabetY: __WEBPACK_IMPORTED_MODULE_40__ignore_alphabets_y___default.a,
        AlphabetY1: __WEBPACK_IMPORTED_MODULE_41__ignore_alphabets_y1___default.a,
        AlphabetY2: __WEBPACK_IMPORTED_MODULE_42__ignore_alphabets_y2___default.a,
        AlphabetZ: __WEBPACK_IMPORTED_MODULE_43__ignore_alphabets_z___default.a,
        AlphabetZ1: __WEBPACK_IMPORTED_MODULE_44__ignore_alphabets_z1___default.a,
        AlphabetZ2: __WEBPACK_IMPORTED_MODULE_45__ignore_alphabets_z2___default.a,
        Alphabet0: __WEBPACK_IMPORTED_MODULE_46__ignore_numbers_0___default.a,
        Alphabet1: __WEBPACK_IMPORTED_MODULE_47__ignore_numbers_1___default.a,
        Alphabet2: __WEBPACK_IMPORTED_MODULE_48__ignore_numbers_2___default.a,
        Alphabet3: __WEBPACK_IMPORTED_MODULE_49__ignore_numbers_3___default.a,
        Alphabet4: __WEBPACK_IMPORTED_MODULE_50__ignore_numbers_4___default.a,
        Alphabet5: __WEBPACK_IMPORTED_MODULE_51__ignore_numbers_5___default.a,
        Alphabet6: __WEBPACK_IMPORTED_MODULE_52__ignore_numbers_6___default.a,
        Alphabet7: __WEBPACK_IMPORTED_MODULE_53__ignore_numbers_7___default.a,
        Alphabet8: __WEBPACK_IMPORTED_MODULE_54__ignore_numbers_8___default.a,
        Alphabet9: __WEBPACK_IMPORTED_MODULE_55__ignore_numbers_9___default.a
    }
});

/***/ }),
/* 165 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 166 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 167 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (1 + this.widthTimes + 1) / 2 - 0.5;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },

        middleTimes() {
            return this.widthTimes / 2 - 0.5;
        }
    }
}));

/***/ }),
/* 168 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (this.widthTimes + 1) / 2;
            const height = (this.heightTimes + 1) / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 169 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 170 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 171 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 172 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 173 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 174 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 175 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 176 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 177 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 178 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 179 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 180 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 181 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 182 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = 1 + this.widthTimes + 1;
            const height = (1 + this.heightTimes + 1) / 2 - 0.5;

            return Math.atan(height / width) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 183 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 184 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (1 + this.widthTimes + 1) / 2 - 0.5;
            const height = (1 + this.heightTimes + 1) / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 185 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (1 + this.widthTimes + 1) / 2 - 0.5;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 186 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree1() {
            const width = (1 + this.widthTimes + 1) / 4 - 0.5;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },
        degree2() {
            const width = (1 + this.widthTimes + 1) / 4;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 187 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (1 + this.widthTimes + 1) / 2 - 0.5;
            const height = (1 + this.heightTimes + 1) / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 188 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = 1 + this.widthTimes + 1 - 1;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 189 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = 1 + this.widthTimes + 1 - 1;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 190 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 191 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 192 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = this.widthTimes / 2 - 0.25;
            const height = this.heightTimes / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 193 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = this.widthTimes / 2 - 0.25;
            const height = this.heightTimes / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 194 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (1 + this.widthTimes + 1) / 2 - 0.5;
            const height = (1 + this.heightTimes + 1) / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 195 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 196 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 197 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 198 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (this.widthTimes + 1) / 2;
            const height = (this.heightTimes + 1) / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 199 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (1 + this.widthTimes + 1) / 2 - 0.5;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 200 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (1 + this.widthTimes + 1) / 2;
            const height = (1 + this.heightTimes + 1) / 2 + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 201 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (1 + this.widthTimes + 1) / 2 - 0.5;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 202 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree1() {
            const width = (1 + this.widthTimes + 1) / 4 - 0.5;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        },
        degree2() {
            const width = (1 + this.widthTimes + 1) / 4;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 203 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (1 + this.widthTimes + 1) / 2;
            const height = (1 + this.heightTimes + 1) / 2 + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 204 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = 1 + this.widthTimes;
            const height = 1 + this.heightTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 205 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = (1 + this.widthTimes + 1) / 2 - 0.5;
            const height = (1 + this.heightTimes + 1) / 2;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 206 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 207 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 208 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = 1 + this.widthTimes;
            const height = this.heightTimes;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 209 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = 1 + this.widthTimes + 1;
            const height = 1 + this.heightTimes;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 210 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a],

    computed: {
        degree() {
            const width = 1 + this.heightTimes;
            const height = 1 + this.widthTimes + 1;

            return Math.atan(width / height) * 360 / (Math.PI * 2);
        }
    }
}));

/***/ }),
/* 211 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 212 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 213 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 214 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 215 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 216 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 217 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 218 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 219 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 220 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__base_alphabet__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__base_alphabet___default.a]
}));

/***/ }),
/* 221 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'ribbon-alphabet',

    props: {
        size: {
            type: Number,
            default: 12
        },
        widthTimes: {
            type: Number,
            default: 4
        },
        heightTimes: {
            type: Number,
            default: 8
        }
    }
});

/***/ }),
/* 222 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'ribbon-sharp',

    props: {
        size: {
            type: Number,
            default: 12
        },
        times: {
            type: Number,
            default: 0
        },
        color: {
            type: String,
            default: ''
        },
        zIndex: {
            type: Number,
            default: 0
        }
    }
});

/***/ }),
/* 223 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'ribbon-square',

    props: {
        size: {
            type: Number,
            default: 12
        },
        times: {
            type: Number,
            default: 1
        },
        color: {
            type: String,
            default: ''
        },
        zIndex: {
            type: Number,
            default: 0
        }
    }
});

/***/ }),
/* 224 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ignore_ribbon_alphabet__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ignore_ribbon_alphabet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ignore_ribbon_alphabet__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ignore_alphabets_a__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ignore_alphabets_a___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__ignore_alphabets_a__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ignore_alphabets_a1__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ignore_alphabets_a1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ignore_alphabets_a1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ignore_alphabets_a2__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ignore_alphabets_a2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__ignore_alphabets_a2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ignore_alphabets_b__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ignore_alphabets_b___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__ignore_alphabets_b__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ignore_alphabets_c__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ignore_alphabets_c___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__ignore_alphabets_c__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ignore_alphabets_d__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ignore_alphabets_d___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__ignore_alphabets_d__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ignore_alphabets_d1__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ignore_alphabets_d1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__ignore_alphabets_d1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ignore_alphabets_d2__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ignore_alphabets_d2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__ignore_alphabets_d2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ignore_alphabets_d3__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ignore_alphabets_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__ignore_alphabets_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ignore_alphabets_d4__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ignore_alphabets_d4___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__ignore_alphabets_d4__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ignore_alphabets_e__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ignore_alphabets_e___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__ignore_alphabets_e__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ignore_alphabets_f__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ignore_alphabets_f___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__ignore_alphabets_f__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ignore_alphabets_g__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ignore_alphabets_g___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__ignore_alphabets_g__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ignore_alphabets_h__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ignore_alphabets_h___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__ignore_alphabets_h__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ignore_alphabets_i__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ignore_alphabets_i___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__ignore_alphabets_i__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ignore_alphabets_j__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ignore_alphabets_j___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__ignore_alphabets_j__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ignore_alphabets_k__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ignore_alphabets_k___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__ignore_alphabets_k__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ignore_alphabets_l__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ignore_alphabets_l___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18__ignore_alphabets_l__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ignore_alphabets_m__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ignore_alphabets_m___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19__ignore_alphabets_m__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ignore_alphabets_m1__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ignore_alphabets_m1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20__ignore_alphabets_m1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ignore_alphabets_m2__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ignore_alphabets_m2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21__ignore_alphabets_m2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ignore_alphabets_n__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ignore_alphabets_n___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22__ignore_alphabets_n__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ignore_alphabets_o__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ignore_alphabets_o___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_23__ignore_alphabets_o__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ignore_alphabets_p__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ignore_alphabets_p___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_24__ignore_alphabets_p__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ignore_alphabets_q__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ignore_alphabets_q___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_25__ignore_alphabets_q__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ignore_alphabets_q1__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ignore_alphabets_q1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_26__ignore_alphabets_q1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ignore_alphabets_r__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ignore_alphabets_r___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_27__ignore_alphabets_r__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ignore_alphabets_s__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ignore_alphabets_s___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_28__ignore_alphabets_s__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ignore_alphabets_t__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ignore_alphabets_t___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_29__ignore_alphabets_t__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ignore_alphabets_u__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ignore_alphabets_u___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_30__ignore_alphabets_u__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__ignore_alphabets_v__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__ignore_alphabets_v___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_31__ignore_alphabets_v__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ignore_alphabets_v1__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ignore_alphabets_v1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_32__ignore_alphabets_v1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ignore_alphabets_w__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ignore_alphabets_w___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_33__ignore_alphabets_w__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ignore_alphabets_w1__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ignore_alphabets_w1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_34__ignore_alphabets_w1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__ignore_alphabets_w2__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__ignore_alphabets_w2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_35__ignore_alphabets_w2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__ignore_alphabets_x__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__ignore_alphabets_x___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_36__ignore_alphabets_x__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__ignore_alphabets_y__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__ignore_alphabets_y___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_37__ignore_alphabets_y__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__ignore_alphabets_y1__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__ignore_alphabets_y1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_38__ignore_alphabets_y1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__ignore_alphabets_y2__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__ignore_alphabets_y2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_39__ignore_alphabets_y2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__ignore_alphabets_z__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__ignore_alphabets_z___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_40__ignore_alphabets_z__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__ignore_alphabets_z1__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__ignore_alphabets_z1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_41__ignore_alphabets_z1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__ignore_alphabets_z2__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__ignore_alphabets_z2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_42__ignore_alphabets_z2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__ignore_numbers_0__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__ignore_numbers_0___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_43__ignore_numbers_0__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ignore_numbers_1__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ignore_numbers_1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_44__ignore_numbers_1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__ignore_numbers_2__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__ignore_numbers_2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_45__ignore_numbers_2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__ignore_numbers_3__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__ignore_numbers_3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_46__ignore_numbers_3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__ignore_numbers_4__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__ignore_numbers_4___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_47__ignore_numbers_4__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__ignore_numbers_5__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__ignore_numbers_5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_48__ignore_numbers_5__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__ignore_numbers_6__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__ignore_numbers_6___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_49__ignore_numbers_6__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__ignore_numbers_7__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__ignore_numbers_7___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_50__ignore_numbers_7__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__ignore_numbers_8__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__ignore_numbers_8___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_51__ignore_numbers_8__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__ignore_numbers_9__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__ignore_numbers_9___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_52__ignore_numbers_9__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//























































/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        RibbonAlphabet: __WEBPACK_IMPORTED_MODULE_0__ignore_ribbon_alphabet___default.a,
        AlphabetA: __WEBPACK_IMPORTED_MODULE_1__ignore_alphabets_a___default.a,
        AlphabetA1: __WEBPACK_IMPORTED_MODULE_2__ignore_alphabets_a1___default.a,
        AlphabetA2: __WEBPACK_IMPORTED_MODULE_3__ignore_alphabets_a2___default.a,
        AlphabetB: __WEBPACK_IMPORTED_MODULE_4__ignore_alphabets_b___default.a,
        AlphabetC: __WEBPACK_IMPORTED_MODULE_5__ignore_alphabets_c___default.a,
        AlphabetD: __WEBPACK_IMPORTED_MODULE_6__ignore_alphabets_d___default.a,
        AlphabetD1: __WEBPACK_IMPORTED_MODULE_7__ignore_alphabets_d1___default.a,
        AlphabetD2: __WEBPACK_IMPORTED_MODULE_8__ignore_alphabets_d2___default.a,
        AlphabetD3: __WEBPACK_IMPORTED_MODULE_9__ignore_alphabets_d3___default.a,
        AlphabetD4: __WEBPACK_IMPORTED_MODULE_10__ignore_alphabets_d4___default.a,
        AlphabetE: __WEBPACK_IMPORTED_MODULE_11__ignore_alphabets_e___default.a,
        AlphabetF: __WEBPACK_IMPORTED_MODULE_12__ignore_alphabets_f___default.a,
        AlphabetG: __WEBPACK_IMPORTED_MODULE_13__ignore_alphabets_g___default.a,
        AlphabetH: __WEBPACK_IMPORTED_MODULE_14__ignore_alphabets_h___default.a,
        AlphabetI: __WEBPACK_IMPORTED_MODULE_15__ignore_alphabets_i___default.a,
        AlphabetJ: __WEBPACK_IMPORTED_MODULE_16__ignore_alphabets_j___default.a,
        AlphabetK: __WEBPACK_IMPORTED_MODULE_17__ignore_alphabets_k___default.a,
        AlphabetL: __WEBPACK_IMPORTED_MODULE_18__ignore_alphabets_l___default.a,
        AlphabetM: __WEBPACK_IMPORTED_MODULE_19__ignore_alphabets_m___default.a,
        AlphabetM1: __WEBPACK_IMPORTED_MODULE_20__ignore_alphabets_m1___default.a,
        AlphabetM2: __WEBPACK_IMPORTED_MODULE_21__ignore_alphabets_m2___default.a,
        AlphabetN: __WEBPACK_IMPORTED_MODULE_22__ignore_alphabets_n___default.a,
        AlphabetO: __WEBPACK_IMPORTED_MODULE_23__ignore_alphabets_o___default.a,
        AlphabetP: __WEBPACK_IMPORTED_MODULE_24__ignore_alphabets_p___default.a,
        AlphabetQ: __WEBPACK_IMPORTED_MODULE_25__ignore_alphabets_q___default.a,
        AlphabetQ1: __WEBPACK_IMPORTED_MODULE_26__ignore_alphabets_q1___default.a,
        AlphabetR: __WEBPACK_IMPORTED_MODULE_27__ignore_alphabets_r___default.a,
        AlphabetS: __WEBPACK_IMPORTED_MODULE_28__ignore_alphabets_s___default.a,
        AlphabetT: __WEBPACK_IMPORTED_MODULE_29__ignore_alphabets_t___default.a,
        AlphabetU: __WEBPACK_IMPORTED_MODULE_30__ignore_alphabets_u___default.a,
        AlphabetV: __WEBPACK_IMPORTED_MODULE_31__ignore_alphabets_v___default.a,
        AlphabetV1: __WEBPACK_IMPORTED_MODULE_32__ignore_alphabets_v1___default.a,
        AlphabetW: __WEBPACK_IMPORTED_MODULE_33__ignore_alphabets_w___default.a,
        AlphabetW1: __WEBPACK_IMPORTED_MODULE_34__ignore_alphabets_w1___default.a,
        AlphabetW2: __WEBPACK_IMPORTED_MODULE_35__ignore_alphabets_w2___default.a,
        AlphabetX: __WEBPACK_IMPORTED_MODULE_36__ignore_alphabets_x___default.a,
        AlphabetY: __WEBPACK_IMPORTED_MODULE_37__ignore_alphabets_y___default.a,
        AlphabetY1: __WEBPACK_IMPORTED_MODULE_38__ignore_alphabets_y1___default.a,
        AlphabetY2: __WEBPACK_IMPORTED_MODULE_39__ignore_alphabets_y2___default.a,
        AlphabetZ: __WEBPACK_IMPORTED_MODULE_40__ignore_alphabets_z___default.a,
        AlphabetZ1: __WEBPACK_IMPORTED_MODULE_41__ignore_alphabets_z1___default.a,
        AlphabetZ2: __WEBPACK_IMPORTED_MODULE_42__ignore_alphabets_z2___default.a,
        Alphabet0: __WEBPACK_IMPORTED_MODULE_43__ignore_numbers_0___default.a,
        Alphabet1: __WEBPACK_IMPORTED_MODULE_44__ignore_numbers_1___default.a,
        Alphabet2: __WEBPACK_IMPORTED_MODULE_45__ignore_numbers_2___default.a,
        Alphabet3: __WEBPACK_IMPORTED_MODULE_46__ignore_numbers_3___default.a,
        Alphabet4: __WEBPACK_IMPORTED_MODULE_47__ignore_numbers_4___default.a,
        Alphabet5: __WEBPACK_IMPORTED_MODULE_48__ignore_numbers_5___default.a,
        Alphabet6: __WEBPACK_IMPORTED_MODULE_49__ignore_numbers_6___default.a,
        Alphabet7: __WEBPACK_IMPORTED_MODULE_50__ignore_numbers_7___default.a,
        Alphabet8: __WEBPACK_IMPORTED_MODULE_51__ignore_numbers_8___default.a,
        Alphabet9: __WEBPACK_IMPORTED_MODULE_52__ignore_numbers_9___default.a

    },

    data() {
        return {
            content: 'love\na1nd\npeace'
        };
    },

    computed: {
        words() {
            const res = this.content.toUpperCase().split('\n');
            const regexp = /([A-Z]\d?)|(-\d)/g;

            res.forEach((group, index) => {
                let r = group.match(regexp) || [];
                r = r.map(i => i.replace('-', ''));
                res[index] = r;
            });

            return res;
        }
    }
});

/***/ }),
/* 225 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 226 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 227 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 228 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_css_doodle__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.$el.addEventListener('click', evt => {
                evt.target.update && evt.target.update();
            });
        }
    }
});

/***/ }),
/* 229 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_css_doodle__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.$el.addEventListener('click', evt => {
                evt.target.update && evt.target.update();
            });
        }
    }
});

/***/ }),
/* 230 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_css_doodle__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 231 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_css_doodle__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 232 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_css_doodle__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.$el.addEventListener('click', evt => {
                evt.target.update && evt.target.update();
            });
        }
    }
});

/***/ }),
/* 233 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_css_doodle__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.$el.addEventListener('click', evt => {
                evt.target.update && evt.target.update();
            });
        }
    }
});

/***/ }),
/* 234 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_css_doodle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_css_doodle__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.$el.addEventListener('click', evt => {
                evt.target.update && evt.target.update();
            });
        }
    }
});

/***/ }),
/* 235 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 236 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 237 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 238 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 手风琴式导航


/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            mainMenus: [{
                name: '导航1',
                subMenus: [{ name: '导航1-1' }, { name: '导航1-2' }, { name: '导航1-3' }, { name: '导航1-4' }, { name: '导航1-5' }, { name: '导航1-6' }]
            }, {
                name: '导航2',
                subMenus: [{ name: '导航2-1' }, { name: '导航2-2' }, { name: '导航2-3' }, { name: '导航2-4' }, { name: '导航2-5' }, { name: '导航2-6' }]
            }, {
                name: '导航3',
                subMenus: [{ name: '导航3-1' }, { name: '导航3-2' }, { name: '导航3-3' }, { name: '导航3-4' }, { name: '导航3-5' }, { name: '导航3-6' }]
            }]
        };
    },
    methods: {
        init() {
            __WEBPACK_IMPORTED_MODULE_0_jquery___default()('.main-item-name').on('click', function () {
                let mainItem = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this).parent();
                let height = mainItem.find('.sub-list').height();
                if (height) {
                    mainItem.find('.sub-list').height(0);
                } else {
                    mainItem.find('.sub-list').height(84);
                    mainItem.siblings().find('.sub-list').height(0);
                }
            });
        }
    },
    mounted() {
        this.init();
    }
});

/***/ }),
/* 239 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 蚂蚁线
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 240 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 弹出提示框
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 241 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            colors: ['red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue', 'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange', 'brown', 'grey', 'blueGrey']
        };
    },

    methods: {
        copyColor(event) {
            const element = event.target;
            const style = getComputedStyle(element);
            const { backgroundColor } = style;

            const input = document.createElement('input');
            input.value = backgroundColor;
            document.body.appendChild(input);
            input.select();

            document.execCommand('copy', false.null);

            document.body.removeChild(input);
        }
    }
});

/***/ }),
/* 242 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    mounted() {
        this.fading();
    },

    methods: {
        fading() {
            const fancy = document.getElementsByClassName('fancy')[0];
            const letters = fancy.textContent.split('');

            const content = letters.map(val => {
                const delay = Math.floor(Math.random() * 1000 + 1);

                return `<span style="animation-delay: ${delay}ms">${val}</span>`;
            });

            fancy.innerHTML = '';

            for (var i = 0; i < content.length; i++) {
                fancy.innerHTML += content[i];
            }
        }
    }
});

/***/ }),
/* 243 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {};
    },
    methods: {
        getInlineStyle() {
            const element = document.querySelector('.element');
            const { style } = element;

            console.log('inlineStyle', style);
            /**
             * style[0]           =>  'font-size'
             * style[1]           =>  'color'
             * style['fontSize']  =>  '2em'
             * style['color']     =>  'red'
             * style['cssText']   =>  'font-size: 2em; color: red;'
             */
        },
        getComputedStyle() {
            const element = document.querySelector('.element');
            const style = getComputedStyle(element); // 返回一个包含每个CSS属性及其各自值的对象

            console.log('computedStyle', style);
            /**
             * style['fontSize']  =>  '28px'
             * style['color']     =>  'rgb(255, 0, 0)'
             * style['fontFamily']  =>  'Helvetica'
             * style['lineHeight']  =>  '42px'
             */

            const pseudoElementStyle = getComputedStyle(element, '::before');
            console.log('pseudoElementStyle', pseudoElementStyle);
        }
    }
});

/***/ }),
/* 244 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 245 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 246 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 247 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 悬挂条导航
/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            teams: ['LAL Lakers', 'GS Warriors', 'SAS Spurs', 'MIA Heats', 'BOS Celtics'],
            team: ''
        };
    },

    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.team = this.teams[0];
        },
        activeItem(team) {
            this.team = team;
        }
    }
});

/***/ }),
/* 248 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 打字效果
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 249 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 打字效果
/* harmony default export */ __webpack_exports__["default"] = ({
    mounted() {
        this.begin();
    },

    methods: {
        begin() {
            let typed = '';
            const element = document.querySelector('.typity');

            function startType(pun, index) {
                if (index < pun.length) {
                    typed += pun.charAt(index);
                    element.innerHTML = typed;
                    index++;
                    setTimeout(function () {
                        startType(pun, index);
                    }, 50);
                } else {
                    setTimeout(function () {
                        element.classList.add('highlight');
                    }, 1000);

                    setTimeout(function () {
                        element.classList.remove('highlight');
                        typed = '';
                        element.innerHTML = typed;
                        startType(getRandomPun(), 0);
                    }, 2000);
                }
            }

            function getRandomPun() {
                const puns = ['I love three things', 'the sun, the moon and you', 'the sun is for the day', 'the moon is for the night', 'and you forever'];

                const index = Math.floor(Math.random() * puns.length);
                return puns[index];
            }

            startType(getRandomPun(), 0);
        }
    }
});

/***/ }),
/* 250 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            choices: [{
                value: 1,
                alias: '内容少'
            }, {
                value: 10,
                alias: '内容适中'
            }, {
                value: 20,
                alias: '内容多'
            }],
            repeatCount: 1,
            baseContent: 'life is but a span. '
        };
    },

    computed: {
        content() {
            return this.baseContent.repeat(this.repeatCount);
        }
    }
});

/***/ }),
/* 251 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 252 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 253 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    mounted() {
        this.getBtn();
    },

    methods: {
        getBtn() {
            const { left, top } = btn.getBoundingClientRect();

            const element = document.elementFromPoint(left, top);
            console.log({ element }); //btn

            const elements = document.elementsFromPoint(left, top);
            console.log({ elements }); //从里到外 
        },
        disableBtn() {
            btn.classList.add('disable');

            this.getBtn();
        }
    }
});

/***/ }),
/* 254 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 255 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 256 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 257 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    alias: 'tooltip'
});

/***/ }),
/* 258 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 259 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 260 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 261 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 262 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 263 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 264 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    methods: {
        submit(e) {
            console.log(e.target);
        }
    }
});

/***/ }),
/* 265 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            references: ['https://github.com/dwqs/blog/issues/28']
        };
    }
});

/***/ }),
/* 266 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            teams: [{
                city: 'los angeles',
                name: 'lakers',
                player: 'kobe'
            }, {
                city: 'golden state',
                name: 'warriors',
                player: 'curry'
            }, {
                city: 'san antonio',
                name: 'spurs',
                player: 'duncan'
            }]
        };
    }
});

/***/ }),
/* 267 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 268 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            colors: ['', '#F00', '#0F0', '#00F', 'initial']
        };
    }
});

/***/ }),
/* 269 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 270 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 271 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 272 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 273 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 274 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 275 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            links: ['https://github.com/maxchehab/CSS-Keylogging', 'https://github.com/jbtronics/CrookedStyleSheets', 'https://github.com/jbtronics/CrookedStyleSheets/blob/master/docs/README.zh.md']
        };
    }
});

/***/ }),
/* 276 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 277 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 278 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 279 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    mounted() {
        this.init();
    },
    methods: {
        init() {
            const input = document.querySelector('input');

            console.log({
                indeterminate: input.indeterminate,
                checked: input.checked
            });

            input.indeterminate = true;

            console.log({
                indeterminate: input.indeterminate,
                checked: input.checked
            });
        }
    }
});

/***/ }),
/* 280 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 281 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 282 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 283 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 284 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 285 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 286 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 287 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 288 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 289 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 290 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 291 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 292 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 293 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 294 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 295 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 296 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 297 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 298 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 299 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 300 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 301 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 302 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 303 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    alias: '模糊文字'
});

/***/ }),
/* 304 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 305 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            links: [{
                name: 'Glitch Effect',
                href: 'https://hacdias.com/xxx'
            }, {
                name: 'Glitch Effect on Text / Images / SVG',
                href: 'https://css-tricks.com/glitch-effect-text-images-svg/'
            }, {
                name: '让你的网站文字抖起来',
                href: 'https://paugram.com/coding/shake-your-text.html'
            }]
        };
    }
});

/***/ }),
/* 306 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 307 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 308 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 309 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 310 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 311 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 312 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 313 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 314 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 315 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 316 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 317 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 318 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            mode: ''
        };
    },
    methods: {
        changeMode(mode) {
            this.mode = mode;
        }
    },
    created() {}
});

/***/ }),
/* 319 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 320 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 321 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 322 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 323 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 324 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 325 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 326 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 327 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 328 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_lodash__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__utils_lodash__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            colorRules: [{
                name: '单色预设',
                values: '000000 333333 666666 999999 cccccc ffffff b61d1c dd1010 f44336 ef9a9a ffcdd3 ffebee 880e4f c2185b e91f62 f48fb1 f8bbd0 fde4ec 4a148c 7b1fa2 9c26b0 ce93d8 e1bee7 f3e5f5 311b92 512da8 673ab7 b39ddb d0c4e9 ede7f6 1a237e 30409f 3e51b5 9fa8da c5cae9 e8eaf6 0d47a1 1976d2 2196f3 90caf9 bbdefb e3f2fd 016064 0097a7 03bcd4 81d4fa b2eaf2 e0f7fa 004d3f 00796b 009688 7fdeea b2dfdb e1f2f1 1b5e20 378e3c 4caf50 a5d6a7 c7e6c9 e9f4e9 33691e 699f38 8bc349 c5e1a5 ddedc8 f0f8e9 827718 afb42a cddc38 e6ee9c f0f4c3 f8fbe7 f57f16 fbbf2e feeb3c fff59d fff9c4 fffde7 ff6f00 fea001 ffc103 ffcc80 ffecb2 fff8e1 e65100 f57c00 ff9800 ffcc80 ffecb2 fff8e1 bf360d e64919 ff7752 ffab91 ffccbc fbe9e8 3e2723 5d4037 795548 bcaaa4 d7ccc9 efebe9 263238 455a64 607d8b 90a3ae cfd8dd edeff1'
            }, {
                name: '双色预设',
                values: '000000 444444 000000 ffffff bfbfbf ffffff ff003c ff5c97 ff003c ffccc6 ff003c 1428c4 fb9817 ffcc80 fb9817 fff8e1 fb9817 4622dd ffe000 fbbf2e ffe000 fffde7 ffe000 000000 6dc414 f2f5b9 6dc414 dbffbd 6dc414 4922c4 00796b a5d6a7 00796b e1f2f1 00796b 032426 36c8f8 1976d2 36c8f8 e3f2fd 36c8f8 ffb6ce 3c5ef3 1b0268 3c5ef3 ffffff 3c5ef3 1f1347 8c20ba ff95ca 8c20ba d6bdff 8c20ba ffe000 152ea3 36c8f8 152ea3 e3f2fd 152ea3 ffdd7d f7e1ba c73229 f7e1ba ffd39f f7e1ba 000000 3e2723 795548 3e2723 efebe9 3e2723 ffc55d 4f5441 e2e8dd 813cf3 ff5c97 ff003c 000000 ffb3c5 ff7ea9 ffb3c5 ffe7c0 ffb3c5 cdaaf2'
            }, {
                name: '三色预设',
                values: '000000 444444 bfbfbf 999999 bfbfbf e5e5e5 ff003c ff618e ffcad5 ff003c ffcad5 7041e5 ff003c f7e1ba ffb6ce ff003c ffffff 000000 fb9817 ffcc80 fff8e1 fb9817 813cf3 e9428b ffec00 fbbf2e ff618e ffec00 00796b 013329 ffec00 1428c4 813cf3 ffec00 7712c4 3e2723 6dc414 00796b 02473a 6dc414 e1f2f1 00796b 50d3ba 00497a e1f2f1 08c19d 152ea3 3e2723 00edff ffffff ff3395 00edff 1aadff 1428c4 94fcff ffb6ce ffea6c caed69 ffea6c ffb6ce d8b2f9 ffcad5 ffea6c 3c5ef3 94fcff 520bb7 3c5ef3 ffffff 1f1347 3c5ef3 ffffff 7712c4 e038c0 ff95ca ffcad5 ffb6ce 5c13e8 ffec00 7712c4 9a45ed c395f9 000000 7712c4 c395f9 7712c4 ffffff ff5c97 7712c4 ffec00 caed69 f7e1ba c73229 ffe000 f7e1ba 795548 3e2723 f7e1ba c395f9 7712c4 813cf3 ff5c97 ffd39f efdeb9 ffffff 000000 ffdee6 7712c4 c395f9 ffcad5 5c79f5 813cf3 f24327 ffec00 59e0b1'
            }, {
                name: '四色预设',
                values: '000000 444444 bfbfbf ffffff 000000 d3dddc e1f2f1 ffffff ff003c ff618e f8bbd0 ffcad5 ff003c 002651 775ada 28c7fa ff5b45 ffba47 f5ff65 96cd39 ff3757 ff715a ffa974 ffde74 fe2f63 eaeaea 252a34 02d9d6 fa4659 feffe5 a3de83 2cb872 0e2431 fc3b52 f9b248 e7d5b7 000249 104392 ff5151 ff8b8b 3a0088 930077 e61c5d ffbd39 ff4d4d ff8364 fdb87d ffe8d5 3e3e3e f4722b f6e7c1 b3a78c 155263 ff6f3d ff9a3d ffc93c f6378f ffdd00 f5efe8 8fa5eb 2f3481 d6e6f2 f5f5f5 fff201 ffe037 1ecd9f 068c70 23033c 6901ff 9951ff ffd600 faf7ff 774998 e62976 fff201 ffffff 1a2f4b 29465c 2f8886 84c69b 7bc74d 222831 393e46 eeeeee 000000 198b9d b1d431 fff5f5 e4eddc 317673 154d53 1a3c40 fff395 7459dc 42b3ff 63f5ef cff802 feff92 0defbd 7899dc 5920ce 0c9cee 3dbcc2 a0f480 65ead1 e62976 fdb87d fcffc1 ffffff 01fff0 00d1ff 3d6cb9 062c80 0e6ac7 4eb9fc f6f5da 3e52e3 ffffff efe891 f12d2d 001f3f 0960bd 429ffd e1f2f1 0e1455 4d1184 932b77 fd367e fdefee fccde2 fc5c9c c5e3f6 ffdd00 f64e8b a01ba7 452a46 faee1e f3558f 9c1ce7 581b98 6901ff 9951ff ffd600 e1f2f1 fffbe3 ffa9a9 6a425c 26271a 432a9d f14e95 b13cd5 fbf3fc bad7df ffe2e3 f6f6f6 99ddcd fb929e ffdfdf fff6f6 afdefc fdfcc4 ffe8cf ffdede ccffec f9f3e6 e2dcd5 e8aa8c 5f616a 343434 8d8b82 eadcbe f3f3f3 e3d9ca 95a792 596c68 403f48 073358 104471 fc3c3c f6f6f6'
            }, {
                name: '五色预设',
                values: '000000 444444 999999 bfbfbf ffffff dd1010 f44336 ef9a9a ffcdd3 ffebee c2185b e91f62 f48fb1 f8bbd0 fde4ec 7b1fa2 9c26b0 ce93d8 e1bee7 f3e5f5 512da8 673ab7 b39ddb d0c4e9 ede7f6 30409f 3e51b5 9fa8da c5cae9 e8eaf6 1976d2 2196f3 90caf9 bbdefb e3f2fd 00796b 009688 7fdeea b2eaf2 e0f7fa 378e3c 4caf50 a5d6a7 c7e6c9 e9f4e9 fbbf2e feeb3c fff59d fff9c4 fffde7 f57c00 ff9800 ffcc80 ffecb2 fff8e1 e64919 ff7752 ffab91 ffccbc fbe9e8 5d4037 795548 bcaaa4 d7ccc9 efebe9 ff5b45 ffba47 f5ff65 96cd39 bbdefb ffffa6 bdf271 28d9c2 00a2a6 2f2933 f4661c fde408 fdf6de a3d0c1 0c2550 d0e64a 99c836 32a6b2 186674 093a4a ffed02 ff9b0c ff4057 c70251 935da3 e2e1e9 ccc9d1 a4abbf 606273 f00706 8fced6 6aadc9 2e5f73 f25260 c3ae8d f23c3c f0dfd0 c7c5a7 8ba88f 239396 f2e105 fffffd 91d9d9 4ea6a6 347373 c84124 5e7d4d e0d1a3 7d603e 232621 d4a960 ab6936 8c3b3c 3f3d3a 637d74'
            }]
        };
    },
    computed: {
        colorList() {
            const { colorRules } = this;

            return colorRules.map(rule => {
                const colors = __WEBPACK_IMPORTED_MODULE_0__utils_lodash___default.a.chunk(rule.values.split(' ').map(i => `#${i}`).slice(6), 6);
                console.log(colors);
                return Object.assign(rule, {
                    colors
                });
            });
        }
    }
});

/***/ }),
/* 329 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 330 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 331 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            options: ['repeat', 'round', 'space'],
            url: 'https://st-gdx.dancf.com/gaodingx/341/design/20190731-152542-1dab.png'
        };
    }
});

/***/ }),
/* 332 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 333 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 334 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 335 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 336 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 337 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 338 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 339 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 340 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 341 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 342 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 343 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 344 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 345 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 346 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 347 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 348 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 349 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    methods: {
        click(e) {
            console.log(e.target);
        }
    }
});

/***/ }),
/* 350 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            url: 'http://www.cnblogs.com/coco1s/p/7079529.html'
        };
    }
});

/***/ }),
/* 351 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    methods: {
        loadScript() {
            //http://leaverou.github.io/conic-gradient/conic-gradient.js
        }
    },
    mounted() {
        this.loadScript();
    }
});

/***/ }),
/* 352 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 353 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 354 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 355 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 356 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    methods: {
        move(evt) {
            const element = evt.target;
            element.style.left = `${evt.pageX - 268}px`;
            element.style.top = `${evt.pageY}px`;
        }
    }
});

/***/ }),
/* 357 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            filters: [{
                name: '原图',
                value: 'normal'
            }, {
                name: '灰度',
                value: 'grayscale'
            }, {
                name: '怀旧',
                value: 'sepia'
            }, {
                name: '色相旋转',
                value: 'hue-rotate'
            }, {
                name: '饱和度',
                value: 'saturate'
            }, {
                name: '亮度',
                value: 'brightness'
            }, {
                name: '反色',
                value: 'invert'
            }, {
                name: '透明度',
                value: 'opacity'
            }, {
                name: '对比度',
                value: 'contrast'
            }, {
                name: '模糊',
                value: 'blur'
            }, {
                name: '阴影',
                value: 'drop-shadow'
            }]
        };
    }
});

/***/ }),
/* 358 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 359 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            curColor: '',
            colors: ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple']
        };
    }
});

/***/ }),
/* 360 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 361 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 362 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 363 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 364 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 365 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 366 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 367 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 368 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            menus: ['菜瓜', '菜瓜', '菜瓜', '菜瓜', '菜瓜', '菜瓜', '菜瓜']
        };
    }
});

/***/ }),
/* 369 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 370 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 371 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 372 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            times: 100
        };
    }
});

/***/ }),
/* 373 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 374 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 375 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 376 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 377 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 378 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            options: [{
                name: '',
                type: 'double',
                backgroundColor: '#976bee',
                width: '14px',
                color: 'white',
                offset: '-20px'
            }, {
                name: '',
                type: 'dotted',
                backgroundColor: '#e65353',
                width: '24px',
                color: 'white',
                offset: '-12px'
            }, {
                name: '',
                type: 'dotted',
                backgroundColor: '#ffd835',
                width: '40px',
                color: 'white',
                offset: '-20px'
            }, {
                name: '',
                type: 'dashed',
                backgroundColor: '#70bc59',
                width: '22px',
                color: 'white',
                offset: '-12px'
            }, {
                name: '',
                type: 'groove',
                backgroundColor: 'antiquewhite',
                width: '14px',
                color: 'burlywood',
                offset: '-14px'
            }, {
                name: '',
                type: 'ridge',
                backgroundColor: 'azure',
                width: '14px',
                color: 'lightblue',
                offset: '-14px'
            }, {
                name: '',
                type: 'outset',
                backgroundColor: 'floralwhite',
                width: '24px',
                color: 'pink',
                offset: '-24px'
            }, {
                name: '',
                type: 'inset',
                backgroundColor: 'bisque',
                width: '24px',
                color: 'sandybrown',
                offset: '-24px'
            }, {
                name: '',
                type: 'auto',
                backgroundColor: 'aliceblue',
                width: '50px',
                color: 'lavender'
            }]
        };
    }
});

/***/ }),
/* 379 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 380 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 381 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 382 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 383 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 384 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    methods: {
        click() {
            alert(1);
        }
    }
});

/***/ }),
/* 385 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = create;

var _vue = __webpack_require__(3);

var _vue2 = _interopRequireDefault(_vue);

var _main = __webpack_require__(704);

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create(dir) {
    return _vue2.default.extend({
        mixins: [_main2.default],

        data: function data() {
            return {
                dir: dir
            };
        }
    });
}

/***/ }),
/* 386 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = __webpack_require__(3);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var focus = _vue2.default.directive('focus', {
    params: ['a'],
    bind: function bind() {},
    inserted: function inserted(el, binding) {
        // console.log(binding.def.params, binding.value.a);
        el.focus();
    },
    update: function update() {},
    componentUpdated: function componentUpdated() {},
    unbind: function unbind() {}
});

exports.default = focus;

/***/ }),
/* 387 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = __webpack_require__(3);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subfix = _vue2.default.filter('Subfix', function () {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var subfix = arguments[1];

  return value + subfix;
}); /**
     * 添加后缀
     */

exports.default = subfix;

/***/ }),
/* 388 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(3);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(20);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _app = __webpack_require__(107);

var _app2 = _interopRequireDefault(_app);

var _routes = __webpack_require__(104);

var _routes2 = _interopRequireDefault(_routes);

var _index = __webpack_require__(106);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(105);

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 自动生成路由
_vue2.default.use(_vueRouter2.default);
// import routes from './config/routes'; // 手动注入路由

_vue2.default.config.debug = true;

var router = new _vueRouter2.default({
    routes: _routes2.default
});

var app = new _vue2.default({
    el: '#app',
    template: '<App/>',
    components: { App: _app2.default },
    router: router,
    filters: _index2.default,
    directives: _index4.default
});

/***/ }),
/* 389 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(694);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Lodash = {
  debounce: _lodash2.default.debounce,
  chunk: _lodash2.default.chunk
}; /**
    * 按需引入lodash,避免体积过大
    * 用到的lodash的方法需要在这里显式说明
    */

window._ = Lodash;

exports.default = Lodash;

/***/ }),
/* 390 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(392), __esModule: true };

/***/ }),
/* 391 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(390);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 392 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(416);
__webpack_require__(415);
module.exports = __webpack_require__(12).Array.from;


/***/ }),
/* 393 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 394 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(90);
var toLength = __webpack_require__(91);
var toAbsoluteIndex = __webpack_require__(412);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 395 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(81);
var TAG = __webpack_require__(7)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 396 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(16);
var createDesc = __webpack_require__(24);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 397 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(9).document;
module.exports = document && document.documentElement;


/***/ }),
/* 398 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(13) && !__webpack_require__(86)(function () {
  return Object.defineProperty(__webpack_require__(83)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 399 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(81);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 400 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(23);
var ITERATOR = __webpack_require__(7)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 401 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(11);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 402 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(405);
var descriptor = __webpack_require__(24);
var setToStringTag = __webpack_require__(88);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(15)(IteratorPrototype, __webpack_require__(7)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 403 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(87);
var $export = __webpack_require__(85);
var redefine = __webpack_require__(410);
var hide = __webpack_require__(15);
var Iterators = __webpack_require__(23);
var $iterCreate = __webpack_require__(402);
var setToStringTag = __webpack_require__(88);
var getPrototypeOf = __webpack_require__(407);
var ITERATOR = __webpack_require__(7)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 404 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(7)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 405 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(11);
var dPs = __webpack_require__(406);
var enumBugKeys = __webpack_require__(84);
var IE_PROTO = __webpack_require__(25)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(83)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(397).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 406 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(16);
var anObject = __webpack_require__(11);
var getKeys = __webpack_require__(409);

module.exports = __webpack_require__(13) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 407 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(14);
var toObject = __webpack_require__(92);
var IE_PROTO = __webpack_require__(25)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 408 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(14);
var toIObject = __webpack_require__(90);
var arrayIndexOf = __webpack_require__(394)(false);
var IE_PROTO = __webpack_require__(25)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 409 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(408);
var enumBugKeys = __webpack_require__(84);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 410 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15);


/***/ }),
/* 411 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26);
var defined = __webpack_require__(21);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 412 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 413 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(22);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 414 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(395);
var ITERATOR = __webpack_require__(7)('iterator');
var Iterators = __webpack_require__(23);
module.exports = __webpack_require__(12).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 415 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(82);
var $export = __webpack_require__(85);
var toObject = __webpack_require__(92);
var call = __webpack_require__(401);
var isArrayIter = __webpack_require__(400);
var toLength = __webpack_require__(91);
var createProperty = __webpack_require__(396);
var getIterFn = __webpack_require__(414);

$export($export.S + $export.F * !__webpack_require__(404)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 416 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(411)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(403)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 417 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-00f67782] {\n  margin: 10px auto;\n}\n.chrome[data-v-00f67782] {\n  width: 180px;\n  height: 180px;\n  border-radius: 50%;\n  box-shadow: 0 0 4px #999, 0 0 2px #ddd inset;\n  background: radial-gradient(circle, #4FACF5 0, #2196F3 28%, transparent 28%), radial-gradient(circle, #FFFFFF 33%, transparent 33%), linear-gradient(-50deg, #FFEB3B 34%, transparent 34%), linear-gradient(60deg, #4CAF50 33%, transparent 33%), linear-gradient(180deg, #FF756B 0, #F44336 30%, transparent 30%), linear-gradient(-120deg, #FFEB3B 40%, transparent 40%), linear-gradient(-60deg, #FFEB3B 30%, transparent 30%), linear-gradient(0deg, #4CAF50 45%, transparent 45%), linear-gradient(60deg, #4CAF50 30%, transparent 30%), linear-gradient(120deg, #F44336 50%, transparent 50%), linear-gradient(180deg, #F44336 30%, transparent 30%);\n}\n", ""]);

// exports


/***/ }),
/* 418 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-01048f03] {\n  /* cyan */\n  --sm-dot: radial-gradient(circle, #00d4ff 16px, rgba(0, 212, 255, 0) 16px);\n  /* blue */\n  --md-dot: radial-gradient(circle, #0048ff 18px, rgba(0, 72, 255, 0) 18px);\n  /* orange */\n  --md2-dot: radial-gradient(circle, #00ffcc 22px, rgba(0, 255, 204, 0) 22px);\n  /* pink */\n  --lg-dot: radial-gradient(circle, #ff336d 24px, rgba(255, 51, 109, 0) 24px);\n  /* green */\n  --xsm-dot: radial-gradient(circle, #00cc00 14px, rgba(0, 204, 0, 0) 14px);\n  /* violet */\n  --xmd-dot: radial-gradient(circle, #b700ff 22px, rgba(183, 0, 255, 0) 22px);\n  /* yellow */\n  --xmd2-dot: radial-gradient(circle, #e4ff33 18px, rgba(228, 255, 51, 0) 18px);\n  /* orange */\n  --xlg-dot: radial-gradient(circle, #ffa333 16px, rgba(255, 163, 51, 0) 16px);\n  --sm-size: 200px 200px;\n  --md2-size: 200px 200px;\n  --md-size: 200px 200px;\n  --lg-size: 200px 200px;\n  --xsm-size: 200px 200px;\n  --xmd2-size: 200px 200px;\n  --xmd-size: 200px 200px;\n  --xlg-size: 200px 200px;\n  --sm-pos: 0px 50px;\n  --md2-pos: 0px 150px;\n  --md-pos: 50px 0px;\n  --lg-pos: 50px 100px;\n  --xsm-pos: 100px 50px;\n  --xmd2-pos: 100px 150px;\n  --xmd-pos: 150px 0px;\n  --xlg-pos: 150px 100px;\n  background-color: #040052;\n  background-image: var(--sm-dot), var(--md2-dot), var(--md-dot), var(--lg-dot), var(--xsm-dot), var(--xmd2-dot), var(--xmd-dot), var(--xlg-dot);\n  background-size: var(--sm-size), var(--md2-size), var(--md-size), var(--lg-size), var(--xsm-size), var(--xmd2-size), var(--xmd-size), var(--xlg-size);\n  background-position: var(--sm-pos), var(--md2-pos), var(--md-pos), var(--lg-pos), var(--xsm-pos), var(--xmd2-pos), var(--xmd-pos), var(--xlg-pos);\n}\n", ""]);

// exports


/***/ }),
/* 419 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-0112a684] {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background: #333641;\n}\ndiv[data-v-0112a684] {\n    font-size: 8vw;\n    text-transform: uppercase;\n    color: transparent;\n    background:\n        50% 100% / 50% 50% no-repeat\n        radial-gradient(ellipse at bottom, white, transparent, transparent)\n    ;\n    -webkit-background-clip: text;\n    background-clip: text;\n    animation:\n        reveal 3000ms ease-in-out forwards 200ms,\n        glow 2500ms linear infinite 2000ms\n    ;\n}\n@keyframes reveal {\n80% {\n        letter-spacing: 8px;\n}\n100% {\n        background-size: 300% 300%;\n}\n}\n@keyframes glow {\n40% {\n        text-shadow: 0 0 8px white;\n}\n}\n", ""]);

// exports


/***/ }),
/* 420 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nul[data-v-012d6431] {\n  width: 700px;\n  margin: 100px auto;\n}\nli[data-v-012d6431] {\n  float: left;\n  width: 100px;\n  height: 50px;\n  line-height: 50px;\n  text-align: center;\n  cursor: pointer;\n}\nli[data-v-012d6431]:first-child {\n  background-image: linear-gradient(red 100%, transparent 100%);\n  background-size: 100% 10%;\n  background-repeat: no-repeat;\n  background-position: bottom center;\n}\nli[data-v-012d6431]:first-child:hover {\n  color: #fff;\n  background-size: 100% 100%;\n}\nli[data-v-012d6431]:nth-child(2) {\n  background-image: linear-gradient(orange 100%, transparent 100%);\n  background-size: 100% 10%;\n  background-repeat: no-repeat;\n  background-position: bottom center;\n}\nli[data-v-012d6431]:nth-child(2):hover {\n  color: #fff;\n  background-size: 100% 100%;\n}\nli[data-v-012d6431]:nth-child(3) {\n  background-image: linear-gradient(yellow 100%, transparent 100%);\n  background-size: 100% 10%;\n  background-repeat: no-repeat;\n  background-position: bottom center;\n}\nli[data-v-012d6431]:nth-child(3):hover {\n  color: #fff;\n  background-size: 100% 100%;\n}\nli[data-v-012d6431]:nth-child(4) {\n  background-image: linear-gradient(green 100%, transparent 100%);\n  background-size: 100% 10%;\n  background-repeat: no-repeat;\n  background-position: bottom center;\n}\nli[data-v-012d6431]:nth-child(4):hover {\n  color: #fff;\n  background-size: 100% 100%;\n}\nli[data-v-012d6431]:nth-child(5) {\n  background-image: linear-gradient(blue 100%, transparent 100%);\n  background-size: 100% 10%;\n  background-repeat: no-repeat;\n  background-position: bottom center;\n}\nli[data-v-012d6431]:nth-child(5):hover {\n  color: #fff;\n  background-size: 100% 100%;\n}\nli[data-v-012d6431]:nth-child(6) {\n  background-image: linear-gradient(indigo 100%, transparent 100%);\n  background-size: 100% 10%;\n  background-repeat: no-repeat;\n  background-position: bottom center;\n}\nli[data-v-012d6431]:nth-child(6):hover {\n  color: #fff;\n  background-size: 100% 100%;\n}\nli[data-v-012d6431]:nth-child(7) {\n  background-image: linear-gradient(violet 100%, transparent 100%);\n  background-size: 100% 10%;\n  background-repeat: no-repeat;\n  background-position: bottom center;\n}\nli[data-v-012d6431]:nth-child(7):hover {\n  color: #fff;\n  background-size: 100% 100%;\n}\n", ""]);

// exports


/***/ }),
/* 421 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-013b7bb2] {\n  position: relative;\n  margin: 0;\n  font-family: \"Exo\", sans-serif;\n  color: #fff;\n  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);\n  background-size: 400% 400%;\n  animation: gradientBG 15s ease infinite;\n}\n.container[data-v-013b7bb2] {\n  position: absolute;\n  top: 35%;\n  width: 100%;\n  text-align: center;\n}\nh1[data-v-013b7bb2] {\n  font-weight: 300;\n}\n@keyframes gradientBG {\n0% {\n    background-position: 0% 50%;\n}\n50% {\n    background-position: 100% 50%;\n}\n100% {\n    background-position: 0% 50%;\n}\n}\n", ""]);

// exports


/***/ }),
/* 422 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.parent[data-v-018d570f]:focus-within {\n  background-color: red;\n}\n", ""]);

// exports


/***/ }),
/* 423 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.flag[data-v-029558e2] {\n  margin: 10px auto;\n  width: 200px;\n  height: 150px;\n  background-color: #ccc;\n  filter: drop-shadow(-5px 0 0 deeppink);\n}\n", ""]);

// exports


/***/ }),
/* 424 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-02a37063] {\n  text-align: center;\n}\nli img[data-v-02a37063]:first-child,\nli span[data-v-02a37063]:first-child {\n  filter: drop-shadow(5px 5px 10px black);\n}\nli img[data-v-02a37063]:last-child,\nli span[data-v-02a37063]:last-child {\n  box-shadow: 5px 5px 10px black;\n}\nimg[data-v-02a37063],\nspan[data-v-02a37063] {\n  margin: 50px;\n  display: inline-block;\n}\nspan[data-v-02a37063] {\n  width: 100px;\n  height: 100px;\n  border: 10px dashed #007dd4;\n}\n", ""]);

// exports


/***/ }),
/* 425 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ntable[data-v-02b4e245] {\n  margin: 0 auto;\n  width: 80%;\n  padding: 0;\n  border: 1px solid #ccc;\n  border-collapse: collapse;\n  border-spacing: 0;\n  text-align: center;\n}\ncaption[data-v-02b4e245] {\n  font-weight: bolder;\n}\ntr[data-v-02b4e245] {\n  padding: 5px;\n  border: 1px solid #ddd;\n}\nth[data-v-02b4e245] {\n  padding: 10px;\n  text-transform: uppercase;\n}\ntd[data-v-02b4e245] {\n  padding: 10px;\n  text-transform: capitalize;\n}\n/* 媒体查询设备的宽度进行自适应 */\n@media screen and (max-width: 800px) {\ntable[data-v-02b4e245] {\n    border: 0;\n}\nthead[data-v-02b4e245] {\n    display: none;\n}\ntr[data-v-02b4e245] {\n    margin-bottom: 10px;\n    display: block;\n    border-bottom: 2px solid #ddd;\n}\ntd[data-v-02b4e245] {\n    display: block;\n    border-bottom: 1px dotted #ccc;\n    font-size: 13px;\n    text-align: right;\n}\ntd[data-v-02b4e245]:last-child {\n    border-bottom: none;\n}\ntd[data-v-02b4e245]::before {\n    content: attr(data-label);\n    float: left;\n    font-weight: bold;\n    text-transform: uppercase;\n}\n}\n", ""]);

// exports


/***/ }),
/* 426 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.auto[data-v-0391f347] {\n  width: 350px;\n  table-layout: auto;\n}\n.fixed[data-v-0391f347] {\n  width: 350px;\n  table-layout: fixed;\n}\n", ""]);

// exports


/***/ }),
/* 427 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 428 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.container[data-v-043a14a4] {\n  padding: 30px 0 0 60px;\n  perspective: 1000px;\n  transform: perspective(1000px);\n}\n.cards[data-v-043a14a4] {\n  position: relative;\n}\n.cards:hover .front[data-v-043a14a4] {\n  transform: rotateY(0deg);\n}\n.cards:hover .back[data-v-043a14a4] {\n  transform: rotateY(180deg);\n}\n.card[data-v-043a14a4] {\n  position: absolute;\n  backface-visibility: hidden;\n  transform-style: preserve-3d;\n  transition: all 0.5s ease;\n}\n.front[data-v-043a14a4] {\n  transform: rotateY(-180deg);\n}\n", ""]);

// exports


/***/ }),
/* 429 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-04482c25] {\n  overflow: hidden;\n  background: lime;\n}\nh1[data-v-04482c25] {\n  position: relative;\n  bottom: 0px;\n  font-family: arial;\n  font-size: 19em;\n  font-weight: 900;\n  text-align: center;\n  color: transparent;\n  -webkit-text-stroke: 7px black;\n  background: repeating-linear-gradient(45deg, black, lime 5px);\n  -webkit-background-clip: text;\n  background-clip: text;\n  animation: float 2s ease-in-out infinite;\n}\nh1[data-v-04482c25]::before {\n  content: attr(data-text);\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n  width: 100%;\n  height: 100%;\n  -webkit-text-stroke: 12px lightgreen;\n  background: repeating-linear-gradient(-45deg, black, transparent 5px);\n  -webkit-background-clip: text;\n  background-clip: text;\n}\nh1[data-v-04482c25]::after {\n  content: attr(data-text);\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n  width: 100%;\n  height: 100%;\n  background: radial-gradient(circle at 0 0, transparent 40%, rgba(255, 255, 255, 0.6), transparent 60%);\n  -webkit-background-clip: text;\n  background-clip: text;\n  animation: shine 2s ease-in-out infinite;\n}\n@keyframes float {\n0% {\n    transform: perspective(500px) rotatey(30deg);\n}\n50% {\n    transform: perspective(500px) rotatey(-30deg);\n}\n100% {\n    transform: perspective(500px) rotatey(30deg);\n}\n}\n@keyframes shine {\n0% {\n    background-position: -300px;\n}\n50% {\n    background-position: 300px;\n}\n100% {\n    background-position: -300px;\n}\n}\n", ""]);

// exports


/***/ }),
/* 430 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nvideo[data-v-05f61297] {\n  width: 500px;\n}\nul[data-v-05f61297]::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\nul li[data-v-05f61297] {\n  float: left;\n  margin: 0 10px;\n  padding: 10px;\n  border-radius: 4px;\n  color: #fff;\n  background-color: #007dd4;\n  user-select: none;\n  cursor: pointer;\n}\nul li[data-v-05f61297]:active {\n  background-color: #05558c;\n}\n", ""]);

// exports


/***/ }),
/* 431 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.languages[data-v-0835261d] {\n  margin: 20px;\n  counter-reset: characters 0;\n}\nh3[data-v-0835261d] {\n  margin-bottom: 20px;\n}\ninput[data-v-0835261d]:checked {\n  counter-increment: characters;\n}\n.total[data-v-0835261d] {\n  padding-left: 20px;\n}\n.total[data-v-0835261d]::after {\n  content: counter(characters);\n  margin-left: 10px;\n  color: #f00;\n}\nlabel[data-v-0835261d] {\n  display: inline-block;\n  margin: 0 10px 0 0;\n  font-size: 15px;\n}\ninput[type=checkbox][data-v-0835261d] {\n  position: absolute;\n  left: -10000px;\n}\ninput[type=checkbox] + label[data-v-0835261d]:before {\n  content: \"\";\n  display: inline-block;\n  margin: 0 5px 0 0;\n  width: 18px;\n  height: 18px;\n  font-size: 15px;\n  line-height: 16px;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid #000;\n  color: transparent;\n  cursor: pointer;\n  transition: color ease .4s;\n}\ninput[type=checkbox]:checked + label[data-v-0835261d]:before {\n  content: \"\\2713\";\n  color: #000;\n}\n", ""]);

// exports


/***/ }),
/* 432 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nh1[data-v-094a0919] {\n  font-size: 30px;\n  text-transform: uppercase;\n  text-align: center;\n  color: #607af4;\n}\n.container[data-v-094a0919] {\n  display: grid;\n  height: 100%;\n  grid-template-rows: auto 1fr auto;\n  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));\n  text-align: center;\n}\n.outline-box[data-v-094a0919] {\n  width: 180px;\n  height: 180px;\n  margin: 50px auto;\n}\ncode[data-v-094a0919] {\n  padding: 4px 6px;\n  border-radius: 4px;\n  background-color: #dedede;\n}\n", ""]);

// exports


/***/ }),
/* 433 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-09f9b592] {\n  display: flex;\n  justify-content: center;\n}\n.color[data-v-09f9b592] {\n  display: inline-block;\n  width: 50px;\n  height: 50px;\n  cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 434 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/* 第一种实现 */\n.ant-line-1[data-v-0a8fcf76] {\n  position: relative;\n  display: inline-block;\n  min-width: 10px;\n  min-height: 10px;\n  padding: 10px;\n  border: 0;\n  overflow: hidden;\n  font-size: 2em;\n  outline: 0;\n  resize: both;\n}\n.ant-line-1[data-v-0a8fcf76]::before,\n.ant-line-1[data-v-0a8fcf76]::after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  animation: border-dance 0.76s infinite linear;\n}\n.ant-line-1[data-v-0a8fcf76]::before {\n  background: linear-gradient(to right, #FFF 50%, #666 50%);\n  background-size: 8px 1px;\n  clip-path: polygon(0 0, 100% 0, 100% 1px, 0 1px, 0 calc(100% - 1px), 100% calc(100% - 1px), 100% 100%, 0 100%);\n}\n.ant-line-1[data-v-0a8fcf76]::after {\n  background: linear-gradient(to bottom, #FFF 50%, #666 50%);\n  background-size: 1px 8px;\n  clip-path: polygon(0 0, 0 100%, 1px 100%, 1px 0, calc(100% - 1px) 0, calc(100% - 1px) 100%, 100% 100%, 100% 0);\n}\n@keyframes border-dance {\n100% {\n    background-position: 8px 8px;\n}\n}\n/* 第二种实现 */\n.ant-line-2[data-v-0a8fcf76] {\n  position: relative;\n  width: 200px;\n  height: 100px;\n  text-align: center;\n  background: #FFF;\n}\n.ant-line-2[data-v-0a8fcf76]::before,\n.ant-line-2[data-v-0a8fcf76]::after {\n  content: \"\";\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  background: repeating-linear-gradient(45deg, transparent, transparent 10px, #000, #000 14px);\n}\n.ant-line-2[data-v-0a8fcf76]::before {\n  clip-path: polygon(0 0, 100% 0, 100% 1px, 1px 1px, 1px 100%, 0 100%);\n  animation: animate-before 10s infinite linear;\n}\n.ant-line-2[data-v-0a8fcf76]::after {\n  clip-path: polygon(calc(100% - 1px) 0, 100% 0, 100% 100%, 0 100%, 0 calc(100% - 1px), calc(100% - 1px) calc(100% - 1px));\n  animation: animate-after 10s infinite linear;\n}\n@keyframes animate-before {\nto {\n    background-position: 200px 0;\n}\n}\n@keyframes animate-after {\nto {\n    background-position: -200px 0;\n}\n}\n", ""]);

// exports


/***/ }),
/* 435 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.demo[data-v-0b21e8b6] {\n  position: relative;\n  width: 82px;\n  height: 181px;\n  margin: 100px auto;\n  background: url(" + __webpack_require__(10) + ");\n  background-size: 100% 100%;\n}\n.demo[data-v-0b21e8b6]::after {\n  content: \"\";\n  position: absolute;\n  top: 10%;\n  left: 10%;\n  width: 100%;\n  height: 100%;\n  background: inherit;\n  background-size: 100% 100%;\n  filter: blur(10px) brightness(80%) opacity(0.8);\n}\n", ""]);

// exports


/***/ }),
/* 436 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nnav[data-v-0c03cea8] {\n  position: relative;\n  margin: 30px auto;\n  width: 590px;\n  height: 50px;\n  font-size: 0;\n  border-radius: 8px;\n  background-color: #34495e;\n}\nnav a[data-v-0c03cea8] {\n  display: inline-block;\n  position: relative;\n  z-index: 1;\n  height: 100%;\n  font-size: 15px;\n  line-height: 50px;\n  text-align: center;\n  text-transform: uppercase;\n  text-decoration: none;\n  color: white;\n  cursor: pointer;\n}\nnav .animation[data-v-0c03cea8] {\n  position: absolute;\n  top: 0;\n  z-index: 0;\n  height: 100%;\n  border-radius: 8px;\n  transition: all .5s ease 0s;\n}\na[data-v-0c03cea8]:nth-child(1) {\n  width: 100px;\n}\na[data-v-0c03cea8]:nth-child(2) {\n  width: 110px;\n}\na[data-v-0c03cea8]:nth-child(3) {\n  width: 100px;\n}\na[data-v-0c03cea8]:nth-child(4) {\n  width: 160px;\n}\na[data-v-0c03cea8]:nth-child(5) {\n  width: 120px;\n}\nnav .start-home[data-v-0c03cea8],\na:nth-child(1):hover ~ .animation[data-v-0c03cea8] {\n  left: 0;\n  width: 100px;\n  background-color: #1abc9c;\n}\na:nth-child(2):hover ~ .animation[data-v-0c03cea8] {\n  left: 100px;\n  width: 110px;\n  background-color: #e74c3c;\n}\na:nth-child(3):hover ~ .animation[data-v-0c03cea8] {\n  left: 210px;\n  width: 100px;\n  background-color: #3498db;\n}\na:nth-child(4):hover ~ .animation[data-v-0c03cea8] {\n  left: 310px;\n  width: 160px;\n  background-color: #9b59b6;\n}\na:nth-child(5):hover ~ .animation[data-v-0c03cea8] {\n  left: 470px;\n  width: 120px;\n  background-color: #e67e22;\n}\n", ""]);

// exports


/***/ }),
/* 437 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-0e6fc4fe] {\n  height: 200px;\n  overflow: scroll;\n  background: url(" + __webpack_require__(6) + ");\n  margin: 10px auto;\n  width: 300px;\n  font-size: 48px;\n  text-align: center;\n  color: #FFF;\n}\nli div[data-v-0e6fc4fe] {\n  height: 1000px;\n}\n.scroll[data-v-0e6fc4fe] {\n  background-attachment: scroll;\n}\n.fixed[data-v-0e6fc4fe] {\n  background-attachment: fixed;\n}\n.local[data-v-0e6fc4fe] {\n  background-attachment: local;\n}\n", ""]);

// exports


/***/ }),
/* 438 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Gochi+Hand);", ""]);

// module
exports.push([module.i, "\nmain[data-v-0f2bd1ea] {\n    padding: 40vh 30vw;\n    font-family: 'Gochi Hand', cursive;\n    font-size: 130%;  \n    text-align: left;\n    color: hsl(198, 1%, 29%);\n    background-color: #ffb7b0;\n}\nh2[data-v-0f2bd1ea] {\n    display: inline;\n    line-height: 1.5;\n    background-image: linear-gradient(\n        transparent 50%,\n        #e1fffe 50%,\n        #b0f8ff 85%,\n        transparent 85%,\n        transparent 100%\n    );\n    background-repeat: no-repeat;\n    background-size: 0% 100%;\n    animation: animatedBackground 2s cubic-bezier(0.645, 0.045, 0.355, 1) 0.5s forwards;\n}\n@keyframes animatedBackground {\nto {\n        background-size: 100% 100%;\n}\n}\n", ""]);

// exports


/***/ }),
/* 439 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-0f4800ec] {\n  background: radial-gradient(#e74c3c 4px, transparent 4px), radial-gradient(#e74c3c 4px, transparent 4px), linear-gradient(#222 4px, transparent 0), linear-gradient(45deg, transparent 74px, transparent 75px, #3498db 75px, #3498db 76px, transparent 77px, transparent 109px), linear-gradient(-45deg, transparent 75px, transparent 76px, #3498db 76px, #3498db 77px, transparent 78px, transparent 109px), #222;\n  background-size: 109px 109px,\n        109px 109px,\n        100% 6px,\n        109px 109px,\n        109px 109px\n    ;\n  background-position: 54px 55px,\n        0px 0px,\n        0px 0px,\n        0px 0px,\n        0px 0px\n    ;\n}\n", ""]);

// exports


/***/ }),
/* 440 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-0f642fee] {\n  height: 250px;\n  margin: 50px auto;\n  background-size: 50px 50px;\n  background-image: linear-gradient(45deg, red 25%, transparent 25%, transparent), linear-gradient(-45deg, green 25%, transparent 25%, transparent), linear-gradient(45deg, transparent 75%, yellow 75%), linear-gradient(-45deg, transparent 75%, blue 75%);\n}\n", ""]);

// exports


/***/ }),
/* 441 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.envelope[data-v-0f805ef0] {\n  position: relative;\n  width: 200px;\n  height: 200px;\n  margin: 30px auto;\n}\n.envelope[data-v-0f805ef0]::before {\n  content: '';\n  position: absolute;\n  top: -10px;\n  left: -10px;\n  width: 220px;\n  height: 220px;\n  background-image: repeating-linear-gradient(-45deg, #cc2a2d, #cc2a2d 30px, #f2f2f2 30px, #f2f2f2 40px, #0e71bb 40px, #0e71bb 70px, #f2f2f2 70px, #f2f2f2 80px);\n}\n.envelope[data-v-0f805ef0]::after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 442 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput[data-v-10a7dde8]:-webkit-autofill,\ninput[data-v-10a7dde8]:-webkit-autofill:hover,\ninput[data-v-10a7dde8]:-webkit-autofill:focus {\n  box-shadow: 0 0 0 50px white inset;\n  -webkit-text-fill-color: #333;\n}\ninput[data-v-10a7dde8]:-webkit-autofill {\n  transition: background 9999s ease;\n}\n", ""]);

// exports


/***/ }),
/* 443 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nbutton[data-v-10cee22e]{position:relative;display:inline-block;padding:1.25em 2em;border:2px solid #b18597;font-weight:600;text-transform:uppercase;text-decoration:none;vertical-align:middle;border-radius:0.75em;color:#382b22;background:#fff0f0;outline:none;cursor:pointer;transform-style:preserve-3d;transition:transform 150ms cubic-bezier(0, 0, 0.58, 1),background 150ms cubic-bezier(0, 0, 0.58, 1)\n}\nbutton[data-v-10cee22e]::before{position:absolute;content:\"\";top:0;right:0;bottom:0;left:0;border-radius:inherit;background:#f9c4d2;box-shadow:0 0 0 2px #b18597,0 0.625em 0 0 #ffe3e2;transform:translate3d(0, 0.75em, -1em);transition:transform 150ms cubic-bezier(0, 0, 0.58, 1),box-shadow 150ms cubic-bezier(0, 0, 0.58, 1)\n}\nbutton[data-v-10cee22e]:hover{background:#ffe9e9;transform:translate(0, 0.25em)\n}\nbutton[data-v-10cee22e]:hover::before{box-shadow:0 0 0 2px #b18597,0 0.5em 0 0 #ffe3e2;transform:translate3d(0, 0.5em, -1em)\n}\nbutton[data-v-10cee22e]:active{background:#ffe9e9;transform:translate(0em, 0.75em)\n}\nbutton[data-v-10cee22e]:active::before{box-shadow:0 0 0 2px #b18597,0 0 #ffe3e2;transform:translate3d(0, 0, -1em)\n}\n", ""]);

// exports


/***/ }),
/* 444 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.mod-categories {\n  margin-left: 50px;\n}\n", ""]);

// exports


/***/ }),
/* 445 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-14fc5dba] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n", ""]);

// exports


/***/ }),
/* 446 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-15188cbc] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n", ""]);

// exports


/***/ }),
/* 447 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-1534bbbe] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n", ""]);

// exports


/***/ }),
/* 448 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-1550eac0] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n", ""]);

// exports


/***/ }),
/* 449 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-156d19c2] {\n    width: 72px;\n    height: 72px;\n    -webkit-box-reflect: var(--reflect);\n}\ndiv[data-v-156d19c2]:empty {\n    --g: linear-gradient(#000, #000);\n    --gs: linear-gradient(-45deg,\n    transparent calc(\n        50% - 1px), #000 calc(50% - 1px),\n        #000 calc(50% + 1px), transparent calc(50% + 1px)\n    );\n    background:\n        var(--g) 0 0/100% 2px, var(--g) 100% 0/2px 48px,\n        var(--g) 100% 48px/24px 2px, var(--g) 48px 100%/2px 24px,\n        var(--g) 0 100%/48px 2px, var(--g) 0 0/2px 100%,\n        var(--g) 0 46px/24px 2px, var(--g) 24px 100%/2px 26px,\n        var(--g) 100% 24px/26px 2px, var(--g) 46px 0/2px 24px,\n        var(--gs) 50% 50% / 24px 24px,\n        var(--gs) 0 0 / 40px 40px\n    ;\n    background-repeat: no-repeat;\n}\n", ""]);

// exports


/***/ }),
/* 450 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-158948c4] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  overflow: hidden;\n}\n", ""]);

// exports


/***/ }),
/* 451 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-15a577c6] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  overflow: hidden;\n}\n", ""]);

// exports


/***/ }),
/* 452 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.grid[data-v-178755f4] {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  grid-gap: .5em;\n  width: 100%;\n  height: 100px;\n}\n.grid .item[data-v-178755f4] {\n  --color: #FFB74D;\n  --fallback-color: #999;\n  border-radius: 50%;\n  background-color: var(--color, var(--fallback-color));\n}\n", ""]);

// exports


/***/ }),
/* 453 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nh1[data-v-17fb5efa] {\n  font-size: 24px;\n}\nli[data-v-17fb5efa] {\n  text-align: center;\n}\np[data-v-17fb5efa] {\n  display: inline-block;\n  margin: 10px auto;\n  font-family: serif;\n  font-size: 48px;\n  text-align: center;\n}\np[data-v-17fb5efa]::before {\n  content: \"Life is but a span.\";\n}\n.text-decoration[data-v-17fb5efa] {\n  text-decoration: underline;\n}\n/* hack 1st */\n.border-bottom[data-v-17fb5efa] {\n  border-bottom: 2px solid #007dd4;\n}\n.border-bottom.close[data-v-17fb5efa] {\n  line-height: 0.92;\n  text-shadow: 6px 6px white, 6px -6px white, -6px 6px white, -6px -6px white;\n}\n/* hack 2nd */\n.box-shadow.normal[data-v-17fb5efa] {\n  text-shadow: -2px -2px white, -2px 2px white, 2px -2px white, 2px 2px white;\n  background-size: 1px 1em;\n  box-shadow: inset 0 -0.175em white, inset 0 -0.2em black;\n}\n.box-shadow.color[data-v-17fb5efa] {\n  box-shadow: 0 -2px 0 2px white, 0 0 0 2px #007dd4;\n}\n.box-shadow.color.close[data-v-17fb5efa] {\n  text-shadow: -2px -2px white, -2px 2px white, 2px -2px white, 2px 2px white;\n  box-shadow: inset 0 -0.175em white, inset 0 -0.2em #007dd4;\n}\n.box-shadow.double[data-v-17fb5efa] {\n  box-shadow: inset 0 -0.075em white, inset 0 -0.1em red, inset 0 -0.15em white, inset 0 -0.175em red;\n}\n/* hack 3rd */\n.background-image.solid[data-v-17fb5efa] {\n  background-image: linear-gradient(to bottom, #007dd4 33%, transparent 33%);\n  background-position: 0 1.35em;\n  background-repeat: repeat-x;\n}\n.background-image.solid.close[data-v-17fb5efa] {\n  background-image: linear-gradient(to bottom, #007dd4 33%, transparent 33%);\n  background-position: 0 1.1em;\n  background-repeat: repeat-x;\n  background-size: 2px 6px;\n}\n.background-image.dashed[data-v-17fb5efa] {\n  background-image: linear-gradient(to right, #007dd4 75%, transparent 75%);\n  background-position: 0 1.04em;\n  background-repeat: repeat-x;\n  background-size: 8px 3px;\n}\n.background-image.dotted[data-v-17fb5efa] {\n  background-image: linear-gradient(to right, crimson 50%, transparent 50%);\n  background-position: 0 1.04em;\n  background-repeat: repeat-x;\n  background-size: 6px 3px;\n}\n.background-image.double[data-v-17fb5efa] {\n  background-image: linear-gradient(to bottom, crimson 33%, transparent 33%, transparent 66%, crimson 66%, crimson);\n  background-position: 0 1.03em;\n  background-repeat: repeat-x;\n  background-size: 2px 6px;\n}\n.background-image.waveline[data-v-17fb5efa] {\n  position: relative;\n}\n.background-image.waveline[data-v-17fb5efa]::after {\n  content: '';\n  position: absolute;\n  top: 90%;\n  left: 0;\n  display: block;\n  width: 100%;\n  height: 10px;\n  background: linear-gradient(135deg, transparent, transparent 45%, #007dd4, transparent 55%, transparent 100%), linear-gradient(45deg, transparent, transparent 45%, #007dd4, transparent 55%, transparent 100%);\n  background-size: 20px 20px;\n}\n.background-image.stars[data-v-17fb5efa] {\n  background-image: url(\"https://s3-us-west-2.amazonaws.com/s.cdpn.io/78779/star.svg\");\n  background-position: 0 1.06em;\n  background-size: 10px 9px;\n  background-repeat: repeat-x;\n}\n", ""]);

// exports


/***/ }),
/* 454 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-1809767b] {\n  margin: 20px auto;\n  font-family: serif;\n  font-size: 64px;\n  text-align: center;\n  text-decoration-color: #007dd4;\n}\np[data-v-1809767b]::before {\n  content: \"Life is but a span.\";\n}\n.text-decoration-style[data-v-1809767b]::before,\n.text-decoration-line[data-v-1809767b]::before,\n.text-decoration-skip-ink[data-v-1809767b]::before,\n.text-underline-offset[data-v-1809767b]::before,\n.text-decoration-thickness[data-v-1809767b]::before {\n  content: attr(class);\n}\n.text-decoration-style ~ .solid[data-v-1809767b] {\n  text-decoration-line: underline;\n  text-decoration-style: solid;\n}\n.text-decoration-style ~ .dashed[data-v-1809767b] {\n  text-decoration-line: underline;\n  text-decoration-style: dashed;\n}\n.text-decoration-style ~ .dotted[data-v-1809767b] {\n  text-decoration-line: underline;\n  text-decoration-style: dotted;\n}\n.text-decoration-style ~ .double[data-v-1809767b] {\n  text-decoration-line: underline;\n  text-decoration-style: double;\n}\n.text-decoration-style ~ .wavy[data-v-1809767b] {\n  text-decoration-line: underline;\n  text-decoration-style: wavy;\n}\n.text-decoration-line ~ .underline.overline[data-v-1809767b] {\n  text-decoration-line: overline underline;\n}\n.text-decoration-line ~ .line-through[data-v-1809767b] {\n  text-decoration-line: line-through;\n}\n.text-decoration-skip-ink ~ .auto[data-v-1809767b] {\n  text-decoration-line: underline;\n  text-decoration-skip-ink: auto;\n}\n.text-decoration-skip-ink ~ .none[data-v-1809767b] {\n  text-decoration-line: underline;\n  text-decoration-skip-ink: none;\n}\n.text-underline-offset[data-v-1809767b],\n.text-decoration-thickness[data-v-1809767b] {\n  color: gray;\n}\n", ""]);

// exports


/***/ }),
/* 455 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-193b734a] {\n  margin: 30px auto;\n}\n.outline-1[data-v-193b734a] {\n  width: 100px;\n  height: 100px;\n  border: 10px solid crimson;\n  border-radius: 50%;\n  outline: 5px dashed black;\n  outline-offset: -30px;\n  outline-offset: 10px;\n}\n.outline-2[data-v-193b734a] {\n  width: 200px;\n  height: 150px;\n  padding: 10px;\n  border: 15px solid crimson;\n  background-color: purple;\n  outline: 5px solid yellow;\n  outline-offset: -10px;\n  outline-offset: -15px;\n  outline-offset: -20px;\n  outline-offset: -60px;\n}\n", ""]);

// exports


/***/ }),
/* 456 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-193f75be]::first-line,\nspan[data-v-193f75be]::first-line {\n  font-size: 16px;\n  color: deeppink;\n}\n", ""]);

// exports


/***/ }),
/* 457 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-19ba050e] {\n  overflow: hidden;\n  background: linear-gradient(90deg, #03adfc, #0284c0);\n}\ndiv[data-v-19ba050e] {\n  position: relative;\n  margin: 30vmin auto;\n  width: 30vmin;\n  height: 30vmin;\n  background: #fff;\n}\ndiv[data-v-19ba050e]::before,\ndiv[data-v-19ba050e]::after {\n  content: \"\";\n  position: absolute;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  left: 0;\n}\ndiv[data-v-19ba050e]::before {\n  background: linear-gradient(90deg, rgba(0, 0, 0, 0.3), transparent);\n  transform-origin: 0 50%;\n  transform: translate(100%, 0) skewY(45deg) scaleX(0.6);\n}\ndiv[data-v-19ba050e]::after {\n  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3), transparent);\n  transform-origin: 0 0;\n  transform: translate(0%, 100%) skewX(45deg) scaleY(0.6);\n}\n@keyframes shadowMoveX {\nto {\n    transform: translate(0%, 100%) skewX(50deg) scaleY(0.6);\n}\n}\n@keyframes shadowMoveY {\nto {\n    transform: translate(100%, 0) skewY(40deg) scaleX(0.6);\n}\n}\n", ""]);

// exports


/***/ }),
/* 458 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-1a4a22cc]::first-letter,\nspan[data-v-1a4a22cc]::first-letter {\n  font-size: 16px;\n  text-transform: uppercase;\n  color: deeppink;\n}\n", ""]);

// exports


/***/ }),
/* 459 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.circle[data-v-1b3d07c4] {\n  margin: 10px auto;\n  width: 300px;\n  height: 300px;\n  background: conic-gradient(red, orange, yellow, green, blue, indigo, violet, red);\n  border-radius: 50%;\n  -webkit-mask: radial-gradient(transparent, transparent 110px, #000 110px);\n  mask: radial-gradient(transparent 110px, #000 110px);\n}\n", ""]);

// exports


/***/ }),
/* 460 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.ribbon-sharp {\n  position: absolute;\n  font-size: 0;\n}\n.ribbon-sharp .left,\n.ribbon-sharp .center,\n.ribbon-sharp .right {\n  display: inline-block;\n}\n", ""]);

// exports


/***/ }),
/* 461 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-1d349b8a] {\n  margin: 30px auto;\n  width: 300px;\n  padding: 10px 20px;\n  border: 15px solid transparent;\n  font-size: 20px;\n  text-align: center;\n  border-image: url(" + __webpack_require__(27) + ") 30 30;\n}\n.round[data-v-1d349b8a] {\n  border-image-repeat: round;\n}\n.stretch[data-v-1d349b8a] {\n  border-image-repeat: stretch;\n}\n", ""]);

// exports


/***/ }),
/* 462 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.demo[data-v-1d42b30b] {\n  margin: 30px auto;\n  width: 208px;\n  height: 208px;\n  border-style: solid;\n  border-width: 26px;\n  border-image-source: url(" + __webpack_require__(27) + ");\n  background-color: orange;\n  outline: 1px dashed green;\n}\n.setting[data-v-1d42b30b] {\n  display: flex;\n  justify-content: center;\n}\np[data-v-1d42b30b] {\n  margin: 0 50px;\n  font-size: 18px;\n}\nlabel[data-v-1d42b30b] {\n  cursor: pointer;\n}\ninput[data-v-1d42b30b] {\n  margin-right: 4px;\n  cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 463 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-1d50ca8c] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\ntextarea[data-v-1d50ca8c] {\n  min-height: 3em;\n  padding: 2rem 1rem;\n  border: 10px solid black;\n  font-size: 24px;\n  border-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Cstyle%3Epath%7Banimation:stroke 5s infinite linear%3B%7D%40keyframes stroke%7Bto%7Bstroke-dashoffset:776%3B%7D%7D%3C/style%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%232d3561' /%3E%3Cstop offset='25%25' stop-color='%23c05c7e' /%3E%3Cstop offset='50%25' stop-color='%23f3826f' /%3E%3Cstop offset='100%25' stop-color='%23ffb961' /%3E%3C/linearGradient%3E %3Cpath d='M1.5 1.5 l97 0l0 97l-97 0 l0 -97' stroke-linecap='square' stroke='url(%23g)' stroke-width='3' stroke-dasharray='388'/%3E %3C/svg%3E\") 1;\n  background: #ffd73e33;\n  resize: both;\n}\n", ""]);

// exports


/***/ }),
/* 464 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-1d5ee20d] {\n  margin: 30px auto;\n  width: 300px;\n  padding: 45px 0;\n  border: 30px solid transparent;\n  font-size: 20px;\n  text-align: center;\n  border-image-source: url(" + __webpack_require__(27) + ");\n  border-image-repeat: round;\n  border-image-slice: 26;\n  border-image-width: 13px 26px 39px 26px;\n}\n", ""]);

// exports


/***/ }),
/* 465 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports
exports.push([module.i, "@import url(https://use.fontawesome.com/releases/v5.3.1/css/all.css);", ""]);

// module
exports.push([module.i, "\nmain[data-v-1e6c21f8] {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n.search__box[data-v-1e6c21f8] {\n    box-sizing: content-box;\n    height: 40px;\n    padding: 10px 15px 10px 15px;\n    border-radius: 40px;\n    background: #2f3640;\n}\n.search__txt[data-v-1e6c21f8] {\n    float: left;\n    width: 0;\n    padding: 0;\n    border: none;\n    font-size: 16px;\n    line-height: 40px;\n    color: white;\n    background: none;\n    outline: none;\n    transition: 0.2s;\n}\n.search__box:hover > .search__txt[data-v-1e6c21f8] {\n    width: 240px;\n    padding: 0 6px;\n}\n.search__box:hover > .search__btn[data-v-1e6c21f8] {\n    background: white;\n}\n.search__box:hover > .search__btn i[data-v-1e6c21f8] {\n    color: #34ace0;\n    transition: 0.9s;\n}\n.search__btn[data-v-1e6c21f8] {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    float: right;\n    width: 40px;\n    height: 40px;\n    text-decoration: none;\n    border-radius: 50%;\n    color: #e84118;\n    background: #34ace0;\n}\n.search__btn i[data-v-1e6c21f8] {\n    line-height: 40px;\n    color: white;\n    transition: 0.9s;\n}\n", ""]);

// exports


/***/ }),
/* 466 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.circle-01[data-v-1f3a8f52] {\n  position: relative;\n  margin: 10px auto;\n  width: 300px;\n  height: 300px;\n  overflow: hidden;\n  border-radius: 50%;\n  -webkit-mask: radial-gradient(transparent, transparent 110px, #000 110px);\n  mask: radial-gradient(transparent 110px, #000 110px);\n}\n.circle-01 .left[data-v-1f3a8f52],\n.circle-01 .right[data-v-1f3a8f52] {\n  width: 50%;\n  height: 100%;\n}\n.circle-01 .left[data-v-1f3a8f52] {\n  float: left;\n  background: linear-gradient(to bottom, #EDE604, #FFCC00, #FEAC00, #FF8100, #FF5800, #FF3BA7, #CC42A2);\n}\n.circle-01 .right[data-v-1f3a8f52] {\n  float: right;\n  background: linear-gradient(to bottom, #9ED110, #50B517, #179067, #476EAF, #9f49ac, #CC42A2);\n}\n.circle-01 .top[data-v-1f3a8f52],\n.circle-01 .bottom[data-v-1f3a8f52] {\n  position: absolute;\n  left: 50%;\n  margin-left: -15px;\n  height: 40px;\n  width: 30px;\n  -webkit-filter: blur(5px);\n  filter: blur(5px);\n}\n.circle-01 .top[data-v-1f3a8f52] {\n  top: 0;\n  background: linear-gradient(to right, #EDE604, #9ED110);\n}\n.circle-01 .bottom[data-v-1f3a8f52] {\n  bottom: 0;\n  background: linear-gradient(to right, #DB3FA3, #C443A3);\n}\n.circle-02[data-v-1f3a8f52] {\n  margin: 10px auto;\n  width: 300px;\n  height: 300px;\n  border-radius: 50%;\n  background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);\n  -webkit-mask: radial-gradient(transparent, transparent 110px, #000 110px);\n  mask: radial-gradient(transparent 110px, #000 110px);\n}\n", ""]);

// exports


/***/ }),
/* 467 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.circle[data-v-22988a48] {\n  position: relative;\n  margin: 10px auto;\n  width: 300px;\n  height: 300px;\n  overflow: hidden;\n  border-radius: 50%;\n  -webkit-mask: radial-gradient(transparent, transparent 110px, #000 110px);\n  mask: radial-gradient(transparent 110px, #000 110px);\n}\n.circle-group[data-v-22988a48] {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  transform: scale(1.2);\n  -webkit-filter: blur(15px);\n  filter: blur(15px);\n}\n.circle-group i[data-v-22988a48] {\n  position: absolute;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  clip: rect(0 300px 300px 150px);\n}\n.circle-group i[data-v-22988a48]:after {\n  content: \"\";\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  clip: rect(0 150px 300px 0);\n  border-radius: 50%;\n  background: currentColor;\n  transform: rotate(31deg);\n}\n.circle-group i[data-v-22988a48]:first-of-type {\n  transform: rotate(0deg);\n  color: #9ED110;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(2) {\n  transform: rotate(30deg);\n  color: #50B517;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(3) {\n  transform: rotate(60deg);\n  color: #179067;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(4) {\n  transform: rotate(90deg);\n  color: #476EAF;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(5) {\n  transform: rotate(120deg);\n  color: #9f49ac;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(6) {\n  transform: rotate(150deg);\n  color: #CC42A2;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(7) {\n  transform: rotate(180deg);\n  color: #FF3BA7;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(8) {\n  transform: rotate(210deg);\n  color: #FF5800;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(9) {\n  transform: rotate(240deg);\n  color: #FF8100;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(10) {\n  transform: rotate(270deg);\n  color: #FEAC00;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(11) {\n  transform: rotate(300deg);\n  color: #FFCC00;\n}\n.circle-group i[data-v-22988a48]:nth-of-type(12) {\n  transform: rotate(330deg);\n  color: #EDE604;\n}\n", ""]);

// exports


/***/ }),
/* 468 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.cursor[data-v-22cd469a] {\n  margin: 10px auto;\n  width: 400px;\n  height: 300px;\n  background-color: #007dd4;\n  cursor: url(" + __webpack_require__(697) + "), pointer;\n}\n", ""]);

// exports


/***/ }),
/* 469 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nsvg[data-v-230a9766] {\n  width: 100%;\n  height: 100%;\n  transition: all .5s;\n}\nsvg .purple[data-v-230a9766] {\n  fill: #41225d;\n}\nsvg .white[data-v-230a9766] {\n  fill: white;\n}\nsvg .yellow[data-v-230a9766] {\n  fill: #d7a611;\n}\nsvg .ball[data-v-230a9766] {\n  fill: #d06a0f;\n}\nsvg .numbers[data-v-230a9766] {\n  fill: white;\n  stroke: #41225d;\n  stroke-width: 4.167;\n}\nsvg .lakers[data-v-230a9766] {\n  fill: white;\n  stroke: #41225d;\n  stroke-width: 2;\n}\nsvg .skin[data-v-230a9766] {\n  fill: #603b17;\n}\nsvg:hover .purple[data-v-230a9766] {\n  fill: #d7a611;\n}\nsvg:hover .yellow[data-v-230a9766] {\n  fill: #41225d;\n}\nsvg:hover .skin[data-v-230a9766] {\n  fill: #804d1b;\n}\n", ""]);

// exports


/***/ }),
/* 470 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.photo-frame[data-v-230a9766] {\n    margin: 10px auto;\n    box-sizing: border-box;\n    width: min(400px, 100vh - 200px);\n    height: min(400px, 100vh - 200px);\n    padding: min(40px, (100vh - 200px) / 10);\n    border: min(20px, (100vh - 200px) / 20) solid black;\n    box-shadow:\n        -0px 0px 2px #777,\n        -1px 1px 1px #888,\n        -2px 2px 2px #999,\n        -3px 3px 3px #aaa,\n        -4px 4px 3px #bbb,\n        -5px 5px 3px #ccc,\n        inset -3px 3px 3px #aaa;\n}\n", ""]);

// exports


/***/ }),
/* 471 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-24446640] {\n  margin: 20px 0;\n}\n.first[data-v-24446640],\n.second[data-v-24446640] {\n  text-align: justify;\n}\n.third[data-v-24446640],\n.fourth[data-v-24446640] {\n  text-align-last: justify;\n}\n", ""]);

// exports


/***/ }),
/* 472 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput[data-v-244ae814] {\n  padding: 10px;\n  outline: none;\n}\n", ""]);

// exports


/***/ }),
/* 473 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-256736da] {\n  margin: 10px auto;\n}\n.outline[data-v-256736da] {\n  width: 100px;\n  height: 100px;\n  border: 10px solid crimson;\n  border-radius: 50%;\n  outline: 5px dashed black;\n  -moz-outline-radius: 50%;\n}\n", ""]);

// exports


/***/ }),
/* 474 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.demo[data-v-2601acf1] {\n  box-sizing: border-box;\n  width: 400px;\n  height: 300px;\n  margin: 10px;\n  border: 10px dashed #000;\n  padding: 20px;\n  background-image: url(" + __webpack_require__(6) + ");\n  background-repeat: no-repeat;\n  background-color: #007dd4;\n  background-clip: border-box;\n  background-clip: padding-box;\n  background-clip: content-box;\n}\n", ""]);

// exports


/***/ }),
/* 475 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-260fc472] {\n  margin: 10px auto;\n}\n.outer[data-v-260fc472] {\n  padding: 10px 0;\n  background: url(" + __webpack_require__(5) + ");\n  background-size: contain;\n}\n.inner[data-v-260fc472] {\n  width: 100px;\n  height: 100px;\n  border: 10px solid rgba(255, 255, 255, 0.1);\n  background-color: #FFF;\n  background-clip: padding-box;\n}\n", ""]);

// exports


/***/ }),
/* 476 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.image[data-v-26139e06] {\n  overflow: hidden;\n  resize: horizontal;\n}\n", ""]);

// exports


/***/ }),
/* 477 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-261ddbf3] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.demo[data-v-261ddbf3] {\n  display: inline-block;\n  width: 220px;\n  height: 60px;\n  padding: 8px;\n  border: 4px solid transparent;\n  text-align: center;\n  border-radius: 10px;\n  background: linear-gradient(#B7D3F0, #6B90EE) content-box, linear-gradient(#c769c2, #211A4D) padding-box, linear-gradient(#F1F48C, #8BE5DC) border-box;\n}\n", ""]);

// exports


/***/ }),
/* 478 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-262bf374] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  font-family: sans-serif;\n  font-size: 100px;\n  font-weight: bold;\n  text-transform: uppercase;\n  background: black;\n}\n.p1[data-v-262bf374] {\n  color: transparent;\n  background-image: url(" + __webpack_require__(5) + ");\n  background-repeat: no-repeat;\n  background-position: 50% 78%;\n  -webkit-background-clip: text;\n  background-clip: text;\n}\n.p2[data-v-262bf374] {\n  color: transparent;\n  background-image: url(https://media.giphy.com/media/YnkuiP6WFNM2ezj0XV/giphy.gif);\n  background-size: contain;\n  background-position: top left;\n  -webkit-background-clip: text;\n  background-clip: text;\n}\n", ""]);

// exports


/***/ }),
/* 479 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput[data-v-26b16a7e]:read-only,\np[data-v-26b16a7e]:read-only {\n  font-size: 40px;\n  color: purple;\n  background-color: gold;\n}\n", ""]);

// exports


/***/ }),
/* 480 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv p[data-v-294b7e87] {\n  display: inline-block;\n  width: 100px;\n  height: 300px;\n  background: #007dd4;\n}\ndiv p[data-v-294b7e87]:first-child {\n  vertical-align: -10%;\n  vertical-align: -20px;\n}\n", ""]);

// exports


/***/ }),
/* 481 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.glitch[data-v-295965a6] {\n  position: relative;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  margin: 0;\n  width: 7.5em;\n  padding: 0;\n  font-size: 6em;\n  font-weight: bold;\n  color: black;\n}\n.glitch[data-v-295965a6]::before,\n.glitch[data-v-295965a6]::after {\n  content: attr(data-text);\n  position: absolute;\n  top: 0;\n  overflow: hidden;\n  clip: rect(0, 900px, 0, 0);\n  background: #fff;\n}\n.glitch[data-v-295965a6]:before {\n  left: -2px;\n  text-shadow: 1px 0 blue;\n  animation: noise-anim-2 3s infinite linear alternate-reverse;\n}\n.glitch[data-v-295965a6]:after {\n  left: 2px;\n  text-shadow: -1px 0 red;\n  animation: noise-anim 2s infinite linear alternate-reverse;\n}\n@keyframes noise-anim {\n0% {\n    clip: rect(40px, 9999px, 35px, 0);\n}\n5% {\n    clip: rect(64px, 9999px, 50px, 0);\n}\n10% {\n    clip: rect(27px, 9999px, 26px, 0);\n}\n15% {\n    clip: rect(72px, 9999px, 55px, 0);\n}\n20% {\n    clip: rect(74px, 9999px, 53px, 0);\n}\n25% {\n    clip: rect(16px, 9999px, 30px, 0);\n}\n30% {\n    clip: rect(7px, 9999px, 52px, 0);\n}\n35% {\n    clip: rect(21px, 9999px, 70px, 0);\n}\n40% {\n    clip: rect(55px, 9999px, 19px, 0);\n}\n45% {\n    clip: rect(28px, 9999px, 31px, 0);\n}\n50% {\n    clip: rect(25px, 9999px, 94px, 0);\n}\n55% {\n    clip: rect(46px, 9999px, 54px, 0);\n}\n60% {\n    clip: rect(82px, 9999px, 15px, 0);\n}\n65% {\n    clip: rect(29px, 9999px, 82px, 0);\n}\n70% {\n    clip: rect(22px, 9999px, 21px, 0);\n}\n75% {\n    clip: rect(46px, 9999px, 66px, 0);\n}\n80% {\n    clip: rect(26px, 9999px, 73px, 0);\n}\n85% {\n    clip: rect(33px, 9999px, 11px, 0);\n}\n90% {\n    clip: rect(50px, 9999px, 25px, 0);\n}\n95% {\n    clip: rect(88px, 9999px, 23px, 0);\n}\n100% {\n    clip: rect(19px, 9999px, 67px, 0);\n}\n}\n@keyframes noise-anim-2 {\n0% {\n    clip: rect(41px, 9999px, 25px, 0);\n}\n5% {\n    clip: rect(57px, 9999px, 17px, 0);\n}\n10% {\n    clip: rect(84px, 9999px, 8px, 0);\n}\n15% {\n    clip: rect(70px, 9999px, 26px, 0);\n}\n20% {\n    clip: rect(53px, 9999px, 16px, 0);\n}\n25% {\n    clip: rect(39px, 9999px, 14px, 0);\n}\n30% {\n    clip: rect(14px, 9999px, 78px, 0);\n}\n35% {\n    clip: rect(68px, 9999px, 74px, 0);\n}\n40% {\n    clip: rect(78px, 9999px, 100px, 0);\n}\n45% {\n    clip: rect(85px, 9999px, 17px, 0);\n}\n50% {\n    clip: rect(12px, 9999px, 65px, 0);\n}\n55% {\n    clip: rect(46px, 9999px, 24px, 0);\n}\n60% {\n    clip: rect(55px, 9999px, 4px, 0);\n}\n65% {\n    clip: rect(23px, 9999px, 2px, 0);\n}\n70% {\n    clip: rect(10px, 9999px, 59px, 0);\n}\n75% {\n    clip: rect(38px, 9999px, 92px, 0);\n}\n80% {\n    clip: rect(22px, 9999px, 93px, 0);\n}\n85% {\n    clip: rect(93px, 9999px, 100px, 0);\n}\n90% {\n    clip: rect(1px, 9999px, 23px, 0);\n}\n95% {\n    clip: rect(65px, 9999px, 6px, 0);\n}\n100% {\n    clip: rect(56px, 9999px, 98px, 0);\n}\n}\n", ""]);

// exports


/***/ }),
/* 482 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-29b25d18] {\n  text-align: center;\n}\nbutton[data-v-29b25d18] {\n  position: relative;\n  display: inline-block;\n  min-width: 60px;\n  padding: 0 10px;\n  height: 30px;\n  line-height: 30px;\n  text-align: center;\n  border: none;\n  outline: none;\n  color: #fff;\n  background-color: #007dd4;\n  cursor: pointer;\n}\nbutton[data-v-29b25d18]::after {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 120px;\n  height: 60px;\n  transform: translate(-50%, -50%);\n}\n", ""]);

// exports


/***/ }),
/* 483 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nbutton[data-v-29d20cd6] {\n  -ms-touch-action: manipulation;\n  touch-action: manipulation;\n}\n", ""]);

// exports


/***/ }),
/* 484 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nimg[data-v-29f7ae38] {\n  width: 400px;\n}\n.svg-filter[data-v-29f7ae38] {\n  filter: url(#change);\n}\n", ""]);

// exports


/***/ }),
/* 485 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-2b3b7a36] {\n  width: 194px;\n  height: 363px;\n  word-wrap: break-word;\n  -webkit-mask-image: url(" + __webpack_require__(10) + ");\n  mask-image: url(" + __webpack_require__(10) + ");\n}\n", ""]);

// exports


/***/ }),
/* 486 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.container[data-v-2b4991b7] {\n  position: relative;\n  margin: 10px auto;\n  width: 600px;\n  height: 460px;\n  border: 10px solid #c7254e;\n}\n.img-left[data-v-2b4991b7],\n.img-right[data-v-2b4991b7] {\n  width: 100%;\n  height: 100%;\n  -webkit-background-size: cover;\n  background-size: cover;\n}\n.img-left[data-v-2b4991b7] {\n  background: url(" + __webpack_require__(6) + ");\n}\n.img-right[data-v-2b4991b7] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  background: url(" + __webpack_require__(6) + ");\n  background-position: 115px 0;\n  -webkit-mask-image: -webkit-linear-gradient(left top, transparent 50%, white 50%);\n}\n", ""]);

// exports


/***/ }),
/* 487 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 488 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 489 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-2cc9f372] {\n  font-size: 16px;\n  -webkit-column-count: 4;\n  -moz-column-count: 4;\n  column-count: 4;\n}\n", ""]);

// exports


/***/ }),
/* 490 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.email[data-v-2f0cf5c0]::before {\n  content: attr(data-done) \" Email: \";\n}\n.coffee[data-v-2f0cf5c0]::after {\n  content: calc(3.6);\n  content: \"1\" \"2\" \"3\";\n  content: \"1 2 3\";\n}\n.avatar[data-v-2f0cf5c0]::before {\n  content: url(" + __webpack_require__(10) + ");\n}\n", ""]);

// exports


/***/ }),
/* 491 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 492 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 493 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.icon[data-v-2f6807d2] {\n  display: inline-block;\n  box-sizing: content-box;\n  width: 50px;\n  height: 50px;\n  overflow: hidden;\n}\n.icon-original[data-v-2f6807d2] {\n  background: url(" + __webpack_require__(96) + ") no-repeat center;\n}\n.icon-shadow[data-v-2f6807d2] {\n  position: relative;\n  left: -50px;\n  border-right: 50px solid transparent;\n  background: url(" + __webpack_require__(96) + ") no-repeat center;\n}\n.icon-color[data-v-2f6807d2] {\n  float: left;\n  margin-top: 30px;\n  width: 50px;\n  height: 50px;\n  cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 494 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.ribbon-alphabet {\n  position: relative;\n  display: inline-block;\n  overflow: hidden;\n}\n", ""]);

// exports


/***/ }),
/* 495 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput[data-v-315751e7]:read-write,\np[data-v-315751e7]:read-write {\n  font-size: 40px;\n  color: purple;\n  background-color: gold;\n}\n", ""]);

// exports


/***/ }),
/* 496 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nimg[data-v-31584493] {\n    width: 200px;\n    height: auto;\n}\n", ""]);

// exports


/***/ }),
/* 497 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput[data-v-31ce1244],\ntextarea[data-v-31ce1244],\n[contenteditable][data-v-31ce1244] {\n  color: red !important;\n  /* 光标的颜色*/\n  text-shadow: 0 0 0 green;\n  /* 文本的颜色 */\n  -webkit-text-fill-color: transparent;\n}\ninput[data-v-31ce1244]::-webkit-input-placeholder,\ntextarea[data-v-31ce1244]::-webkit-input-placeholder,\n[contenteditable][data-v-31ce1244]::-webkit-input-placeholder {\n  color: red !important;\n  /* 光标的颜色*/\n  text-shadow: none;\n  -webkit-text-fill-color: initial;\n}\n@supports (caret-color: red) {\ninput,\n  textarea,\n  [contenteditable] {\n    color: green;\n    /* 文本颜色 */\n    caret-color: red;\n    /* 光标颜色 */\n}\ninput::-webkit-input-placeholder,\n  textarea::-webkit-input-placeholder,\n  [contenteditable]::-webkit-input-placeholder {\n    color: inherit;\n    caret-color: inherit;\n}\n}\n", ""]);

// exports


/***/ }),
/* 498 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput[data-v-3235da7a]:user-invalid {\n  border: 1px solid red;\n}\ninput[data-v-3235da7a]:invalid {\n  border: 1px solid rgba(255, 0, 0, 0.9);\n}\n", ""]);

// exports


/***/ }),
/* 499 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.box-reflect[data-v-32b3e176] {\n  margin: 20px auto;\n  width: 200px;\n  height: 200px;\n  background-image: url(" + __webpack_require__(6) + ");\n  background-size: contain;\n}\n.above[data-v-32b3e176] {\n  -webkit-box-reflect: above;\n}\n.right[data-v-32b3e176] {\n  -webkit-box-reflect: right;\n}\n.below[data-v-32b3e176] {\n  -webkit-box-reflect: below;\n}\n.left[data-v-32b3e176] {\n  -webkit-box-reflect: left;\n}\n.inherit[data-v-32b3e176] {\n  position: relative;\n  margin-top: 220px;\n}\n.inherit[data-v-32b3e176]::before {\n  content: \"\";\n  position: absolute;\n  top: 100%;\n  left: 0;\n  right: 0;\n  bottom: -100%;\n  background: inherit;\n  transform: rotateX(180deg);\n}\n", ""]);

// exports


/***/ }),
/* 500 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 501 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 502 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 503 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 504 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 505 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 506 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 507 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 508 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 509 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 510 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.filter-list[data-v-35317b2f] {\n  display: flex;\n  flex-wrap: wrap;\n}\n.filter-list .filter-item[data-v-35317b2f] {\n  margin: 0 10px 10px 0;\n}\n.filter-list img[data-v-35317b2f] {\n  width: 200px;\n  cursor: pointer;\n}\n.filter-list img[data-v-35317b2f]:hover {\n  transition: filter .5s;\n  filter: none !important;\n}\n.filter-list p[data-v-35317b2f] {\n  text-align: center;\n  letter-spacing: 0.1em;\n}\n.filter-list .grayscale[data-v-35317b2f] {\n  filter: grayscale(1);\n}\n.filter-list .sepia[data-v-35317b2f] {\n  filter: sepia(1);\n}\n.filter-list .hue-rotate[data-v-35317b2f] {\n  filter: hue-rotate(45deg);\n}\n.filter-list .saturate[data-v-35317b2f] {\n  filter: saturate(6);\n}\n.filter-list .brightness[data-v-35317b2f] {\n  filter: brightness(0.5);\n}\n.filter-list .invert[data-v-35317b2f] {\n  filter: invert(0.8);\n}\n.filter-list .opacity[data-v-35317b2f] {\n  filter: opacity(0.5);\n}\n.filter-list .contrast[data-v-35317b2f] {\n  filter: contrast(200%);\n}\n.filter-list .blur[data-v-35317b2f] {\n  filter: blur(10px);\n}\n.filter-list .drop-shadow[data-v-35317b2f] {\n  filter: drop-shadow(10px 10px 5px blue);\n}\n", ""]);

// exports


/***/ }),
/* 511 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.disable[data-v-357368e0] {\n  pointer-events: none;\n}\n", ""]);

// exports


/***/ }),
/* 512 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 513 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 514 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 515 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-377d0934] {\n  padding: 30px;\n  border: 1px dashed black;\n  text-indent: 200px;\n  color: purple;\n  background-size: contain;\n  background: url(" + __webpack_require__(10) + ") no-repeat left, url(" + __webpack_require__(6) + ") no-repeat right;\n}\n", ""]);

// exports


/***/ }),
/* 516 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-383612f8] {\n  font-size: 40px;\n  text-align: center;\n}\n.capitalize[data-v-383612f8] {\n  text-transform: capitalize;\n}\np.first-letter[data-v-383612f8]::first-letter {\n  text-transform: capitalize;\n}\n", ""]);

// exports


/***/ }),
/* 517 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 518 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput[type=\"number\"][data-v-3d3edb5a]::-webkit-outer-spin-button,\ninput[type=\"number\"][data-v-3d3edb5a]::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n}\n", ""]);

// exports


/***/ }),
/* 519 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-3e1b0200] {\n  position: relative;\n  padding: 0;\n  overflow: hidden;\n}\n.image[data-v-3e1b0200] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transform: scale(1.8);\n  animation: scaleImage 5s ease-out forwards;\n}\n.text[data-v-3e1b0200] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  font-family: 'Roboto', Arial, sans-serif;\n  font-size: 200px;\n  font-weight: 700;\n  line-height: 1.2;\n  letter-spacing: 0.05em;\n  white-space: nowrap;\n  text-transform: uppercase;\n  color: white;\n  background-color: black;\n  mix-blend-mode: multiply;\n  opacity: 0;\n  animation: fadeInText 3s 2s ease-out forwards;\n}\n@keyframes scaleImage {\n100% {\n    transform: scale(1);\n}\n}\n@keyframes fadeInText {\n100% {\n    opacity: 1;\n}\n}\n", ""]);

// exports


/***/ }),
/* 520 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-3e2b61ad] {\n  margin: 10px auto;\n}\n.circle[data-v-3e2b61ad] {\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  background-color: red;\n}\n.oval[data-v-3e2b61ad] {\n  width: 100px;\n  height: 50px;\n  border-radius: 50px / 25px;\n  background-color: red;\n}\n.cone[data-v-3e2b61ad] {\n  width: 0;\n  height: 0;\n  border-left: 70px solid transparent;\n  border-right: 70px solid transparent;\n  border-top: 100px solid red;\n  border-radius: 50%;\n}\n.half-circle.top[data-v-3e2b61ad] {\n  width: 100px;\n  height: 50px;\n  border-radius: 50px 50px 0 0;\n  background-color: red;\n}\n.half-oval.top[data-v-3e2b61ad] {\n  width: 100px;\n  height: 25px;\n  border-radius: 50% / 100% 100% 0 0;\n  background-color: red;\n}\n.half-oval.left[data-v-3e2b61ad] {\n  width: 100px;\n  height: 50px;\n  border-radius: 100% 0 0 100% / 50%;\n  background-color: red;\n}\n.half-oval.quarter[data-v-3e2b61ad] {\n  width: 100px;\n  height: 50px;\n  border-radius: 100% 0 0 0;\n  background-color: red;\n}\n.capsule[data-v-3e2b61ad] {\n  width: 100px;\n  height: 50px;\n  border-radius: 50% / 100%;\n  background-color: red;\n}\n.triangle-top-left[data-v-3e2b61ad] {\n  width: 0;\n  height: 0;\n  border-top: 100px solid red;\n  border-right: 100px solid transparent;\n}\n.parallelogram[data-v-3e2b61ad] {\n  width: 150px;\n  height: 100px;\n  background: red;\n  transform: skew(20deg);\n}\n.trapezoid[data-v-3e2b61ad] {\n  box-sizing: content-box;\n  width: 100px;\n  height: 0;\n  border-right: 50px solid transparent;\n  border-left: 50px solid transparent;\n  border-bottom: 100px solid red;\n}\n.pentagram[data-v-3e2b61ad] {\n  position: relative;\n  margin: 70px auto;\n  display: block;\n  width: 0px;\n  height: 0px;\n  border-right: 100px solid transparent;\n  border-left: 100px solid transparent;\n  border-bottom: 70px solid red;\n  transform: rotate(35deg);\n  color: red;\n}\n.pentagram[data-v-3e2b61ad]::before,\n.pentagram[data-v-3e2b61ad]::after {\n  content: \"\";\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n}\n.pentagram[data-v-3e2b61ad]::before {\n  top: -45px;\n  left: -65px;\n  border-bottom: 80px solid red;\n  border-left: 30px solid transparent;\n  border-right: 30px solid transparent;\n  transform: rotate(-35deg);\n}\n.pentagram[data-v-3e2b61ad]::after {\n  top: 3px;\n  left: -105px;\n  border-bottom: 70px solid red;\n  border-right: 100px solid transparent;\n  border-left: 100px solid transparent;\n  transform: rotate(-70deg);\n}\n.hexagonal-star[data-v-3e2b61ad] {\n  position: relative;\n  width: 0;\n  height: 0;\n  margin-bottom: 40px;\n  border-bottom: 100px solid red;\n  border-right: 50px solid transparent;\n  border-left: 50px solid transparent;\n}\n.hexagonal-star[data-v-3e2b61ad]::after {\n  content: \"\";\n  position: absolute;\n  top: 30px;\n  left: -50px;\n  border-top: 100px solid red;\n  border-right: 50px solid transparent;\n  border-left: 50px solid transparent;\n}\n.paper-plane[data-v-3e2b61ad] {\n  width: 0;\n  height: 0;\n  border-top: 25px solid red;\n  /* 设置相邻的两个边框，边框宽度小于其他两边 */\n  border-right: 25px solid red;\n  border-bottom: 50px solid transparent;\n  /* 其他边框颜色设置为透明色，则其会被隐藏掉 */\n  border-left: 50px solid transparent;\n}\n.square[data-v-3e2b61ad] {\n  width: 100px;\n  height: 100px;\n  border: 20px solid red;\n}\n.elliptic-square[data-v-3e2b61ad] {\n  width: 100px;\n  height: 100px;\n  border: 20px solid red;\n  border-radius: 20px;\n}\n.more-elliptic-square[data-v-3e2b61ad] {\n  width: 100px;\n  height: 100px;\n  border: 20px solid red;\n  border-radius: 50px;\n}\n.hoe[data-v-3e2b61ad] {\n  width: 30px;\n  height: 100px;\n  border: 10px solid red;\n  border-bottom-color: transparent;\n  border-left-color: transparent;\n}\n.olecranon[data-v-3e2b61ad] {\n  width: 60px;\n  height: 50px;\n  border-top: 20px solid red;\n  border-top-left-radius: 60px;\n}\n.horns[data-v-3e2b61ad] {\n  width: 50px;\n  height: 80px;\n  border-right: 20px solid red;\n  border-left: 20px solid red;\n  border-radius: 20px / 30px;\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.heart[data-v-3e2b61ad] {\n  position: relative;\n  top: 40px;\n  width: 100px;\n  height: 100px;\n  background-color: red;\n  transform: rotate(-45deg);\n}\n.heart[data-v-3e2b61ad]::before,\n.heart[data-v-3e2b61ad]::after {\n  content: \"\";\n  position: absolute;\n  background: inherit;\n}\n.heart[data-v-3e2b61ad]::before {\n  width: 100px;\n  height: 50px;\n  top: -49px;\n  border-radius: 50px 50px 0 0;\n}\n.heart[data-v-3e2b61ad]::after {\n  width: 50px;\n  height: 100px;\n  right: -49px;\n  border-radius: 0 50px 50px 0;\n}\n", ""]);

// exports


/***/ }),
/* 521 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-3e352360] {\n  font-size: 128px;\n  text-align: center;\n  font-weight: bold;\n  -webkit-text-stroke: purple 6px;\n  color: orange;\n}\n", ""]);

// exports


/***/ }),
/* 522 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-3e438438] {\n  position: relative;\n  overflow: hidden;\n}\n.blurred[data-v-3e438438] {\n  position: absolute;\n  top: -40px;\n  right: -40px;\n  bottom: -40px;\n  left: -40px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-image: url(https://res.cloudinary.com/inventorylab/image/upload/v1571836192/IMG_0152_rfi1he.jpg);\n  background-size: 1512px 2016px;\n  background-position: center -300px;\n  background-attachment: fixed;\n  filter: blur(20px);\n}\n.overlay[data-v-3e438438] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: rgba(0, 0, 0, 0.6);\n}\n.sharp[data-v-3e438438] {\n  position: absolute;\n  top: 124px;\n  left: 344px;\n  margin: -100px 0 0 -100px;\n  width: 200px;\n  height: 200px;\n  border-radius: 100%;\n  background-image: url(https://res.cloudinary.com/inventorylab/image/upload/v1571836192/IMG_0152_rfi1he.jpg);\n  background-size: 1512px 2016px;\n  background-position: center -340px;\n  background-attachment: fixed;\n  box-shadow: inset 0 0 0 5px white, 0 0 20px rgba(0, 0, 0, 0.2);\n}\n", ""]);

// exports


/***/ }),
/* 523 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.heart[data-v-3e8df1ed] {\n  display: block;\n  margin: 100px auto 0;\n  width: 300px;\n  height: 300px;\n  animation: pound .3s infinite;\n}\n@keyframes pound {\nfrom {\n    transform: none;\n}\nto {\n    transform: scale(1.2);\n}\n}\n", ""]);

// exports


/***/ }),
/* 524 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.ribbon-square {\n  position: absolute;\n}\n", ""]);

// exports


/***/ }),
/* 525 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nform[data-v-430d66c4] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 50px;\n}\nform textarea[data-v-430d66c4] {\n  width: 400px;\n  height: 100px;\n  padding: 16px;\n}\n.alphabet-name[data-v-430d66c4] {\n  display: flex;\n  justify-content: center;\n}\n", ""]);

// exports


/***/ }),
/* 526 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.tai-chi[data-v-463af613] {\n  position: relative;\n  display: block;\n  box-sizing: content-box;\n  margin: 0 auto;\n  width: 192px;\n  height: 96px;\n  border-width: 2px 2px 98px 2px;\n  border-color: #000;\n  border-style: solid;\n  border-radius: 100%;\n  background: #fff;\n}\n.tai-chi[data-v-463af613]::before,\n.tai-chi[data-v-463af613]::after {\n  content: '';\n  position: absolute;\n  top: 50%;\n  width: 24px;\n  height: 24px;\n  border-radius: 100%;\n}\n.tai-chi[data-v-463af613]::before {\n  left: 0;\n  border: 36px solid #000;\n  background: #fff;\n}\n.tai-chi[data-v-463af613]::after {\n  left: 50%;\n  border: 36px solid #fff;\n  background: #000;\n}\n", ""]);

// exports


/***/ }),
/* 527 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-4795ea31] {\n  font-size: 128px;\n  background: linear-gradient(90deg, #d64971 0%, #962086 27%, #3338d4 57%, #60ccf7 100%);\n  -webkit-text-fill-color: transparent;\n  -webkit-background-clip: text;\n  background-clip: text;\n}\n", ""]);

// exports


/***/ }),
/* 528 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/* Color */\n[data-v-47c5774d]:root {\n  --red: #F44336;\n  --pink: #E91E63;\n  --purple: #9C27B0;\n  --deepPurple: #673AB7;\n  --indigo: #3F51B5;\n  --blue: #2196F3;\n  --lightBlue: #03A9F4;\n  --cyan: #00BCD4;\n  --teal: #009688;\n  --green: #4CAF50;\n  --lightGreen: #8BC34A;\n  --lime: #CDDC39;\n  --yellow: #FFEB3B;\n  --amber: #FFC107;\n  --orange: #FF9800;\n  --deepOrange: #FF5722;\n  --brown: #795548;\n  --grey: #9E9E9E;\n  --blueGrey: #607D8B;\n}\n/* Color */\np[data-v-47c5774d] {\n  line-height: 1.68;\n}\n.wrapper[data-v-47c5774d] {\n  margin: 0 auto;\n  width: 62%;\n  padding: 30px;\n}\n.circle[data-v-47c5774d] {\n  float: left;\n  width: 250px;\n  height: 250px;\n  border-radius: 50%;\n  background-color: #40a977;\n}\n.shape[data-v-47c5774d] {\n  margin: 10px;\n  -webkit-shape-outside: circle();\n  shape-outside: circle();\n}\n", ""]);

// exports


/***/ }),
/* 529 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.fusion[data-v-480aed8a] {\n  position: relative;\n  width: 300px;\n  height: 200px;\n  filter: contrast(20);\n  background: #fff;\n}\n.fusion[data-v-480aed8a]::before,\n.fusion[data-v-480aed8a]::after {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  border-radius: 50%;\n  transform: translateY(-50%);\n  filter: blur(4px);\n}\n.fusion[data-v-480aed8a]::before {\n  left: 40px;\n  width: 120px;\n  height: 120px;\n  background: #000;\n  animation: move-ball 4s ease-out infinite;\n}\n.fusion[data-v-480aed8a]::after {\n  right: 40px;\n  width: 80px;\n  height: 80px;\n  background: #f00;\n  animation: move-ball-2 4s ease-out infinite;\n}\n@keyframes move-ball {\n50% {\n    left: 140px;\n}\n}\n@keyframes move-ball-2 {\n50% {\n    right: 180px;\n}\n}\n", ""]);

// exports


/***/ }),
/* 530 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/* Color */\n[data-v-484ec08d]:root {\n  --red: #F44336;\n  --pink: #E91E63;\n  --purple: #9C27B0;\n  --deepPurple: #673AB7;\n  --indigo: #3F51B5;\n  --blue: #2196F3;\n  --lightBlue: #03A9F4;\n  --cyan: #00BCD4;\n  --teal: #009688;\n  --green: #4CAF50;\n  --lightGreen: #8BC34A;\n  --lime: #CDDC39;\n  --yellow: #FFEB3B;\n  --amber: #FFC107;\n  --orange: #FF9800;\n  --deepOrange: #FF5722;\n  --brown: #795548;\n  --grey: #9E9E9E;\n  --blueGrey: #607D8B;\n}\n/* Color */\ndiv[data-v-484ec08d] {\n  margin: 10px auto;\n}\npre[data-v-484ec08d] {\n  margin-top: 30px;\n}\n.track[data-v-484ec08d] {\n  width: 100px;\n  height: 100px;\n  border: 10px solid #c7254e;\n  border-radius: 50%;\n  box-shadow: 0 0 0 10px #40a977, 0 0 0 20px #007dd4, 0 0 0 10px #000 inset;\n}\n", ""]);

// exports


/***/ }),
/* 531 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.saying[data-v-48ff1fe6] {\n  font-size: 36px;\n}\n.saying[data-v-48ff1fe6]::before {\n  content: open-quote;\n}\n.saying[data-v-48ff1fe6]::after {\n  content: close-quote;\n}\n", ""]);

// exports


/***/ }),
/* 532 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Pacifico&display=swap);", ""]);

// module
exports.push([module.i, "\nmain[data-v-491257a5] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: #000;\n}\n.svg[data-v-491257a5] {\n  position: absolute;\n  width: 0;\n  height: 0;\n}\n.clipped[data-v-491257a5] {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 500px;\n  height: 500px;\n}\n.clipped[data-v-491257a5]::before,\n.clipped[data-v-491257a5]::after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  clip-path: url(#my-clip-path);\n}\n.clipped[data-v-491257a5]::before {\n  border-radius: 170px;\n  box-shadow: 0 0 15px 10px crimson inset,\n            0 0 15px 20px purple inset,\n            0 0 10px 30px teal inset,\n            0 0 10px 40px turquoise inset,\n            0 0 10px 50px yellowgreen inset,\n            0 0 5px 60px gold inset,\n            0 0 10px 70px yellow inset,\n            0 0 15px 80px orange inset,\n            0 0 15px 90px orangered inset\n        ;\n}\n.clipped[data-v-491257a5]::after {\n  margin: 90px;\n  background: #333;\n  opacity: .45;\n}\n.clipped__content[data-v-491257a5] {\n  position: relative;\n  z-index: 1;\n  max-width: 60%;\n  font-family: 'Pacifico', sans-serif;\n  font-size: 35px;\n  text-align: center;\n  color: #FFF;\n}\n", ""]);

// exports


/***/ }),
/* 533 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Luckiest+Guy&display=swap);", ""]);

// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),
/* 534 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-4952f059] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  font-family: \"Luckiest Guy\", cursive;\n  background: radial-gradient(circle, #fffc00 0%, #f0ed17 100%);\n}\nh1[data-v-4952f059] {\n  margin: 0;\n  padding: 0;\n  font-size: 8em;\n  color: white;\n  text-shadow: 0 0.1em 20px #000000, 0.05em -0.03em 0 #000000, 0.05em 0.005em 0 #000000, 0em 0.08em 0 #000000, 0.05em 0.08em 0 #000000, 0px -0.03em 0 #000000, -0.03em -0.03em 0 #000000, -0.03em 0.08em 0 #000000, -0.03em 0 0 #000000;\n}\nh1 span[data-v-4952f059] {\n  display: inline-block;\n  transform: scale(0.9);\n}\nh1 span[data-v-4952f059]:first-child {\n  animation: bopA 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards infinite alternate;\n}\nh1 span[data-v-4952f059]:last-child {\n  animation: bopB 1s 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards infinite alternate;\n}\n@keyframes bopA {\n0% {\n    transform: scale(0.9);\n}\n50%,\n  100% {\n    transform: scale(1);\n}\n}\n@keyframes bopB {\n0% {\n    transform: scale(0.9);\n}\n80%,\n  100% {\n    transform: scale(1) rotateZ(-3deg);\n}\n}\n", ""]);

// exports


/***/ }),
/* 535 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.ribbon-alphabet-q1 .ribbon-sharp:nth-child(3) .left {\n  transform: rotate(-90deg);\n}\n.ribbon-alphabet-q1 .ribbon-sharp:nth-child(4) .right {\n  transform: rotate(90deg);\n}\n", ""]);

// exports


/***/ }),
/* 536 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.parent[data-v-4aaaadc2] {\n  height: 500px;\n  overflow: auto;\n  border: 1px solid #ccc;\n  background: linear-gradient(white 30%, rgba(218, 195, 195, 0)), linear-gradient(rgba(51, 51, 51, 0.08), rgba(51, 51, 51, 0));\n  background-size: 100% 32px, 100% 16px;\n  background-attachment: local, scroll;\n  background-color: #fff;\n  background-repeat: no-repeat;\n}\n.child[data-v-4aaaadc2] {\n  height: 1000px;\n  font-size: 96px;\n  text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 537 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.wrapper[data-v-4b0146eb] {\n  display: grid;\n  margin-bottom: 20px;\n  text-align: center;\n}\n.wrapper1[data-v-4b0146eb] {\n  grid-template-columns: 100px 100px 100px;\n  grid-template-rows: 50px 50px;\n}\n.wrapper2[data-v-4b0146eb] {\n  grid-template-columns: 200px 50px 100px;\n  grid-template-rows: 100px 50px;\n}\n.wrapper3[data-v-4b0146eb] {\n  grid-template-columns: 100px 100px 100px;\n  grid-template-rows: 100px 100px 100px;\n}\n.wrapper3 .item1[data-v-4b0146eb] {\n  grid-column-start: 1;\n  grid-column-end: 4;\n}\n.wrapper4[data-v-4b0146eb] {\n  grid-template-columns: 100px 100px 100px;\n  grid-template-rows: 100px 100px 100px;\n}\n.wrapper4 .item1[data-v-4b0146eb] {\n  grid-column-start: 1;\n  grid-column-end: 3;\n}\n.wrapper4 .item3[data-v-4b0146eb] {\n  grid-row-start: 2;\n  grid-row-end: 4;\n}\n.wrapper4 .item4[data-v-4b0146eb] {\n  grid-column-start: 2;\n  grid-column-end: 4;\n}\n.item[data-v-4b0146eb] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.item1[data-v-4b0146eb] {\n  background-color: #acf4b6;\n}\n.item2[data-v-4b0146eb] {\n  background-color: #fce974;\n}\n.item3[data-v-4b0146eb] {\n  background-color: #5efffa;\n}\n.item4[data-v-4b0146eb] {\n  background-color: #e6b4fd;\n}\n.item5[data-v-4b0146eb] {\n  background-color: #1fb373;\n}\n.item6[data-v-4b0146eb] {\n  background-color: #f79a5c;\n}\n", ""]);

// exports


/***/ }),
/* 538 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.masonry-with-columns {\n  columns: 6 200px;\n  column-gap: 1rem;\n}\n.masonry-with-columns div {\n  break-inside: avoid;\n  margin: 0 1rem 1rem 0;\n  width: 100%;\n  text-align: center;\n  color: white;\n  background: #EC985A;\n}\n", ""]);

// exports


/***/ }),
/* 539 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-4b500683] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif;\n  font-size: 14px;\n}\n.background[data-v-4b500683] {\n  position: relative;\n  background: linear-gradient(to bottom, #b8b8ff 0%, #4c4ba2 100%);\n  border-radius: 5px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.25);\n  width: 400px;\n  height: 400px;\n}\n.ball[data-v-4b500683] {\n  background-color: white;\n  border-radius: 50%;\n  height: 10px;\n  width: 10px;\n  margin-bottom: 3px;\n  animation: dot 1s ease-in-out infinite;\n}\n@keyframes dot {\n0% {\n    transform: translate3d(50px, 0, 0);\n}\n50% {\n    transform: translate3d(-50px, 0, 0);\n}\n100% {\n    transform: translate3d(50px, 0, 0);\n}\n}\n.ball1[data-v-4b500683] {\n  animation: dot 1016.94915254ms ease-in-out infinite;\n}\n.ball2[data-v-4b500683] {\n  animation: dot 1034.48275862ms ease-in-out infinite;\n}\n.ball3[data-v-4b500683] {\n  animation: dot 1052.63157895ms ease-in-out infinite;\n}\n.ball4[data-v-4b500683] {\n  animation: dot 1071.42857143ms ease-in-out infinite;\n}\n.ball5[data-v-4b500683] {\n  animation: dot 1090.90909091ms ease-in-out infinite;\n}\n.ball6[data-v-4b500683] {\n  animation: dot 1111.11111111ms ease-in-out infinite;\n}\n.ball7[data-v-4b500683] {\n  animation: dot 1132.0754717ms ease-in-out infinite;\n}\n.ball8[data-v-4b500683] {\n  animation: dot 1.15385s ease-in-out infinite;\n}\n.ball9[data-v-4b500683] {\n  animation: dot 1.17647s ease-in-out infinite;\n}\n.ball10[data-v-4b500683] {\n  animation: dot 1.2s ease-in-out infinite;\n}\n.ball11[data-v-4b500683] {\n  animation: dot 1.22449s ease-in-out infinite;\n}\n.ball12[data-v-4b500683] {\n  animation: dot 1.25s ease-in-out infinite;\n}\n.ball13[data-v-4b500683] {\n  animation: dot 1.2766s ease-in-out infinite;\n}\n.ball14[data-v-4b500683] {\n  animation: dot 1.30435s ease-in-out infinite;\n}\n.ball15[data-v-4b500683] {\n  animation: dot 1.33333s ease-in-out infinite;\n}\n.ball16[data-v-4b500683] {\n  animation: dot 1.36364s ease-in-out infinite;\n}\n.ball17[data-v-4b500683] {\n  animation: dot 1.39535s ease-in-out infinite;\n}\n.ball18[data-v-4b500683] {\n  animation: dot 1.42857s ease-in-out infinite;\n}\n.ball19[data-v-4b500683] {\n  animation: dot 1.46341s ease-in-out infinite;\n}\n.ball20[data-v-4b500683] {\n  animation: dot 1.5s ease-in-out infinite;\n}\n", ""]);

// exports


/***/ }),
/* 540 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-4c07484a] {\n  position: relative;\n  margin: 100px auto;\n  display: flex;\n  flex-wrap: wrap;\n  width: 500px;\n  height: 60px;\n  overflow: hidden;\n  transition: 0.3s;\n}\ndiv > *[data-v-4c07484a] {\n  border: none;\n  outline: none;\n}\ndiv input[data-v-4c07484a] {\n  padding: 0 15px;\n  height: 100%;\n  width: 100%;\n  border: 1px solid #ddd;\n  font-size: 18px;\n  box-sizing: border-box;\n}\ndiv input[data-v-4c07484a]:not(:placeholder-shown) {\n  border: 1px solid #03a9f4;\n}\ndiv input:not(:placeholder-shown) + button[data-v-4c07484a] {\n  opacity: 1;\n}\ndiv input:placeholder-shown + button[data-v-4c07484a] {\n  opacity: 0;\n}\ndiv button[data-v-4c07484a] {\n  background: #03a9f4;\n  color: #feffd4;\n  font-size: 15px;\n  cursor: pointer;\n  width: 100px;\n  height: calc(80%);\n  transition: 0.3s;\n  position: absolute;\n  right: 10px;\n  top: 10px;\n}\ndiv[data-v-4c07484a]:focus-within {\n  transform: translateY(-4px);\n  border-color: #bbb;\n  box-shadow: 4px 4px 10px 2px #ddd;\n}\n", ""]);

// exports


/***/ }),
/* 541 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-4c271a45] {\n  font-size: 24px;\n}\nspan[data-v-4c271a45] {\n  color: #3a3a3a;\n  border-bottom: 2px solid #fadc23;\n}\nspan[data-v-4c271a45]:hover {\n  box-shadow: 0 -15px #fadc23 inset;\n  transition: box-shadow 0.2s linear;\n}\n", ""]);

// exports


/***/ }),
/* 542 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-4c97dc92] {\n  padding: 20px 0;\n}\nimg[data-v-4c97dc92] {\n  width: 160px;\n  height: 100px;\n}\n.broken-image[data-v-4c97dc92] {\n  position: relative;\n}\n.broken-image[data-v-4c97dc92]::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #ccc;\n}\n.broken-image[data-v-4c97dc92]::after {\n  content: \":( Broken Image of \" attr(alt);\n  position: absolute;\n  top: 50%;\n  left: 0;\n  transform: translateY(-50%);\n  width: 100%;\n  max-height: 100%;\n  overflow: hidden;\n  font-size: 14px;\n  line-height: 1.2;\n  text-align: center;\n  color: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 543 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 544 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nhtml {\n    scroll-behavior: smooth;\n}\n", ""]);

// exports


/***/ }),
/* 545 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nh1[data-v-4d0bf472] {\n  text-align: center;\n}\np[data-v-4d0bf472] {\n  font-size: 100px;\n}\n.footnote[data-v-4d0bf472]:target {\n  animation: flash 4s;\n}\n.footnotes [data-v-4d0bf472]:target {\n  animation: highlight 4s;\n}\n@keyframes highlight {\nfrom {\n    background: yellow;\n}\nto {\n    background: transparent;\n}\n}\n@keyframes flash {\nfrom {\n    outline: 10px solid yellow;\n}\nto {\n    outline: 10px solid transparent;\n}\n}\n", ""]);

// exports


/***/ }),
/* 546 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-4e794874]{display:grid;height:100vh;place-content:center\n}\nh1[data-v-4e794874]{position:relative;font-size:10vw\n}\nh1[data-v-4e794874]::before{content:\"love\";color:#FDD835;text-shadow:0 10px 20px rgba(0,0,0,0.1);animation:text .75s ease infinite\n}\n@keyframes text{\n33.33333%{content:\"love\"\n}\n66.66667%{content:\"and\"\n}\n100%{content:\"peace\"\n}\n}\n", ""]);

// exports


/***/ }),
/* 547 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.parent[data-v-4ec21e88] {\n  box-sizing: border-box;\n  width: 500px;\n  height: 100px;\n  line-height: 100px;\n  font-family: Georgia, serif;\n  font-size: 20px;\n  color: #fff;\n  background-color: #c7254e;\n}\n.parent[data-v-4ec21e88]:nth-of-type(2) {\n  border-left: 50px solid #009688;\n  background-color: #007dd4;\n}\n.child[data-v-4ec21e88] {\n  padding-left: 10%;\n}\n", ""]);

// exports


/***/ }),
/* 548 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-4f661db2] {\n  position: relative;\n  margin: 20px auto;\n  width: 13em;\n  height: 13em;\n  font-size: 10px;\n  border: 1em solid #000;\n}\ndiv[data-v-4f661db2]::before,\ndiv[data-v-4f661db2]::after {\n  content: \"\";\n  position: absolute;\n  top: -1em;\n  left: 3em;\n  width: 3em;\n  height: 11em;\n  border: inherit;\n}\ndiv[data-v-4f661db2]::after {\n  transform: rotate(0.25turn);\n}\n", ""]);

// exports


/***/ }),
/* 549 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-50aa766b] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.background[data-v-50aa766b] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 400px;\n  height: 400px;\n  border-radius: 5px;\n  background: linear-gradient(to bottom, #404556 0%, #222 100%);\n  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.25);\n}\n.rectangle[data-v-50aa766b] {\n  position: absolute;\n  border: 1px solid white;\n}\n.rec-1[data-v-50aa766b] {\n  width: 200px;\n  height: 200px;\n  border-color: #4e4e4e;\n  animation: rotate 2s ease-in-out 0.03333333s alternate infinite;\n}\n.rec-2[data-v-50aa766b] {\n  width: 190px;\n  height: 190px;\n  border-color: #565656;\n  animation: rotate 2s ease-in-out 0.06666667s alternate infinite;\n}\n.rec-3[data-v-50aa766b] {\n  width: 180px;\n  height: 180px;\n  border-color: #5e5e5e;\n  animation: rotate 2s ease-in-out 0.1s alternate infinite;\n}\n.rec-4[data-v-50aa766b] {\n  width: 170px;\n  height: 170px;\n  border-color: #666666;\n  animation: rotate 2s ease-in-out 0.13333333s alternate infinite;\n}\n.rec-5[data-v-50aa766b] {\n  height: 160px;\n  width: 160px;\n  border-color: #6e6e6e;\n  animation: rotate 2s ease-in-out 0.16666667s alternate infinite;\n}\n.rec-6[data-v-50aa766b] {\n  width: 150px;\n  height: 150px;\n  border-color: #767676;\n  animation: rotate 2s ease-in-out 0.2s alternate infinite;\n}\n.rec-7[data-v-50aa766b] {\n  width: 140px;\n  height: 140px;\n  border-color: #7e7e7e;\n  animation: rotate 2s ease-in-out 0.23333333s alternate infinite;\n}\n.rec-8[data-v-50aa766b] {\n  width: 130px;\n  height: 130px;\n  border-color: #868686;\n  animation: rotate 2s ease-in-out 0.26666667s alternate infinite;\n}\n.rec-9[data-v-50aa766b] {\n  width: 120px;\n  height: 120px;\n  border-color: #8e8e8e;\n  animation: rotate 2s ease-in-out 0.3s alternate infinite;\n}\n.rec-10[data-v-50aa766b] {\n  width: 110px;\n  height: 110px;\n  border-color: #969696;\n  animation: rotate 2s ease-in-out 0.33333333s alternate infinite;\n}\n.rec-11[data-v-50aa766b] {\n  width: 100px;\n  height: 100px;\n  border-color: #9e9e9e;\n  animation: rotate 2s ease-in-out 0.36666667s alternate infinite;\n}\n.rec-12[data-v-50aa766b] {\n  width: 90px;\n  height: 90px;\n  border-color: #a6a6a6;\n  animation: rotate 2s ease-in-out 0.4s alternate infinite;\n}\n.rec-13[data-v-50aa766b] {\n  width: 80px;\n  height: 80px;\n  border-color: #aeaeae;\n  animation: rotate 2s ease-in-out 0.43333333s alternate infinite;\n}\n.rec-14[data-v-50aa766b] {\n  width: 70px;\n  height: 70px;\n  border-color: #b6b6b6;\n  animation: rotate 2s ease-in-out 0.46666667s alternate infinite;\n}\n.rec-15[data-v-50aa766b] {\n  width: 60px;\n  height: 60px;\n  border-color: #bebebe;\n  animation: rotate 2s ease-in-out 0.5s alternate infinite;\n}\n.rec-16[data-v-50aa766b] {\n  width: 50px;\n  height: 50px;\n  border-color: #c6c6c6;\n  animation: rotate 2s ease-in-out 0.53333333s alternate infinite;\n}\n.rec-17[data-v-50aa766b] {\n  width: 40px;\n  height: 40px;\n  border-color: #cecece;\n  animation: rotate 2s ease-in-out 0.56666667s alternate infinite;\n}\n.rec-18[data-v-50aa766b] {\n  width: 30px;\n  height: 30px;\n  border-color: #d6d6d6;\n  animation: rotate 2s ease-in-out 0.6s alternate infinite;\n}\n.rec-19[data-v-50aa766b] {\n  width: 20px;\n  height: 20px;\n  border-color: #dedede;\n  animation: rotate 2s ease-in-out 0.63333333s alternate infinite;\n}\n.rec-20[data-v-50aa766b] {\n  width: 10px;\n  height: 10px;\n  border-color: #e6e6e6;\n  animation: rotate 2s ease-in-out 0.66666667s alternate infinite;\n}\n@keyframes rotate {\nfrom {\n    transform: rotate(0deg);\n}\nto {\n    transform: rotate(360deg);\n}\n}\n", ""]);

// exports


/***/ }),
/* 550 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.x[data-v-50d6eef6]::after {\n  content: \"\\A\";\n  white-space: pre;\n}\n", ""]);

// exports


/***/ }),
/* 551 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-5231ac2e] {\n  height: 100vh;\n}\n.prev[data-v-5231ac2e],\n.next[data-v-5231ac2e] {\n  position: absolute;\n  top: 50%;\n  margin-top: -20px;\n  width: 40px;\n  height: 40px;\n  text-indent: -10000px;\n  opacity: 0.6;\n  cursor: pointer;\n  transition: opacity 200ms ease-out;\n}\n.prev[data-v-5231ac2e]:hover,\n.next[data-v-5231ac2e]:hover {\n  opacity: 1;\n}\n.prev[data-v-5231ac2e] {\n  left: 0;\n  background: #000 url('https://lh4.googleusercontent.com/-JN1IZLtuToI/UUoZnMG3C_I/AAAAAAAAAE8/SEbJ9nqXGnY/s226/sprite.png') no-repeat -200px 0px;\n}\n.next[data-v-5231ac2e] {\n  right: 0;\n  background: #000 url('https://lh4.googleusercontent.com/-JN1IZLtuToI/UUoZnMG3C_I/AAAAAAAAAE8/SEbJ9nqXGnY/s226/sprite.png') no-repeat -167px 0px;\n}\n.slider[data-v-5231ac2e] {\n  position: relative;\n  height: 100%;\n}\n.slide[data-v-5231ac2e] {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n}\n.slide[data-v-5231ac2e]:target {\n  z-index: 100;\n}\nimg[data-v-5231ac2e] {\n  max-width: 100%;\n  height: auto;\n}\n", ""]);

// exports


/***/ }),
/* 552 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput[type=\"password\"][value$=\"1\"][data-v-524e4436] {\n  background-image: url(\"http://localhost:3000/1\");\n}\ninput[type=\"password\"][value$=\"2\"][data-v-524e4436] {\n  background-image: url(\"http://localhost:3000/2\");\n}\n", ""]);

// exports


/***/ }),
/* 553 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nh1[data-v-52ad57cc] {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  text-rendering: optimizeLegibility;\n}\n", ""]);

// exports


/***/ }),
/* 554 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-530222d6] {\n  display: flex;\n  justify-content: center;\n}\n.bulb[data-v-530222d6] {\n  display: inline-block;\n}\n.bulb-area1[data-v-530222d6],\n.bulb-area2[data-v-530222d6] {\n  transition: 0.6s;\n}\n.bulb-area1[data-v-530222d6] {\n  margin: 0 auto;\n  width: 280px;\n  height: 280px;\n  border-radius: 50%;\n  background: #807d7d;\n}\n.bulb-area2[data-v-530222d6] {\n  position: relative;\n  margin: -12px auto 0 auto;\n  width: 142px;\n  height: 0;\n  border-top: 40px solid #807d7d;\n  border-right: 16px solid transparent;\n  border-left: 16px solid transparent;\n}\n.bulb-area2[data-v-530222d6]::before {\n  content: \"\";\n  position: absolute;\n  left: -47px;\n  margin: -93px auto 0 auto;\n  width: 172px;\n  height: 0;\n  border-top: 54px solid #807d7d;\n  border-right: 32px solid transparent;\n  border-left: 32px solid transparent;\n  transition: 0.6s;\n}\n.bulb-area2[data-v-530222d6]::after {\n  content: \"\";\n  position: absolute;\n  top: 0px;\n  left: -1px;\n  margin: -4px auto 0 auto;\n  width: 144px;\n  height: 55px;\n  padding: 0;\n  border-radius: 0 0 900px 900px;\n  background: #728b4b;\n}\n.bulb-neck1[data-v-530222d6] {\n  position: relative;\n  margin: 32px auto 0;\n  width: 120px;\n  height: 12px;\n  padding: 14px 0;\n  background: #807d7d;\n}\n.bulb-neck1[data-v-530222d6]::before,\n.bulb-neck1[data-v-530222d6]::after {\n  content: \"\";\n  position: absolute;\n  top: 0px;\n  left: 0;\n  width: 120px;\n  height: 16px;\n  padding: 0;\n  background: #694b8b;\n}\n.bulb-neck1[data-v-530222d6]::after {\n  top: auto;\n  bottom: 0px;\n}\n.bulb-neck2[data-v-530222d6] {\n  position: relative;\n  margin: -1px auto 0px;\n  width: 75px;\n  height: 0;\n  padding: 0;\n  border-top: 25px solid #728b4b;\n  border-right: 25px solid transparent;\n  border-left: 25px solid transparent;\n  border-radius: 8px;\n}\n.bulb-neck2[data-v-530222d6]::after {\n  content: \"\";\n  position: relative;\n  top: 20px;\n  left: 0;\n  margin: 0 auto;\n  width: 25px;\n  height: 0;\n  padding: 0;\n  border-top: 20px solid #333;\n  border-right: 36px solid transparent;\n  border-left: 36px solid transparent;\n}\n.bulb:hover .bulb-area1[data-v-530222d6] {\n  background: #eaec68;\n  box-shadow: 0 0 55px 25px rgba(255, 255, 0, 0.4);\n}\n.bulb:hover .bulb-area2[data-v-530222d6],\n.bulb:hover .bulb-area2[data-v-530222d6]::before {\n  border-top-color: #eaec68;\n}\n", ""]);

// exports


/***/ }),
/* 555 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 556 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nform[data-v-53c7ce4d] {\n  margin: 0 auto;\n}\n.upload-file-beautify[data-v-53c7ce4d] {\n  position: relative;\n  display: inline-block;\n  box-sizing: border-box;\n  overflow: hidden;\n  width: 160px;\n  height: 48px;\n  line-height: 32px;\n  padding: 8px 16px;\n  font-family: 'MicroSoft YaHei';\n  font-size: 16px;\n  text-align: center;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  border-radius: 4.8px;\n  color: #fff;\n  background-color: #c7254e;\n  cursor: pointer;\n}\n.upload-file[data-v-53c7ce4d] {\n  position: absolute;\n  right: 15984px;\n  clip: rect(0, 0, 0, 0);\n  opacity: 0;\n}\n", ""]);

// exports


/***/ }),
/* 557 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 558 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-54dced52] {\n  font-family: cursive;\n  font-size: 64px;\n  text-align: center;\n  background-image: url(\"https://st-gdx.dancf.com/www/8/design/20180404-192434-3.png\");\n  -webkit-text-fill-color: transparent;\n  -webkit-background-clip: text;\n  background-clip: text;\n}\n", ""]);

// exports


/***/ }),
/* 559 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nh1[data-v-5520ee59] {\n    --minFontSize: 32px;\n    --maxFontSize: 200px;\n    --scaler: 10vw;\n    font-size: clamp(var(--minFontSize), var(--scaler), var(--maxFontSize));\n}\n", ""]);

// exports


/***/ }),
/* 560 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-560ddc78] {\n  background-color: #f1f1f1;\n}\n.cup[data-v-560ddc78] {\n  position: absolute;\n  top: 40%;\n  left: 40%;\n  width: 180px;\n  height: 140px;\n  border: 6px solid #f1f1f1;\n  border-radius: 0px 0px 70px 70px;\n  background: url(\"https://img.freepik.com/free-photo/full-frame-shot-brown-leather-background_23-2147951253.jpg?size=626&ext=jpg\");\n  background-repeat: repeat-x;\n  background-position: 0px 140px;\n  box-shadow: 0px 0px 0px 6px white;\n  animation: fill 2.5s infinite;\n}\n.handle[data-v-560ddc78] {\n  position: relative;\n  top: 2px;\n  left: 186px;\n  width: 40px;\n  height: 70px;\n  border: 6px solid white;\n  border-radius: 0px 25px 80px 0px;\n  background-color: transparent;\n}\n@keyframes fill {\n0% {\n    background-position: 0px 140px;\n}\n20% {\n    background-position: -450px 100px;\n}\n40% {\n    background-position: -900px 50px;\n}\n80% {\n    background-position: -1350px -40px;\n}\n}\n", ""]);

// exports


/***/ }),
/* 561 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Lato:700);", ""]);

// module
exports.push([module.i, "\nmain[data-v-564ac66e] {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n.box[data-v-564ac66e] {\n    position: relative;\n    max-width: 600px;\n    width: 90%;\n    height: 400px;\n    background: #fff;\n    box-shadow: 0 0 15px rgba(0, 0, 0, .1);\n}\n\n/* common */\n.ribbon[data-v-564ac66e] {\n    position: absolute;\n    width: 150px;\n    height: 150px;\n    overflow: hidden;\n}\n.ribbon[data-v-564ac66e]::before,\n.ribbon[data-v-564ac66e]::after {\n    content: \"\";\n    position: absolute;\n    display: block;\n    border: 5px solid #2980b9;\n}\n.ribbon span[data-v-564ac66e] {\n    position: absolute;\n    display: block;\n    width: 225px;\n    padding: 15px 0;\n    font: 700 18px/1 'Lato', sans-serif;\n    text-align: center;\n    text-transform: uppercase;\n    text-shadow: 0 1px 1px rgba(0,0,0,.2);\n    color: #fff;\n    background-color: #3498db;\n    box-shadow: 0 5px 10px rgba(0,0,0,.1);\n}\n\n/* top left */\n.ribbon-top-left[data-v-564ac66e] {\n    top: -10px;\n    left: -10px;\n}\n.ribbon-top-left[data-v-564ac66e]::before,\n.ribbon-top-left[data-v-564ac66e]::after {\n    border-top-color: transparent;\n    border-left-color: transparent;\n}\n.ribbon-top-left[data-v-564ac66e]::before {\n    top: 0;\n    right: 0;\n}\n.ribbon-top-left[data-v-564ac66e]::after {\n    bottom: 0;\n    left: 0;\n}\n.ribbon-top-left span[data-v-564ac66e] {\n    right: -25px;\n    top: 30px;\n    transform: rotate(-45deg);\n}\n\n/* top right */\n.ribbon-top-right[data-v-564ac66e] {\n    top: -10px;\n    right: -10px;\n}\n.ribbon-top-right[data-v-564ac66e]::before,\n.ribbon-top-right[data-v-564ac66e]::after {\n    border-top-color: transparent;\n    border-right-color: transparent;\n}\n.ribbon-top-right[data-v-564ac66e]::before {\n    top: 0;\n    left: 0;\n}\n.ribbon-top-right[data-v-564ac66e]::after {\n    right: 0;\n    bottom: 0;\n}\n.ribbon-top-right span[data-v-564ac66e] {\n    top: 30px;\n    left: -25px;\n    transform: rotate(45deg);\n}\n\n/* bottom left */\n.ribbon-bottom-left[data-v-564ac66e] {\n    bottom: -10px;\n    left: -10px;\n}\n.ribbon-bottom-left[data-v-564ac66e]::before,\n.ribbon-bottom-left[data-v-564ac66e]::after {\n    border-bottom-color: transparent;\n    border-left-color: transparent;\n}\n.ribbon-bottom-left[data-v-564ac66e]::before {\n    right: 0;\n    bottom: 0;\n}\n.ribbon-bottom-left[data-v-564ac66e]::after {\n    top: 0;\n    left: 0;\n}\n.ribbon-bottom-left span[data-v-564ac66e] {\n    right: -25px;\n    bottom: 30px;\n    transform: rotate(225deg);\n}\n\n/* bottom right */\n.ribbon-bottom-right[data-v-564ac66e] {\n    right: -10px;\n    bottom: -10px;\n}\n.ribbon-bottom-right[data-v-564ac66e]::before,\n.ribbon-bottom-right[data-v-564ac66e]::after {\n    border-bottom-color: transparent;\n    border-right-color: transparent;\n}\n.ribbon-bottom-right[data-v-564ac66e]::before {\n    bottom: 0;\n    left: 0;\n}\n.ribbon-bottom-right[data-v-564ac66e]::after {\n    top: 0;\n    right: 0;\n}\n.ribbon-bottom-right span[data-v-564ac66e] {\n    bottom: 30px;\n    left: -25px;\n    transform: rotate(-225deg);\n}\n", ""]);

// exports


/***/ }),
/* 562 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.box[data-v-56ac79ab] {\n    position: relative;\n    margin: 10px auto;\n    width: 200px;\n    min-height: 200px;\n    border: 1px solid #007dd4;\n    text-transform: uppercase;\n    line-height: 1.25;\n    background-color: white;\n}\n.inner_box[data-v-56ac79ab] {\n    height: 200px;\n    padding-bottom: 1.25em;\n    overflow: hidden;\n}\n.line[data-v-56ac79ab] {\n    position: relative;\n    display: block;\n    height: 200px;\n    background-color: white;\n}\ninput[id=\"more\"][data-v-56ac79ab] {\n    display: none;\n}\n.more[data-v-56ac79ab] {\n    position: absolute;\n    right: 0;\n    bottom: 0;\n    background-color: #c3254e;\n    cursor: pointer;\n}\ninput[id=\"more\"]:checked ~ .inner_box[data-v-56ac79ab] {\n    height: auto;\n    overflow: visible;\n}\ninput[id=\"more\"]:checked ~ .inner_box .line[data-v-56ac79ab] {\n    display: none;\n}\ninput[id=\"more\"]:checked ~ .more[data-v-56ac79ab]:after {\n    content: \"\\6536\\8D77...\";\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    background-color: #c3254e;\n}\n", ""]);

// exports


/***/ }),
/* 563 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.box[data-v-56ba912c] {\n    margin-bottom: .5em;\n    width: 10em;\n    height: 2.1em;\n    border: 1px solid black;\n    overflow: hidden;\n    line-height: 1em;\n}\n#more[data-v-56ba912c]:target {\n    height: auto;\n}\n.detail-control a[data-v-56ba912c] {\n    display: inline;\n}\n.detail-control a + a[data-v-56ba912c] {\n    display: none;\n}\n#more:target + .detail-control a[data-v-56ba912c] {\n    display: none;\n}\n#more:target + .detail-control a + a[data-v-56ba912c] {\n    display: inline;\n}\n", ""]);

// exports


/***/ }),
/* 564 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.box[data-v-56c8a8ad] {\n  width: 200px;\n  padding: 1em;\n  border: 1px solid black;\n  line-height: 1.5;\n}\n.box input[data-v-56c8a8ad] {\n  display: none;\n}\n.box p[data-v-56c8a8ad] {\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin: 0;\n}\n.box label[data-v-56c8a8ad] {\n  padding: 0.2em 0.6em;\n  border: 1px solid #009ce2;\n  font-size: 0.8em;\n  border-radius: 4px;\n  color: #fff;\n  background-color: #00acff;\n  cursor: pointer;\n}\n.box input:checked + p[data-v-56c8a8ad] {\n  -webkit-line-clamp: unset;\n}\n.box input:checked ~ label[data-v-56c8a8ad] {\n  display: none;\n}\n", ""]);

// exports


/***/ }),
/* 565 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-5796a3ec] {\n  margin-bottom: 10px;\n}\np[data-v-5796a3ec] {\n  width: 100px;\n  border: 1px solid #000;\n}\n.normal[data-v-5796a3ec] {\n  overflow-wrap: normal;\n}\n.break-word[data-v-5796a3ec] {\n  overflow-wrap: break-word;\n}\n", ""]);

// exports


/***/ }),
/* 566 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 567 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 568 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 569 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.pic[data-v-59851502] {\n  display: inline-block;\n  width: 100px;\n  height: 100px;\n  background-blend-mode: lighten;\n  background-size: cover;\n}\n.pic[data-v-59851502]:first-child {\n  background-image: url(" + __webpack_require__(97) + "), linear-gradient(#007dd4, #007dd4);\n}\n.pic[data-v-59851502]:nth-child(2) {\n  background-image: url(" + __webpack_require__(97) + "), linear-gradient(orange, purple);\n}\n", ""]);

// exports


/***/ }),
/* 570 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-5a496900] {\n  margin: 80px auto;\n}\n.ui-loading[data-v-5a496900] {\n  width: 1em;\n  height: 1em;\n  border-radius: 50%;\n  color: #f00;\n  font-size: 20px;\n  text-indent: -9999em;\n  -webkit-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  -o-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-animation: loading 1.3s infinite linear;\n  -o-animation: loading 1.3s infinite linear;\n  animation: loading 1.3s infinite linear;\n}\n@-webkit-keyframes loading {\n0%,\n  100% {\n    box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;\n}\n12.5% {\n    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;\n}\n25% {\n    box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;\n}\n37.5% {\n    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;\n}\n50% {\n    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;\n}\n62.5% {\n    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;\n}\n75% {\n    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;\n}\n87.5% {\n    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;\n}\n}\n@keyframes loading {\n0%,\n  100% {\n    box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;\n}\n12.5% {\n    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;\n}\n25% {\n    box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;\n}\n37.5% {\n    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;\n}\n50% {\n    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;\n}\n62.5% {\n    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;\n}\n75% {\n    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;\n}\n87.5% {\n    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;\n}\n}\n", ""]);

// exports


/***/ }),
/* 571 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-5a578081] {\n  background-color: #000;\n}\ndiv[data-v-5a578081] {\n  margin: 80px auto;\n}\n.ui-loading[data-v-5a578081] {\n  width: 1em;\n  height: 1em;\n  font-size: 25px;\n  text-indent: -9999em;\n  border-radius: 50%;\n  -webkit-animation: loading 1.1s infinite ease;\n  animation: loading 1.1s infinite ease;\n}\n@-webkit-keyframes loading {\n0%,\n  100% {\n    box-shadow: 0em -2.6em 0em 0em #ffffff, 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);\n}\n12.5% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);\n}\n25% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em #ffffff, 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);\n}\n37.5% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);\n}\n50% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em #ffffff, -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);\n}\n62.5% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0em #ffffff, -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);\n}\n75% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em #ffffff, -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);\n}\n87.5% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5), -2.6em 0em 0 0em rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0em #ffffff;\n}\n}\n@keyframes loading {\n0%,\n  100% {\n    box-shadow: 0em -2.6em 0em 0em #ffffff, 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);\n}\n12.5% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);\n}\n25% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em #ffffff, 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);\n}\n37.5% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);\n}\n50% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em #ffffff, -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);\n}\n62.5% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0em #ffffff, -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);\n}\n75% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em #ffffff, -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);\n}\n87.5% {\n    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5), -2.6em 0em 0 0em rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0em #ffffff;\n}\n}\n", ""]);

// exports


/***/ }),
/* 572 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.rating[data-v-5b85fead] {\n  display: inline-flex;\n  flex-direction: row-reverse;\n  font-size: 1rem;\n}\n.rating__input--hidden[data-v-5b85fead] {\n  position: absolute;\n  margin: -1px;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  border: 0;\n  overflow: hidden;\n  clip: rect(1px 1px 1px 1px);\n  clip: rect(1px, 1px, 1px, 1px);\n}\n.rating__label[data-v-5b85fead] {\n  color: lightgray;\n  cursor: pointer;\n}\n.rating__icon[data-v-5b85fead]::before {\n  content: \"\\2605\";\n}\n.rating__input:hover ~ .rating__label[data-v-5b85fead] {\n  color: gray;\n}\n.rating__input:checked ~ .rating__label[data-v-5b85fead] {\n  color: goldenrod;\n}\n", ""]);

// exports


/***/ }),
/* 573 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.x[data-v-5d5b4e82] {\n  margin: 0 auto;\n  width: 100px;\n  height: 100px;\n  border: 10px solid #c7254e;\n  text-align: center;\n  background-color: #007dd4;\n}\n.x p[data-v-5d5b4e82] {\n  display: inline-block;\n  width: 50px;\n  height: 50px;\n  border: inherit;\n}\n", ""]);

// exports


/***/ }),
/* 574 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.visibility[data-v-5d9ff75e] {\n  width: 80px;\n  height: 60px;\n  visibility: hidden;\n  background: #007dd4;\n  cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 575 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nlabel[data-v-608c0fc6] {\n  display: inline-block;\n  padding: 4px;\n  font-size: 36px;\n  border-radius: 4px;\n  background: green;\n  cursor: pointer;\n}\n:indeterminate + label[data-v-608c0fc6] {\n  background: crimson;\n}\n", ""]);

// exports


/***/ }),
/* 576 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-614e1cac] {\n  display: inline-block;\n  width: 150px;\n  height: 100px;\n  transform: skew(20deg);\n  background: crimson;\n}\n", ""]);

// exports


/***/ }),
/* 577 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-653c9128] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 0;\n  font-size: 32px;\n}\n.typity[data-v-653c9128] {\n  position: relative;\n  padding-right: 2px;\n  border-bottom: 3px solid red;\n  white-space: nowrap;\n  transition: background-position 0.4s;\n}\n.typity[data-v-653c9128]::after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  right: 0;\n  display: block;\n  width: 2px;\n  height: 100%;\n  background-color: transparent;\n  animation: blink-cursor 0.75s step-end infinite;\n}\n.typity.highlight[data-v-653c9128] {\n  background-image: linear-gradient(to left, rgba(0, 0, 0, 0.2) 50%, transparent 50%);\n  background-position: 100%;\n  background-size: 200% 100%;\n}\n.typity.highlight[data-v-653c9128]::after {\n  animation: none;\n}\n@keyframes blink-cursor {\n0% {\n    background-color: transparent;\n}\n50% {\n    background-color: black;\n}\n}\n@media only screen and (max-width: 600px) {\nmain[data-v-653c9128] {\n    font-size: 12px;\n}\n.typity[data-v-653c9128] {\n    padding-right: 1px;\n    border-bottom: 1px solid red;\n}\n.typity[data-v-653c9128]::after {\n    width: 1px;\n}\n}\n", ""]);

// exports


/***/ }),
/* 578 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-6558c02a] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: #1d1f20;\n}\nh1[data-v-6558c02a] {\n  position: relative;\n  float: left;\n  font-family: 'Inconsolata', Consolas, monospace;\n  font-size: 4em;\n  color: #d7b94c;\n}\nh1 span[data-v-6558c02a] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 100%;\n  border-left: .1em solid transparent;\n  background: #1d1f20;\n  animation: typing 3s steps(16) forwards, cursor 1s infinite;\n}\n@keyframes typing {\nfrom {\n    width: 100%;\n}\nto {\n    width: 0;\n}\n}\n@keyframes cursor {\n50% {\n    border-color: white;\n}\n}\n", ""]);

// exports


/***/ }),
/* 579 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 580 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-65a83117] {\n  position: relative;\n}\ndialog[data-v-65a83117] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  cursor: default;\n  pointer-events: none;\n}\ndialog[data-v-65a83117]::backdrop {\n  background-color: rgba(46, 164, 227, 0.8);\n  cursor: pointer;\n  pointer-events: all;\n}\n", ""]);

// exports


/***/ }),
/* 581 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.pie[data-v-684275ac] {\n  margin: 30px auto;\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  background-color: #007dd4;\n  background-image: linear-gradient(to right, transparent 50%, #C7254E 0);\n}\n.pie[data-v-684275ac]::before {\n  content: '';\n  display: block;\n  height: 100%;\n  margin-left: 50%;\n  border-radius: 0 100% 100% 0 / 50%;\n  transform-origin: left;\n  transform-origin: 0 50%;\n}\n/* DEG: [0, 180]; */\n.pie[data-v-684275ac]::before {\n  background-color: inherit;\n  transform: rotate(120deg);\n}\n/* DEG: [181, 360]; */\n.pie.over-half[data-v-684275ac]::before {\n  background-color: #C7254E;\n  transform: rotate(0.1turn);\n}\n", ""]);

// exports


/***/ }),
/* 582 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 583 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports
exports.push([module.i, "@import url(http://fonts.googleapis.com/css?family=Oswald);", ""]);

// module
exports.push([module.i, "\np[data-v-68e3e18a] {\n    font-family: Oswald;\n    font-size: 4em;\n    text-align: center;\n    text-transform: uppercase;\n    text-decoration: none;\n    color: #ededed;\n    transition: 0.5s all ease;\n    text-shadow:\n        1px 1px #61b4de, 2px 2px #61b4de, 3px 3px #61b4de, 4px 4px #61b4de, 5px 5px #61b4de,\n        6px 6px #91c467, 7px 7px #91c467, 8px 8px #91c467, 9px 9px #91c467, 10px 10px #91c467,\n        11px 11px #f3a14b, 12px 12px #f3a14b, 13px 13px #f3a14b, 14px 14px #f3a14b, 15px 15px #f3a14b,\n        16px 16px #e84c50, 17px 17px #e84c50, 18px 18px #e84c50, 19px 19px #e84c50, 20px 20px #e84c50,\n        21px 21px #4e5965, 22px 22px #4e5965, 23px 23px #4e5965, 24px 24px #4e5965, 25px 25px #4e5965\n    ;\n}\np[data-v-68e3e18a]:hover {\n    color: #0a0a0a;\n    text-shadow:\n        1px 1px #61b4de,\n        2px 2px #91c467,\n        3px 3px #f3a14b,\n        4px 4px #e84c50,\n        5px 5px #4e5965\n    ;\n}\n", ""]);

// exports


/***/ }),
/* 584 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-68f1f90b] {\n  background-color: #000;\n}\n.container[data-v-68f1f90b] {\n  font-size: 50px;\n  text-align: center;\n  color: #fff;\n  transition: all .5s;\n}\n.container[data-v-68f1f90b]:hover {\n  font-size: 100px;\n  letter-spacing: 50px;\n  text-shadow: 0 0 5px #fff,\n            0 0 10px #fff,\n            0 0 15px #fff,\n            0 0 20px #FF9900,\n            0 0 35px #FF9900,\n            0 0 40px #FF9900,\n            0 0 50px #FF9900,\n            0 0 75px #FF9900\n        ;\n}\n.container:hover .line[data-v-68f1f90b] {\n  width: 100%;\n}\n.line[data-v-68f1f90b] {\n  margin: 40px auto;\n  width: 0;\n  height: 8px;\n  border-radius: 4px;\n  background: #fff;\n  transition: all 1s;\n}\n", ""]);

// exports


/***/ }),
/* 585 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-6900108c]{font-size:20vmin;line-height:45vh;text-align:center;color:#ff6333\n}\n.demo1[data-v-6900108c]{text-shadow:0px 0px #992400,1px 1px #992400,2px 2px #992400,3px 3px #992400,4px 4px #992400,5px 5px #992400,6px 6px #992400,7px 7px #992400,8px 8px #992400,9px 9px #992400,10px 10px #992400,11px 11px #992400,12px 12px #992400,13px 13px #992400,14px 14px #992400,15px 15px #992400,16px 16px #992400,17px 17px #992400,18px 18px #992400,19px 19px #992400,20px 20px #992400,21px 21px #992400,22px 22px #992400,23px 23px #992400,24px 24px #992400,25px 25px #992400,26px 26px #992400,27px 27px #992400,28px 28px #992400,29px 29px #992400,30px 30px #992400,31px 31px #992400,32px 32px #992400,33px 33px #992400,34px 34px #992400,35px 35px #992400,36px 36px #992400,37px 37px #992400,38px 38px #992400,39px 39px #992400,40px 40px #992400,41px 41px #992400,42px 42px #992400,43px 43px #992400,44px 44px #992400,45px 45px #992400,46px 46px #992400,47px 47px #992400,48px 48px #992400,49px 49px #992400,50px 50px #992400\n}\n.demo2[data-v-6900108c]{text-shadow:0px 0px #992400,1px 1px rgba(152,36,1,0.98),2px 2px rgba(151,37,2,0.96),3px 3px rgba(151,37,2,0.94),4px 4px rgba(150,37,3,0.92),5px 5px rgba(149,38,4,0.9),6px 6px rgba(148,38,5,0.88),7px 7px rgba(148,39,5,0.86),8px 8px rgba(147,39,6,0.84),9px 9px rgba(146,39,7,0.82),10px 10px rgba(145,40,8,0.8),11px 11px rgba(145,40,8,0.78),12px 12px rgba(144,41,9,0.76),13px 13px rgba(143,41,10,0.74),14px 14px rgba(142,41,11,0.72),15px 15px rgba(142,42,11,0.7),16px 16px rgba(141,42,12,0.68),17px 17px rgba(140,43,13,0.66),18px 18px rgba(139,43,14,0.64),19px 19px rgba(138,43,15,0.62),20px 20px rgba(138,44,15,0.6),21px 21px rgba(137,44,16,0.58),22px 22px rgba(136,45,17,0.56),23px 23px rgba(135,45,18,0.54),24px 24px rgba(135,45,18,0.52),25px 25px rgba(134,46,19,0.5),26px 26px rgba(133,46,20,0.48),27px 27px rgba(132,47,21,0.46),28px 28px rgba(132,47,21,0.44),29px 29px rgba(131,48,22,0.42),30px 30px rgba(130,48,23,0.4),31px 31px rgba(129,48,24,0.38),32px 32px rgba(129,49,24,0.36),33px 33px rgba(128,49,25,0.34),34px 34px rgba(127,50,26,0.32),35px 35px rgba(126,50,27,0.3),36px 36px rgba(125,50,28,0.28),37px 37px rgba(125,51,28,0.26),38px 38px rgba(124,51,29,0.24),39px 39px rgba(123,52,30,0.22),40px 40px rgba(122,52,31,0.2),41px 41px rgba(122,52,31,0.18),42px 42px rgba(121,53,32,0.16),43px 43px rgba(120,53,33,0.14),44px 44px rgba(119,54,34,0.12),45px 45px rgba(119,54,34,0.1),46px 46px rgba(118,54,35,0.08),47px 47px rgba(117,55,36,0.06),48px 48px rgba(116,55,37,0.04),49px 49px rgba(116,56,37,0.02),50px 50px rgba(115,56,38,0)\n}\n", ""]);

// exports


/***/ }),
/* 586 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-690e280d] {\n  position: relative;\n  margin: 30vmin auto;\n  font-family: Times New Roman, 'serif';\n  font-size: 30vmin;\n  line-height: 40vmin;\n  text-align: center;\n  text-shadow: 4px 4px 1px #333;\n}\ndiv[data-v-690e280d]::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1;\n  background-image: linear-gradient(-45deg, #fff 0%, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent 100%);\n  background-size: 6px 6px;\n}\ndiv[data-v-690e280d]::after {\n  content: attr(data-name);\n  position: absolute;\n  top: -4px;\n  right: 6px;\n  bottom: 6px;\n  left: -2px;\n  z-index: 2;\n  color: #333;\n  text-shadow: 3px 3px #fff;\n}\n", ""]);

// exports


/***/ }),
/* 587 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.container[data-v-6aff43f2] {\n  position: relative;\n  display: inline-block;\n  overflow: hidden;\n  cursor: pointer;\n}\n.container:hover .light[data-v-6aff43f2] {\n  left: 100%;\n  transition: left 1s;\n}\n.image[data-v-6aff43f2] {\n  width: 600px;\n}\n.light[data-v-6aff43f2] {\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background-image: -webkit-linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));\n  transform: skewx(-25deg);\n}\n", ""]);

// exports


/***/ }),
/* 588 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.containner[data-v-6cb2fbdb] {\n  height: 75vh;\n}\n.triangle[data-v-6cb2fbdb] {\n  clip-path: url(#cp);\n  width: 50vw;\n  height: 50vw;\n  max-height: 75vh;\n  max-width: 75vh;\n  background-size: cover;\n  background-blend-mode: screen;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n}\n.first[data-v-6cb2fbdb] {\n  background-color: #C5075C;\n  background-image: url(" + __webpack_require__(700) + ");\n  transform: translateX(-65%) translateY(-50%);\n}\n.second[data-v-6cb2fbdb] {\n  background-color: #03B897;\n  background-image: url(" + __webpack_require__(699) + ");\n  transform: translateX(-35%) translateY(-50%);\n  opacity: 0.8;\n}\n", ""]);

// exports


/***/ }),
/* 589 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nul[data-v-6e106b4e] {\n  display: flex;\n}\nul li[data-v-6e106b4e] {\n  margin: 10px;\n  width: 100px;\n  text-align: center;\n  color: white;\n  background-color: crimson;\n}\n", ""]);

// exports


/***/ }),
/* 590 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.border-radius-inner[data-v-6e1dddcb] {\n  position: relative;\n  margin: 50px auto;\n  width: 200px;\n  height: 200px;\n  overflow: hidden;\n  background-color: #007dd4;\n}\n.border-radius-inner i[data-v-6e1dddcb] {\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background-color: #fff;\n}\n.border-radius-inner i[data-v-6e1dddcb]:first-child,\n.border-radius-inner i[data-v-6e1dddcb]:nth-child(2) {\n  top: -15px;\n}\n.border-radius-inner i[data-v-6e1dddcb]:first-child,\n.border-radius-inner i[data-v-6e1dddcb]:nth-child(3) {\n  left: -15px;\n}\n.border-radius-inner i[data-v-6e1dddcb]:last-child,\n.border-radius-inner i[data-v-6e1dddcb]:nth-child(2) {\n  right: -15px;\n}\n.border-radius-inner i[data-v-6e1dddcb]:last-child,\n.border-radius-inner i[data-v-6e1dddcb]:nth-child(3) {\n  bottom: -15px;\n}\n", ""]);

// exports


/***/ }),
/* 591 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.flex-container[data-v-6e2c9a50] {\n  display: flex;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.flex-item[data-v-6e2c9a50] {\n  box-sizing: content-box;\n  margin: 5px;\n  padding: 5px;\n  width: 60px;\n  height: 50px;\n  font-size: 2em;\n  font-weight: bold;\n  text-align: center;\n  line-height: 50px;\n  color: white;\n}\n", ""]);

// exports


/***/ }),
/* 592 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n* {\n  margin: 0;\n  box-sizing: border-box;\n  padding: 0;\n}\nhtml {\n  font-size: calc(100vw / 7.5);\n}\nbody {\n  font-family: \"Lato\", Helvetica, Tahoma, Arial, STXihei, \"\\534E\\6587\\7EC6\\9ED1\", \"Microsoft YaHei\", \"\\5FAE\\8F6F\\96C5\\9ED1\", sans-serif;\n}\nul,\nli {\n  list-style: none;\n}\na {\n  text-decoration: none;\n}\na:hover {\n  text-decoration: underline;\n}\na:empty:before {\n  content: attr(href);\n}\npre.pre-code {\n  font-size: 0;\n}\npre code {\n  display: block;\n  font-size: 14px;\n  border-radius: 10px;\n  color: #fff;\n  background-color: #000;\n}\nimg.polaroid {\n  width: 200px;\n  height: 200px;\n  border-width: 6px 6px 20px 6px;\n  border-color: #FFF;\n  border-style: solid;\n  box-shadow: 1px 1px 5px #333;\n}\n/* Color */\n:root {\n  --red: #F44336;\n  --pink: #E91E63;\n  --purple: #9C27B0;\n  --deepPurple: #673AB7;\n  --indigo: #3F51B5;\n  --blue: #2196F3;\n  --lightBlue: #03A9F4;\n  --cyan: #00BCD4;\n  --teal: #009688;\n  --green: #4CAF50;\n  --lightGreen: #8BC34A;\n  --lime: #CDDC39;\n  --yellow: #FFEB3B;\n  --amber: #FFC107;\n  --orange: #FF9800;\n  --deepOrange: #FF5722;\n  --brown: #795548;\n  --grey: #9E9E9E;\n  --blueGrey: #607D8B;\n}\n/* Color */\n.mod-modules {\n  font-size: 16px;\n  line-height: 2;\n}\n.mod-modules .item {\n  margin-bottom: -1px;\n  border: 1px solid #ecf0f1;\n  background-color: #fff;\n}\n.mod-modules .item:first-child {\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n}\n.mod-modules .item:last-child {\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n.mod-modules a {\n  display: block;\n  border-radius: inherit;\n  text-indent: .5em;\n  text-transform: capitalize;\n  text-decoration: none;\n  color: #000;\n}\n.mod-modules a:hover {\n  color: #555;\n  background-color: #ecf0f1;\n}\n.mod-modules a.active {\n  color: #fff;\n  background-color: #2c3e50;\n}\nbody {\n  min-height: 100vh;\n  padding: 2em;\n  font-size: 14px;\n  background: #f7f8f9;\n}\n#app {\n  display: flex;\n}\n.list-module {\n  margin-right: 28px;\n  width: 240px;\n}\nmain {\n  min-height: -webkit-calc(100vh - 4em);\n  min-height: -moz-calc(100vh - 4em);\n  min-height: -o-calc(100vh - 4em);\n  min-height: calc(100vh - 4em);\n  width: 100%;\n  padding: 14px;\n  border-radius: 4px;\n  background: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 593 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.sticker[data-v-70f473f4] {\n  position: relative;\n  cursor: pointer;\n}\n.sticker .shadow[data-v-70f473f4] {\n  opacity: 0.05;\n  filter: brightness(0%);\n}\n.sticker .decal[data-v-70f473f4] {\n  position: absolute;\n  width: 200px;\n  height: 200px;\n}\n.sticker .left[data-v-70f473f4] {\n  clip-path: inset(0px 100px 0px 0px);\n}\n.sticker .right[data-v-70f473f4] {\n  clip-path: inset(0px 0px 0px 100px);\n  transform: perspective(300px) rotateY(0deg);\n  transition: 200ms ease-in-out;\n}\n.sticker:hover .right[data-v-70f473f4] {\n  filter: brightness(98%);\n  transform: perspective(300px) rotateY(-50deg);\n  transition: 200ms ease-in-out;\n}\n", ""]);

// exports


/***/ }),
/* 594 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n#progress[data-v-71299b91] {\n  border: 2px solid crimson;\n  border-radius: 8px;\n  background: orange;\n  /* Chrome 全部长度 */\n  /* Chrome 已完成长度 */\n}\n#progress[data-v-71299b91]::-webkit-progress-bar {\n  background: transparent;\n}\n#progress[data-v-71299b91]::-webkit-progress-value {\n  border-radius: 6px;\n  background: salmon;\n}\n#progress[data-v-71299b91]::-webkit-progress-inner-element {\n  border-radius: 4px;\n}\n/* Firefox 已完成长度 */\nprogress[data-v-71299b91]::-moz-progress-bar {\n  background: teal;\n}\n", ""]);

// exports


/***/ }),
/* 595 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.box[data-v-71884f31] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 10em;\n  height: 1.2em;\n  font-size: 5em;\n}\n.up[data-v-71884f31],\n.down[data-v-71884f31] {\n  position: absolute;\n  height: 100%;\n  line-height: 1;\n}\n.up[data-v-71884f31] {\n  z-index: 2;\n  width: 1em;\n  overflow: hidden;\n  color: gold;\n  border-radius: 50%;\n  animation: run-outside 8s infinite;\n}\n.up[data-v-71884f31]::before {\n  content: attr(text);\n  position: absolute;\n  width: 10em;\n  animation: run-inside 8s infinite;\n}\n.down[data-v-71884f31] {\n  z-index: 1;\n  color: rebeccapurple;\n}\n@keyframes run-outside {\n0% {\n    left: -1em;\n}\n100% {\n    left: 10em;\n}\n}\n@keyframes run-inside {\n0% {\n    left: 1em;\n}\n100% {\n    left: -10em;\n}\n}\n", ""]);

// exports


/***/ }),
/* 596 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nvideo[data-v-71a2e04e] {\n  width: 500px;\n}\n", ""]);

// exports


/***/ }),
/* 597 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n#container[data-v-72863cce] {\n  line-height: 1.5;\n}\n.element[data-v-72863cce] {\n  font-family: Helvetica;\n}\n.element[data-v-72863cce]::before {\n  content: \"hi, \";\n}\n", ""]);

// exports


/***/ }),
/* 598 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-7286f9de] {\n  margin: 20px auto;\n  width: 400px;\n  height: 50px;\n  line-height: 50px;\n  border: 1px solid crimson;\n  text-align: center;\n}\n.first[data-v-7286f9de] {\n  outline: 1px dashed orange;\n  outline-offset: 0px;\n}\n", ""]);

// exports


/***/ }),
/* 599 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.nav[data-v-72c5a456] {\n  margin: 50px auto;\n  width: 750px;\n  font-family: 'MicroSoft YaHei';\n  font-size: 0;\n  text-align: center;\n  color: #007dd4;\n  background-color: #ccc;\n}\n.item[data-v-72c5a456] {\n  position: relative;\n  display: inline-block;\n  width: 150px;\n  height: 50px;\n  font-size: 16px;\n}\n.item[data-v-72c5a456]:not(:first-child)::before {\n  content: '|';\n  position: absolute;\n  top: 12px;\n  left: -10px;\n  transform: skew(30deg);\n}\n.item.active[data-v-72c5a456] {\n  color: #fff;\n  background-color: #007dd4;\n}\n.item.active[data-v-72c5a456]::before,\n.item.active[data-v-72c5a456]::after {\n  content: '';\n  position: absolute;\n  top: -5px;\n  transform: skew(0);\n}\n.item.active[data-v-72c5a456]::before {\n  left: -25px;\n  border-top: 55px solid #007dd4;\n  border-left: 25px solid transparent;\n}\n.item.active[data-v-72c5a456]::after {\n  left: 150px;\n  border-right: 25px solid transparent;\n  border-bottom: 55px solid #007dd4;\n}\n.item.active .content[data-v-72c5a456] {\n  top: -5px;\n  height: 55px;\n  background-color: #007dd4;\n}\n.item.active .content[data-v-72c5a456]::after {\n  content: \"\";\n  position: absolute;\n  right: -45px;\n  z-index: -1;\n  border-right: 45px solid transparent;\n  border-bottom: 10px solid #005fa1;\n}\n.item.active .content .link[data-v-72c5a456] {\n  position: absolute;\n  top: 5px;\n  left: 0;\n  display: block;\n  width: 100%;\n}\n.item:first-child.active[data-v-72c5a456]::before {\n  display: none;\n}\n.item:last-child.active[data-v-72c5a456]::after,\n.item:last-child.active .content[data-v-72c5a456]::after {\n  display: none;\n}\n.content[data-v-72c5a456] {\n  position: absolute;\n  display: block;\n  width: 100%;\n  padding: 0 10px;\n  line-height: 50px;\n}\n.link[data-v-72c5a456] {\n  color: inherit;\n  text-decoration: none;\n}\n", ""]);

// exports


/***/ }),
/* 600 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.hexagon[data-v-738d7280] {\n  margin: 10px auto;\n  width: 205px;\n  height: 170px;\n  overflow: hidden;\n  transform: rotate(60deg);\n}\n.hexagon div[data-v-738d7280] {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.hexagon .content[data-v-738d7280] {\n  background: url(" + __webpack_require__(5) + ");\n  background-size: cover;\n}\n.hexagon .inner[data-v-738d7280] {\n  transform: rotate(60deg);\n}\n.hexagon .outer[data-v-738d7280] {\n  transform: rotate(-120deg);\n}\n", ""]);

// exports


/***/ }),
/* 601 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 602 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 603 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 604 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 605 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 606 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/* Color */\n[data-v-79f4e78d]:root {\n  --red: #F44336;\n  --pink: #E91E63;\n  --purple: #9C27B0;\n  --deepPurple: #673AB7;\n  --indigo: #3F51B5;\n  --blue: #2196F3;\n  --lightBlue: #03A9F4;\n  --cyan: #00BCD4;\n  --teal: #009688;\n  --green: #4CAF50;\n  --lightGreen: #8BC34A;\n  --lime: #CDDC39;\n  --yellow: #FFEB3B;\n  --amber: #FFC107;\n  --orange: #FF9800;\n  --deepOrange: #FF5722;\n  --brown: #795548;\n  --grey: #9E9E9E;\n  --blueGrey: #607D8B;\n}\n/* Color */\np[data-v-79f4e78d] {\n  line-height: 1.68;\n}\n.wrapper[data-v-79f4e78d] {\n  width: 100%;\n  margin: 0 auto;\n}\n.shape[data-v-79f4e78d] {\n  float: left;\n  background-size: contain;\n  background-repeat: no-repeat;\n  margin: 30px;\n  width: 265px;\n  height: 265px;\n  shape-margin: 20px;\n}\n.pentagon[data-v-79f4e78d] {\n  background-image: url('https://lourfield.github.io/advanced-css-shapes/img/pentagon.svg');\n  shape-outside: polygon(32px 126px, 163px 32px, 293px 127px, 244px 282px, 82px 281px);\n}\n", ""]);

// exports


/***/ }),
/* 607 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-7befadb8] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.gradient[data-v-7befadb8],\n.shadow[data-v-7befadb8] {\n  margin: 50px;\n  width: 250px;\n  height: 250px;\n  border: 1px solid #000;\n}\n.gradient[data-v-7befadb8] {\n  background-image: linear-gradient(90deg, #000 0%, #000 50%, #fff 50%, #fff 100%);\n  background-size: 100px 100px;\n}\n.shadow[data-v-7befadb8] {\n  position: relative;\n  overflow: hidden;\n}\n.shadow[data-v-7befadb8]::before {\n  content: \"\";\n  position: absolute;\n  top: -50px;\n  left: -50px;\n  width: 50px;\n  height: 50px;\n  box-shadow: 50px 50px, 150px 50px, 250px 50px,\n            50px 100px, 150px 100px, 250px 100px,\n            50px 150px, 150px 150px, 250px 150px,\n            50px 200px, 150px 200px, 250px 200px,\n            50px 250px, 150px 250px, 250px 250px\n        ;\n}\n.shadow.animate[data-v-7befadb8]::before {\n  animation: move 3s infinite linear;\n}\n@keyframes move {\n25% {\n    transform: translate(50px);\n    color: coral;\n    box-shadow: 50px 50px, 150px 50px, 250px 50px,\n            50px 100px, 150px 100px, 250px 100px,\n            50px 150px, 150px 150px, 250px 150px,\n            50px 200px, 150px 200px, 250px 200px,\n            50px 250px, 150px 250px, 250px 250px\n        ;\n}\n50% {\n    transform: translate(0px);\n    color: brown;\n    border-radius: 0;\n    box-shadow: 50px 50px, 150px 50px, 250px 50px,\n            100px 100px, 200px 100px, 300px 100px,\n            50px 150px, 150px 150px, 250px 150px,\n            100px 200px, 200px 200px, 300px 200px,\n            50px 250px, 150px 250px, 250px 250px\n        ;\n}\n75% {\n    transform: translate(0px);\n    color: teal;\n    border-radius: 50%;\n    box-shadow: 50px 50px, 150px 50px, 250px 50px,\n            100px 100px, 200px 100px, 300px 100px,\n            50px 150px, 150px 150px, 250px 150px,\n            100px 200px, 200px 200px, 300px 200px,\n            50px 250px, 150px 250px, 250px 250px\n        ;\n}\n100% {\n    border-radius: 0%;\n    box-shadow: 50px 50px, 150px 50px, 250px 50px,\n            50px 100px, 150px 100px, 250px 100px,\n            50px 150px, 150px 150px, 250px 150px,\n            50px 200px, 150px 200px, 250px 200px,\n            50px 250px, 150px 250px, 250px 250px\n        ;\n}\n}\n", ""]);

// exports


/***/ }),
/* 608 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n[class|=\"demo\"][data-v-7d64e062] {\n  margin: 10px auto;\n  width: 200px;\n  height: 200px;\n}\n.demo-1[data-v-7d64e062] {\n  background: conic-gradient(purple, orange);\n}\n.demo-2[data-v-7d64e062] {\n  border-radius: 50%;\n  background: conic-gradient(red, orange, yellow, green, teal, blue, purple);\n}\n.demo-3[data-v-7d64e062] {\n  border-radius: 50%;\n  /* 第一种写法 */\n  background: conic-gradient(red 0, red 30%, green 30%, green 70%, blue 70%, blue);\n  /* 第二种写法 */\n  background: conic-gradient(red 0 30%, green 30% 70%, blue 70% 100%);\n}\n.demo-4[data-v-7d64e062] {\n  background: conic-gradient(black 0 12.5%, white 0, 37.5%, black 0 62.5%, white 0 87.5%, black 0);\n  background-size: 40px 40px;\n}\n.demo-5[data-v-7d64e062] {\n  background: repeating-conic-gradient(red 0 15deg, white 0 30deg);\n}\n", ""]);

// exports


/***/ }),
/* 609 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-7dc0f03c] {\n  margin: 10px 0;\n}\n.MSYH[data-v-7dc0f03c] {\n  font-family: Arial, \"Helvetica Neue\", \"Microsoft YaHei\";\n}\n", ""]);

// exports


/***/ }),
/* 610 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np.horizontal-tb[data-v-7eab90a8] {\n  height: 50px;\n  writing-mode: horizontal-tb;\n}\np.vertical-lr[data-v-7eab90a8] {\n  writing-mode: vertical-lr;\n}\np.vertical-rl[data-v-7eab90a8] {\n  writing-mode: vertical-rl;\n}\n", ""]);

// exports


/***/ }),
/* 611 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 612 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.ribbon-alphabet-a1 .ribbon-square:nth-child(3)::after {\n  content: \"\";\n  position: absolute;\n  top: -100%;\n  width: 100%;\n  height: 100%;\n  background: #FFF;\n}\n", ""]);

// exports


/***/ }),
/* 613 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-82be1018] {\n  margin-top: 10px;\n}\np[data-v-82be1018] {\n  height: 30px;\n  line-height: 30px;\n  background: #007dd4;\n}\np[data-v-82be1018]:empty {\n  background: #c7254e;\n}\np[data-v-82be1018]:empty::before {\n  content: \"\\6211\\662F\\865A\\62DF\\7684placeholder\";\n}\np[data-v-82be1018]:not(:empty):focus::before {\n  content: \"\";\n}\n.contenteditable[data-v-82be1018] {\n  padding-left: 10px;\n  outline: none;\n  cursor: text;\n}\n", ""]);

// exports


/***/ }),
/* 614 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Indie+Flower&amp;display=swap);", ""]);

// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),
/* 615 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.paper[data-v-858fa2a4] {\n  margin: 50px auto;\n  width: 500px;\n  height: 300px;\n  padding: 0;\n  font-family: Courier, monospace;\n  font-size: 18px;\n  line-height: 28px;\n  background: repeating-linear-gradient(white, white 25px, #9198e5 26px, #9198e5 27px);\n  background-color: white;\n  background-position-y: 34px;\n}\n", ""]);

// exports


/***/ }),
/* 616 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-8908bb94] {\n  margin: 30px auto;\n  width: 200px;\n  height: 150px;\n  background-color: #ddd;\n  box-shadow: 0 0 0 30px rgba(0, 0, 0, 0.1);\n}\n", ""]);

// exports


/***/ }),
/* 617 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n@supports (-webkit-appearance: none) or (-moz-appearance: none){\ninput[type='checkbox'],input[type='radio']{--active: #5628EE;--active-inner: #fff;--input-border: #CDD9ED;--input-border-hover: #23C4F8;--background: #fff;--disabled: #F5F9FF;--disabled-inner: #E4ECFA;--shadow-inner: rgba(18, 22, 33, .1);height:21px;outline:none;position:relative;-webkit-appearance:none;-moz-appearance:none;margin:0;padding:0;box-shadow:none;cursor:pointer;height:21px;border:1px solid var(--input-border);background:var(--background);transition:background .3s ease, border-color .3s ease\n}\ninput[type='checkbox']:after,input[type='radio']:after{content:'';display:block;left:0;top:0;position:absolute;transition:transform .3s ease, opacity .2s ease, filter .3s ease\n}\ninput[type='checkbox']:checked,input[type='radio']:checked{background:var(--active);border-color:var(--active)\n}\ninput[type='checkbox']:checked:after,input[type='radio']:checked:after{filter:drop-shadow(0 1px 2px var(--shadow-inner));transition:opacity 0.3s ease,filter 0.3s ease,transform 0.6s cubic-bezier(0.175, 0.88, 0.32, 1.2)\n}\ninput[type='checkbox']:disabled,input[type='radio']:disabled{cursor:not-allowed;opacity:.9;background:var(--disabled)\n}\ninput[type='checkbox']:disabled:checked,input[type='radio']:disabled:checked{background:var(--disabled-inner);border-color:var(--input-border)\n}\ninput[type='checkbox']:hover:not(:checked):not(:disabled),input[type='radio']:hover:not(:checked):not(:disabled){border-color:var(--input-border-hover)\n}\ninput[type='checkbox']:not(.switch),input[type='radio']:not(.switch){width:21px\n}\ninput[type='checkbox']:not(.switch):after,input[type='radio']:not(.switch):after{opacity:0\n}\ninput[type='checkbox']:not(.switch):checked:after,input[type='radio']:not(.switch):checked:after{opacity:1\n}\ninput[type='checkbox']:not(.switch){border-radius:6px\n}\ninput[type='checkbox']:not(.switch):after{width:5px;height:9px;border:2px solid var(--active-inner);border-top:0;border-left:0;left:7px;top:4px;transform:rotate(20deg)\n}\ninput[type='checkbox']:not(.switch):checked:after{transform:rotate(43deg)\n}\ninput[type='checkbox'].switch{width:38px;border-radius:11px\n}\ninput[type='checkbox'].switch:after{left:2px;top:2px;border-radius:50%;width:15px;height:15px;background:var(--input-border)\n}\ninput[type='checkbox'].switch:checked:after{background:var(--active-inner);transform:translateX(17px)\n}\ninput[type='checkbox'].switch:disabled:not(:checked):after{opacity:.6\n}\ninput[type='radio']{border-radius:50%\n}\ninput[type='radio']:after{width:19px;height:19px;border-radius:50%;background:var(--active-inner);opacity:0;transform:scale(0.7)\n}\ninput[type='radio']:checked:after{background:var(--active-inner);transform:scale(0.5)\n}\n}\nul[data-v-8a75245a]{margin:12px;padding:0;list-style:none;width:100%;max-width:360px\n}\nul li[data-v-8a75245a]{margin:12px 0;padding-left:48px;position:relative\n}\nul li input[type='checkbox'][data-v-8a75245a],ul li input[type='radio'][data-v-8a75245a]{position:absolute;left:0;top:0\n}\nul li input[type='text'][data-v-8a75245a]{line-height:21px;border:0;margin:0;padding:0;font-size:12px;color:#6C7486;background:none;-webkit-appearance:none;-moz-appearance:none;outline:none;width:100%;font-family:'Source Sans Pro', Arial\n}\nul[data-v-8a75245a]{box-sizing:border-box\n}\n*[data-v-8a75245a]{box-sizing:inherit\n}\n*[data-v-8a75245a]:before,*[data-v-8a75245a]:after{box-sizing:inherit\n}\n", ""]);

// exports


/***/ }),
/* 618 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Quicksand:400,700&display=swap);", ""]);

// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),
/* 619 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-8a91535c] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  font-family: 'Quicksand', sans-serif;\n  font-weight: bold;\n  line-height: 1.5;\n}\n.box[data-v-8a91535c] {\n  display: flex;\n  align-items: center;\n  margin: 25px 0;\n  width: 300px;\n  user-select: none;\n}\n.box label[data-v-8a91535c] {\n  position: absolute;\n  z-index: 10;\n  padding-left: 50px;\n  font-size: 26px;\n  color: #4D4D4D;\n  cursor: pointer;\n}\n.box input[data-v-8a91535c] {\n  position: absolute;\n  opacity: 0;\n  visibility: hidden;\n}\n.box input:checked ~ .check[data-v-8a91535c] {\n  box-shadow: 0px 0px 0px 15px #c7254e inset;\n}\n.box .check[data-v-8a91535c] {\n  width: 30px;\n  height: 30px;\n  border: 2px solid #c7254e;\n  border-radius: 50%;\n  background-color: #FFF;\n  box-shadow: 0px 0px 0px 0px #c7254e inset;\n  transition: all 0.15s cubic-bezier(0, 1.05, 0.72, 1.07);\n}\n", ""]);

// exports


/***/ }),
/* 620 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nform[data-v-8aad825e] {\n  font-size: 30px;\n}\ninput[type=checkbox][data-v-8aad825e],\ninput[type=radio][data-v-8aad825e] {\n  display: none;\n}\ninput[type=checkbox] + label[data-v-8aad825e]::before {\n  content: \"\\2713\";\n  display: inline-block;\n  margin: -5px 5px 0 0;\n  width: 20px;\n  height: 20px;\n  border: 1px solid #000;\n  font-size: 20px;\n  line-height: 22px;\n  text-align: center;\n  vertical-align: middle;\n  color: transparent;\n  transition: color ease .3s;\n  cursor: pointer;\n}\ninput[type=checkbox]:checked + label[data-v-8aad825e]::before {\n  color: #000;\n}\ninput[type=radio] + label[data-v-8aad825e]::before {\n  content: \"\\26AB\";\n  display: inline-block;\n  margin: -5px 5px 0 0;\n  width: 20px;\n  height: 20px;\n  border: 1px solid #000;\n  font-size: 0;\n  line-height: 20px;\n  text-align: center;\n  vertical-align: middle;\n  border-radius: 50%;\n  transition: font-size ease 0.3s;\n  cursor: pointer;\n}\ninput[type=radio]:checked + label[data-v-8aad825e]::before {\n  font-size: 20px;\n}\n", ""]);

// exports


/***/ }),
/* 621 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-8ab3e5d2] {\n    position: relative;\n    background:\n        radial-gradient(\n\t\t\tcircle,\n\t\t\ttransparent 0,\n\t\t\ttransparent 20%,\n\t\t\tblack 0,\n\t\t\tblack 100%\n\t\t),\n\t\tlinear-gradient(gold, orange, orangered, orangered);\n}\ndiv[data-v-8ab3e5d2] {\n\tposition: absolute;\n\ttop: 50%;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\tbackdrop-filter: blur(15vmin);\n}\n\n", ""]);

// exports


/***/ }),
/* 622 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.green {\n  color: green;\n}\n.red {\n  color: red;\n}\n.green.red {\n  color: yellow;\n}\n.red.green {\n  color: orange;\n}\n", ""]);

// exports


/***/ }),
/* 623 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.chessboard[data-v-8d3230f6] {\n  height: 300px;\n  width: 300px;\n  border: 1px solid;\n  background-image: linear-gradient(45deg, #000 25%, transparent 0, transparent 75%, #000 0), linear-gradient(45deg, #000 25%, transparent 0, transparent 75%, #000 0);\n  background-position: 0 0, 15px 15px;\n  background-size: 30px 30px;\n}\n", ""]);

// exports


/***/ }),
/* 624 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n[data-v-90546478]:focus-visible {\n  color: red;\n  border-color: green;\n}\n", ""]);

// exports


/***/ }),
/* 625 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-91b10da2] {\n    --primary: white;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background-color: #663399;\n}\n.infinity-path[data-v-91b10da2] {\n    --size: 120;\n    --speed: 0.65;\n    position: relative;\n    height: calc(var(--size) * 1px);\n    width: calc(var(--size) * 1px);\n}\n.infinity-path > div[data-v-91b10da2] {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: calc(var(--size) * 1px);\n    height: calc(var(--size) * 1px);\n    border: calc(var(--size) / 4 * 1px) solid rgba(255, 255, 255, 0.05);\n    border-radius: 100%;\n    -webkit-animation-duration: calc(var(--speed) * 1s);\n    animation-duration: calc(var(--speed) * 1s);\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    -webkit-animation-iteration-count: infinite;\n    animation-iteration-count: infinite;\n    -webkit-animation-name: infinity-spin;\n    animation-name: infinity-spin;\n    -webkit-transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0);\n    transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0);\n}\n.infinity-path > div[data-v-91b10da2]:before {\n    content: '';\n    position: absolute;\n    top: 50%;\n    width: calc(var(--size) / 4 * 1px);\n    height: calc(var(--size) / 4 * 1px);\n    border-radius: 100%;\n    background: var(--primary);\n    -webkit-transform: translate(calc(var(--translate-2) * 2px), calc(var(--translate) * 1%));\n    transform: translate(calc(var(--translate-2) * 2px), calc(var(--translate) * 1%));\n    animation: infinity-vanish calc(var(--speed) * 2s) infinite reverse steps(1);\n}\n.infinity-path > div[data-v-91b10da2]:nth-of-type(1) {\n    --translate: -50;\n    --translate-2: calc(var(--size) / 8);\n}\n.infinity-path > div[data-v-91b10da2]:nth-of-type(1):before {\n    right: 0;\n}\n.infinity-path > div[data-v-91b10da2]:nth-of-type(2) {\n    --translate: 50;\n    --translate-2: calc(var(--size) / 8 * -1);\n    -webkit-animation-delay: calc(var(--speed) * 1s);\n    animation-delay: calc(var(--speed) * 1s);\n    animation-direction: reverse;\n}\n.infinity-path > div[data-v-91b10da2]:nth-of-type(2):before {\n    left: 0;\n    -webkit-transform: translate(calc(var(--size) / 4 * -1px), -50%);\n    transform: translate(calc(var(--size) / 4 * -1px), -50%);\n    -webkit-animation-direction: normal;\n    animation-direction: normal;\n}\n@-webkit-keyframes infinity-vanish {\n0% {\n        opacity: 0;\n}\n50% {\n        opacity: 1;\n}\n}\n@keyframes infinity-vanish {\n0% {\n        opacity: 0;\n}\n50% {\n        opacity: 1;\n}\n}\n@-webkit-keyframes infinity-spin {\nfrom {\n        -webkit-transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0) rotate(0deg);\n        transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0) rotate(0deg);\n}\nto {\n        -webkit-transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0) rotate(360deg);\n        transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0) rotate(360deg);\n}\n}\n@keyframes infinity-spin {\nfrom {\n        -webkit-transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0) rotate(0deg);\n        transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0) rotate(0deg);\n}\nto {\n        -webkit-transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0) rotate(360deg);\n        transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0) rotate(360deg);\n}\n}\n", ""]);

// exports


/***/ }),
/* 626 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.loader[data-v-91cd3ca4] {\n  position: relative;\n}\n.line-wrap[data-v-91cd3ca4] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100px;\n  height: 50px;\n  overflow: hidden;\n  transform-origin: 50% 100%;\n  animation: spin 2000ms cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;\n}\n.line[data-v-91cd3ca4] {\n  position: absolute;\n  right: 0;\n  left: 0;\n  box-sizing: border-box;\n  margin: 0 auto;\n  border: 4px solid transparent;\n  border-radius: 100%;\n}\n.line-wrap[data-v-91cd3ca4]:nth-child(1) {\n  animation-delay: -50ms;\n}\n.line-wrap[data-v-91cd3ca4]:nth-child(2) {\n  animation-delay: -100ms;\n}\n.line-wrap[data-v-91cd3ca4]:nth-child(3) {\n  animation-delay: -150ms;\n}\n.line-wrap[data-v-91cd3ca4]:nth-child(4) {\n  animation-delay: -200ms;\n}\n.line-wrap[data-v-91cd3ca4]:nth-child(5) {\n  animation-delay: -250ms;\n}\n.line-wrap:nth-child(1) .line[data-v-91cd3ca4] {\n  top: 7px;\n  width: 90px;\n  height: 90px;\n  border-color: #eb4747;\n}\n.line-wrap:nth-child(2) .line[data-v-91cd3ca4] {\n  top: 14px;\n  width: 76px;\n  height: 76px;\n  border-color: #ebeb47;\n}\n.line-wrap:nth-child(3) .line[data-v-91cd3ca4] {\n  top: 21px;\n  width: 62px;\n  height: 62px;\n  border-color: #47eb47;\n}\n.line-wrap:nth-child(4) .line[data-v-91cd3ca4] {\n  top: 28px;\n  width: 48px;\n  height: 48px;\n  border-color: #47ebeb;\n}\n.line-wrap:nth-child(5) .line[data-v-91cd3ca4] {\n  top: 35px;\n  width: 34px;\n  height: 34px;\n  border-color: #4747eb;\n}\n@keyframes spin {\n0% {\n    transform: rotate(0);\n}\n15% {\n    transform: rotate(0);\n}\n100% {\n    transform: rotate(360deg);\n}\n}\n", ""]);

// exports


/***/ }),
/* 627 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.loader[data-v-91e96ba6] {\n  position: absolute;\n  top: 50%;\n  left: 40%;\n  margin-left: 10%;\n  transform: translate3d(-50%, -50%, 0);\n}\n.dot[data-v-91e96ba6] {\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  border-radius: 100%;\n  animation: slide 1s infinite;\n}\n.dot[data-v-91e96ba6]:nth-child(1) {\n  animation-delay: 0.1s;\n  background: #32aacc;\n}\n.dot[data-v-91e96ba6]:nth-child(2) {\n  animation-delay: 0.2s;\n  background: #64aacc;\n}\n.dot[data-v-91e96ba6]:nth-child(3) {\n  animation-delay: 0.3s;\n  background: #96aacc;\n}\n.dot[data-v-91e96ba6]:nth-child(4) {\n  animation-delay: 0.4s;\n  background: #c8aacc;\n}\n.dot[data-v-91e96ba6]:nth-child(5) {\n  animation-delay: 0.5s;\n  background: #faaacc;\n}\n@keyframes slide {\n0% {\n    transform: scale(1);\n}\n50% {\n    opacity: 0.3;\n    transform: scale(2);\n}\n100% {\n    transform: scale(1);\n}\n}\n", ""]);

// exports


/***/ }),
/* 628 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n[data-v-9820fb56]::-moz-selection {\n  text-shadow: 2px 2px 0 green;\n  color: purple;\n  background-color: gold;\n}\n[data-v-9820fb56]::selection {\n  text-shadow: 2px 2px 0 green;\n  color: purple;\n  background-color: gold;\n}\np[data-v-9820fb56] {\n  font-size: 80px;\n  text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 629 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-9a41dabc] {\n  background-image: url(http://www.bryanjones.us/sites/default/files/stars.png);\n  background-color: #000;\n}\n.mars[data-v-9a41dabc] {\n  position: relative;\n  top: 50px;\n  left: 50px;\n  width: 250px;\n  height: 250px;\n  border-radius: 100%;\n  background: linear-gradient(to top right, #000000, #020101, #140501, #24070B, #37060E, #460011, #560817, #8B0019, #93001A, #A40017, #A90019, #B00019, #CC001B, #DC0019, #EC0019, #FF0023, #FF0033, #FF0040, #FF9CAE, #FFCCCF, #FDDDDF, #FF0032, #EEE0E4);\n  box-shadow: -20px -5px 60px -15px #EEE inset;\n}\n", ""]);

// exports


/***/ }),
/* 630 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.container[data-v-9a487fb6] {\n  display: inline-block;\n  cursor: pointer;\n}\n.bar[data-v-9a487fb6] {\n  display: block;\n  margin: 10px auto;\n  width: 50px;\n  height: 5px;\n  background: black;\n  transition: all .7s ease;\n}\n.bar.center[data-v-9a487fb6] {\n  margin: 0 auto;\n}\n.container:hover .top[data-v-9a487fb6] {\n  transform: translateY(15px) rotateZ(45deg);\n}\n.container:hover .center[data-v-9a487fb6] {\n  width: 0;\n}\n.container:hover .bottom[data-v-9a487fb6] {\n  transform: translateY(-15px) rotateZ(-45deg);\n}\n", ""]);

// exports


/***/ }),
/* 631 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput[data-v-a2f16fd2] {\n  color: initial;\n  caret-color: initial;\n}\ninput[type=text][data-v-a2f16fd2]::-ms-clear,\ninput[type=text][data-v-a2f16fd2]::-ms-reveal {\n  display: none;\n  width: 0;\n  height: 0;\n}\ninput[type=\"search\"][data-v-a2f16fd2]::-webkit-search-cancel-button {\n  display: none;\n}\n", ""]);

// exports


/***/ }),
/* 632 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.row[data-v-a4afb3a8] {\n  display: flex;\n  justify-content: space-around;\n  margin: 20px auto;\n}\n", ""]);

// exports


/***/ }),
/* 633 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-a8ec24c6] {\n  margin: 10px 0;\n  text-align: center;\n  background: #007dd4;\n}\np[data-v-a8ec24c6] {\n  display: inline-block;\n  text-align: left;\n}\n", ""]);

// exports


/***/ }),
/* 634 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-ab4fdde8] {\n    font-size: min(100px, .5rem);\n}\n", ""]);

// exports


/***/ }),
/* 635 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.tooltip[data-v-aca6bd02]:focus::after,\n.tooltip[data-v-aca6bd02]:hover::after {\n  content: attr(aria-label);\n  display: block;\n}\n.tooltip[data-v-aca6bd02]:focus::after,\n.tooltip[data-v-aca6bd02]:hover::after {\n  position: absolute;\n  top: 100%;\n  margin-top: 10px;\n  width: 240px;\n  padding: 10px;\n  font-size: 14px;\n  text-align: left;\n  border-radius: 4px;\n  color: initial;\n  background-color: #f2f2f2;\n}\n.tooltip[data-v-aca6bd02] {\n  position: relative;\n  display: inline-block;\n  color: goldenrod;\n}\n.tooltip[data-v-aca6bd02]:hover::before {\n  content: \"\";\n  position: absolute;\n  top: 100%;\n  left: 0;\n  display: block;\n  width: 0;\n  height: 0;\n  border: solid transparent;\n  border-width: 6px;\n  border-bottom-color: #f2f2f2;\n  pointer-events: none;\n}\n", ""]);

// exports


/***/ }),
/* 636 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-acc2ec04] {\n  font-size: 20px;\n}\n[class=val][data-v-acc2ec04] {\n  color: orange;\n}\n[class|=val][data-v-acc2ec04] {\n  color: purple;\n}\n[class~=val][data-v-acc2ec04] {\n  color: deeppink;\n}\n[class*=val][data-v-acc2ec04] {\n  color: gold;\n}\n[class^=val][data-v-acc2ec04] {\n  color: aquamarine;\n}\n[class$=val][data-v-acc2ec04] {\n  color: pink;\n}\n", ""]);

// exports


/***/ }),
/* 637 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-b28e7938] {\n  font-size: 64px;\n  text-align: center;\n  color: transparent;\n  text-shadow: 0 0 15px rgba(0, 0, 0, 0.5);\n}\n", ""]);

// exports


/***/ }),
/* 638 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-b36d91b2] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: #555;\n}\n.container[data-v-b36d91b2] {\n  position: relative;\n  box-sizing: border-box;\n  width: 384px;\n  height: 384px;\n  border-top: 192px solid black;\n  border-radius: 100%;\n  background: white;\n  animation: container-rotation 8s infinite forwards linear;\n}\n.container .tai-chi[data-v-b36d91b2] {\n  position: absolute;\n  top: -50%;\n  animation: taichi-rotation 4s infinite forwards linear;\n}\n.container .tai-chi.left[data-v-b36d91b2] {\n  left: 0;\n}\n.container .tai-chi.right[data-v-b36d91b2] {\n  right: 0;\n}\n@keyframes container-rotation {\n0% {\n    transform: rotate(0deg);\n}\n100% {\n    transform: rotate(-360deg);\n}\n}\n@keyframes taichi-rotation {\n0% {\n    transform: rotate(90deg);\n}\n100% {\n    transform: rotate(450deg);\n}\n}\n.tai-chi[data-v-b36d91b2] {\n  position: relative;\n  display: block;\n  box-sizing: border-box;\n  margin: 0 auto;\n  width: 192px;\n  height: 192px;\n  border-top: 96px solid black;\n  border-radius: 100%;\n  background: white;\n}\n.tai-chi[data-v-b36d91b2]::before,\n.tai-chi[data-v-b36d91b2]::after {\n  content: '';\n  position: absolute;\n  top: -50%;\n  width: 24px;\n  height: 24px;\n  border-radius: 100%;\n}\n.tai-chi[data-v-b36d91b2]::before {\n  left: 0;\n  border: 36px solid black;\n  background: white;\n}\n.tai-chi[data-v-b36d91b2]::after {\n  left: 50%;\n  border: 36px solid white;\n  background: black;\n}\n", ""]);

// exports


/***/ }),
/* 639 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-b37fc5d6] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 2em;\n  text-align: center;\n}\n.fancy[data-v-b37fc5d6] {\n  margin: 0;\n  font-size: 1.5rem;\n  letter-spacing: 1rem;\n  text-transform: uppercase;\n  color: #007dd4;\n}\n.fancy span[data-v-b37fc5d6] {\n  opacity: 0;\n  animation: fadeIn 2s alternate infinite;\n}\n@keyframes fadeIn {\n0% {\n    opacity: 0;\n    filter: blur(10px);\n}\n50%,\n  100% {\n    opacity: 1;\n    filter: blur(0px);\n}\n}\n", ""]);

// exports


/***/ }),
/* 640 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-bc90be3c] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 1.5;\n}\n.box[data-v-bc90be3c] {\n  width: 200px;\n  padding: 2em;\n  border: 2px solid #246756;\n}\n.box p[data-v-bc90be3c] {\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n", ""]);

// exports


/***/ }),
/* 641 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-bcaced3e] {\n  margin-top: 20px;\n}\n.line-clamp[data-v-bcaced3e] {\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n.after[data-v-bcaced3e] {\n  position: relative;\n  height: 2.8em;\n  line-height: 1.4em;\n  overflow: hidden;\n}\n.after[data-v-bcaced3e]:after {\n  content: \"...\";\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  padding-left: 4px;\n  font-weight: bold;\n  background: #fff;\n}\n.text-overflow[data-v-bcaced3e] {\n  height: 2.2em;\n  line-height: 1.2em;\n  overflow: hidden;\n  zoom: 1;\n}\n.content[data-v-bcaced3e] {\n  float: left;\n  overflow: hidden;\n  height: 2.2em;\n  margin-right: 3em;\n}\n.dot[data-v-bcaced3e] {\n  float: right;\n  width: 3em;\n  height: 2.2em;\n  margin-top: -1.2em;\n}\n", ""]);

// exports


/***/ }),
/* 642 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-bd27e5cc] {\n  position: relative;\n  height: 200px;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 128px;\n  text-align: center;\n}\np[data-v-bd27e5cc]::before,\np[data-v-bd27e5cc]::after {\n  content: attr(aria-text);\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 100%;\n  background: transparent;\n  transform: translate(-50%, -50%);\n}\np[data-v-bd27e5cc]::before {\n  z-index: 2;\n  -webkit-text-stroke: 2px #fff;\n}\np[data-v-bd27e5cc]::after {\n  z-index: 1;\n  -webkit-text-stroke: 8px #000;\n}\n", ""]);

// exports


/***/ }),
/* 643 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.page.wrapper[data-v-bf444914] {\n  position: relative;\n  width: 60%;\n  margin: 30px auto;\n  font-size: 0;\n}\n.logo[data-v-bf444914] {\n  position: absolute;\n  top: 15px;\n  left: 50%;\n  width: 250px;\n  margin-left: -125px;\n}\n.page-left[data-v-bf444914],\n.page-right[data-v-bf444914] {\n  display: inline-block;\n  box-sizing: border-box;\n  width: 50%;\n  padding: 10px;\n  font: 14px/1.8 Georgia, serif;\n  -ms-word-break: break-all;\n  word-break: break-all;\n}\n.page-left[data-v-bf444914]::before,\n.page-right[data-v-bf444914]::before {\n  content: '';\n  width: 125px;\n  height: 160px;\n  margin: 5px;\n}\n.page-left[data-v-bf444914]::before {\n  float: right;\n}\n.page-right[data-v-bf444914]::before {\n  float: left;\n}\n", ""]);

// exports


/***/ }),
/* 644 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.chessboard[data-v-bfd53d98] {\n  width: 300px;\n  height: 300px;\n  border: 1px solid;\n  margin-left: 30px;\n  background: conic-gradient(#000 25%, #fff 0 50%, #000 0 75%, #fff 0);\n  background-size: 30px 30px;\n}\n", ""]);

// exports


/***/ }),
/* 645 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n/** 用于设置一个最小值 */\ndiv[data-v-c58391c4] {\n    font-size: max(100px, 100vw - 1200px);\n}\n", ""]);

// exports


/***/ }),
/* 646 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ndiv[data-v-c62a1316] {\n    width: clamp(200px, 50%, 400px);\n    height: 50px;\n    line-height: 50px;\n    font-size: 24px;\n    text-align: center;\n    color: white;\n    background: pink;\n}\n", ""]);

// exports


/***/ }),
/* 647 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-c7320174] {\n  overflow: hidden;\n  background: black;\n}\nh1[data-v-c7320174] {\n  margin: 200px auto;\n  overflow: hidden;\n  font-family: arial;\n  font-size: 4.5rem;\n  font-weight: 900;\n  text-align: center;\n  color: transparent;\n  background: linear-gradient(45deg, black 30%, transparent 30%, transparent 70%, black 70%), linear-gradient(-45deg, black 30%, transparent 30%, transparent 70%, black 70%), linear-gradient(90deg, crimson 30%, transparent 30%, transparent 70%, crimson 70%) red;\n  background-size: 20px 20px, 20px 20px, 1px 1px;\n  background-position: 0 0, 0 0, 0 0;\n  -webkit-background-clip: text;\n  background-clip: text;\n  -webkit-text-stroke: 4px white;\n  filter: drop-shadow(0 0 1px black) drop-shadow(0 0 1px black) drop-shadow(0 0 1px black) drop-shadow(0 0 1px black) drop-shadow(0 0 1px black) drop-shadow(0 0 1px black) drop-shadow(0 0 1px black) drop-shadow(0 0 1px black) drop-shadow(0 0 2px crimson);\n  animation: bg-shift 1s ease-in-out infinite alternate-reverse, swing 2s ease-in-out infinite;\n}\nh1[data-v-c7320174]::before {\n  content: \"BLACK AND WHITE\";\n  position: absolute;\n  background: linear-gradient(transparent 30%, white, transparent 70%);\n  -webkit-background-clip: text;\n  background-clip: text;\n  animation: bg-shift2 2s ease-in-out infinite alternate-reverse;\n  -webkit-text-stroke: 2px red;\n}\n@keyframes bg-shift {\nfrom {\n    background-position: 0 50px;\n}\n}\n@keyframes bg-shift2 {\n0% {\n    background-position: 0 50px;\n}\n50% {\n    background-position: 0 -50px;\n}\n100% {\n    background-position: 0 50px;\n}\n}\n@keyframes swing {\n0% {\n    transform-origin: top;\n    transform: perspective(550px) rotatex(55deg);\n}\n50% {\n    transform: perspective(550px) rotatex(-55deg);\n}\n100% {\n    transform-origin: top;\n    transform: perspective(550px) rotatex(55deg);\n}\n}\n", ""]);

// exports


/***/ }),
/* 648 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-c74e3076] {\n  font-size: 18px;\n  font-weight: 600;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n  color: #313131;\n}\n.btn[data-v-c74e3076] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  display: inline-block;\n  height: 50px;\n  line-height: 50px;\n  text-align: center;\n  text-decoration: none;\n  transition: all 0.3s ease-out;\n}\n.text[data-v-c74e3076] {\n  padding: 0 50px;\n  visibility: hidden;\n}\n.flip-front[data-v-c74e3076],\n.flip-back[data-v-c74e3076] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: 2px solid #313131;\n  transform-style: flat;\n  transition: transform 0.3s ease-out;\n}\n.flip-front[data-v-c74e3076] {\n  color: #313131;\n  background-color: transparent;\n  transform: rotateX(0deg) translateZ(25px);\n}\n.flip-back[data-v-c74e3076] {\n  color: #fff;\n  background-color: #313131;\n  transform: rotateX(90deg) translateZ(25px);\n}\n.btn:hover .flip-front[data-v-c74e3076] {\n  transform: rotateX(-90deg) translateZ(25px);\n}\n.btn:hover .flip-back[data-v-c74e3076] {\n  transform: rotateX(0deg) translateZ(25px);\n}\n", ""]);

// exports


/***/ }),
/* 649 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 650 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 651 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 652 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.ribbon-alphabet-w .ribbon-sharp:first-child .left {\n  border-left-color: #FFF !important;\n}\n.ribbon-alphabet-w .ribbon-sharp:last-child .right {\n  border-right-color: #FFF !important;\n}\n", ""]);

// exports


/***/ }),
/* 653 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 654 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 655 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 656 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 657 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.ribbon-alphabet-r .ribbon-sharp:nth-child(2) .left {\n  border-left-color: currentColor !important;\n}\n", ""]);

// exports


/***/ }),
/* 658 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 659 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 660 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 661 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.ribbon-alphabet-n .ribbon-sharp:first-child .right {\n  border-right-color: #FFF !important;\n}\n.ribbon-alphabet-n .ribbon-sharp:last-child .right {\n  border-right-color: #FFF !important;\n}\n", ""]);

// exports


/***/ }),
/* 662 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.ribbon-alphabet-m .ribbon-sharp:first-child .right {\n  border-right-color: #FFF !important;\n}\n.ribbon-alphabet-m .ribbon-sharp:last-child .left {\n  border-left-color: #FFF !important;\n}\n", ""]);

// exports


/***/ }),
/* 663 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 664 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 665 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 666 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 667 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 668 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 669 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 670 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput:default + label[data-v-c9e6cb80]::after {\n  content: \" (\\76DB\\4E16\\7F8E\\989C) \\1F44D\";\n}\ninput:checked:not(:default) + label[data-v-c9e6cb80]::after {\n  content: \" \\2764\\FE0F\";\n}\np[data-v-c9e6cb80] {\n  font-size: 20px;\n  line-height: 36px;\n}\n", ""]);

// exports


/***/ }),
/* 671 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 672 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 673 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 674 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 675 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-ca51aba8] {\n  display: flex;\n  margin-top: 10px;\n  list-style: none;\n}\nli span[data-v-ca51aba8] {\n  width: 80px;\n  height: 60px;\n}\n", ""]);

// exports


/***/ }),
/* 676 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 677 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\np[data-v-cb22b3e6]:blank {\n  color: crimson;\n}\n", ""]);

// exports


/***/ }),
/* 678 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-d574c4b6] {\n  position: relative;\n}\n.container[data-v-d574c4b6] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  box-sizing: content-box;\n  width: 200px;\n  height: 200px;\n  padding: 5px;\n  overflow: hidden;\n  border: 5px solid #76daff;\n  border-radius: 50%;\n}\n.wave[data-v-d574c4b6] {\n  position: relative;\n  width: 200px;\n  height: 200px;\n  background-color: #76daff;\n  border-radius: 50%;\n}\n.wave[data-v-d574c4b6]::before,\n.wave[data-v-d574c4b6]::after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 50%;\n  width: 400px;\n  height: 400px;\n}\n.wave[data-v-d574c4b6]::before {\n  z-index: 10;\n  border-radius: 45%;\n  background-color: rgba(255, 255, 255, 0.4);\n  transform: translate(-50%, -70%) rotate(0);\n  animation: rotate 6s linear infinite;\n}\n.wave[data-v-d574c4b6]::after {\n  z-index: 20;\n  border-radius: 47%;\n  background-color: rgba(255, 255, 255, 0.9);\n  transform: translate(-50%, -70%) rotate(0);\n  animation: rotate 10s linear -5s infinite;\n}\n@keyframes rotate {\n50% {\n    transform: translate(-50%, -73%) rotate(180deg);\n}\n100% {\n    transform: translate(-50%, -70%) rotate(360deg);\n}\n}\n", ""]);

// exports


/***/ }),
/* 679 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.underline-animation[data-v-d7bb3858] {\n  position: relative;\n  display: inline-block;\n  font-size: 16px;\n  color: #0087ca;\n}\n.underline-animation[data-v-d7bb3858]::after {\n  content: '';\n  position: absolute;\n  bottom: -2px;\n  left: 0;\n  width: 100%;\n  height: 2px;\n  background-color: #e94c97;\n  transform: scaleX(0);\n  transform-origin: bottom right;\n  transition: transform 0.25s ease-out;\n}\n.underline-animation[data-v-d7bb3858]:hover::after {\n  transform: scaleX(1);\n  transform-origin: bottom left;\n}\n", ""]);

// exports


/***/ }),
/* 680 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.moon-night[data-v-dbdd5e64] {\n  position: relative;\n  margin: 10px auto;\n  width: 600px;\n  height: 500px;\n  overflow: hidden;\n  background-color: #000;\n}\n.moon[data-v-dbdd5e64] {\n  position: absolute;\n  top: 10px;\n  left: 60px;\n  width: 400px;\n  height: 400px;\n  border-radius: 50%;\n  background-color: #fff;\n}\n.moon[data-v-dbdd5e64]::after {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  content: \"\";\n  width: 50px;\n  height: 50px;\n  border-radius: 50%;\n  background: rgba(0, 0, 0, 0.1);\n  box-shadow: 120px 80px 0 2px rgba(0, 0, 0, 0.1), 100px -60px 0 -7px rgba(0, 0, 0, 0.1), -70px 40px 0 -14px rgba(0, 0, 0, 0.1), -20px -50px 0 -15px rgba(0, 0, 0, 0.1), -20px 120px 0 -15px rgba(0, 0, 0, 0.1), 50px 50px 0 -15px rgba(0, 0, 0, 0.1);\n}\n.moutain[data-v-dbdd5e64] {\n  position: absolute;\n  bottom: -120px;\n  left: 200px;\n  width: 220px;\n  height: 220px;\n  border-radius: 20px;\n  background-color: #214362;\n  transform: rotate(45deg);\n  box-shadow: -170px 110px 0 2px #214362;\n}\n", ""]);

// exports


/***/ }),
/* 681 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.outer[data-v-de737a0e] {\n  position: relative;\n  height: 5em;\n  font-size: 20px;\n}\n.clip[data-v-de737a0e] {\n  position: absolute;\n  clip: rect(1em, 4em, 2.5em, 0.5em);\n  width: 5em;\n  height: 4em;\n  line-height: 4em;\n  background-color: #007DD4;\n  cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 682 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.infinity[data-v-de8a4958] {\n  position: relative;\n  margin: 10px auto;\n  width: 212px;\n  height: 100px;\n}\n.infinity[data-v-de8a4958]::before,\n.infinity[data-v-de8a4958]::after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 60px;\n  height: 60px;\n  border: 20px solid red;\n  border-radius: 50px 50px 0 50px;\n  transform: rotate(-45deg);\n}\n.infinity[data-v-de8a4958]::after {\n  right: 0;\n  left: auto;\n  border-radius: 50px 50px 50px 0;\n  transform: rotate(45deg);\n}\n", ""]);

// exports


/***/ }),
/* 683 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-deb8de00] {\n  display: flex;\n  justify-content: center;\n}\n.demo[data-v-deb8de00] {\n  margin: 0 20px;\n  width: 200px;\n  height: 200px;\n  border: 2px solid black;\n}\n.top[data-v-deb8de00] {\n  box-shadow: 0px -20px 10px -10px #007dd4;\n}\n.right[data-v-deb8de00] {\n  box-shadow: 20px 0px 10px -10px #007dd4;\n}\n.bottom[data-v-deb8de00] {\n  box-shadow: 0px 20px 10px -10px #007dd4;\n}\n.left[data-v-deb8de00] {\n  box-shadow: -20px 0px 10px -10px #007dd4;\n}\n", ""]);

// exports


/***/ }),
/* 684 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.container[data-v-e1872f12] {\n  width: 230px;\n  height: 230px;\n  background-image: url(" + __webpack_require__(6) + ");\n  background-size: contain;\n  filter: alpha(opacity=50);\n  /* internet explorer */\n  -khtml-opacity: 0.5;\n  /* khtml, old safari */\n  -moz-opacity: 0.5;\n  /* mozilla, netscape */\n  opacity: 0.5;\n  /* fx, safari, opera */\n}\n", ""]);

// exports


/***/ }),
/* 685 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\ninput[type=\"text\"][data-v-e25a41aa]::before {\n  content: \"text\";\n}\ninput[type=\"checkbox\"][data-v-e25a41aa]::before {\n  content: \"checkbox\";\n}\ninput[type=\"radio\"][data-v-e25a41aa]::before {\n  content: \"radio\";\n}\n", ""]);

// exports


/***/ }),
/* 686 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module

// exports


/***/ }),
/* 687 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nmain[data-v-e53f8ef8] {\n  font-size: 40px;\n}\ninput[data-v-e53f8ef8] {\n  display: block;\n  padding: 0 .4em;\n  font: inherit;\n}\n.callout[data-v-e53f8ef8] {\n  position: absolute;\n  margin: 0.3em 0 0 -0.2em;\n  max-width: 14em;\n  padding: .6em .8em;\n  border: 1px solid rgba(0, 0, 0, 0.3);\n  font-size: 75%;\n  border-radius: .3em;\n  background: #fed;\n  box-shadow: 0.05em 0.2em 0.6em rgba(0, 0, 0, 0.2);\n  transition: 0.5s cubic-bezier(0.25, 0.1, 0.3, 1.5) transform;\n  transform-origin: 1.4em -0.4em;\n}\n.callout[data-v-e53f8ef8]::before {\n  content: \"\";\n  position: absolute;\n  top: -0.4em;\n  left: 1em;\n  padding: .35em;\n  border: inherit;\n  border-right: 0;\n  border-bottom: 0;\n  background: inherit;\n  transform: rotate(45deg);\n}\ninput:not(:focus) + .callout[data-v-e53f8ef8]:not(:hover) {\n  transform: scale(0);\n  transition: .25s transform;\n}\n", ""]);

// exports


/***/ }),
/* 688 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\nli[data-v-ec3eb01c] {\n  list-style: none;\n}\n", ""]);

// exports


/***/ }),
/* 689 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n:matches(section, nav) [data-v-ec5bd9e4]:matches(h1, h2) {\n  color: crimson;\n}\n", ""]);

// exports


/***/ }),
/* 690 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.main-list[data-v-ee9afac8] {\n    margin: 0 auto;\n    width: 300px;\n    font-size: 14px;\n}\nh1[data-v-ee9afac8] {\n    height: 32px;\n    line-height: 32px;\n    font-size: inherit;\n    background-color: #ccc;\n    cursor: pointer;\n}\n.sub-list[data-v-ee9afac8] {\n    padding-left: 20px;\n    background-color: #ddd;\n    height: 84px;\n    overflow: hidden;\n    transition: height .5s ease-in-out;\n}\n", ""]);

// exports


/***/ }),
/* 691 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.container[data-v-f9bd88aa] {\n  position: relative;\n  width: 230px;\n  height: 230px;\n  overflow: hidden;\n  background-image: url(" + __webpack_require__(6) + ");\n  background-repeat: no-repeat;\n  background-size: contain;\n}\n.frosted-glass[data-v-f9bd88aa] {\n  width: 100%;\n  height: 100%;\n  background: inherit;\n  filter: blur(4px);\n  filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);\n  /*IE6~9*/\n}\n.text[data-v-f9bd88aa] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 40px;\n  text-transform: uppercase;\n  color: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 692 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n@keyframes rotete {\n0% {\n    transform: rotate(0deg);\n}\n100% {\n    transform: rotate(360deg);\n}\n}\n.circle[data-v-fcedda7c] {\n  display: inline-block;\n  width: 30px;\n  height: 30px;\n  border: 4px solid rgba(0, 0, 0, 0.1);\n  border-left-color: deeppink;\n  border-radius: 50%;\n  animation: rotete 1.2s linear infinite;\n}\n", ""]);

// exports


/***/ }),
/* 693 */,
/* 694 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.20';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g,
      reTrimStart = /^\s+/,
      reTrimEnd = /\s+$/;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match words composed of alphanumeric characters. */
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
    rsUpper + '+' + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = baseProperty('length');

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  var deburrLetter = basePropertyOf(deburredLetters);

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * A specialized version of `_.lastIndexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return hasUnicode(string)
      ? unicodeSize(string)
      : asciiSize(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    /** Built-in constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = context['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
        symIterator = Symbol ? Symbol.iterator : undefined,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Mocked built-ins. */
    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. The heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
     * `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;

