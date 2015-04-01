(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/w8r/Projects/wms-capabilities/example/js/app.js":[function(require,module,exports){
(function (global){
var jsonFormat = global.jsonFormat = require('./json-format');
var xmlFormat = global.xmlFormat = require('./xml-format');
var WMSCapabilities = global.WMSCapabilities || require('../../index');
var Spinner = require('spin.js');
var reqwest = global.reqwest = require('reqwest');

////////////////////////////////////////////////////////////////////////////////
var serviceSelect = document.getElementById('service');
var xml = document.getElementById('xml');
var json = document.getElementById('json');
var input = document.getElementById('input-area');

// the only open CORS proxy I could find
var proxy = "https://query.yahooapis.com/v1/public/yql";
var parser = new WMSCapabilities();

function showInput() {
  xml.style.display = 'none';
  input.style.display = 'inline-block';
}

function hideInput() {
  xml.style.display = 'inline-block';
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
      url: proxy,
      data: {
        q: 'select * from xml where url="' +
          serviceSelect.value.replace(/\&amp\;/g, '&') + '"'
      },
      type: "xml",
      crossOrigin: true,
      success: function(xml) {
        update(xml.firstChild.firstChild.innerHTML);
      }
    });
  }
}, false);

xml.addEventListener('click', showInput, false);

