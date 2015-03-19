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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9qcy9hcHAuanMiLCJleGFtcGxlL2pzL2pzb24tZm9ybWF0LmpzIiwiZXhhbXBsZS9qcy94bWwtZm9ybWF0LmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwibm9kZV9tb2R1bGVzL3NwaW4uanMvc3Bpbi5qcyIsInNyYy9ub2RlX3R5cGVzLmpzIiwic3JjL3V0aWxzL2lzZGVmLmpzIiwic3JjL3V0aWxzL3NldGlmdW5kZWZpbmVkLmpzIiwic3JjL3V0aWxzL3N0cmluZy5qcyIsInNyYy93bXMuanMiLCJzcmMveGxpbmsuanMiLCJzcmMveG1sX3BhcnNlci5qcyIsInNyYy94c2QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdm1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsdUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBqc29uRm9ybWF0ID0gZ2xvYmFsLmpzb25Gb3JtYXQgPSByZXF1aXJlKCcuL2pzb24tZm9ybWF0Jyk7XG52YXIgeG1sRm9ybWF0ID0gZ2xvYmFsLnhtbEZvcm1hdCA9IHJlcXVpcmUoJy4veG1sLWZvcm1hdCcpO1xudmFyIFdNU0NhcGFiaWxpdGllcyA9IGdsb2JhbC5XTVNDYXBhYmlsaXRpZXMgfHwgcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcbnZhciBTcGlubmVyID0gcmVxdWlyZSgnc3Bpbi5qcycpO1xudmFyIHJlcXdlc3QgPSBnbG9iYWwucmVxd2VzdCA9IHJlcXVpcmUoJ3JlcXdlc3QnKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbnZhciBzZXJ2aWNlU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlcnZpY2UnKTtcbnZhciB4bWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneG1sJyk7XG52YXIganNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqc29uJyk7XG52YXIgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtYXJlYScpO1xuXG4vLyB0aGUgb25seSBvcGVuIENPUlMgcHJveHkgSSBjb3VsZCBmaW5kXG52YXIgcHJveHkgPSBcImh0dHBzOi8vcXVlcnkueWFob29hcGlzLmNvbS92MS9wdWJsaWMveXFsXCI7XG52YXIgcGFyc2VyID0gbmV3IFdNU0NhcGFiaWxpdGllcygpO1xuXG5mdW5jdGlvbiBzaG93SW5wdXQoKSB7XG4gIHhtbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG59XG5cbmZ1bmN0aW9uIGhpZGVJbnB1dCgpIHtcbiAgeG1sLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgaW5wdXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbn1cblxuZnVuY3Rpb24gdXBkYXRlKHhtbFN0cmluZykge1xuICB4bWwudGV4dENvbnRlbnQgPSB4bWxGb3JtYXQoeG1sU3RyaW5nKTtcbiAgUHJpc20uaGlnaGxpZ2h0RWxlbWVudCh4bWwpO1xuXG4gIGpzb24udGV4dENvbnRlbnQgPSBqc29uRm9ybWF0KEpTT04uc3RyaW5naWZ5KHBhcnNlci5wYXJzZSh4bWxTdHJpbmcpKSk7XG4gIFByaXNtLmhpZ2hsaWdodEVsZW1lbnQoanNvbik7XG59XG5cbnNlcnZpY2VTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gIGlmIChzZXJ2aWNlU2VsZWN0LnZhbHVlICE9PSAnJykge1xuICAgIGhpZGVJbnB1dCgpO1xuXG4gICAgcmVxd2VzdCh7XG4gICAgICB1cmw6IHByb3h5LFxuICAgICAgZGF0YToge1xuICAgICAgICBxOiAnc2VsZWN0ICogZnJvbSB4bWwgd2hlcmUgdXJsPVwiJyArXG4gICAgICAgICAgc2VydmljZVNlbGVjdC52YWx1ZS5yZXBsYWNlKC9cXCZhbXBcXDsvZywgJyYnKSArICdcIidcbiAgICAgIH0sXG4gICAgICB0eXBlOiBcInhtbFwiLFxuICAgICAgY3Jvc3NPcmlnaW46IHRydWUsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbih4bWwpIHtcbiAgICAgICAgdXBkYXRlKHhtbC5maXJzdENoaWxkLmZpcnN0Q2hpbGQuaW5uZXJIVE1MKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSwgZmFsc2UpO1xuXG54bWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaG93SW5wdXQsIGZhbHNlKTtcblxuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCBmdW5jdGlvbigpIHtcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICB1cGRhdGUoaW5wdXQudmFsdWUpO1xuICAgIGhpZGVJbnB1dCgpO1xuICB9LCA1MCk7XG59LCBmYWxzZSk7XG4iLCIvKlxuICAgIGpzb24tZm9ybWF0IHYuMS4xXG4gICAgaHR0cDovL2dpdGh1Yi5jb20vcGhvYm9zbGFiL2pzb24tZm9ybWF0XG5cbiAgICBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZTpcbiAgICBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuKi9cblxudmFyIHAgPSBbXSxcbiAgcHVzaCA9IGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgcC5wdXNoKG0pICsgJ1xcXFwnO1xuICB9LFxuICBwb3AgPSBmdW5jdGlvbihtLCBpKSB7XG4gICAgcmV0dXJuIHBbaSAtIDFdXG4gIH0sXG4gIHRhYnMgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIHJldHVybiBuZXcgQXJyYXkoY291bnQgKyAxKS5qb2luKCdcXHQnKTtcbiAgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihqc29uKSB7XG4gIHAgPSBbXTtcbiAgdmFyIG91dCA9IFwiXCIsXG4gICAgaW5kZW50ID0gMDtcblxuICAvLyBFeHRyYWN0IGJhY2tzbGFzaGVzIGFuZCBzdHJpbmdzXG4gIGpzb24gPSBqc29uXG4gICAgLnJlcGxhY2UoL1xcXFwuL2csIHB1c2gpXG4gICAgLnJlcGxhY2UoLyhcIi4qP1wifCcuKj8nKS9nLCBwdXNoKVxuICAgIC5yZXBsYWNlKC9cXHMrLywgJycpO1xuXG4gIC8vIEluZGVudCBhbmQgaW5zZXJ0IG5ld2xpbmVzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwganNvbi5sZW5ndGg7IGkrKykge1xuICAgIHZhciBjID0ganNvbi5jaGFyQXQoaSk7XG5cbiAgICBzd2l0Y2ggKGMpIHtcbiAgICAgIGNhc2UgJ3snOlxuICAgICAgICBvdXQgKz0gYyArIFwiXFxuXCIgKyB0YWJzKCsraW5kZW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdbJzpcbiAgICAgICAgb3V0ICs9IGMgKyBcIlxcblwiICsgdGFicygrK2luZGVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnXSc6XG4gICAgICAgIG91dCArPSBcIlxcblwiICsgdGFicygtLWluZGVudCkgKyBjO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ30nOlxuICAgICAgICBvdXQgKz0gXCJcXG5cIiArIHRhYnMoLS1pbmRlbnQpICsgYztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICcsJzpcbiAgICAgICAgaWYgKC9cXGQvLnRlc3QoanNvbi5jaGFyQXQoaSAtIDEpKSkge1xuICAgICAgICAgIG91dCArPSBcIiwgXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ICs9IFwiLFxcblwiICsgdGFicyhpbmRlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnOic6XG4gICAgICAgIG91dCArPSBcIjogXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgb3V0ICs9IGM7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN0cmlwIHdoaXRlc3BhY2UgZnJvbSBudW1lcmljIGFycmF5cyBhbmQgcHV0IGJhY2tzbGFzaGVzXG4gIC8vIGFuZCBzdHJpbmdzIGJhY2sgaW5cbiAgb3V0ID0gb3V0XG4gICAgLnJlcGxhY2UoL1xcW1tcXGQsXFxzXSs/XFxdL2csIGZ1bmN0aW9uKG0pIHtcbiAgICAgIHJldHVybiBtLnJlcGxhY2UoL1xccy9nLCAnJyk7XG4gICAgfSlcbiAgICAvLyBudW1iZXIgYXJyYXlzXG4gICAgLnJlcGxhY2UoL1xcW1xccyooXFxkKS9nLCBmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gJ1snICsgYjtcbiAgICB9KVxuICAgIC5yZXBsYWNlKC8oXFxkKVxccypcXF0vZywgZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGIgKyAnXSc7XG4gICAgfSlcbiAgICAucmVwbGFjZSgvXFx7XFxzKlxcfS9nLCAne30nKSAvLyBlbXB0eSBvYmplY3RzXG4gICAgLnJlcGxhY2UoL1xcXFwoXFxkKylcXFxcL2csIHBvcCkgLy8gc3RyaW5nc1xuICAgIC5yZXBsYWNlKC9cXFxcKFxcZCspXFxcXC9nLCBwb3ApOyAvLyBiYWNrc2xhc2hlcyBpbiBzdHJpbmdzXG5cbiAgcmV0dXJuIG91dDtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih4bWwpIHtcbiAgdmFyIGZvcm1hdHRlZCA9ICcnO1xuICB2YXIgcmVnID0gLyg+KSg8KShcXC8qKS9nO1xuICB4bWwgPSB4bWwucmVwbGFjZShyZWcsICckMVxcclxcbiQyJDMnKTtcbiAgdmFyIHBhZCA9IDA7XG5cbiAgeG1sLnNwbGl0KCdcXHJcXG4nKS5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUsIGluZGV4KSB7XG4gICAgdmFyIGluZGVudCA9IDA7XG4gICAgaWYgKG5vZGUubWF0Y2goLy4rPFxcL1xcd1tePl0qPiQvKSkge1xuICAgICAgaW5kZW50ID0gMDtcbiAgICB9IGVsc2UgaWYgKG5vZGUubWF0Y2goL148XFwvXFx3LykpIHtcbiAgICAgIGlmIChwYWQgIT0gMCkge1xuICAgICAgICBwYWQgLT0gMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUubWF0Y2goL148XFx3W14+XSpbXlxcL10+LiokLykpIHtcbiAgICAgIGluZGVudCA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGVudCA9IDA7XG4gICAgfVxuXG4gICAgdmFyIHBhZGRpbmcgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZDsgaSsrKSB7XG4gICAgICBwYWRkaW5nICs9ICcgICc7XG4gICAgfVxuXG4gICAgZm9ybWF0dGVkICs9IHBhZGRpbmcgKyBub2RlICsgJ1xcclxcbic7XG4gICAgcGFkICs9IGluZGVudDtcbiAgfSk7XG5cbiAgcmV0dXJuIGZvcm1hdHRlZDtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy93bXMnKTtcbiIsIi8qIVxuICAqIFJlcXdlc3QhIEEgZ2VuZXJhbCBwdXJwb3NlIFhIUiBjb25uZWN0aW9uIG1hbmFnZXJcbiAgKiBsaWNlbnNlIE1JVCAoYykgRHVzdGluIERpYXogMjAxNFxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvcmVxd2VzdFxuICAqL1xuXG4hZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KCdyZXF3ZXN0JywgdGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciB3aW4gPSB3aW5kb3dcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCBodHRwc1JlID0gL15odHRwL1xuICAgICwgcHJvdG9jb2xSZSA9IC8oXlxcdyspOlxcL1xcLy9cbiAgICAsIHR3b0h1bmRvID0gL14oMjBcXGR8MTIyMykkLyAvL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICAgICwgYnlUYWcgPSAnZ2V0RWxlbWVudHNCeVRhZ05hbWUnXG4gICAgLCByZWFkeVN0YXRlID0gJ3JlYWR5U3RhdGUnXG4gICAgLCBjb250ZW50VHlwZSA9ICdDb250ZW50LVR5cGUnXG4gICAgLCByZXF1ZXN0ZWRXaXRoID0gJ1gtUmVxdWVzdGVkLVdpdGgnXG4gICAgLCBoZWFkID0gZG9jW2J5VGFnXSgnaGVhZCcpWzBdXG4gICAgLCB1bmlxaWQgPSAwXG4gICAgLCBjYWxsYmFja1ByZWZpeCA9ICdyZXF3ZXN0XycgKyAoK25ldyBEYXRlKCkpXG4gICAgLCBsYXN0VmFsdWUgLy8gZGF0YSBzdG9yZWQgYnkgdGhlIG1vc3QgcmVjZW50IEpTT05QIGNhbGxiYWNrXG4gICAgLCB4bWxIdHRwUmVxdWVzdCA9ICdYTUxIdHRwUmVxdWVzdCdcbiAgICAsIHhEb21haW5SZXF1ZXN0ID0gJ1hEb21haW5SZXF1ZXN0J1xuICAgICwgbm9vcCA9IGZ1bmN0aW9uICgpIHt9XG5cbiAgICAsIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PSAnZnVuY3Rpb24nXG4gICAgICAgID8gQXJyYXkuaXNBcnJheVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gYSBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgICAgfVxuXG4gICAgLCBkZWZhdWx0SGVhZGVycyA9IHtcbiAgICAgICAgICAnY29udGVudFR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAsICdyZXF1ZXN0ZWRXaXRoJzogeG1sSHR0cFJlcXVlc3RcbiAgICAgICAgLCAnYWNjZXB0Jzoge1xuICAgICAgICAgICAgICAnKic6ICAndGV4dC9qYXZhc2NyaXB0LCB0ZXh0L2h0bWwsIGFwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwsICovKidcbiAgICAgICAgICAgICwgJ3htbCc6ICAnYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCdcbiAgICAgICAgICAgICwgJ2h0bWwnOiAndGV4dC9odG1sJ1xuICAgICAgICAgICAgLCAndGV4dCc6ICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgLCAnanNvbic6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQnXG4gICAgICAgICAgICAsICdqcyc6ICAgJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQsIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAsIHhociA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgLy8gaXMgaXQgeC1kb21haW5cbiAgICAgICAgaWYgKG9bJ2Nyb3NzT3JpZ2luJ10gPT09IHRydWUpIHtcbiAgICAgICAgICB2YXIgeGhyID0gd2luW3htbEh0dHBSZXF1ZXN0XSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbnVsbFxuICAgICAgICAgIGlmICh4aHIgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgICAgICAgICByZXR1cm4geGhyXG4gICAgICAgICAgfSBlbHNlIGlmICh3aW5beERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0KClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCcm93c2VyIGRvZXMgbm90IHN1cHBvcnQgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzJylcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAod2luW3htbEh0dHBSZXF1ZXN0XSkge1xuICAgICAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgLCBnbG9iYWxTZXR1cE9wdGlvbnMgPSB7XG4gICAgICAgIGRhdGFGaWx0ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgfVxuICAgICAgfVxuXG4gIGZ1bmN0aW9uIHN1Y2NlZWQocikge1xuICAgIHZhciBwcm90b2NvbCA9IHByb3RvY29sUmUuZXhlYyhyLnVybCk7XG4gICAgcHJvdG9jb2wgPSAocHJvdG9jb2wgJiYgcHJvdG9jb2xbMV0pIHx8IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcbiAgICByZXR1cm4gaHR0cHNSZS50ZXN0KHByb3RvY29sKSA/IHR3b0h1bmRvLnRlc3Qoci5yZXF1ZXN0LnN0YXR1cykgOiAhIXIucmVxdWVzdC5yZXNwb25zZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlYWR5U3RhdGUociwgc3VjY2VzcywgZXJyb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdXNlIF9hYm9ydGVkIHRvIG1pdGlnYXRlIGFnYWluc3QgSUUgZXJyIGMwMGMwMjNmXG4gICAgICAvLyAoY2FuJ3QgcmVhZCBwcm9wcyBvbiBhYm9ydGVkIHJlcXVlc3Qgb2JqZWN0cylcbiAgICAgIGlmIChyLl9hYm9ydGVkKSByZXR1cm4gZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgaWYgKHIuX3RpbWVkT3V0KSByZXR1cm4gZXJyb3Ioci5yZXF1ZXN0LCAnUmVxdWVzdCBpcyBhYm9ydGVkOiB0aW1lb3V0JylcbiAgICAgIGlmIChyLnJlcXVlc3QgJiYgci5yZXF1ZXN0W3JlYWR5U3RhdGVdID09IDQpIHtcbiAgICAgICAgci5yZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG5vb3BcbiAgICAgICAgaWYgKHN1Y2NlZWQocikpIHN1Y2Nlc3Moci5yZXF1ZXN0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEhlYWRlcnMoaHR0cCwgbykge1xuICAgIHZhciBoZWFkZXJzID0gb1snaGVhZGVycyddIHx8IHt9XG4gICAgICAsIGhcblxuICAgIGhlYWRlcnNbJ0FjY2VwdCddID0gaGVhZGVyc1snQWNjZXB0J11cbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzWydhY2NlcHQnXVtvWyd0eXBlJ11dXG4gICAgICB8fCBkZWZhdWx0SGVhZGVyc1snYWNjZXB0J11bJyonXVxuXG4gICAgdmFyIGlzQUZvcm1EYXRhID0gdHlwZW9mIEZvcm1EYXRhID09PSAnZnVuY3Rpb24nICYmIChvWydkYXRhJ10gaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG4gICAgLy8gYnJlYWtzIGNyb3NzLW9yaWdpbiByZXF1ZXN0cyB3aXRoIGxlZ2FjeSBicm93c2Vyc1xuICAgIGlmICghb1snY3Jvc3NPcmlnaW4nXSAmJiAhaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSkgaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSA9IGRlZmF1bHRIZWFkZXJzWydyZXF1ZXN0ZWRXaXRoJ11cbiAgICBpZiAoIWhlYWRlcnNbY29udGVudFR5cGVdICYmICFpc0FGb3JtRGF0YSkgaGVhZGVyc1tjb250ZW50VHlwZV0gPSBvWydjb250ZW50VHlwZSddIHx8IGRlZmF1bHRIZWFkZXJzWydjb250ZW50VHlwZSddXG4gICAgZm9yIChoIGluIGhlYWRlcnMpXG4gICAgICBoZWFkZXJzLmhhc093blByb3BlcnR5KGgpICYmICdzZXRSZXF1ZXN0SGVhZGVyJyBpbiBodHRwICYmIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihoLCBoZWFkZXJzW2hdKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q3JlZGVudGlhbHMoaHR0cCwgbykge1xuICAgIGlmICh0eXBlb2Ygb1snd2l0aENyZWRlbnRpYWxzJ10gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBodHRwLndpdGhDcmVkZW50aWFscyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGh0dHAud2l0aENyZWRlbnRpYWxzID0gISFvWyd3aXRoQ3JlZGVudGlhbHMnXVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYWxDYWxsYmFjayhkYXRhKSB7XG4gICAgbGFzdFZhbHVlID0gZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gdXJsYXBwZW5kICh1cmwsIHMpIHtcbiAgICByZXR1cm4gdXJsICsgKC9cXD8vLnRlc3QodXJsKSA/ICcmJyA6ICc/JykgKyBzXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpIHtcbiAgICB2YXIgcmVxSWQgPSB1bmlxaWQrK1xuICAgICAgLCBjYmtleSA9IG9bJ2pzb25wQ2FsbGJhY2snXSB8fCAnY2FsbGJhY2snIC8vIHRoZSAnY2FsbGJhY2snIGtleVxuICAgICAgLCBjYnZhbCA9IG9bJ2pzb25wQ2FsbGJhY2tOYW1lJ10gfHwgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeChyZXFJZClcbiAgICAgICwgY2JyZWcgPSBuZXcgUmVnRXhwKCcoKF58XFxcXD98JiknICsgY2JrZXkgKyAnKT0oW14mXSspJylcbiAgICAgICwgbWF0Y2ggPSB1cmwubWF0Y2goY2JyZWcpXG4gICAgICAsIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAgLCBsb2FkZWQgPSAwXG4gICAgICAsIGlzSUUxMCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSAxMC4wJykgIT09IC0xXG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGlmIChtYXRjaFszXSA9PT0gJz8nKSB7XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKGNicmVnLCAnJDE9JyArIGNidmFsKSAvLyB3aWxkY2FyZCBjYWxsYmFjayBmdW5jIG5hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNidmFsID0gbWF0Y2hbM10gLy8gcHJvdmlkZWQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGNia2V5ICsgJz0nICsgY2J2YWwpIC8vIG5vIGNhbGxiYWNrIGRldGFpbHMsIGFkZCAnZW1cbiAgICB9XG5cbiAgICB3aW5bY2J2YWxdID0gZ2VuZXJhbENhbGxiYWNrXG5cbiAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnXG4gICAgc2NyaXB0LnNyYyA9IHVybFxuICAgIHNjcmlwdC5hc3luYyA9IHRydWVcbiAgICBpZiAodHlwZW9mIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgIT09ICd1bmRlZmluZWQnICYmICFpc0lFMTApIHtcbiAgICAgIC8vIG5lZWQgdGhpcyBmb3IgSUUgZHVlIHRvIG91dC1vZi1vcmRlciBvbnJlYWR5c3RhdGVjaGFuZ2UoKSwgYmluZGluZyBzY3JpcHRcbiAgICAgIC8vIGV4ZWN1dGlvbiB0byBhbiBldmVudCBsaXN0ZW5lciBnaXZlcyB1cyBjb250cm9sIG92ZXIgd2hlbiB0aGUgc2NyaXB0XG4gICAgICAvLyBpcyBleGVjdXRlZC4gU2VlIGh0dHA6Ly9qYXVib3VyZy5uZXQvMjAxMC8wNy9sb2FkaW5nLXNjcmlwdC1hcy1vbmNsaWNrLWhhbmRsZXItb2YuaHRtbFxuICAgICAgc2NyaXB0Lmh0bWxGb3IgPSBzY3JpcHQuaWQgPSAnX3JlcXdlc3RfJyArIHJlcUlkXG4gICAgfVxuXG4gICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoKHNjcmlwdFtyZWFkeVN0YXRlXSAmJiBzY3JpcHRbcmVhZHlTdGF0ZV0gIT09ICdjb21wbGV0ZScgJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnbG9hZGVkJykgfHwgbG9hZGVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgICBzY3JpcHQub25jbGljayAmJiBzY3JpcHQub25jbGljaygpXG4gICAgICAvLyBDYWxsIHRoZSB1c2VyIGNhbGxiYWNrIHdpdGggdGhlIGxhc3QgdmFsdWUgc3RvcmVkIGFuZCBjbGVhbiB1cCB2YWx1ZXMgYW5kIHNjcmlwdHMuXG4gICAgICBmbihsYXN0VmFsdWUpXG4gICAgICBsYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgbG9hZGVkID0gMVxuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgc2NyaXB0IHRvIHRoZSBET00gaGVhZFxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuXG4gICAgLy8gRW5hYmxlIEpTT05QIHRpbWVvdXRcbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgICAgIGVycih7fSwgJ1JlcXVlc3QgaXMgYWJvcnRlZDogdGltZW91dCcsIHt9KVxuICAgICAgICBsYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpXG4gICAgICAgIGxvYWRlZCA9IDFcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSZXF1ZXN0KGZuLCBlcnIpIHtcbiAgICB2YXIgbyA9IHRoaXMub1xuICAgICAgLCBtZXRob2QgPSAob1snbWV0aG9kJ10gfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKClcbiAgICAgICwgdXJsID0gdHlwZW9mIG8gPT09ICdzdHJpbmcnID8gbyA6IG9bJ3VybCddXG4gICAgICAvLyBjb252ZXJ0IG5vbi1zdHJpbmcgb2JqZWN0cyB0byBxdWVyeS1zdHJpbmcgZm9ybSB1bmxlc3Mgb1sncHJvY2Vzc0RhdGEnXSBpcyBmYWxzZVxuICAgICAgLCBkYXRhID0gKG9bJ3Byb2Nlc3NEYXRhJ10gIT09IGZhbHNlICYmIG9bJ2RhdGEnXSAmJiB0eXBlb2Ygb1snZGF0YSddICE9PSAnc3RyaW5nJylcbiAgICAgICAgPyByZXF3ZXN0LnRvUXVlcnlTdHJpbmcob1snZGF0YSddKVxuICAgICAgICA6IChvWydkYXRhJ10gfHwgbnVsbClcbiAgICAgICwgaHR0cFxuICAgICAgLCBzZW5kV2FpdCA9IGZhbHNlXG5cbiAgICAvLyBpZiB3ZSdyZSB3b3JraW5nIG9uIGEgR0VUIHJlcXVlc3QgYW5kIHdlIGhhdmUgZGF0YSB0aGVuIHdlIHNob3VsZCBhcHBlbmRcbiAgICAvLyBxdWVyeSBzdHJpbmcgdG8gZW5kIG9mIFVSTCBhbmQgbm90IHBvc3QgZGF0YVxuICAgIGlmICgob1sndHlwZSddID09ICdqc29ucCcgfHwgbWV0aG9kID09ICdHRVQnKSAmJiBkYXRhKSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBkYXRhKVxuICAgICAgZGF0YSA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAob1sndHlwZSddID09ICdqc29ucCcpIHJldHVybiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpXG5cbiAgICAvLyBnZXQgdGhlIHhociBmcm9tIHRoZSBmYWN0b3J5IGlmIHBhc3NlZFxuICAgIC8vIGlmIHRoZSBmYWN0b3J5IHJldHVybnMgbnVsbCwgZmFsbC1iYWNrIHRvIG91cnNcbiAgICBodHRwID0gKG8ueGhyICYmIG8ueGhyKG8pKSB8fCB4aHIobylcblxuICAgIGh0dHAub3BlbihtZXRob2QsIHVybCwgb1snYXN5bmMnXSA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWUpXG4gICAgc2V0SGVhZGVycyhodHRwLCBvKVxuICAgIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pXG4gICAgaWYgKHdpblt4RG9tYWluUmVxdWVzdF0gJiYgaHR0cCBpbnN0YW5jZW9mIHdpblt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgaHR0cC5vbmxvYWQgPSBmblxuICAgICAgICBodHRwLm9uZXJyb3IgPSBlcnJcbiAgICAgICAgLy8gTk9URTogc2VlXG4gICAgICAgIC8vIGh0dHA6Ly9zb2NpYWwubXNkbi5taWNyb3NvZnQuY29tL0ZvcnVtcy9lbi1VUy9pZXdlYmRldmVsb3BtZW50L3RocmVhZC8zMGVmM2FkZC03NjdjLTQ0MzYtYjhhOS1mMWNhMTliNDgxMmVcbiAgICAgICAgaHR0cC5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7fVxuICAgICAgICBzZW5kV2FpdCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVSZWFkeVN0YXRlKHRoaXMsIGZuLCBlcnIpXG4gICAgfVxuICAgIG9bJ2JlZm9yZSddICYmIG9bJ2JlZm9yZSddKGh0dHApXG4gICAgaWYgKHNlbmRXYWl0KSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaHR0cC5zZW5kKGRhdGEpXG4gICAgICB9LCAyMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgIH1cbiAgICByZXR1cm4gaHR0cFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxd2VzdChvLCBmbikge1xuICAgIHRoaXMubyA9IG9cbiAgICB0aGlzLmZuID0gZm5cblxuICAgIGluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHlwZShoZWFkZXIpIHtcbiAgICAvLyBqc29uLCBqYXZhc2NyaXB0LCB0ZXh0L3BsYWluLCB0ZXh0L2h0bWwsIHhtbFxuICAgIGlmIChoZWFkZXIubWF0Y2goJ2pzb24nKSkgcmV0dXJuICdqc29uJ1xuICAgIGlmIChoZWFkZXIubWF0Y2goJ2phdmFzY3JpcHQnKSkgcmV0dXJuICdqcydcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCd0ZXh0JykpIHJldHVybiAnaHRtbCdcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCd4bWwnKSkgcmV0dXJuICd4bWwnXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KG8sIGZuKSB7XG5cbiAgICB0aGlzLnVybCA9IHR5cGVvZiBvID09ICdzdHJpbmcnID8gbyA6IG9bJ3VybCddXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuXG4gICAgLy8gd2hldGhlciByZXF1ZXN0IGhhcyBiZWVuIGZ1bGZpbGxlZCBmb3IgcHVycG9zZVxuICAgIC8vIG9mIHRyYWNraW5nIHRoZSBQcm9taXNlc1xuICAgIHRoaXMuX2Z1bGZpbGxlZCA9IGZhbHNlXG4gICAgLy8gc3VjY2VzcyBoYW5kbGVyc1xuICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24oKXt9XG4gICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycyA9IFtdXG4gICAgLy8gZXJyb3IgaGFuZGxlcnNcbiAgICB0aGlzLl9lcnJvckhhbmRsZXJzID0gW11cbiAgICAvLyBjb21wbGV0ZSAoYm90aCBzdWNjZXNzIGFuZCBmYWlsKSBoYW5kbGVyc1xuICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMgPSBbXVxuICAgIHRoaXMuX2VycmVkID0gZmFsc2VcbiAgICB0aGlzLl9yZXNwb25zZUFyZ3MgPSB7fVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICBmbiA9IGZuIHx8IGZ1bmN0aW9uICgpIHt9XG5cbiAgICBpZiAob1sndGltZW91dCddKSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGltZWRPdXQoKVxuICAgICAgfSwgb1sndGltZW91dCddKVxuICAgIH1cblxuICAgIGlmIChvWydzdWNjZXNzJ10pIHtcbiAgICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydzdWNjZXNzJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvWydlcnJvciddKSB7XG4gICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydlcnJvciddLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKG9bJ2NvbXBsZXRlJ10pIHtcbiAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ2NvbXBsZXRlJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSAocmVzcCkge1xuICAgICAgb1sndGltZW91dCddICYmIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG4gICAgICBzZWxmLnRpbWVvdXQgPSBudWxsXG4gICAgICB3aGlsZSAoc2VsZi5fY29tcGxldGVIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MgKHJlc3ApIHtcbiAgICAgIHZhciB0eXBlID0gb1sndHlwZSddIHx8IHJlc3AgJiYgc2V0VHlwZShyZXNwLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKSkgLy8gcmVzcCBjYW4gYmUgdW5kZWZpbmVkIGluIElFXG4gICAgICByZXNwID0gKHR5cGUgIT09ICdqc29ucCcpID8gc2VsZi5yZXF1ZXN0IDogcmVzcFxuICAgICAgLy8gdXNlIGdsb2JhbCBkYXRhIGZpbHRlciBvbiByZXNwb25zZSB0ZXh0XG4gICAgICB2YXIgZmlsdGVyZWRSZXNwb25zZSA9IGdsb2JhbFNldHVwT3B0aW9ucy5kYXRhRmlsdGVyKHJlc3AucmVzcG9uc2VUZXh0LCB0eXBlKVxuICAgICAgICAsIHIgPSBmaWx0ZXJlZFJlc3BvbnNlXG4gICAgICB0cnkge1xuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dCA9IHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY2FuJ3QgYXNzaWduIHRoaXMgaW4gSUU8PTgsIGp1c3QgaWdub3JlXG4gICAgICB9XG4gICAgICBpZiAocikge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3AgPSB3aW4uSlNPTiA/IHdpbi5KU09OLnBhcnNlKHIpIDogZXZhbCgnKCcgKyByICsgJyknKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yKHJlc3AsICdDb3VsZCBub3QgcGFyc2UgSlNPTiBpbiByZXNwb25zZScsIGVycilcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnanMnOlxuICAgICAgICAgIHJlc3AgPSBldmFsKHIpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgcmVzcCA9IHJcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd4bWwnOlxuICAgICAgICAgIHJlc3AgPSByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvciAvLyBJRSB0cm9sb2xvXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5lcnJvckNvZGVcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLnJlYXNvblxuICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICA6IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fZnVsZmlsbGVkID0gdHJ1ZVxuICAgICAgZm4ocmVzcClcbiAgICAgIHNlbGYuX3N1Y2Nlc3NIYW5kbGVyKHJlc3ApXG4gICAgICB3aGlsZSAoc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3AgPSBzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLnNoaWZ0KCkocmVzcClcbiAgICAgIH1cblxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aW1lZE91dCgpIHtcbiAgICAgIHNlbGYuX3RpbWVkT3V0ID0gdHJ1ZVxuICAgICAgc2VsZi5yZXF1ZXN0LmFib3J0KCkgICAgICBcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwLCBtc2csIHQpIHtcbiAgICAgIHJlc3AgPSBzZWxmLnJlcXVlc3RcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLm1zZyA9IG1zZ1xuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnQgPSB0XG4gICAgICBzZWxmLl9lcnJlZCA9IHRydWVcbiAgICAgIHdoaWxlIChzZWxmLl9lcnJvckhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fZXJyb3JIYW5kbGVycy5zaGlmdCgpKHJlc3AsIG1zZywgdClcbiAgICAgIH1cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0ID0gZ2V0UmVxdWVzdC5jYWxsKHRoaXMsIHN1Y2Nlc3MsIGVycm9yKVxuICB9XG5cbiAgUmVxd2VzdC5wcm90b3R5cGUgPSB7XG4gICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2Fib3J0ZWQgPSB0cnVlXG4gICAgICB0aGlzLnJlcXVlc3QuYWJvcnQoKVxuICAgIH1cblxuICAsIHJldHJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0LmNhbGwodGhpcywgdGhpcy5vLCB0aGlzLmZuKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNtYWxsIGRldmlhdGlvbiBmcm9tIHRoZSBQcm9taXNlcyBBIENvbW1vbkpzIHNwZWNpZmljYXRpb25cbiAgICAgKiBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Qcm9taXNlcy9BXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBgdGhlbmAgd2lsbCBleGVjdXRlIHVwb24gc3VjY2Vzc2Z1bCByZXF1ZXN0c1xuICAgICAqL1xuICAsIHRoZW46IGZ1bmN0aW9uIChzdWNjZXNzLCBmYWlsKSB7XG4gICAgICBzdWNjZXNzID0gc3VjY2VzcyB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgZmFpbCA9IGZhaWwgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQpIHtcbiAgICAgICAgdGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AgPSBzdWNjZXNzKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmYWlsKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMucHVzaChzdWNjZXNzKVxuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZmFpbClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGFsd2F5c2Agd2lsbCBleGVjdXRlIHdoZXRoZXIgdGhlIHJlcXVlc3Qgc3VjY2VlZHMgb3IgZmFpbHNcbiAgICAgKi9cbiAgLCBhbHdheXM6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCB8fCB0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGZhaWxgIHdpbGwgZXhlY3V0ZSB3aGVuIHRoZSByZXF1ZXN0IGZhaWxzXG4gICAgICovXG4gICwgZmFpbDogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICwgJ2NhdGNoJzogZnVuY3Rpb24gKGZuKSB7XG4gICAgICByZXR1cm4gdGhpcy5mYWlsKGZuKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcXdlc3QobywgZm4pIHtcbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICAvLyBub3JtYWxpemUgbmV3bGluZSB2YXJpYW50cyBhY2NvcmRpbmcgdG8gc3BlYyAtPiBDUkxGXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShzKSB7XG4gICAgcmV0dXJuIHMgPyBzLnJlcGxhY2UoL1xccj9cXG4vZywgJ1xcclxcbicpIDogJydcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcmlhbChlbCwgY2IpIHtcbiAgICB2YXIgbiA9IGVsLm5hbWVcbiAgICAgICwgdCA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgLCBvcHRDYiA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgLy8gSUUgZ2l2ZXMgdmFsdWU9XCJcIiBldmVuIHdoZXJlIHRoZXJlIGlzIG5vIHZhbHVlIGF0dHJpYnV0ZVxuICAgICAgICAgIC8vICdzcGVjaWZpZWQnIHJlZjogaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtQ29yZS9jb3JlLmh0bWwjSUQtODYyNTI5MjczXG4gICAgICAgICAgaWYgKG8gJiYgIW9bJ2Rpc2FibGVkJ10pXG4gICAgICAgICAgICBjYihuLCBub3JtYWxpemUob1snYXR0cmlidXRlcyddWyd2YWx1ZSddICYmIG9bJ2F0dHJpYnV0ZXMnXVsndmFsdWUnXVsnc3BlY2lmaWVkJ10gPyBvWyd2YWx1ZSddIDogb1sndGV4dCddKSlcbiAgICAgICAgfVxuICAgICAgLCBjaCwgcmEsIHZhbCwgaVxuXG4gICAgLy8gZG9uJ3Qgc2VyaWFsaXplIGVsZW1lbnRzIHRoYXQgYXJlIGRpc2FibGVkIG9yIHdpdGhvdXQgYSBuYW1lXG4gICAgaWYgKGVsLmRpc2FibGVkIHx8ICFuKSByZXR1cm5cblxuICAgIHN3aXRjaCAodCkge1xuICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgIGlmICghL3Jlc2V0fGJ1dHRvbnxpbWFnZXxmaWxlL2kudGVzdChlbC50eXBlKSkge1xuICAgICAgICBjaCA9IC9jaGVja2JveC9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgcmEgPSAvcmFkaW8vaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHZhbCA9IGVsLnZhbHVlXG4gICAgICAgIC8vIFdlYktpdCBnaXZlcyB1cyBcIlwiIGluc3RlYWQgb2YgXCJvblwiIGlmIGEgY2hlY2tib3ggaGFzIG5vIHZhbHVlLCBzbyBjb3JyZWN0IGl0IGhlcmVcbiAgICAgICAgOyghKGNoIHx8IHJhKSB8fCBlbC5jaGVja2VkKSAmJiBjYihuLCBub3JtYWxpemUoY2ggJiYgdmFsID09PSAnJyA/ICdvbicgOiB2YWwpKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICBjYihuLCBub3JtYWxpemUoZWwudmFsdWUpKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgaWYgKGVsLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdC1vbmUnKSB7XG4gICAgICAgIG9wdENiKGVsLnNlbGVjdGVkSW5kZXggPj0gMCA/IGVsLm9wdGlvbnNbZWwuc2VsZWN0ZWRJbmRleF0gOiBudWxsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gMDsgZWwubGVuZ3RoICYmIGkgPCBlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVsLm9wdGlvbnNbaV0uc2VsZWN0ZWQgJiYgb3B0Q2IoZWwub3B0aW9uc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvLyBjb2xsZWN0IHVwIGFsbCBmb3JtIGVsZW1lbnRzIGZvdW5kIGZyb20gdGhlIHBhc3NlZCBhcmd1bWVudCBlbGVtZW50cyBhbGxcbiAgLy8gdGhlIHdheSBkb3duIHRvIGNoaWxkIGVsZW1lbnRzOyBwYXNzIGEgJzxmb3JtPicgb3IgZm9ybSBmaWVsZHMuXG4gIC8vIGNhbGxlZCB3aXRoICd0aGlzJz1jYWxsYmFjayB0byB1c2UgZm9yIHNlcmlhbCgpIG9uIGVhY2ggZWxlbWVudFxuICBmdW5jdGlvbiBlYWNoRm9ybUVsZW1lbnQoKSB7XG4gICAgdmFyIGNiID0gdGhpc1xuICAgICAgLCBlLCBpXG4gICAgICAsIHNlcmlhbGl6ZVN1YnRhZ3MgPSBmdW5jdGlvbiAoZSwgdGFncykge1xuICAgICAgICAgIHZhciBpLCBqLCBmYVxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmYSA9IGVbYnlUYWddKHRhZ3NbaV0pXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZmEubGVuZ3RoOyBqKyspIHNlcmlhbChmYVtqXSwgY2IpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlID0gYXJndW1lbnRzW2ldXG4gICAgICBpZiAoL2lucHV0fHNlbGVjdHx0ZXh0YXJlYS9pLnRlc3QoZS50YWdOYW1lKSkgc2VyaWFsKGUsIGNiKVxuICAgICAgc2VyaWFsaXplU3VidGFncyhlLCBbICdpbnB1dCcsICdzZWxlY3QnLCAndGV4dGFyZWEnIF0pXG4gICAgfVxuICB9XG5cbiAgLy8gc3RhbmRhcmQgcXVlcnkgc3RyaW5nIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplUXVlcnlTdHJpbmcoKSB7XG4gICAgcmV0dXJuIHJlcXdlc3QudG9RdWVyeVN0cmluZyhyZXF3ZXN0LnNlcmlhbGl6ZUFycmF5LmFwcGx5KG51bGwsIGFyZ3VtZW50cykpXG4gIH1cblxuICAvLyB7ICduYW1lJzogJ3ZhbHVlJywgLi4uIH0gc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVIYXNoKCkge1xuICAgIHZhciBoYXNoID0ge31cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAobmFtZSBpbiBoYXNoKSB7XG4gICAgICAgIGhhc2hbbmFtZV0gJiYgIWlzQXJyYXkoaGFzaFtuYW1lXSkgJiYgKGhhc2hbbmFtZV0gPSBbaGFzaFtuYW1lXV0pXG4gICAgICAgIGhhc2hbbmFtZV0ucHVzaCh2YWx1ZSlcbiAgICAgIH0gZWxzZSBoYXNoW25hbWVdID0gdmFsdWVcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGhhc2hcbiAgfVxuXG4gIC8vIFsgeyBuYW1lOiAnbmFtZScsIHZhbHVlOiAndmFsdWUnIH0sIC4uLiBdIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgcmVxd2VzdC5zZXJpYWxpemVBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyID0gW11cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBhcnIucHVzaCh7bmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlfSlcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgcmVxd2VzdC5zZXJpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiAnJ1xuICAgIHZhciBvcHQsIGZuXG4gICAgICAsIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApXG5cbiAgICBvcHQgPSBhcmdzLnBvcCgpXG4gICAgb3B0ICYmIG9wdC5ub2RlVHlwZSAmJiBhcmdzLnB1c2gob3B0KSAmJiAob3B0ID0gbnVsbClcbiAgICBvcHQgJiYgKG9wdCA9IG9wdC50eXBlKVxuXG4gICAgaWYgKG9wdCA9PSAnbWFwJykgZm4gPSBzZXJpYWxpemVIYXNoXG4gICAgZWxzZSBpZiAob3B0ID09ICdhcnJheScpIGZuID0gcmVxd2VzdC5zZXJpYWxpemVBcnJheVxuICAgIGVsc2UgZm4gPSBzZXJpYWxpemVRdWVyeVN0cmluZ1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3MpXG4gIH1cblxuICByZXF3ZXN0LnRvUXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAobywgdHJhZCkge1xuICAgIHZhciBwcmVmaXgsIGlcbiAgICAgICwgdHJhZGl0aW9uYWwgPSB0cmFkIHx8IGZhbHNlXG4gICAgICAsIHMgPSBbXVxuICAgICAgLCBlbmMgPSBlbmNvZGVVUklDb21wb25lbnRcbiAgICAgICwgYWRkID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAvLyBJZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpbnZva2UgaXQgYW5kIHJldHVybiBpdHMgdmFsdWVcbiAgICAgICAgICB2YWx1ZSA9ICgnZnVuY3Rpb24nID09PSB0eXBlb2YgdmFsdWUpID8gdmFsdWUoKSA6ICh2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZSlcbiAgICAgICAgICBzW3MubGVuZ3RoXSA9IGVuYyhrZXkpICsgJz0nICsgZW5jKHZhbHVlKVxuICAgICAgICB9XG4gICAgLy8gSWYgYW4gYXJyYXkgd2FzIHBhc3NlZCBpbiwgYXNzdW1lIHRoYXQgaXQgaXMgYW4gYXJyYXkgb2YgZm9ybSBlbGVtZW50cy5cbiAgICBpZiAoaXNBcnJheShvKSkge1xuICAgICAgZm9yIChpID0gMDsgbyAmJiBpIDwgby5sZW5ndGg7IGkrKykgYWRkKG9baV1bJ25hbWUnXSwgb1tpXVsndmFsdWUnXSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdHJhZGl0aW9uYWwsIGVuY29kZSB0aGUgXCJvbGRcIiB3YXkgKHRoZSB3YXkgMS4zLjIgb3Igb2xkZXJcbiAgICAgIC8vIGRpZCBpdCksIG90aGVyd2lzZSBlbmNvZGUgcGFyYW1zIHJlY3Vyc2l2ZWx5LlxuICAgICAgZm9yIChwcmVmaXggaW4gbykge1xuICAgICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpKSBidWlsZFBhcmFtcyhwcmVmaXgsIG9bcHJlZml4XSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzcGFjZXMgc2hvdWxkIGJlICsgYWNjb3JkaW5nIHRvIHNwZWNcbiAgICByZXR1cm4gcy5qb2luKCcmJykucmVwbGFjZSgvJTIwL2csICcrJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkUGFyYW1zKHByZWZpeCwgb2JqLCB0cmFkaXRpb25hbCwgYWRkKSB7XG4gICAgdmFyIG5hbWUsIGksIHZcbiAgICAgICwgcmJyYWNrZXQgPSAvXFxbXFxdJC9cblxuICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBhcnJheSBpdGVtLlxuICAgICAgZm9yIChpID0gMDsgb2JqICYmIGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdiA9IG9ialtpXVxuICAgICAgICBpZiAodHJhZGl0aW9uYWwgfHwgcmJyYWNrZXQudGVzdChwcmVmaXgpKSB7XG4gICAgICAgICAgLy8gVHJlYXQgZWFjaCBhcnJheSBpdGVtIGFzIGEgc2NhbGFyLlxuICAgICAgICAgIGFkZChwcmVmaXgsIHYpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgKHR5cGVvZiB2ID09PSAnb2JqZWN0JyA/IGkgOiAnJykgKyAnXScsIHYsIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9iaiAmJiBvYmoudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBvYmplY3QgaXRlbS5cbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgbmFtZSArICddJywgb2JqW25hbWVdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBzY2FsYXIgaXRlbS5cbiAgICAgIGFkZChwcmVmaXgsIG9iailcbiAgICB9XG4gIH1cblxuICByZXF3ZXN0LmdldGNhbGxiYWNrUHJlZml4ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYWxsYmFja1ByZWZpeFxuICB9XG5cbiAgLy8galF1ZXJ5IGFuZCBaZXB0byBjb21wYXRpYmlsaXR5LCBkaWZmZXJlbmNlcyBjYW4gYmUgcmVtYXBwZWQgaGVyZSBzbyB5b3UgY2FuIGNhbGxcbiAgLy8gLmFqYXguY29tcGF0KG9wdGlvbnMsIGNhbGxiYWNrKVxuICByZXF3ZXN0LmNvbXBhdCA9IGZ1bmN0aW9uIChvLCBmbikge1xuICAgIGlmIChvKSB7XG4gICAgICBvWyd0eXBlJ10gJiYgKG9bJ21ldGhvZCddID0gb1sndHlwZSddKSAmJiBkZWxldGUgb1sndHlwZSddXG4gICAgICBvWydkYXRhVHlwZSddICYmIChvWyd0eXBlJ10gPSBvWydkYXRhVHlwZSddKVxuICAgICAgb1snanNvbnBDYWxsYmFjayddICYmIChvWydqc29ucENhbGxiYWNrTmFtZSddID0gb1snanNvbnBDYWxsYmFjayddKSAmJiBkZWxldGUgb1snanNvbnBDYWxsYmFjayddXG4gICAgICBvWydqc29ucCddICYmIChvWydqc29ucENhbGxiYWNrJ10gPSBvWydqc29ucCddKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICByZXF3ZXN0LmFqYXhTZXR1cCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBmb3IgKHZhciBrIGluIG9wdGlvbnMpIHtcbiAgICAgIGdsb2JhbFNldHVwT3B0aW9uc1trXSA9IG9wdGlvbnNba11cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVxd2VzdFxufSk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0IEZlbGl4IEduYXNzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblxuICAvKiBDb21tb25KUyAqL1xuICBpZiAodHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcpICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKVxuXG4gIC8qIEFNRCBtb2R1bGUgKi9cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShmYWN0b3J5KVxuXG4gIC8qIEJyb3dzZXIgZ2xvYmFsICovXG4gIGVsc2Ugcm9vdC5TcGlubmVyID0gZmFjdG9yeSgpXG59XG4odGhpcywgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBwcmVmaXhlcyA9IFsnd2Via2l0JywgJ01veicsICdtcycsICdPJ10gLyogVmVuZG9yIHByZWZpeGVzICovXG4gICAgLCBhbmltYXRpb25zID0ge30gLyogQW5pbWF0aW9uIHJ1bGVzIGtleWVkIGJ5IHRoZWlyIG5hbWUgKi9cbiAgICAsIHVzZUNzc0FuaW1hdGlvbnMgLyogV2hldGhlciB0byB1c2UgQ1NTIGFuaW1hdGlvbnMgb3Igc2V0VGltZW91dCAqL1xuXG4gIC8qKlxuICAgKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBlbGVtZW50cy4gSWYgbm8gdGFnIG5hbWUgaXMgZ2l2ZW4sXG4gICAqIGEgRElWIGlzIGNyZWF0ZWQuIE9wdGlvbmFsbHkgcHJvcGVydGllcyBjYW4gYmUgcGFzc2VkLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlRWwodGFnLCBwcm9wKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcgfHwgJ2RpdicpXG4gICAgICAsIG5cblxuICAgIGZvcihuIGluIHByb3ApIGVsW25dID0gcHJvcFtuXVxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgY2hpbGRyZW4gYW5kIHJldHVybnMgdGhlIHBhcmVudC5cbiAgICovXG4gIGZ1bmN0aW9uIGlucyhwYXJlbnQgLyogY2hpbGQxLCBjaGlsZDIsIC4uLiovKSB7XG4gICAgZm9yICh2YXIgaT0xLCBuPWFyZ3VtZW50cy5sZW5ndGg7IGk8bjsgaSsrKVxuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGFyZ3VtZW50c1tpXSlcblxuICAgIHJldHVybiBwYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBuZXcgc3R5bGVzaGVldCB0byBob2xkIHRoZSBAa2V5ZnJhbWUgb3IgVk1MIHJ1bGVzLlxuICAgKi9cbiAgdmFyIHNoZWV0ID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbCA9IGNyZWF0ZUVsKCdzdHlsZScsIHt0eXBlIDogJ3RleHQvY3NzJ30pXG4gICAgaW5zKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0sIGVsKVxuICAgIHJldHVybiBlbC5zaGVldCB8fCBlbC5zdHlsZVNoZWV0XG4gIH0oKSlcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvcGFjaXR5IGtleWZyYW1lIGFuaW1hdGlvbiBydWxlIGFuZCByZXR1cm5zIGl0cyBuYW1lLlxuICAgKiBTaW5jZSBtb3N0IG1vYmlsZSBXZWJraXRzIGhhdmUgdGltaW5nIGlzc3VlcyB3aXRoIGFuaW1hdGlvbi1kZWxheSxcbiAgICogd2UgY3JlYXRlIHNlcGFyYXRlIHJ1bGVzIGZvciBlYWNoIGxpbmUvc2VnbWVudC5cbiAgICovXG4gIGZ1bmN0aW9uIGFkZEFuaW1hdGlvbihhbHBoYSwgdHJhaWwsIGksIGxpbmVzKSB7XG4gICAgdmFyIG5hbWUgPSBbJ29wYWNpdHknLCB0cmFpbCwgfn4oYWxwaGEqMTAwKSwgaSwgbGluZXNdLmpvaW4oJy0nKVxuICAgICAgLCBzdGFydCA9IDAuMDEgKyBpL2xpbmVzICogMTAwXG4gICAgICAsIHogPSBNYXRoLm1heCgxIC0gKDEtYWxwaGEpIC8gdHJhaWwgKiAoMTAwLXN0YXJ0KSwgYWxwaGEpXG4gICAgICAsIHByZWZpeCA9IHVzZUNzc0FuaW1hdGlvbnMuc3Vic3RyaW5nKDAsIHVzZUNzc0FuaW1hdGlvbnMuaW5kZXhPZignQW5pbWF0aW9uJykpLnRvTG93ZXJDYXNlKClcbiAgICAgICwgcHJlID0gcHJlZml4ICYmICctJyArIHByZWZpeCArICctJyB8fCAnJ1xuXG4gICAgaWYgKCFhbmltYXRpb25zW25hbWVdKSB7XG4gICAgICBzaGVldC5pbnNlcnRSdWxlKFxuICAgICAgICAnQCcgKyBwcmUgKyAna2V5ZnJhbWVzICcgKyBuYW1lICsgJ3snICtcbiAgICAgICAgJzAle29wYWNpdHk6JyArIHogKyAnfScgK1xuICAgICAgICBzdGFydCArICcle29wYWNpdHk6JyArIGFscGhhICsgJ30nICtcbiAgICAgICAgKHN0YXJ0KzAuMDEpICsgJyV7b3BhY2l0eToxfScgK1xuICAgICAgICAoc3RhcnQrdHJhaWwpICUgMTAwICsgJyV7b3BhY2l0eTonICsgYWxwaGEgKyAnfScgK1xuICAgICAgICAnMTAwJXtvcGFjaXR5OicgKyB6ICsgJ30nICtcbiAgICAgICAgJ30nLCBzaGVldC5jc3NSdWxlcy5sZW5ndGgpXG5cbiAgICAgIGFuaW1hdGlvbnNbbmFtZV0gPSAxXG4gICAgfVxuXG4gICAgcmV0dXJuIG5hbWVcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmllcyB2YXJpb3VzIHZlbmRvciBwcmVmaXhlcyBhbmQgcmV0dXJucyB0aGUgZmlyc3Qgc3VwcG9ydGVkIHByb3BlcnR5LlxuICAgKi9cbiAgZnVuY3Rpb24gdmVuZG9yKGVsLCBwcm9wKSB7XG4gICAgdmFyIHMgPSBlbC5zdHlsZVxuICAgICAgLCBwcFxuICAgICAgLCBpXG5cbiAgICBwcm9wID0gcHJvcC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3Auc2xpY2UoMSlcbiAgICBmb3IoaT0wOyBpPHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwcCA9IHByZWZpeGVzW2ldK3Byb3BcbiAgICAgIGlmKHNbcHBdICE9PSB1bmRlZmluZWQpIHJldHVybiBwcFxuICAgIH1cbiAgICBpZihzW3Byb3BdICE9PSB1bmRlZmluZWQpIHJldHVybiBwcm9wXG4gIH1cblxuICAvKipcbiAgICogU2V0cyBtdWx0aXBsZSBzdHlsZSBwcm9wZXJ0aWVzIGF0IG9uY2UuXG4gICAqL1xuICBmdW5jdGlvbiBjc3MoZWwsIHByb3ApIHtcbiAgICBmb3IgKHZhciBuIGluIHByb3ApXG4gICAgICBlbC5zdHlsZVt2ZW5kb3IoZWwsIG4pfHxuXSA9IHByb3Bbbl1cblxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgLyoqXG4gICAqIEZpbGxzIGluIGRlZmF1bHQgdmFsdWVzLlxuICAgKi9cbiAgZnVuY3Rpb24gbWVyZ2Uob2JqKSB7XG4gICAgZm9yICh2YXIgaT0xOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVmID0gYXJndW1lbnRzW2ldXG4gICAgICBmb3IgKHZhciBuIGluIGRlZilcbiAgICAgICAgaWYgKG9ialtuXSA9PT0gdW5kZWZpbmVkKSBvYmpbbl0gPSBkZWZbbl1cbiAgICB9XG4gICAgcmV0dXJuIG9ialxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpbmUgY29sb3IgZnJvbSB0aGUgZ2l2ZW4gc3RyaW5nIG9yIGFycmF5LlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q29sb3IoY29sb3IsIGlkeCkge1xuICAgIHJldHVybiB0eXBlb2YgY29sb3IgPT0gJ3N0cmluZycgPyBjb2xvciA6IGNvbG9yW2lkeCAlIGNvbG9yLmxlbmd0aF1cbiAgfVxuXG4gIC8vIEJ1aWx0LWluIGRlZmF1bHRzXG5cbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgIGxpbmVzOiAxMiwgICAgICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIHRvIGRyYXdcbiAgICBsZW5ndGg6IDcsICAgICAgICAgICAgLy8gVGhlIGxlbmd0aCBvZiBlYWNoIGxpbmVcbiAgICB3aWR0aDogNSwgICAgICAgICAgICAgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gICAgcmFkaXVzOiAxMCwgICAgICAgICAgIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxuICAgIHJvdGF0ZTogMCwgICAgICAgICAgICAvLyBSb3RhdGlvbiBvZmZzZXRcbiAgICBjb3JuZXJzOiAxLCAgICAgICAgICAgLy8gUm91bmRuZXNzICgwLi4xKVxuICAgIGNvbG9yOiAnIzAwMCcsICAgICAgICAvLyAjcmdiIG9yICNycmdnYmJcbiAgICBkaXJlY3Rpb246IDEsICAgICAgICAgLy8gMTogY2xvY2t3aXNlLCAtMTogY291bnRlcmNsb2Nrd2lzZVxuICAgIHNwZWVkOiAxLCAgICAgICAgICAgICAvLyBSb3VuZHMgcGVyIHNlY29uZFxuICAgIHRyYWlsOiAxMDAsICAgICAgICAgICAvLyBBZnRlcmdsb3cgcGVyY2VudGFnZVxuICAgIG9wYWNpdHk6IDEvNCwgICAgICAgICAvLyBPcGFjaXR5IG9mIHRoZSBsaW5lc1xuICAgIGZwczogMjAsICAgICAgICAgICAgICAvLyBGcmFtZXMgcGVyIHNlY29uZCB3aGVuIHVzaW5nIHNldFRpbWVvdXQoKVxuICAgIHpJbmRleDogMmU5LCAgICAgICAgICAvLyBVc2UgYSBoaWdoIHotaW5kZXggYnkgZGVmYXVsdFxuICAgIGNsYXNzTmFtZTogJ3NwaW5uZXInLCAvLyBDU1MgY2xhc3MgdG8gYXNzaWduIHRvIHRoZSBlbGVtZW50XG4gICAgdG9wOiAnNTAlJywgICAgICAgICAgIC8vIGNlbnRlciB2ZXJ0aWNhbGx5XG4gICAgbGVmdDogJzUwJScsICAgICAgICAgIC8vIGNlbnRlciBob3Jpem9udGFsbHlcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyAgLy8gZWxlbWVudCBwb3NpdGlvblxuICB9XG5cbiAgLyoqIFRoZSBjb25zdHJ1Y3RvciAqL1xuICBmdW5jdGlvbiBTcGlubmVyKG8pIHtcbiAgICB0aGlzLm9wdHMgPSBtZXJnZShvIHx8IHt9LCBTcGlubmVyLmRlZmF1bHRzLCBkZWZhdWx0cylcbiAgfVxuXG4gIC8vIEdsb2JhbCBkZWZhdWx0cyB0aGF0IG92ZXJyaWRlIHRoZSBidWlsdC1pbnM6XG4gIFNwaW5uZXIuZGVmYXVsdHMgPSB7fVxuXG4gIG1lcmdlKFNwaW5uZXIucHJvdG90eXBlLCB7XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZSBzcGlubmVyIHRvIHRoZSBnaXZlbiB0YXJnZXQgZWxlbWVudC4gSWYgdGhpcyBpbnN0YW5jZSBpcyBhbHJlYWR5XG4gICAgICogc3Bpbm5pbmcsIGl0IGlzIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIGl0cyBwcmV2aW91cyB0YXJnZXQgYiBjYWxsaW5nXG4gICAgICogc3RvcCgpIGludGVybmFsbHkuXG4gICAgICovXG4gICAgc3BpbjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICB0aGlzLnN0b3AoKVxuXG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgLCBvID0gc2VsZi5vcHRzXG4gICAgICAgICwgZWwgPSBzZWxmLmVsID0gY3NzKGNyZWF0ZUVsKDAsIHtjbGFzc05hbWU6IG8uY2xhc3NOYW1lfSksIHtwb3NpdGlvbjogby5wb3NpdGlvbiwgd2lkdGg6IDAsIHpJbmRleDogby56SW5kZXh9KVxuXG4gICAgICBjc3MoZWwsIHtcbiAgICAgICAgbGVmdDogby5sZWZ0LFxuICAgICAgICB0b3A6IG8udG9wXG4gICAgICB9KVxuICAgICAgICBcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgdGFyZ2V0Lmluc2VydEJlZm9yZShlbCwgdGFyZ2V0LmZpcnN0Q2hpbGR8fG51bGwpXG4gICAgICB9XG5cbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgncm9sZScsICdwcm9ncmVzc2JhcicpXG4gICAgICBzZWxmLmxpbmVzKGVsLCBzZWxmLm9wdHMpXG5cbiAgICAgIGlmICghdXNlQ3NzQW5pbWF0aW9ucykge1xuICAgICAgICAvLyBObyBDU1MgYW5pbWF0aW9uIHN1cHBvcnQsIHVzZSBzZXRUaW1lb3V0KCkgaW5zdGVhZFxuICAgICAgICB2YXIgaSA9IDBcbiAgICAgICAgICAsIHN0YXJ0ID0gKG8ubGluZXMgLSAxKSAqICgxIC0gby5kaXJlY3Rpb24pIC8gMlxuICAgICAgICAgICwgYWxwaGFcbiAgICAgICAgICAsIGZwcyA9IG8uZnBzXG4gICAgICAgICAgLCBmID0gZnBzL28uc3BlZWRcbiAgICAgICAgICAsIG9zdGVwID0gKDEtby5vcGFjaXR5KSAvIChmKm8udHJhaWwgLyAxMDApXG4gICAgICAgICAgLCBhc3RlcCA9IGYvby5saW5lc1xuXG4gICAgICAgIDsoZnVuY3Rpb24gYW5pbSgpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvLmxpbmVzOyBqKyspIHtcbiAgICAgICAgICAgIGFscGhhID0gTWF0aC5tYXgoMSAtIChpICsgKG8ubGluZXMgLSBqKSAqIGFzdGVwKSAlIGYgKiBvc3RlcCwgby5vcGFjaXR5KVxuXG4gICAgICAgICAgICBzZWxmLm9wYWNpdHkoZWwsIGogKiBvLmRpcmVjdGlvbiArIHN0YXJ0LCBhbHBoYSwgbylcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi50aW1lb3V0ID0gc2VsZi5lbCAmJiBzZXRUaW1lb3V0KGFuaW0sIH5+KDEwMDAvZnBzKSlcbiAgICAgICAgfSkoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGZcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RvcHMgYW5kIHJlbW92ZXMgdGhlIFNwaW5uZXIuXG4gICAgICovXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgICBpZiAoZWwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUpIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXG4gICAgICAgIHRoaXMuZWwgPSB1bmRlZmluZWRcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG1ldGhvZCB0aGF0IGRyYXdzIHRoZSBpbmRpdmlkdWFsIGxpbmVzLiBXaWxsIGJlIG92ZXJ3cml0dGVuXG4gICAgICogaW4gVk1MIGZhbGxiYWNrIG1vZGUgYmVsb3cuXG4gICAgICovXG4gICAgbGluZXM6IGZ1bmN0aW9uKGVsLCBvKSB7XG4gICAgICB2YXIgaSA9IDBcbiAgICAgICAgLCBzdGFydCA9IChvLmxpbmVzIC0gMSkgKiAoMSAtIG8uZGlyZWN0aW9uKSAvIDJcbiAgICAgICAgLCBzZWdcblxuICAgICAgZnVuY3Rpb24gZmlsbChjb2xvciwgc2hhZG93KSB7XG4gICAgICAgIHJldHVybiBjc3MoY3JlYXRlRWwoKSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHdpZHRoOiAoby5sZW5ndGgrby53aWR0aCkgKyAncHgnLFxuICAgICAgICAgIGhlaWdodDogby53aWR0aCArICdweCcsXG4gICAgICAgICAgYmFja2dyb3VuZDogY29sb3IsXG4gICAgICAgICAgYm94U2hhZG93OiBzaGFkb3csXG4gICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnbGVmdCcsXG4gICAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKCcgKyB+figzNjAvby5saW5lcyppK28ucm90YXRlKSArICdkZWcpIHRyYW5zbGF0ZSgnICsgby5yYWRpdXMrJ3B4JyArJywwKScsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAoby5jb3JuZXJzICogby53aWR0aD4+MSkgKyAncHgnXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGZvciAoOyBpIDwgby5saW5lczsgaSsrKSB7XG4gICAgICAgIHNlZyA9IGNzcyhjcmVhdGVFbCgpLCB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAxK34oby53aWR0aC8yKSArICdweCcsXG4gICAgICAgICAgdHJhbnNmb3JtOiBvLmh3YWNjZWwgPyAndHJhbnNsYXRlM2QoMCwwLDApJyA6ICcnLFxuICAgICAgICAgIG9wYWNpdHk6IG8ub3BhY2l0eSxcbiAgICAgICAgICBhbmltYXRpb246IHVzZUNzc0FuaW1hdGlvbnMgJiYgYWRkQW5pbWF0aW9uKG8ub3BhY2l0eSwgby50cmFpbCwgc3RhcnQgKyBpICogby5kaXJlY3Rpb24sIG8ubGluZXMpICsgJyAnICsgMS9vLnNwZWVkICsgJ3MgbGluZWFyIGluZmluaXRlJ1xuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChvLnNoYWRvdykgaW5zKHNlZywgY3NzKGZpbGwoJyMwMDAnLCAnMCAwIDRweCAnICsgJyMwMDAnKSwge3RvcDogMisncHgnfSkpXG4gICAgICAgIGlucyhlbCwgaW5zKHNlZywgZmlsbChnZXRDb2xvcihvLmNvbG9yLCBpKSwgJzAgMCAxcHggcmdiYSgwLDAsMCwuMSknKSkpXG4gICAgICB9XG4gICAgICByZXR1cm4gZWxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgbWV0aG9kIHRoYXQgYWRqdXN0cyB0aGUgb3BhY2l0eSBvZiBhIHNpbmdsZSBsaW5lLlxuICAgICAqIFdpbGwgYmUgb3ZlcndyaXR0ZW4gaW4gVk1MIGZhbGxiYWNrIG1vZGUgYmVsb3cuXG4gICAgICovXG4gICAgb3BhY2l0eTogZnVuY3Rpb24oZWwsIGksIHZhbCkge1xuICAgICAgaWYgKGkgPCBlbC5jaGlsZE5vZGVzLmxlbmd0aCkgZWwuY2hpbGROb2Rlc1tpXS5zdHlsZS5vcGFjaXR5ID0gdmFsXG4gICAgfVxuXG4gIH0pXG5cblxuICBmdW5jdGlvbiBpbml0Vk1MKCkge1xuXG4gICAgLyogVXRpbGl0eSBmdW5jdGlvbiB0byBjcmVhdGUgYSBWTUwgdGFnICovXG4gICAgZnVuY3Rpb24gdm1sKHRhZywgYXR0cikge1xuICAgICAgcmV0dXJuIGNyZWF0ZUVsKCc8JyArIHRhZyArICcgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQuY29tOnZtbFwiIGNsYXNzPVwic3Bpbi12bWxcIj4nLCBhdHRyKVxuICAgIH1cblxuICAgIC8vIE5vIENTUyB0cmFuc2Zvcm1zIGJ1dCBWTUwgc3VwcG9ydCwgYWRkIGEgQ1NTIHJ1bGUgZm9yIFZNTCBlbGVtZW50czpcbiAgICBzaGVldC5hZGRSdWxlKCcuc3Bpbi12bWwnLCAnYmVoYXZpb3I6dXJsKCNkZWZhdWx0I1ZNTCknKVxuXG4gICAgU3Bpbm5lci5wcm90b3R5cGUubGluZXMgPSBmdW5jdGlvbihlbCwgbykge1xuICAgICAgdmFyIHIgPSBvLmxlbmd0aCtvLndpZHRoXG4gICAgICAgICwgcyA9IDIqclxuXG4gICAgICBmdW5jdGlvbiBncnAoKSB7XG4gICAgICAgIHJldHVybiBjc3MoXG4gICAgICAgICAgdm1sKCdncm91cCcsIHtcbiAgICAgICAgICAgIGNvb3Jkc2l6ZTogcyArICcgJyArIHMsXG4gICAgICAgICAgICBjb29yZG9yaWdpbjogLXIgKyAnICcgKyAtclxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHsgd2lkdGg6IHMsIGhlaWdodDogcyB9XG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgdmFyIG1hcmdpbiA9IC0oby53aWR0aCtvLmxlbmd0aCkqMiArICdweCdcbiAgICAgICAgLCBnID0gY3NzKGdycCgpLCB7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogbWFyZ2luLCBsZWZ0OiBtYXJnaW59KVxuICAgICAgICAsIGlcblxuICAgICAgZnVuY3Rpb24gc2VnKGksIGR4LCBmaWx0ZXIpIHtcbiAgICAgICAgaW5zKGcsXG4gICAgICAgICAgaW5zKGNzcyhncnAoKSwge3JvdGF0aW9uOiAzNjAgLyBvLmxpbmVzICogaSArICdkZWcnLCBsZWZ0OiB+fmR4fSksXG4gICAgICAgICAgICBpbnMoY3NzKHZtbCgncm91bmRyZWN0Jywge2FyY3NpemU6IG8uY29ybmVyc30pLCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBvLndpZHRoLFxuICAgICAgICAgICAgICAgIGxlZnQ6IG8ucmFkaXVzLFxuICAgICAgICAgICAgICAgIHRvcDogLW8ud2lkdGg+PjEsXG4gICAgICAgICAgICAgICAgZmlsdGVyOiBmaWx0ZXJcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIHZtbCgnZmlsbCcsIHtjb2xvcjogZ2V0Q29sb3Ioby5jb2xvciwgaSksIG9wYWNpdHk6IG8ub3BhY2l0eX0pLFxuICAgICAgICAgICAgICB2bWwoJ3N0cm9rZScsIHtvcGFjaXR5OiAwfSkgLy8gdHJhbnNwYXJlbnQgc3Ryb2tlIHRvIGZpeCBjb2xvciBibGVlZGluZyB1cG9uIG9wYWNpdHkgY2hhbmdlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIGlmIChvLnNoYWRvdylcbiAgICAgICAgZm9yIChpID0gMTsgaSA8PSBvLmxpbmVzOyBpKyspXG4gICAgICAgICAgc2VnKGksIC0yLCAncHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkJsdXIocGl4ZWxyYWRpdXM9MixtYWtlc2hhZG93PTEsc2hhZG93b3BhY2l0eT0uMyknKVxuXG4gICAgICBmb3IgKGkgPSAxOyBpIDw9IG8ubGluZXM7IGkrKykgc2VnKGkpXG4gICAgICByZXR1cm4gaW5zKGVsLCBnKVxuICAgIH1cblxuICAgIFNwaW5uZXIucHJvdG90eXBlLm9wYWNpdHkgPSBmdW5jdGlvbihlbCwgaSwgdmFsLCBvKSB7XG4gICAgICB2YXIgYyA9IGVsLmZpcnN0Q2hpbGRcbiAgICAgIG8gPSBvLnNoYWRvdyAmJiBvLmxpbmVzIHx8IDBcbiAgICAgIGlmIChjICYmIGkrbyA8IGMuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgYyA9IGMuY2hpbGROb2Rlc1tpK29dOyBjID0gYyAmJiBjLmZpcnN0Q2hpbGQ7IGMgPSBjICYmIGMuZmlyc3RDaGlsZFxuICAgICAgICBpZiAoYykgYy5vcGFjaXR5ID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIHByb2JlID0gY3NzKGNyZWF0ZUVsKCdncm91cCcpLCB7YmVoYXZpb3I6ICd1cmwoI2RlZmF1bHQjVk1MKSd9KVxuXG4gIGlmICghdmVuZG9yKHByb2JlLCAndHJhbnNmb3JtJykgJiYgcHJvYmUuYWRqKSBpbml0Vk1MKClcbiAgZWxzZSB1c2VDc3NBbmltYXRpb25zID0gdmVuZG9yKHByb2JlLCAnYW5pbWF0aW9uJylcblxuICByZXR1cm4gU3Bpbm5lclxuXG59KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBAZW51bSB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRUxFTUVOVDogMSxcbiAgQVRUUklCVVRFOiAyLFxuICBURVhUOiAzLFxuICBDREFUQV9TRUNUSU9OOiA0LFxuICBFTlRJVFlfUkVGRVJFTkNFOiA1LFxuICBFTlRJVFk6IDYsXG4gIFBST0NFU1NJTkdfSU5TVFJVQ1RJT046IDcsXG4gIENPTU1FTlQ6IDgsXG4gIERPQ1VNRU5UOiA5LFxuICBET0NVTUVOVF9UWVBFOiAxMCxcbiAgRE9DVU1FTlRfRlJBR01FTlQ6IDExLFxuICBOT1RBVElPTjogMTJcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCB2YWx1ZSBpcyBub3QgdW5kZWZpbmVkLlxuICpcbiAqIEBwYXJhbSB7P30gdmFsIFZhcmlhYmxlIHRvIHRlc3QuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHZhcmlhYmxlIGlzIGRlZmluZWQuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNEZWYodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZvaWQgMDtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBBZGRzIGEga2V5LXZhbHVlIHBhaXIgdG8gdGhlIG9iamVjdC9tYXAvaGFzaCBpZiBpdCBkb2Vzbid0IGV4aXN0IHlldC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdC48SyxWPn0gb2JqIFRoZSBvYmplY3QgdG8gd2hpY2ggdG8gYWRkIHRoZSBrZXktdmFsdWUgcGFpci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBhZGQuXG4gKiBAcGFyYW0ge1Z9IHZhbHVlIFRoZSB2YWx1ZSB0byBhZGQgaWYgdGhlIGtleSB3YXNuJ3QgcHJlc2VudC5cbiAqIEByZXR1cm4ge1Z9IFRoZSB2YWx1ZSBvZiB0aGUgZW50cnkgYXQgdGhlIGVuZCBvZiB0aGUgZnVuY3Rpb24uXG4gKiBAdGVtcGxhdGUgSyxWXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBrZXkgaW4gb2JqID8gb2JqW2tleV0gOiAob2JqW2tleV0gPSB2YWx1ZSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc0RlZiA9IHJlcXVpcmUoJy4vaXNkZWYnKTtcblxuLyoqXG4gKiBNYWtlIHN1cmUgd2UgdHJpbSBCT00gYW5kIE5CU1BcbiAqIEB0eXBlIHtSZWdFeHB9XG4gKi9cbnZhciBUUklNX1JFID0gL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nO1xuXG4vKipcbiAqIFJlcGVhdHMgYSBzdHJpbmcgbiB0aW1lcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byByZXBlYXQuXG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gcmVwZWF0LlxuICogQHJldHVybiB7U3RyaW5nfSBBIHN0cmluZyBjb250YWluaW5nIHtAY29kZSBsZW5ndGh9IHJlcGV0aXRpb25zIG9mXG4gKiAgICAge0Bjb2RlIHN0cmluZ30uXG4gKi9cbmZ1bmN0aW9uIHJlcGVhdChzdHJpbmcsIGxlbmd0aCkge1xuICByZXR1cm4gbmV3IEFycmF5KGxlbmd0aCArIDEpLmpvaW4oc3RyaW5nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gc3RyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIHRyaW06IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZShUUklNX1JFLCAnJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFBhZHMgbnVtYmVyIHRvIGdpdmVuIGxlbmd0aCBhbmQgb3B0aW9uYWxseSByb3VuZHMgaXQgdG8gYSBnaXZlbiBwcmVjaXNpb24uXG4gICAqIEZvciBleGFtcGxlOlxuICAgKiA8cHJlPnBhZE51bWJlcigxLjI1LCAyLCAzKSAtPiAnMDEuMjUwJ1xuICAgKiBwYWROdW1iZXIoMS4yNSwgMikgLT4gJzAxLjI1J1xuICAgKiBwYWROdW1iZXIoMS4yNSwgMiwgMSkgLT4gJzAxLjMnXG4gICAqIHBhZE51bWJlcigxLjI1LCAwKSAtPiAnMS4yNSc8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG51bSBUaGUgbnVtYmVyIHRvIHBhZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCBUaGUgZGVzaXJlZCBsZW5ndGguXG4gICAqIEBwYXJhbSB7TnVtYmVyPX0gb3B0X3ByZWNpc2lvbiBUaGUgZGVzaXJlZCBwcmVjaXNpb24uXG4gICAqIEByZXR1cm4ge1N0cmluZ30ge0Bjb2RlIG51bX0gYXMgYSBzdHJpbmcgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHBhZE51bWJlcjogZnVuY3Rpb24obnVtLCBsZW5ndGgsIG9wdF9wcmVjaXNpb24pIHtcbiAgICB2YXIgcyA9IGlzRGVmKG9wdF9wcmVjaXNpb24pID8gbnVtLnRvRml4ZWQob3B0X3ByZWNpc2lvbikgOiBTdHJpbmcobnVtKTtcbiAgICB2YXIgaW5kZXggPSBzLmluZGV4T2YoJy4nKTtcbiAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgIGluZGV4ID0gcy5sZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiByZXBlYXQoJzAnLCBNYXRoLm1heCgwLCBsZW5ndGggLSBpbmRleCkpICsgcztcbiAgfVxuXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBYTUxQYXJzZXIgPSByZXF1aXJlKCcuL3htbF9wYXJzZXInKTtcbnZhciBpc0RlZiA9IHJlcXVpcmUoJy4vdXRpbHMvaXNkZWYnKTtcbnZhciBub2RlVHlwZXMgPSByZXF1aXJlKCcuL25vZGVfdHlwZXMnKTtcbnZhciBzZXRJZlVuZGVmaW5lZCA9IHJlcXVpcmUoJy4vdXRpbHMvc2V0aWZ1bmRlZmluZWQnKTtcbnZhciBYU0QgPSByZXF1aXJlKCcuL3hzZCcpO1xudmFyIFhMaW5rID0gcmVxdWlyZSgnLi94bGluaycpO1xuXG4vKipcbiAqIFdNUyBDYXBhYmlsaXRpZXMgcGFyc2VyXG4gKlxuICogQHBhcmFtIHtTdHJpbmc9fSB4bWxTdHJpbmdcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBXTVMoeG1sU3RyaW5nKSB7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0aGlzLnZlcnNpb24gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtYTUxQYXJzZXJ9XG4gICAqL1xuICB0aGlzLl9wYXJzZXIgPSBuZXcgWE1MUGFyc2VyKCk7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTdHJpbmc9fVxuICAgKi9cbiAgdGhpcy5fZGF0YSA9IHhtbFN0cmluZztcbn07XG5cbi8qKlxuICogU2hvcnRjdXRcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xudmFyIG1ha2VQcm9wZXJ0eVNldHRlciA9IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlTZXR0ZXI7XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHhtbFN0cmluZ1xuICogQHJldHVybiB7V01TfVxuICovXG5XTVMucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbih4bWxTdHJpbmcpIHtcbiAgdGhpcy5fZGF0YSA9IHhtbFN0cmluZztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge1N0cmluZz19IHhtbFN0cmluZ1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5XTVMucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKHhtbFN0cmluZykge1xuICB4bWxTdHJpbmcgPSB4bWxTdHJpbmcgfHwgdGhpcy5fZGF0YTtcbiAgcmV0dXJuIHRoaXMucGFyc2UoeG1sU3RyaW5nKTtcbn07XG5cbi8qKlxuICogQHJldHVybiB7U3RyaW5nfSB4bWxcbiAqL1xuV01TLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHhtbFN0cmluZykge1xuICByZXR1cm4gdGhpcy5fcmVhZEZyb21Eb2N1bWVudCh0aGlzLl9wYXJzZXIudG9Eb2N1bWVudCh4bWxTdHJpbmcpKTtcbn07XG5cbi8qKlxuICogQHBhcmFtICB7RG9jdW1lbnR9IGRvY1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5XTVMucHJvdG90eXBlLl9yZWFkRnJvbURvY3VtZW50ID0gZnVuY3Rpb24oZG9jKSB7XG4gIGZvciAodmFyIG5vZGUgPSBkb2MuZmlyc3RDaGlsZDsgbm9kZTsgbm9kZSA9IG5vZGUubmV4dFNpYmxpbmcpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PSBub2RlVHlwZXMuRUxFTUVOVCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZEZyb21Ob2RlKG5vZGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogQHBhcmFtICB7RE9NTm9kZX0gbm9kZVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5XTVMucHJvdG90eXBlLnJlYWRGcm9tTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgdGhpcy52ZXJzaW9uID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ3ZlcnNpb24nKTtcbiAgdmFyIHdtc0NhcGFiaWxpdHlPYmplY3QgPSBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHtcbiAgICAndmVyc2lvbic6IHRoaXMudmVyc2lvblxuICB9LCBXTVMuUEFSU0VSUywgbm9kZSwgW10pO1xuXG4gIHJldHVybiB3bXNDYXBhYmlsaXR5T2JqZWN0IHx8IG51bGw7XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBBdHRyaWJ1dGlvbiBvYmplY3QuXG4gKi9cbldNUy5fcmVhZEF0dHJpYnV0aW9uID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5BVFRSSUJVVElPTl9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdH0gQm91bmRpbmcgYm94IG9iamVjdC5cbiAqL1xuV01TLl9yZWFkQm91bmRpbmdCb3ggPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICB2YXIgcmVhZERlY2ltYWxTdHJpbmcgPSBYU0QucmVhZERlY2ltYWxTdHJpbmc7XG4gIHZhciBleHRlbnQgPSBbXG4gICAgcmVhZERlY2ltYWxTdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ21pbngnKSksXG4gICAgcmVhZERlY2ltYWxTdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ21pbnknKSksXG4gICAgcmVhZERlY2ltYWxTdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ21heHgnKSksXG4gICAgcmVhZERlY2ltYWxTdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ21heHknKSlcbiAgXTtcblxuICB2YXIgcmVzb2x1dGlvbnMgPSBbXG4gICAgcmVhZERlY2ltYWxTdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ3Jlc3gnKSksXG4gICAgcmVhZERlY2ltYWxTdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ3Jlc3knKSlcbiAgXTtcblxuICByZXR1cm4ge1xuICAgICdjcnMnOiBub2RlLmdldEF0dHJpYnV0ZSgnQ1JTJyksXG4gICAgJ2V4dGVudCc6IGV4dGVudCxcbiAgICAncmVzJzogcmVzb2x1dGlvbnNcbiAgfTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7b2wuRXh0ZW50fHVuZGVmaW5lZH0gQm91bmRpbmcgYm94IG9iamVjdC5cbiAqL1xuV01TLl9yZWFkRVhHZW9ncmFwaGljQm91bmRpbmdCb3ggPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICB2YXIgZ2VvZ3JhcGhpY0JvdW5kaW5nQm94ID0gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSxcbiAgICBXTVMuRVhfR0VPR1JBUEhJQ19CT1VORElOR19CT1hfUEFSU0VSUyxcbiAgICBub2RlLCBvYmplY3RTdGFjayk7XG4gIGlmICghaXNEZWYoZ2VvZ3JhcGhpY0JvdW5kaW5nQm94KSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgd2VzdEJvdW5kTG9uZ2l0dWRlID0gLyoqIEB0eXBlIHtudW1iZXJ8dW5kZWZpbmVkfSAqL1xuICAgIChnZW9ncmFwaGljQm91bmRpbmdCb3hbJ3dlc3RCb3VuZExvbmdpdHVkZSddKTtcbiAgdmFyIHNvdXRoQm91bmRMYXRpdHVkZSA9IC8qKiBAdHlwZSB7bnVtYmVyfHVuZGVmaW5lZH0gKi9cbiAgICAoZ2VvZ3JhcGhpY0JvdW5kaW5nQm94Wydzb3V0aEJvdW5kTGF0aXR1ZGUnXSk7XG4gIHZhciBlYXN0Qm91bmRMb25naXR1ZGUgPSAvKiogQHR5cGUge251bWJlcnx1bmRlZmluZWR9ICovXG4gICAgKGdlb2dyYXBoaWNCb3VuZGluZ0JveFsnZWFzdEJvdW5kTG9uZ2l0dWRlJ10pO1xuICB2YXIgbm9ydGhCb3VuZExhdGl0dWRlID0gLyoqIEB0eXBlIHtudW1iZXJ8dW5kZWZpbmVkfSAqL1xuICAgIChnZW9ncmFwaGljQm91bmRpbmdCb3hbJ25vcnRoQm91bmRMYXRpdHVkZSddKTtcblxuICBpZiAoIWlzRGVmKHdlc3RCb3VuZExvbmdpdHVkZSkgfHwgIWlzRGVmKHNvdXRoQm91bmRMYXRpdHVkZSkgfHxcbiAgICAhaXNEZWYoZWFzdEJvdW5kTG9uZ2l0dWRlKSB8fCAhaXNEZWYobm9ydGhCb3VuZExhdGl0dWRlKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gW1xuICAgIHdlc3RCb3VuZExvbmdpdHVkZSwgc291dGhCb3VuZExhdGl0dWRlLFxuICAgIGVhc3RCb3VuZExvbmdpdHVkZSwgbm9ydGhCb3VuZExhdGl0dWRlXG4gIF07XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IENhcGFiaWxpdHkgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRDYXBhYmlsaXR5ID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5DQVBBQklMSVRZX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gU2VydmljZSBvYmplY3QuXG4gKi9cbldNUy5fcmVhZFNlcnZpY2UgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLlNFUlZJQ0VfUEFSU0VSUywgbm9kZSwgb2JqZWN0U3RhY2spO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBDb250YWN0IGluZm9ybWF0aW9uIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkQ29udGFjdEluZm9ybWF0aW9uID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5DT05UQUNUX0lORk9STUFUSU9OX1BBUlNFUlMsXG4gICAgbm9kZSwgb2JqZWN0U3RhY2spO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBDb250YWN0IHBlcnNvbiBvYmplY3QuXG4gKi9cbldNUy5fcmVhZENvbnRhY3RQZXJzb25QcmltYXJ5ID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5DT05UQUNUX1BFUlNPTl9QQVJTRVJTLFxuICAgIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gQ29udGFjdCBhZGRyZXNzIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkQ29udGFjdEFkZHJlc3MgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLkNPTlRBQ1RfQUREUkVTU19QQVJTRVJTLFxuICAgIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz58dW5kZWZpbmVkfSBGb3JtYXQgYXJyYXkuXG4gKi9cbldNUy5fcmVhZEV4Y2VwdGlvbiA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKFxuICAgIFtdLCBXTVMuRVhDRVBUSU9OX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gTGF5ZXIgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRDYXBhYmlsaXR5TGF5ZXIgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLkxBWUVSX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gTGF5ZXIgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRMYXllciA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHZhciBwYXJlbnRMYXllck9iamVjdCA9IC8qKiAgQHR5cGUge09iamVjdC48c3RyaW5nLCo+fSAqL1xuICAgIChvYmplY3RTdGFja1tvYmplY3RTdGFjay5sZW5ndGggLSAxXSk7XG5cbiAgdmFyIGxheWVyT2JqZWN0ID0gLyoqICBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsKj59ICovXG4gICAgKFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5MQVlFUl9QQVJTRVJTLFxuICAgICAgbm9kZSwgb2JqZWN0U3RhY2spKTtcblxuICBpZiAoIWlzRGVmKGxheWVyT2JqZWN0KSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgcXVlcnlhYmxlID0gWFNELnJlYWRCb29sZWFuU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdxdWVyeWFibGUnKSk7XG4gIGlmICghaXNEZWYocXVlcnlhYmxlKSkge1xuICAgIHF1ZXJ5YWJsZSA9IHBhcmVudExheWVyT2JqZWN0WydxdWVyeWFibGUnXTtcbiAgfVxuICBsYXllck9iamVjdFsncXVlcnlhYmxlJ10gPSBpc0RlZihxdWVyeWFibGUpID8gcXVlcnlhYmxlIDogZmFsc2U7XG5cbiAgdmFyIGNhc2NhZGVkID0gWFNELnJlYWROb25OZWdhdGl2ZUludGVnZXJTdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ2Nhc2NhZGVkJykpO1xuICBpZiAoIWlzRGVmKGNhc2NhZGVkKSkge1xuICAgIGNhc2NhZGVkID0gcGFyZW50TGF5ZXJPYmplY3RbJ2Nhc2NhZGVkJ107XG4gIH1cbiAgbGF5ZXJPYmplY3RbJ2Nhc2NhZGVkJ10gPSBjYXNjYWRlZDtcblxuICB2YXIgb3BhcXVlID0gWFNELnJlYWRCb29sZWFuU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdvcGFxdWUnKSk7XG4gIGlmICghaXNEZWYob3BhcXVlKSkge1xuICAgIG9wYXF1ZSA9IHBhcmVudExheWVyT2JqZWN0WydvcGFxdWUnXTtcbiAgfVxuICBsYXllck9iamVjdFsnb3BhcXVlJ10gPSBpc0RlZihvcGFxdWUpID8gb3BhcXVlIDogZmFsc2U7XG5cbiAgdmFyIG5vU3Vic2V0cyA9IFhTRC5yZWFkQm9vbGVhblN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnbm9TdWJzZXRzJykpO1xuICBpZiAoIWlzRGVmKG5vU3Vic2V0cykpIHtcbiAgICBub1N1YnNldHMgPSBwYXJlbnRMYXllck9iamVjdFsnbm9TdWJzZXRzJ107XG4gIH1cbiAgbGF5ZXJPYmplY3RbJ25vU3Vic2V0cyddID0gaXNEZWYobm9TdWJzZXRzKSA/IG5vU3Vic2V0cyA6IGZhbHNlO1xuXG4gIHZhciBmaXhlZFdpZHRoID0gWFNELnJlYWREZWNpbWFsU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdmaXhlZFdpZHRoJykpO1xuICBpZiAoIWlzRGVmKGZpeGVkV2lkdGgpKSB7XG4gICAgZml4ZWRXaWR0aCA9IHBhcmVudExheWVyT2JqZWN0WydmaXhlZFdpZHRoJ107XG4gIH1cbiAgbGF5ZXJPYmplY3RbJ2ZpeGVkV2lkdGgnXSA9IGZpeGVkV2lkdGg7XG5cbiAgdmFyIGZpeGVkSGVpZ2h0ID0gWFNELnJlYWREZWNpbWFsU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdmaXhlZEhlaWdodCcpKTtcbiAgaWYgKCFpc0RlZihmaXhlZEhlaWdodCkpIHtcbiAgICBmaXhlZEhlaWdodCA9IHBhcmVudExheWVyT2JqZWN0WydmaXhlZEhlaWdodCddO1xuICB9XG4gIGxheWVyT2JqZWN0WydmaXhlZEhlaWdodCddID0gZml4ZWRIZWlnaHQ7XG5cbiAgLy8gU2VlIDcuMi40LjhcbiAgdmFyIGFkZEtleXMgPSBbJ1N0eWxlJywgJ0NSUycsICdBdXRob3JpdHlVUkwnXTtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFkZEtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIga2V5ID0gYWRkS2V5c1tpXTtcbiAgICB2YXIgcGFyZW50VmFsdWUgPSBwYXJlbnRMYXllck9iamVjdFtrZXldO1xuICAgIGlmIChpc0RlZihwYXJlbnRWYWx1ZSkpIHtcbiAgICAgIHZhciBjaGlsZFZhbHVlID0gc2V0SWZVbmRlZmluZWQobGF5ZXJPYmplY3QsIGtleSwgW10pO1xuICAgICAgY2hpbGRWYWx1ZSA9IGNoaWxkVmFsdWUuY29uY2F0KHBhcmVudFZhbHVlKTtcbiAgICAgIGxheWVyT2JqZWN0W2tleV0gPSBjaGlsZFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHZhciByZXBsYWNlS2V5cyA9IFsnRVhfR2VvZ3JhcGhpY0JvdW5kaW5nQm94JywgJ0JvdW5kaW5nQm94JywgJ0RpbWVuc2lvbicsXG4gICAgJ0F0dHJpYnV0aW9uJywgJ01pblNjYWxlRGVub21pbmF0b3InLCAnTWF4U2NhbGVEZW5vbWluYXRvcidcbiAgXTtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcGxhY2VLZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGtleSA9IHJlcGxhY2VLZXlzW2ldO1xuICAgIHZhciBjaGlsZFZhbHVlID0gbGF5ZXJPYmplY3Rba2V5XTtcbiAgICBpZiAoIWlzRGVmKGNoaWxkVmFsdWUpKSB7XG4gICAgICB2YXIgcGFyZW50VmFsdWUgPSBwYXJlbnRMYXllck9iamVjdFtrZXldO1xuICAgICAgbGF5ZXJPYmplY3Rba2V5XSA9IHBhcmVudFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsYXllck9iamVjdDtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fSBEaW1lbnNpb24gb2JqZWN0LlxuICovXG5XTVMuX3JlYWREaW1lbnNpb24gPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICB2YXIgZGltZW5zaW9uT2JqZWN0ID0ge1xuICAgICduYW1lJzogbm9kZS5nZXRBdHRyaWJ1dGUoJ25hbWUnKSxcbiAgICAndW5pdHMnOiBub2RlLmdldEF0dHJpYnV0ZSgndW5pdHMnKSxcbiAgICAndW5pdFN5bWJvbCc6IG5vZGUuZ2V0QXR0cmlidXRlKCd1bml0U3ltYm9sJyksXG4gICAgJ2RlZmF1bHQnOiBub2RlLmdldEF0dHJpYnV0ZSgnZGVmYXVsdCcpLFxuICAgICdtdWx0aXBsZVZhbHVlcyc6IFhTRC5yZWFkQm9vbGVhblN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnbXVsdGlwbGVWYWx1ZXMnKSksXG4gICAgJ25lYXJlc3RWYWx1ZSc6IFhTRC5yZWFkQm9vbGVhblN0cmluZyhub2RlLmdldEF0dHJpYnV0ZSgnbmVhcmVzdFZhbHVlJykpLFxuICAgICdjdXJyZW50JzogWFNELnJlYWRCb29sZWFuU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCdjdXJyZW50JykpLFxuICAgICd2YWx1ZXMnOiBYU0QucmVhZFN0cmluZyhub2RlKVxuICB9O1xuICByZXR1cm4gZGltZW5zaW9uT2JqZWN0O1xufTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBPbmxpbmUgcmVzb3VyY2Ugb2JqZWN0LlxuICovXG5XTVMuX3JlYWRGb3JtYXRPbmxpbmVyZXNvdXJjZSA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuRk9STUFUX09OTElORVJFU09VUkNFX1BBUlNFUlMsXG4gICAgbm9kZSwgb2JqZWN0U3RhY2spO1xufTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfSBSZXF1ZXN0IG9iamVjdC5cbiAqL1xuV01TLl9yZWFkUmVxdWVzdCA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuUkVRVUVTVF9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IERDUCB0eXBlIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkRENQVHlwZSA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHJldHVybiBYTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wKHt9LCBXTVMuRENQVFlQRV9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IEhUVFAgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRIVFRQID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5IVFRQX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gT3BlcmF0aW9uIHR5cGUgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRPcGVyYXRpb25UeXBlID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3Aoe30sIFdNUy5PUEVSQVRJT05UWVBFX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gT25saW5lIHJlc291cmNlIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkU2l6ZWRGb3JtYXRPbmxpbmVyZXNvdXJjZSA9IGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gIHZhciBmb3JtYXRPbmxpbmVyZXNvdXJjZSA9IFdNUy5fcmVhZEZvcm1hdE9ubGluZXJlc291cmNlKG5vZGUsIG9iamVjdFN0YWNrKTtcbiAgaWYgKGlzRGVmKGZvcm1hdE9ubGluZXJlc291cmNlKSkge1xuICAgIHZhciByZWFkTm9uTmVnYXRpdmVJbnRlZ2VyU3RyaW5nID0gWFNELnJlYWROb25OZWdhdGl2ZUludGVnZXJTdHJpbmc7XG4gICAgdmFyIHNpemUgPSBbXG4gICAgICByZWFkTm9uTmVnYXRpdmVJbnRlZ2VyU3RyaW5nKG5vZGUuZ2V0QXR0cmlidXRlKCd3aWR0aCcpKSxcbiAgICAgIHJlYWROb25OZWdhdGl2ZUludGVnZXJTdHJpbmcobm9kZS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKVxuICAgIF07XG4gICAgZm9ybWF0T25saW5lcmVzb3VyY2VbJ3NpemUnXSA9IHNpemU7XG4gICAgcmV0dXJuIGZvcm1hdE9ubGluZXJlc291cmNlO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IEF1dGhvcml0eSBVUkwgb2JqZWN0LlxuICovXG5XTVMuX3JlYWRBdXRob3JpdHlVUkwgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICB2YXIgYXV0aG9yaXR5T2JqZWN0ID0gV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2Uobm9kZSwgb2JqZWN0U3RhY2spO1xuICBpZiAoaXNEZWYoYXV0aG9yaXR5T2JqZWN0KSkge1xuICAgIGF1dGhvcml0eU9iamVjdFsnbmFtZSddID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICByZXR1cm4gYXV0aG9yaXR5T2JqZWN0O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IE1ldGFkYXRhIFVSTCBvYmplY3QuXG4gKi9cbldNUy5fcmVhZE1ldGFkYXRhVVJMID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgdmFyIG1ldGFkYXRhT2JqZWN0ID0gV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2Uobm9kZSwgb2JqZWN0U3RhY2spO1xuICBpZiAoaXNEZWYobWV0YWRhdGFPYmplY3QpKSB7XG4gICAgbWV0YWRhdGFPYmplY3RbJ3R5cGUnXSA9IG5vZGUuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgcmV0dXJuIG1ldGFkYXRhT2JqZWN0O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtBcnJheS48Kj59IG9iamVjdFN0YWNrIE9iamVjdCBzdGFjay5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9IFN0eWxlIG9iamVjdC5cbiAqL1xuV01TLl9yZWFkU3R5bGUgPSBmdW5jdGlvbihub2RlLCBvYmplY3RTdGFjaykge1xuICByZXR1cm4gWE1MUGFyc2VyLnB1c2hQYXJzZUFuZFBvcCh7fSwgV01TLlNUWUxFX1BBUlNFUlMsIG5vZGUsIG9iamVjdFN0YWNrKTtcbn07XG5cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz58dW5kZWZpbmVkfSBLZXl3b3JkIGxpc3QuXG4gKi9cbldNUy5fcmVhZEtleXdvcmRMaXN0ID0gZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgcmV0dXJuIFhNTFBhcnNlci5wdXNoUGFyc2VBbmRQb3AoXG4gICAgW10sIFdNUy5LRVlXT1JETElTVF9QQVJTRVJTLCBub2RlLCBvYmplY3RTdGFjayk7XG59O1xuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge0FycmF5LjxzdHJpbmc+fVxuICovXG5XTVMuTkFNRVNQQUNFX1VSSVMgPSBbXG4gIG51bGwsXG4gICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3dtcydcbl07XG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnU2VydmljZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRTZXJ2aWNlKSxcbiAgICAnQ2FwYWJpbGl0eSc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRDYXBhYmlsaXR5KVxuICB9KTtcblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5DQVBBQklMSVRZX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ1JlcXVlc3QnOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkUmVxdWVzdCksXG4gICAgJ0V4Y2VwdGlvbic6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRFeGNlcHRpb24pLFxuICAgICdMYXllcic6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRDYXBhYmlsaXR5TGF5ZXIpXG4gIH0pO1xuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLlNFUlZJQ0VfUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnTmFtZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ1RpdGxlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnQWJzdHJhY3QnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdLZXl3b3JkTGlzdCc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRLZXl3b3JkTGlzdCksXG4gICAgJ09ubGluZVJlc291cmNlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhMaW5rLnJlYWRIcmVmKSxcbiAgICAnQ29udGFjdEluZm9ybWF0aW9uJzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZENvbnRhY3RJbmZvcm1hdGlvbiksXG4gICAgJ0ZlZXMnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdBY2Nlc3NDb25zdHJhaW50cyc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0xheWVyTGltaXQnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWROb25OZWdhdGl2ZUludGVnZXIpLFxuICAgICdNYXhXaWR0aCc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZE5vbk5lZ2F0aXZlSW50ZWdlciksXG4gICAgJ01heEhlaWdodCc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZE5vbk5lZ2F0aXZlSW50ZWdlcilcbiAgfSk7XG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuQ09OVEFDVF9JTkZPUk1BVElPTl9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdDb250YWN0UGVyc29uUHJpbWFyeSc6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRDb250YWN0UGVyc29uUHJpbWFyeSksXG4gICAgJ0NvbnRhY3RQb3NpdGlvbic6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0NvbnRhY3RBZGRyZXNzJzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZENvbnRhY3RBZGRyZXNzKSxcbiAgICAnQ29udGFjdFZvaWNlVGVsZXBob25lJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnQ29udGFjdEZhY3NpbWlsZVRlbGVwaG9uZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0NvbnRhY3RFbGVjdHJvbmljTWFpbEFkZHJlc3MnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpXG4gIH0pO1xuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkNPTlRBQ1RfUEVSU09OX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0NvbnRhY3RQZXJzb24nOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdDb250YWN0T3JnYW5pemF0aW9uJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkNPTlRBQ1RfQUREUkVTU19QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdBZGRyZXNzVHlwZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0FkZHJlc3MnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdDaXR5JzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnU3RhdGVPclByb3ZpbmNlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnUG9zdENvZGUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdDb3VudHJ5JzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkVYQ0VQVElPTl9QQVJTRVJTID0gWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoXG4gIFdNUy5OQU1FU1BBQ0VfVVJJUywge1xuICAgICdGb3JtYXQnOiBYTUxQYXJzZXIubWFrZUFycmF5UHVzaGVyKFhTRC5yZWFkU3RyaW5nKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkxBWUVSX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ05hbWUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdUaXRsZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0Fic3RyYWN0JzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnS2V5d29yZExpc3QnOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkS2V5d29yZExpc3QpLFxuICAgICdDUlMnOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnRVhfR2VvZ3JhcGhpY0JvdW5kaW5nQm94JzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZEVYR2VvZ3JhcGhpY0JvdW5kaW5nQm94KSxcbiAgICAnQm91bmRpbmdCb3gnOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFdNUy5fcmVhZEJvdW5kaW5nQm94KSxcbiAgICAnRGltZW5zaW9uJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihXTVMuX3JlYWREaW1lbnNpb24pLFxuICAgICdBdHRyaWJ1dGlvbic6IG1ha2VQcm9wZXJ0eVNldHRlcihXTVMuX3JlYWRBdHRyaWJ1dGlvbiksXG4gICAgJ0F1dGhvcml0eVVSTCc6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoV01TLl9yZWFkQXV0aG9yaXR5VVJMKSxcbiAgICAnSWRlbnRpZmllcic6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdNZXRhZGF0YVVSTCc6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoV01TLl9yZWFkTWV0YWRhdGFVUkwpLFxuICAgICdEYXRhVVJMJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihXTVMuX3JlYWRGb3JtYXRPbmxpbmVyZXNvdXJjZSksXG4gICAgJ0ZlYXR1cmVMaXN0VVJMJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihXTVMuX3JlYWRGb3JtYXRPbmxpbmVyZXNvdXJjZSksXG4gICAgJ1N0eWxlJzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihXTVMuX3JlYWRTdHlsZSksXG4gICAgJ01pblNjYWxlRGVub21pbmF0b3InOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWREZWNpbWFsKSxcbiAgICAnTWF4U2NhbGVEZW5vbWluYXRvcic6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZERlY2ltYWwpLFxuICAgICdMYXllcic6IFhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlQdXNoZXIoV01TLl9yZWFkTGF5ZXIpXG4gIH0pO1xuXG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuQVRUUklCVVRJT05fUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnVGl0bGUnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdPbmxpbmVSZXNvdXJjZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYTGluay5yZWFkSHJlZiksXG4gICAgJ0xvZ29VUkwnOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkU2l6ZWRGb3JtYXRPbmxpbmVyZXNvdXJjZSlcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5FWF9HRU9HUkFQSElDX0JPVU5ESU5HX0JPWF9QQVJTRVJTID1cbiAgWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMoV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ3dlc3RCb3VuZExvbmdpdHVkZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFhTRC5yZWFkRGVjaW1hbCksXG4gICAgJ2Vhc3RCb3VuZExvbmdpdHVkZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFhTRC5yZWFkRGVjaW1hbCksXG4gICAgJ3NvdXRoQm91bmRMYXRpdHVkZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFhTRC5yZWFkRGVjaW1hbCksXG4gICAgJ25vcnRoQm91bmRMYXRpdHVkZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFhTRC5yZWFkRGVjaW1hbClcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5SRVFVRVNUX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0dldENhcGFiaWxpdGllcyc6IG1ha2VQcm9wZXJ0eVNldHRlcihcbiAgICAgIFdNUy5fcmVhZE9wZXJhdGlvblR5cGUpLFxuICAgICdHZXRNYXAnOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBXTVMuX3JlYWRPcGVyYXRpb25UeXBlKSxcbiAgICAnR2V0RmVhdHVyZUluZm8nOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBXTVMuX3JlYWRPcGVyYXRpb25UeXBlKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLk9QRVJBVElPTlRZUEVfUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnRm9ybWF0JzogWE1MUGFyc2VyLm1ha2VPYmplY3RQcm9wZXJ0eVB1c2hlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ0RDUFR5cGUnOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFxuICAgICAgV01TLl9yZWFkRENQVHlwZSlcbiAgfSk7XG5cblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn1cbiAqIEBwcml2YXRlXG4gKi9cbldNUy5EQ1BUWVBFX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0hUVFAnOiBtYWtlUHJvcGVydHlTZXR0ZXIoXG4gICAgICBXTVMuX3JlYWRIVFRQKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLkhUVFBfUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnR2V0JzogbWFrZVByb3BlcnR5U2V0dGVyKFxuICAgICAgV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2UpLFxuICAgICdQb3N0JzogbWFrZVByb3BlcnR5U2V0dGVyKFxuICAgICAgV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2UpXG4gIH0pO1xuXG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuU1RZTEVfUEFSU0VSUyA9IFhNTFBhcnNlci5tYWtlUGFyc2Vyc05TKFxuICBXTVMuTkFNRVNQQUNFX1VSSVMsIHtcbiAgICAnTmFtZSc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ1RpdGxlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhTRC5yZWFkU3RyaW5nKSxcbiAgICAnQWJzdHJhY3QnOiBtYWtlUHJvcGVydHlTZXR0ZXIoWFNELnJlYWRTdHJpbmcpLFxuICAgICdMZWdlbmRVUkwnOiBYTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyKFdNUy5fcmVhZFNpemVkRm9ybWF0T25saW5lcmVzb3VyY2UpLFxuICAgICdTdHlsZVNoZWV0VVJMJzogbWFrZVByb3BlcnR5U2V0dGVyKFdNUy5fcmVhZEZvcm1hdE9ubGluZXJlc291cmNlKSxcbiAgICAnU3R5bGVVUkwnOiBtYWtlUHJvcGVydHlTZXR0ZXIoV01TLl9yZWFkRm9ybWF0T25saW5lcmVzb3VyY2UpXG4gIH0pO1xuXG5cbi8qKlxuICogQGNvbnN0XG4gKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59XG4gKiBAcHJpdmF0ZVxuICovXG5XTVMuRk9STUFUX09OTElORVJFU09VUkNFX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0Zvcm1hdCc6IG1ha2VQcm9wZXJ0eVNldHRlcihYU0QucmVhZFN0cmluZyksXG4gICAgJ09ubGluZVJlc291cmNlJzogbWFrZVByb3BlcnR5U2V0dGVyKFhMaW5rLnJlYWRIcmVmKVxuICB9KTtcblxuXG4vKipcbiAqIEBjb25zdFxuICogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fVxuICogQHByaXZhdGVcbiAqL1xuV01TLktFWVdPUkRMSVNUX1BBUlNFUlMgPSBYTUxQYXJzZXIubWFrZVBhcnNlcnNOUyhcbiAgV01TLk5BTUVTUEFDRV9VUklTLCB7XG4gICAgJ0tleXdvcmQnOiBYTUxQYXJzZXIubWFrZUFycmF5UHVzaGVyKFhTRC5yZWFkU3RyaW5nKVxuICB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBXTVM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbnZhciBOQU1FU1BBQ0VfVVJJID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW58dW5kZWZpbmVkfSBCb29sZWFuLlxuICAgKi9cbiAgcmVhZEhyZWY6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGVOUyhOQU1FU1BBQ0VfVVJJLCAnaHJlZicpO1xuICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc0RlZiA9IHJlcXVpcmUoJy4vdXRpbHMvaXNkZWYnKTtcbnZhciBzZXRJZlVuZGVmaW5lZCA9IHJlcXVpcmUoJy4vdXRpbHMvc2V0aWZ1bmRlZmluZWQnKTtcbnZhciBub2RlVHlwZXMgPSByZXF1aXJlKCcuL25vZGVfdHlwZXMnKTtcblxuLyoqXG4gKiBYTUwgRE9NIHBhcnNlclxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFhNTFBhcnNlcigpIHtcblxuICAvKipcbiAgICogQHR5cGUge0RPTVBhcnNlcn1cbiAgICovXG4gIHRoaXMuX3BhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbn07XG5cbi8qKlxuICogQHBhcmFtICB7U3RyaW5nfSB4bWxzdHJpbmdcbiAqIEByZXR1cm4ge0RvY3VtZW50fVxuICovXG5YTUxQYXJzZXIucHJvdG90eXBlLnRvRG9jdW1lbnQgPSBmdW5jdGlvbih4bWxzdHJpbmcpIHtcbiAgcmV0dXJuIHRoaXMuX3BhcnNlci5wYXJzZUZyb21TdHJpbmcoeG1sc3RyaW5nLCAnYXBwbGljYXRpb24veG1sJyk7XG59O1xuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGdyYWIgYWxsIHRleHQgY29udGVudCBvZiBjaGlsZCBub2RlcyBpbnRvIGEgc2luZ2xlIHN0cmluZy5cbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHBhcmFtIHtib29sZWFufSBub3JtYWxpemVXaGl0ZXNwYWNlIE5vcm1hbGl6ZSB3aGl0ZXNwYWNlOiByZW1vdmUgYWxsIGxpbmVcbiAqIGJyZWFrcy5cbiAqIEByZXR1cm4ge3N0cmluZ30gQWxsIHRleHQgY29udGVudC5cbiAqIEBhcGlcbiAqL1xuWE1MUGFyc2VyLmdldEFsbFRleHRDb250ZW50ID0gZnVuY3Rpb24obm9kZSwgbm9ybWFsaXplV2hpdGVzcGFjZSkge1xuICByZXR1cm4gWE1MUGFyc2VyLmdldEFsbFRleHRDb250ZW50Xyhub2RlLCBub3JtYWxpemVXaGl0ZXNwYWNlLCBbXSkuam9pbignJyk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IG5vcm1hbGl6ZVdoaXRlc3BhY2UgTm9ybWFsaXplIHdoaXRlc3BhY2U6IHJlbW92ZSBhbGwgbGluZVxuICogYnJlYWtzLlxuICogQHBhcmFtIHtBcnJheS48U3RyaW5nfHN0cmluZz59IGFjY3VtdWxhdG9yIEFjY3VtdWxhdG9yLlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge0FycmF5LjxTdHJpbmd8c3RyaW5nPn0gQWNjdW11bGF0b3IuXG4gKi9cblhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudF8gPSBmdW5jdGlvbihub2RlLCBub3JtYWxpemVXaGl0ZXNwYWNlLCBhY2N1bXVsYXRvcikge1xuICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gbm9kZVR5cGVzLkNEQVRBX1NFQ1RJT04gfHxcbiAgICBub2RlLm5vZGVUeXBlID09PSBub2RlVHlwZXMuVEVYVCkge1xuICAgIGlmIChub3JtYWxpemVXaGl0ZXNwYWNlKSB7XG4gICAgICAvLyBGSVhNRSB1bmRlcnN0YW5kIHdoeSBnb29nLmRvbS5nZXRUZXh0Q29udGVudF8gdXNlcyBTdHJpbmcgaGVyZVxuICAgICAgYWNjdW11bGF0b3IucHVzaChTdHJpbmcobm9kZS5ub2RlVmFsdWUpLnJlcGxhY2UoLyhcXHJcXG58XFxyfFxcbikvZywgJycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjdW11bGF0b3IucHVzaChub2RlLm5vZGVWYWx1ZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBuO1xuICAgIGZvciAobiA9IG5vZGUuZmlyc3RDaGlsZDsgbjsgbiA9IG4ubmV4dFNpYmxpbmcpIHtcbiAgICAgIFhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudF8obiwgbm9ybWFsaXplV2hpdGVzcGFjZSwgYWNjdW11bGF0b3IpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYWNjdW11bGF0b3I7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIE9iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPj59IHBhcnNlcnNOU1xuICogICAgIFBhcnNlcnMgYnkgbmFtZXNwYWNlLlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHBhcmFtIHsqPX0gYmluZCBUaGUgb2JqZWN0IHRvIHVzZSBhcyBgdGhpc2AuXG4gKi9cblhNTFBhcnNlci5wYXJzZU5vZGUgPSBmdW5jdGlvbihwYXJzZXJzTlMsIG5vZGUsIG9iamVjdFN0YWNrLCBiaW5kKSB7XG4gIHZhciBuO1xuICBmb3IgKG4gPSBub2RlLmZpcnN0RWxlbWVudENoaWxkOyBuOyBuID0gbi5uZXh0RWxlbWVudFNpYmxpbmcpIHtcbiAgICB2YXIgcGFyc2VycyA9IHBhcnNlcnNOU1tuLm5hbWVzcGFjZVVSSV07XG4gICAgaWYgKGlzRGVmKHBhcnNlcnMpKSB7XG4gICAgICB2YXIgcGFyc2VyID0gcGFyc2Vyc1tuLmxvY2FsTmFtZV07XG4gICAgICBpZiAoaXNEZWYocGFyc2VyKSkge1xuICAgICAgICBwYXJzZXIuY2FsbChiaW5kLCBuLCBvYmplY3RTdGFjayk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IG5hbWVzcGFjZVVSSXMgTmFtZXNwYWNlIFVSSXMuXG4gKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCBYTUxQYXJzZXIuUGFyc2VyPn0gcGFyc2VycyBQYXJzZXJzLlxuICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pj19IG9wdF9wYXJzZXJzTlNcbiAqICAgICBQYXJzZXJzTlMuXG4gKiBAcmV0dXJuIHtPYmplY3QuPHN0cmluZywgT2JqZWN0LjxzdHJpbmcsIFhNTFBhcnNlci5QYXJzZXI+Pn0gUGFyc2VycyBOUy5cbiAqL1xuWE1MUGFyc2VyLm1ha2VQYXJzZXJzTlMgPSBmdW5jdGlvbihuYW1lc3BhY2VVUklzLCBwYXJzZXJzLCBvcHRfcGFyc2Vyc05TKSB7XG4gIHJldHVybiAvKiogQHR5cGUge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgWE1MUGFyc2VyLlBhcnNlcj4+fSAqLyAoXG4gICAgWE1MUGFyc2VyLm1ha2VTdHJ1Y3R1cmVOUyhuYW1lc3BhY2VVUklzLCBwYXJzZXJzLCBvcHRfcGFyc2Vyc05TKSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuYW1lc3BhY2VkIHN0cnVjdHVyZSwgdXNpbmcgdGhlIHNhbWUgdmFsdWVzIGZvciBlYWNoIG5hbWVzcGFjZS5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgYXMgYSBzdGFydGluZyBwb2ludCBmb3IgdmVyc2lvbmVkIHBhcnNlcnMsIHdoZW4gb25seSBhIGZld1xuICogdmFsdWVzIGFyZSB2ZXJzaW9uIHNwZWNpZmljLlxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gbmFtZXNwYWNlVVJJcyBOYW1lc3BhY2UgVVJJcy5cbiAqIEBwYXJhbSB7VH0gc3RydWN0dXJlIFN0cnVjdHVyZS5cbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIFQ+PX0gb3B0X3N0cnVjdHVyZU5TIE5hbWVzcGFjZWQgc3RydWN0dXJlIHRvIGFkZCB0by5cbiAqIEByZXR1cm4ge09iamVjdC48c3RyaW5nLCBUPn0gTmFtZXNwYWNlZCBzdHJ1Y3R1cmUuXG4gKiBAdGVtcGxhdGUgVFxuICovXG5YTUxQYXJzZXIubWFrZVN0cnVjdHVyZU5TID0gZnVuY3Rpb24obmFtZXNwYWNlVVJJcywgc3RydWN0dXJlLCBvcHRfc3RydWN0dXJlTlMpIHtcbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgKj59XG4gICAqL1xuICB2YXIgc3RydWN0dXJlTlMgPSBpc0RlZihvcHRfc3RydWN0dXJlTlMpID8gb3B0X3N0cnVjdHVyZU5TIDoge307XG4gIHZhciBpLCBpaTtcbiAgZm9yIChpID0gMCwgaWkgPSBuYW1lc3BhY2VVUklzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICBzdHJ1Y3R1cmVOU1tuYW1lc3BhY2VVUklzW2ldXSA9IHN0cnVjdHVyZTtcbiAgfVxuICByZXR1cm4gc3RydWN0dXJlTlM7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odGhpczogVCwgTm9kZSwgQXJyYXkuPCo+KTogKn0gdmFsdWVSZWFkZXIgVmFsdWUgcmVhZGVyLlxuICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfcHJvcGVydHkgUHJvcGVydHkuXG4gKiBAcGFyYW0ge1Q9fSBvcHRfdGhpcyBUaGUgb2JqZWN0IHRvIHVzZSBhcyBgdGhpc2AgaW4gYHZhbHVlUmVhZGVyYC5cbiAqIEByZXR1cm4ge1hNTFBhcnNlci5QYXJzZXJ9IFBhcnNlci5cbiAqIEB0ZW1wbGF0ZSBUXG4gKi9cblhNTFBhcnNlci5tYWtlT2JqZWN0UHJvcGVydHlTZXR0ZXIgPSBmdW5jdGlvbih2YWx1ZVJlYWRlciwgb3B0X3Byb3BlcnR5LCBvcHRfdGhpcykge1xuICByZXR1cm4gKFxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICAgICAqIEBwYXJhbSB7QXJyYXkuPCo+fSBvYmplY3RTdGFjayBPYmplY3Qgc3RhY2suXG4gICAgICovXG4gICAgZnVuY3Rpb24obm9kZSwgb2JqZWN0U3RhY2spIHtcbiAgICAgIHZhciB2YWx1ZSA9IHZhbHVlUmVhZGVyLmNhbGwoaXNEZWYob3B0X3RoaXMpID8gb3B0X3RoaXMgOiB0aGlzLFxuICAgICAgICBub2RlLCBvYmplY3RTdGFjayk7XG4gICAgICBpZiAoaXNEZWYodmFsdWUpKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSAvKiogQHR5cGUge09iamVjdH0gKi8gKG9iamVjdFN0YWNrW29iamVjdFN0YWNrLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gaXNEZWYob3B0X3Byb3BlcnR5KSA/IG9wdF9wcm9wZXJ0eSA6IG5vZGUubG9jYWxOYW1lO1xuICAgICAgICBvYmplY3RbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odGhpczogVCwgTm9kZSwgQXJyYXkuPCo+KTogKn0gdmFsdWVSZWFkZXIgVmFsdWUgcmVhZGVyLlxuICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfcHJvcGVydHkgUHJvcGVydHkuXG4gKiBAcGFyYW0ge1Q9fSBvcHRfdGhpcyBUaGUgb2JqZWN0IHRvIHVzZSBhcyBgdGhpc2AgaW4gYHZhbHVlUmVhZGVyYC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBQYXJzZXIuXG4gKiBAdGVtcGxhdGUgVFxuICovXG5YTUxQYXJzZXIubWFrZU9iamVjdFByb3BlcnR5UHVzaGVyID0gZnVuY3Rpb24odmFsdWVSZWFkZXIsIG9wdF9wcm9wZXJ0eSwgb3B0X3RoaXMpIHtcbiAgcmV0dXJuIChcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gICAgICB2YXIgdmFsdWUgPSB2YWx1ZVJlYWRlci5jYWxsKGlzRGVmKG9wdF90aGlzKSA/IG9wdF90aGlzIDogdGhpcyxcbiAgICAgICAgbm9kZSwgb2JqZWN0U3RhY2spO1xuXG4gICAgICBpZiAoaXNEZWYodmFsdWUpKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSAvKiogQHR5cGUge09iamVjdH0gKi8gKG9iamVjdFN0YWNrW29iamVjdFN0YWNrLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gaXNEZWYob3B0X3Byb3BlcnR5KSA/IG9wdF9wcm9wZXJ0eSA6IG5vZGUubG9jYWxOYW1lO1xuICAgICAgICB2YXIgYXJyYXkgPSBzZXRJZlVuZGVmaW5lZChvYmplY3QsIHByb3BlcnR5LCBbXSk7XG4gICAgICAgIGFycmF5LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHRoaXM6IFQsIE5vZGUsIEFycmF5LjwqPik6ICp9IHZhbHVlUmVhZGVyIFZhbHVlIHJlYWRlci5cbiAqIEBwYXJhbSB7VD19IG9wdF90aGlzIFRoZSBvYmplY3QgdG8gdXNlIGFzIGB0aGlzYCBpbiBgdmFsdWVSZWFkZXJgLlxuICogQHJldHVybiB7RnVuY3Rpb259IFBhcnNlci5cbiAqIEB0ZW1wbGF0ZSBUXG4gKi9cblhNTFBhcnNlci5tYWtlQXJyYXlQdXNoZXIgPSBmdW5jdGlvbih2YWx1ZVJlYWRlciwgb3B0X3RoaXMpIHtcbiAgcmV0dXJuIChcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5LjwqPn0gb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uKG5vZGUsIG9iamVjdFN0YWNrKSB7XG4gICAgICB2YXIgdmFsdWUgPSB2YWx1ZVJlYWRlci5jYWxsKGlzRGVmKG9wdF90aGlzKSA/IG9wdF90aGlzIDogdGhpcyxcbiAgICAgICAgbm9kZSwgb2JqZWN0U3RhY2spO1xuICAgICAgaWYgKGlzRGVmKHZhbHVlKSkge1xuICAgICAgICB2YXIgYXJyYXkgPSBvYmplY3RTdGFja1tvYmplY3RTdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgYXJyYXkucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgT2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3QuPFN0cmluZywgT2JqZWN0LjxTdHJpbmcsIEZ1bmN0aW9uPj59IHBhcnNlcnNOUyBQYXJzZXJzIGJ5IG5hbWVzcGFjZS5cbiAqIEBwYXJhbSB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlIE5vZGUuXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0U3RhY2sgT2JqZWN0IHN0YWNrLlxuICogQHBhcmFtIHsqPX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQgVGhlIG9iamVjdCB0byB1c2UgYXMgYHRoaXNgLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gT2JqZWN0LlxuICovXG5YTUxQYXJzZXIucHVzaFBhcnNlQW5kUG9wID0gZnVuY3Rpb24ob2JqZWN0LCBwYXJzZXJzTlMsIG5vZGUsIG9iamVjdFN0YWNrLCBiaW5kKSB7XG4gIG9iamVjdFN0YWNrLnB1c2gob2JqZWN0KTtcbiAgWE1MUGFyc2VyLnBhcnNlTm9kZShwYXJzZXJzTlMsIG5vZGUsIG9iamVjdFN0YWNrLCBiaW5kKTtcbiAgcmV0dXJuIG9iamVjdFN0YWNrLnBvcCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBYTUxQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGlzRGVmID0gcmVxdWlyZSgnLi91dGlscy9pc2RlZicpO1xudmFyIHN0cmluZyA9IHJlcXVpcmUoJy4vdXRpbHMvc3RyaW5nJyk7XG52YXIgWE1MUGFyc2VyID0gcmVxdWlyZSgnLi94bWxfcGFyc2VyJyk7XG5cbnZhciBYU0QgPSB7fTtcblxuLyoqXG4gKiBAY29uc3RcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cblhTRC5OQU1FU1BBQ0VfVVJJID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJztcblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZS5cbiAqIEByZXR1cm4ge2Jvb2xlYW58dW5kZWZpbmVkfSBCb29sZWFuLlxuICovXG5YU0QucmVhZEJvb2xlYW4gPSBmdW5jdGlvbihub2RlKSB7XG4gIHZhciBzID0gWE1MUGFyc2VyLmdldEFsbFRleHRDb250ZW50KG5vZGUsIGZhbHNlKTtcbiAgcmV0dXJuIFhTRC5yZWFkQm9vbGVhblN0cmluZyhzKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTdHJpbmcuXG4gKiBAcmV0dXJuIHtib29sZWFufHVuZGVmaW5lZH0gQm9vbGVhbi5cbiAqL1xuWFNELnJlYWRCb29sZWFuU3RyaW5nID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHZhciBtID0gL15cXHMqKHRydWV8MSl8KGZhbHNlfDApXFxzKiQvLmV4ZWMoc3RyaW5nKTtcbiAgaWYgKG0pIHtcbiAgICByZXR1cm4gaXNEZWYobVsxXSkgfHwgZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHJldHVybiB7bnVtYmVyfHVuZGVmaW5lZH0gRGF0ZVRpbWUgaW4gc2Vjb25kcy5cbiAqL1xuWFNELnJlYWREYXRlVGltZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgdmFyIHMgPSBYTUxQYXJzZXIuZ2V0QWxsVGV4dENvbnRlbnQobm9kZSwgZmFsc2UpO1xuICB2YXIgcmUgPSAvXlxccyooXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KShafCg/OihbK1xcLV0pKFxcZHsyfSkoPzo6KFxcZHsyfSkpPykpXFxzKiQvO1xuICB2YXIgbSA9IHJlLmV4ZWMocyk7XG4gIGlmIChtKSB7XG4gICAgdmFyIHllYXIgPSBwYXJzZUludChtWzFdLCAxMCk7XG4gICAgdmFyIG1vbnRoID0gcGFyc2VJbnQobVsyXSwgMTApIC0gMTtcbiAgICB2YXIgZGF5ID0gcGFyc2VJbnQobVszXSwgMTApO1xuICAgIHZhciBob3VyID0gcGFyc2VJbnQobVs0XSwgMTApO1xuICAgIHZhciBtaW51dGUgPSBwYXJzZUludChtWzVdLCAxMCk7XG4gICAgdmFyIHNlY29uZCA9IHBhcnNlSW50KG1bNl0sIDEwKTtcbiAgICB2YXIgZGF0ZVRpbWUgPSBEYXRlLlVUQyh5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCkgLyAxMDAwO1xuICAgIGlmIChtWzddICE9ICdaJykge1xuICAgICAgdmFyIHNpZ24gPSBtWzhdID09ICctJyA/IC0xIDogMTtcbiAgICAgIGRhdGVUaW1lICs9IHNpZ24gKiA2MCAqIHBhcnNlSW50KG1bOV0sIDEwKTtcbiAgICAgIGlmIChpc0RlZihtWzEwXSkpIHtcbiAgICAgICAgZGF0ZVRpbWUgKz0gc2lnbiAqIDYwICogNjAgKiBwYXJzZUludChtWzEwXSwgMTApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0ZVRpbWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHJldHVybiB7bnVtYmVyfHVuZGVmaW5lZH0gRGVjaW1hbC5cbiAqL1xuWFNELnJlYWREZWNpbWFsID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgcyA9IFhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudChub2RlLCBmYWxzZSk7XG4gIHJldHVybiBYU0QucmVhZERlY2ltYWxTdHJpbmcocyk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTdHJpbmcuXG4gKiBAcmV0dXJuIHtudW1iZXJ8dW5kZWZpbmVkfSBEZWNpbWFsLlxuICovXG5YU0QucmVhZERlY2ltYWxTdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgLy8gRklYTUUgY2hlY2sgc3BlY1xuICB2YXIgbSA9IC9eXFxzKihbK1xcLV0/XFxkKlxcLj9cXGQrKD86ZVsrXFwtXT9cXGQrKT8pXFxzKiQvaS5leGVjKHN0cmluZyk7XG4gIGlmIChtKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQobVsxXSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlLlxuICogQHJldHVybiB7bnVtYmVyfHVuZGVmaW5lZH0gTm9uIG5lZ2F0aXZlIGludGVnZXIuXG4gKi9cblhTRC5yZWFkTm9uTmVnYXRpdmVJbnRlZ2VyID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgcyA9IFhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudChub2RlLCBmYWxzZSk7XG4gIHJldHVybiBYU0QucmVhZE5vbk5lZ2F0aXZlSW50ZWdlclN0cmluZyhzKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFN0cmluZy5cbiAqIEByZXR1cm4ge251bWJlcnx1bmRlZmluZWR9IE5vbiBuZWdhdGl2ZSBpbnRlZ2VyLlxuICovXG5YU0QucmVhZE5vbk5lZ2F0aXZlSW50ZWdlclN0cmluZyA9IGZ1bmN0aW9uKHN0cmluZykge1xuICB2YXIgbSA9IC9eXFxzKihcXGQrKVxccyokLy5leGVjKHN0cmluZyk7XG4gIGlmIChtKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KG1bMV0sIDEwKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59O1xuXG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIE5vZGUuXG4gKiBAcmV0dXJuIHtzdHJpbmd8dW5kZWZpbmVkfSBTdHJpbmcuXG4gKi9cblhTRC5yZWFkU3RyaW5nID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgcyA9IFhNTFBhcnNlci5nZXRBbGxUZXh0Q29udGVudChub2RlLCBmYWxzZSk7XG4gIHJldHVybiBzdHJpbmcudHJpbShzKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZSB0byBhcHBlbmQgYSBUZXh0Tm9kZSB3aXRoIHRoZSBib29sZWFuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBib29sIEJvb2xlYW4uXG4gKi9cblhTRC53cml0ZUJvb2xlYW5UZXh0Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIGJvb2wpIHtcbiAgWFNELndyaXRlU3RyaW5nVGV4dE5vZGUobm9kZSwgKGJvb2wpID8gJzEnIDogJzAnKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgTm9kZSB0byBhcHBlbmQgYSBUZXh0Tm9kZSB3aXRoIHRoZSBkYXRlVGltZSB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlVGltZSBEYXRlVGltZSBpbiBzZWNvbmRzLlxuICovXG5YU0Qud3JpdGVEYXRlVGltZVRleHROb2RlID0gZnVuY3Rpb24obm9kZSwgZGF0ZVRpbWUpIHtcbiAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRlVGltZSAqIDEwMDApO1xuICB2YXIgc3RyaW5nID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpICsgJy0nICtcbiAgICBzdHJpbmcucGFkTnVtYmVyKGRhdGUuZ2V0VVRDTW9udGgoKSArIDEsIDIpICsgJy0nICtcbiAgICBzdHJpbmcucGFkTnVtYmVyKGRhdGUuZ2V0VVRDRGF0ZSgpLCAyKSArICdUJyArXG4gICAgc3RyaW5nLnBhZE51bWJlcihkYXRlLmdldFVUQ0hvdXJzKCksIDIpICsgJzonICtcbiAgICBzdHJpbmcucGFkTnVtYmVyKGRhdGUuZ2V0VVRDTWludXRlcygpLCAyKSArICc6JyArXG4gICAgc3RyaW5nLnBhZE51bWJlcihkYXRlLmdldFVUQ1NlY29uZHMoKSwgMikgKyAnWic7XG4gIG5vZGUuYXBwZW5kQ2hpbGQoWE1MUGFyc2VyLkRPQ1VNRU5ULmNyZWF0ZVRleHROb2RlKHN0cmluZykpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlIHRvIGFwcGVuZCBhIFRleHROb2RlIHdpdGggdGhlIGRlY2ltYWwgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gZGVjaW1hbCBEZWNpbWFsLlxuICovXG5YU0Qud3JpdGVEZWNpbWFsVGV4dE5vZGUgPSBmdW5jdGlvbihub2RlLCBkZWNpbWFsKSB7XG4gIHZhciBzdHJpbmcgPSBkZWNpbWFsLnRvUHJlY2lzaW9uKCk7XG4gIG5vZGUuYXBwZW5kQ2hpbGQoWE1MUGFyc2VyLkRPQ1VNRU5ULmNyZWF0ZVRleHROb2RlKHN0cmluZykpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlIHRvIGFwcGVuZCBhIFRleHROb2RlIHdpdGggdGhlIGRlY2ltYWwgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gbm9uTmVnYXRpdmVJbnRlZ2VyIE5vbiBuZWdhdGl2ZSBpbnRlZ2VyLlxuICovXG5YU0Qud3JpdGVOb25OZWdhdGl2ZUludGVnZXJUZXh0Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIG5vbk5lZ2F0aXZlSW50ZWdlcikge1xuICB2YXIgc3RyaW5nID0gbm9uTmVnYXRpdmVJbnRlZ2VyLnRvU3RyaW5nKCk7XG4gIG5vZGUuYXBwZW5kQ2hpbGQoWE1MUGFyc2VyLkRPQ1VNRU5ULmNyZWF0ZVRleHROb2RlKHN0cmluZykpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBOb2RlIHRvIGFwcGVuZCBhIFRleHROb2RlIHdpdGggdGhlIHN0cmluZyB0by5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgU3RyaW5nLlxuICovXG5YU0Qud3JpdGVTdHJpbmdUZXh0Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHN0cmluZykge1xuICBub2RlLmFwcGVuZENoaWxkKFhNTFBhcnNlci5ET0NVTUVOVC5jcmVhdGVUZXh0Tm9kZShzdHJpbmcpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWFNEO1xuIl19
