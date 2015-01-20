(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/w8r/Projects/wms-capabilities/example/js/app.js":[function(require,module,exports){
(function (global){
var jsonFormat = global.jsonFormat = require('./json-format');
var xmlFormat = global.xmlFormat = require('./xml-format');
var WMSCapabilities = global.WMSCapabilities = require('../../index');
var Spinner = require('spin.js');
var reqwest = require('reqwest');


////////////////////////////////////////////////////////////////////////////////
var serviceSelect = document.getElementById('service');
var xml = document.getElementById('xml');
var json = document.getElementById('json');
var input = document.getElementById('input-area');

// the only open CORS proxy I could find
var proxy = 'http://jsonp.nodejitsu.com/?url=';
var parser = new WMSCapabilities();

function showInput() {
  xml.style.display = 'none';
  input.style.display = 'block';
}

function hideInput() {
  xml.style.display = 'block';
  input.style.display = 'none';
}

function update(xmlString) {
  xml.textContent = xmlFormat(xmlString);
  Prism.highlightElement(xml);

  json.textContent = jsonFormat(JSON.stringify(parser.parse(xmlString)));
  Prism.highlightElement(json);
}

serviceSelect.addEventListener('change', function() {
  if (serviceSelect.value !== '') {
    hideInput();
    reqwest({
      url: proxy + encodeURIComponent(serviceSelect.value),
      error: function(req) {
        update(JSON.parse(req.responseText).error);
      }
    });
  }
}, false);

xml.addEventListener('click', showInput, false);

input.addEventListener('paste', function() {
  setTimeout(function() {
    update(input.value);
  }, 50);
}, false);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../index":"/Users/w8r/Projects/wms-capabilities/index.js","./json-format":"/Users/w8r/Projects/wms-capabilities/example/js/json-format.js","./xml-format":"/Users/w8r/Projects/wms-capabilities/example/js/xml-format.js","reqwest":"/Users/w8r/Projects/wms-capabilities/node_modules/reqwest/reqwest.js","spin.js":"/Users/w8r/Projects/wms-capabilities/node_modules/spin.js/spin.js"}],"/Users/w8r/Projects/wms-capabilities/example/js/json-format.js":[function(require,module,exports){
/*
    json-format v.1.1
    http://github.com/phoboslab/json-format

    Released under MIT license:
    http://www.opensource.org/licenses/mit-license.php
*/

var p = [],
  push = function(m) {
    return '\\' + p.push(m) + '\\';
  },
  pop = function(m, i) {
    return p[i - 1]
  },
  tabs = function(count) {
    return new Array(count + 1).join('\t');
  };

module.exports = function(json) {
  p = [];
  var out = "",
    indent = 0;

  // Extract backslashes and strings
  json = json
    .replace(/\\./g, push)
    .replace(/(".*?"|'.*?')/g, push)
    .replace(/\s+/, '');

  // Indent and insert newlines
  for (var i = 0; i < json.length; i++) {
    var c = json.charAt(i);

    switch (c) {
      case '{':
        out += c + "\n" + tabs(++indent);
        break;
      case '[':
        out += c + "\n" + tabs(++indent);
        break;
      case ']':
        out += "\n" + tabs(--indent) + c;
        break;
      case '}':
        out += "\n" + tabs(--indent) + c;
        break;
      case ',':
        if (/\d/.test(json.charAt(i - 1))) {
          out += ", ";
        } else {
          out += ",\n" + tabs(indent);
        }
        break;
      case ':':
        out += ": ";
        break;
      default:
        out += c;
        break;
    }
  }

  // Strip whitespace from numeric arrays and put backslashes
  // and strings back in
  out = out
    .replace(/\[[\d,\s]+?\]/g, function(m) {
      return m.replace(/\s/g, '');
    })
    // number arrays
    .replace(/\[\s*(\d)/g, function(a, b) {
      return '[' + b;
    })
    .replace(/(\d)\s*\]/g, function(a, b) {
      return b + ']';
    })
    .replace(/\{\s*\}/g, '{}') // empty objects
    .replace(/\\(\d+)\\/g, pop) // strings
    .replace(/\\(\d+)\\/g, pop); // backslashes in strings

  return out;
};

},{}],"/Users/w8r/Projects/wms-capabilities/example/js/xml-format.js":[function(require,module,exports){
"use strict";

module.exports = function(xml) {
  var formatted = '';
  var reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');
  var pad = 0;

  xml.split('\r\n').forEach(function(node, index) {
    var indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad != 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }

    var padding = '';
    for (var i = 0; i < pad; i++) {
      padding += '  ';
    }

    formatted += padding + node + '\r\n';
    pad += indent;
  });

  return formatted;
};

},{}],"/Users/w8r/Projects/wms-capabilities/index.js":[function(require,module,exports){
"use strict";

module.exports = require('./src/wms');

},{"./src/wms":"/Users/w8r/Projects/wms-capabilities/src/wms.js"}],"/Users/w8r/Projects/wms-capabilities/node_modules/reqwest/reqwest.js":[function(require,module,exports){
/*!
  * Reqwest! A general purpose XHR connection manager
  * license MIT (c) Dustin Diaz 2014
  * https://github.com/ded/reqwest
  */

!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('reqwest', this, function () {

  var win = window
    , doc = document
    , httpsRe = /^http/
    , protocolRe = /(^\w+):\/\//
    , twoHundo = /^(20\d|1223)$/ //http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
    , byTag = 'getElementsByTagName'
    , readyState = 'readyState'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , head = doc[byTag]('head')[0]
    , uniqid = 0
    , callbackPrefix = 'reqwest_' + (+new Date())
    , lastValue // data stored by the most recent JSONP callback
    , xmlHttpRequest = 'XMLHttpRequest'
    , xDomainRequest = 'XDomainRequest'
    , noop = function () {}

    , isArray = typeof Array.isArray == 'function'
        ? Array.isArray
        : function (a) {
            return a instanceof Array
          }

    , defaultHeaders = {
          'contentType': 'application/x-www-form-urlencoded'
        , 'requestedWith': xmlHttpRequest
        , 'accept': {
              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
            , 'xml':  'application/xml, text/xml'
            , 'html': 'text/html'
            , 'text': 'text/plain'
            , 'json': 'application/json, text/javascript'
            , 'js':   'application/javascript, text/javascript'
          }
      }

    , xhr = function(o) {
        // is it x-domain
        if (o['crossOrigin'] === true) {
          var xhr = win[xmlHttpRequest] ? new XMLHttpRequest() : null
          if (xhr && 'withCredentials' in xhr) {
            return xhr
          } else if (win[xDomainRequest]) {
            return new XDomainRequest()
          } else {
            throw new Error('Browser does not support cross-origin requests')
          }
        } else if (win[xmlHttpRequest]) {
          return new XMLHttpRequest()
        } else {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
      }
    , globalSetupOptions = {
        dataFilter: function (data) {
          return data
        }
      }

  function succeed(r) {
    var protocol = protocolRe.exec(r.url);
    protocol = (protocol && protocol[1]) || window.location.protocol;
    return httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response;
  }

  function handleReadyState(r, success, error) {
    return function () {
      // use _aborted to mitigate against IE err c00c023f
      // (can't read props on aborted request objects)
      if (r._aborted) return error(r.request)
      if (r._timedOut) return error(r.request, 'Request is aborted: timeout')
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop
        if (succeed(r)) success(r.request)
        else
          error(r.request)
      }
    }
  }

  function setHeaders(http, o) {
    var headers = o['headers'] || {}
      , h

    headers['Accept'] = headers['Accept']
      || defaultHeaders['accept'][o['type']]
      || defaultHeaders['accept']['*']

    var isAFormData = typeof FormData === 'function' && (o['data'] instanceof FormData);
    // breaks cross-origin requests with legacy browsers
    if (!o['crossOrigin'] && !headers[requestedWith]) headers[requestedWith] = defaultHeaders['requestedWith']
    if (!headers[contentType] && !isAFormData) headers[contentType] = o['contentType'] || defaultHeaders['contentType']
    for (h in headers)
      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
  }

  function setCredentials(http, o) {
    if (typeof o['withCredentials'] !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o['withCredentials']
    }
  }

  function generalCallback(data) {
    lastValue = data
  }

  function urlappend (url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s
  }

  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++
      , cbkey = o['jsonpCallback'] || 'callback' // the 'callback' key
      , cbval = o['jsonpCallbackName'] || reqwest.getcallbackPrefix(reqId)
      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
      , match = url.match(cbreg)
      , script = doc.createElement('script')
      , loaded = 0
      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1

    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
      } else {
        cbval = match[3] // provided callback func name
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
    }

    win[cbval] = generalCallback

    script.type = 'text/javascript'
    script.src = url
    script.async = true
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      // need this for IE due to out-of-order onreadystatechange(), binding script
      // execution to an event listener gives us control over when the script
      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      script.htmlFor = script.id = '_reqwest_' + reqId
    }

    script.onload = script.onreadystatechange = function () {
      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
        return false
      }
      script.onload = script.onreadystatechange = null
      script.onclick && script.onclick()
      // Call the user callback with the last value stored and clean up values and scripts.
      fn(lastValue)
      lastValue = undefined
      head.removeChild(script)
      loaded = 1
    }

    // Add the script to the DOM head
    head.appendChild(script)

    // Enable JSONP timeout
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null
        err({}, 'Request is aborted: timeout', {})
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
    }
  }

  function getRequest(fn, err) {
    var o = this.o
      , method = (o['method'] || 'GET').toUpperCase()
      , url = typeof o === 'string' ? o : o['url']
      // convert non-string objects to query-string form unless o['processData'] is false
      , data = (o['processData'] !== false && o['data'] && typeof o['data'] !== 'string')
        ? reqwest.toQueryString(o['data'])
        : (o['data'] || null)
      , http
      , sendWait = false

    // if we're working on a GET request and we have data then we should append
    // query string to end of URL and not post data
    if ((o['type'] == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data)
      data = null
    }

    if (o['type'] == 'jsonp') return handleJsonp(o, fn, err, url)

    // get the xhr from the factory if passed
    // if the factory returns null, fall-back to ours
    http = (o.xhr && o.xhr(o)) || xhr(o)

    http.open(method, url, o['async'] === false ? false : true)
    setHeaders(http, o)
    setCredentials(http, o)
    if (win[xDomainRequest] && http instanceof win[xDomainRequest]) {
        http.onload = fn
        http.onerror = err
        // NOTE: see
        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
        http.onprogress = function() {}
        sendWait = true
    } else {
      http.onreadystatechange = handleReadyState(this, fn, err)
    }
    o['before'] && o['before'](http)
    if (sendWait) {
      setTimeout(function () {
        http.send(data)
      }, 200)
    } else {
      http.send(data)
    }
    return http
  }

  function Reqwest(o, fn) {
    this.o = o
    this.fn = fn

    init.apply(this, arguments)
  }

  function setType(header) {
    // json, javascript, text/plain, text/html, xml
    if (header.match('json')) return 'json'
    if (header.match('javascript')) return 'js'
    if (header.match('text')) return 'html'
    if (header.match('xml')) return 'xml'
  }

  function init(o, fn) {

    this.url = typeof o == 'string' ? o : o['url']
    this.timeout = null

    // whether request has been fulfilled for purpose
    // of tracking the Promises
    this._fulfilled = false
    // success handlers
    this._successHandler = function(){}
    this._fulfillmentHandlers = []
    // error handlers
    this._errorHandlers = []
    // complete (both success and fail) handlers
    this._completeHandlers = []
    this._erred = false
    this._responseArgs = {}

    var self = this

    fn = fn || function () {}

    if (o['timeout']) {
      this.timeout = setTimeout(function () {
        timedOut()
      }, o['timeout'])
    }

    if (o['success']) {
      this._successHandler = function () {
        o['success'].apply(o, arguments)
      }
    }

    if (o['error']) {
      this._errorHandlers.push(function () {
        o['error'].apply(o, arguments)
      })
    }

    if (o['complete']) {
      this._completeHandlers.push(function () {
        o['complete'].apply(o, arguments)
      })
    }

    function complete (resp) {
      o['timeout'] && clearTimeout(self.timeout)
      self.timeout = null
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp)
      }
    }

    function success (resp) {
      var type = o['type'] || resp && setType(resp.getResponseHeader('Content-Type')) // resp can be undefined in IE
      resp = (type !== 'jsonp') ? self.request : resp
      // use global data filter on response text
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
        , r = filteredResponse
      try {
        resp.responseText = r
      } catch (e) {
        // can't assign this in IE<=8, just ignore
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err)
          }
          break
        case 'js':
          resp = eval(r)
          break
        case 'html':
          resp = r
          break
        case 'xml':
          resp = resp.responseXML
              && resp.responseXML.parseError // IE trololo
              && resp.responseXML.parseError.errorCode
              && resp.responseXML.parseError.reason
            ? null
            : resp.responseXML
          break
        }
      }

      self._responseArgs.resp = resp
      self._fulfilled = true
      fn(resp)
      self._successHandler(resp)
      while (self._fulfillmentHandlers.length > 0) {
        resp = self._fulfillmentHandlers.shift()(resp)
      }

      complete(resp)
    }

    function timedOut() {
      self._timedOut = true
      self.request.abort()      
    }

    function error(resp, msg, t) {
      resp = self.request
      self._responseArgs.resp = resp
      self._responseArgs.msg = msg
      self._responseArgs.t = t
      self._erred = true
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t)
      }
      complete(resp)
    }

    this.request = getRequest.call(this, success, error)
  }

  Reqwest.prototype = {
    abort: function () {
      this._aborted = true
      this.request.abort()
    }

  , retry: function () {
      init.call(this, this.o, this.fn)
    }

    /**
     * Small deviation from the Promises A CommonJs specification
     * http://wiki.commonjs.org/wiki/Promises/A
     */

    /**
     * `then` will execute upon successful requests
     */
  , then: function (success, fail) {
      success = success || function () {}
      fail = fail || function () {}
      if (this._fulfilled) {
        this._responseArgs.resp = success(this._responseArgs.resp)
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._fulfillmentHandlers.push(success)
        this._errorHandlers.push(fail)
      }
      return this
    }

    /**
     * `always` will execute whether the request succeeds or fails
     */
  , always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp)
      } else {
        this._completeHandlers.push(fn)
      }
      return this
    }

    /**
     * `fail` will execute when the request fails
     */
  , fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._errorHandlers.push(fn)
      }
      return this
    }
  , 'catch': function (fn) {
      return this.fail(fn)
    }
  }

  function reqwest(o, fn) {
    return new Reqwest(o, fn)
  }

  // normalize newline variants according to spec -> CRLF
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : ''
  }

  function serial(el, cb) {
    var n = el.name
      , t = el.tagName.toLowerCase()
      , optCb = function (o) {
          // IE gives value="" even where there is no value attribute
          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
          if (o && !o['disabled'])
            cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']))
        }
      , ch, ra, val, i

    // don't serialize elements that are disabled or without a name
    if (el.disabled || !n) return

    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type)
        ra = /radio/i.test(el.type)
        val = el.value
        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
      }
      break
    case 'textarea':
      cb(n, normalize(el.value))
      break
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i])
        }
      }
      break
    }
  }

  // collect up all form elements found from the passed argument elements all
  // the way down to child elements; pass a '<form>' or form fields.
  // called with 'this'=callback to use for serial() on each element
  function eachFormElement() {
    var cb = this
      , e, i
      , serializeSubtags = function (e, tags) {
          var i, j, fa
          for (i = 0; i < tags.length; i++) {
            fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }

    for (i = 0; i < arguments.length; i++) {
      e = arguments[i]
      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
    }
  }

  // standard query string style serialization
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
  }

  // { 'name': 'value', ... } style serialization
  function serializeHash() {
    var hash = {}
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
        hash[name].push(value)
      } else hash[name] = value
    }, arguments)
    return hash
  }

  // [ { name: 'name', value: 'value' }, ... ] style serialization
  reqwest.serializeArray = function () {
    var arr = []
    eachFormElement.apply(function (name, value) {
      arr.push({name: name, value: value})
    }, arguments)
    return arr
  }

  reqwest.serialize = function () {
    if (arguments.length === 0) return ''
    var opt, fn
      , args = Array.prototype.slice.call(arguments, 0)

    opt = args.pop()
    opt && opt.nodeType && args.push(opt) && (opt = null)
    opt && (opt = opt.type)

    if (opt == 'map') fn = serializeHash
    else if (opt == 'array') fn = reqwest.serializeArray
    else fn = serializeQueryString

    return fn.apply(null, args)
  }

  reqwest.toQueryString = function (o, trad) {
    var prefix, i
      , traditional = trad || false
      , s = []
      , enc = encodeURIComponent
      , add = function (key, value) {
          // If value is a function, invoke it and return its value
          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
          s[s.length] = enc(key) + '=' + enc(value)
        }
    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++) add(o[i]['name'], o[i]['value'])
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in o) {
        if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix], traditional, add)
      }
    }

    // spaces should be + according to spec
    return s.join('&').replace(/%20/g, '+')
  }

  function buildParams(prefix, obj, traditional, add) {
    var name, i, v
      , rbracket = /\[\]$/

    if (isArray(obj)) {
      // Serialize array item.
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i]
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v)
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj)
    }
  }

  reqwest.getcallbackPrefix = function () {
    return callbackPrefix
  }

  // jQuery and Zepto compatibility, differences can be remapped here so you can call
  // .ajax.compat(options, callback)
  reqwest.compat = function (o, fn) {
    if (o) {
      o['type'] && (o['method'] = o['type']) && delete o['type']
      o['dataType'] && (o['type'] = o['dataType'])
      o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback']
      o['jsonp'] && (o['jsonpCallback'] = o['jsonp'])
    }
    return new Reqwest(o, fn)
  }

  reqwest.ajaxSetup = function (options) {
    options = options || {}
    for (var k in options) {
      globalSetupOptions[k] = options[k]
    }
  }

  return reqwest
});

},{}],"/Users/w8r/Projects/wms-capabilities/node_modules/spin.js/spin.js":[function(require,module,exports){
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */
(function(root, factory) {

  /* CommonJS */
  if (typeof exports == 'object')  module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory)

  /* Browser global */
  else root.Spinner = factory()
}
(this, function() {
  "use strict";

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */
    , useCssAnimations /* Whether to use CSS animations or setTimeout */

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div')
      , n

    for(n in prop) el[n] = prop[n]
    return el
  }

  /**
   * Appends children and returns the parent.
   */
  function ins(parent /* child1, child2, ...*/) {
    for (var i=1, n=arguments.length; i<n; i++)
      parent.appendChild(arguments[i])

    return parent
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  var sheet = (function() {
    var el = createEl('style', {type : 'text/css'})
    ins(document.getElementsByTagName('head')[0], el)
    return el.sheet || el.styleSheet
  }())

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
      , start = 0.01 + i/lines * 100
      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
      , pre = prefix && '-' + prefix + '-' || ''

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:' + z + '}' +
        start + '%{opacity:' + alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
        '100%{opacity:' + z + '}' +
        '}', sheet.cssRules.length)

      animations[name] = 1
    }

    return name
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   */
  function vendor(el, prop) {
    var s = el.style
      , pp
      , i

    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop
      if(s[pp] !== undefined) return pp
    }
    if(s[prop] !== undefined) return prop
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop)
      el.style[vendor(el, n)||n] = prop[n]

    return el
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i]
      for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n]
    }
    return obj
  }

  /**
   * Returns the line color from the given string or array.
   */
  function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length]
  }

  // Built-in defaults

  var defaults = {
    lines: 12,            // The number of lines to draw
    length: 7,            // The length of each line
    width: 5,             // The line thickness
    radius: 10,           // The radius of the inner circle
    rotate: 0,            // Rotation offset
    corners: 1,           // Roundness (0..1)
    color: '#000',        // #rgb or #rrggbb
    direction: 1,         // 1: clockwise, -1: counterclockwise
    speed: 1,             // Rounds per second
    trail: 100,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 2e9,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: '50%',           // center vertically
    left: '50%',          // center horizontally
    position: 'absolute'  // element position
  }

  /** The constructor */
  function Spinner(o) {
    this.opts = merge(o || {}, Spinner.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  merge(Spinner.prototype, {

    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
    spin: function(target) {
      this.stop()

      var self = this
        , o = self.opts
        , el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex})

      css(el, {
        left: o.left,
        top: o.top
      })
        
      if (target) {
        target.insertBefore(el, target.firstChild||null)
      }

      el.setAttribute('role', 'progressbar')
      self.lines(el, self.opts)

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps/o.speed
          , ostep = (1-o.opacity) / (f*o.trail / 100)
          , astep = f/o.lines

        ;(function anim() {
          i++;
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

            self.opacity(el, j * o.direction + start, alpha, o)
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps))
        })()
      }
      return self
    },

    /**
     * Stops and removes the Spinner.
     */
    stop: function() {
      var el = this.el
      if (el) {
        clearTimeout(this.timeout)
        if (el.parentNode) el.parentNode.removeChild(el)
        this.el = undefined
      }
      return this
    },

    /**
     * Internal method that draws the individual lines. Will be overwritten
     * in VML fallback mode below.
     */
    lines: function(el, o) {
      var i = 0
        , start = (o.lines - 1) * (1 - o.direction) / 2
        , seg

      function fill(color, shadow) {
        return css(createEl(), {
          position: 'absolute',
          width: (o.length+o.width) + 'px',
          height: o.width + 'px',
          background: color,
          boxShadow: shadow,
          transformOrigin: 'left',
          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
          borderRadius: (o.corners * o.width>>1) + 'px'
        })
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute',
          top: 1+~(o.width/2) + 'px',
          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
          opacity: o.opacity,
          animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
        })

        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}))
        ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
      }
      return el
    },

    /**
     * Internal method that adjusts the opacity of a single line.
     * Will be overwritten in VML fallback mode below.
     */
    opacity: function(el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
    }

  })


  function initVML() {

    /* Utility function to create a VML tag */
    function vml(tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
    }

    // No CSS transforms but VML support, add a CSS rule for VML elements:
    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

    Spinner.prototype.lines = function(el, o) {
      var r = o.length+o.width
        , s = 2*r

      function grp() {
        return css(
          vml('group', {
            coordsize: s + ' ' + s,
            coordorigin: -r + ' ' + -r
          }),
          { width: s, height: s }
        )
      }

      var margin = -(o.width+o.length)*2 + 'px'
        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
        , i

      function seg(i, dx, filter) {
        ins(g,
          ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
            ins(css(vml('roundrect', {arcsize: o.corners}), {
                width: r,
                height: o.width,
                left: o.radius,
                top: -o.width>>1,
                filter: filter
              }),
              vml('fill', {color: getColor(o.color, i), opacity: o.opacity}),
              vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
            )
          )
        )
      }

      if (o.shadow)
        for (i = 1; i <= o.lines; i++)
          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

      for (i = 1; i <= o.lines; i++) seg(i)
      return ins(el, g)
    }

    Spinner.prototype.opacity = function(el, i, val, o) {
      var c = el.firstChild
      o = o.shadow && o.lines || 0
      if (c && i+o < c.childNodes.length) {
        c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild
        if (c) c.opacity = val
      }
    }
  }

  var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

  if (!vendor(probe, 'transform') && probe.adj) initVML()
  else useCssAnimations = vendor(probe, 'animation')

  return Spinner

}));

},{}],"/Users/w8r/Projects/wms-capabilities/src/node_types.js":[function(require,module,exports){
"use strict";

/**
 * @enum {Number}
 */
module.exports = {
  ELEMENT: 1,
  ATTRIBUTE: 2,
  TEXT: 3,
  CDATA_SECTION: 4,
  ENTITY_REFERENCE: 5,
  ENTITY: 6,
  PROCESSING_INSTRUCTION: 7,
  COMMENT: 8,
  DOCUMENT: 9,
  DOCUMENT_TYPE: 10,
  DOCUMENT_FRAGMENT: 11,
  NOTATION: 12
};

},{}],"/Users/w8r/Projects/wms-capabilities/src/utils/isdef.js":[function(require,module,exports){
"use strict";

/**
 * Returns true if the specified value is not undefined.
 *
 * @param {?} val Variable to test.
 * @return {Boolean} Whether variable is defined.
 */
module.exports = function isDef(val) {
  return val !== void 0;
};

},{}],"/Users/w8r/Projects/wms-capabilities/src/utils/setifundefined.js":[function(require,module,exports){
"use strict";

/**
 * Adds a key-value pair to the object/map/hash if it doesn't exist yet.
 *
 * @param {Object.<K,V>} obj The object to which to add the key-value pair.
 * @param {String} key The key to add.
 * @param {V} value The value to add if the key wasn't present.
 * @return {V} The value of the entry at the end of the function.
 * @template K,V
 */
module.exports = function(obj, key, value) {
  return key in obj ? obj[key] : (obj[key] = value);
};

},{}],"/Users/w8r/Projects/wms-capabilities/src/utils/string.js":[function(require,module,exports){
"use strict";

var isDef = require('./isdef');

/**
 * Make sure we trim BOM and NBSP
 * @type {RegExp}
 */
var TRIM_RE = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

/**
 * Repeats a string n times.
 * @param {String} string The string to repeat.
 * @param {Number} length The number of times to repeat.
 * @return {String} A string containing {@code length} repetitions of
 *     {@code string}.
 */
function repeat(string, length) {
  return new Array(length + 1).join(string);
}

module.exports = {

  /**
   * @param  {String} str
   * @return {String}
   */
  trim: function(str) {
    return str.replace(TRIM_RE, '');
  },

  /**
   * Pads number to given length and optionally rounds it to a given precision.
   * For example:
   * <pre>padNumber(1.25, 2, 3) -> '01.250'
   * padNumber(1.25, 2) -> '01.25'
   * padNumber(1.25, 2, 1) -> '01.3'
   * padNumber(1.25, 0) -> '1.25'</pre>
   *
   * @param {Number} num The number to pad.
   * @param {Number} length The desired length.
   * @param {Number=} opt_precision The desired precision.
   * @return {String} {@code num} as a string with the given options.
   */
  padNumber: function(num, length, opt_precision) {
    var s = isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
    var index = s.indexOf('.');
    if (index == -1) {
      index = s.length;
    }
    return repeat('0', Math.max(0, length - index)) + s;
  }

};

},{"./isdef":"/Users/w8r/Projects/wms-capabilities/src/utils/isdef.js"}],"/Users/w8r/Projects/wms-capabilities/src/wms.js":[function(require,module,exports){
"use strict";

var XMLParser = require('./xml_parser');
var isDef = require('./utils/isdef');
var nodeTypes = require('./node_types');
var setIfUndefined = require('./utils/setifundefined');
var XSD = require('./xsd');
var XLink = require('./xlink');

/**
 * WMS Capabilities parser
 *
 * @param {String=} xmlString
 * @constructor
 */
function WMS(xmlString) {

  /**
   * @type {String}
   */
  this.version = undefined;

  /**
   * @type {XMLParser}
   */
  this._parser = new XMLParser();

  /**
   * @type {String=}
   */
  this._data = xmlString;
};

/**
 * Shortcut
 * @type {Function}
 */
var makePropertySetter = XMLParser.makeObjectPropertySetter;

/**
 * @param {String} xmlString
 * @return {WMS}
 */
WMS.prototype.data = function(xmlString) {
  this._data = xmlString;
  return this;
};

/**
 * @param  {String=} xmlString
 * @return {Object}
 */
WMS.prototype.toJSON = function(xmlString) {
  xmlString = xmlString || this._data;
  return this.parse(xmlString);
};

/**
 * @return {String} xml
 */
WMS.prototype.parse = function(xmlString) {
  return this._readFromDocument(this._parser.toDocument(xmlString));
};

/**
 * @param  {Document} doc
 * @return {Object}
 */
WMS.prototype._readFromDocument = function(doc) {
  for (var node = doc.firstChild; node; node = node.nextSibling) {
    if (node.nodeType == nodeTypes.ELEMENT) {
      return this.readFromNode(node);
    }
  }
  return null;
};

/**
 * @param  {DOMNode} node
 * @return {Object}
 */
WMS.prototype.readFromNode = function(node) {
  this.version = node.getAttribute('version');
  var wmsCapabilityObject = XMLParser.pushParseAndPop({
    'version': this.version
  }, WMS.PARSERS, node, []);

  return wmsCapabilityObject || null;
};

/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Attribution object.
 */
WMS._readAttribution = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.ATTRIBUTION_PARSERS, node, objectStack);
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object} Bounding box object.
 */