input.addEventListener('paste', function() {
  setTimeout(function() {
    update(input.value);
    hideInput();
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
    'crs': node.getAttribute('CRS') || node.getAttribute('SRS'),
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
  for (var n = XMLParser.firstElementChild(node); n; n = XMLParser.nextElementSibling(n)) {
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
 * Mostly for node.js
 * @param  {Node} node
 * @return {Node}
 */
XMLParser.firstElementChild = function(node) {
  var firstElementChild = node.firstElementChild || node.firstChild;
  while (firstElementChild.nodeType !== nodeTypes.ELEMENT) {
    firstElementChild = firstElementChild.nextSibling;
  }
  return firstElementChild;
};

/**
 * Mostly for node.js
 * @param  {Node} node
 * @return {Node}
 */
XMLParser.nextElementSibling = function(node) {
  var nextElementSibling = node.nextElementSibling || node.nextSibling;
  while (nextElementSibling && nextElementSibling.nodeType !== nodeTypes.ELEMENT) {
    nextElementSibling = nextElementSibling.nextSibling;
  }
  return nextElementSibling;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9qcy9hcHAuanMiLCJleGFtcGxlL2pzL2pzb24tZm9ybWF0LmpzIiwiZXhhbXBsZS9qcy94bWwtZm9ybWF0LmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwibm9kZV9tb2R1bGVzL3NwaW4uanMvc3Bpbi5qcyIsInNyYy9ub2RlX3R5cGVzLmpzIiwic3JjL3V0aWxzL2lzZGVmLmpzIiwic3JjL3V0aWxzL3NldGlmdW5kZWZpbmVkLmpzIiwic3JjL3V0aWxzL3N0cmluZy5qcyIsInNyYy93bXMuanMiLCJzcmMveGxpbmsuanMiLCJzcmMveG1sX3BhcnNlci5qcyIsInNyYy94c2QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdm1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsdUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGpzb25Gb3JtYXQgPSBnbG9iYWwuanNvbkZvcm1hdCA9IHJlcXVpcmUoJy4vanNvbi1mb3JtYXQnKTtcbnZhciB4bWxGb3JtYXQgPSBnbG9iYWwueG1sRm9ybWF0ID0gcmVxdWlyZSgnLi94bWwtZm9ybWF0Jyk7XG52YXIgV01TQ2FwYWJpbGl0aWVzID0gZ2xvYmFsLldNU0NhcGFiaWxpdGllcyB8fCByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xudmFyIFNwaW5uZXIgPSByZXF1aXJlKCdzcGluLmpzJyk7XG52YXIgcmVxd2VzdCA9IGdsb2JhbC5yZXF3ZXN0ID0gcmVxdWlyZSgncmVxd2VzdCcpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xudmFyIHNlcnZpY2VTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VydmljZScpO1xudmFyIHhtbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd4bWwnKTtcbnZhciBqc29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzb24nKTtcbnZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC1hcmVhJyk7XG5cbi8vIHRoZSBvbmx5IG9wZW4gQ09SUyBwcm94eSBJIGNvdWxkIGZpbmRcbnZhciBwcm94eSA9IFwiaHR0cHM6Ly9xdWVyeS55YWhvb2FwaXMuY29tL3YxL3B1YmxpYy95cWxcIjtcbnZhciBwYXJzZXIgPSBuZXcgV01TQ2FwYWJpbGl0aWVzKCk7XG5cbmZ1bmN0aW9uIHNob3dJbnB1dCgpIHtcbiAgeG1sLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIGlucHV0LnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbn1cblxuZnVuY3Rpb24gaGlkZUlucHV0KCkge1xuICB4bWwuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUoeG1sU3RyaW5nKSB7XG4gIHhtbC50ZXh0Q29udGVudCA9IHhtbEZvcm1hdCh4bWxTdHJpbmcpO1xuICBQcmlzbS5oaWdobGlnaHRFbGVtZW50KHhtbCk7XG5cbiAganNvbi50ZXh0Q29udGVudCA9IGpzb25Gb3JtYXQoSlNPTi5zdHJpbmdpZnkocGFyc2VyLnBhcnNlKHhtbFN0cmluZykpKTtcbiAgUHJpc20uaGlnaGxpZ2h0RWxlbWVudChqc29uKTtcbn1cblxuc2VydmljZVNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgaWYgKHNlcnZpY2VTZWxlY3QudmFsdWUgIT09ICcnKSB7XG4gICAgaGlkZUlucHV0KCk7XG5cbiAgICByZXF3ZXN0KHtcbiAgICAgIHVybDogcHJveHksXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHE6ICdzZWxlY3QgKiBmcm9tIHhtbCB3aGVyZSB1cmw9XCInICtcbiAgICAgICAgICBzZXJ2aWNlU2VsZWN0LnZhbHVlLnJlcGxhY2UoL1xcJmFtcFxcOy9nLCAnJicpICsgJ1wiJ1xuICAgICAgfSxcbiAgICAgIHR5cGU6IFwieG1sXCIsXG4gICAgICBjcm9zc09yaWdpbjogdHJ1ZSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHhtbCkge1xuICAgICAgICB1cGRhdGUoeG1sLmZpcnN0Q2hpbGQuZmlyc3RDaGlsZC5pbm5lckhUTUwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59LCBmYWxzZSk7XG5cbnhtbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNob3dJbnB1dCwgZmFsc2UpO1xuXG5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIGZ1bmN0aW9uKCkge1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIHVwZGF0ZShpbnB1dC52YWx1ZSk7XG4gICAgaGlkZUlucHV0KCk7XG4gIH0sIDUwKTtcbn0sIGZhbHNlKTtcbiIsIi8qXG4gICAganNvbi1mb3JtYXQgdi4xLjFcbiAgICBodHRwOi8vZ2l0aHViLmNvbS9waG9ib3NsYWIvanNvbi1mb3JtYXRcblxuICAgIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlOlxuICAgIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4qL1xuXG52YXIgcCA9IFtdLFxuICBwdXNoID0gZnVuY3Rpb24obSkge1xuICAgIHJldHVybiAnXFxcXCcgKyBwLnB1c2gobSkgKyAnXFxcXCc7XG4gIH0sXG4gIHBvcCA9IGZ1bmN0aW9uKG0sIGkpIHtcbiAgICByZXR1cm4gcFtpIC0gMV1cbiAgfSxcbiAgdGFicyA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheShjb3VudCArIDEpLmpvaW4oJ1xcdCcpO1xuICB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGpzb24pIHtcbiAgcCA9IFtdO1xuICB2YXIgb3V0ID0gXCJcIixcbiAgICBpbmRlbnQgPSAwO1xuXG4gIC8vIEV4dHJhY3QgYmFja3NsYXNoZXMgYW5kIHN0cmluZ3NcbiAganNvbiA9IGpzb25cbiAgICAucmVwbGFjZSgvXFxcXC4vZywgcHVzaClcbiAgICAucmVwbGFjZSgvKFwiLio/XCJ8Jy4qPycpL2csIHB1c2gpXG4gICAgLnJlcGxhY2UoL1xccysvLCAnJyk7XG5cbiAgLy8gSW5kZW50IGFuZCBpbnNlcnQgbmV3bGluZXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGMgPSBqc29uLmNoYXJBdChpKTtcblxuICAgIHN3aXRjaCAoYykge1xuICAgICAgY2FzZSAneyc6XG4gICAgICAgIG91dCArPSBjICsgXCJcXG5cIiArIHRhYnMoKytpbmRlbnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1snOlxuICAgICAgICBvdXQgKz0gYyArIFwiXFxuXCIgKyB0YWJzKCsraW5kZW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICddJzpcbiAgICAgICAgb3V0ICs9IFwiXFxuXCIgKyB0YWJzKC0taW5kZW50KSArIGM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnfSc6XG4gICAgICAgIG91dCArPSBcIlxcblwiICsgdGFicygtLWluZGVudCkgKyBjO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJywnOlxuICAgICAgICBpZiAoL1xcZC8udGVzdChqc29uLmNoYXJBdChpIC0gMSkpKSB7XG4gICAgICAgICAgb3V0ICs9IFwiLCBcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQgKz0gXCIsXFxuXCIgKyB0YWJzKGluZGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICc6JzpcbiAgICAgICAgb3V0ICs9IFwiOiBcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBvdXQgKz0gYztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RyaXAgd2hpdGVzcGFjZSBmcm9tIG51bWVyaWMgYXJyYXlzIGFuZCBwdXQgYmFja3NsYXNoZXNcbiAgLy8gYW5kIHN0cmluZ3MgYmFjayBpblxuICBvdXQgPSBvdXRcbiAgICAucmVwbGFjZSgvXFxbW1xcZCxcXHNdKz9cXF0vZywgZnVuY3Rpb24obSkge1xuICAgICAgcmV0dXJuIG0ucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICB9KVxuICAgIC8vIG51bWJlciBhcnJheXNcbiAgICAucmVwbGFjZSgvXFxbXFxzKihcXGQpL2csIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiAnWycgKyBiO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoLyhcXGQpXFxzKlxcXS9nLCBmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYiArICddJztcbiAgICB9KVxuICAgIC5yZXBsYWNlKC9cXHtcXHMqXFx9L2csICd7fScpIC8vIGVtcHR5IG9iamVjdHNcbiAgICAucmVwbGFjZSgvXFxcXChcXGQrKVxcXFwvZywgcG9wKSAvLyBzdHJpbmdzXG4gICAgLnJlcGxhY2UoL1xcXFwoXFxkKylcXFxcL2csIHBvcCk7IC8vIGJhY2tzbGFzaGVzIGluIHN0cmluZ3NcblxuICByZXR1cm4gb3V0O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHhtbCkge1xuICB2YXIgZm9ybWF0dGVkID0gJyc7XG4gIHZhciByZWcgPSAvKD4pKDwpKFxcLyopL2c7XG4gIHhtbCA9IHhtbC5yZXBsYWNlKHJlZywgJyQxXFxyXFxuJDIkMycpO1xuICB2YXIgcGFkID0gMDtcblxuICB4bWwuc3BsaXQoJ1xcclxcbicpLmZvckVhY2goZnVuY3Rpb24obm9kZSwgaW5kZXgpIHtcbiAgICB2YXIgaW5kZW50ID0gMDtcbiAgICBpZiAobm9kZS5tYXRjaCgvLis8XFwvXFx3W14+XSo+JC8pKSB7XG4gICAgICBpbmRlbnQgPSAwO1xuICAgIH0gZWxzZSBpZiAobm9kZS5tYXRjaCgvXjxcXC9cXHcvKSkge1xuICAgICAgaWYgKHBhZCAhPSAwKSB7XG4gICAgICAgIHBhZCAtPSAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS5tYXRjaCgvXjxcXHdbXj5dKlteXFwvXT4uKiQvKSkge1xuICAgICAgaW5kZW50ID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5kZW50ID0gMDtcbiAgICB9XG5cbiAgICB2YXIgcGFkZGluZyA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFkOyBpKyspIHtcbiAgICAgIHBhZGRpbmcgKz0gJyAgJztcbiAgICB9XG5cbiAgICBmb3JtYXR0ZWQgKz0gcGFkZGluZyArIG5vZGUgKyAnXFxyXFxuJztcbiAgICBwYWQgKz0gaW5kZW50O1xuICB9KTtcblxuICByZXR1cm4gZm9ybWF0dGVkO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL3dtcycpO1xuIiwiLyohXG4gICogUmVxd2VzdCEgQSBnZW5lcmFsIHB1cnBvc2UgWEhSIGNvbm5lY3Rpb24gbWFuYWdlclxuICAqIGxpY2Vuc2UgTUlUIChjKSBEdXN0aW4gRGlheiAyMDE0XG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9yZXF3ZXN0XG4gICovXG5cbiFmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0oJ3JlcXdlc3QnLCB0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIHdpbiA9IHdpbmRvd1xuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIGh0dHBzUmUgPSAvXmh0dHAvXG4gICAgLCBwcm90b2NvbFJlID0gLyheXFx3Kyk6XFwvXFwvL1xuICAgICwgdHdvSHVuZG8gPSAvXigyMFxcZHwxMjIzKSQvIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDA0Njk3Mi9tc2llLXJldHVybnMtc3RhdHVzLWNvZGUtb2YtMTIyMy1mb3ItYWpheC1yZXF1ZXN0XG4gICAgLCBieVRhZyA9ICdnZXRFbGVtZW50c0J5VGFnTmFtZSdcbiAgICAsIHJlYWR5U3RhdGUgPSAncmVhZHlTdGF0ZSdcbiAgICAsIGNvbnRlbnRUeXBlID0gJ0NvbnRlbnQtVHlwZSdcbiAgICAsIHJlcXVlc3RlZFdpdGggPSAnWC1SZXF1ZXN0ZWQtV2l0aCdcbiAgICAsIGhlYWQgPSBkb2NbYnlUYWddKCdoZWFkJylbMF1cbiAgICAsIHVuaXFpZCA9IDBcbiAgICAsIGNhbGxiYWNrUHJlZml4ID0gJ3JlcXdlc3RfJyArICgrbmV3IERhdGUoKSlcbiAgICAsIGxhc3RWYWx1ZSAvLyBkYXRhIHN0b3JlZCBieSB0aGUgbW9zdCByZWNlbnQgSlNPTlAgY2FsbGJhY2tcbiAgICAsIHhtbEh0dHBSZXF1ZXN0ID0gJ1hNTEh0dHBSZXF1ZXN0J1xuICAgICwgeERvbWFpblJlcXVlc3QgPSAnWERvbWFpblJlcXVlc3QnXG4gICAgLCBub29wID0gZnVuY3Rpb24gKCkge31cblxuICAgICwgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBBcnJheS5pc0FycmF5XG4gICAgICAgIDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICB9XG5cbiAgICAsIGRlZmF1bHRIZWFkZXJzID0ge1xuICAgICAgICAgICdjb250ZW50VHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICwgJ3JlcXVlc3RlZFdpdGgnOiB4bWxIdHRwUmVxdWVzdFxuICAgICAgICAsICdhY2NlcHQnOiB7XG4gICAgICAgICAgICAgICcqJzogICd0ZXh0L2phdmFzY3JpcHQsIHRleHQvaHRtbCwgYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCwgKi8qJ1xuICAgICAgICAgICAgLCAneG1sJzogICdhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sJ1xuICAgICAgICAgICAgLCAnaHRtbCc6ICd0ZXh0L2h0bWwnXG4gICAgICAgICAgICAsICd0ZXh0JzogJ3RleHQvcGxhaW4nXG4gICAgICAgICAgICAsICdqc29uJzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICAgICwgJ2pzJzogICAnYXBwbGljYXRpb24vamF2YXNjcmlwdCwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICwgeGhyID0gZnVuY3Rpb24obykge1xuICAgICAgICAvLyBpcyBpdCB4LWRvbWFpblxuICAgICAgICBpZiAob1snY3Jvc3NPcmlnaW4nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciB4aHIgPSB3aW5beG1sSHR0cFJlcXVlc3RdID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBudWxsXG4gICAgICAgICAgaWYgKHhociAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICAgICAgICAgIHJldHVybiB4aHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHdpblt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3QoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBjcm9zcy1vcmlnaW4gcmVxdWVzdHMnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh3aW5beG1sSHR0cFJlcXVlc3RdKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAsIGdsb2JhbFNldHVwT3B0aW9ucyA9IHtcbiAgICAgICAgZGF0YUZpbHRlcjogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgZnVuY3Rpb24gc3VjY2VlZChyKSB7XG4gICAgdmFyIHByb3RvY29sID0gcHJvdG9jb2xSZS5leGVjKHIudXJsKTtcbiAgICBwcm90b2NvbCA9IChwcm90b2NvbCAmJiBwcm90b2NvbFsxXSkgfHwgd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xuICAgIHJldHVybiBodHRwc1JlLnRlc3QocHJvdG9jb2wpID8gdHdvSHVuZG8udGVzdChyLnJlcXVlc3Quc3RhdHVzKSA6ICEhci5yZXF1ZXN0LnJlc3BvbnNlO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUmVhZHlTdGF0ZShyLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB1c2UgX2Fib3J0ZWQgdG8gbWl0aWdhdGUgYWdhaW5zdCBJRSBlcnIgYzAwYzAyM2ZcbiAgICAgIC8vIChjYW4ndCByZWFkIHByb3BzIG9uIGFib3J0ZWQgcmVxdWVzdCBvYmplY3RzKVxuICAgICAgaWYgKHIuX2Fib3J0ZWQpIHJldHVybiBlcnJvcihyLnJlcXVlc3QpXG4gICAgICBpZiAoci5fdGltZWRPdXQpIHJldHVybiBlcnJvcihyLnJlcXVlc3QsICdSZXF1ZXN0IGlzIGFib3J0ZWQ6IHRpbWVvdXQnKVxuICAgICAgaWYgKHIucmVxdWVzdCAmJiByLnJlcXVlc3RbcmVhZHlTdGF0ZV0gPT0gNCkge1xuICAgICAgICByLnJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gbm9vcFxuICAgICAgICBpZiAoc3VjY2VlZChyKSkgc3VjY2VzcyhyLnJlcXVlc3QpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlcnJvcihyLnJlcXVlc3QpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0SGVhZGVycyhodHRwLCBvKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBvWydoZWFkZXJzJ10gfHwge31cbiAgICAgICwgaFxuXG4gICAgaGVhZGVyc1snQWNjZXB0J10gPSBoZWFkZXJzWydBY2NlcHQnXVxuICAgICAgfHwgZGVmYXVsdEhlYWRlcnNbJ2FjY2VwdCddW29bJ3R5cGUnXV1cbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzWydhY2NlcHQnXVsnKiddXG5cbiAgICB2YXIgaXNBRm9ybURhdGEgPSB0eXBlb2YgRm9ybURhdGEgPT09ICdmdW5jdGlvbicgJiYgKG9bJ2RhdGEnXSBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbiAgICAvLyBicmVha3MgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzIHdpdGggbGVnYWN5IGJyb3dzZXJzXG4gICAgaWYgKCFvWydjcm9zc09yaWdpbiddICYmICFoZWFkZXJzW3JlcXVlc3RlZFdpdGhdKSBoZWFkZXJzW3JlcXVlc3RlZFdpdGhdID0gZGVmYXVsdEhlYWRlcnNbJ3JlcXVlc3RlZFdpdGgnXVxuICAgIGlmICghaGVhZGVyc1tjb250ZW50VHlwZV0gJiYgIWlzQUZvcm1EYXRhKSBoZWFkZXJzW2NvbnRlbnRUeXBlXSA9IG9bJ2NvbnRlbnRUeXBlJ10gfHwgZGVmYXVsdEhlYWRlcnNbJ2NvbnRlbnRUeXBlJ11cbiAgICBmb3IgKGggaW4gaGVhZGVycylcbiAgICAgIGhlYWRlcnMuaGFzT3duUHJvcGVydHkoaCkgJiYgJ3NldFJlcXVlc3RIZWFkZXInIGluIGh0dHAgJiYgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKGgsIGhlYWRlcnNbaF0pXG4gIH1cblxuICBmdW5jdGlvbiBzZXRDcmVkZW50aWFscyhodHRwLCBvKSB7XG4gICAgaWYgKHR5cGVvZiBvWyd3aXRoQ3JlZGVudGlhbHMnXSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGh0dHAud2l0aENyZWRlbnRpYWxzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaHR0cC53aXRoQ3JlZGVudGlhbHMgPSAhIW9bJ3dpdGhDcmVkZW50aWFscyddXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhbENhbGxiYWNrKGRhdGEpIHtcbiAgICBsYXN0VmFsdWUgPSBkYXRhXG4gIH1cblxuICBmdW5jdGlvbiB1cmxhcHBlbmQgKHVybCwgcykge1xuICAgIHJldHVybiB1cmwgKyAoL1xcPy8udGVzdCh1cmwpID8gJyYnIDogJz8nKSArIHNcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUpzb25wKG8sIGZuLCBlcnIsIHVybCkge1xuICAgIHZhciByZXFJZCA9IHVuaXFpZCsrXG4gICAgICAsIGNia2V5ID0gb1snanNvbnBDYWxsYmFjayddIHx8ICdjYWxsYmFjaycgLy8gdGhlICdjYWxsYmFjaycga2V5XG4gICAgICAsIGNidmFsID0gb1snanNvbnBDYWxsYmFja05hbWUnXSB8fCByZXF3ZXN0LmdldGNhbGxiYWNrUHJlZml4KHJlcUlkKVxuICAgICAgLCBjYnJlZyA9IG5ldyBSZWdFeHAoJygoXnxcXFxcP3wmKScgKyBjYmtleSArICcpPShbXiZdKyknKVxuICAgICAgLCBtYXRjaCA9IHVybC5tYXRjaChjYnJlZylcbiAgICAgICwgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgICAsIGxvYWRlZCA9IDBcbiAgICAgICwgaXNJRTEwID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFIDEwLjAnKSAhPT0gLTFcblxuICAgIGlmIChtYXRjaCkge1xuICAgICAgaWYgKG1hdGNoWzNdID09PSAnPycpIHtcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoY2JyZWcsICckMT0nICsgY2J2YWwpIC8vIHdpbGRjYXJkIGNhbGxiYWNrIGZ1bmMgbmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2J2YWwgPSBtYXRjaFszXSAvLyBwcm92aWRlZCBjYWxsYmFjayBmdW5jIG5hbWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gdXJsYXBwZW5kKHVybCwgY2JrZXkgKyAnPScgKyBjYnZhbCkgLy8gbm8gY2FsbGJhY2sgZGV0YWlscywgYWRkICdlbVxuICAgIH1cblxuICAgIHdpbltjYnZhbF0gPSBnZW5lcmFsQ2FsbGJhY2tcblxuICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCdcbiAgICBzY3JpcHQuc3JjID0gdXJsXG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZVxuICAgIGlmICh0eXBlb2Ygc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSAhPT0gJ3VuZGVmaW5lZCcgJiYgIWlzSUUxMCkge1xuICAgICAgLy8gbmVlZCB0aGlzIGZvciBJRSBkdWUgdG8gb3V0LW9mLW9yZGVyIG9ucmVhZHlzdGF0ZWNoYW5nZSgpLCBiaW5kaW5nIHNjcmlwdFxuICAgICAgLy8gZXhlY3V0aW9uIHRvIGFuIGV2ZW50IGxpc3RlbmVyIGdpdmVzIHVzIGNvbnRyb2wgb3ZlciB3aGVuIHRoZSBzY3JpcHRcbiAgICAgIC8vIGlzIGV4ZWN1dGVkLiBTZWUgaHR0cDovL2phdWJvdXJnLm5ldC8yMDEwLzA3L2xvYWRpbmctc2NyaXB0LWFzLW9uY2xpY2staGFuZGxlci1vZi5odG1sXG4gICAgICBzY3JpcHQuaHRtbEZvciA9IHNjcmlwdC5pZCA9ICdfcmVxd2VzdF8nICsgcmVxSWRcbiAgICB9XG5cbiAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgoc2NyaXB0W3JlYWR5U3RhdGVdICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2NvbXBsZXRlJyAmJiBzY3JpcHRbcmVhZHlTdGF0ZV0gIT09ICdsb2FkZWQnKSB8fCBsb2FkZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgIHNjcmlwdC5vbmNsaWNrICYmIHNjcmlwdC5vbmNsaWNrKClcbiAgICAgIC8vIENhbGwgdGhlIHVzZXIgY2FsbGJhY2sgd2l0aCB0aGUgbGFzdCB2YWx1ZSBzdG9yZWQgYW5kIGNsZWFuIHVwIHZhbHVlcyBhbmQgc2NyaXB0cy5cbiAgICAgIGZuKGxhc3RWYWx1ZSlcbiAgICAgIGxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpXG4gICAgICBsb2FkZWQgPSAxXG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBzY3JpcHQgdG8gdGhlIERPTSBoZWFkXG4gICAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpXG5cbiAgICAvLyBFbmFibGUgSlNPTlAgdGltZW91dFxuICAgIHJldHVybiB7XG4gICAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgICAgZXJyKHt9LCAnUmVxdWVzdCBpcyBhYm9ydGVkOiB0aW1lb3V0Jywge30pXG4gICAgICAgIGxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgICAgbG9hZGVkID0gMVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJlcXVlc3QoZm4sIGVycikge1xuICAgIHZhciBvID0gdGhpcy5vXG4gICAgICAsIG1ldGhvZCA9IChvWydtZXRob2QnXSB8fCAnR0VUJykudG9VcHBlckNhc2UoKVxuICAgICAgLCB1cmwgPSB0eXBlb2YgbyA9PT0gJ3N0cmluZycgPyBvIDogb1sndXJsJ11cbiAgICAgIC8vIGNvbnZlcnQgbm9uLXN0cmluZyBvYmplY3RzIHRvIHF1ZXJ5LXN0cmluZyBmb3JtIHVubGVzcyBvWydwcm9jZXNzRGF0YSddIGlzIGZhbHNlXG4gICAgICAsIGRhdGEgPSAob1sncHJvY2Vzc0RhdGEnXSAhPT0gZmFsc2UgJiYgb1snZGF0YSddICYmIHR5cGVvZiBvWydkYXRhJ10gIT09ICdzdHJpbmcnKVxuICAgICAgICA/IHJlcXdlc3QudG9RdWVyeVN0cmluZyhvWydkYXRhJ10pXG4gICAgICAgIDogKG9bJ2RhdGEnXSB8fCBudWxsKVxuICAgICAgLCBodHRwXG4gICAgICAsIHNlbmRXYWl0ID0gZmFsc2VcblxuICAgIC8vIGlmIHdlJ3JlIHdvcmtpbmcgb24gYSBHRVQgcmVxdWVzdCBhbmQgd2UgaGF2ZSBkYXRhIHRoZW4gd2Ugc2hvdWxkIGFwcGVuZFxuICAgIC8vIHF1ZXJ5IHN0cmluZyB0byBlbmQgb2YgVVJMIGFuZCBub3QgcG9zdCBkYXRhXG4gICAgaWYgKChvWyd0eXBlJ10gPT0gJ2pzb25wJyB8fCBtZXRob2QgPT0gJ0dFVCcpICYmIGRhdGEpIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGRhdGEpXG4gICAgICBkYXRhID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChvWyd0eXBlJ10gPT0gJ2pzb25wJykgcmV0dXJuIGhhbmRsZUpzb25wKG8sIGZuLCBlcnIsIHVybClcblxuICAgIC8vIGdldCB0aGUgeGhyIGZyb20gdGhlIGZhY3RvcnkgaWYgcGFzc2VkXG4gICAgLy8gaWYgdGhlIGZhY3RvcnkgcmV0dXJucyBudWxsLCBmYWxsLWJhY2sgdG8gb3Vyc1xuICAgIGh0dHAgPSAoby54aHIgJiYgby54aHIobykpIHx8IHhocihvKVxuXG4gICAgaHR0cC5vcGVuKG1ldGhvZCwgdXJsLCBvWydhc3luYyddID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZSlcbiAgICBzZXRIZWFkZXJzKGh0dHAsIG8pXG4gICAgc2V0Q3JlZGVudGlhbHMoaHR0cCwgbylcbiAgICBpZiAod2luW3hEb21haW5SZXF1ZXN0XSAmJiBodHRwIGluc3RhbmNlb2Ygd2luW3hEb21haW5SZXF1ZXN0XSkge1xuICAgICAgICBodHRwLm9ubG9hZCA9IGZuXG4gICAgICAgIGh0dHAub25lcnJvciA9IGVyclxuICAgICAgICAvLyBOT1RFOiBzZWVcbiAgICAgICAgLy8gaHR0cDovL3NvY2lhbC5tc2RuLm1pY3Jvc29mdC5jb20vRm9ydW1zL2VuLVVTL2lld2ViZGV2ZWxvcG1lbnQvdGhyZWFkLzMwZWYzYWRkLTc2N2MtNDQzNi1iOGE5LWYxY2ExOWI0ODEyZVxuICAgICAgICBodHRwLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHt9XG4gICAgICAgIHNlbmRXYWl0ID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZVJlYWR5U3RhdGUodGhpcywgZm4sIGVycilcbiAgICB9XG4gICAgb1snYmVmb3JlJ10gJiYgb1snYmVmb3JlJ10oaHR0cClcbiAgICBpZiAoc2VuZFdhaXQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBodHRwLnNlbmQoZGF0YSlcbiAgICAgIH0sIDIwMClcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cC5zZW5kKGRhdGEpXG4gICAgfVxuICAgIHJldHVybiBodHRwXG4gIH1cblxuICBmdW5jdGlvbiBSZXF3ZXN0KG8sIGZuKSB7XG4gICAgdGhpcy5vID0gb1xuICAgIHRoaXMuZm4gPSBmblxuXG4gICAgaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRUeXBlKGhlYWRlcikge1xuICAgIC8vIGpzb24sIGphdmFzY3JpcHQsIHRleHQvcGxhaW4sIHRleHQvaHRtbCwgeG1sXG4gICAgaWYgKGhlYWRlci5tYXRjaCgnanNvbicpKSByZXR1cm4gJ2pzb24nXG4gICAgaWYgKGhlYWRlci5tYXRjaCgnamF2YXNjcmlwdCcpKSByZXR1cm4gJ2pzJ1xuICAgIGlmIChoZWFkZXIubWF0Y2goJ3RleHQnKSkgcmV0dXJuICdodG1sJ1xuICAgIGlmIChoZWFkZXIubWF0Y2goJ3htbCcpKSByZXR1cm4gJ3htbCdcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQobywgZm4pIHtcblxuICAgIHRoaXMudXJsID0gdHlwZW9mIG8gPT0gJ3N0cmluZycgPyBvIDogb1sndXJsJ11cbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsXG5cbiAgICAvLyB3aGV0aGVyIHJlcXVlc3QgaGFzIGJlZW4gZnVsZmlsbGVkIGZvciBwdXJwb3NlXG4gICAgLy8gb2YgdHJhY2tpbmcgdGhlIFByb21pc2VzXG4gICAgdGhpcy5fZnVsZmlsbGVkID0gZmFsc2VcbiAgICAvLyBzdWNjZXNzIGhhbmRsZXJzXG4gICAgdGhpcy5fc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbigpe31cbiAgICB0aGlzLl9mdWxmaWxsbWVudEhhbmRsZXJzID0gW11cbiAgICAvLyBlcnJvciBoYW5kbGVyc1xuICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMgPSBbXVxuICAgIC8vIGNvbXBsZXRlIChib3RoIHN1Y2Nlc3MgYW5kIGZhaWwpIGhhbmRsZXJzXG4gICAgdGhpcy5fY29tcGxldGVIYW5kbGVycyA9IFtdXG4gICAgdGhpcy5fZXJyZWQgPSBmYWxzZVxuICAgIHRoaXMuX3Jlc3BvbnNlQXJncyA9IHt9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgIGZuID0gZm4gfHwgZnVuY3Rpb24gKCkge31cblxuICAgIGlmIChvWyd0aW1lb3V0J10pIHtcbiAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB0aW1lZE91dCgpXG4gICAgICB9LCBvWyd0aW1lb3V0J10pXG4gICAgfVxuXG4gICAgaWYgKG9bJ3N1Y2Nlc3MnXSkge1xuICAgICAgdGhpcy5fc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ3N1Y2Nlc3MnXS5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9bJ2Vycm9yJ10pIHtcbiAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ2Vycm9yJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAob1snY29tcGxldGUnXSkge1xuICAgICAgdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb1snY29tcGxldGUnXS5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlIChyZXNwKSB7XG4gICAgICBvWyd0aW1lb3V0J10gJiYgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcbiAgICAgIHNlbGYudGltZW91dCA9IG51bGxcbiAgICAgIHdoaWxlIChzZWxmLl9jb21wbGV0ZUhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fY29tcGxldGVIYW5kbGVycy5zaGlmdCgpKHJlc3ApXG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VjY2VzcyAocmVzcCkge1xuICAgICAgdmFyIHR5cGUgPSBvWyd0eXBlJ10gfHwgcmVzcCAmJiBzZXRUeXBlKHJlc3AuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpKSAvLyByZXNwIGNhbiBiZSB1bmRlZmluZWQgaW4gSUVcbiAgICAgIHJlc3AgPSAodHlwZSAhPT0gJ2pzb25wJykgPyBzZWxmLnJlcXVlc3QgOiByZXNwXG4gICAgICAvLyB1c2UgZ2xvYmFsIGRhdGEgZmlsdGVyIG9uIHJlc3BvbnNlIHRleHRcbiAgICAgIHZhciBmaWx0ZXJlZFJlc3BvbnNlID0gZ2xvYmFsU2V0dXBPcHRpb25zLmRhdGFGaWx0ZXIocmVzcC5yZXNwb25zZVRleHQsIHR5cGUpXG4gICAgICAgICwgciA9IGZpbHRlcmVkUmVzcG9uc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3AucmVzcG9uc2VUZXh0ID0gclxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBjYW4ndCBhc3NpZ24gdGhpcyBpbiBJRTw9OCwganVzdCBpZ25vcmVcbiAgICAgIH1cbiAgICAgIGlmIChyKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcCA9IHdpbi5KU09OID8gd2luLkpTT04ucGFyc2UocikgOiBldmFsKCcoJyArIHIgKyAnKScpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3IocmVzcCwgJ0NvdWxkIG5vdCBwYXJzZSBKU09OIGluIHJlc3BvbnNlJywgZXJyKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgcmVzcCA9IGV2YWwocilcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICByZXNwID0gclxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgICAgcmVzcCA9IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yIC8vIElFIHRyb2xvbG9cbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLmVycm9yQ29kZVxuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IucmVhc29uXG4gICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgIDogcmVzcC5yZXNwb25zZVhNTFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnJlc3AgPSByZXNwXG4gICAgICBzZWxmLl9mdWxmaWxsZWQgPSB0cnVlXG4gICAgICBmbihyZXNwKVxuICAgICAgc2VsZi5fc3VjY2Vzc0hhbmRsZXIocmVzcClcbiAgICAgIHdoaWxlIChzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzcCA9IHNlbGYuX2Z1bGZpbGxtZW50SGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuXG4gICAgICBjb21wbGV0ZShyZXNwKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpbWVkT3V0KCkge1xuICAgICAgc2VsZi5fdGltZWRPdXQgPSB0cnVlXG4gICAgICBzZWxmLnJlcXVlc3QuYWJvcnQoKSAgICAgIFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKHJlc3AsIG1zZywgdCkge1xuICAgICAgcmVzcCA9IHNlbGYucmVxdWVzdFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnJlc3AgPSByZXNwXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MubXNnID0gbXNnXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MudCA9IHRcbiAgICAgIHNlbGYuX2VycmVkID0gdHJ1ZVxuICAgICAgd2hpbGUgKHNlbGYuX2Vycm9ySGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxmLl9lcnJvckhhbmRsZXJzLnNoaWZ0KCkocmVzcCwgbXNnLCB0KVxuICAgICAgfVxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICB0aGlzLnJlcXVlc3QgPSBnZXRSZXF1ZXN0LmNhbGwodGhpcywgc3VjY2VzcywgZXJyb3IpXG4gIH1cblxuICBSZXF3ZXN0LnByb3RvdHlwZSA9IHtcbiAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fYWJvcnRlZCA9IHRydWVcbiAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpXG4gICAgfVxuXG4gICwgcmV0cnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluaXQuY2FsbCh0aGlzLCB0aGlzLm8sIHRoaXMuZm4pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU21hbGwgZGV2aWF0aW9uIGZyb20gdGhlIFByb21pc2VzIEEgQ29tbW9uSnMgc3BlY2lmaWNhdGlvblxuICAgICAqIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1Byb21pc2VzL0FcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIGB0aGVuYCB3aWxsIGV4ZWN1dGUgdXBvbiBzdWNjZXNzZnVsIHJlcXVlc3RzXG4gICAgICovXG4gICwgdGhlbjogZnVuY3Rpb24gKHN1Y2Nlc3MsIGZhaWwpIHtcbiAgICAgIHN1Y2Nlc3MgPSBzdWNjZXNzIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgICBmYWlsID0gZmFpbCB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCkge1xuICAgICAgICB0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCA9IHN1Y2Nlc3ModGhpcy5fcmVzcG9uc2VBcmdzLnJlc3ApXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZhaWwodGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycy5wdXNoKHN1Y2Nlc3MpXG4gICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmYWlsKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBgYWx3YXlzYCB3aWxsIGV4ZWN1dGUgd2hldGhlciB0aGUgcmVxdWVzdCBzdWNjZWVkcyBvciBmYWlsc1xuICAgICAqL1xuICAsIGFsd2F5czogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZnVsZmlsbGVkIHx8IHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBgZmFpbGAgd2lsbCBleGVjdXRlIHdoZW4gdGhlIHJlcXVlc3QgZmFpbHNcbiAgICAgKi9cbiAgLCBmYWlsOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCwgdGhpcy5fcmVzcG9uc2VBcmdzLm1zZywgdGhpcy5fcmVzcG9uc2VBcmdzLnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZm4pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgLCAnY2F0Y2gnOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIHJldHVybiB0aGlzLmZhaWwoZm4pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVxd2VzdChvLCBmbikge1xuICAgIHJldHVybiBuZXcgUmVxd2VzdChvLCBmbilcbiAgfVxuXG4gIC8vIG5vcm1hbGl6ZSBuZXdsaW5lIHZhcmlhbnRzIGFjY29yZGluZyB0byBzcGVjIC0+IENSTEZcbiAgZnVuY3Rpb24gbm9ybWFsaXplKHMpIHtcbiAgICByZXR1cm4gcyA/IHMucmVwbGFjZSgvXFxyP1xcbi9nLCAnXFxyXFxuJykgOiAnJ1xuICB9XG5cbiAgZnVuY3Rpb24gc2VyaWFsKGVsLCBjYikge1xuICAgIHZhciBuID0gZWwubmFtZVxuICAgICAgLCB0ID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAsIG9wdENiID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAvLyBJRSBnaXZlcyB2YWx1ZT1cIlwiIGV2ZW4gd2hlcmUgdGhlcmUgaXMgbm8gdmFsdWUgYXR0cmlidXRlXG4gICAgICAgICAgLy8gJ3NwZWNpZmllZCcgcmVmOiBodHRwOi8vd3d3LnczLm9yZy9UUi9ET00tTGV2ZWwtMy1Db3JlL2NvcmUuaHRtbCNJRC04NjI1MjkyNzNcbiAgICAgICAgICBpZiAobyAmJiAhb1snZGlzYWJsZWQnXSlcbiAgICAgICAgICAgIGNiKG4sIG5vcm1hbGl6ZShvWydhdHRyaWJ1dGVzJ11bJ3ZhbHVlJ10gJiYgb1snYXR0cmlidXRlcyddWyd2YWx1ZSddWydzcGVjaWZpZWQnXSA/IG9bJ3ZhbHVlJ10gOiBvWyd0ZXh0J10pKVxuICAgICAgICB9XG4gICAgICAsIGNoLCByYSwgdmFsLCBpXG5cbiAgICAvLyBkb24ndCBzZXJpYWxpemUgZWxlbWVudHMgdGhhdCBhcmUgZGlzYWJsZWQgb3Igd2l0aG91dCBhIG5hbWVcbiAgICBpZiAoZWwuZGlzYWJsZWQgfHwgIW4pIHJldHVyblxuXG4gICAgc3dpdGNoICh0KSB7XG4gICAgY2FzZSAnaW5wdXQnOlxuICAgICAgaWYgKCEvcmVzZXR8YnV0dG9ufGltYWdlfGZpbGUvaS50ZXN0KGVsLnR5cGUpKSB7XG4gICAgICAgIGNoID0gL2NoZWNrYm94L2kudGVzdChlbC50eXBlKVxuICAgICAgICByYSA9IC9yYWRpby9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgdmFsID0gZWwudmFsdWVcbiAgICAgICAgLy8gV2ViS2l0IGdpdmVzIHVzIFwiXCIgaW5zdGVhZCBvZiBcIm9uXCIgaWYgYSBjaGVja2JveCBoYXMgbm8gdmFsdWUsIHNvIGNvcnJlY3QgaXQgaGVyZVxuICAgICAgICA7KCEoY2ggfHwgcmEpIHx8IGVsLmNoZWNrZWQpICYmIGNiKG4sIG5vcm1hbGl6ZShjaCAmJiB2YWwgPT09ICcnID8gJ29uJyA6IHZhbCkpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgIGNiKG4sIG5vcm1hbGl6ZShlbC52YWx1ZSkpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBpZiAoZWwudHlwZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0LW9uZScpIHtcbiAgICAgICAgb3B0Q2IoZWwuc2VsZWN0ZWRJbmRleCA+PSAwID8gZWwub3B0aW9uc1tlbC5zZWxlY3RlZEluZGV4XSA6IG51bGwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSAwOyBlbC5sZW5ndGggJiYgaSA8IGVsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZWwub3B0aW9uc1tpXS5zZWxlY3RlZCAmJiBvcHRDYihlbC5vcHRpb25zW2ldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbGxlY3QgdXAgYWxsIGZvcm0gZWxlbWVudHMgZm91bmQgZnJvbSB0aGUgcGFzc2VkIGFyZ3VtZW50IGVsZW1lbnRzIGFsbFxuICAvLyB0aGUgd2F5IGRvd24gdG8gY2hpbGQgZWxlbWVudHM7IHBhc3MgYSAnPGZvcm0+JyBvciBmb3JtIGZpZWxkcy5cbiAgLy8gY2FsbGVkIHdpdGggJ3RoaXMnPWNhbGxiYWNrIHRvIHVzZSBmb3Igc2VyaWFsKCkgb24gZWFjaCBlbGVtZW50XG4gIGZ1bmN0aW9uIGVhY2hGb3JtRWxlbWVudCgpIHtcbiAgICB2YXIgY2IgPSB0aGlzXG4gICAgICAsIGUsIGlcbiAgICAgICwgc2VyaWFsaXplU3VidGFncyA9IGZ1bmN0aW9uIChlLCB0YWdzKSB7XG4gICAgICAgICAgdmFyIGksIGosIGZhXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZhID0gZVtieVRhZ10odGFnc1tpXSlcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBmYS5sZW5ndGg7IGorKykgc2VyaWFsKGZhW2pdLCBjYilcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGUgPSBhcmd1bWVudHNbaV1cbiAgICAgIGlmICgvaW5wdXR8c2VsZWN0fHRleHRhcmVhL2kudGVzdChlLnRhZ05hbWUpKSBzZXJpYWwoZSwgY2IpXG4gICAgICBzZXJpYWxpemVTdWJ0YWdzKGUsIFsgJ2lucHV0JywgJ3NlbGVjdCcsICd0ZXh0YXJlYScgXSlcbiAgICB9XG4gIH1cblxuICAvLyBzdGFuZGFyZCBxdWVyeSBzdHJpbmcgc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVRdWVyeVN0cmluZygpIHtcbiAgICByZXR1cm4gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKHJlcXdlc3Quc2VyaWFsaXplQXJyYXkuYXBwbHkobnVsbCwgYXJndW1lbnRzKSlcbiAgfVxuXG4gIC8vIHsgJ25hbWUnOiAndmFsdWUnLCAuLi4gfSBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZUhhc2goKSB7XG4gICAgdmFyIGhhc2ggPSB7fVxuICAgIGVhY2hGb3JtRWxlbWVudC5hcHBseShmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgIGlmIChuYW1lIGluIGhhc2gpIHtcbiAgICAgICAgaGFzaFtuYW1lXSAmJiAhaXNBcnJheShoYXNoW25hbWVdKSAmJiAoaGFzaFtuYW1lXSA9IFtoYXNoW25hbWVdXSlcbiAgICAgICAgaGFzaFtuYW1lXS5wdXNoKHZhbHVlKVxuICAgICAgfSBlbHNlIGhhc2hbbmFtZV0gPSB2YWx1ZVxuICAgIH0sIGFyZ3VtZW50cylcbiAgICByZXR1cm4gaGFzaFxuICB9XG5cbiAgLy8gWyB7IG5hbWU6ICduYW1lJywgdmFsdWU6ICd2YWx1ZScgfSwgLi4uIF0gc3R5bGUgc2VyaWFsaXphdGlvblxuICByZXF3ZXN0LnNlcmlhbGl6ZUFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnIgPSBbXVxuICAgIGVhY2hGb3JtRWxlbWVudC5hcHBseShmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgIGFyci5wdXNoKHtuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWV9KVxuICAgIH0sIGFyZ3VtZW50cylcbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICByZXF3ZXN0LnNlcmlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gICAgdmFyIG9wdCwgZm5cbiAgICAgICwgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMClcblxuICAgIG9wdCA9IGFyZ3MucG9wKClcbiAgICBvcHQgJiYgb3B0Lm5vZGVUeXBlICYmIGFyZ3MucHVzaChvcHQpICYmIChvcHQgPSBudWxsKVxuICAgIG9wdCAmJiAob3B0ID0gb3B0LnR5cGUpXG5cbiAgICBpZiAob3B0ID09ICdtYXAnKSBmbiA9IHNlcmlhbGl6ZUhhc2hcbiAgICBlbHNlIGlmIChvcHQgPT0gJ2FycmF5JykgZm4gPSByZXF3ZXN0LnNlcmlhbGl6ZUFycmF5XG4gICAgZWxzZSBmbiA9IHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nXG5cbiAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJncylcbiAgfVxuXG4gIHJlcXdlc3QudG9RdWVyeVN0cmluZyA9IGZ1bmN0aW9uIChvLCB0cmFkKSB7XG4gICAgdmFyIHByZWZpeCwgaVxuICAgICAgLCB0cmFkaXRpb25hbCA9IHRyYWQgfHwgZmFsc2VcbiAgICAgICwgcyA9IFtdXG4gICAgICAsIGVuYyA9IGVuY29kZVVSSUNvbXBvbmVudFxuICAgICAgLCBhZGQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgIC8vIElmIHZhbHVlIGlzIGEgZnVuY3Rpb24sIGludm9rZSBpdCBhbmQgcmV0dXJuIGl0cyB2YWx1ZVxuICAgICAgICAgIHZhbHVlID0gKCdmdW5jdGlvbicgPT09IHR5cGVvZiB2YWx1ZSkgPyB2YWx1ZSgpIDogKHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlKVxuICAgICAgICAgIHNbcy5sZW5ndGhdID0gZW5jKGtleSkgKyAnPScgKyBlbmModmFsdWUpXG4gICAgICAgIH1cbiAgICAvLyBJZiBhbiBhcnJheSB3YXMgcGFzc2VkIGluLCBhc3N1bWUgdGhhdCBpdCBpcyBhbiBhcnJheSBvZiBmb3JtIGVsZW1lbnRzLlxuICAgIGlmIChpc0FycmF5KG8pKSB7XG4gICAgICBmb3IgKGkgPSAwOyBvICYmIGkgPCBvLmxlbmd0aDsgaSsrKSBhZGQob1tpXVsnbmFtZSddLCBvW2ldWyd2YWx1ZSddKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0cmFkaXRpb25hbCwgZW5jb2RlIHRoZSBcIm9sZFwiIHdheSAodGhlIHdheSAxLjMuMiBvciBvbGRlclxuICAgICAgLy8gZGlkIGl0KSwgb3RoZXJ3aXNlIGVuY29kZSBwYXJhbXMgcmVjdXJzaXZlbHkuXG4gICAgICBmb3IgKHByZWZpeCBpbiBvKSB7XG4gICAgICAgIGlmIChvLmhhc093blByb3BlcnR5KHByZWZpeCkpIGJ1aWxkUGFyYW1zKHByZWZpeCwgb1twcmVmaXhdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNwYWNlcyBzaG91bGQgYmUgKyBhY2NvcmRpbmcgdG8gc3BlY1xuICAgIHJldHVybiBzLmpvaW4oJyYnKS5yZXBsYWNlKC8lMjAvZywgJysnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRQYXJhbXMocHJlZml4LCBvYmosIHRyYWRpdGlvbmFsLCBhZGQpIHtcbiAgICB2YXIgbmFtZSwgaSwgdlxuICAgICAgLCByYnJhY2tldCA9IC9cXFtcXF0kL1xuXG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgLy8gU2VyaWFsaXplIGFycmF5IGl0ZW0uXG4gICAgICBmb3IgKGkgPSAwOyBvYmogJiYgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgICB2ID0gb2JqW2ldXG4gICAgICAgIGlmICh0cmFkaXRpb25hbCB8fCByYnJhY2tldC50ZXN0KHByZWZpeCkpIHtcbiAgICAgICAgICAvLyBUcmVhdCBlYWNoIGFycmF5IGl0ZW0gYXMgYSBzY2FsYXIuXG4gICAgICAgICAgYWRkKHByZWZpeCwgdilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyAodHlwZW9mIHYgPT09ICdvYmplY3QnID8gaSA6ICcnKSArICddJywgdiwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2JqICYmIG9iai50b1N0cmluZygpID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgLy8gU2VyaWFsaXplIG9iamVjdCBpdGVtLlxuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyBuYW1lICsgJ10nLCBvYmpbbmFtZV0sIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VyaWFsaXplIHNjYWxhciBpdGVtLlxuICAgICAgYWRkKHByZWZpeCwgb2JqKVxuICAgIH1cbiAgfVxuXG4gIHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrUHJlZml4XG4gIH1cblxuICAvLyBqUXVlcnkgYW5kIFplcHRvIGNvbXBhdGliaWxpdHksIGRpZmZlcmVuY2VzIGNhbiBiZSByZW1hcHBlZCBoZXJlIHNvIHlvdSBjYW4gY2FsbFxuICAvLyAuYWpheC5jb21wYXQob3B0aW9ucywgY2FsbGJhY2spXG4gIHJlcXdlc3QuY29tcGF0ID0gZnVuY3Rpb24gKG8sIGZuKSB7XG4gICAgaWYgKG8pIHtcbiAgICAgIG9bJ3R5cGUnXSAmJiAob1snbWV0aG9kJ10gPSBvWyd0eXBlJ10pICYmIGRlbGV0ZSBvWyd0eXBlJ11cbiAgICAgIG9bJ2RhdGFUeXBlJ10gJiYgKG9bJ3R5cGUnXSA9IG9bJ2RhdGFUeXBlJ10pXG4gICAgICBvWydqc29ucENhbGxiYWNrJ10gJiYgKG9bJ2pzb25wQ2FsbGJhY2tOYW1lJ10gPSBvWydqc29ucENhbGxiYWNrJ10pICYmIGRlbGV0ZSBvWydqc29ucENhbGxiYWNrJ11cbiAgICAgIG9bJ2pzb25wJ10gJiYgKG9bJ2pzb25wQ2FsbGJhY2snXSA9IG9bJ2pzb25wJ10pXG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVxd2VzdChvLCBmbilcbiAgfVxuXG4gIHJlcXdlc3QuYWpheFNldHVwID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIGZvciAodmFyIGsgaW4gb3B0aW9ucykge1xuICAgICAgZ2xvYmFsU2V0dXBPcHRpb25zW2tdID0gb3B0aW9uc1trXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXF3ZXN0XG59KTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQgRmVsaXggR25hc3NcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuXG4gIC8qIENvbW1vbkpTICovXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JykgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpXG5cbiAgLyogQU1EIG1vZHVsZSAqL1xuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZhY3RvcnkpXG5cbiAgLyogQnJvd3NlciBnbG9iYWwgKi9cbiAgZWxzZSByb290LlNwaW5uZXIgPSBmYWN0b3J5KClcbn1cbih0aGlzLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIHByZWZpeGVzID0gWyd3ZWJraXQnLCAnTW96JywgJ21zJywgJ08nXSAvKiBWZW5kb3IgcHJlZml4ZXMgKi9cbiAgICAsIGFuaW1hdGlvbnMgPSB7fSAvKiBBbmltYXRpb24gcnVsZXMga2V5ZWQgYnkgdGhlaXIgbmFtZSAqL1xuICAgICwgdXNlQ3NzQW5pbWF0aW9ucyAvKiBXaGV0aGVyIHRvIHVzZSBDU1MgYW5pbWF0aW9ucyBvciBzZXRUaW1lb3V0ICovXG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgZnVuY3Rpb24gdG8gY3JlYXRlIGVsZW1lbnRzLiBJZiBubyB0YWcgbmFtZSBpcyBnaXZlbixcbiAgICogYSBESVYgaXMgY3JlYXRlZC4gT3B0aW9uYWxseSBwcm9wZXJ0aWVzIGNhbiBiZSBwYXNzZWQuXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVFbCh0YWcsIHByb3ApIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyB8fCAnZGl2JylcbiAgICAgICwgblxuXG4gICAgZm9yKG4gaW4gcHJvcCkgZWxbbl0gPSBwcm9wW25dXG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBjaGlsZHJlbiBhbmQgcmV0dXJucyB0aGUgcGFyZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gaW5zKHBhcmVudCAvKiBjaGlsZDEsIGNoaWxkMiwgLi4uKi8pIHtcbiAgICBmb3IgKHZhciBpPTEsIG49YXJndW1lbnRzLmxlbmd0aDsgaTxuOyBpKyspXG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoYXJndW1lbnRzW2ldKVxuXG4gICAgcmV0dXJuIHBhcmVudFxuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBhIG5ldyBzdHlsZXNoZWV0IHRvIGhvbGQgdGhlIEBrZXlmcmFtZSBvciBWTUwgcnVsZXMuXG4gICAqL1xuICB2YXIgc2hlZXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVsID0gY3JlYXRlRWwoJ3N0eWxlJywge3R5cGUgOiAndGV4dC9jc3MnfSlcbiAgICBpbnMoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSwgZWwpXG4gICAgcmV0dXJuIGVsLnNoZWV0IHx8IGVsLnN0eWxlU2hlZXRcbiAgfSgpKVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIG9wYWNpdHkga2V5ZnJhbWUgYW5pbWF0aW9uIHJ1bGUgYW5kIHJldHVybnMgaXRzIG5hbWUuXG4gICAqIFNpbmNlIG1vc3QgbW9iaWxlIFdlYmtpdHMgaGF2ZSB0aW1pbmcgaXNzdWVzIHdpdGggYW5pbWF0aW9uLWRlbGF5LFxuICAgKiB3ZSBjcmVhdGUgc2VwYXJhdGUgcnVsZXMgZm9yIGVhY2ggbGluZS9zZWdtZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gYWRkQW5pbWF0aW9uKGFscGhhLCB0cmFpbCwgaSwgbGluZXMpIHtcbiAgICB2YXIgbmFtZSA9IFsnb3BhY2l0eScsIHRyYWlsLCB+fihhbHBoYSoxMDApLCBpLCBsaW5lc10uam9pbignLScpXG4gICAgICAsIHN0YXJ0ID0gMC4wMSArIGkvbGluZXMgKiAxMDBcbiAgICAgICwgeiA9IE1hdGgubWF4KDEgLSAoMS1hbHBoYSkgLyB0cmFpbCAqICgxMDAtc3RhcnQpLCBhbHBoYSlcbiAgICAgICwgcHJlZml4ID0gdXNlQ3NzQW5pbWF0aW9ucy5zdWJzdHJpbmcoMCwgdXNlQ3NzQW5pbWF0aW9ucy5pbmRleE9mKCdBbmltYXRpb24nKSkudG9Mb3dlckNhc2UoKVxuICAgICAgLCBwcmUgPSBwcmVmaXggJiYgJy0nICsgcHJlZml4ICsgJy0nIHx8ICcnXG5cbiAgICBpZiAoIWFuaW1hdGlvbnNbbmFtZV0pIHtcbiAgICAgIHNoZWV0Lmluc2VydFJ1bGUoXG4gICAgICAgICdAJyArIHByZSArICdrZXlmcmFtZXMgJyArIG5hbWUgKyAneycgK1xuICAgICAgICAnMCV7b3BhY2l0eTonICsgeiArICd9JyArXG4gICAgICAgIHN0YXJ0ICsgJyV7b3BhY2l0eTonICsgYWxwaGEgKyAnfScgK1xuICAgICAgICAoc3RhcnQrMC4wMSkgKyAnJXtvcGFjaXR5OjF9JyArXG4gICAgICAgIChzdGFydCt0cmFpbCkgJSAxMDAgKyAnJXtvcGFjaXR5OicgKyBhbHBoYSArICd9JyArXG4gICAgICAgICcxMDAle29wYWNpdHk6JyArIHogKyAnfScgK1xuICAgICAgICAnfScsIHNoZWV0LmNzc1J1bGVzLmxlbmd0aClcblxuICAgICAgYW5pbWF0aW9uc1tuYW1lXSA9IDFcbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZVxuICB9XG5cbiAgLyoqXG4gICAqIFRyaWVzIHZhcmlvdXMgdmVuZG9yIHByZWZpeGVzIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBzdXBwb3J0ZWQgcHJvcGVydHkuXG4gICAqL1xuICBmdW5jdGlvbiB2ZW5kb3IoZWwsIHByb3ApIHtcbiAgICB2YXIgcyA9IGVsLnN0eWxlXG4gICAgICAsIHBwXG4gICAgICAsIGlcblxuICAgIHByb3AgPSBwcm9wLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcC5zbGljZSgxKVxuICAgIGZvcihpPTA7IGk8cHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBwID0gcHJlZml4ZXNbaV0rcHJvcFxuICAgICAgaWYoc1twcF0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHBwXG4gICAgfVxuICAgIGlmKHNbcHJvcF0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHByb3BcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIG11bHRpcGxlIHN0eWxlIHByb3BlcnRpZXMgYXQgb25jZS5cbiAgICovXG4gIGZ1bmN0aW9uIGNzcyhlbCwgcHJvcCkge1xuICAgIGZvciAodmFyIG4gaW4gcHJvcClcbiAgICAgIGVsLnN0eWxlW3ZlbmRvcihlbCwgbil8fG5dID0gcHJvcFtuXVxuXG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICAvKipcbiAgICogRmlsbHMgaW4gZGVmYXVsdCB2YWx1ZXMuXG4gICAqL1xuICBmdW5jdGlvbiBtZXJnZShvYmopIHtcbiAgICBmb3IgKHZhciBpPTE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZWYgPSBhcmd1bWVudHNbaV1cbiAgICAgIGZvciAodmFyIG4gaW4gZGVmKVxuICAgICAgICBpZiAob2JqW25dID09PSB1bmRlZmluZWQpIG9ialtuXSA9IGRlZltuXVxuICAgIH1cbiAgICByZXR1cm4gb2JqXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGluZSBjb2xvciBmcm9tIHRoZSBnaXZlbiBzdHJpbmcgb3IgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBnZXRDb2xvcihjb2xvciwgaWR4KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBjb2xvciA9PSAnc3RyaW5nJyA/IGNvbG9yIDogY29sb3JbaWR4ICUgY29sb3IubGVuZ3RoXVxuICB9XG5cbiAgLy8gQnVpbHQtaW4gZGVmYXVsdHNcblxuICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgbGluZXM6IDEyLCAgICAgICAgICAgIC8vIFRoZSBudW1iZXIgb2YgbGluZXMgdG8gZHJhd1xuICAgIGxlbmd0aDogNywgICAgICAgICAgICAvLyBUaGUgbGVuZ3RoIG9mIGVhY2ggbGluZVxuICAgIHdpZHRoOiA1LCAgICAgICAgICAgICAvLyBUaGUgbGluZSB0aGlja25lc3NcbiAgICByYWRpdXM6IDEwLCAgICAgICAgICAgLy8gVGhlIHJhZGl1cyBvZiB0aGUgaW5uZXIgY2lyY2xlXG4gICAgcm90YXRlOiAwLCAgICAgICAgICAgIC8vIFJvdGF0aW9uIG9mZnNldFxuICAgIGNvcm5lcnM6IDEsICAgICAgICAgICAvLyBSb3VuZG5lc3MgKDAuLjEpXG4gICAgY29sb3I6ICcjMDAwJywgICAgICAgIC8vICNyZ2Igb3IgI3JyZ2diYlxuICAgIGRpcmVjdGlvbjogMSwgICAgICAgICAvLyAxOiBjbG9ja3dpc2UsIC0xOiBjb3VudGVyY2xvY2t3aXNlXG4gICAgc3BlZWQ6IDEsICAgICAgICAgICAgIC8vIFJvdW5kcyBwZXIgc2Vjb25kXG4gICAgdHJhaWw6IDEwMCwgICAgICAgICAgIC8vIEFmdGVyZ2xvdyBwZXJjZW50YWdlXG4gICAgb3BhY2l0eTogMS80LCAgICAgICAgIC8vIE9wYWNpdHkgb2YgdGhlIGxpbmVzXG4gICAgZnBzOiAyMCwgICAgICAgICAgICAgIC8vIEZyYW1lcyBwZXIgc2Vjb25kIHdoZW4gdXNpbmcgc2V0VGltZW91dCgpXG4gICAgekluZGV4OiAyZTksICAgICAgICAgIC8vIFVzZSBhIGhpZ2ggei1pbmRleCBieSBkZWZhdWx0XG4gICAgY2xhc3NOYW1lOiAnc3Bpbm5lcicsIC8vIENTUyBjbGFzcyB0byBhc3NpZ24gdG8gdGhlIGVsZW1lbnRcbiAgICB0b3A6ICc1MCUnLCAgICAgICAgICAgLy8gY2VudGVyIHZlcnRpY2FsbHlcbiAgICBsZWZ0OiAnNTAlJywgICAgICAgICAgLy8gY2VudGVyIGhvcml6b250YWxseVxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnICAvLyBlbGVtZW50IHBvc2l0aW9uXG4gIH1cblxuICAvKiogVGhlIGNvbnN0cnVjdG9yICovXG4gIGZ1bmN0aW9uIFNwaW5uZXIobykge1xuICAgIHRoaXMub3B0cyA9IG1lcmdlKG8gfHwge30sIFNwaW5uZXIuZGVmYXVsdHMsIGRlZmF1bHRzKVxuICB9XG5cbiAgLy8gR2xvYmFsIGRlZmF1bHRzIHRoYXQgb3ZlcnJpZGUgdGhlIGJ1aWx0LWluczpcbiAgU3Bpbm5lci5kZWZhdWx0cyA9IHt9XG5cbiAgbWVyZ2UoU3Bpbm5lci5wcm90b3R5cGUsIHtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgdGhlIHNwaW5uZXIgdG8gdGhlIGdpdmVuIHRhcmdldCBlbGVtZW50LiBJZiB0aGlzIGluc3RhbmNlIGlzIGFscmVhZHlcbiAgICAgKiBzcGlubmluZywgaXQgaXMgYXV0b21hdGljYWxseSByZW1vdmVkIGZyb20gaXRzIHByZXZpb3VzIHRhcmdldCBiIGNhbGxpbmdcbiAgICAgKiBzdG9wKCkgaW50ZXJuYWxseS5cbiAgICAgKi9cbiAgICBzcGluOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIHRoaXMuc3RvcCgpXG5cbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAsIG8gPSBzZWxmLm9wdHNcbiAgICAgICAgLCBlbCA9IHNlbGYuZWwgPSBjc3MoY3JlYXRlRWwoMCwge2NsYXNzTmFtZTogby5jbGFzc05hbWV9KSwge3Bvc2l0aW9uOiBvLnBvc2l0aW9uLCB3aWR0aDogMCwgekluZGV4OiBvLnpJbmRleH0pXG5cbiAgICAgIGNzcyhlbCwge1xuICAgICAgICBsZWZ0OiBvLmxlZnQsXG4gICAgICAgIHRvcDogby50b3BcbiAgICAgIH0pXG4gICAgICAgIFxuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQuZmlyc3RDaGlsZHx8bnVsbClcbiAgICAgIH1cblxuICAgICAgZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Byb2dyZXNzYmFyJylcbiAgICAgIHNlbGYubGluZXMoZWwsIHNlbGYub3B0cylcblxuICAgICAgaWYgKCF1c2VDc3NBbmltYXRpb25zKSB7XG4gICAgICAgIC8vIE5vIENTUyBhbmltYXRpb24gc3VwcG9ydCwgdXNlIHNldFRpbWVvdXQoKSBpbnN0ZWFkXG4gICAgICAgIHZhciBpID0gMFxuICAgICAgICAgICwgc3RhcnQgPSAoby5saW5lcyAtIDEpICogKDEgLSBvLmRpcmVjdGlvbikgLyAyXG4gICAgICAgICAgLCBhbHBoYVxuICAgICAgICAgICwgZnBzID0gby5mcHNcbiAgICAgICAgICAsIGYgPSBmcHMvby5zcGVlZFxuICAgICAgICAgICwgb3N0ZXAgPSAoMS1vLm9wYWNpdHkpIC8gKGYqby50cmFpbCAvIDEwMClcbiAgICAgICAgICAsIGFzdGVwID0gZi9vLmxpbmVzXG5cbiAgICAgICAgOyhmdW5jdGlvbiBhbmltKCkge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG8ubGluZXM7IGorKykge1xuICAgICAgICAgICAgYWxwaGEgPSBNYXRoLm1heCgxIC0gKGkgKyAoby5saW5lcyAtIGopICogYXN0ZXApICUgZiAqIG9zdGVwLCBvLm9wYWNpdHkpXG5cbiAgICAgICAgICAgIHNlbGYub3BhY2l0eShlbCwgaiAqIG8uZGlyZWN0aW9uICsgc3RhcnQsIGFscGhhLCBvKVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLnRpbWVvdXQgPSBzZWxmLmVsICYmIHNldFRpbWVvdXQoYW5pbSwgfn4oMTAwMC9mcHMpKVxuICAgICAgICB9KSgpXG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZlxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyBhbmQgcmVtb3ZlcyB0aGUgU3Bpbm5lci5cbiAgICAgKi9cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICAgIGlmIChlbCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSkgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcbiAgICAgICAgdGhpcy5lbCA9IHVuZGVmaW5lZFxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgbWV0aG9kIHRoYXQgZHJhd3MgdGhlIGluZGl2aWR1YWwgbGluZXMuIFdpbGwgYmUgb3ZlcndyaXR0ZW5cbiAgICAgKiBpbiBWTUwgZmFsbGJhY2sgbW9kZSBiZWxvdy5cbiAgICAgKi9cbiAgICBsaW5lczogZnVuY3Rpb24oZWwsIG8pIHtcbiAgICAgIHZhciBpID0gMFxuICAgICAgICAsIHN0YXJ0ID0gKG8ubGluZXMgLSAxKSAqICgxIC0gby5kaXJlY3Rpb24pIC8gMlxuICAgICAgICAsIHNlZ1xuXG4gICAgICBmdW5jdGlvbiBmaWxsKGNvbG9yLCBzaGFkb3cpIHtcbiAgICAgICAgcmV0dXJuIGNzcyhjcmVhdGVFbCgpLCB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgd2lkdGg6IChvLmxlbmd0aCtvLndpZHRoKSArICdweCcsXG4gICAgICAgICAgaGVpZ2h0OiBvLndpZHRoICsgJ3B4JyxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvcixcbiAgICAgICAgICBib3hTaGFkb3c6IHNoYWRvdyxcbiAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICdsZWZ0JyxcbiAgICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoJyArIH5+KDM2MC9vLmxpbmVzKmkrby5yb3RhdGUpICsgJ2RlZykgdHJhbnNsYXRlKCcgKyBvLnJhZGl1cysncHgnICsnLDApJyxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IChvLmNvcm5lcnMgKiBvLndpZHRoPj4xKSArICdweCdcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgZm9yICg7IGkgPCBvLmxpbmVzOyBpKyspIHtcbiAgICAgICAgc2VnID0gY3NzKGNyZWF0ZUVsKCksIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDErfihvLndpZHRoLzIpICsgJ3B4JyxcbiAgICAgICAgICB0cmFuc2Zvcm06IG8uaHdhY2NlbCA/ICd0cmFuc2xhdGUzZCgwLDAsMCknIDogJycsXG4gICAgICAgICAgb3BhY2l0eTogby5vcGFjaXR5LFxuICAgICAgICAgIGFuaW1hdGlvbjogdXNlQ3NzQW5pbWF0aW9ucyAmJiBhZGRBbmltYXRpb24oby5vcGFjaXR5LCBvLnRyYWlsLCBzdGFydCArIGkgKiBvLmRpcmVjdGlvbiwgby5saW5lcykgKyAnICcgKyAxL28uc3BlZWQgKyAncyBsaW5lYXIgaW5maW5pdGUnXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKG8uc2hhZG93KSBpbnMoc2VnLCBjc3MoZmlsbCgnIzAwMCcsICcwIDAgNHB4ICcgKyAnIzAwMCcpLCB7dG9wOiAyKydweCd9KSlcbiAgICAgICAgaW5zKGVsLCBpbnMoc2VnLCBmaWxsKGdldENvbG9yKG8uY29sb3IsIGkpLCAnMCAwIDFweCByZ2JhKDAsMCwwLC4xKScpKSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgdGhhdCBhZGp1c3RzIHRoZSBvcGFjaXR5IG9mIGEgc2luZ2xlIGxpbmUuXG4gICAgICogV2lsbCBiZSBvdmVyd3JpdHRlbiBpbiBWTUwgZmFsbGJhY2sgbW9kZSBiZWxvdy5cbiAgICAgKi9cbiAgICBvcGFjaXR5OiBmdW5jdGlvbihlbCwgaSwgdmFsKSB7XG4gICAgICBpZiAoaSA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoKSBlbC5jaGlsZE5vZGVzW2ldLnN0eWxlLm9wYWNpdHkgPSB2YWxcbiAgICB9XG5cbiAgfSlcblxuXG4gIGZ1bmN0aW9uIGluaXRWTUwoKSB7XG5cbiAgICAvKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIFZNTCB0YWcgKi9cbiAgICBmdW5jdGlvbiB2bWwodGFnLCBhdHRyKSB7XG4gICAgICByZXR1cm4gY3JlYXRlRWwoJzwnICsgdGFnICsgJyB4bWxucz1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC5jb206dm1sXCIgY2xhc3M9XCJzcGluLXZtbFwiPicsIGF0dHIpXG4gICAgfVxuXG4gICAgLy8gTm8gQ1NTIHRyYW5zZm9ybXMgYnV0IFZNTCBzdXBwb3J0LCBhZGQgYSBDU1MgcnVsZSBmb3IgVk1MIGVsZW1lbnRzOlxuICAgIHNoZWV0LmFkZFJ1bGUoJy5zcGluLXZtbCcsICdiZWhhdmlvcjp1cmwoI2RlZmF1bHQjVk1MKScpXG5cbiAgICBTcGlubmVyLnByb3RvdHlwZS5saW5lcyA9IGZ1bmN0aW9uKGVsLCBvKSB7XG4gICAgICB2YXIgciA9IG8ubGVuZ3RoK28ud2lkdGhcbiAgICAgICAgLCBzID0gMipyXG5cbiAgICAgIGZ1bmN0aW9uIGdycCgpIHtcbiAgICAgICAgcmV0dXJuIGNzcyhcbiAgICAgICAgICB2bWwoJ2dyb3VwJywge1xuICAgICAgICAgICAgY29vcmRzaXplOiBzICsgJyAnICsgcyxcbiAgICAgICAgICAgIGNvb3Jkb3JpZ2luOiAtciArICcgJyArIC1yXG4gICAgICAgICAgfSksXG4gICAgICAgICAgeyB3aWR0aDogcywgaGVpZ2h0OiBzIH1cbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICB2YXIgbWFyZ2luID0gLShvLndpZHRoK28ubGVuZ3RoKSoyICsgJ3B4J1xuICAgICAgICAsIGcgPSBjc3MoZ3JwKCksIHtwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiBtYXJnaW4sIGxlZnQ6IG1hcmdpbn0pXG4gICAgICAgICwgaVxuXG4gICAgICBmdW5jdGlvbiBzZWcoaSwgZHgsIGZpbHRlcikge1xuICAgICAgICBpbnMoZyxcbiAgICAgICAgICBpbnMoY3NzKGdycCgpLCB7cm90YXRpb246IDM2MCAvIG8ubGluZXMgKiBpICsgJ2RlZycsIGxlZnQ6IH5+ZHh9KSxcbiAgICAgICAgICAgIGlucyhjc3Modm1sKCdyb3VuZHJlY3QnLCB7YXJjc2l6ZTogby5jb3JuZXJzfSksIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogcixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IG8ud2lkdGgsXG4gICAgICAgICAgICAgICAgbGVmdDogby5yYWRpdXMsXG4gICAgICAgICAgICAgICAgdG9wOiAtby53aWR0aD4+MSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6IGZpbHRlclxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgdm1sKCdmaWxsJywge2NvbG9yOiBnZXRDb2xvcihvLmNvbG9yLCBpKSwgb3BhY2l0eTogby5vcGFjaXR5fSksXG4gICAgICAgICAgICAgIHZtbCgnc3Ryb2tlJywge29wYWNpdHk6IDB9KSAvLyB0cmFuc3BhcmVudCBzdHJva2UgdG8gZml4IGNvbG9yIGJsZWVkaW5nIHVwb24gb3BhY2l0eSBjaGFuZ2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgaWYgKG8uc2hhZG93KVxuICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IG8ubGluZXM7IGkrKylcbiAgICAgICAgICBzZWcoaSwgLTIsICdwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuQmx1cihwaXhlbHJhZGl1cz0yLG1ha2VzaGFkb3c9MSxzaGFkb3dvcGFjaXR5PS4zKScpXG5cbiAgICAgIGZvciAoaSA9IDE7IGkgPD0gby5saW5lczsgaSsrKSBzZWcoaSlcbiAgICAgIHJldHVybiBpbnMoZWwsIGcpXG4gICAgfVxuXG4gICAgU3Bpbm5lci5wcm90b3R5cGUub3BhY2l0eSA9IGZ1bmN0aW9uKGVsLCBpLCB2YWwsIG8pIHtcbiAgICAgIHZhciBjID0gZWwuZmlyc3RDaGlsZFxuICAgICAgbyA9IG8uc2hhZG93ICYmIG8ubGluZXMgfHwgMFxuICAgICAgaWYgKGMgJiYgaStvIDwgYy5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBjID0gYy5jaGlsZE5vZGVzW2krb107IGMgPSBjICYmIGMuZmlyc3RDaGlsZDsgYyA9IGMgJiYgYy5maXJzdENoaWxkXG4gICAgICAgIGlmIChjKSBjLm9wYWNpdHkgPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgcHJvYmUgPSBjc3MoY3JlYXRlRWwoJ2dyb3VwJyksIHtiZWhhdmlvcjogJ3VybCgjZGVmYXVsdCNWTUwpJ30pXG5cbiAgaWYgKCF2ZW5kb3IocHJvYmUsICd0cmFuc2Zvcm0nKSAmJiBwcm9iZS5hZGopIGluaXRWTUwoKVxuICBlbHNlIHVzZUNzc0FuaW1hdGlvbnMgPSB2ZW5kb3IocHJvYmUsICdhbmltYXRpb24nKVxuXG4gIHJldHVybiBTcGlubmVyXG5cbn0pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEBlbnVtIHtOdW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICBFTEVNRU5UOiAxLFxuICBBVFRSSUJVVEU6IDIsXG4gIFRFWFQ6IDMsXG4gIENEQVRBX1NFQ1RJT046IDQsXG4gIEVOVElUWV9SRUZFUkVOQ0U6IDUsXG4gIEVOVElUWTogNixcbiAgUFJPQ0VTU0lOR19JTlNUUlVDVElPTjogNyxcbiAgQ09NTUVOVDogOCxcbiAgRE9DVU1FTlQ6IDksXG4gIERPQ1VNRU5UX1RZUEU6IDEwLFxuICBET0NVTUVOVF9GUkFHTUVOVDogMTEsXG4gIE5PVEFUSU9OOiAxMlxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIHZhbHVlIGlzIG5vdCB1bmRlZmluZWQuXG4gKlxuICogQHBhcmFtIHs/fSB2YWwgVmFyaWFibGUgdG8gdGVzdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdmFyaWFibGUgaXMgZGVmaW5lZC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0RlZih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gdm9pZCAwO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEFkZHMgYSBrZXktdmFsdWUgcGFpciB0byB0aGUgb2JqZWN0L21hcC9oYXNoIGlmIGl0IGRvZXNuJ3QgZXhpc3QgeWV0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0LjxLLFY+fSBvYmogVGhlIG9iamVjdCB0byB3aGljaCB0byBhZGQgdGhlIGtleS12YWx1ZSBwYWlyLlxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGFkZC5cbiAqIEBwYXJhbSB7Vn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFkZCBpZiB0aGUga2V5IHdhc24ndCBwcmVzZW50LlxuICogQHJldHVybiB7Vn0gVGhlIHZhbHVlIG9mIHRoZSBlbnRyeSBhdCB0aGUgZW5kIG9mIHRoZSBmdW5jdGlvbi5cbiAqIEB0ZW1wbGF0ZSBLLFZcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGtleSBpbiBvYmogPyBvYmpba2V5XSA6IChvYmpba2V5XSA9IHZhbHVlKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGlzRGVmID0gcmVxdWlyZSgnLi9pc2RlZicpO1xuXG4vKipcbiAqIE1ha2Ugc3VyZSB3ZSB0cmltIEJPTSBhbmQgTkJTUFxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xudmFyIFRSSU1fUkUgPSAvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2c7XG5cbi8qKlxuICogUmVwZWF0cyBhIHN0cmluZyBuIHRpbWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHJlcGVhdC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIG51bWJlciBvZiB0aW1lcyB0byByZXBlYXQuXG4gKiBAcmV0dXJuIHtTdHJpbmd9IEEgc3RyaW5nIGNvbnRhaW5pbmcge0Bjb2RlIGxlbmd0aH0gcmVwZXRpdGlvbnMgb2ZcbiAqICAgICB7QGNvZGUgc3RyaW5nfS5cbiAqL1xuZnVuY3Rpb24gcmVwZWF0KHN0cmluZywgbGVuZ3RoKSB7XG4gIHJldHVybiBuZXcgQXJyYXkobGVuZ3RoICsgMSkuam9pbihzdHJpbmcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKipcbiAgICogQHBhcmFtICB7U3RyaW5nfSBzdHJcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgdHJpbTogZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKFRSSU1fUkUsICcnKTtcbiAgfSxcblxuICAvKipcbiAgICogUGFkcyBudW1iZXIgdG8gZ2l2ZW4gbGVuZ3RoIGFuZCBvcHRpb25hbGx5IHJvdW5kcyBpdCB0byBhIGdpdmVuIHByZWNpc2lvbi5cbiAgICogRm9yIGV4YW1wbGU6XG4gICAqIDxwcmU+cGFkTnVtYmVyKDEuMjUsIDIsIDMpIC0+ICcwMS4yNTAnXG4gICAqIHBhZE51bWJlcigxLjI1LCAyKSAtPiAnMDEuMjUnXG4gICAqIHBhZE51bWJlcigxLjI1LCAyLCAxKSAtPiAnMDEuMydcbiAgICogcGFkTnVtYmVyKDEuMjUsIDApIC0+ICcxLjI1JzwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gbnVtIFRoZSBudW1iZXIgdG8gcGFkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIFRoZSBkZXNpcmVkIGxlbmd0aC5cbiAgICogQHBhcmFtIHtOdW1iZXI9fSBvcHRfcHJlY2lzaW9uIFRoZSBkZXNpcmVkIHByZWNpc2lvbi5cbiAgICogQHJldHVybiB7U3RyaW5nfSB7QGNvZGUgbnVtfSBhcyBhIHN0cmluZyB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgcGFkTnVtYmVyOiBmdW5jdGlvbihudW0sIGxlbmd0aCwgb3B0X3ByZWNpc2lvbikge1xuICAgIHZhciBzID0gaXNEZWYob3B0X3ByZWNpc2lvbikgPyBudW0udG9GaXhlZChvcHRfcHJlY2lzaW9uKSA6IFN0cmluZyhudW0pO1xuICAgIHZhciBpbmRleCA9IHMuaW5kZXhPZignLicpO1xuICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgaW5kZXggPSBzLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIHJlcGVhdCgnMCcsIE1hdGgubWF4KDAsIGxlbmd0aCAtIGluZGV4KSkgKyBzO1xuICB9XG5cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFhNTFBhcnNlciA9IHJlcXVpcmUoJy4veG1sX3BhcnNlcicpO1xudmFyIGlzRGVmID0gcmVxdWlyZSgnLi91dGlscy9pc2RlZicpO1xudmFyIG5vZGVUeXBlcyA9IHJlcXVpcmUoJy4vbm9kZV90eXBlcycpO1xudmFyIHNldElmVW5kZWZpbmVkID0gcmVxdWlyZSgnLi91dGlscy9zZXRpZnVuZGVmaW5lZCcpO1xudmFyIFhTRCA9IHJlcXVpcmUoJy4veHNkJyk7XG52YXIgWExpbmsgPSByZXF1aXJlKCcuL3hsaW5rJyk7XG5cbi8qKlxuICogV01TIENhcGFiaWxpdGllcyBwYXJzZXJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZz19IHhtbFN0cmluZ1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFdNUyh4bWxTdHJpbmcpIHtcblxuICAvKipcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHRoaXMudmVyc2lvbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHR5cGUge1hNTFBhcnNlcn1cbiAgICovXG4gIHRoaXMuX3BhcnNlciA9IG5ldyBYTUxQYXJzZXIoKTtcblxuICAvKipcbiAgICogQHR5cGUge1N0cmluZz19XG4gICAqL1xuICB0aGlzLl9kYXRhID0geG1sU3RyaW5nO1xufTtcblxuLyoqXG4gKiBTaG9ydGN1dFxuICogQHR5cGUge0Z1bmN0aW9ufVxuICovXG52YXIgbWFrZVByb3BlcnR5U2V0dGVyID0gWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVNldHRlcjtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30geG1sU3RyaW5nXG4gKiBAcmV0dXJuIHtXTVN9XG4gKi9cbldNUy5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKHhtbFN0cmluZykge1xuICB0aGlzLl9kYXRhID0geG1sU3RyaW5nO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQHBhcmFtICB7U3RyaW5nPX0geG1sU3RyaW5nXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbldNUy5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oeG1sU3RyaW5nKSB7XG4gIHhtbFN0cmluZyA9IHhtbFN0cmluZyB8fCB0aGlzLl9kYXRhO1xuICByZXR1cm4gdGhpcy5wYXJzZSh4bWxTdHJpbmcpO1xufTtcblxuLyoqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHhtbFxuICovXG5XTVMucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oeG1sU3RyaW5nKSB7XG4gIHJldHVybiB0aGlzLl9yZWFkRnJvbURvY3VtZW50KHRoaXMuX3BhcnNlci50b0RvY3VtZW50KHhtbFN0cmluZykpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gIHtEb2N1bWVudH0gZG9jXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbldNUy5wcm90b3R5cGUuX3JlYWRGcm9tRG9jdW1lbnQgPSBmdW5jdGlvbihkb2MpIHtcbiAgZm9yICh2YXIgbm9kZSA9IGRvYy5maXJzdENoaWxkOyBub2RlOyBub2RlID0gbm9kZS5uZXh0U2libGluZykge1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09IG5vZGVUeXBlcy5FTEVNRU5UKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkRnJvbU5vZGUobm9kZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gIHtET01Ob2RlfSBub2RlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbldNUy5wcm90b3R5cGUucmVhZEZyb21Ob2RlID0gZnVuY3Rpb24obm9kZSkge1xuICB0aGlzLnZlcnNpb24gPSBub2RlLmdldEF0dHJpYnV0ZSgndmVyc2lvbicpO1xuICB2YXIgd21zQ2FwYWJpbGl0eU9iamVjdCA9IFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe1xuICAgICd2ZXJzaW9uJzogdGhpcy52ZXJzaW9uXG4gIH0sIFdNUy5QQVJTRVJTLCBub2RlLCBbXSk7XG5cbiAgcmV0dXJuIHdtc0NhcGFiaWxpdHlPYmplY3QgfHwgbnVsbDtcbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IEF0dHJpYnV0aW9uIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkQXR0cmlidXRpb24gPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLkFUVFJJQlVUSU9OX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fSBCb3VuZGluZyBib3ggb2JqZWN0LlxuICovXG5XTVMuX3JlYWRCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHZhciByZWFkRGVjaW1hbFN0cmluZyA9IFhTRC5yZWFkRGVjaW1hbFN0cmluZztcbiAgdmFyIGV4dGVudCA9IFtcbiAgICByZWFkRGVjaW1hbFN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnbWlueCcpKSxcbiAgICByZWFkRGVjaW1hbFN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnbWlueScpKSxcbiAgICByZWFkRGVjaW1hbFN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnbWF4eCcpKSxcbiAgICByZWFkRGVjaW1hbFN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnbWF4eScpKVxuICBdO1xuXG4gIHZhciByZXNvbHV0aW9ucyA9IFtcbiAgICByZWFkRGVjaW1hbFN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgncmVzeCcpKSxcbiAgICByZWFkRGVjaW1hbFN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgncmVzeScpKVxuICBdO1xuXG4gIHJldHVybiB7XG4gICAgJ2Nycyc6IG5vZGUuZ2V0QXR0cmlidXRlKCdDUlMnKSB8fCBub2RlLmdldEF0dHJpYnV0ZSgnU1JTJyksXG4gICAgJ2V4dGVudCc6IGV4dGVudCxcbiAgICAncmVzJzogcmVzb2x1dGlvbnNcbiAgfTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7b2wuRXh0ZW50fHVuZGVmaW5lZH0gQm91bmRpbmcgYm94IG9iamVjdC5cbiAqL1xuV01TLl9yZWFkRVhHZW9ncmFwaGljQm91bmRpbmdCb3ggPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICB2YXIgZ2VvZ3JhcGhpY0JvdW5kaW5nQm94ID0gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSxcbiAgICBXTVMuRVhfR0VPR1JBUEhJQ19CT1VORElOR19CT1hfUEFSU0VSUyxcbiAgICBub2RlLCBvYmplY3RTdGFjayk7XG4gIGlmICghaXNEZWYoZ2VvZ3JhcGhpY0JvdW5kaW5nQm94KSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgd2VzdEJvdW5kTG9uZ2l0dWRlID0gLyoqIEB0eXBlIHtudW1iZXJ8dW5kZWZpbmVkfSAqL1xuICAgIChnZW9ncmFwaGljQm91bmRpbmdCb3hbJ3dlc3RCb3VuZExvbmdpdHVkZSddKTtcbiAgdmFyIHNvdXRoQm91bmRMYXRpdHVkZSA9IC8qKiBAdHlwZSB7bnVtYmVyfHVuZGVmaW5lZH0gKi9cbiAgICAoZ2VvZ3JhcGhpY0JvdW5kaW5nQm94Wydzb3V0aEJvdW5kTGF0aXR1ZGUnXSk7XG4gIHZhciBlYXN0Qm91bmRMb25naXR1ZGUgPSAvKiogQHR5cGUge251bWJlcnx1bmRlZmluZWR9ICovXG4gICAgKGdlb2dyYXBoaWNCb3VuZGluZ0JveFsnZWFzdEJvdW5kTG9uZ2l0dWRlJ10pO1xuICB2YXIgbm9ydGhCb3VuZExhdGl0dWRlID0gLyoqIEB0eXBlIHtudW1iZXJ8dW5kZWZpbmVkfSAqL1xuICAgIChnZW9ncmFwaGljQm91bmRpbmdCb3hbJ25vcnRoQm91bmRMYXRpdHVkZSddKTtcblxuICBpZiAoIWlzRGVmKHdlc3RCb3VuZExvbmdpdHVkZSkgfHwgIWlzRGVmKHNvdXRoQm91bmRMYXRpdHVkZSkgfHxcbiAgICAhaXNEZWYoZWFzdEJvdW5kTG9uZ2l0dWRlKSB8fCAhaXNEZWYobm9ydGhCb3VuZExhdGl0dWRlKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gW1xuICAgIHdlc3RCb3VuZExvbmdpdHVkZSwgc291dGhCb3VuZExhdGl0dWRlLFxuICAgIGVhc3RCb3VuZExvbmdpdHVkZSwgbm9ydGhCb3VuZExhdGl0dWRlXG4gIF07XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IENhcGFiaWxpdHkgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRDYXBhYmlsaXR5ID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5DQVBBQklMSVRZX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gU2VydmljZSBvYmplY3QuXG4gKi9cbldNUy5fcmVhZFNlcnZpY2UgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLlNFUlZJQ0VfUEFSU0VSUywgbm9kZSwgb2JqZWN0U3RhY2spO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBDb250YWN0IGluZm9ybWF0aW9uIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkQ29udGFjdEluZm9ybWF0aW9uID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5DT05UQUNUX0lORk9STUFUSU9OX1BBUlNFUlMsXG4gICAgbm9kZSwgb2JqZWN0U3RhY2spO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBDb250YWN0IHBlcnNvbiBvYmplY3QuXG4gKi9cbldNUy5fcmVhZENvbnRhY3RQZXJzb25QcmltYXJ5ID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5DT05UQUNUX1BFUlNPTl9QQVJTRVJTLFxuICAgIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gQ29udGFjdCBhZGRyZXNzIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkQ29udGFjdEFkZHJlc3MgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLkNPTlRBQ1RfQUREUkVTU19QQVJTRVJTLFxuICAgIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz58dW5kZWZpbmVkfSBGb3JtYXQgYXJyYXkuXG4gKi9cbldNUy5fcmVhZEV4Y2VwdGlvbiA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKFxuICAgIFtdLCBXTVMuRVhDRVBUSU9OX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gTGF5ZXIgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRDYXBhYmlsaXR5TGF5ZXIgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLkxBWUVSX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gTGF5ZXIgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRMYXllciA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHZhciBwYXJlbnRMYXllck9iamVjdCA9IC8qKiAgQHR5cGUge09iamVjdC48c3RyaW5nLCo+fSAqL1xuICAgIChvYmplY3RTdGFja1tvYmplY3RTdGFjay5sZW5ndGggLSAxXSk7XG5cbiAgdmFyIGxheWVyT2JqZWN0ID0gLyoqICBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsKj59ICovXG4gICAgKFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5MQVlFUl9QQVJTRVJTLFxuICAgICAgbm9kZSwgb2JqZWN0U3RhY2spKTtcblxuICBpZiAoIWlzRGVmKGxheWVyT2JqZWN0KSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgcXVlcnlhYmxlID0gWFNELnJlYWRCb29sZWFuU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdxdWVyeWFibGUnKSk7XG4gIGlmICghaXNEZWYocXVlcnlhYmxlKSkge1xuICAgIHF1ZXJ5YWJsZSA9IHBhcmVudExheWVyT2JqZWN0WydxdWVyeWFibGUnXTtcbiAgfVxuICBsYXllck9iamVjdFsncXVlcnlhYmxlJ10gPSBpc0RlZihxdWVyeWFibGUpID8gcXVlcnlhYmxlIDogZmFsc2U7XG5cbiAgdmFyIGNhc2NhZGVkID0gWFNELnJlYWROb25OZWdhdGl2ZUludGVnZXJTdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ2Nhc2NhZGVkJykpO1xuICBpZiAoIWlzRGVmKGNhc2NhZGVkKSkge1xuICAgIGNhc2NhZGVkID0gcGFyZW50TGF5ZXJPYmplY3RbJ2Nhc2NhZGVkJ107XG4gIH1cbiAgbGF5ZXJPYmplY3RbJ2Nhc2NhZGVkJ10gPSBjYXNjYWRlZDtcblxuICB2YXIgb3BhcXVlID0gWFNELnJlYWRCb29sZWFuU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdvcGFxdWUnKSk7XG4gIGlmICghaXNEZWYob3BhcXVlKSkge1xuICAgIG9wYXF1ZSA9IHBhcmVudExheWVyT2JqZWN0WydvcGFxdWUnXTtcbiAgfVxuICBsYXllck9iamVjdFsnb3BhcXVlJ10gPSBpc0RlZihvcGFxdWUpID8gb3BhcXVlIDogZmFsc2U7XG5cbiAgdmFyIG5vU3Vic2V0cyA9IFhTRC5yZWFkQm9vbGVhblN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnbm9TdWJzZXRzJykpO1xuICBpZiAoIWlzRGVmKG5vU3Vic2V0cykpIHtcbiAgICBub1N1YnNldHMgPSBwYXJlbnRMYXllck9iamVjdFsnbm9TdWJzZXRzJ107XG4gIH1cbiAgbGF5ZXJPYmplY3RbJ25vU3Vic2V0cyddID0gaXNEZWYobm9TdWJzZXRzKSA/IG5vU3Vic2V0cyA6IGZhbHNlO1xuXG4gIHZhciBmaXhlZFdpZHRoID0gWFNELnJlYWREZWNpbWFsU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdmaXhlZFdpZHRoJykpO1xuICBpZiAoIWlzRGVmKGZpeGVkV2lkdGgpKSB7XG4gICAgZml4ZWRXaWR0aCA9IHBhcmVudExheWVyT2JqZWN0WydmaXhlZFdpZHRoJ107XG4gIH1cbiAgbGF5ZXJPYmplY3RbJ2ZpeGVkV2lkdGgnXSA9IGZpeGVkV2lkdGg7XG5cbiAgdmFyIGZpeGVkSGVpZ2h0ID0gWFNELnJlYWREZWNpbWFsU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdmaXhlZEhlaWdodCcpKTtcbiAgaWYgKCFpc0RlZihmaXhlZEhlaWdodCkpIHtcbiAgICBmaXhlZEhlaWdodCA9IHBhcmVudExheWVyT2JqZWN0WydmaXhlZEhlaWdodCddO1xuICB9XG4gIGxheWVyT2JqZWN0WydmaXhlZEhlaWdodCddID0gZml4ZWRIZWlnaHQ7XG5cbiAgLy8gU2VlIDcuMi40LjhcbiAgdmFyIGFkZEtleXMgPSBbJ1N0eWxlJywgJ0NSUycsICdBdXRob3JpdHlVUkwnXTtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFkZEtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIga2V5ID0gYWRkS2V5c1tpXTtcbiAgICB2YXIgcGFyZW50VmFsdWUgPSBwYXJlbnRMYXllck9iamVjdFtrZXldO1xuICAgIGlmIChpc0RlZihwYXJlbnRWYWx1ZSkpIHtcbiAgICAgIHZhciBjaGlsZFZhbHVlID0gc2V0SWZVbmRlZmluZWQobGF5ZXJPYmplY3QsIGtleSwgW10pO1xuICAgICAgY2hpbGRWYWx1ZSA9IGNoaWxkVmFsdWUuY29uY2F0KHBhcmVudFZhbHVlKTtcbiAgICAgIGxheWVyT2JqZWN0W2tleV0gPSBjaGlsZFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHZhciByZXBsYWNlS2V5cyA9IFsnRVhfR2VvZ3JhcGhpY0JvdW5kaW5nQm94JywgJ0JvdW5kaW5nQm94JywgJ0RpbWVuc2lvbicsXG4gICAgJ0F0dHJpYnV0aW9uJywgJ01pblNjYWxlRGVub21pbmF0b3InLCAnTWF4U2NhbGVEZW5vbWluYXRvcidcbiAgXTtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcGxhY2VLZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGtleSA9IHJlcGxhY2VLZXlzW2ldO1xuICAgIHZhciBjaGlsZFZhbHVlID0gbGF5ZXJPYmplY3Rba2V5XTtcbiAgICBpZiAoIWlzRGVmKGNoaWxkVmFsdWUpKSB7XG4gICAgICB2YXIgcGFyZW50VmFsdWUgPSBwYXJlbnRMYXllck9iamVjdFtrZXldO1xuICAgICAgbGF5ZXJPYmplY3Rba2V5XSA9IHBhcmVudFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsYXllck9iamVjdDtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fSBEaW1lbnNpb24gb2JqZWN0LlxuICovXG5XTVMuX3JlYWREaW1lbnNpb24gPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICB2YXIgZGltZW5zaW9uT2JqZWN0ID0ge1xuICAgICduYW1lJzogbm9kZS5nZXRBdHRyaWJ1dGUoJ25hbWUnKSxcbiAgICAndW5pdHMnOiBub2RlLmdldEF0dHJpYnV0ZSgndW5pdHMnKSxcbiAgICAndW5pdFN5bWJvbCc6IG5vZGUuZ2V0QXR0cmlidXRlKCd1bml0U3ltYm9sJyksXG4gICAgJ2RlZmF1bHQnOiBub2RlLmdldEF0dHJpYnV0ZSgnZGVmYXVsdCcpLFxuICAgICdtdWx0aXBsZVZhbHVlcyc6IFhTRC5yZWFkQm9vbGVhblN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnbXVsdGlwbGVWYWx1ZXMnKSksXG4gICAgJ25lYXJlc3RWYWx1ZSc6IFhTRC5yZWFkQm9vbGVhblN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnbmVhcmVzdFZhbHVlJykpLFxuICAgICdjdXJyZW50JzogWFNELnJlYWRCb29sZWFuU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdjdXJyZW50JykpLFxuICAgICd2YWx1ZXMnOiBYU0QucmVhZFN0cmluZyhub2RlKVxuICB9O1xuICByZXR1cm4gZGltZW5zaW9uT2JqZWN0O1xufTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBPbmxpbmUgcmVzb3VyY2Ugb2JqZWN0LlxuICovXG5XTVMuX3JlYWRGb3JtYXRPbmxpbmVyZXNvdXJjZSA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuRk9STUFUX09OTElORVJFU09VUkNFX1BBUlNFUlMsXG4gICAgbm9kZSwgb2JqZWN0U3RhY2spO1xufTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBSZXF1ZXN0IG9iamVjdC5cbiAqL1xuV01TLl9yZWFkUmVxdWVzdCA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuUkVRVUVTVF9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IERDUCB0eXBlIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkRENQVHlwZSA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuRENQVFlQRV9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IEhUVFAgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRIVFRQID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5IVFRQX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gT3BlcmF0aW9uIHR5cGUgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRPcGVyYXRpb25UeXBlID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5PUEVSQVRJT05UWVBFX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gT25saW5lIHJlc291cmNlIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkU2l6ZWRGb3JtYXRPbmxpbmVyZXNvdXJjZSA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHZhciBmb3JtYXRPbmxpbmVyZXNvdXJjZSA9IFdNUy5fcmVhZEZvcm1hdE9ubGluZXJlc291cmNlKG5vZGUsIG9iamVjdFN0YWNrKTtcbiAgaWYgKGlzRGVmKGZvcm1hdE9ubGluZXJlc291cmNlKSkge1xuICAgIHZhciByZWFkTm9uTmVnYXRpdmVJbnRlZ2VyU3RyaW5nID0gWFNELnJlYWROb25OZWdhdGl2ZUludGVnZXJTdHJpbmc7XG4gICAgdmFyIHNpemUgPSBbXG4gICAgICByZWFkTm9uTmVnYXRpdmVJbnRlZ2VyU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCd3aWR0aCcpKSxcbiAgICAgIHJlYWROb25OZWdhdGl2ZUludGVnZXJTdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKVxuICAgIF07XG4gICAgZm9ybWF0T25saW5lcmVzb3VyY2VbJ3NpemUnXSA9IHNpemU7XG4gICAgcmV0dXJuIGZvcm1hdE9ubGluZXJlc291cmNlO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IEF1dGhvcml0eSBVUkwgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRBdXRob3JpdHlVUkwgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICB2YXIgYXV0aG9yaXR5T2JqZWN0ID0gV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2Uobm9kZSwgb2JqZWN0U3RhY2spO1xuICBpZiAoaXNEZWYoYXV0aG9yaXR5T2JqZWN0KSkge1xuICAgIGF1dGhvcml0eU9iamVjdFsnbmFtZSddID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICByZXR1cm4gYXV0aG9yaXR5T2JqZWN0O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IE1ldGFkYXRhIFVSTCBvYmplY3QuXG4gKi9cbldNUy5fcmVhZE1ldGFkYXRhVVJMID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgdmFyIG1ldGFkYXRhT2JqZWN0ID0gV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2Uobm9kZSwgb2JqZWN0U3RhY2spO1xuICBpZiAoaXNEZWYobWV0YWRhdGFPYmplY3QpKSB7XG4gICAgbWV0YWRhdGFPYmplY3RbJ3R5cGUnXSA9IG5vZGUuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgcmV0dXJuIG1ldGFkYXRhT2JqZWN0O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IFN0eWxlIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkU3R5bGUgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLlNUWUxFX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz58dW5kZWZpbmVkfSBLZXl3b3JkIGxpc3QuXG4gKi9cbldNUy5fcmVhZEtleXdvcmRMaXN0ID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3AoXG4gICAgW10sIFdNUy5LRVlXT1JETElTVF9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge0FycmF5LjxzdHJpbmc+fVxuICovXG5XTVMuTkFNRVNQQUNFX1VSSVMgPSBbXG4gIG51bGwsXG4gICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3dtcydcbl07XG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnU2VydmljZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRTZXJ2aWNlKSxcbiAgICAnQ2FwYWJpbGl0eSc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRDYXBhYmlsaXR5KVxuICB9KTtcblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5DQVBBQklMSVRZX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ1JlcXVlc3QnOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkUmVxdWVzdCksXG4gICAgJ0V4Y2VwdGlvbic6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRFeGNlcHRpb24pLFxuICAgICdMYXllcic6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRDYXBhYmlsaXR5TGF5ZXIpXG4gIH0pO1xuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLlNFUlZJQ0VfUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnTmFtZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ1RpdGxlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnQWJzdHJhY3QnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdLZXl3b3JkTGlzdCc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRLZXl3b3JkTGlzdCksXG4gICAgJ09ubGluZVJlc291cmNlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhMaW5rLnJlYWRIcmVmKSxcbiAgICAnQ29udGFjdEluZm9ybWF0aW9uJzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZENvbnRhY3RJbmZvcm1hdGlvbiksXG4gICAgJ0ZlZXMnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdBY2Nlc3NDb25zdHJhaW50cyc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0xheWVyTGltaXQnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWROb25OZWdhdGl2ZUludGVnZXIpLFxuICAgICdNYXhXaWR0aCc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZE5vbk5lZ2F0aXZlSW50ZWdlciksXG4gICAgJ01heEhlaWdodCc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZE5vbk5lZ2F0aXZlSW50ZWdlcilcbiAgfSk7XG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuQ09OVEFDVF9JTkZPUk1BVElPTl9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdDb250YWN0UGVyc29uUHJpbWFyeSc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRDb250YWN0UGVyc29uUHJpbWFyeSksXG4gICAgJ0NvbnRhY3RQb3NpdGlvbic6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0NvbnRhY3RBZGRyZXNzJzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZENvbnRhY3RBZGRyZXNzKSxcbiAgICAnQ29udGFjdFZvaWNlVGVsZXBob25lJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnQ29udGFjdEZhY3NpbWlsZVRlbGVwaG9uZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0NvbnRhY3RFbGVjdHJvbmljTWFpbEFkZHJlc3MnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpXG4gIH0pO1xuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkNPTlRBQ1RfUEVSU09OX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0NvbnRhY3RQZXJzb24nOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdDb250YWN0T3JnYW5pemF0aW9uJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkNPTlRBQ1RfQUREUkVTU19QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdBZGRyZXNzVHlwZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0FkZHJlc3MnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdDaXR5JzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnU3RhdGVPclByb3ZpbmNlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnUG9zdENvZGUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdDb3VudHJ5JzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkVYQ0VQVElPTl9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdGb3JtYXQnOiBYTUxQYXJzZXIubWFrZUFycmF5UHVzaGVyKFhTRC5yZWFkU3RyaW5nKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkxBWUVSX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ05hbWUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdUaXRsZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0Fic3RyYWN0JzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnS2V5d29yZExpc3QnOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkS2V5d29yZExpc3QpLFxuICAgICdDUlMnOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnRVhfR2VvZ3JhcGhpY0JvdW5kaW5nQm94JzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZEVYR2VvZ3JhcGhpY0JvdW5kaW5nQm94KSxcbiAgICAnQm91bmRpbmdCb3gnOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFdNUy5fcmVhZEJvdW5kaW5nQm94KSxcbiAgICAnRGltZW5zaW9uJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihXTVMuX3JlYWREaW1lbnNpb24pLFxuICAgICdBdHRyaWJ1dGlvbic6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRBdHRyaWJ1dGlvbiksXG4gICAgJ0F1dGhvcml0eVVSTCc6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoV01TLl9yZWFkQXV0aG9yaXR5VVJMKSxcbiAgICAnSWRlbnRpZmllcic6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdNZXRhZGF0YVVSTCc6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoV01TLl9yZWFkTWV0YWRhdGFVUkwpLFxuICAgICdEYXRhVVJMJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihXTVMuX3JlYWRGb3JtYXRPbmxpbmVyZXNvdXJjZSksXG4gICAgJ0ZlYXR1cmVMaXN0VVJMJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihXTVMuX3JlYWRGb3JtYXRPbmxpbmVyZXNvdXJjZSksXG4gICAgJ1N0eWxlJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihXTVMuX3JlYWRTdHlsZSksXG4gICAgJ01pblNjYWxlRGVub21pbmF0b3InOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWREZWNpbWFsKSxcbiAgICAnTWF4U2NhbGVEZW5vbWluYXRvcic6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZERlY2ltYWwpLFxuICAgICdMYXllcic6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoV01TLl9yZWFkTGF5ZXIpXG4gIH0pO1xuXG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuQVRUUklCVVRJT05fUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnVGl0bGUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdPbmxpbmVSZXNvdXJjZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYTGluay5yZWFkSHJlZiksXG4gICAgJ0xvZ29VUkwnOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkU2l6ZWRGb3JtYXRPbmxpbmVyZXNvdXJjZSlcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5FWF9HRU9HUkFQSElDX0JPVU5ESU5HX0JPWF9QQVJTRVJTID1cbiAgWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ3dlc3RCb3VuZExvbmdpdHVkZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFhTRC5yZWFkRGVjaW1hbCksXG4gICAgJ2Vhc3RCb3VuZExvbmdpdHVkZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFhTRC5yZWFkRGVjaW1hbCksXG4gICAgJ3NvdXRoQm91bmRMYXRpdHVkZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFhTRC5yZWFkRGVjaW1hbCksXG4gICAgJ25vcnRoQm91bmRMYXRpdHVkZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFhTRC5yZWFkRGVjaW1hbClcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5SRVFVRVNUX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0dldENhcGFiaWxpdGllcyc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFdNUy5fcmVhZE9wZXJhdGlvblR5cGUpLFxuICAgICdHZXRNYXAnOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBXTVMuX3JlYWRPcGVyYXRpb25UeXBlKSxcbiAgICAnR2V0RmVhdHVyZUluZm8nOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBXTVMuX3JlYWRPcGVyYXRpb25UeXBlKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLk9QRVJBVElPTlRZUEVfUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnRm9ybWF0JzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0RDUFR5cGUnOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFxuICAgICAgV01TLl9yZWFkRENQVHlwZSlcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5EQ1BUWVBFX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0hUVFAnOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBXTVMuX3JlYWRIVFRQKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkhUVFBfUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnR2V0JzogbWFrZVByb3BlcnR5U2V0dGVyKFxuICAgICAgV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2UpLFxuICAgICdQb3N0JzogbWFrZVByb3BlcnR5U2V0dGVyKFxuICAgICAgV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2UpXG4gIH0pO1xuXG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuU1RZTEVfUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnTmFtZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ1RpdGxlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnQWJzdHJhY3QnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdMZWdlbmRVUkwnOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFdNUy5fcmVhZFNpemVkRm9ybWF0T25saW5lcmVzb3VyY2UpLFxuICAgICdTdHlsZVNoZWV0VVJMJzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZEZvcm1hdE9ubGluZXJlc291cmNlKSxcbiAgICAnU3R5bGVVUkwnOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2UpXG4gIH0pO1xuXG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuRk9STUFUX09OTElORVJFU09VUkNFX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0Zvcm1hdCc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ09ubGluZVJlc291cmNlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhMaW5rLnJlYWRIcmVmKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLktFWVdPUkRMSVNUX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0tleXdvcmQnOiBYTUxQYXJzZXIubWFrZUFycmF5UHVzaGVyKFhTRC5yZWFkU3RyaW5nKVxuICB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBXTVM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbnZhciBOQU1FU1BBQ0VfVVJJID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW58dW5kZWZpbmVkfSBCb29sZWFuLlxuICAgKi9cbiAgcmVhZEhyZWY6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGVOUyhOQU1FU1BBQ0VfVVJJLCAnaHJlZicpO1xuICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc0RlZiA9IHJlcXVpcmUoJy4vdXRpbHMvaXNkZWYnKTtcbnZhciBzZXRJZlVuZGVmaW5lZCA9IHJlcXVpcmUoJy4vdXRpbHMvc2V0aWZ1bmRlZmluZWQnKTtcbnZhciBub2RlVHlwZXMgPSByZXF1aXJlKCcuL25vZGVfdHlwZXMnKTtcblxuLyoqXG4gKiBYTUwgRE9NIHBhcnNlclxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFhNTFBhcnNlcigpIHtcblxuICAvKipcbiAgICogQHR5cGUge0RPTVBhcnNlcn1cbiAgICovXG4gIHRoaXMuX3BhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbn07XG5cbi8qKlxuICogQHBhcmFtICB7U3RyaW5nfSB4bWxzdHJpbmdcbiAqIEByZXR1cm4ge0RvY3VtZW50fVxuICovXG5YTUxQYXJzZXIucHJvdG90eXBlLnRvRG9jdW1lbnQgPSBmdW5jdGlvbih4bWxzdHJpbmcpIHtcbiAgcmV0dXJuIHRoaXMuX3BhcnNlci5wYXJzZUZyb21TdHJpbmcoeG1sc3RyaW5nLCAnYXBwbGljYXRpb24veG1sJyk7XG59O1xuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGdyYWIgYWxsIHRleHQgY29udGVudCBvZiBjaGlsZCBub2RlcyBpbnRvIGEgc2luZ2xlIHN0cmluZy5cbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtib29sZWFufSBub3JtYWxpemVXaGl0ZXNwYWNlIE5vcm1hbGl6ZSB3aGl0ZXNwYWNlOiByZW1vdmUgYWxsIGxpbmVcbiAqIGJyZWFrcy5cbiAqIEByZXR1cm4ge3N0cmluZ30gQWxsIHRleHQgY29udGVudC5cbiAqIEBhcGlcbiAqL1xuWE1MUGFyc2VyLmdldEFsbFRleHRDb250ZW50ID0gZnVuY3Rpb24obm9kZSwgbm9ybWFsaXplV2hpdGVzcGFjZSkge1xuICByZXR1cm4gWE1MUGFyc2VyLmdldEFsbFRleHRDb250ZW50Xyhub2RlLCBub3JtYWxpemVXaGl0ZXNwYWNlLCBbXSkuam9pbignJyk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IG5vcm1hbGl6ZVdoaXRlc3BhY2UgTm9ybWFsaXplIHdoaXRlc3BhY2U6IHJlbW92ZSBhbGwgbGluZVxuICogYnJlYWtzLlxuICogQHBhcmFtIHtBcnJheS48U3RyaW5nfHN0cmluZz59IGFjY3VtdWxhdG9yIEFjY3VtdWxhdG9yLlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge0FycmF5LjxTdHJpbmd8c3RyaW5nPn0gQWNjdW11bGF0b3IuXG4gKi9cblhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudF8gPSBmdW5jdGlvbihub2RlLCBub3JtYWxpemVXaGl0ZXNwYWNlLCBhY2N1bXVsYXRvcikge1xuICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gbm9kZVR5cGVzLkNEQVRBX1NFQ1RJT04gfHxcbiAgICBub2RlLm5vZGVUeXBlID09PSBub2RlVHlwZXMuVEVYVCkge1xuICAgIGlmIChub3JtYWxpemVXaGl0ZXNwYWNlKSB7XG4gICAgICAvLyBGSVhNRSB1bmRlcnN0YW5kIHdoeSBnb29nLmRvbS5nZXRUZXh0Q29udGVudF8gdXNlcyBTdHJpbmcgaGVyZVxuICAgICAgYWNjdW11bGF0b3IucHVzaChTdHJpbmcobm9kZS5ub2RlVmFsdWUpLnJlcGxhY2UoLyhcXHJcXG58XFxyfFxcbikvZywgJycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjdW11bGF0b3IucHVzaChub2RlLm5vZGVWYWx1ZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBuO1xuICAgIGZvciAobiA9IG5vZGUuZmlyc3RDaGlsZDsgbjsgbiA9IG4ubmV4dFNpYmxpbmcpIHtcbiAgICAgIFhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudF8obiwgbm9ybWFsaXplV2hpdGVzcGFjZSwgYWNjdW11bGF0b3IpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYWNjdW11bGF0b3I7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59IHBhcnNlcnNOU1xuICogICAgIFBhcnNlcnMgYnkgbmFtZXNwYWNlLlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHBhcmFtIHsqPX0gYmluZCBUaGUgb2JqZWN0IHRvIHVzZSBhcyBgdGhpc2AuXG4gKi9cblhNTFBhcnNlci5wYXJzZU5vZGUgPSBmdW5jdGlvbihwYXJzZXJzTlMsIG5vZGUsIG9iamVjdFN0YWNrLCBiaW5kKSB7XG4gIGZvciAodmFyIG4gPSBYTUxQYXJzZXIuZmlyc3RFbGVtZW50Q2hpbGQobm9kZSk7IG47IG4gPSBYTUxQYXJzZXIubmV4dEVsZW1lbnRTaWJsaW5nKG4pKSB7XG4gICAgdmFyIHBhcnNlcnMgPSBwYXJzZXJzTlNbbi5uYW1lc3BhY2VVUkldO1xuICAgIGlmIChpc0RlZihwYXJzZXJzKSkge1xuICAgICAgdmFyIHBhcnNlciA9IHBhcnNlcnNbbi5sb2NhbE5hbWVdO1xuICAgICAgaWYgKGlzRGVmKHBhcnNlcikpIHtcbiAgICAgICAgcGFyc2VyLmNhbGwoYmluZCwgbiwgb2JqZWN0U3RhY2spO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBNb3N0bHkgZm9yIG5vZGUuanNcbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cblhNTFBhcnNlci5maXJzdEVsZW1lbnRDaGlsZCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgdmFyIGZpcnN0RWxlbWVudENoaWxkID0gbm9kZS5maXJzdEVsZW1lbnRDaGlsZCB8fCBub2RlLmZpcnN0Q2hpbGQ7XG4gIHdoaWxlIChmaXJzdEVsZW1lbnRDaGlsZC5ub2RlVHlwZSAhPT0gbm9kZVR5cGVzLkVMRU1FTlQpIHtcbiAgICBmaXJzdEVsZW1lbnRDaGlsZCA9IGZpcnN0RWxlbWVudENoaWxkLm5leHRTaWJsaW5nO1xuICB9XG4gIHJldHVybiBmaXJzdEVsZW1lbnRDaGlsZDtcbn07XG5cbi8qKlxuICogTW9zdGx5IGZvciBub2RlLmpzXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5YTUxQYXJzZXIubmV4dEVsZW1lbnRTaWJsaW5nID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgbmV4dEVsZW1lbnRTaWJsaW5nID0gbm9kZS5uZXh0RWxlbWVudFNpYmxpbmcgfHwgbm9kZS5uZXh0U2libGluZztcbiAgd2hpbGUgKG5leHRFbGVtZW50U2libGluZyAmJiBuZXh0RWxlbWVudFNpYmxpbmcubm9kZVR5cGUgIT09IG5vZGVUeXBlcy5FTEVNRU5UKSB7XG4gICAgbmV4dEVsZW1lbnRTaWJsaW5nID0gbmV4dEVsZW1lbnRTaWJsaW5nLm5leHRTaWJsaW5nO1xuICB9XG4gIHJldHVybiBuZXh0RWxlbWVudFNpYmxpbmc7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IG5hbWVzcGFjZVVSSXMgTmFtZXNwYWNlIFVSSXMuXG4gKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPn0gcGFyc2VycyBQYXJzZXJzLlxuICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pj19IG9wdF9wYXJzZXJzTlNcbiAqICAgICBQYXJzZXJzTlMuXG4gKiBAcmV0dXJuIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn0gUGFyc2VycyBOUy5cbiAqL1xuWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMgPSBmdW5jdGlvbihuYW1lc3BhY2VVUklzLCBwYXJzZXJzLCBvcHRfcGFyc2Vyc05TKSB7XG4gIHJldHVybiAvKiogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fSAqLyAoXG4gICAgWE1MUGFyc2VyLm1ha2VTdHJ1Y3R1cmVOUyhuYW1lc3BhY2VVUklzLCBwYXJzZXJzLCBvcHRfcGFyc2Vyc05TKSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuYW1lc3BhY2VkIHN0cnVjdHVyZSwgdXNpbmcgdGhlIHNhbWUgdmFsdWVzIGZvciBlYWNoIG5hbWVzcGFjZS5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgYXMgYSBzdGFydGluZyBwb2ludCBmb3IgdmVyc2lvbmVkIHBhcnNlcnMsIHdoZW4gb25seSBhIGZld1xuICogdmFsdWVzIGFyZSB2ZXJzaW9uIHNwZWNpZmljLlxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gbmFtZXNwYWNlVVJJcyBOYW1lc3BhY2UgVVJJcy5cbiAqIEBwYXJhbSB7VH0gc3RydWN0dXJlIFN0cnVjdHVyZS5cbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIFQ+PX0gb3B0X3N0cnVjdHVyZU5TIE5hbWVzcGFjZWQgc3RydWN0dXJlIHRvIGFkZCB0by5cbiAqIEByZXR1cm4ge09iamVjdC48c3RyaW5nLCBUPn0gTmFtZXNwYWNlZCBzdHJ1Y3R1cmUuXG4gKiBAdGVtcGxhdGUgVFxuICovXG5YTUxQYXJzZXIubWFrZVN0cnVjdHVyZU5TID0gZnVuY3Rpb24obmFtZXNwYWNlVVJJcywgc3RydWN0dXJlLCBvcHRfc3RydWN0dXJlTlMpIHtcbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgKj59XG4gICAqL1xuICB2YXIgc3RydWN0dXJlTlMgPSBpc0RlZihvcHRfc3RydWN0dXJlTlMpID8gb3B0X3N0cnVjdHVyZU5TIDoge307XG4gIHZhciBpLCBpaTtcbiAgZm9yIChpID0gMCwgaWkgPSBuYW1lc3BhY2VVUklzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICBzdHJ1Y3R1cmVOU1tuYW1lc3BhY2VVUklzW2ldXSA9IHN0cnVjdHVyZTtcbiAgfVxuICByZXR1cm4gc3RydWN0dXJlTlM7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odGhpczogVCwgTm9kZSwgQXJyYXkuPCo+KTogKn0gdmFsdWVSZWFkZXIgVmFsdWUgcmVhZGVyLlxuICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfcHJvcGVydHkgUHJvcGVydHkuXG4gKiBAcGFyYW0ge1Q9fSBvcHRfdGhpcyBUaGUgb2JqZWN0IHRvIHVzZSBhcyBgdGhpc2AgaW4gYHZhbHVlUmVhZGVyYC5cbiAqIEByZXR1cm4ge1hNTFBhcnNlci5QYXJzZXJ9IFBhcnNlci5cbiAqIEB0ZW1wbGF0ZSBUXG4gKi9cblhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlTZXR0ZXIgPSBmdW5jdGlvbih2YWx1ZVJlYWRlciwgb3B0X3Byb3BlcnR5LCBvcHRfdGhpcykge1xuICByZXR1cm4gKFxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICAgICAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gICAgICovXG4gICAgZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgICAgIHZhciB2YWx1ZSA9IHZhbHVlUmVhZGVyLmNhbGwoaXNEZWYob3B0X3RoaXMpID8gb3B0X3RoaXMgOiB0aGlzLFxuICAgICAgICBub2RlLCBvYmplY3RTdGFjayk7XG4gICAgICBpZiAoaXNEZWYodmFsdWUpKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSAvKiogQHR5cGUge09iamVjdH0gKi8gKG9iamVjdFN0YWNrW29iamVjdFN0YWNrLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gaXNEZWYob3B0X3Byb3BlcnR5KSA/IG9wdF9wcm9wZXJ0eSA6IG5vZGUubG9jYWxOYW1lO1xuICAgICAgICBvYmplY3RbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odGhpczogVCwgTm9kZSwgQXJyYXkuPCo+KTogKn0gdmFsdWVSZWFkZXIgVmFsdWUgcmVhZGVyLlxuICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfcHJvcGVydHkgUHJvcGVydHkuXG4gKiBAcGFyYW0ge1Q9fSBvcHRfdGhpcyBUaGUgb2JqZWN0IHRvIHVzZSBhcyBgdGhpc2AgaW4gYHZhbHVlUmVhZGVyYC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBQYXJzZXIuXG4gKiBAdGVtcGxhdGUgVFxuICovXG5YTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyID0gZnVuY3Rpb24odmFsdWVSZWFkZXIsIG9wdF9wcm9wZXJ0eSwgb3B0X3RoaXMpIHtcbiAgcmV0dXJuIChcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gICAgICB2YXIgdmFsdWUgPSB2YWx1ZVJlYWRlci5jYWxsKGlzRGVmKG9wdF90aGlzKSA/IG9wdF90aGlzIDogdGhpcyxcbiAgICAgICAgbm9kZSwgb2JqZWN0U3RhY2spO1xuXG4gICAgICBpZiAoaXNEZWYodmFsdWUpKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSAvKiogQHR5cGUge09iamVjdH0gKi8gKG9iamVjdFN0YWNrW29iamVjdFN0YWNrLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gaXNEZWYob3B0X3Byb3BlcnR5KSA/IG9wdF9wcm9wZXJ0eSA6IG5vZGUubG9jYWxOYW1lO1xuICAgICAgICB2YXIgYXJyYXkgPSBzZXRJZlVuZGVmaW5lZChvYmplY3QsIHByb3BlcnR5LCBbXSk7XG4gICAgICAgIGFycmF5LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHRoaXM6IFQsIE5vZGUsIEFycmF5LjwqPik6ICp9IHZhbHVlUmVhZGVyIFZhbHVlIHJlYWRlci5cbiAqIEBwYXJhbSB7VD19IG9wdF90aGlzIFRoZSBvYmplY3QgdG8gdXNlIGFzIGB0aGlzYCBpbiBgdmFsdWVSZWFkZXJgLlxuICogQHJldHVybiB7RnVuY3Rpb259IFBhcnNlci5cbiAqIEB0ZW1wbGF0ZSBUXG4gKi9cblhNTFBhcnNlci5tYWtlQXJyYXlQdXNoZXIgPSBmdW5jdGlvbih2YWx1ZVJlYWRlciwgb3B0X3RoaXMpIHtcbiAgcmV0dXJuIChcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gICAgICB2YXIgdmFsdWUgPSB2YWx1ZVJlYWRlci5jYWxsKGlzRGVmKG9wdF90aGlzKSA/IG9wdF90aGlzIDogdGhpcyxcbiAgICAgICAgbm9kZSwgb2JqZWN0U3RhY2spO1xuICAgICAgaWYgKGlzRGVmKHZhbHVlKSkge1xuICAgICAgICB2YXIgYXJyYXkgPSBvYmplY3RTdGFja1tvYmplY3RTdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgYXJyYXkucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgT2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3QuPFN0cmluZywgT2JqZWN0LjxTdHJpbmcsIEZ1bmN0aW9uPj59IHBhcnNlcnNOUyBQYXJzZXJzIGJ5IG5hbWVzcGFjZS5cbiAqIEBwYXJhbSB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHBhcmFtIHsqPX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQgVGhlIG9iamVjdCB0byB1c2UgYXMgYHRoaXNgLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gT2JqZWN0LlxuICovXG5YTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wID0gZnVuY3Rpb24ob2JqZWN0LCBwYXJzZXJzTlMsIG5vZGUsIG9iamVjdFN0YWNrLCBiaW5kKSB7XG4gIG9iamVjdFN0YWNrLnB1c2gob2JqZWN0KTtcbiAgWE1MUGFyc2VyLnBhcnNlTm9kZShwYXJzZXJzTlMsIG5vZGUsIG9iamVjdFN0YWNrLCBiaW5kKTtcbiAgcmV0dXJuIG9iamVjdFN0YWNrLnBvcCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBYTUxQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGlzRGVmID0gcmVxdWlyZSgnLi91dGlscy9pc2RlZicpO1xudmFyIHN0cmluZyA9IHJlcXVpcmUoJy4vdXRpbHMvc3RyaW5nJyk7XG52YXIgWE1MUGFyc2VyID0gcmVxdWlyZSgnLi94bWxfcGFyc2VyJyk7XG5cbnZhciBYU0QgPSB7fTtcblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cblhTRC5OQU1FU1BBQ0VfVVJJID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJztcblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEByZXR1cm4ge2Jvb2xlYW58dW5kZWZpbmVkfSBCb29sZWFuLlxuICovXG5YU0QucmVhZEJvb2xlYW4gPSBmdW5jdGlvbihub2RlKSB7XG4gIHZhciBzID0gWE1MUGFyc2VyLmdldEFsbFRleHRDb250ZW50KG5vZGUsIGZhbHNlKTtcbiAgcmV0dXJuIFhTRC5yZWFkQm9vbGVhblN0cmluZyhzKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTdHJpbmcuXG4gKiBAcmV0dXJuIHtib29sZWFufHVuZGVmaW5lZH0gQm9vbGVhbi5cbiAqL1xuWFNELnJlYWRCb29sZWFuU3RyaW5nID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHZhciBtID0gL15cXHMqKHRydWV8MSl8KGZhbHNlfDApXFxzKiQvLmV4ZWMoc3RyaW5nKTtcbiAgaWYgKG0pIHtcbiAgICByZXR1cm4gaXNEZWYobVsxXSkgfHwgZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHJldHVybiB7bnVtYmVyfHVuZGVmaW5lZH0gRGF0ZVRpbWUgaW4gc2Vjb25kcy5cbiAqL1xuWFNELnJlYWREYXRlVGltZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgdmFyIHMgPSBYTUxQYXJzZXIuZ2V0QWxsVGV4dENvbnRlbnQobm9kZSwgZmFsc2UpO1xuICB2YXIgcmUgPSAvXlxccyooXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KShafCg/OihbK1xcLV0pKFxcZHsyfSkoPzo6KFxcZHsyfSkpPykpXFxzKiQvO1xuICB2YXIgbSA9IHJlLmV4ZWMocyk7XG4gIGlmIChtKSB7XG4gICAgdmFyIHllYXIgPSBwYXJzZUludChtWzFdLCAxMCk7XG4gICAgdmFyIG1vbnRoID0gcGFyc2VJbnQobVsyXSwgMTApIC0gMTtcbiAgICB2YXIgZGF5ID0gcGFyc2VJbnQobVszXSwgMTApO1xuICAgIHZhciBob3VyID0gcGFyc2VJbnQobVs0XSwgMTApO1xuICAgIHZhciBtaW51dGUgPSBwYXJzZUludChtWzVdLCAxMCk7XG4gICAgdmFyIHNlY29uZCA9IHBhcnNlSW50KG1bNl0sIDEwKTtcbiAgICB2YXIgZGF0ZVRpbWUgPSBEYXRlLlVUQyh5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCkgLyAxMDAwO1xuICAgIGlmIChtWzddICE9ICdaJykge1xuICAgICAgdmFyIHNpZ24gPSBtWzhdID09ICctJyA/IC0xIDogMTtcbiAgICAgIGRhdGVUaW1lICs9IHNpZ24gKiA2MCAqIHBhcnNlSW50KG1bOV0sIDEwKTtcbiAgICAgIGlmIChpc0RlZihtWzEwXSkpIHtcbiAgICAgICAgZGF0ZVRpbWUgKz0gc2lnbiAqIDYwICogNjAgKiBwYXJzZUludChtWzEwXSwgMTApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0ZVRpbWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHJldHVybiB7bnVtYmVyfHVuZGVmaW5lZH0gRGVjaW1hbC5cbiAqL1xuWFNELnJlYWREZWNpbWFsID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgcyA9IFhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudChub2RlLCBmYWxzZSk7XG4gIHJldHVybiBYU0QucmVhZERlY2ltYWxTdHJpbmcocyk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTdHJpbmcuXG4gKiBAcmV0dXJuIHtudW1iZXJ8dW5kZWZpbmVkfSBEZWNpbWFsLlxuICovXG5YU0QucmVhZERlY2ltYWxTdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgLy8gRklYTUUgY2hlY2sgc3BlY1xuICB2YXIgbSA9IC9eXFxzKihbK1xcLV0/XFxkKlxcLj9cXGQrKD86ZVsrXFwtXT9cXGQrKT8pXFxzKiQvaS5leGVjKHN0cmluZyk7XG4gIGlmIChtKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQobVsxXSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHJldHVybiB7bnVtYmVyfHVuZGVmaW5lZH0gTm9uIG5lZ2F0aXZlIGludGVnZXIuXG4gKi9cblhTRC5yZWFkTm9uTmVnYXRpdmVJbnRlZ2VyID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgcyA9IFhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudChub2RlLCBmYWxzZSk7XG4gIHJldHVybiBYU0QucmVhZE5vbk5lZ2F0aXZlSW50ZWdlclN0cmluZyhzKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFN0cmluZy5cbiAqIEByZXR1cm4ge251bWJlcnx1bmRlZmluZWR9IE5vbiBuZWdhdGl2ZSBpbnRlZ2VyLlxuICovXG5YU0QucmVhZE5vbk5lZ2F0aXZlSW50ZWdlclN0cmluZyA9IGZ1bmN0aW9uKHN0cmluZykge1xuICB2YXIgbSA9IC9eXFxzKihcXGQrKVxccyokLy5leGVjKHN0cmluZyk7XG4gIGlmIChtKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KG1bMV0sIDEwKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcmV0dXJuIHtzdHJpbmd8dW5kZWZpbmVkfSBTdHJpbmcuXG4gKi9cblhTRC5yZWFkU3RyaW5nID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgcyA9IFhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudChub2RlLCBmYWxzZSk7XG4gIHJldHVybiBzdHJpbmcudHJpbShzKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZSB0byBhcHBlbmQgYSBUZXh0Tm9kZSB3aXRoIHRoZSBib29sZWFuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBib29sIEJvb2xlYW4uXG4gKi9cblhTRC53cml0ZUJvb2xlYW5UZXh0Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIGJvb2wpIHtcbiAgWFNELndyaXRlU3RyaW5nVGV4dE5vZGUobm9kZSwgKGJvb2wpID8gJzEnIDogJzAnKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZSB0byBhcHBlbmQgYSBUZXh0Tm9kZSB3aXRoIHRoZSBkYXRlVGltZSB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlVGltZSBEYXRlVGltZSBpbiBzZWNvbmRzLlxuICovXG5YU0Qud3JpdGVEYXRlVGltZVRleHROb2RlID0gZnVuY3Rpb24obm9kZSwgZGF0ZVRpbWUpIHtcbiAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRlVGltZSAqIDEwMDApO1xuICB2YXIgc3RyaW5nID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpICsgJy0nICtcbiAgICBzdHJpbmcucGFkTnVtYmVyKGRhdGUuZ2V0VVRDTW9udGgoKSArIDEsIDIpICsgJy0nICtcbiAgICBzdHJpbmcucGFkTnVtYmVyKGRhdGUuZ2V0VVRDRGF0ZSgpLCAyKSArICdUJyArXG4gICAgc3RyaW5nLnBhZE51bWJlcihkYXRlLmdldFVUQ0hvdXJzKCksIDIpICsgJzonICtcbiAgICBzdHJpbmcucGFkTnVtYmVyKGRhdGUuZ2V0VVRDTWludXRlcygpLCAyKSArICc6JyArXG4gICAgc3RyaW5nLnBhZE51bWJlcihkYXRlLmdldFVUQ1NlY29uZHMoKSwgMikgKyAnWic7XG4gIG5vZGUuYXBwZW5kQ2hpbGQoWE1MUGFyc2VyLkRPQ1VNRU5ULmNyZWF0ZVRleHROb2RlKHN0cmluZykpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlIHRvIGFwcGVuZCBhIFRleHROb2RlIHdpdGggdGhlIGRlY2ltYWwgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gZGVjaW1hbCBEZWNpbWFsLlxuICovXG5YU0Qud3JpdGVEZWNpbWFsVGV4dE5vZGUgPSBmdW5jdGlvbihub2RlLCBkZWNpbWFsKSB7XG4gIHZhciBzdHJpbmcgPSBkZWNpbWFsLnRvUHJlY2lzaW9uKCk7XG4gIG5vZGUuYXBwZW5kQ2hpbGQoWE1MUGFyc2VyLkRPQ1VNRU5ULmNyZWF0ZVRleHROb2RlKHN0cmluZykpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlIHRvIGFwcGVuZCBhIFRleHROb2RlIHdpdGggdGhlIGRlY2ltYWwgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gbm9uTmVnYXRpdmVJbnRlZ2VyIE5vbiBuZWdhdGl2ZSBpbnRlZ2VyLlxuICovXG5YU0Qud3JpdGVOb25OZWdhdGl2ZUludGVnZXJUZXh0Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIG5vbk5lZ2F0aXZlSW50ZWdlcikge1xuICB2YXIgc3RyaW5nID0gbm9uTmVnYXRpdmVJbnRlZ2VyLnRvU3RyaW5nKCk7XG4gIG5vZGUuYXBwZW5kQ2hpbGQoWE1MUGFyc2VyLkRPQ1VNRU5ULmNyZWF0ZVRleHROb2RlKHN0cmluZykpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlIHRvIGFwcGVuZCBhIFRleHROb2RlIHdpdGggdGhlIHN0cmluZyB0by5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgU3RyaW5nLlxuICovXG5YU0Qud3JpdGVTdHJpbmdUZXh0Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHN0cmluZykge1xuICBub2RlLmFwcGVuZENoaWxkKFhNTFBhcnNlci5ET0NVTUVOVC5jcmVhdGVUZXh0Tm9kZShzdHJpbmcpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWFNEO1xuIl19