WMS._readBoundingBox = function(node, objectStack) {
  var readDecimalString = XSD.readDecimalString;
  var extent = [
    readDecimalString(node.getAttribute('minx')),
    readDecimalString(node.getAttribute('miny')),
    readDecimalString(node.getAttribute('maxx')),
    readDecimalString(node.getAttribute('maxy'))
  ];

  var resolutions = [
    readDecimalString(node.getAttribute('resx')),
    readDecimalString(node.getAttribute('resy'))
  ];

  return {
    'crs': node.getAttribute('CRS'),
    'extent': extent,
    'res': resolutions
  };
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {ol.Extent|undefined} Bounding box object.
 */
WMS._readEXGeographicBoundingBox = function(node, objectStack) {
  var geographicBoundingBox = XMLParser.pushParseAndPop({},
    WMS.EX_GEOGRAPHIC_BOUNDING_BOX_PARSERS,
    node, objectStack);
  if (!isDef(geographicBoundingBox)) {
    return undefined;
  }

  var westBoundLongitude = /** @type {number|undefined} */
    (geographicBoundingBox['westBoundLongitude']);
  var southBoundLatitude = /** @type {number|undefined} */
    (geographicBoundingBox['southBoundLatitude']);
  var eastBoundLongitude = /** @type {number|undefined} */
    (geographicBoundingBox['eastBoundLongitude']);
  var northBoundLatitude = /** @type {number|undefined} */
    (geographicBoundingBox['northBoundLatitude']);

  if (!isDef(westBoundLongitude) || !isDef(southBoundLatitude) ||
    !isDef(eastBoundLongitude) || !isDef(northBoundLatitude)) {
    return undefined;
  }

  return [
    westBoundLongitude, southBoundLatitude,
    eastBoundLongitude, northBoundLatitude
  ];
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Capability object.
 */
WMS._readCapability = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.CAPABILITY_PARSERS, node, objectStack);
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Service object.
 */
WMS._readService = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.SERVICE_PARSERS, node, objectStack);
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Contact information object.
 */
WMS._readContactInformation = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.CONTACT_INFORMATION_PARSERS,
    node, objectStack);
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Contact person object.
 */
WMS._readContactPersonPrimary = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.CONTACT_PERSON_PARSERS,
    node, objectStack);
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Contact address object.
 */
WMS._readContactAddress = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.CONTACT_ADDRESS_PARSERS,
    node, objectStack);
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Array.<string>|undefined} Format array.
 */
WMS._readException = function(node, objectStack) {
  return XMLParser.pushParseAndPop(
    [], WMS.EXCEPTION_PARSERS, node, objectStack);
};


/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object|undefined} Layer object.
 */
WMS._readCapabilityLayer = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.LAYER_PARSERS, node, objectStack);
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Layer object.
 */
WMS._readLayer = function(node, objectStack) {
  var parentLayerObject = /**  @type {Object.<string,*>} */
    (objectStack[objectStack.length - 1]);

  var layerObject = /**  @type {Object.<string,*>} */
    (XMLParser.pushParseAndPop({}, WMS.LAYER_PARSERS,
      node, objectStack));

  if (!isDef(layerObject)) {
    return undefined;
  }

  var queryable = XSD.readBooleanString(node.getAttribute('queryable'));
  if (!isDef(queryable)) {
    queryable = parentLayerObject['queryable'];
  }
  layerObject['queryable'] = isDef(queryable) ? queryable : false;

  var cascaded = XSD.readNonNegativeIntegerString(node.getAttribute('cascaded'));
  if (!isDef(cascaded)) {
    cascaded = parentLayerObject['cascaded'];
  }
  layerObject['cascaded'] = cascaded;

  var opaque = XSD.readBooleanString(node.getAttribute('opaque'));
  if (!isDef(opaque)) {
    opaque = parentLayerObject['opaque'];
  }
  layerObject['opaque'] = isDef(opaque) ? opaque : false;

  var noSubsets = XSD.readBooleanString(node.getAttribute('noSubsets'));
  if (!isDef(noSubsets)) {
    noSubsets = parentLayerObject['noSubsets'];
  }
  layerObject['noSubsets'] = isDef(noSubsets) ? noSubsets : false;

  var fixedWidth = XSD.readDecimalString(node.getAttribute('fixedWidth'));
  if (!isDef(fixedWidth)) {
    fixedWidth = parentLayerObject['fixedWidth'];
  }
  layerObject['fixedWidth'] = fixedWidth;

  var fixedHeight = XSD.readDecimalString(node.getAttribute('fixedHeight'));
  if (!isDef(fixedHeight)) {
    fixedHeight = parentLayerObject['fixedHeight'];
  }
  layerObject['fixedHeight'] = fixedHeight;

  // See 7.2.4.8
  var addKeys = ['Style', 'CRS', 'AuthorityURL'];
  for (var i = 0, len = addKeys.length; i < len; i++) {
    var key = addKeys[i];
    var parentValue = parentLayerObject[key];
    if (isDef(parentValue)) {
      var childValue = setIfUndefined(layerObject, key, []);
      childValue = childValue.concat(parentValue);
      layerObject[key] = childValue;
    }
  }

  var replaceKeys = ['EX_GeographicBoundingBox', 'BoundingBox', 'Dimension',
    'Attribution', 'MinScaleDenominator', 'MaxScaleDenominator'
  ];
  for (var i = 0, len = replaceKeys.length; i < len; i++) {
    var key = replaceKeys[i];
    var childValue = layerObject[key];
    if (!isDef(childValue)) {
      var parentValue = parentLayerObject[key];
      layerObject[key] = parentValue;
    }
  }

  return layerObject;
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object} Dimension object.
 */
WMS._readDimension = function(node, objectStack) {
  var dimensionObject = {
    'name': node.getAttribute('name'),
    'units': node.getAttribute('units'),
    'unitSymbol': node.getAttribute('unitSymbol'),
    'default': node.getAttribute('default'),
    'multipleValues': XSD.readBooleanString(node.getAttribute('multipleValues')),
    'nearestValue': XSD.readBooleanString(node.getAttribute('nearestValue')),
    'current': XSD.readBooleanString(node.getAttribute('current')),
    'values': XSD.readString(node)
  };
  return dimensionObject;
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Online resource object.
 */
WMS._readFormatOnlineresource = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.FORMAT_ONLINERESOURCE_PARSERS,
    node, objectStack);
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Request object.
 */
WMS._readRequest = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.REQUEST_PARSERS, node, objectStack);
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} DCP type object.
 */
WMS._readDCPType = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.DCPTYPE_PARSERS, node, objectStack);
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} HTTP object.
 */
WMS._readHTTP = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.HTTP_PARSERS, node, objectStack);
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Operation type object.
 */
WMS._readOperationType = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.OPERATIONTYPE_PARSERS, node, objectStack);
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Online resource object.
 */
WMS._readSizedFormatOnlineresource = function(node, objectStack) {
  var formatOnlineresource = WMS._readFormatOnlineresource(node, objectStack);
  if (isDef(formatOnlineresource)) {
    var readNonNegativeIntegerString = XSD.readNonNegativeIntegerString;
    var size = [
      readNonNegativeIntegerString(node.getAttribute('width')),
      readNonNegativeIntegerString(node.getAttribute('height'))
    ];
    formatOnlineresource['size'] = size;
    return formatOnlineresource;
  }
  return undefined;
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Authority URL object.
 */
WMS._readAuthorityURL = function(node, objectStack) {
  var authorityObject = WMS._readFormatOnlineresource(node, objectStack);
  if (isDef(authorityObject)) {
    authorityObject['name'] = node.getAttribute('name');
    return authorityObject;
  }
  return undefined;
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Metadata URL object.
 */
WMS._readMetadataURL = function(node, objectStack) {
  var metadataObject = WMS._readFormatOnlineresource(node, objectStack);
  if (isDef(metadataObject)) {
    metadataObject['type'] = node.getAttribute('type');
    return metadataObject;
  }
  return undefined;
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Object|undefined} Style object.
 */
WMS._readStyle = function(node, objectStack) {
  return XMLParser.pushParseAndPop({}, WMS.STYLE_PARSERS, node, objectStack);
};


/**
 * @private
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @return {Array.<string>|undefined} Keyword list.
 */
WMS._readKeywordList = function(node, objectStack) {
  return XMLParser.pushParseAndPop(
    [], WMS.KEYWORDLIST_PARSERS, node, objectStack);
};

/**
 * @const
 * @type {Array.<string>}
 */
WMS.NAMESPACE_URIS = [
  null,
  'http://www.opengis.net/wms'
];

/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Service': makePropertySetter(WMS._readService),
    'Capability': makePropertySetter(WMS._readCapability)
  });

/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.CAPABILITY_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Request': makePropertySetter(WMS._readRequest),
    'Exception': makePropertySetter(WMS._readException),
    'Layer': makePropertySetter(WMS._readCapabilityLayer)
  });

/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.SERVICE_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Name': makePropertySetter(XSD.readString),
    'Title': makePropertySetter(XSD.readString),
    'Abstract': makePropertySetter(XSD.readString),
    'KeywordList': makePropertySetter(WMS._readKeywordList),
    'OnlineResource': makePropertySetter(XLink.readHref),
    'ContactInformation': makePropertySetter(WMS._readContactInformation),
    'Fees': makePropertySetter(XSD.readString),
    'AccessConstraints': makePropertySetter(XSD.readString),
    'LayerLimit': makePropertySetter(XSD.readNonNegativeInteger),
    'MaxWidth': makePropertySetter(XSD.readNonNegativeInteger),
    'MaxHeight': makePropertySetter(XSD.readNonNegativeInteger)
  });

/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.CONTACT_INFORMATION_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'ContactPersonPrimary': makePropertySetter(WMS._readContactPersonPrimary),
    'ContactPosition': makePropertySetter(XSD.readString),
    'ContactAddress': makePropertySetter(WMS._readContactAddress),
    'ContactVoiceTelephone': makePropertySetter(XSD.readString),
    'ContactFacsimileTelephone': makePropertySetter(XSD.readString),
    'ContactElectronicMailAddress': makePropertySetter(XSD.readString)
  });

/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.CONTACT_PERSON_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'ContactPerson': makePropertySetter(XSD.readString),
    'ContactOrganization': makePropertySetter(XSD.readString)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.CONTACT_ADDRESS_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'AddressType': makePropertySetter(XSD.readString),
    'Address': makePropertySetter(XSD.readString),
    'City': makePropertySetter(XSD.readString),
    'StateOrProvince': makePropertySetter(XSD.readString),
    'PostCode': makePropertySetter(XSD.readString),
    'Country': makePropertySetter(XSD.readString)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.EXCEPTION_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Format': XMLParser.makeArrayPusher(XSD.readString)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.LAYER_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Name': makePropertySetter(XSD.readString),
    'Title': makePropertySetter(XSD.readString),
    'Abstract': makePropertySetter(XSD.readString),
    'KeywordList': makePropertySetter(WMS._readKeywordList),
    'CRS': XMLParser.makeObjectPropertyPusher(XSD.readString),
    'EX_GeographicBoundingBox': makePropertySetter(WMS._readEXGeographicBoundingBox),
    'BoundingBox': XMLParser.makeObjectPropertyPusher(WMS._readBoundingBox),
    'Dimension': XMLParser.makeObjectPropertyPusher(WMS._readDimension),
    'Attribution': makePropertySetter(WMS._readAttribution),
    'AuthorityURL': XMLParser.makeObjectPropertyPusher(WMS._readAuthorityURL),
    'Identifier': XMLParser.makeObjectPropertyPusher(XSD.readString),
    'MetadataURL': XMLParser.makeObjectPropertyPusher(WMS._readMetadataURL),
    'DataURL': XMLParser.makeObjectPropertyPusher(WMS._readFormatOnlineresource),
    'FeatureListURL': XMLParser.makeObjectPropertyPusher(WMS._readFormatOnlineresource),
    'Style': XMLParser.makeObjectPropertyPusher(WMS._readStyle),
    'MinScaleDenominator': makePropertySetter(XSD.readDecimal),
    'MaxScaleDenominator': makePropertySetter(XSD.readDecimal),
    'Layer': XMLParser.makeObjectPropertyPusher(WMS._readLayer)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.ATTRIBUTION_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Title': makePropertySetter(XSD.readString),
    'OnlineResource': makePropertySetter(XLink.readHref),
    'LogoURL': makePropertySetter(WMS._readSizedFormatOnlineresource)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.EX_GEOGRAPHIC_BOUNDING_BOX_PARSERS =
  XMLParser.makeParsersNS(WMS.NAMESPACE_URIS, {
    'westBoundLongitude': makePropertySetter(
      XSD.readDecimal),
    'eastBoundLongitude': makePropertySetter(
      XSD.readDecimal),
    'southBoundLatitude': makePropertySetter(
      XSD.readDecimal),
    'northBoundLatitude': makePropertySetter(
      XSD.readDecimal)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.REQUEST_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'GetCapabilities': makePropertySetter(
      WMS._readOperationType),
    'GetMap': makePropertySetter(
      WMS._readOperationType),
    'GetFeatureInfo': makePropertySetter(
      WMS._readOperationType)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.OPERATIONTYPE_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Format': XMLParser.makeObjectPropertyPusher(XSD.readString),
    'DCPType': XMLParser.makeObjectPropertyPusher(
      WMS._readDCPType)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.DCPTYPE_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'HTTP': makePropertySetter(
      WMS._readHTTP)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.HTTP_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Get': makePropertySetter(
      WMS._readFormatOnlineresource),
    'Post': makePropertySetter(
      WMS._readFormatOnlineresource)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.STYLE_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Name': makePropertySetter(XSD.readString),
    'Title': makePropertySetter(XSD.readString),
    'Abstract': makePropertySetter(XSD.readString),
    'LegendURL': XMLParser.makeObjectPropertyPusher(WMS._readSizedFormatOnlineresource),
    'StyleSheetURL': makePropertySetter(WMS._readFormatOnlineresource),
    'StyleURL': makePropertySetter(WMS._readFormatOnlineresource)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.FORMAT_ONLINERESOURCE_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Format': makePropertySetter(XSD.readString),
    'OnlineResource': makePropertySetter(XLink.readHref)
  });


/**
 * @const
 * @type {Object.<string, Object.<string, XMLParser.Parser>>}
 * @private
 */
WMS.KEYWORDLIST_PARSERS = XMLParser.makeParsersNS(
  WMS.NAMESPACE_URIS, {
    'Keyword': XMLParser.makeArrayPusher(XSD.readString)
  });

module.exports = WMS;

},{"./node_types":"/Users/w8r/Projects/wms-capabilities/src/node_types.js","./utils/isdef":"/Users/w8r/Projects/wms-capabilities/src/utils/isdef.js","./utils/setifundefined":"/Users/w8r/Projects/wms-capabilities/src/utils/setifundefined.js","./xlink":"/Users/w8r/Projects/wms-capabilities/src/xlink.js","./xml_parser":"/Users/w8r/Projects/wms-capabilities/src/xml_parser.js","./xsd":"/Users/w8r/Projects/wms-capabilities/src/xsd.js"}],"/Users/w8r/Projects/wms-capabilities/src/xlink.js":[function(require,module,exports){
"use strict";

/**
 * @const
 * @type {string}
 */
var NAMESPACE_URI = 'http://www.w3.org/1999/xlink';

module.exports = {

  /**
   * @param {Node} node Node.
   * @return {Boolean|undefined} Boolean.
   */
  readHref: function(node) {
    return node.getAttributeNS(NAMESPACE_URI, 'href');
  }
};

},{}],"/Users/w8r/Projects/wms-capabilities/src/xml_parser.js":[function(require,module,exports){
"use strict";

var isDef = require('./utils/isdef');
var setIfUndefined = require('./utils/setifundefined');
var nodeTypes = require('./node_types');

/**
 * XML DOM parser
 * @constructor
 */
function XMLParser() {

  /**
   * @type {DOMParser}
   */
  this._parser = new DOMParser();
};

/**
 * @param  {String} xmlstring
 * @return {Document}
 */
XMLParser.prototype.toDocument = function(xmlstring) {
  return this._parser.parseFromString(xmlstring, 'application/xml');
};

/**
 * Recursively grab all text content of child nodes into a single string.
 * @param {Node} node Node.
 * @param {boolean} normalizeWhitespace Normalize whitespace: remove all line
 * breaks.
 * @return {string} All text content.
 * @api
 */
XMLParser.getAllTextContent = function(node, normalizeWhitespace) {
  return XMLParser.getAllTextContent_(node, normalizeWhitespace, []).join('');
};


/**
 * @param {Node} node Node.
 * @param {boolean} normalizeWhitespace Normalize whitespace: remove all line
 * breaks.
 * @param {Array.<String|string>} accumulator Accumulator.
 * @private
 * @return {Array.<String|string>} Accumulator.
 */
XMLParser.getAllTextContent_ = function(node, normalizeWhitespace, accumulator) {
  if (node.nodeType === nodeTypes.CDATA_SECTION ||
    node.nodeType === nodeTypes.TEXT) {
    if (normalizeWhitespace) {
      // FIXME understand why goog.dom.getTextContent_ uses String here
      accumulator.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ''));
    } else {
      accumulator.push(node.nodeValue);
    }
  } else {
    var n;
    for (n = node.firstChild; n; n = n.nextSibling) {
      XMLParser.getAllTextContent_(n, normalizeWhitespace, accumulator);
    }
  }
  return accumulator;
};

/**
 * @param {Object.<string, Object.<string, XMLParser.Parser>>} parsersNS
 *     Parsers by namespace.
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @param {*=} bind The object to use as `this`.
 */
XMLParser.parseNode = function(parsersNS, node, objectStack, bind) {
  var n;
  for (n = node.firstElementChild; n; n = n.nextElementSibling) {
    var parsers = parsersNS[n.namespaceURI];
    if (isDef(parsers)) {
      var parser = parsers[n.localName];
      if (isDef(parser)) {
        parser.call(bind, n, objectStack);
      }
    }
  }
};

/**
 * @param {Array.<string>} namespaceURIs Namespace URIs.
 * @param {Object.<string, XMLParser.Parser>} parsers Parsers.
 * @param {Object.<string, Object.<string, XMLParser.Parser>>=} opt_parsersNS
 *     ParsersNS.
 * @return {Object.<string, Object.<string, XMLParser.Parser>>} Parsers NS.
 */
XMLParser.makeParsersNS = function(namespaceURIs, parsers, opt_parsersNS) {
  return /** @type {Object.<string, Object.<string, XMLParser.Parser>>} */ (
    XMLParser.makeStructureNS(namespaceURIs, parsers, opt_parsersNS));
};

/**
 * Creates a namespaced structure, using the same values for each namespace.
 * This can be used as a starting point for versioned parsers, when only a few
 * values are version specific.
 * @param {Array.<string>} namespaceURIs Namespace URIs.
 * @param {T} structure Structure.
 * @param {Object.<string, T>=} opt_structureNS Namespaced structure to add to.
 * @return {Object.<string, T>} Namespaced structure.
 * @template T
 */
XMLParser.makeStructureNS = function(namespaceURIs, structure, opt_structureNS) {
  /**
   * @type {Object.<string, *>}
   */
  var structureNS = isDef(opt_structureNS) ? opt_structureNS : {};
  var i, ii;
  for (i = 0, ii = namespaceURIs.length; i < ii; ++i) {
    structureNS[namespaceURIs[i]] = structure;
  }
  return structureNS;
};

/**
 * @param {function(this: T, Node, Array.<*>): *} valueReader Value reader.
 * @param {string=} opt_property Property.
 * @param {T=} opt_this The object to use as `this` in `valueReader`.
 * @return {XMLParser.Parser} Parser.
 * @template T
 */
XMLParser.makeObjectPropertySetter = function(valueReader, opt_property, opt_this) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array.<*>} objectStack Object stack.
     */
    function(node, objectStack) {
      var value = valueReader.call(isDef(opt_this) ? opt_this : this,
        node, objectStack);
      if (isDef(value)) {
        var object = /** @type {Object} */ (objectStack[objectStack.length - 1]);
        var property = isDef(opt_property) ? opt_property : node.localName;
        object[property] = value;
      }
    });
};

/**
 * @param {function(this: T, Node, Array.<*>): *} valueReader Value reader.
 * @param {string=} opt_property Property.
 * @param {T=} opt_this The object to use as `this` in `valueReader`.
 * @return {Function} Parser.
 * @template T
 */
XMLParser.makeObjectPropertyPusher = function(valueReader, opt_property, opt_this) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array.<*>} objectStack Object stack.
     */
    function(node, objectStack) {
      var value = valueReader.call(isDef(opt_this) ? opt_this : this,
        node, objectStack);

      if (isDef(value)) {
        var object = /** @type {Object} */ (objectStack[objectStack.length - 1]);
        var property = isDef(opt_property) ? opt_property : node.localName;
        var array = setIfUndefined(object, property, []);
        array.push(value);
      }
    });
};

/**
 * @param {function(this: T, Node, Array.<*>): *} valueReader Value reader.
 * @param {T=} opt_this The object to use as `this` in `valueReader`.
 * @return {Function} Parser.
 * @template T
 */
XMLParser.makeArrayPusher = function(valueReader, opt_this) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array.<*>} objectStack Object stack.
     */
    function(node, objectStack) {
      var value = valueReader.call(isDef(opt_this) ? opt_this : this,
        node, objectStack);
      if (isDef(value)) {
        var array = objectStack[objectStack.length - 1];
        array.push(value);
      }
    });
};

/**
 * @param {Object}                                     object Object.
 * @param {Object.<String, Object.<String, Function>>} parsersNS Parsers by namespace.
 * @param {Node}                                       node Node.
 * @param {Array.<*>}                                  objectStack Object stack.
 * @param {*=}                                         bind The object to use as `this`.
 * @return {Object|undefined} Object.
 */
XMLParser.pushParseAndPop = function(object, parsersNS, node, objectStack, bind) {
  objectStack.push(object);
  XMLParser.parseNode(parsersNS, node, objectStack, bind);
  return objectStack.pop();
};

module.exports = XMLParser;

},{"./node_types":"/Users/w8r/Projects/wms-capabilities/src/node_types.js","./utils/isdef":"/Users/w8r/Projects/wms-capabilities/src/utils/isdef.js","./utils/setifundefined":"/Users/w8r/Projects/wms-capabilities/src/utils/setifundefined.js"}],"/Users/w8r/Projects/wms-capabilities/src/xsd.js":[function(require,module,exports){
"use strict";

var isDef = require('./utils/isdef');
var string = require('./utils/string');
var XMLParser = require('./xml_parser');

var XSD = {};

/**
 * @const
 * @type {string}
 */
XSD.NAMESPACE_URI = 'http://www.w3.org/2001/XMLSchema';

/**
 * @param {Node} node Node.
 * @return {boolean|undefined} Boolean.
 */
XSD.readBoolean = function(node) {
  var s = XMLParser.getAllTextContent(node, false);
  return XSD.readBooleanString(s);
};

/**
 * @param {string} string String.
 * @return {boolean|undefined} Boolean.
 */
XSD.readBooleanString = function(string) {
  var m = /^\s*(true|1)|(false|0)\s*$/.exec(string);
  if (m) {
    return isDef(m[1]) || false;
  } else {
    return undefined;
  }
};


/**
 * @param {Node} node Node.
 * @return {number|undefined} DateTime in seconds.
 */
XSD.readDateTime = function(node) {
  var s = XMLParser.getAllTextContent(node, false);
  var re = /^\s*(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|(?:([+\-])(\d{2})(?::(\d{2}))?))\s*$/;
  var m = re.exec(s);
  if (m) {
    var year = parseInt(m[1], 10);
    var month = parseInt(m[2], 10) - 1;
    var day = parseInt(m[3], 10);
    var hour = parseInt(m[4], 10);
    var minute = parseInt(m[5], 10);
    var second = parseInt(m[6], 10);
    var dateTime = Date.UTC(year, month, day, hour, minute, second) / 1000;
    if (m[7] != 'Z') {
      var sign = m[8] == '-' ? -1 : 1;
      dateTime += sign * 60 * parseInt(m[9], 10);
      if (isDef(m[10])) {
        dateTime += sign * 60 * 60 * parseInt(m[10], 10);
      }
    }
    return dateTime;
  } else {
    return undefined;
  }
};


/**
 * @param {Node} node Node.
 * @return {number|undefined} Decimal.
 */
XSD.readDecimal = function(node) {
  var s = XMLParser.getAllTextContent(node, false);
  return XSD.readDecimalString(s);
};


/**
 * @param {string} string String.
 * @return {number|undefined} Decimal.
 */
XSD.readDecimalString = function(string) {
  // FIXME check spec
  var m = /^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*$/i.exec(string);
  if (m) {
    return parseFloat(m[1]);
  } else {
    return undefined;
  }
};


/**
 * @param {Node} node Node.
 * @return {number|undefined} Non negative integer.
 */
XSD.readNonNegativeInteger = function(node) {
  var s = XMLParser.getAllTextContent(node, false);
  return XSD.readNonNegativeIntegerString(s);
};


/**
 * @param {string} string String.
 * @return {number|undefined} Non negative integer.
 */
XSD.readNonNegativeIntegerString = function(string) {
  var m = /^\s*(\d+)\s*$/.exec(string);
  if (m) {
    return parseInt(m[1], 10);
  } else {
    return undefined;
  }
};


/**
 * @param {Node} node Node.
 * @return {string|undefined} String.
 */
XSD.readString = function(node) {
  var s = XMLParser.getAllTextContent(node, false);
  return string.trim(s);
};


/**
 * @param {Node} node Node to append a TextNode with the boolean to.
 * @param {boolean} bool Boolean.
 */
XSD.writeBooleanTextNode = function(node, bool) {
  XSD.writeStringTextNode(node, (bool) ? '1' : '0');
};


/**
 * @param {Node} node Node to append a TextNode with the dateTime to.
 * @param {number} dateTime DateTime in seconds.
 */
XSD.writeDateTimeTextNode = function(node, dateTime) {
  var date = new Date(dateTime * 1000);
  var string = date.getUTCFullYear() + '-' +
    string.padNumber(date.getUTCMonth() + 1, 2) + '-' +
    string.padNumber(date.getUTCDate(), 2) + 'T' +
    string.padNumber(date.getUTCHours(), 2) + ':' +
    string.padNumber(date.getUTCMinutes(), 2) + ':' +
    string.padNumber(date.getUTCSeconds(), 2) + 'Z';
  node.appendChild(XMLParser.DOCUMENT.createTextNode(string));
};


/**
 * @param {Node} node Node to append a TextNode with the decimal to.
 * @param {number} decimal Decimal.
 */
XSD.writeDecimalTextNode = function(node, decimal) {
  var string = decimal.toPrecision();
  node.appendChild(XMLParser.DOCUMENT.createTextNode(string));
};


/**
 * @param {Node} node Node to append a TextNode with the decimal to.
 * @param {number} nonNegativeInteger Non negative integer.
 */
XSD.writeNonNegativeIntegerTextNode = function(node, nonNegativeInteger) {
  var string = nonNegativeInteger.toString();
  node.appendChild(XMLParser.DOCUMENT.createTextNode(string));
};


/**
 * @param {Node} node Node to append a TextNode with the string to.
 * @param {string} string String.
 */
XSD.writeStringTextNode = function(node, string) {
  node.appendChild(XMLParser.DOCUMENT.createTextNode(string));
};

module.exports = XSD;

},{"./utils/isdef":"/Users/w8r/Projects/wms-capabilities/src/utils/isdef.js","./utils/string":"/Users/w8r/Projects/wms-capabilities/src/utils/string.js","./xml_parser":"/Users/w8r/Projects/wms-capabilities/src/xml_parser.js"}]},{},["/Users/w8r/Projects/wms-capabilities/example/js/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9qcy9hcHAuanMiLCJleGFtcGxlL2pzL2pzb24tZm9ybWF0LmpzIiwiZXhhbXBsZS9qcy94bWwtZm9ybWF0LmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwibm9kZV9tb2R1bGVzL3NwaW4uanMvc3Bpbi5qcyIsInNyYy9ub2RlX3R5cGVzLmpzIiwic3JjL3V0aWxzL2lzZGVmLmpzIiwic3JjL3V0aWxzL3NldGlmdW5kZWZpbmVkLmpzIiwic3JjL3V0aWxzL3N0cmluZy5qcyIsInNyYy93bXMuanMiLCJzcmMveGxpbmsuanMiLCJzcmMveG1sX3BhcnNlci5qcyIsInNyYy94c2QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbHVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIganNvbkZvcm1hdCA9IGdsb2JhbC5qc29uRm9ybWF0ID0gcmVxdWlyZSgnLi9qc29uLWZvcm1hdCcpO1xudmFyIHhtbEZvcm1hdCA9IGdsb2JhbC54bWxGb3JtYXQgPSByZXF1aXJlKCcuL3htbC1mb3JtYXQnKTtcbnZhciBXTVNDYXBhYmlsaXRpZXMgPSBnbG9iYWwuV01TQ2FwYWJpbGl0aWVzID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcbnZhciBTcGlubmVyID0gcmVxdWlyZSgnc3Bpbi5qcycpO1xudmFyIHJlcXdlc3QgPSByZXF1aXJlKCdyZXF3ZXN0Jyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbnZhciBzZXJ2aWNlU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlcnZpY2UnKTtcbnZhciB4bWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneG1sJyk7XG52YXIganNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqc29uJyk7XG52YXIgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtYXJlYScpO1xuXG4vLyB0aGUgb25seSBvcGVuIENPUlMgcHJveHkgSSBjb3VsZCBmaW5kXG52YXIgcHJveHkgPSAnaHR0cDovL2pzb25wLm5vZGVqaXRzdS5jb20vP3VybD0nO1xudmFyIHBhcnNlciA9IG5ldyBXTVNDYXBhYmlsaXRpZXMoKTtcblxuZnVuY3Rpb24gc2hvd0lucHV0KCkge1xuICB4bWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgaW5wdXQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG59XG5cbmZ1bmN0aW9uIGhpZGVJbnB1dCgpIHtcbiAgeG1sLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUoeG1sU3RyaW5nKSB7XG4gIHhtbC50ZXh0Q29udGVudCA9IHhtbEZvcm1hdCh4bWxTdHJpbmcpO1xuICBQcmlzbS5oaWdobGlnaHRFbGVtZW50KHhtbCk7XG5cbiAganNvbi50ZXh0Q29udGVudCA9IGpzb25Gb3JtYXQoSlNPTi5zdHJpbmdpZnkocGFyc2VyLnBhcnNlKHhtbFN0cmluZykpKTtcbiAgUHJpc20uaGlnaGxpZ2h0RWxlbWVudChqc29uKTtcbn1cblxuc2VydmljZVNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgaWYgKHNlcnZpY2VTZWxlY3QudmFsdWUgIT09ICcnKSB7XG4gICAgaGlkZUlucHV0KCk7XG4gICAgcmVxd2VzdCh7XG4gICAgICB1cmw6IHByb3h5ICsgZW5jb2RlVVJJQ29tcG9uZW50KHNlcnZpY2VTZWxlY3QudmFsdWUpLFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICB1cGRhdGUoSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KS5lcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0sIGZhbHNlKTtcblxueG1sLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2hvd0lucHV0LCBmYWxzZSk7XG5cbmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgZnVuY3Rpb24oKSB7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgdXBkYXRlKGlucHV0LnZhbHVlKTtcbiAgfSwgNTApO1xufSwgZmFsc2UpO1xuIiwiLypcbiAgICBqc29uLWZvcm1hdCB2LjEuMVxuICAgIGh0dHA6Ly9naXRodWIuY29tL3Bob2Jvc2xhYi9qc29uLWZvcm1hdFxuXG4gICAgUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2U6XG4gICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiovXG5cbnZhciBwID0gW10sXG4gIHB1c2ggPSBmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIHAucHVzaChtKSArICdcXFxcJztcbiAgfSxcbiAgcG9wID0gZnVuY3Rpb24obSwgaSkge1xuICAgIHJldHVybiBwW2kgLSAxXVxuICB9LFxuICB0YWJzID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICByZXR1cm4gbmV3IEFycmF5KGNvdW50ICsgMSkuam9pbignXFx0Jyk7XG4gIH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oanNvbikge1xuICBwID0gW107XG4gIHZhciBvdXQgPSBcIlwiLFxuICAgIGluZGVudCA9IDA7XG5cbiAgLy8gRXh0cmFjdCBiYWNrc2xhc2hlcyBhbmQgc3RyaW5nc1xuICBqc29uID0ganNvblxuICAgIC5yZXBsYWNlKC9cXFxcLi9nLCBwdXNoKVxuICAgIC5yZXBsYWNlKC8oXCIuKj9cInwnLio/JykvZywgcHVzaClcbiAgICAucmVwbGFjZSgvXFxzKy8sICcnKTtcblxuICAvLyBJbmRlbnQgYW5kIGluc2VydCBuZXdsaW5lc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYyA9IGpzb24uY2hhckF0KGkpO1xuXG4gICAgc3dpdGNoIChjKSB7XG4gICAgICBjYXNlICd7JzpcbiAgICAgICAgb3V0ICs9IGMgKyBcIlxcblwiICsgdGFicygrK2luZGVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnWyc6XG4gICAgICAgIG91dCArPSBjICsgXCJcXG5cIiArIHRhYnMoKytpbmRlbnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ10nOlxuICAgICAgICBvdXQgKz0gXCJcXG5cIiArIHRhYnMoLS1pbmRlbnQpICsgYztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd9JzpcbiAgICAgICAgb3V0ICs9IFwiXFxuXCIgKyB0YWJzKC0taW5kZW50KSArIGM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnLCc6XG4gICAgICAgIGlmICgvXFxkLy50ZXN0KGpzb24uY2hhckF0KGkgLSAxKSkpIHtcbiAgICAgICAgICBvdXQgKz0gXCIsIFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dCArPSBcIixcXG5cIiArIHRhYnMoaW5kZW50KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJzonOlxuICAgICAgICBvdXQgKz0gXCI6IFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG91dCArPSBjO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBTdHJpcCB3aGl0ZXNwYWNlIGZyb20gbnVtZXJpYyBhcnJheXMgYW5kIHB1dCBiYWNrc2xhc2hlc1xuICAvLyBhbmQgc3RyaW5ncyBiYWNrIGluXG4gIG91dCA9IG91dFxuICAgIC5yZXBsYWNlKC9cXFtbXFxkLFxcc10rP1xcXS9nLCBmdW5jdGlvbihtKSB7XG4gICAgICByZXR1cm4gbS5yZXBsYWNlKC9cXHMvZywgJycpO1xuICAgIH0pXG4gICAgLy8gbnVtYmVyIGFycmF5c1xuICAgIC5yZXBsYWNlKC9cXFtcXHMqKFxcZCkvZywgZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuICdbJyArIGI7XG4gICAgfSlcbiAgICAucmVwbGFjZSgvKFxcZClcXHMqXFxdL2csIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBiICsgJ10nO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoL1xce1xccypcXH0vZywgJ3t9JykgLy8gZW1wdHkgb2JqZWN0c1xuICAgIC5yZXBsYWNlKC9cXFxcKFxcZCspXFxcXC9nLCBwb3ApIC8vIHN0cmluZ3NcbiAgICAucmVwbGFjZSgvXFxcXChcXGQrKVxcXFwvZywgcG9wKTsgLy8gYmFja3NsYXNoZXMgaW4gc3RyaW5nc1xuXG4gIHJldHVybiBvdXQ7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oeG1sKSB7XG4gIHZhciBmb3JtYXR0ZWQgPSAnJztcbiAgdmFyIHJlZyA9IC8oPikoPCkoXFwvKikvZztcbiAgeG1sID0geG1sLnJlcGxhY2UocmVnLCAnJDFcXHJcXG4kMiQzJyk7XG4gIHZhciBwYWQgPSAwO1xuXG4gIHhtbC5zcGxpdCgnXFxyXFxuJykuZm9yRWFjaChmdW5jdGlvbihub2RlLCBpbmRleCkge1xuICAgIHZhciBpbmRlbnQgPSAwO1xuICAgIGlmIChub2RlLm1hdGNoKC8uKzxcXC9cXHdbXj5dKj4kLykpIHtcbiAgICAgIGluZGVudCA9IDA7XG4gICAgfSBlbHNlIGlmIChub2RlLm1hdGNoKC9ePFxcL1xcdy8pKSB7XG4gICAgICBpZiAocGFkICE9IDApIHtcbiAgICAgICAgcGFkIC09IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLm1hdGNoKC9ePFxcd1tePl0qW15cXC9dPi4qJC8pKSB7XG4gICAgICBpbmRlbnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmRlbnQgPSAwO1xuICAgIH1cblxuICAgIHZhciBwYWRkaW5nID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWQ7IGkrKykge1xuICAgICAgcGFkZGluZyArPSAnICAnO1xuICAgIH1cblxuICAgIGZvcm1hdHRlZCArPSBwYWRkaW5nICsgbm9kZSArICdcXHJcXG4nO1xuICAgIHBhZCArPSBpbmRlbnQ7XG4gIH0pO1xuXG4gIHJldHVybiBmb3JtYXR0ZWQ7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvd21zJyk7XG4iLCIvKiFcbiAgKiBSZXF3ZXN0ISBBIGdlbmVyYWwgcHVycG9zZSBYSFIgY29ubmVjdGlvbiBtYW5hZ2VyXG4gICogbGljZW5zZSBNSVQgKGMpIER1c3RpbiBEaWF6IDIwMTRcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL3JlcXdlc3RcbiAgKi9cblxuIWZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSgncmVxd2VzdCcsIHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICB2YXIgd2luID0gd2luZG93XG4gICAgLCBkb2MgPSBkb2N1bWVudFxuICAgICwgaHR0cHNSZSA9IC9eaHR0cC9cbiAgICAsIHByb3RvY29sUmUgPSAvKF5cXHcrKTpcXC9cXC8vXG4gICAgLCB0d29IdW5kbyA9IC9eKDIwXFxkfDEyMjMpJC8gLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMDQ2OTcyL21zaWUtcmV0dXJucy1zdGF0dXMtY29kZS1vZi0xMjIzLWZvci1hamF4LXJlcXVlc3RcbiAgICAsIGJ5VGFnID0gJ2dldEVsZW1lbnRzQnlUYWdOYW1lJ1xuICAgICwgcmVhZHlTdGF0ZSA9ICdyZWFkeVN0YXRlJ1xuICAgICwgY29udGVudFR5cGUgPSAnQ29udGVudC1UeXBlJ1xuICAgICwgcmVxdWVzdGVkV2l0aCA9ICdYLVJlcXVlc3RlZC1XaXRoJ1xuICAgICwgaGVhZCA9IGRvY1tieVRhZ10oJ2hlYWQnKVswXVxuICAgICwgdW5pcWlkID0gMFxuICAgICwgY2FsbGJhY2tQcmVmaXggPSAncmVxd2VzdF8nICsgKCtuZXcgRGF0ZSgpKVxuICAgICwgbGFzdFZhbHVlIC8vIGRhdGEgc3RvcmVkIGJ5IHRoZSBtb3N0IHJlY2VudCBKU09OUCBjYWxsYmFja1xuICAgICwgeG1sSHR0cFJlcXVlc3QgPSAnWE1MSHR0cFJlcXVlc3QnXG4gICAgLCB4RG9tYWluUmVxdWVzdCA9ICdYRG9tYWluUmVxdWVzdCdcbiAgICAsIG5vb3AgPSBmdW5jdGlvbiAoKSB7fVxuXG4gICAgLCBpc0FycmF5ID0gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IEFycmF5LmlzQXJyYXlcbiAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGEgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgIH1cblxuICAgICwgZGVmYXVsdEhlYWRlcnMgPSB7XG4gICAgICAgICAgJ2NvbnRlbnRUeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgLCAncmVxdWVzdGVkV2l0aCc6IHhtbEh0dHBSZXF1ZXN0XG4gICAgICAgICwgJ2FjY2VwdCc6IHtcbiAgICAgICAgICAgICAgJyonOiAgJ3RleHQvamF2YXNjcmlwdCwgdGV4dC9odG1sLCBhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sLCAqLyonXG4gICAgICAgICAgICAsICd4bWwnOiAgJ2FwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwnXG4gICAgICAgICAgICAsICdodG1sJzogJ3RleHQvaHRtbCdcbiAgICAgICAgICAgICwgJ3RleHQnOiAndGV4dC9wbGFpbidcbiAgICAgICAgICAgICwgJ2pzb24nOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgICAgLCAnanMnOiAgICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCB0ZXh0L2phdmFzY3JpcHQnXG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLCB4aHIgPSBmdW5jdGlvbihvKSB7XG4gICAgICAgIC8vIGlzIGl0IHgtZG9tYWluXG4gICAgICAgIGlmIChvWydjcm9zc09yaWdpbiddID09PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHhociA9IHdpblt4bWxIdHRwUmVxdWVzdF0gPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG51bGxcbiAgICAgICAgICBpZiAoeGhyICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIHhocikge1xuICAgICAgICAgICAgcmV0dXJuIHhoclxuICAgICAgICAgIH0gZWxzZSBpZiAod2luW3hEb21haW5SZXF1ZXN0XSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdCgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGNyb3NzLW9yaWdpbiByZXF1ZXN0cycpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHdpblt4bWxIdHRwUmVxdWVzdF0pIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICwgZ2xvYmFsU2V0dXBPcHRpb25zID0ge1xuICAgICAgICBkYXRhRmlsdGVyOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHJldHVybiBkYXRhXG4gICAgICAgIH1cbiAgICAgIH1cblxuICBmdW5jdGlvbiBzdWNjZWVkKHIpIHtcbiAgICB2YXIgcHJvdG9jb2wgPSBwcm90b2NvbFJlLmV4ZWMoci51cmwpO1xuICAgIHByb3RvY29sID0gKHByb3RvY29sICYmIHByb3RvY29sWzFdKSB8fCB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2w7XG4gICAgcmV0dXJuIGh0dHBzUmUudGVzdChwcm90b2NvbCkgPyB0d29IdW5kby50ZXN0KHIucmVxdWVzdC5zdGF0dXMpIDogISFyLnJlcXVlc3QucmVzcG9uc2U7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVSZWFkeVN0YXRlKHIsIHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHVzZSBfYWJvcnRlZCB0byBtaXRpZ2F0ZSBhZ2FpbnN0IElFIGVyciBjMDBjMDIzZlxuICAgICAgLy8gKGNhbid0IHJlYWQgcHJvcHMgb24gYWJvcnRlZCByZXF1ZXN0IG9iamVjdHMpXG4gICAgICBpZiAoci5fYWJvcnRlZCkgcmV0dXJuIGVycm9yKHIucmVxdWVzdClcbiAgICAgIGlmIChyLl90aW1lZE91dCkgcmV0dXJuIGVycm9yKHIucmVxdWVzdCwgJ1JlcXVlc3QgaXMgYWJvcnRlZDogdGltZW91dCcpXG4gICAgICBpZiAoci5yZXF1ZXN0ICYmIHIucmVxdWVzdFtyZWFkeVN0YXRlXSA9PSA0KSB7XG4gICAgICAgIHIucmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBub29wXG4gICAgICAgIGlmIChzdWNjZWVkKHIpKSBzdWNjZXNzKHIucmVxdWVzdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVycm9yKHIucmVxdWVzdClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRIZWFkZXJzKGh0dHAsIG8pIHtcbiAgICB2YXIgaGVhZGVycyA9IG9bJ2hlYWRlcnMnXSB8fCB7fVxuICAgICAgLCBoXG5cbiAgICBoZWFkZXJzWydBY2NlcHQnXSA9IGhlYWRlcnNbJ0FjY2VwdCddXG4gICAgICB8fCBkZWZhdWx0SGVhZGVyc1snYWNjZXB0J11bb1sndHlwZSddXVxuICAgICAgfHwgZGVmYXVsdEhlYWRlcnNbJ2FjY2VwdCddWycqJ11cblxuICAgIHZhciBpc0FGb3JtRGF0YSA9IHR5cGVvZiBGb3JtRGF0YSA9PT0gJ2Z1bmN0aW9uJyAmJiAob1snZGF0YSddIGluc3RhbmNlb2YgRm9ybURhdGEpO1xuICAgIC8vIGJyZWFrcyBjcm9zcy1vcmlnaW4gcmVxdWVzdHMgd2l0aCBsZWdhY3kgYnJvd3NlcnNcbiAgICBpZiAoIW9bJ2Nyb3NzT3JpZ2luJ10gJiYgIWhlYWRlcnNbcmVxdWVzdGVkV2l0aF0pIGhlYWRlcnNbcmVxdWVzdGVkV2l0aF0gPSBkZWZhdWx0SGVhZGVyc1sncmVxdWVzdGVkV2l0aCddXG4gICAgaWYgKCFoZWFkZXJzW2NvbnRlbnRUeXBlXSAmJiAhaXNBRm9ybURhdGEpIGhlYWRlcnNbY29udGVudFR5cGVdID0gb1snY29udGVudFR5cGUnXSB8fCBkZWZhdWx0SGVhZGVyc1snY29udGVudFR5cGUnXVxuICAgIGZvciAoaCBpbiBoZWFkZXJzKVxuICAgICAgaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShoKSAmJiAnc2V0UmVxdWVzdEhlYWRlcicgaW4gaHR0cCAmJiBodHRwLnNldFJlcXVlc3RIZWFkZXIoaCwgaGVhZGVyc1toXSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pIHtcbiAgICBpZiAodHlwZW9mIG9bJ3dpdGhDcmVkZW50aWFscyddICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaHR0cC53aXRoQ3JlZGVudGlhbHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBodHRwLndpdGhDcmVkZW50aWFscyA9ICEhb1snd2l0aENyZWRlbnRpYWxzJ11cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmFsQ2FsbGJhY2soZGF0YSkge1xuICAgIGxhc3RWYWx1ZSA9IGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIHVybGFwcGVuZCAodXJsLCBzKSB7XG4gICAgcmV0dXJuIHVybCArICgvXFw/Ly50ZXN0KHVybCkgPyAnJicgOiAnPycpICsgc1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKSB7XG4gICAgdmFyIHJlcUlkID0gdW5pcWlkKytcbiAgICAgICwgY2JrZXkgPSBvWydqc29ucENhbGxiYWNrJ10gfHwgJ2NhbGxiYWNrJyAvLyB0aGUgJ2NhbGxiYWNrJyBrZXlcbiAgICAgICwgY2J2YWwgPSBvWydqc29ucENhbGxiYWNrTmFtZSddIHx8IHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXgocmVxSWQpXG4gICAgICAsIGNicmVnID0gbmV3IFJlZ0V4cCgnKChefFxcXFw/fCYpJyArIGNia2V5ICsgJyk9KFteJl0rKScpXG4gICAgICAsIG1hdGNoID0gdXJsLm1hdGNoKGNicmVnKVxuICAgICAgLCBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgICwgbG9hZGVkID0gMFxuICAgICAgLCBpc0lFMTAgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgMTAuMCcpICE9PSAtMVxuXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBpZiAobWF0Y2hbM10gPT09ICc/Jykge1xuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShjYnJlZywgJyQxPScgKyBjYnZhbCkgLy8gd2lsZGNhcmQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYnZhbCA9IG1hdGNoWzNdIC8vIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmMgbmFtZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBjYmtleSArICc9JyArIGNidmFsKSAvLyBubyBjYWxsYmFjayBkZXRhaWxzLCBhZGQgJ2VtXG4gICAgfVxuXG4gICAgd2luW2NidmFsXSA9IGdlbmVyYWxDYWxsYmFja1xuXG4gICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICAgIHNjcmlwdC5zcmMgPSB1cmxcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlXG4gICAgaWYgKHR5cGVvZiBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlICE9PSAndW5kZWZpbmVkJyAmJiAhaXNJRTEwKSB7XG4gICAgICAvLyBuZWVkIHRoaXMgZm9yIElFIGR1ZSB0byBvdXQtb2Ytb3JkZXIgb25yZWFkeXN0YXRlY2hhbmdlKCksIGJpbmRpbmcgc2NyaXB0XG4gICAgICAvLyBleGVjdXRpb24gdG8gYW4gZXZlbnQgbGlzdGVuZXIgZ2l2ZXMgdXMgY29udHJvbCBvdmVyIHdoZW4gdGhlIHNjcmlwdFxuICAgICAgLy8gaXMgZXhlY3V0ZWQuIFNlZSBodHRwOi8vamF1Ym91cmcubmV0LzIwMTAvMDcvbG9hZGluZy1zY3JpcHQtYXMtb25jbGljay1oYW5kbGVyLW9mLmh0bWxcbiAgICAgIHNjcmlwdC5odG1sRm9yID0gc2NyaXB0LmlkID0gJ19yZXF3ZXN0XycgKyByZXFJZFxuICAgIH1cblxuICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKChzY3JpcHRbcmVhZHlTdGF0ZV0gJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnY29tcGxldGUnICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2xvYWRlZCcpIHx8IGxvYWRlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgc2NyaXB0Lm9uY2xpY2sgJiYgc2NyaXB0Lm9uY2xpY2soKVxuICAgICAgLy8gQ2FsbCB0aGUgdXNlciBjYWxsYmFjayB3aXRoIHRoZSBsYXN0IHZhbHVlIHN0b3JlZCBhbmQgY2xlYW4gdXAgdmFsdWVzIGFuZCBzY3JpcHRzLlxuICAgICAgZm4obGFzdFZhbHVlKVxuICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgIGxvYWRlZCA9IDFcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIHNjcmlwdCB0byB0aGUgRE9NIGhlYWRcbiAgICBoZWFkLmFwcGVuZENoaWxkKHNjcmlwdClcblxuICAgIC8vIEVuYWJsZSBKU09OUCB0aW1lb3V0XG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgICBlcnIoe30sICdSZXF1ZXN0IGlzIGFib3J0ZWQ6IHRpbWVvdXQnLCB7fSlcbiAgICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgICBsb2FkZWQgPSAxXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVxdWVzdChmbiwgZXJyKSB7XG4gICAgdmFyIG8gPSB0aGlzLm9cbiAgICAgICwgbWV0aG9kID0gKG9bJ21ldGhvZCddIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAsIHVybCA9IHR5cGVvZiBvID09PSAnc3RyaW5nJyA/IG8gOiBvWyd1cmwnXVxuICAgICAgLy8gY29udmVydCBub24tc3RyaW5nIG9iamVjdHMgdG8gcXVlcnktc3RyaW5nIGZvcm0gdW5sZXNzIG9bJ3Byb2Nlc3NEYXRhJ10gaXMgZmFsc2VcbiAgICAgICwgZGF0YSA9IChvWydwcm9jZXNzRGF0YSddICE9PSBmYWxzZSAmJiBvWydkYXRhJ10gJiYgdHlwZW9mIG9bJ2RhdGEnXSAhPT0gJ3N0cmluZycpXG4gICAgICAgID8gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKG9bJ2RhdGEnXSlcbiAgICAgICAgOiAob1snZGF0YSddIHx8IG51bGwpXG4gICAgICAsIGh0dHBcbiAgICAgICwgc2VuZFdhaXQgPSBmYWxzZVxuXG4gICAgLy8gaWYgd2UncmUgd29ya2luZyBvbiBhIEdFVCByZXF1ZXN0IGFuZCB3ZSBoYXZlIGRhdGEgdGhlbiB3ZSBzaG91bGQgYXBwZW5kXG4gICAgLy8gcXVlcnkgc3RyaW5nIHRvIGVuZCBvZiBVUkwgYW5kIG5vdCBwb3N0IGRhdGFcbiAgICBpZiAoKG9bJ3R5cGUnXSA9PSAnanNvbnAnIHx8IG1ldGhvZCA9PSAnR0VUJykgJiYgZGF0YSkge1xuICAgICAgdXJsID0gdXJsYXBwZW5kKHVybCwgZGF0YSlcbiAgICAgIGRhdGEgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKG9bJ3R5cGUnXSA9PSAnanNvbnAnKSByZXR1cm4gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKVxuXG4gICAgLy8gZ2V0IHRoZSB4aHIgZnJvbSB0aGUgZmFjdG9yeSBpZiBwYXNzZWRcbiAgICAvLyBpZiB0aGUgZmFjdG9yeSByZXR1cm5zIG51bGwsIGZhbGwtYmFjayB0byBvdXJzXG4gICAgaHR0cCA9IChvLnhociAmJiBvLnhocihvKSkgfHwgeGhyKG8pXG5cbiAgICBodHRwLm9wZW4obWV0aG9kLCB1cmwsIG9bJ2FzeW5jJ10gPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlKVxuICAgIHNldEhlYWRlcnMoaHR0cCwgbylcbiAgICBzZXRDcmVkZW50aWFscyhodHRwLCBvKVxuICAgIGlmICh3aW5beERvbWFpblJlcXVlc3RdICYmIGh0dHAgaW5zdGFuY2VvZiB3aW5beERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgIGh0dHAub25sb2FkID0gZm5cbiAgICAgICAgaHR0cC5vbmVycm9yID0gZXJyXG4gICAgICAgIC8vIE5PVEU6IHNlZVxuICAgICAgICAvLyBodHRwOi8vc29jaWFsLm1zZG4ubWljcm9zb2Z0LmNvbS9Gb3J1bXMvZW4tVVMvaWV3ZWJkZXZlbG9wbWVudC90aHJlYWQvMzBlZjNhZGQtNzY3Yy00NDM2LWI4YTktZjFjYTE5YjQ4MTJlXG4gICAgICAgIGh0dHAub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkge31cbiAgICAgICAgc2VuZFdhaXQgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlUmVhZHlTdGF0ZSh0aGlzLCBmbiwgZXJyKVxuICAgIH1cbiAgICBvWydiZWZvcmUnXSAmJiBvWydiZWZvcmUnXShodHRwKVxuICAgIGlmIChzZW5kV2FpdCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgICAgfSwgMjAwKVxuICAgIH0gZWxzZSB7XG4gICAgICBodHRwLnNlbmQoZGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIGh0dHBcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXdlc3QobywgZm4pIHtcbiAgICB0aGlzLm8gPSBvXG4gICAgdGhpcy5mbiA9IGZuXG5cbiAgICBpbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFR5cGUoaGVhZGVyKSB7XG4gICAgLy8ganNvbiwgamF2YXNjcmlwdCwgdGV4dC9wbGFpbiwgdGV4dC9odG1sLCB4bWxcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCdqc29uJykpIHJldHVybiAnanNvbidcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCdqYXZhc2NyaXB0JykpIHJldHVybiAnanMnXG4gICAgaWYgKGhlYWRlci5tYXRjaCgndGV4dCcpKSByZXR1cm4gJ2h0bWwnXG4gICAgaWYgKGhlYWRlci5tYXRjaCgneG1sJykpIHJldHVybiAneG1sJ1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdChvLCBmbikge1xuXG4gICAgdGhpcy51cmwgPSB0eXBlb2YgbyA9PSAnc3RyaW5nJyA/IG8gOiBvWyd1cmwnXVxuICAgIHRoaXMudGltZW91dCA9IG51bGxcblxuICAgIC8vIHdoZXRoZXIgcmVxdWVzdCBoYXMgYmVlbiBmdWxmaWxsZWQgZm9yIHB1cnBvc2VcbiAgICAvLyBvZiB0cmFja2luZyB0aGUgUHJvbWlzZXNcbiAgICB0aGlzLl9mdWxmaWxsZWQgPSBmYWxzZVxuICAgIC8vIHN1Y2Nlc3MgaGFuZGxlcnNcbiAgICB0aGlzLl9zdWNjZXNzSGFuZGxlciA9IGZ1bmN0aW9uKCl7fVxuICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMgPSBbXVxuICAgIC8vIGVycm9yIGhhbmRsZXJzXG4gICAgdGhpcy5fZXJyb3JIYW5kbGVycyA9IFtdXG4gICAgLy8gY29tcGxldGUgKGJvdGggc3VjY2VzcyBhbmQgZmFpbCkgaGFuZGxlcnNcbiAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzID0gW11cbiAgICB0aGlzLl9lcnJlZCA9IGZhbHNlXG4gICAgdGhpcy5fcmVzcG9uc2VBcmdzID0ge31cblxuICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgZm4gPSBmbiB8fCBmdW5jdGlvbiAoKSB7fVxuXG4gICAgaWYgKG9bJ3RpbWVvdXQnXSkge1xuICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRpbWVkT3V0KClcbiAgICAgIH0sIG9bJ3RpbWVvdXQnXSlcbiAgICB9XG5cbiAgICBpZiAob1snc3VjY2VzcyddKSB7XG4gICAgICB0aGlzLl9zdWNjZXNzSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb1snc3VjY2VzcyddLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob1snZXJyb3InXSkge1xuICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb1snZXJyb3InXS5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChvWydjb21wbGV0ZSddKSB7XG4gICAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydjb21wbGV0ZSddLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGxldGUgKHJlc3ApIHtcbiAgICAgIG9bJ3RpbWVvdXQnXSAmJiBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuICAgICAgc2VsZi50aW1lb3V0ID0gbnVsbFxuICAgICAgd2hpbGUgKHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxmLl9jb21wbGV0ZUhhbmRsZXJzLnNoaWZ0KCkocmVzcClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdWNjZXNzIChyZXNwKSB7XG4gICAgICB2YXIgdHlwZSA9IG9bJ3R5cGUnXSB8fCByZXNwICYmIHNldFR5cGUocmVzcC5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJykpIC8vIHJlc3AgY2FuIGJlIHVuZGVmaW5lZCBpbiBJRVxuICAgICAgcmVzcCA9ICh0eXBlICE9PSAnanNvbnAnKSA/IHNlbGYucmVxdWVzdCA6IHJlc3BcbiAgICAgIC8vIHVzZSBnbG9iYWwgZGF0YSBmaWx0ZXIgb24gcmVzcG9uc2UgdGV4dFxuICAgICAgdmFyIGZpbHRlcmVkUmVzcG9uc2UgPSBnbG9iYWxTZXR1cE9wdGlvbnMuZGF0YUZpbHRlcihyZXNwLnJlc3BvbnNlVGV4dCwgdHlwZSlcbiAgICAgICAgLCByID0gZmlsdGVyZWRSZXNwb25zZVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzcC5yZXNwb25zZVRleHQgPSByXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNhbid0IGFzc2lnbiB0aGlzIGluIElFPD04LCBqdXN0IGlnbm9yZVxuICAgICAgfVxuICAgICAgaWYgKHIpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwID0gd2luLkpTT04gPyB3aW4uSlNPTi5wYXJzZShyKSA6IGV2YWwoJygnICsgciArICcpJylcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcihyZXNwLCAnQ291bGQgbm90IHBhcnNlIEpTT04gaW4gcmVzcG9uc2UnLCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2pzJzpcbiAgICAgICAgICByZXNwID0gZXZhbChyKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICAgIHJlc3AgPSByXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgICByZXNwID0gcmVzcC5yZXNwb25zZVhNTFxuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IgLy8gSUUgdHJvbG9sb1xuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IuZXJyb3JDb2RlXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5yZWFzb25cbiAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgOiByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MucmVzcCA9IHJlc3BcbiAgICAgIHNlbGYuX2Z1bGZpbGxlZCA9IHRydWVcbiAgICAgIGZuKHJlc3ApXG4gICAgICBzZWxmLl9zdWNjZXNzSGFuZGxlcihyZXNwKVxuICAgICAgd2hpbGUgKHNlbGYuX2Z1bGZpbGxtZW50SGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXNwID0gc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5zaGlmdCgpKHJlc3ApXG4gICAgICB9XG5cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGltZWRPdXQoKSB7XG4gICAgICBzZWxmLl90aW1lZE91dCA9IHRydWVcbiAgICAgIHNlbGYucmVxdWVzdC5hYm9ydCgpICAgICAgXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IocmVzcCwgbXNnLCB0KSB7XG4gICAgICByZXNwID0gc2VsZi5yZXF1ZXN0XG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MucmVzcCA9IHJlc3BcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5tc2cgPSBtc2dcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy50ID0gdFxuICAgICAgc2VsZi5fZXJyZWQgPSB0cnVlXG4gICAgICB3aGlsZSAoc2VsZi5fZXJyb3JIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2Vycm9ySGFuZGxlcnMuc2hpZnQoKShyZXNwLCBtc2csIHQpXG4gICAgICB9XG4gICAgICBjb21wbGV0ZShyZXNwKVxuICAgIH1cblxuICAgIHRoaXMucmVxdWVzdCA9IGdldFJlcXVlc3QuY2FsbCh0aGlzLCBzdWNjZXNzLCBlcnJvcilcbiAgfVxuXG4gIFJlcXdlc3QucHJvdG90eXBlID0ge1xuICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9hYm9ydGVkID0gdHJ1ZVxuICAgICAgdGhpcy5yZXF1ZXN0LmFib3J0KClcbiAgICB9XG5cbiAgLCByZXRyeTogZnVuY3Rpb24gKCkge1xuICAgICAgaW5pdC5jYWxsKHRoaXMsIHRoaXMubywgdGhpcy5mbilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTbWFsbCBkZXZpYXRpb24gZnJvbSB0aGUgUHJvbWlzZXMgQSBDb21tb25KcyBzcGVjaWZpY2F0aW9uXG4gICAgICogaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvUHJvbWlzZXMvQVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogYHRoZW5gIHdpbGwgZXhlY3V0ZSB1cG9uIHN1Y2Nlc3NmdWwgcmVxdWVzdHNcbiAgICAgKi9cbiAgLCB0aGVuOiBmdW5jdGlvbiAoc3VjY2VzcywgZmFpbCkge1xuICAgICAgc3VjY2VzcyA9IHN1Y2Nlc3MgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGZhaWwgPSBmYWlsIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgICBpZiAodGhpcy5fZnVsZmlsbGVkKSB7XG4gICAgICAgIHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwID0gc3VjY2Vzcyh0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZmFpbCh0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCwgdGhpcy5fcmVzcG9uc2VBcmdzLm1zZywgdGhpcy5fcmVzcG9uc2VBcmdzLnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9mdWxmaWxsbWVudEhhbmRsZXJzLnB1c2goc3VjY2VzcylcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZhaWwpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGBhbHdheXNgIHdpbGwgZXhlY3V0ZSB3aGV0aGVyIHRoZSByZXF1ZXN0IHN1Y2NlZWRzIG9yIGZhaWxzXG4gICAgICovXG4gICwgYWx3YXlzOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQgfHwgdGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3ApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzLnB1c2goZm4pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGBmYWlsYCB3aWxsIGV4ZWN1dGUgd2hlbiB0aGUgcmVxdWVzdCBmYWlsc1xuICAgICAqL1xuICAsIGZhaWw6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAsICdjYXRjaCc6IGZ1bmN0aW9uIChmbikge1xuICAgICAgcmV0dXJuIHRoaXMuZmFpbChmbilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXF3ZXN0KG8sIGZuKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF3ZXN0KG8sIGZuKVxuICB9XG5cbiAgLy8gbm9ybWFsaXplIG5ld2xpbmUgdmFyaWFudHMgYWNjb3JkaW5nIHRvIHNwZWMgLT4gQ1JMRlxuICBmdW5jdGlvbiBub3JtYWxpemUocykge1xuICAgIHJldHVybiBzID8gcy5yZXBsYWNlKC9cXHI/XFxuL2csICdcXHJcXG4nKSA6ICcnXG4gIH1cblxuICBmdW5jdGlvbiBzZXJpYWwoZWwsIGNiKSB7XG4gICAgdmFyIG4gPSBlbC5uYW1lXG4gICAgICAsIHQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICwgb3B0Q2IgPSBmdW5jdGlvbiAobykge1xuICAgICAgICAgIC8vIElFIGdpdmVzIHZhbHVlPVwiXCIgZXZlbiB3aGVyZSB0aGVyZSBpcyBubyB2YWx1ZSBhdHRyaWJ1dGVcbiAgICAgICAgICAvLyAnc3BlY2lmaWVkJyByZWY6IGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUNvcmUvY29yZS5odG1sI0lELTg2MjUyOTI3M1xuICAgICAgICAgIGlmIChvICYmICFvWydkaXNhYmxlZCddKVxuICAgICAgICAgICAgY2Iobiwgbm9ybWFsaXplKG9bJ2F0dHJpYnV0ZXMnXVsndmFsdWUnXSAmJiBvWydhdHRyaWJ1dGVzJ11bJ3ZhbHVlJ11bJ3NwZWNpZmllZCddID8gb1sndmFsdWUnXSA6IG9bJ3RleHQnXSkpXG4gICAgICAgIH1cbiAgICAgICwgY2gsIHJhLCB2YWwsIGlcblxuICAgIC8vIGRvbid0IHNlcmlhbGl6ZSBlbGVtZW50cyB0aGF0IGFyZSBkaXNhYmxlZCBvciB3aXRob3V0IGEgbmFtZVxuICAgIGlmIChlbC5kaXNhYmxlZCB8fCAhbikgcmV0dXJuXG5cbiAgICBzd2l0Y2ggKHQpIHtcbiAgICBjYXNlICdpbnB1dCc6XG4gICAgICBpZiAoIS9yZXNldHxidXR0b258aW1hZ2V8ZmlsZS9pLnRlc3QoZWwudHlwZSkpIHtcbiAgICAgICAgY2ggPSAvY2hlY2tib3gvaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHJhID0gL3JhZGlvL2kudGVzdChlbC50eXBlKVxuICAgICAgICB2YWwgPSBlbC52YWx1ZVxuICAgICAgICAvLyBXZWJLaXQgZ2l2ZXMgdXMgXCJcIiBpbnN0ZWFkIG9mIFwib25cIiBpZiBhIGNoZWNrYm94IGhhcyBubyB2YWx1ZSwgc28gY29ycmVjdCBpdCBoZXJlXG4gICAgICAgIDsoIShjaCB8fCByYSkgfHwgZWwuY2hlY2tlZCkgJiYgY2Iobiwgbm9ybWFsaXplKGNoICYmIHZhbCA9PT0gJycgPyAnb24nIDogdmFsKSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgY2Iobiwgbm9ybWFsaXplKGVsLnZhbHVlKSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGlmIChlbC50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3Qtb25lJykge1xuICAgICAgICBvcHRDYihlbC5zZWxlY3RlZEluZGV4ID49IDAgPyBlbC5vcHRpb25zW2VsLnNlbGVjdGVkSW5kZXhdIDogbnVsbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGVsLmxlbmd0aCAmJiBpIDwgZWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlbC5vcHRpb25zW2ldLnNlbGVjdGVkICYmIG9wdENiKGVsLm9wdGlvbnNbaV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgLy8gY29sbGVjdCB1cCBhbGwgZm9ybSBlbGVtZW50cyBmb3VuZCBmcm9tIHRoZSBwYXNzZWQgYXJndW1lbnQgZWxlbWVudHMgYWxsXG4gIC8vIHRoZSB3YXkgZG93biB0byBjaGlsZCBlbGVtZW50czsgcGFzcyBhICc8Zm9ybT4nIG9yIGZvcm0gZmllbGRzLlxuICAvLyBjYWxsZWQgd2l0aCAndGhpcyc9Y2FsbGJhY2sgdG8gdXNlIGZvciBzZXJpYWwoKSBvbiBlYWNoIGVsZW1lbnRcbiAgZnVuY3Rpb24gZWFjaEZvcm1FbGVtZW50KCkge1xuICAgIHZhciBjYiA9IHRoaXNcbiAgICAgICwgZSwgaVxuICAgICAgLCBzZXJpYWxpemVTdWJ0YWdzID0gZnVuY3Rpb24gKGUsIHRhZ3MpIHtcbiAgICAgICAgICB2YXIgaSwgaiwgZmFcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZmEgPSBlW2J5VGFnXSh0YWdzW2ldKVxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGZhLmxlbmd0aDsgaisrKSBzZXJpYWwoZmFbal0sIGNiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgZSA9IGFyZ3VtZW50c1tpXVxuICAgICAgaWYgKC9pbnB1dHxzZWxlY3R8dGV4dGFyZWEvaS50ZXN0KGUudGFnTmFtZSkpIHNlcmlhbChlLCBjYilcbiAgICAgIHNlcmlhbGl6ZVN1YnRhZ3MoZSwgWyAnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJyBdKVxuICAgIH1cbiAgfVxuXG4gIC8vIHN0YW5kYXJkIHF1ZXJ5IHN0cmluZyBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nKCkge1xuICAgIHJldHVybiByZXF3ZXN0LnRvUXVlcnlTdHJpbmcocmVxd2VzdC5zZXJpYWxpemVBcnJheS5hcHBseShudWxsLCBhcmd1bWVudHMpKVxuICB9XG5cbiAgLy8geyAnbmFtZSc6ICd2YWx1ZScsIC4uLiB9IHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplSGFzaCgpIHtcbiAgICB2YXIgaGFzaCA9IHt9XG4gICAgZWFjaEZvcm1FbGVtZW50LmFwcGx5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgaWYgKG5hbWUgaW4gaGFzaCkge1xuICAgICAgICBoYXNoW25hbWVdICYmICFpc0FycmF5KGhhc2hbbmFtZV0pICYmIChoYXNoW25hbWVdID0gW2hhc2hbbmFtZV1dKVxuICAgICAgICBoYXNoW25hbWVdLnB1c2godmFsdWUpXG4gICAgICB9IGVsc2UgaGFzaFtuYW1lXSA9IHZhbHVlXG4gICAgfSwgYXJndW1lbnRzKVxuICAgIHJldHVybiBoYXNoXG4gIH1cblxuICAvLyBbIHsgbmFtZTogJ25hbWUnLCB2YWx1ZTogJ3ZhbHVlJyB9LCAuLi4gXSBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIHJlcXdlc3Quc2VyaWFsaXplQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyciA9IFtdXG4gICAgZWFjaEZvcm1FbGVtZW50LmFwcGx5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgYXJyLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZX0pXG4gICAgfSwgYXJndW1lbnRzKVxuICAgIHJldHVybiBhcnJcbiAgfVxuXG4gIHJlcXdlc3Quc2VyaWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgICB2YXIgb3B0LCBmblxuICAgICAgLCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxuXG4gICAgb3B0ID0gYXJncy5wb3AoKVxuICAgIG9wdCAmJiBvcHQubm9kZVR5cGUgJiYgYXJncy5wdXNoKG9wdCkgJiYgKG9wdCA9IG51bGwpXG4gICAgb3B0ICYmIChvcHQgPSBvcHQudHlwZSlcblxuICAgIGlmIChvcHQgPT0gJ21hcCcpIGZuID0gc2VyaWFsaXplSGFzaFxuICAgIGVsc2UgaWYgKG9wdCA9PSAnYXJyYXknKSBmbiA9IHJlcXdlc3Quc2VyaWFsaXplQXJyYXlcbiAgICBlbHNlIGZuID0gc2VyaWFsaXplUXVlcnlTdHJpbmdcblxuICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmdzKVxuICB9XG5cbiAgcmVxd2VzdC50b1F1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKG8sIHRyYWQpIHtcbiAgICB2YXIgcHJlZml4LCBpXG4gICAgICAsIHRyYWRpdGlvbmFsID0gdHJhZCB8fCBmYWxzZVxuICAgICAgLCBzID0gW11cbiAgICAgICwgZW5jID0gZW5jb2RlVVJJQ29tcG9uZW50XG4gICAgICAsIGFkZCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgLy8gSWYgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGFuZCByZXR1cm4gaXRzIHZhbHVlXG4gICAgICAgICAgdmFsdWUgPSAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHZhbHVlKSA/IHZhbHVlKCkgOiAodmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWUpXG4gICAgICAgICAgc1tzLmxlbmd0aF0gPSBlbmMoa2V5KSArICc9JyArIGVuYyh2YWx1ZSlcbiAgICAgICAgfVxuICAgIC8vIElmIGFuIGFycmF5IHdhcyBwYXNzZWQgaW4sIGFzc3VtZSB0aGF0IGl0IGlzIGFuIGFycmF5IG9mIGZvcm0gZWxlbWVudHMuXG4gICAgaWYgKGlzQXJyYXkobykpIHtcbiAgICAgIGZvciAoaSA9IDA7IG8gJiYgaSA8IG8ubGVuZ3RoOyBpKyspIGFkZChvW2ldWyduYW1lJ10sIG9baV1bJ3ZhbHVlJ10pXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRyYWRpdGlvbmFsLCBlbmNvZGUgdGhlIFwib2xkXCIgd2F5ICh0aGUgd2F5IDEuMy4yIG9yIG9sZGVyXG4gICAgICAvLyBkaWQgaXQpLCBvdGhlcndpc2UgZW5jb2RlIHBhcmFtcyByZWN1cnNpdmVseS5cbiAgICAgIGZvciAocHJlZml4IGluIG8pIHtcbiAgICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkocHJlZml4KSkgYnVpbGRQYXJhbXMocHJlZml4LCBvW3ByZWZpeF0sIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gc3BhY2VzIHNob3VsZCBiZSArIGFjY29yZGluZyB0byBzcGVjXG4gICAgcmV0dXJuIHMuam9pbignJicpLnJlcGxhY2UoLyUyMC9nLCAnKycpXG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFBhcmFtcyhwcmVmaXgsIG9iaiwgdHJhZGl0aW9uYWwsIGFkZCkge1xuICAgIHZhciBuYW1lLCBpLCB2XG4gICAgICAsIHJicmFja2V0ID0gL1xcW1xcXSQvXG5cbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAvLyBTZXJpYWxpemUgYXJyYXkgaXRlbS5cbiAgICAgIGZvciAoaSA9IDA7IG9iaiAmJiBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHYgPSBvYmpbaV1cbiAgICAgICAgaWYgKHRyYWRpdGlvbmFsIHx8IHJicmFja2V0LnRlc3QocHJlZml4KSkge1xuICAgICAgICAgIC8vIFRyZWF0IGVhY2ggYXJyYXkgaXRlbSBhcyBhIHNjYWxhci5cbiAgICAgICAgICBhZGQocHJlZml4LCB2KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArICh0eXBlb2YgdiA9PT0gJ29iamVjdCcgPyBpIDogJycpICsgJ10nLCB2LCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvYmogJiYgb2JqLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAvLyBTZXJpYWxpemUgb2JqZWN0IGl0ZW0uXG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArIG5hbWUgKyAnXScsIG9ialtuYW1lXSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZXJpYWxpemUgc2NhbGFyIGl0ZW0uXG4gICAgICBhZGQocHJlZml4LCBvYmopXG4gICAgfVxuICB9XG5cbiAgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2FsbGJhY2tQcmVmaXhcbiAgfVxuXG4gIC8vIGpRdWVyeSBhbmQgWmVwdG8gY29tcGF0aWJpbGl0eSwgZGlmZmVyZW5jZXMgY2FuIGJlIHJlbWFwcGVkIGhlcmUgc28geW91IGNhbiBjYWxsXG4gIC8vIC5hamF4LmNvbXBhdChvcHRpb25zLCBjYWxsYmFjaylcbiAgcmVxd2VzdC5jb21wYXQgPSBmdW5jdGlvbiAobywgZm4pIHtcbiAgICBpZiAobykge1xuICAgICAgb1sndHlwZSddICYmIChvWydtZXRob2QnXSA9IG9bJ3R5cGUnXSkgJiYgZGVsZXRlIG9bJ3R5cGUnXVxuICAgICAgb1snZGF0YVR5cGUnXSAmJiAob1sndHlwZSddID0gb1snZGF0YVR5cGUnXSlcbiAgICAgIG9bJ2pzb25wQ2FsbGJhY2snXSAmJiAob1snanNvbnBDYWxsYmFja05hbWUnXSA9IG9bJ2pzb25wQ2FsbGJhY2snXSkgJiYgZGVsZXRlIG9bJ2pzb25wQ2FsbGJhY2snXVxuICAgICAgb1snanNvbnAnXSAmJiAob1snanNvbnBDYWxsYmFjayddID0gb1snanNvbnAnXSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSZXF3ZXN0KG8sIGZuKVxuICB9XG5cbiAgcmVxd2VzdC5hamF4U2V0dXAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgZm9yICh2YXIgayBpbiBvcHRpb25zKSB7XG4gICAgICBnbG9iYWxTZXR1cE9wdGlvbnNba10gPSBvcHRpb25zW2tdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcXdlc3Rcbn0pO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCBGZWxpeCBHbmFzc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG5cbiAgLyogQ29tbW9uSlMgKi9cbiAgaWYgKHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnKSAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KClcblxuICAvKiBBTUQgbW9kdWxlICovXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZmFjdG9yeSlcblxuICAvKiBCcm93c2VyIGdsb2JhbCAqL1xuICBlbHNlIHJvb3QuU3Bpbm5lciA9IGZhY3RvcnkoKVxufVxuKHRoaXMsIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgcHJlZml4ZXMgPSBbJ3dlYmtpdCcsICdNb3onLCAnbXMnLCAnTyddIC8qIFZlbmRvciBwcmVmaXhlcyAqL1xuICAgICwgYW5pbWF0aW9ucyA9IHt9IC8qIEFuaW1hdGlvbiBydWxlcyBrZXllZCBieSB0aGVpciBuYW1lICovXG4gICAgLCB1c2VDc3NBbmltYXRpb25zIC8qIFdoZXRoZXIgdG8gdXNlIENTUyBhbmltYXRpb25zIG9yIHNldFRpbWVvdXQgKi9cblxuICAvKipcbiAgICogVXRpbGl0eSBmdW5jdGlvbiB0byBjcmVhdGUgZWxlbWVudHMuIElmIG5vIHRhZyBuYW1lIGlzIGdpdmVuLFxuICAgKiBhIERJViBpcyBjcmVhdGVkLiBPcHRpb25hbGx5IHByb3BlcnRpZXMgY2FuIGJlIHBhc3NlZC5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsKHRhZywgcHJvcCkge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnIHx8ICdkaXYnKVxuICAgICAgLCBuXG5cbiAgICBmb3IobiBpbiBwcm9wKSBlbFtuXSA9IHByb3Bbbl1cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGNoaWxkcmVuIGFuZCByZXR1cm5zIHRoZSBwYXJlbnQuXG4gICAqL1xuICBmdW5jdGlvbiBpbnMocGFyZW50IC8qIGNoaWxkMSwgY2hpbGQyLCAuLi4qLykge1xuICAgIGZvciAodmFyIGk9MSwgbj1hcmd1bWVudHMubGVuZ3RoOyBpPG47IGkrKylcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChhcmd1bWVudHNbaV0pXG5cbiAgICByZXR1cm4gcGFyZW50XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IGEgbmV3IHN0eWxlc2hlZXQgdG8gaG9sZCB0aGUgQGtleWZyYW1lIG9yIFZNTCBydWxlcy5cbiAgICovXG4gIHZhciBzaGVldCA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBjcmVhdGVFbCgnc3R5bGUnLCB7dHlwZSA6ICd0ZXh0L2Nzcyd9KVxuICAgIGlucyhkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLCBlbClcbiAgICByZXR1cm4gZWwuc2hlZXQgfHwgZWwuc3R5bGVTaGVldFxuICB9KCkpXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb3BhY2l0eSBrZXlmcmFtZSBhbmltYXRpb24gcnVsZSBhbmQgcmV0dXJucyBpdHMgbmFtZS5cbiAgICogU2luY2UgbW9zdCBtb2JpbGUgV2Via2l0cyBoYXZlIHRpbWluZyBpc3N1ZXMgd2l0aCBhbmltYXRpb24tZGVsYXksXG4gICAqIHdlIGNyZWF0ZSBzZXBhcmF0ZSBydWxlcyBmb3IgZWFjaCBsaW5lL3NlZ21lbnQuXG4gICAqL1xuICBmdW5jdGlvbiBhZGRBbmltYXRpb24oYWxwaGEsIHRyYWlsLCBpLCBsaW5lcykge1xuICAgIHZhciBuYW1lID0gWydvcGFjaXR5JywgdHJhaWwsIH5+KGFscGhhKjEwMCksIGksIGxpbmVzXS5qb2luKCctJylcbiAgICAgICwgc3RhcnQgPSAwLjAxICsgaS9saW5lcyAqIDEwMFxuICAgICAgLCB6ID0gTWF0aC5tYXgoMSAtICgxLWFscGhhKSAvIHRyYWlsICogKDEwMC1zdGFydCksIGFscGhhKVxuICAgICAgLCBwcmVmaXggPSB1c2VDc3NBbmltYXRpb25zLnN1YnN0cmluZygwLCB1c2VDc3NBbmltYXRpb25zLmluZGV4T2YoJ0FuaW1hdGlvbicpKS50b0xvd2VyQ2FzZSgpXG4gICAgICAsIHByZSA9IHByZWZpeCAmJiAnLScgKyBwcmVmaXggKyAnLScgfHwgJydcblxuICAgIGlmICghYW5pbWF0aW9uc1tuYW1lXSkge1xuICAgICAgc2hlZXQuaW5zZXJ0UnVsZShcbiAgICAgICAgJ0AnICsgcHJlICsgJ2tleWZyYW1lcyAnICsgbmFtZSArICd7JyArXG4gICAgICAgICcwJXtvcGFjaXR5OicgKyB6ICsgJ30nICtcbiAgICAgICAgc3RhcnQgKyAnJXtvcGFjaXR5OicgKyBhbHBoYSArICd9JyArXG4gICAgICAgIChzdGFydCswLjAxKSArICcle29wYWNpdHk6MX0nICtcbiAgICAgICAgKHN0YXJ0K3RyYWlsKSAlIDEwMCArICcle29wYWNpdHk6JyArIGFscGhhICsgJ30nICtcbiAgICAgICAgJzEwMCV7b3BhY2l0eTonICsgeiArICd9JyArXG4gICAgICAgICd9Jywgc2hlZXQuY3NzUnVsZXMubGVuZ3RoKVxuXG4gICAgICBhbmltYXRpb25zW25hbWVdID0gMVxuICAgIH1cblxuICAgIHJldHVybiBuYW1lXG4gIH1cblxuICAvKipcbiAgICogVHJpZXMgdmFyaW91cyB2ZW5kb3IgcHJlZml4ZXMgYW5kIHJldHVybnMgdGhlIGZpcnN0IHN1cHBvcnRlZCBwcm9wZXJ0eS5cbiAgICovXG4gIGZ1bmN0aW9uIHZlbmRvcihlbCwgcHJvcCkge1xuICAgIHZhciBzID0gZWwuc3R5bGVcbiAgICAgICwgcHBcbiAgICAgICwgaVxuXG4gICAgcHJvcCA9IHByb3AuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wLnNsaWNlKDEpXG4gICAgZm9yKGk9MDsgaTxwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcHAgPSBwcmVmaXhlc1tpXStwcm9wXG4gICAgICBpZihzW3BwXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gcHBcbiAgICB9XG4gICAgaWYoc1twcm9wXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gcHJvcFxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgbXVsdGlwbGUgc3R5bGUgcHJvcGVydGllcyBhdCBvbmNlLlxuICAgKi9cbiAgZnVuY3Rpb24gY3NzKGVsLCBwcm9wKSB7XG4gICAgZm9yICh2YXIgbiBpbiBwcm9wKVxuICAgICAgZWwuc3R5bGVbdmVuZG9yKGVsLCBuKXx8bl0gPSBwcm9wW25dXG5cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWxscyBpbiBkZWZhdWx0IHZhbHVlcy5cbiAgICovXG4gIGZ1bmN0aW9uIG1lcmdlKG9iaikge1xuICAgIGZvciAodmFyIGk9MTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlZiA9IGFyZ3VtZW50c1tpXVxuICAgICAgZm9yICh2YXIgbiBpbiBkZWYpXG4gICAgICAgIGlmIChvYmpbbl0gPT09IHVuZGVmaW5lZCkgb2JqW25dID0gZGVmW25dXG4gICAgfVxuICAgIHJldHVybiBvYmpcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBsaW5lIGNvbG9yIGZyb20gdGhlIGdpdmVuIHN0cmluZyBvciBhcnJheS5cbiAgICovXG4gIGZ1bmN0aW9uIGdldENvbG9yKGNvbG9yLCBpZHgpIHtcbiAgICByZXR1cm4gdHlwZW9mIGNvbG9yID09ICdzdHJpbmcnID8gY29sb3IgOiBjb2xvcltpZHggJSBjb2xvci5sZW5ndGhdXG4gIH1cblxuICAvLyBCdWlsdC1pbiBkZWZhdWx0c1xuXG4gIHZhciBkZWZhdWx0cyA9IHtcbiAgICBsaW5lczogMTIsICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyB0byBkcmF3XG4gICAgbGVuZ3RoOiA3LCAgICAgICAgICAgIC8vIFRoZSBsZW5ndGggb2YgZWFjaCBsaW5lXG4gICAgd2lkdGg6IDUsICAgICAgICAgICAgIC8vIFRoZSBsaW5lIHRoaWNrbmVzc1xuICAgIHJhZGl1czogMTAsICAgICAgICAgICAvLyBUaGUgcmFkaXVzIG9mIHRoZSBpbm5lciBjaXJjbGVcbiAgICByb3RhdGU6IDAsICAgICAgICAgICAgLy8gUm90YXRpb24gb2Zmc2V0XG4gICAgY29ybmVyczogMSwgICAgICAgICAgIC8vIFJvdW5kbmVzcyAoMC4uMSlcbiAgICBjb2xvcjogJyMwMDAnLCAgICAgICAgLy8gI3JnYiBvciAjcnJnZ2JiXG4gICAgZGlyZWN0aW9uOiAxLCAgICAgICAgIC8vIDE6IGNsb2Nrd2lzZSwgLTE6IGNvdW50ZXJjbG9ja3dpc2VcbiAgICBzcGVlZDogMSwgICAgICAgICAgICAgLy8gUm91bmRzIHBlciBzZWNvbmRcbiAgICB0cmFpbDogMTAwLCAgICAgICAgICAgLy8gQWZ0ZXJnbG93IHBlcmNlbnRhZ2VcbiAgICBvcGFjaXR5OiAxLzQsICAgICAgICAgLy8gT3BhY2l0eSBvZiB0aGUgbGluZXNcbiAgICBmcHM6IDIwLCAgICAgICAgICAgICAgLy8gRnJhbWVzIHBlciBzZWNvbmQgd2hlbiB1c2luZyBzZXRUaW1lb3V0KClcbiAgICB6SW5kZXg6IDJlOSwgICAgICAgICAgLy8gVXNlIGEgaGlnaCB6LWluZGV4IGJ5IGRlZmF1bHRcbiAgICBjbGFzc05hbWU6ICdzcGlubmVyJywgLy8gQ1NTIGNsYXNzIHRvIGFzc2lnbiB0byB0aGUgZWxlbWVudFxuICAgIHRvcDogJzUwJScsICAgICAgICAgICAvLyBjZW50ZXIgdmVydGljYWxseVxuICAgIGxlZnQ6ICc1MCUnLCAgICAgICAgICAvLyBjZW50ZXIgaG9yaXpvbnRhbGx5XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScgIC8vIGVsZW1lbnQgcG9zaXRpb25cbiAgfVxuXG4gIC8qKiBUaGUgY29uc3RydWN0b3IgKi9cbiAgZnVuY3Rpb24gU3Bpbm5lcihvKSB7XG4gICAgdGhpcy5vcHRzID0gbWVyZ2UobyB8fCB7fSwgU3Bpbm5lci5kZWZhdWx0cywgZGVmYXVsdHMpXG4gIH1cblxuICAvLyBHbG9iYWwgZGVmYXVsdHMgdGhhdCBvdmVycmlkZSB0aGUgYnVpbHQtaW5zOlxuICBTcGlubmVyLmRlZmF1bHRzID0ge31cblxuICBtZXJnZShTcGlubmVyLnByb3RvdHlwZSwge1xuXG4gICAgLyoqXG4gICAgICogQWRkcyB0aGUgc3Bpbm5lciB0byB0aGUgZ2l2ZW4gdGFyZ2V0IGVsZW1lbnQuIElmIHRoaXMgaW5zdGFuY2UgaXMgYWxyZWFkeVxuICAgICAqIHNwaW5uaW5nLCBpdCBpcyBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgZnJvbSBpdHMgcHJldmlvdXMgdGFyZ2V0IGIgY2FsbGluZ1xuICAgICAqIHN0b3AoKSBpbnRlcm5hbGx5LlxuICAgICAqL1xuICAgIHNwaW46IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgdGhpcy5zdG9wKClcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICwgbyA9IHNlbGYub3B0c1xuICAgICAgICAsIGVsID0gc2VsZi5lbCA9IGNzcyhjcmVhdGVFbCgwLCB7Y2xhc3NOYW1lOiBvLmNsYXNzTmFtZX0pLCB7cG9zaXRpb246IG8ucG9zaXRpb24sIHdpZHRoOiAwLCB6SW5kZXg6IG8uekluZGV4fSlcblxuICAgICAgY3NzKGVsLCB7XG4gICAgICAgIGxlZnQ6IG8ubGVmdCxcbiAgICAgICAgdG9wOiBvLnRvcFxuICAgICAgfSlcbiAgICAgICAgXG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldC5maXJzdENoaWxkfHxudWxsKVxuICAgICAgfVxuXG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJvZ3Jlc3NiYXInKVxuICAgICAgc2VsZi5saW5lcyhlbCwgc2VsZi5vcHRzKVxuXG4gICAgICBpZiAoIXVzZUNzc0FuaW1hdGlvbnMpIHtcbiAgICAgICAgLy8gTm8gQ1NTIGFuaW1hdGlvbiBzdXBwb3J0LCB1c2Ugc2V0VGltZW91dCgpIGluc3RlYWRcbiAgICAgICAgdmFyIGkgPSAwXG4gICAgICAgICAgLCBzdGFydCA9IChvLmxpbmVzIC0gMSkgKiAoMSAtIG8uZGlyZWN0aW9uKSAvIDJcbiAgICAgICAgICAsIGFscGhhXG4gICAgICAgICAgLCBmcHMgPSBvLmZwc1xuICAgICAgICAgICwgZiA9IGZwcy9vLnNwZWVkXG4gICAgICAgICAgLCBvc3RlcCA9ICgxLW8ub3BhY2l0eSkgLyAoZipvLnRyYWlsIC8gMTAwKVxuICAgICAgICAgICwgYXN0ZXAgPSBmL28ubGluZXNcblxuICAgICAgICA7KGZ1bmN0aW9uIGFuaW0oKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgby5saW5lczsgaisrKSB7XG4gICAgICAgICAgICBhbHBoYSA9IE1hdGgubWF4KDEgLSAoaSArIChvLmxpbmVzIC0gaikgKiBhc3RlcCkgJSBmICogb3N0ZXAsIG8ub3BhY2l0eSlcblxuICAgICAgICAgICAgc2VsZi5vcGFjaXR5KGVsLCBqICogby5kaXJlY3Rpb24gKyBzdGFydCwgYWxwaGEsIG8pXG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYudGltZW91dCA9IHNlbGYuZWwgJiYgc2V0VGltZW91dChhbmltLCB+figxMDAwL2ZwcykpXG4gICAgICAgIH0pKClcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3BzIGFuZCByZW1vdmVzIHRoZSBTcGlubmVyLlxuICAgICAqL1xuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsID0gdGhpcy5lbFxuICAgICAgaWYgKGVsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgICAgIGlmIChlbC5wYXJlbnROb2RlKSBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxuICAgICAgICB0aGlzLmVsID0gdW5kZWZpbmVkXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgdGhhdCBkcmF3cyB0aGUgaW5kaXZpZHVhbCBsaW5lcy4gV2lsbCBiZSBvdmVyd3JpdHRlblxuICAgICAqIGluIFZNTCBmYWxsYmFjayBtb2RlIGJlbG93LlxuICAgICAqL1xuICAgIGxpbmVzOiBmdW5jdGlvbihlbCwgbykge1xuICAgICAgdmFyIGkgPSAwXG4gICAgICAgICwgc3RhcnQgPSAoby5saW5lcyAtIDEpICogKDEgLSBvLmRpcmVjdGlvbikgLyAyXG4gICAgICAgICwgc2VnXG5cbiAgICAgIGZ1bmN0aW9uIGZpbGwoY29sb3IsIHNoYWRvdykge1xuICAgICAgICByZXR1cm4gY3NzKGNyZWF0ZUVsKCksIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB3aWR0aDogKG8ubGVuZ3RoK28ud2lkdGgpICsgJ3B4JyxcbiAgICAgICAgICBoZWlnaHQ6IG8ud2lkdGggKyAncHgnLFxuICAgICAgICAgIGJhY2tncm91bmQ6IGNvbG9yLFxuICAgICAgICAgIGJveFNoYWRvdzogc2hhZG93LFxuICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJ2xlZnQnLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgnICsgfn4oMzYwL28ubGluZXMqaStvLnJvdGF0ZSkgKyAnZGVnKSB0cmFuc2xhdGUoJyArIG8ucmFkaXVzKydweCcgKycsMCknLFxuICAgICAgICAgIGJvcmRlclJhZGl1czogKG8uY29ybmVycyAqIG8ud2lkdGg+PjEpICsgJ3B4J1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBmb3IgKDsgaSA8IG8ubGluZXM7IGkrKykge1xuICAgICAgICBzZWcgPSBjc3MoY3JlYXRlRWwoKSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHRvcDogMSt+KG8ud2lkdGgvMikgKyAncHgnLFxuICAgICAgICAgIHRyYW5zZm9ybTogby5od2FjY2VsID8gJ3RyYW5zbGF0ZTNkKDAsMCwwKScgOiAnJyxcbiAgICAgICAgICBvcGFjaXR5OiBvLm9wYWNpdHksXG4gICAgICAgICAgYW5pbWF0aW9uOiB1c2VDc3NBbmltYXRpb25zICYmIGFkZEFuaW1hdGlvbihvLm9wYWNpdHksIG8udHJhaWwsIHN0YXJ0ICsgaSAqIG8uZGlyZWN0aW9uLCBvLmxpbmVzKSArICcgJyArIDEvby5zcGVlZCArICdzIGxpbmVhciBpbmZpbml0ZSdcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoby5zaGFkb3cpIGlucyhzZWcsIGNzcyhmaWxsKCcjMDAwJywgJzAgMCA0cHggJyArICcjMDAwJyksIHt0b3A6IDIrJ3B4J30pKVxuICAgICAgICBpbnMoZWwsIGlucyhzZWcsIGZpbGwoZ2V0Q29sb3Ioby5jb2xvciwgaSksICcwIDAgMXB4IHJnYmEoMCwwLDAsLjEpJykpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVsXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG1ldGhvZCB0aGF0IGFkanVzdHMgdGhlIG9wYWNpdHkgb2YgYSBzaW5nbGUgbGluZS5cbiAgICAgKiBXaWxsIGJlIG92ZXJ3cml0dGVuIGluIFZNTCBmYWxsYmFjayBtb2RlIGJlbG93LlxuICAgICAqL1xuICAgIG9wYWNpdHk6IGZ1bmN0aW9uKGVsLCBpLCB2YWwpIHtcbiAgICAgIGlmIChpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGgpIGVsLmNoaWxkTm9kZXNbaV0uc3R5bGUub3BhY2l0eSA9IHZhbFxuICAgIH1cblxuICB9KVxuXG5cbiAgZnVuY3Rpb24gaW5pdFZNTCgpIHtcblxuICAgIC8qIFV0aWxpdHkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgVk1MIHRhZyAqL1xuICAgIGZ1bmN0aW9uIHZtbCh0YWcsIGF0dHIpIHtcbiAgICAgIHJldHVybiBjcmVhdGVFbCgnPCcgKyB0YWcgKyAnIHhtbG5zPVwidXJuOnNjaGVtYXMtbWljcm9zb2Z0LmNvbTp2bWxcIiBjbGFzcz1cInNwaW4tdm1sXCI+JywgYXR0cilcbiAgICB9XG5cbiAgICAvLyBObyBDU1MgdHJhbnNmb3JtcyBidXQgVk1MIHN1cHBvcnQsIGFkZCBhIENTUyBydWxlIGZvciBWTUwgZWxlbWVudHM6XG4gICAgc2hlZXQuYWRkUnVsZSgnLnNwaW4tdm1sJywgJ2JlaGF2aW9yOnVybCgjZGVmYXVsdCNWTUwpJylcblxuICAgIFNwaW5uZXIucHJvdG90eXBlLmxpbmVzID0gZnVuY3Rpb24oZWwsIG8pIHtcbiAgICAgIHZhciByID0gby5sZW5ndGgrby53aWR0aFxuICAgICAgICAsIHMgPSAyKnJcblxuICAgICAgZnVuY3Rpb24gZ3JwKCkge1xuICAgICAgICByZXR1cm4gY3NzKFxuICAgICAgICAgIHZtbCgnZ3JvdXAnLCB7XG4gICAgICAgICAgICBjb29yZHNpemU6IHMgKyAnICcgKyBzLFxuICAgICAgICAgICAgY29vcmRvcmlnaW46IC1yICsgJyAnICsgLXJcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB7IHdpZHRoOiBzLCBoZWlnaHQ6IHMgfVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHZhciBtYXJnaW4gPSAtKG8ud2lkdGgrby5sZW5ndGgpKjIgKyAncHgnXG4gICAgICAgICwgZyA9IGNzcyhncnAoKSwge3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IG1hcmdpbiwgbGVmdDogbWFyZ2lufSlcbiAgICAgICAgLCBpXG5cbiAgICAgIGZ1bmN0aW9uIHNlZyhpLCBkeCwgZmlsdGVyKSB7XG4gICAgICAgIGlucyhnLFxuICAgICAgICAgIGlucyhjc3MoZ3JwKCksIHtyb3RhdGlvbjogMzYwIC8gby5saW5lcyAqIGkgKyAnZGVnJywgbGVmdDogfn5keH0pLFxuICAgICAgICAgICAgaW5zKGNzcyh2bWwoJ3JvdW5kcmVjdCcsIHthcmNzaXplOiBvLmNvcm5lcnN9KSwge1xuICAgICAgICAgICAgICAgIHdpZHRoOiByLFxuICAgICAgICAgICAgICAgIGhlaWdodDogby53aWR0aCxcbiAgICAgICAgICAgICAgICBsZWZ0OiBvLnJhZGl1cyxcbiAgICAgICAgICAgICAgICB0b3A6IC1vLndpZHRoPj4xLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogZmlsdGVyXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICB2bWwoJ2ZpbGwnLCB7Y29sb3I6IGdldENvbG9yKG8uY29sb3IsIGkpLCBvcGFjaXR5OiBvLm9wYWNpdHl9KSxcbiAgICAgICAgICAgICAgdm1sKCdzdHJva2UnLCB7b3BhY2l0eTogMH0pIC8vIHRyYW5zcGFyZW50IHN0cm9rZSB0byBmaXggY29sb3IgYmxlZWRpbmcgdXBvbiBvcGFjaXR5IGNoYW5nZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBpZiAoby5zaGFkb3cpXG4gICAgICAgIGZvciAoaSA9IDE7IGkgPD0gby5saW5lczsgaSsrKVxuICAgICAgICAgIHNlZyhpLCAtMiwgJ3Byb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5CbHVyKHBpeGVscmFkaXVzPTIsbWFrZXNoYWRvdz0xLHNoYWRvd29wYWNpdHk9LjMpJylcblxuICAgICAgZm9yIChpID0gMTsgaSA8PSBvLmxpbmVzOyBpKyspIHNlZyhpKVxuICAgICAgcmV0dXJuIGlucyhlbCwgZylcbiAgICB9XG5cbiAgICBTcGlubmVyLnByb3RvdHlwZS5vcGFjaXR5ID0gZnVuY3Rpb24oZWwsIGksIHZhbCwgbykge1xuICAgICAgdmFyIGMgPSBlbC5maXJzdENoaWxkXG4gICAgICBvID0gby5zaGFkb3cgJiYgby5saW5lcyB8fCAwXG4gICAgICBpZiAoYyAmJiBpK28gPCBjLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGMgPSBjLmNoaWxkTm9kZXNbaStvXTsgYyA9IGMgJiYgYy5maXJzdENoaWxkOyBjID0gYyAmJiBjLmZpcnN0Q2hpbGRcbiAgICAgICAgaWYgKGMpIGMub3BhY2l0eSA9IHZhbFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBwcm9iZSA9IGNzcyhjcmVhdGVFbCgnZ3JvdXAnKSwge2JlaGF2aW9yOiAndXJsKCNkZWZhdWx0I1ZNTCknfSlcblxuICBpZiAoIXZlbmRvcihwcm9iZSwgJ3RyYW5zZm9ybScpICYmIHByb2JlLmFkaikgaW5pdFZNTCgpXG4gIGVsc2UgdXNlQ3NzQW5pbWF0aW9ucyA9IHZlbmRvcihwcm9iZSwgJ2FuaW1hdGlvbicpXG5cbiAgcmV0dXJuIFNwaW5uZXJcblxufSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQGVudW0ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEVMRU1FTlQ6IDEsXG4gIEFUVFJJQlVURTogMixcbiAgVEVYVDogMyxcbiAgQ0RBVEFfU0VDVElPTjogNCxcbiAgRU5USVRZX1JFRkVSRU5DRTogNSxcbiAgRU5USVRZOiA2LFxuICBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OOiA3LFxuICBDT01NRU5UOiA4LFxuICBET0NVTUVOVDogOSxcbiAgRE9DVU1FTlRfVFlQRTogMTAsXG4gIERPQ1VNRU5UX0ZSQUdNRU5UOiAxMSxcbiAgTk9UQVRJT046IDEyXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzcGVjaWZpZWQgdmFsdWUgaXMgbm90IHVuZGVmaW5lZC5cbiAqXG4gKiBAcGFyYW0gez99IHZhbCBWYXJpYWJsZSB0byB0ZXN0LlxuICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB2YXJpYWJsZSBpcyBkZWZpbmVkLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRGVmKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB2b2lkIDA7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQWRkcyBhIGtleS12YWx1ZSBwYWlyIHRvIHRoZSBvYmplY3QvbWFwL2hhc2ggaWYgaXQgZG9lc24ndCBleGlzdCB5ZXQuXG4gKlxuICogQHBhcmFtIHtPYmplY3QuPEssVj59IG9iaiBUaGUgb2JqZWN0IHRvIHdoaWNoIHRvIGFkZCB0aGUga2V5LXZhbHVlIHBhaXIuXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gYWRkLlxuICogQHBhcmFtIHtWfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYWRkIGlmIHRoZSBrZXkgd2Fzbid0IHByZXNlbnQuXG4gKiBAcmV0dXJuIHtWfSBUaGUgdmFsdWUgb2YgdGhlIGVudHJ5IGF0IHRoZSBlbmQgb2YgdGhlIGZ1bmN0aW9uLlxuICogQHRlbXBsYXRlIEssVlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4ga2V5IGluIG9iaiA/IG9ialtrZXldIDogKG9ialtrZXldID0gdmFsdWUpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaXNEZWYgPSByZXF1aXJlKCcuL2lzZGVmJyk7XG5cbi8qKlxuICogTWFrZSBzdXJlIHdlIHRyaW0gQk9NIGFuZCBOQlNQXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG52YXIgVFJJTV9SRSA9IC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZztcblxuLyoqXG4gKiBSZXBlYXRzIGEgc3RyaW5nIG4gdGltZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gcmVwZWF0LlxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIHJlcGVhdC5cbiAqIEByZXR1cm4ge1N0cmluZ30gQSBzdHJpbmcgY29udGFpbmluZyB7QGNvZGUgbGVuZ3RofSByZXBldGl0aW9ucyBvZlxuICogICAgIHtAY29kZSBzdHJpbmd9LlxuICovXG5mdW5jdGlvbiByZXBlYXQoc3RyaW5nLCBsZW5ndGgpIHtcbiAgcmV0dXJuIG5ldyBBcnJheShsZW5ndGggKyAxKS5qb2luKHN0cmluZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHN0clxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICB0cmltOiBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoVFJJTV9SRSwgJycpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBQYWRzIG51bWJlciB0byBnaXZlbiBsZW5ndGggYW5kIG9wdGlvbmFsbHkgcm91bmRzIGl0IHRvIGEgZ2l2ZW4gcHJlY2lzaW9uLlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICogPHByZT5wYWROdW1iZXIoMS4yNSwgMiwgMykgLT4gJzAxLjI1MCdcbiAgICogcGFkTnVtYmVyKDEuMjUsIDIpIC0+ICcwMS4yNSdcbiAgICogcGFkTnVtYmVyKDEuMjUsIDIsIDEpIC0+ICcwMS4zJ1xuICAgKiBwYWROdW1iZXIoMS4yNSwgMCkgLT4gJzEuMjUnPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBudW0gVGhlIG51bWJlciB0byBwYWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIGRlc2lyZWQgbGVuZ3RoLlxuICAgKiBAcGFyYW0ge051bWJlcj19IG9wdF9wcmVjaXNpb24gVGhlIGRlc2lyZWQgcHJlY2lzaW9uLlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IHtAY29kZSBudW19IGFzIGEgc3RyaW5nIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBwYWROdW1iZXI6IGZ1bmN0aW9uKG51bSwgbGVuZ3RoLCBvcHRfcHJlY2lzaW9uKSB7XG4gICAgdmFyIHMgPSBpc0RlZihvcHRfcHJlY2lzaW9uKSA/IG51bS50b0ZpeGVkKG9wdF9wcmVjaXNpb24pIDogU3RyaW5nKG51bSk7XG4gICAgdmFyIGluZGV4ID0gcy5pbmRleE9mKCcuJyk7XG4gICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICBpbmRleCA9IHMubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gcmVwZWF0KCcwJywgTWF0aC5tYXgoMCwgbGVuZ3RoIC0gaW5kZXgpKSArIHM7XG4gIH1cblxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgWE1MUGFyc2VyID0gcmVxdWlyZSgnLi94bWxfcGFyc2VyJyk7XG52YXIgaXNEZWYgPSByZXF1aXJlKCcuL3V0aWxzL2lzZGVmJyk7XG52YXIgbm9kZVR5cGVzID0gcmVxdWlyZSgnLi9ub2RlX3R5cGVzJyk7XG52YXIgc2V0SWZVbmRlZmluZWQgPSByZXF1aXJlKCcuL3V0aWxzL3NldGlmdW5kZWZpbmVkJyk7XG52YXIgWFNEID0gcmVxdWlyZSgnLi94c2QnKTtcbnZhciBYTGluayA9IHJlcXVpcmUoJy4veGxpbmsnKTtcblxuLyoqXG4gKiBXTVMgQ2FwYWJpbGl0aWVzIHBhcnNlclxuICpcbiAqIEBwYXJhbSB7U3RyaW5nPX0geG1sU3RyaW5nXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gV01TKHhtbFN0cmluZykge1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdGhpcy52ZXJzaW9uID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7WE1MUGFyc2VyfVxuICAgKi9cbiAgdGhpcy5fcGFyc2VyID0gbmV3IFhNTFBhcnNlcigpO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7U3RyaW5nPX1cbiAgICovXG4gIHRoaXMuX2RhdGEgPSB4bWxTdHJpbmc7XG59O1xuXG4vKipcbiAqIFNob3J0Y3V0XG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cbnZhciBtYWtlUHJvcGVydHlTZXR0ZXIgPSBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5U2V0dGVyO1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSB4bWxTdHJpbmdcbiAqIEByZXR1cm4ge1dNU31cbiAqL1xuV01TLnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24oeG1sU3RyaW5nKSB7XG4gIHRoaXMuX2RhdGEgPSB4bWxTdHJpbmc7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gIHtTdHJpbmc9fSB4bWxTdHJpbmdcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuV01TLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbih4bWxTdHJpbmcpIHtcbiAgeG1sU3RyaW5nID0geG1sU3RyaW5nIHx8IHRoaXMuX2RhdGE7XG4gIHJldHVybiB0aGlzLnBhcnNlKHhtbFN0cmluZyk7XG59O1xuXG4vKipcbiAqIEByZXR1cm4ge1N0cmluZ30geG1sXG4gKi9cbldNUy5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbih4bWxTdHJpbmcpIHtcbiAgcmV0dXJuIHRoaXMuX3JlYWRGcm9tRG9jdW1lbnQodGhpcy5fcGFyc2VyLnRvRG9jdW1lbnQoeG1sU3RyaW5nKSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge0RvY3VtZW50fSBkb2NcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuV01TLnByb3RvdHlwZS5fcmVhZEZyb21Eb2N1bWVudCA9IGZ1bmN0aW9uKGRvYykge1xuICBmb3IgKHZhciBub2RlID0gZG9jLmZpcnN0Q2hpbGQ7IG5vZGU7IG5vZGUgPSBub2RlLm5leHRTaWJsaW5nKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT0gbm9kZVR5cGVzLkVMRU1FTlQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWRGcm9tTm9kZShub2RlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge0RPTU5vZGV9IG5vZGVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuV01TLnByb3RvdHlwZS5yZWFkRnJvbU5vZGUgPSBmdW5jdGlvbihub2RlKSB7XG4gIHRoaXMudmVyc2lvbiA9IG5vZGUuZ2V0QXR0cmlidXRlKCd2ZXJzaW9uJyk7XG4gIHZhciB3bXNDYXBhYmlsaXR5T2JqZWN0ID0gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7XG4gICAgJ3ZlcnNpb24nOiB0aGlzLnZlcnNpb25cbiAgfSwgV01TLlBBUlNFUlMsIG5vZGUsIFtdKTtcblxuICByZXR1cm4gd21zQ2FwYWJpbGl0eU9iamVjdCB8fCBudWxsO1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gQXR0cmlidXRpb24gb2JqZWN0LlxuICovXG5XTVMuX3JlYWRBdHRyaWJ1dGlvbiA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuQVRUUklCVVRJT05fUEFSU0VSUywgbm9kZSwgb2JqZWN0U3RhY2spO1xufTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R9IEJvdW5kaW5nIGJveCBvYmplY3QuXG4gKi9cbldNUy5fcmVhZEJvdW5kaW5nQm94ID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgdmFyIHJlYWREZWNpbWFsU3RyaW5nID0gWFNELnJlYWREZWNpbWFsU3RyaW5nO1xuICB2YXIgZXh0ZW50ID0gW1xuICAgIHJlYWREZWNpbWFsU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdtaW54JykpLFxuICAgIHJlYWREZWNpbWFsU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdtaW55JykpLFxuICAgIHJlYWREZWNpbWFsU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdtYXh4JykpLFxuICAgIHJlYWREZWNpbWFsU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdtYXh5JykpXG4gIF07XG5cbiAgdmFyIHJlc29sdXRpb25zID0gW1xuICAgIHJlYWREZWNpbWFsU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdyZXN4JykpLFxuICAgIHJlYWREZWNpbWFsU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdyZXN5JykpXG4gIF07XG5cbiAgcmV0dXJuIHtcbiAgICAnY3JzJzogbm9kZS5nZXRBdHRyaWJ1dGUoJ0NSUycpLFxuICAgICdleHRlbnQnOiBleHRlbnQsXG4gICAgJ3Jlcyc6IHJlc29sdXRpb25zXG4gIH07XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge29sLkV4dGVudHx1bmRlZmluZWR9IEJvdW5kaW5nIGJveCBvYmplY3QuXG4gKi9cbldNUy5fcmVhZEVYR2VvZ3JhcGhpY0JvdW5kaW5nQm94ID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgdmFyIGdlb2dyYXBoaWNCb3VuZGluZ0JveCA9IFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sXG4gICAgV01TLkVYX0dFT0dSQVBISUNfQk9VTkRJTkdfQk9YX1BBUlNFUlMsXG4gICAgbm9kZSwgb2JqZWN0U3RhY2spO1xuICBpZiAoIWlzRGVmKGdlb2dyYXBoaWNCb3VuZGluZ0JveCkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIHdlc3RCb3VuZExvbmdpdHVkZSA9IC8qKiBAdHlwZSB7bnVtYmVyfHVuZGVmaW5lZH0gKi9cbiAgICAoZ2VvZ3JhcGhpY0JvdW5kaW5nQm94Wyd3ZXN0Qm91bmRMb25naXR1ZGUnXSk7XG4gIHZhciBzb3V0aEJvdW5kTGF0aXR1ZGUgPSAvKiogQHR5cGUge251bWJlcnx1bmRlZmluZWR9ICovXG4gICAgKGdlb2dyYXBoaWNCb3VuZGluZ0JveFsnc291dGhCb3VuZExhdGl0dWRlJ10pO1xuICB2YXIgZWFzdEJvdW5kTG9uZ2l0dWRlID0gLyoqIEB0eXBlIHtudW1iZXJ8dW5kZWZpbmVkfSAqL1xuICAgIChnZW9ncmFwaGljQm91bmRpbmdCb3hbJ2Vhc3RCb3VuZExvbmdpdHVkZSddKTtcbiAgdmFyIG5vcnRoQm91bmRMYXRpdHVkZSA9IC8qKiBAdHlwZSB7bnVtYmVyfHVuZGVmaW5lZH0gKi9cbiAgICAoZ2VvZ3JhcGhpY0JvdW5kaW5nQm94Wydub3J0aEJvdW5kTGF0aXR1ZGUnXSk7XG5cbiAgaWYgKCFpc0RlZih3ZXN0Qm91bmRMb25naXR1ZGUpIHx8ICFpc0RlZihzb3V0aEJvdW5kTGF0aXR1ZGUpIHx8XG4gICAgIWlzRGVmKGVhc3RCb3VuZExvbmdpdHVkZSkgfHwgIWlzRGVmKG5vcnRoQm91bmRMYXRpdHVkZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIFtcbiAgICB3ZXN0Qm91bmRMb25naXR1ZGUsIHNvdXRoQm91bmRMYXRpdHVkZSxcbiAgICBlYXN0Qm91bmRMb25naXR1ZGUsIG5vcnRoQm91bmRMYXRpdHVkZVxuICBdO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBDYXBhYmlsaXR5IG9iamVjdC5cbiAqL1xuV01TLl9yZWFkQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuQ0FQQUJJTElUWV9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IFNlcnZpY2Ugb2JqZWN0LlxuICovXG5XTVMuX3JlYWRTZXJ2aWNlID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5TRVJWSUNFX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gQ29udGFjdCBpbmZvcm1hdGlvbiBvYmplY3QuXG4gKi9cbldNUy5fcmVhZENvbnRhY3RJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuQ09OVEFDVF9JTkZPUk1BVElPTl9QQVJTRVJTLFxuICAgIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gQ29udGFjdCBwZXJzb24gb2JqZWN0LlxuICovXG5XTVMuX3JlYWRDb250YWN0UGVyc29uUHJpbWFyeSA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuQ09OVEFDVF9QRVJTT05fUEFSU0VSUyxcbiAgICBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IENvbnRhY3QgYWRkcmVzcyBvYmplY3QuXG4gKi9cbldNUy5fcmVhZENvbnRhY3RBZGRyZXNzID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5DT05UQUNUX0FERFJFU1NfUEFSU0VSUyxcbiAgICBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fHVuZGVmaW5lZH0gRm9ybWF0IGFycmF5LlxuICovXG5XTVMuX3JlYWRFeGNlcHRpb24gPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcChcbiAgICBbXSwgV01TLkVYQ0VQVElPTl9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IExheWVyIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkQ2FwYWJpbGl0eUxheWVyID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5MQVlFUl9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IExheWVyIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkTGF5ZXIgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICB2YXIgcGFyZW50TGF5ZXJPYmplY3QgPSAvKiogIEB0eXBlIHtPYmplY3QuPHN0cmluZywqPn0gKi9cbiAgICAob2JqZWN0U3RhY2tbb2JqZWN0U3RhY2subGVuZ3RoIC0gMV0pO1xuXG4gIHZhciBsYXllck9iamVjdCA9IC8qKiAgQHR5cGUge09iamVjdC48c3RyaW5nLCo+fSAqL1xuICAgIChYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuTEFZRVJfUEFSU0VSUyxcbiAgICAgIG5vZGUsIG9iamVjdFN0YWNrKSk7XG5cbiAgaWYgKCFpc0RlZihsYXllck9iamVjdCkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIHF1ZXJ5YWJsZSA9IFhTRC5yZWFkQm9vbGVhblN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgncXVlcnlhYmxlJykpO1xuICBpZiAoIWlzRGVmKHF1ZXJ5YWJsZSkpIHtcbiAgICBxdWVyeWFibGUgPSBwYXJlbnRMYXllck9iamVjdFsncXVlcnlhYmxlJ107XG4gIH1cbiAgbGF5ZXJPYmplY3RbJ3F1ZXJ5YWJsZSddID0gaXNEZWYocXVlcnlhYmxlKSA/IHF1ZXJ5YWJsZSA6IGZhbHNlO1xuXG4gIHZhciBjYXNjYWRlZCA9IFhTRC5yZWFkTm9uTmVnYXRpdmVJbnRlZ2VyU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdjYXNjYWRlZCcpKTtcbiAgaWYgKCFpc0RlZihjYXNjYWRlZCkpIHtcbiAgICBjYXNjYWRlZCA9IHBhcmVudExheWVyT2JqZWN0WydjYXNjYWRlZCddO1xuICB9XG4gIGxheWVyT2JqZWN0WydjYXNjYWRlZCddID0gY2FzY2FkZWQ7XG5cbiAgdmFyIG9wYXF1ZSA9IFhTRC5yZWFkQm9vbGVhblN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnb3BhcXVlJykpO1xuICBpZiAoIWlzRGVmKG9wYXF1ZSkpIHtcbiAgICBvcGFxdWUgPSBwYXJlbnRMYXllck9iamVjdFsnb3BhcXVlJ107XG4gIH1cbiAgbGF5ZXJPYmplY3RbJ29wYXF1ZSddID0gaXNEZWYob3BhcXVlKSA/IG9wYXF1ZSA6IGZhbHNlO1xuXG4gIHZhciBub1N1YnNldHMgPSBYU0QucmVhZEJvb2xlYW5TdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ25vU3Vic2V0cycpKTtcbiAgaWYgKCFpc0RlZihub1N1YnNldHMpKSB7XG4gICAgbm9TdWJzZXRzID0gcGFyZW50TGF5ZXJPYmplY3RbJ25vU3Vic2V0cyddO1xuICB9XG4gIGxheWVyT2JqZWN0Wydub1N1YnNldHMnXSA9IGlzRGVmKG5vU3Vic2V0cykgPyBub1N1YnNldHMgOiBmYWxzZTtcblxuICB2YXIgZml4ZWRXaWR0aCA9IFhTRC5yZWFkRGVjaW1hbFN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnZml4ZWRXaWR0aCcpKTtcbiAgaWYgKCFpc0RlZihmaXhlZFdpZHRoKSkge1xuICAgIGZpeGVkV2lkdGggPSBwYXJlbnRMYXllck9iamVjdFsnZml4ZWRXaWR0aCddO1xuICB9XG4gIGxheWVyT2JqZWN0WydmaXhlZFdpZHRoJ10gPSBmaXhlZFdpZHRoO1xuXG4gIHZhciBmaXhlZEhlaWdodCA9IFhTRC5yZWFkRGVjaW1hbFN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnZml4ZWRIZWlnaHQnKSk7XG4gIGlmICghaXNEZWYoZml4ZWRIZWlnaHQpKSB7XG4gICAgZml4ZWRIZWlnaHQgPSBwYXJlbnRMYXllck9iamVjdFsnZml4ZWRIZWlnaHQnXTtcbiAgfVxuICBsYXllck9iamVjdFsnZml4ZWRIZWlnaHQnXSA9IGZpeGVkSGVpZ2h0O1xuXG4gIC8vIFNlZSA3LjIuNC44XG4gIHZhciBhZGRLZXlzID0gWydTdHlsZScsICdDUlMnLCAnQXV0aG9yaXR5VVJMJ107XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhZGRLZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGFkZEtleXNbaV07XG4gICAgdmFyIHBhcmVudFZhbHVlID0gcGFyZW50TGF5ZXJPYmplY3Rba2V5XTtcbiAgICBpZiAoaXNEZWYocGFyZW50VmFsdWUpKSB7XG4gICAgICB2YXIgY2hpbGRWYWx1ZSA9IHNldElmVW5kZWZpbmVkKGxheWVyT2JqZWN0LCBrZXksIFtdKTtcbiAgICAgIGNoaWxkVmFsdWUgPSBjaGlsZFZhbHVlLmNvbmNhdChwYXJlbnRWYWx1ZSk7XG4gICAgICBsYXllck9iamVjdFtrZXldID0gY2hpbGRWYWx1ZTtcbiAgICB9XG4gIH1cblxuICB2YXIgcmVwbGFjZUtleXMgPSBbJ0VYX0dlb2dyYXBoaWNCb3VuZGluZ0JveCcsICdCb3VuZGluZ0JveCcsICdEaW1lbnNpb24nLFxuICAgICdBdHRyaWJ1dGlvbicsICdNaW5TY2FsZURlbm9taW5hdG9yJywgJ01heFNjYWxlRGVub21pbmF0b3InXG4gIF07XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXBsYWNlS2V5cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBrZXkgPSByZXBsYWNlS2V5c1tpXTtcbiAgICB2YXIgY2hpbGRWYWx1ZSA9IGxheWVyT2JqZWN0W2tleV07XG4gICAgaWYgKCFpc0RlZihjaGlsZFZhbHVlKSkge1xuICAgICAgdmFyIHBhcmVudFZhbHVlID0gcGFyZW50TGF5ZXJPYmplY3Rba2V5XTtcbiAgICAgIGxheWVyT2JqZWN0W2tleV0gPSBwYXJlbnRWYWx1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGF5ZXJPYmplY3Q7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdH0gRGltZW5zaW9uIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkRGltZW5zaW9uID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgdmFyIGRpbWVuc2lvbk9iamVjdCA9IHtcbiAgICAnbmFtZSc6IG5vZGUuZ2V0QXR0cmlidXRlKCduYW1lJyksXG4gICAgJ3VuaXRzJzogbm9kZS5nZXRBdHRyaWJ1dGUoJ3VuaXRzJyksXG4gICAgJ3VuaXRTeW1ib2wnOiBub2RlLmdldEF0dHJpYnV0ZSgndW5pdFN5bWJvbCcpLFxuICAgICdkZWZhdWx0Jzogbm9kZS5nZXRBdHRyaWJ1dGUoJ2RlZmF1bHQnKSxcbiAgICAnbXVsdGlwbGVWYWx1ZXMnOiBYU0QucmVhZEJvb2xlYW5TdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ211bHRpcGxlVmFsdWVzJykpLFxuICAgICduZWFyZXN0VmFsdWUnOiBYU0QucmVhZEJvb2xlYW5TdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ25lYXJlc3RWYWx1ZScpKSxcbiAgICAnY3VycmVudCc6IFhTRC5yZWFkQm9vbGVhblN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnY3VycmVudCcpKSxcbiAgICAndmFsdWVzJzogWFNELnJlYWRTdHJpbmcobm9kZSlcbiAgfTtcbiAgcmV0dXJuIGRpbWVuc2lvbk9iamVjdDtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gT25saW5lIHJlc291cmNlIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2UgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLkZPUk1BVF9PTkxJTkVSRVNPVVJDRV9QQVJTRVJTLFxuICAgIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gUmVxdWVzdCBvYmplY3QuXG4gKi9cbldNUy5fcmVhZFJlcXVlc3QgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLlJFUVVFU1RfUEFSU0VSUywgbm9kZSwgb2JqZWN0U3RhY2spO1xufTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBEQ1AgdHlwZSBvYmplY3QuXG4gKi9cbldNUy5fcmVhZERDUFR5cGUgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLkRDUFRZUEVfUEFSU0VSUywgbm9kZSwgb2JqZWN0U3RhY2spO1xufTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBIVFRQIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkSFRUUCA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuSFRUUF9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IE9wZXJhdGlvbiB0eXBlIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkT3BlcmF0aW9uVHlwZSA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuT1BFUkFUSU9OVFlQRV9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IE9ubGluZSByZXNvdXJjZSBvYmplY3QuXG4gKi9cbldNUy5fcmVhZFNpemVkRm9ybWF0T25saW5lcmVzb3VyY2UgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICB2YXIgZm9ybWF0T25saW5lcmVzb3VyY2UgPSBXTVMuX3JlYWRGb3JtYXRPbmxpbmVyZXNvdXJjZShub2RlLCBvYmplY3RTdGFjayk7XG4gIGlmIChpc0RlZihmb3JtYXRPbmxpbmVyZXNvdXJjZSkpIHtcbiAgICB2YXIgcmVhZE5vbk5lZ2F0aXZlSW50ZWdlclN0cmluZyA9IFhTRC5yZWFkTm9uTmVnYXRpdmVJbnRlZ2VyU3RyaW5nO1xuICAgIHZhciBzaXplID0gW1xuICAgICAgcmVhZE5vbk5lZ2F0aXZlSW50ZWdlclN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSksXG4gICAgICByZWFkTm9uTmVnYXRpdmVJbnRlZ2VyU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSlcbiAgICBdO1xuICAgIGZvcm1hdE9ubGluZXJlc291cmNlWydzaXplJ10gPSBzaXplO1xuICAgIHJldHVybiBmb3JtYXRPbmxpbmVyZXNvdXJjZTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBBdXRob3JpdHkgVVJMIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkQXV0aG9yaXR5VVJMID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgdmFyIGF1dGhvcml0eU9iamVjdCA9IFdNUy5fcmVhZEZvcm1hdE9ubGluZXJlc291cmNlKG5vZGUsIG9iamVjdFN0YWNrKTtcbiAgaWYgKGlzRGVmKGF1dGhvcml0eU9iamVjdCkpIHtcbiAgICBhdXRob3JpdHlPYmplY3RbJ25hbWUnXSA9IG5vZGUuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgcmV0dXJuIGF1dGhvcml0eU9iamVjdDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBNZXRhZGF0YSBVUkwgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRNZXRhZGF0YVVSTCA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHZhciBtZXRhZGF0YU9iamVjdCA9IFdNUy5fcmVhZEZvcm1hdE9ubGluZXJlc291cmNlKG5vZGUsIG9iamVjdFN0YWNrKTtcbiAgaWYgKGlzRGVmKG1ldGFkYXRhT2JqZWN0KSkge1xuICAgIG1ldGFkYXRhT2JqZWN0Wyd0eXBlJ10gPSBub2RlLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuICAgIHJldHVybiBtZXRhZGF0YU9iamVjdDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBTdHlsZSBvYmplY3QuXG4gKi9cbldNUy5fcmVhZFN0eWxlID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5TVFlMRV9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fHVuZGVmaW5lZH0gS2V5d29yZCBsaXN0LlxuICovXG5XTVMuX3JlYWRLZXl3b3JkTGlzdCA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKFxuICAgIFtdLCBXTVMuS0VZV09SRExJU1RfUEFSU0VSUywgbm9kZSwgb2JqZWN0U3RhY2spO1xufTtcblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cbiAqL1xuV01TLk5BTUVTUEFDRV9VUklTID0gW1xuICBudWxsLFxuICAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC93bXMnXG5dO1xuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLlBBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ1NlcnZpY2UnOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkU2VydmljZSksXG4gICAgJ0NhcGFiaWxpdHknOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkQ2FwYWJpbGl0eSlcbiAgfSk7XG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuQ0FQQUJJTElUWV9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdSZXF1ZXN0JzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZFJlcXVlc3QpLFxuICAgICdFeGNlcHRpb24nOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkRXhjZXB0aW9uKSxcbiAgICAnTGF5ZXInOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkQ2FwYWJpbGl0eUxheWVyKVxuICB9KTtcblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5TRVJWSUNFX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ05hbWUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdUaXRsZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0Fic3RyYWN0JzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnS2V5d29yZExpc3QnOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkS2V5d29yZExpc3QpLFxuICAgICdPbmxpbmVSZXNvdXJjZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYTGluay5yZWFkSHJlZiksXG4gICAgJ0NvbnRhY3RJbmZvcm1hdGlvbic6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRDb250YWN0SW5mb3JtYXRpb24pLFxuICAgICdGZWVzJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnQWNjZXNzQ29uc3RyYWludHMnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdMYXllckxpbWl0JzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkTm9uTmVnYXRpdmVJbnRlZ2VyKSxcbiAgICAnTWF4V2lkdGgnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWROb25OZWdhdGl2ZUludGVnZXIpLFxuICAgICdNYXhIZWlnaHQnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWROb25OZWdhdGl2ZUludGVnZXIpXG4gIH0pO1xuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkNPTlRBQ1RfSU5GT1JNQVRJT05fUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnQ29udGFjdFBlcnNvblByaW1hcnknOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkQ29udGFjdFBlcnNvblByaW1hcnkpLFxuICAgICdDb250YWN0UG9zaXRpb24nOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdDb250YWN0QWRkcmVzcyc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRDb250YWN0QWRkcmVzcyksXG4gICAgJ0NvbnRhY3RWb2ljZVRlbGVwaG9uZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0NvbnRhY3RGYWNzaW1pbGVUZWxlcGhvbmUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdDb250YWN0RWxlY3Ryb25pY01haWxBZGRyZXNzJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKVxuICB9KTtcblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5DT05UQUNUX1BFUlNPTl9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdDb250YWN0UGVyc29uJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnQ29udGFjdE9yZ2FuaXphdGlvbic6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZylcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5DT05UQUNUX0FERFJFU1NfUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnQWRkcmVzc1R5cGUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdBZGRyZXNzJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnQ2l0eSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ1N0YXRlT3JQcm92aW5jZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ1Bvc3RDb2RlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnQ291bnRyeSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZylcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5FWENFUFRJT05fUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnRm9ybWF0JzogWE1MUGFyc2VyLm1ha2VBcnJheVB1c2hlcihYU0QucmVhZFN0cmluZylcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5MQVlFUl9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdOYW1lJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnVGl0bGUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdBYnN0cmFjdCc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0tleXdvcmRMaXN0JzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZEtleXdvcmRMaXN0KSxcbiAgICAnQ1JTJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0VYX0dlb2dyYXBoaWNCb3VuZGluZ0JveCc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRFWEdlb2dyYXBoaWNCb3VuZGluZ0JveCksXG4gICAgJ0JvdW5kaW5nQm94JzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihXTVMuX3JlYWRCb3VuZGluZ0JveCksXG4gICAgJ0RpbWVuc2lvbic6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoV01TLl9yZWFkRGltZW5zaW9uKSxcbiAgICAnQXR0cmlidXRpb24nOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkQXR0cmlidXRpb24pLFxuICAgICdBdXRob3JpdHlVUkwnOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFdNUy5fcmVhZEF1dGhvcml0eVVSTCksXG4gICAgJ0lkZW50aWZpZXInOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnTWV0YWRhdGFVUkwnOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFdNUy5fcmVhZE1ldGFkYXRhVVJMKSxcbiAgICAnRGF0YVVSTCc6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2UpLFxuICAgICdGZWF0dXJlTGlzdFVSTCc6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2UpLFxuICAgICdTdHlsZSc6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoV01TLl9yZWFkU3R5bGUpLFxuICAgICdNaW5TY2FsZURlbm9taW5hdG9yJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkRGVjaW1hbCksXG4gICAgJ01heFNjYWxlRGVub21pbmF0b3InOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWREZWNpbWFsKSxcbiAgICAnTGF5ZXInOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFdNUy5fcmVhZExheWVyKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkFUVFJJQlVUSU9OX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ1RpdGxlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnT25saW5lUmVzb3VyY2UnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWExpbmsucmVhZEhyZWYpLFxuICAgICdMb2dvVVJMJzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZFNpemVkRm9ybWF0T25saW5lcmVzb3VyY2UpXG4gIH0pO1xuXG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuRVhfR0VPR1JBUEhJQ19CT1VORElOR19CT1hfUEFSU0VSUyA9XG4gIFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICd3ZXN0Qm91bmRMb25naXR1ZGUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBYU0QucmVhZERlY2ltYWwpLFxuICAgICdlYXN0Qm91bmRMb25naXR1ZGUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBYU0QucmVhZERlY2ltYWwpLFxuICAgICdzb3V0aEJvdW5kTGF0aXR1ZGUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBYU0QucmVhZERlY2ltYWwpLFxuICAgICdub3J0aEJvdW5kTGF0aXR1ZGUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBYU0QucmVhZERlY2ltYWwpXG4gIH0pO1xuXG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuUkVRVUVTVF9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdHZXRDYXBhYmlsaXRpZXMnOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBXTVMuX3JlYWRPcGVyYXRpb25UeXBlKSxcbiAgICAnR2V0TWFwJzogbWFrZVByb3BlcnR5U2V0dGVyKFxuICAgICAgV01TLl9yZWFkT3BlcmF0aW9uVHlwZSksXG4gICAgJ0dldEZlYXR1cmVJbmZvJzogbWFrZVByb3BlcnR5U2V0dGVyKFxuICAgICAgV01TLl9yZWFkT3BlcmF0aW9uVHlwZSlcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5PUEVSQVRJT05UWVBFX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0Zvcm1hdCc6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdEQ1BUeXBlJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihcbiAgICAgIFdNUy5fcmVhZERDUFR5cGUpXG4gIH0pO1xuXG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuRENQVFlQRV9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdIVFRQJzogbWFrZVByb3BlcnR5U2V0dGVyKFxuICAgICAgV01TLl9yZWFkSFRUUClcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5IVFRQX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0dldCc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFdNUy5fcmVhZEZvcm1hdE9ubGluZXJlc291cmNlKSxcbiAgICAnUG9zdCc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFdNUy5fcmVhZEZvcm1hdE9ubGluZXJlc291cmNlKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLlNUWUxFX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ05hbWUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdUaXRsZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0Fic3RyYWN0JzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnTGVnZW5kVVJMJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihXTVMuX3JlYWRTaXplZEZvcm1hdE9ubGluZXJlc291cmNlKSxcbiAgICAnU3R5bGVTaGVldFVSTCc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRGb3JtYXRPbmxpbmVyZXNvdXJjZSksXG4gICAgJ1N0eWxlVVJMJzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZEZvcm1hdE9ubGluZXJlc291cmNlKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkZPUk1BVF9PTkxJTkVSRVNPVVJDRV9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdGb3JtYXQnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdPbmxpbmVSZXNvdXJjZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYTGluay5yZWFkSHJlZilcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5LRVlXT1JETElTVF9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdLZXl3b3JkJzogWE1MUGFyc2VyLm1ha2VBcnJheVB1c2hlcihYU0QucmVhZFN0cmluZylcbiAgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gV01TO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG52YXIgTkFNRVNQQUNFX1VSSSA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufHVuZGVmaW5lZH0gQm9vbGVhbi5cbiAgICovXG4gIHJlYWRIcmVmOiBmdW5jdGlvbihub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlTlMoTkFNRVNQQUNFX1VSSSwgJ2hyZWYnKTtcbiAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaXNEZWYgPSByZXF1aXJlKCcuL3V0aWxzL2lzZGVmJyk7XG52YXIgc2V0SWZVbmRlZmluZWQgPSByZXF1aXJlKCcuL3V0aWxzL3NldGlmdW5kZWZpbmVkJyk7XG52YXIgbm9kZVR5cGVzID0gcmVxdWlyZSgnLi9ub2RlX3R5cGVzJyk7XG5cbi8qKlxuICogWE1MIERPTSBwYXJzZXJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBYTUxQYXJzZXIoKSB7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtET01QYXJzZXJ9XG4gICAqL1xuICB0aGlzLl9wYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge1N0cmluZ30geG1sc3RyaW5nXG4gKiBAcmV0dXJuIHtEb2N1bWVudH1cbiAqL1xuWE1MUGFyc2VyLnByb3RvdHlwZS50b0RvY3VtZW50ID0gZnVuY3Rpb24oeG1sc3RyaW5nKSB7XG4gIHJldHVybiB0aGlzLl9wYXJzZXIucGFyc2VGcm9tU3RyaW5nKHhtbHN0cmluZywgJ2FwcGxpY2F0aW9uL3htbCcpO1xufTtcblxuLyoqXG4gKiBSZWN1cnNpdmVseSBncmFiIGFsbCB0ZXh0IGNvbnRlbnQgb2YgY2hpbGQgbm9kZXMgaW50byBhIHNpbmdsZSBzdHJpbmcuXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9ybWFsaXplV2hpdGVzcGFjZSBOb3JtYWxpemUgd2hpdGVzcGFjZTogcmVtb3ZlIGFsbCBsaW5lXG4gKiBicmVha3MuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IEFsbCB0ZXh0IGNvbnRlbnQuXG4gKiBAYXBpXG4gKi9cblhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudCA9IGZ1bmN0aW9uKG5vZGUsIG5vcm1hbGl6ZVdoaXRlc3BhY2UpIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudF8obm9kZSwgbm9ybWFsaXplV2hpdGVzcGFjZSwgW10pLmpvaW4oJycpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtib29sZWFufSBub3JtYWxpemVXaGl0ZXNwYWNlIE5vcm1hbGl6ZSB3aGl0ZXNwYWNlOiByZW1vdmUgYWxsIGxpbmVcbiAqIGJyZWFrcy5cbiAqIEBwYXJhbSB7QXJyYXkuPFN0cmluZ3xzdHJpbmc+fSBhY2N1bXVsYXRvciBBY2N1bXVsYXRvci5cbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtBcnJheS48U3RyaW5nfHN0cmluZz59IEFjY3VtdWxhdG9yLlxuICovXG5YTUxQYXJzZXIuZ2V0QWxsVGV4dENvbnRlbnRfID0gZnVuY3Rpb24obm9kZSwgbm9ybWFsaXplV2hpdGVzcGFjZSwgYWNjdW11bGF0b3IpIHtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IG5vZGVUeXBlcy5DREFUQV9TRUNUSU9OIHx8XG4gICAgbm9kZS5ub2RlVHlwZSA9PT0gbm9kZVR5cGVzLlRFWFQpIHtcbiAgICBpZiAobm9ybWFsaXplV2hpdGVzcGFjZSkge1xuICAgICAgLy8gRklYTUUgdW5kZXJzdGFuZCB3aHkgZ29vZy5kb20uZ2V0VGV4dENvbnRlbnRfIHVzZXMgU3RyaW5nIGhlcmVcbiAgICAgIGFjY3VtdWxhdG9yLnB1c2goU3RyaW5nKG5vZGUubm9kZVZhbHVlKS5yZXBsYWNlKC8oXFxyXFxufFxccnxcXG4pL2csICcnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjY3VtdWxhdG9yLnB1c2gobm9kZS5ub2RlVmFsdWUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgbjtcbiAgICBmb3IgKG4gPSBub2RlLmZpcnN0Q2hpbGQ7IG47IG4gPSBuLm5leHRTaWJsaW5nKSB7XG4gICAgICBYTUxQYXJzZXIuZ2V0QWxsVGV4dENvbnRlbnRfKG4sIG5vcm1hbGl6ZVdoaXRlc3BhY2UsIGFjY3VtdWxhdG9yKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFjY3VtdWxhdG9yO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fSBwYXJzZXJzTlNcbiAqICAgICBQYXJzZXJzIGJ5IG5hbWVzcGFjZS5cbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEBwYXJhbSB7Kj19IGJpbmQgVGhlIG9iamVjdCB0byB1c2UgYXMgYHRoaXNgLlxuICovXG5YTUxQYXJzZXIucGFyc2VOb2RlID0gZnVuY3Rpb24ocGFyc2Vyc05TLCBub2RlLCBvYmplY3RTdGFjaywgYmluZCkge1xuICB2YXIgbjtcbiAgZm9yIChuID0gbm9kZS5maXJzdEVsZW1lbnRDaGlsZDsgbjsgbiA9IG4ubmV4dEVsZW1lbnRTaWJsaW5nKSB7XG4gICAgdmFyIHBhcnNlcnMgPSBwYXJzZXJzTlNbbi5uYW1lc3BhY2VVUkldO1xuICAgIGlmIChpc0RlZihwYXJzZXJzKSkge1xuICAgICAgdmFyIHBhcnNlciA9IHBhcnNlcnNbbi5sb2NhbE5hbWVdO1xuICAgICAgaWYgKGlzRGVmKHBhcnNlcikpIHtcbiAgICAgICAgcGFyc2VyLmNhbGwoYmluZCwgbiwgb2JqZWN0U3RhY2spO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBuYW1lc3BhY2VVUklzIE5hbWVzcGFjZSBVUklzLlxuICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj59IHBhcnNlcnMgUGFyc2Vycy5cbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj49fSBvcHRfcGFyc2Vyc05TXG4gKiAgICAgUGFyc2Vyc05TLlxuICogQHJldHVybiB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59IFBhcnNlcnMgTlMuXG4gKi9cblhNTFBhcnNlci5tYWtlUGFyc2Vyc05TID0gZnVuY3Rpb24obmFtZXNwYWNlVVJJcywgcGFyc2Vycywgb3B0X3BhcnNlcnNOUykge1xuICByZXR1cm4gLyoqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn0gKi8gKFxuICAgIFhNTFBhcnNlci5tYWtlU3RydWN0dXJlTlMobmFtZXNwYWNlVVJJcywgcGFyc2Vycywgb3B0X3BhcnNlcnNOUykpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmFtZXNwYWNlZCBzdHJ1Y3R1cmUsIHVzaW5nIHRoZSBzYW1lIHZhbHVlcyBmb3IgZWFjaCBuYW1lc3BhY2UuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIGFzIGEgc3RhcnRpbmcgcG9pbnQgZm9yIHZlcnNpb25lZCBwYXJzZXJzLCB3aGVuIG9ubHkgYSBmZXdcbiAqIHZhbHVlcyBhcmUgdmVyc2lvbiBzcGVjaWZpYy5cbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IG5hbWVzcGFjZVVSSXMgTmFtZXNwYWNlIFVSSXMuXG4gKiBAcGFyYW0ge1R9IHN0cnVjdHVyZSBTdHJ1Y3R1cmUuXG4gKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCBUPj19IG9wdF9zdHJ1Y3R1cmVOUyBOYW1lc3BhY2VkIHN0cnVjdHVyZSB0byBhZGQgdG8uXG4gKiBAcmV0dXJuIHtPYmplY3QuPHN0cmluZywgVD59IE5hbWVzcGFjZWQgc3RydWN0dXJlLlxuICogQHRlbXBsYXRlIFRcbiAqL1xuWE1MUGFyc2VyLm1ha2VTdHJ1Y3R1cmVOUyA9IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSXMsIHN0cnVjdHVyZSwgb3B0X3N0cnVjdHVyZU5TKSB7XG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsICo+fVxuICAgKi9cbiAgdmFyIHN0cnVjdHVyZU5TID0gaXNEZWYob3B0X3N0cnVjdHVyZU5TKSA/IG9wdF9zdHJ1Y3R1cmVOUyA6IHt9O1xuICB2YXIgaSwgaWk7XG4gIGZvciAoaSA9IDAsIGlpID0gbmFtZXNwYWNlVVJJcy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgc3RydWN0dXJlTlNbbmFtZXNwYWNlVVJJc1tpXV0gPSBzdHJ1Y3R1cmU7XG4gIH1cbiAgcmV0dXJuIHN0cnVjdHVyZU5TO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHRoaXM6IFQsIE5vZGUsIEFycmF5LjwqPik6ICp9IHZhbHVlUmVhZGVyIFZhbHVlIHJlYWRlci5cbiAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3Byb3BlcnR5IFByb3BlcnR5LlxuICogQHBhcmFtIHtUPX0gb3B0X3RoaXMgVGhlIG9iamVjdCB0byB1c2UgYXMgYHRoaXNgIGluIGB2YWx1ZVJlYWRlcmAuXG4gKiBAcmV0dXJuIHtYTUxQYXJzZXIuUGFyc2VyfSBQYXJzZXIuXG4gKiBAdGVtcGxhdGUgVFxuICovXG5YTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5U2V0dGVyID0gZnVuY3Rpb24odmFsdWVSZWFkZXIsIG9wdF9wcm9wZXJ0eSwgb3B0X3RoaXMpIHtcbiAgcmV0dXJuIChcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gICAgICB2YXIgdmFsdWUgPSB2YWx1ZVJlYWRlci5jYWxsKGlzRGVmKG9wdF90aGlzKSA/IG9wdF90aGlzIDogdGhpcyxcbiAgICAgICAgbm9kZSwgb2JqZWN0U3RhY2spO1xuICAgICAgaWYgKGlzRGVmKHZhbHVlKSkge1xuICAgICAgICB2YXIgb2JqZWN0ID0gLyoqIEB0eXBlIHtPYmplY3R9ICovIChvYmplY3RTdGFja1tvYmplY3RTdGFjay5sZW5ndGggLSAxXSk7XG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IGlzRGVmKG9wdF9wcm9wZXJ0eSkgPyBvcHRfcHJvcGVydHkgOiBub2RlLmxvY2FsTmFtZTtcbiAgICAgICAgb2JqZWN0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHRoaXM6IFQsIE5vZGUsIEFycmF5LjwqPik6ICp9IHZhbHVlUmVhZGVyIFZhbHVlIHJlYWRlci5cbiAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3Byb3BlcnR5IFByb3BlcnR5LlxuICogQHBhcmFtIHtUPX0gb3B0X3RoaXMgVGhlIG9iamVjdCB0byB1c2UgYXMgYHRoaXNgIGluIGB2YWx1ZVJlYWRlcmAuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gUGFyc2VyLlxuICogQHRlbXBsYXRlIFRcbiAqL1xuWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlciA9IGZ1bmN0aW9uKHZhbHVlUmVhZGVyLCBvcHRfcHJvcGVydHksIG9wdF90aGlzKSB7XG4gIHJldHVybiAoXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gICAgICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAgICAgKi9cbiAgICBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICAgICAgdmFyIHZhbHVlID0gdmFsdWVSZWFkZXIuY2FsbChpc0RlZihvcHRfdGhpcykgPyBvcHRfdGhpcyA6IHRoaXMsXG4gICAgICAgIG5vZGUsIG9iamVjdFN0YWNrKTtcblxuICAgICAgaWYgKGlzRGVmKHZhbHVlKSkge1xuICAgICAgICB2YXIgb2JqZWN0ID0gLyoqIEB0eXBlIHtPYmplY3R9ICovIChvYmplY3RTdGFja1tvYmplY3RTdGFjay5sZW5ndGggLSAxXSk7XG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IGlzRGVmKG9wdF9wcm9wZXJ0eSkgPyBvcHRfcHJvcGVydHkgOiBub2RlLmxvY2FsTmFtZTtcbiAgICAgICAgdmFyIGFycmF5ID0gc2V0SWZVbmRlZmluZWQob2JqZWN0LCBwcm9wZXJ0eSwgW10pO1xuICAgICAgICBhcnJheS5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtmdW5jdGlvbih0aGlzOiBULCBOb2RlLCBBcnJheS48Kj4pOiAqfSB2YWx1ZVJlYWRlciBWYWx1ZSByZWFkZXIuXG4gKiBAcGFyYW0ge1Q9fSBvcHRfdGhpcyBUaGUgb2JqZWN0IHRvIHVzZSBhcyBgdGhpc2AgaW4gYHZhbHVlUmVhZGVyYC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBQYXJzZXIuXG4gKiBAdGVtcGxhdGUgVFxuICovXG5YTUxQYXJzZXIubWFrZUFycmF5UHVzaGVyID0gZnVuY3Rpb24odmFsdWVSZWFkZXIsIG9wdF90aGlzKSB7XG4gIHJldHVybiAoXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gICAgICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAgICAgKi9cbiAgICBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICAgICAgdmFyIHZhbHVlID0gdmFsdWVSZWFkZXIuY2FsbChpc0RlZihvcHRfdGhpcykgPyBvcHRfdGhpcyA6IHRoaXMsXG4gICAgICAgIG5vZGUsIG9iamVjdFN0YWNrKTtcbiAgICAgIGlmIChpc0RlZih2YWx1ZSkpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gb2JqZWN0U3RhY2tbb2JqZWN0U3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIGFycmF5LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0IE9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0LjxTdHJpbmcsIE9iamVjdC48U3RyaW5nLCBGdW5jdGlvbj4+fSBwYXJzZXJzTlMgUGFyc2VycyBieSBuYW1lc3BhY2UuXG4gKiBAcGFyYW0ge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEBwYXJhbSB7Kj19ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kIFRoZSBvYmplY3QgdG8gdXNlIGFzIGB0aGlzYC5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IE9iamVjdC5cbiAqL1xuWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCA9IGZ1bmN0aW9uKG9iamVjdCwgcGFyc2Vyc05TLCBub2RlLCBvYmplY3RTdGFjaywgYmluZCkge1xuICBvYmplY3RTdGFjay5wdXNoKG9iamVjdCk7XG4gIFhNTFBhcnNlci5wYXJzZU5vZGUocGFyc2Vyc05TLCBub2RlLCBvYmplY3RTdGFjaywgYmluZCk7XG4gIHJldHVybiBvYmplY3RTdGFjay5wb3AoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWE1MUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc0RlZiA9IHJlcXVpcmUoJy4vdXRpbHMvaXNkZWYnKTtcbnZhciBzdHJpbmcgPSByZXF1aXJlKCcuL3V0aWxzL3N0cmluZycpO1xudmFyIFhNTFBhcnNlciA9IHJlcXVpcmUoJy4veG1sX3BhcnNlcicpO1xuXG52YXIgWFNEID0ge307XG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5YU0QuTkFNRVNQQUNFX1VSSSA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSc7XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcmV0dXJuIHtib29sZWFufHVuZGVmaW5lZH0gQm9vbGVhbi5cbiAqL1xuWFNELnJlYWRCb29sZWFuID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgcyA9IFhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudChub2RlLCBmYWxzZSk7XG4gIHJldHVybiBYU0QucmVhZEJvb2xlYW5TdHJpbmcocyk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgU3RyaW5nLlxuICogQHJldHVybiB7Ym9vbGVhbnx1bmRlZmluZWR9IEJvb2xlYW4uXG4gKi9cblhTRC5yZWFkQm9vbGVhblN0cmluZyA9IGZ1bmN0aW9uKHN0cmluZykge1xuICB2YXIgbSA9IC9eXFxzKih0cnVlfDEpfChmYWxzZXwwKVxccyokLy5leGVjKHN0cmluZyk7XG4gIGlmIChtKSB7XG4gICAgcmV0dXJuIGlzRGVmKG1bMV0pIHx8IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEByZXR1cm4ge251bWJlcnx1bmRlZmluZWR9IERhdGVUaW1lIGluIHNlY29uZHMuXG4gKi9cblhTRC5yZWFkRGF0ZVRpbWUgPSBmdW5jdGlvbihub2RlKSB7XG4gIHZhciBzID0gWE1MUGFyc2VyLmdldEFsbFRleHRDb250ZW50KG5vZGUsIGZhbHNlKTtcbiAgdmFyIHJlID0gL15cXHMqKFxcZHs0fSktKFxcZHsyfSktKFxcZHsyfSlUKFxcZHsyfSk6KFxcZHsyfSk6KFxcZHsyfSkoWnwoPzooWytcXC1dKShcXGR7Mn0pKD86OihcXGR7Mn0pKT8pKVxccyokLztcbiAgdmFyIG0gPSByZS5leGVjKHMpO1xuICBpZiAobSkge1xuICAgIHZhciB5ZWFyID0gcGFyc2VJbnQobVsxXSwgMTApO1xuICAgIHZhciBtb250aCA9IHBhcnNlSW50KG1bMl0sIDEwKSAtIDE7XG4gICAgdmFyIGRheSA9IHBhcnNlSW50KG1bM10sIDEwKTtcbiAgICB2YXIgaG91ciA9IHBhcnNlSW50KG1bNF0sIDEwKTtcbiAgICB2YXIgbWludXRlID0gcGFyc2VJbnQobVs1XSwgMTApO1xuICAgIHZhciBzZWNvbmQgPSBwYXJzZUludChtWzZdLCAxMCk7XG4gICAgdmFyIGRhdGVUaW1lID0gRGF0ZS5VVEMoeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQpIC8gMTAwMDtcbiAgICBpZiAobVs3XSAhPSAnWicpIHtcbiAgICAgIHZhciBzaWduID0gbVs4XSA9PSAnLScgPyAtMSA6IDE7XG4gICAgICBkYXRlVGltZSArPSBzaWduICogNjAgKiBwYXJzZUludChtWzldLCAxMCk7XG4gICAgICBpZiAoaXNEZWYobVsxMF0pKSB7XG4gICAgICAgIGRhdGVUaW1lICs9IHNpZ24gKiA2MCAqIDYwICogcGFyc2VJbnQobVsxMF0sIDEwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGVUaW1lO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEByZXR1cm4ge251bWJlcnx1bmRlZmluZWR9IERlY2ltYWwuXG4gKi9cblhTRC5yZWFkRGVjaW1hbCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgdmFyIHMgPSBYTUxQYXJzZXIuZ2V0QWxsVGV4dENvbnRlbnQobm9kZSwgZmFsc2UpO1xuICByZXR1cm4gWFNELnJlYWREZWNpbWFsU3RyaW5nKHMpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgU3RyaW5nLlxuICogQHJldHVybiB7bnVtYmVyfHVuZGVmaW5lZH0gRGVjaW1hbC5cbiAqL1xuWFNELnJlYWREZWNpbWFsU3RyaW5nID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gIC8vIEZJWE1FIGNoZWNrIHNwZWNcbiAgdmFyIG0gPSAvXlxccyooWytcXC1dP1xcZCpcXC4/XFxkKyg/OmVbK1xcLV0/XFxkKyk/KVxccyokL2kuZXhlYyhzdHJpbmcpO1xuICBpZiAobSkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KG1bMV0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEByZXR1cm4ge251bWJlcnx1bmRlZmluZWR9IE5vbiBuZWdhdGl2ZSBpbnRlZ2VyLlxuICovXG5YU0QucmVhZE5vbk5lZ2F0aXZlSW50ZWdlciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgdmFyIHMgPSBYTUxQYXJzZXIuZ2V0QWxsVGV4dENvbnRlbnQobm9kZSwgZmFsc2UpO1xuICByZXR1cm4gWFNELnJlYWROb25OZWdhdGl2ZUludGVnZXJTdHJpbmcocyk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTdHJpbmcuXG4gKiBAcmV0dXJuIHtudW1iZXJ8dW5kZWZpbmVkfSBOb24gbmVnYXRpdmUgaW50ZWdlci5cbiAqL1xuWFNELnJlYWROb25OZWdhdGl2ZUludGVnZXJTdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIG0gPSAvXlxccyooXFxkKylcXHMqJC8uZXhlYyhzdHJpbmcpO1xuICBpZiAobSkge1xuICAgIHJldHVybiBwYXJzZUludChtWzFdLCAxMCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHJldHVybiB7c3RyaW5nfHVuZGVmaW5lZH0gU3RyaW5nLlxuICovXG5YU0QucmVhZFN0cmluZyA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgdmFyIHMgPSBYTUxQYXJzZXIuZ2V0QWxsVGV4dENvbnRlbnQobm9kZSwgZmFsc2UpO1xuICByZXR1cm4gc3RyaW5nLnRyaW0ocyk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUgdG8gYXBwZW5kIGEgVGV4dE5vZGUgd2l0aCB0aGUgYm9vbGVhbiB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYm9vbCBCb29sZWFuLlxuICovXG5YU0Qud3JpdGVCb29sZWFuVGV4dE5vZGUgPSBmdW5jdGlvbihub2RlLCBib29sKSB7XG4gIFhTRC53cml0ZVN0cmluZ1RleHROb2RlKG5vZGUsIChib29sKSA/ICcxJyA6ICcwJyk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUgdG8gYXBwZW5kIGEgVGV4dE5vZGUgd2l0aCB0aGUgZGF0ZVRpbWUgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZVRpbWUgRGF0ZVRpbWUgaW4gc2Vjb25kcy5cbiAqL1xuWFNELndyaXRlRGF0ZVRpbWVUZXh0Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIGRhdGVUaW1lKSB7XG4gIHZhciBkYXRlID0gbmV3IERhdGUoZGF0ZVRpbWUgKiAxMDAwKTtcbiAgdmFyIHN0cmluZyA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKSArICctJyArXG4gICAgc3RyaW5nLnBhZE51bWJlcihkYXRlLmdldFVUQ01vbnRoKCkgKyAxLCAyKSArICctJyArXG4gICAgc3RyaW5nLnBhZE51bWJlcihkYXRlLmdldFVUQ0RhdGUoKSwgMikgKyAnVCcgK1xuICAgIHN0cmluZy5wYWROdW1iZXIoZGF0ZS5nZXRVVENIb3VycygpLCAyKSArICc6JyArXG4gICAgc3RyaW5nLnBhZE51bWJlcihkYXRlLmdldFVUQ01pbnV0ZXMoKSwgMikgKyAnOicgK1xuICAgIHN0cmluZy5wYWROdW1iZXIoZGF0ZS5nZXRVVENTZWNvbmRzKCksIDIpICsgJ1onO1xuICBub2RlLmFwcGVuZENoaWxkKFhNTFBhcnNlci5ET0NVTUVOVC5jcmVhdGVUZXh0Tm9kZShzdHJpbmcpKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZSB0byBhcHBlbmQgYSBUZXh0Tm9kZSB3aXRoIHRoZSBkZWNpbWFsIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IGRlY2ltYWwgRGVjaW1hbC5cbiAqL1xuWFNELndyaXRlRGVjaW1hbFRleHROb2RlID0gZnVuY3Rpb24obm9kZSwgZGVjaW1hbCkge1xuICB2YXIgc3RyaW5nID0gZGVjaW1hbC50b1ByZWNpc2lvbigpO1xuICBub2RlLmFwcGVuZENoaWxkKFhNTFBhcnNlci5ET0NVTUVOVC5jcmVhdGVUZXh0Tm9kZShzdHJpbmcpKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZSB0byBhcHBlbmQgYSBUZXh0Tm9kZSB3aXRoIHRoZSBkZWNpbWFsIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IG5vbk5lZ2F0aXZlSW50ZWdlciBOb24gbmVnYXRpdmUgaW50ZWdlci5cbiAqL1xuWFNELndyaXRlTm9uTmVnYXRpdmVJbnRlZ2VyVGV4dE5vZGUgPSBmdW5jdGlvbihub2RlLCBub25OZWdhdGl2ZUludGVnZXIpIHtcbiAgdmFyIHN0cmluZyA9IG5vbk5lZ2F0aXZlSW50ZWdlci50b1N0cmluZygpO1xuICBub2RlLmFwcGVuZENoaWxkKFhNTFBhcnNlci5ET0NVTUVOVC5jcmVhdGVUZXh0Tm9kZShzdHJpbmcpKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZSB0byBhcHBlbmQgYSBUZXh0Tm9kZSB3aXRoIHRoZSBzdHJpbmcgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFN0cmluZy5cbiAqL1xuWFNELndyaXRlU3RyaW5nVGV4dE5vZGUgPSBmdW5jdGlvbihub2RlLCBzdHJpbmcpIHtcbiAgbm9kZS5hcHBlbmRDaGlsZChYTUxQYXJzZXIuRE9DVU1FTlQuY3JlYXRlVGV4dE5vZGUoc3RyaW5nKSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFhTRDtcbiJdfQ==
