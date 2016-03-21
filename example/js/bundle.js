(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/w8r/Projects/wms-capabilities/dist/wms-capabilities.min.js":[function(require,module,exports){
(function (global){
(function(r){"object"===typeof exports&&"undefined"!==typeof module?module.exports=r():"function"===typeof define&&define.Na?define([],r):("undefined"!==typeof window?window:"undefined"!==typeof global?global:"undefined"!==typeof self?self:this).WMSCapabilities=r()})(function(){return function g(h,a,e){function f(c,m){if(!a[c]){if(!h[c]){var b="function"==typeof require&&require;if(!m&&b)return b(c,!0);if(l)return l(c,!0);b=Error("Cannot find module '"+c+"'");throw b.code="MODULE_NOT_FOUND",b;}b=
a[c]={exports:{}};h[c][0].call(b.exports,function(a){var b=h[c][1][a];return f(b?b:a)},b,b.exports,g,h,a,e)}return a[c].exports}for(var l="function"==typeof require&&require,c=0;c<e.length;c++)f(e[c]);return f}({1:[function(g,h){h.exports=g("./src/wms")},{"./src/wms":6}],2:[function(g,h){h.exports={u:1,Ea:2,ca:3,N:4,Ja:5,Ia:6,Ma:7,Fa:8,s:9,Ha:10,Ga:11,La:12}},{}],3:[function(g,h){h.exports=function(a){return void 0!==a}},{}],4:[function(g,h){h.exports=function(a,e,f){return e in a?a[e]:a[e]=f}},{}],
5:[function(g,h){var a=g("./isdef"),e=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;h.exports={trim:function(a){return a.replace(e,"")},m:function(e,g,c){e=a(c)?e.toFixed(c):String(e);c=e.indexOf(".");-1==c&&(c=e.length);return Array(Math.max(0,g-c)+1).join("0")+e}}},{"./isdef":3}],6:[function(g,h){function a(a){this.version=void 0;this.v=new e;this.F=a}var e=g("./xml_parser"),f=g("./utils/isdef"),l=g("./node_types"),c=g("./utils/setifundefined"),d=g("./xsd"),m=g("./xlink"),b=e.ya;a.prototype.data=function(a){this.F=
a;return this};a.prototype.toJSON=function(a){a=a||this.F;return this.parse(a)};a.prototype.parse=function(a){return this.pa(this.v.Ca(a))};a.prototype.pa=function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType==l.u)return this.Ba(a);return null};a.prototype.Ba=function(c){this.version=c.getAttribute("version");return e.b({version:this.version},a.Z,c,[])||null};a.da=function(c,b){return e.b({},a.L,c,b)};a.G=function(a){var c=d.o;return[c(a.getAttribute("minx")),c(a.getAttribute("miny")),c(a.getAttribute("maxx")),
c(a.getAttribute("maxy"))]};a.fa=function(c){var b=a.G(c),e=d.o,e=[e(c.getAttribute("resx")),e(c.getAttribute("resy"))];return{crs:c.getAttribute("CRS")||c.getAttribute("SRS"),extent:b,res:e}};a.ra=function(c){c=a.G(c);return f(c[0])&&f(c[1])&&f(c[2])&&f(c[3])?c:void 0};a.va=function(a){var c=parseFloat(a.getAttribute("min"));a=parseFloat(a.getAttribute("max"));return{min:c,max:a}};a.na=function(c,b){var d=e.b({},a.U,c,b);if(f(d)){var m=d.westBoundLongitude,k=d.southBoundLatitude,g=d.eastBoundLongitude,
d=d.northBoundLatitude;return f(m)&&f(k)&&f(g)&&f(d)?[m,k,g,d]:void 0}};a.ga=function(c,b){return e.b({},a.M,c,b)};a.wa=function(c,b){return e.b({},a.aa,c,b)};a.ja=function(c,b){return e.b({},a.P,c,b)};a.ka=function(c,b){return e.b({},a.R,c,b)};a.ia=function(c,b){return e.b({},a.O,c,b)};a.oa=function(c,b){return e.b([],a.T,c,b)};a.ha=function(c,b){return e.b({},a.D,c,b)};a.sa=function(b,m){var g=m[m.length-1],h=e.b({},a.D,b,m);if(f(h)){var k=d.i(b.getAttribute("queryable"));f(k)||(k=g.queryable);
h.queryable=f(k)?k:!1;k=d.C(b.getAttribute("cascaded"));f(k)||(k=g.cascaded);h.cascaded=k;k=d.i(b.getAttribute("opaque"));f(k)||(k=g.opaque);h.opaque=f(k)?k:!1;k=d.i(b.getAttribute("noSubsets"));f(k)||(k=g.noSubsets);h.noSubsets=f(k)?k:!1;k=d.o(b.getAttribute("fixedWidth"));f(k)||(k=g.fixedWidth);h.fixedWidth=k;k=d.o(b.getAttribute("fixedHeight"));f(k)||(k=g.fixedHeight);h.fixedHeight=k;for(var l=["Style","CRS","AuthorityURL"],k=0,t=l.length;k<t;k++){var n=l[k],q=g[n];if(f(q)){var p=c(h,n,[]),p=p.concat(q);
h[n]=p}}l="EX_GeographicBoundingBox BoundingBox Dimension Attribution MinScaleDenominator MaxScaleDenominator".split(" ");k=0;for(t=l.length;k<t;k++)n=l[k],p=h[n],f(p)||(q=g[n],h[n]=q);return h}};a.ma=function(a){return{name:a.getAttribute("name"),units:a.getAttribute("units"),unitSymbol:a.getAttribute("unitSymbol"),"default":a.getAttribute("default"),multipleValues:d.i(a.getAttribute("multipleValues")),nearestValue:d.i(a.getAttribute("nearestValue")),current:d.i(a.getAttribute("current")),values:d.a(a)}};
a.h=function(c,b){return e.b({},a.V,c,b)};a.ua=function(c,b){return e.b({},a.$,c,b)};a.la=function(c,b){return e.b({},a.S,c,b)};a.qa=function(c,b){return e.b({},a.W,c,b)};a.w=function(c,b){return e.b({},a.Y,c,b)};a.I=function(c,b){var e=a.h(c,b);if(f(e)){var m=d.C,m=[m(c.getAttribute("width")),m(c.getAttribute("height"))];e.size=m;return e}};a.ea=function(c,b){var d=a.h(c,b);if(f(d))return d.name=c.getAttribute("name"),d};a.ta=function(c,b){var d=a.h(c,b);if(f(d))return d.type=c.getAttribute("type"),
d};a.xa=function(c,b){return e.b({},a.ba,c,b)};a.H=function(c,b){return e.b([],a.X,c,b)};a.c=[null,"http://www.opengis.net/wms"];a.Z=e.f(a.c,{Service:b(a.wa),Capability:b(a.ga)});a.M=e.f(a.c,{Request:b(a.ua),Exception:b(a.oa),Layer:b(a.ha)});a.aa=e.f(a.c,{Name:b(d.a),Title:b(d.a),Abstract:b(d.a),KeywordList:b(a.H),OnlineResource:b(m.A),ContactInformation:b(a.ja),Fees:b(d.a),AccessConstraints:b(d.a),LayerLimit:b(d.B),MaxWidth:b(d.B),MaxHeight:b(d.B)});a.P=e.f(a.c,{ContactPersonPrimary:b(a.ka),ContactPosition:b(d.a),
ContactAddress:b(a.ia),ContactVoiceTelephone:b(d.a),ContactFacsimileTelephone:b(d.a),ContactElectronicMailAddress:b(d.a)});a.R=e.f(a.c,{ContactPerson:b(d.a),ContactOrganization:b(d.a)});a.O=e.f(a.c,{AddressType:b(d.a),Address:b(d.a),City:b(d.a),StateOrProvince:b(d.a),PostCode:b(d.a),Country:b(d.a)});a.T=e.f(a.c,{Format:e.K(d.a)});a.D=e.f(a.c,{Name:b(d.a),Title:b(d.a),Abstract:b(d.a),KeywordList:b(a.H),CRS:e.g(d.a),SRS:e.g(d.a),EX_GeographicBoundingBox:b(a.na),LatLonBoundingBox:b(a.ra),BoundingBox:e.g(a.fa),
Dimension:e.g(a.ma),Attribution:b(a.da),AuthorityURL:e.g(a.ea),Identifier:e.g(d.a),MetadataURL:e.g(a.ta),DataURL:e.g(a.h),FeatureListURL:e.g(a.h),Style:e.g(a.xa),MinScaleDenominator:b(d.j),MaxScaleDenominator:b(d.j),ScaleHint:b(a.va),Layer:e.g(a.sa)});a.L=e.f(a.c,{Title:b(d.a),OnlineResource:b(m.A),LogoURL:b(a.I)});a.U=e.f(a.c,{westBoundLongitude:b(d.j),eastBoundLongitude:b(d.j),southBoundLatitude:b(d.j),northBoundLatitude:b(d.j)});a.$=e.f(a.c,{GetCapabilities:b(a.w),GetMap:b(a.w),GetFeatureInfo:b(a.w)});
a.Y=e.f(a.c,{Format:e.g(d.a),DCPType:e.g(a.la)});a.S=e.f(a.c,{HTTP:b(a.qa)});a.W=e.f(a.c,{Get:b(a.h),Post:b(a.h)});a.ba=e.f(a.c,{Name:b(d.a),Title:b(d.a),Abstract:b(d.a),LegendURL:e.g(a.I),StyleSheetURL:b(a.h),StyleURL:b(a.h)});a.V=e.f(a.c,{Format:b(d.a),OnlineResource:b(m.A)});a.X=e.f(a.c,{Keyword:e.K(d.a)});h.exports=a},{"./node_types":2,"./utils/isdef":3,"./utils/setifundefined":4,"./xlink":7,"./xml_parser":8,"./xsd":9}],7:[function(g,h){h.exports={A:function(a){return a.getAttributeNS("http://www.w3.org/1999/xlink",
"href")}}},{}],8:[function(g,h){function a(){this.v=new DOMParser}var e=g("./utils/isdef"),f=g("./utils/setifundefined"),l=g("./node_types");a.prototype.Ca=function(a){return this.v.parseFromString(a,"application/xml")};a.l=function(c){return a.J(c,!1,[]).join("")};a.J=function(c,d,e){if(c.nodeType===l.N||c.nodeType===l.ca)d?e.push(String(c.nodeValue).replace(/(\r\n|\r|\n)/g,"")):e.push(c.nodeValue);else for(c=c.firstChild;c;c=c.nextSibling)a.J(c,d,e);return e};a.Aa=function(c,d,m){for(d=a.firstElementChild(d);d;d=
a.nextElementSibling(d)){var b=c[d.namespaceURI||null];e(b)&&(b=b[d.localName],e(b)&&b.call(void 0,d,m))}};a.firstElementChild=function(a){for(a=a.firstElementChild||a.firstChild;a&&a.nodeType!==l.u;)a=a.nextSibling;return a};a.nextElementSibling=function(a){for(a=a.nextElementSibling||a.nextSibling;a&&a.nodeType!==l.u;)a=a.nextSibling;return a};a.f=function(c,d){return a.za(c,d)};a.za=function(a,d){var m=e(void 0)?void 0:{},b,f;b=0;for(f=a.length;b<f;++b)m[a[b]]=d;return m};a.ya=function(a,d,f){return function(b,
g){var h=a.call(e(f)?f:this,b,g);if(e(h)){var l=g[g.length-1],u=e(d)?d:b.localName;l[u]=h}}};a.g=function(a){return function(d,g){var b=a.call(e(void 0)?void 0:this,d,g);if(e(b)){var h=g[g.length-1],l=e(void 0)?void 0:d.localName;f(h,l,[]).push(b)}}};a.K=function(a){return function(d,f){var b=a.call(e(void 0)?void 0:this,d,f);e(b)&&f[f.length-1].push(b)}};a.b=function(c,d,e,b){b.push(c);a.Aa(d,e,b);return b.pop()};h.exports=a},{"./node_types":2,"./utils/isdef":3,"./utils/setifundefined":4}],9:[function(g,
h){var a=g("./utils/isdef"),e=g("./utils/string"),f=g("./xml_parser"),l={Ka:"http://www.w3.org/2001/XMLSchema",Oa:function(a){a=f.l(a);return l.i(a)},i:function(c){if(c=/^\s*(true|1)|(false|0)\s*$/.exec(c))return a(c[1])||!1},Pa:function(c){c=f.l(c);if(c=/^\s*(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|(?:([+\-])(\d{2})(?::(\d{2}))?))\s*$/.exec(c)){var d=Date.UTC(parseInt(c[1],10),parseInt(c[2],10)-1,parseInt(c[3],10),parseInt(c[4],10),parseInt(c[5],10),parseInt(c[6],10))/1E3;if("Z"!=c[7]){var e=
"-"==c[8]?-1:1,d=d+60*e*parseInt(c[9],10);a(c[10])&&(d+=3600*e*parseInt(c[10],10))}return d}},j:function(a){a=f.l(a);return l.o(a)},o:function(a){if(a=/^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*$/i.exec(a))return parseFloat(a[1])},B:function(a){a=f.l(a);return l.C(a)},C:function(a){if(a=/^\s*(\d+)\s*$/.exec(a))return parseInt(a[1],10)},a:function(a){a=f.l(a);return e.trim(a)},Qa:function(a,d){l.Da(a,d?"1":"0")},Ra:function(a,d){var e=new Date(1E3*d),b=e.getUTCFullYear()+"-"+b.m(e.getUTCMonth()+1,2)+
"-"+b.m(e.getUTCDate(),2)+"T"+b.m(e.getUTCHours(),2)+":"+b.m(e.getUTCMinutes(),2)+":"+b.m(e.getUTCSeconds(),2)+"Z";a.appendChild(f.s.createTextNode(b))},Sa:function(a,d){a.appendChild(f.s.createTextNode(d.toPrecision()))},Ta:function(a,d){a.appendChild(f.s.createTextNode(d.toString()))},Da:function(a,d){a.appendChild(f.s.createTextNode(d))}};h.exports=l},{"./utils/isdef":3,"./utils/string":5,"./xml_parser":8}]},{},[1])(1)});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/w8r/Projects/wms-capabilities/example/js/app.js":[function(require,module,exports){
(function (global){
var jsonFormat = global.jsonFormat = require('./json-format');
var xmlFormat = global.xmlFormat = require('./xml-format');
var WMSCapabilities = global.WMSCapabilities || require('../../dist/wms-capabilities.min');
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

},{"../../dist/wms-capabilities.min":"/Users/w8r/Projects/wms-capabilities/dist/wms-capabilities.min.js","./json-format":"/Users/w8r/Projects/wms-capabilities/example/js/json-format.js","./xml-format":"/Users/w8r/Projects/wms-capabilities/example/js/xml-format.js","reqwest":"/Users/w8r/Projects/wms-capabilities/node_modules/reqwest/reqwest.js","spin.js":"/Users/w8r/Projects/wms-capabilities/node_modules/spin.js/spin.js"}],"/Users/w8r/Projects/wms-capabilities/example/js/json-format.js":[function(require,module,exports){
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

},{}],"/Users/w8r/Projects/wms-capabilities/node_modules/reqwest/reqwest.js":[function(require,module,exports){
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

},{}]},{},["/Users/w8r/Projects/wms-capabilities/example/js/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZGlzdC93bXMtY2FwYWJpbGl0aWVzLm1pbi5qcyIsImV4YW1wbGUvanMvYXBwLmpzIiwiZXhhbXBsZS9qcy9qc29uLWZvcm1hdC5qcyIsImV4YW1wbGUvanMveG1sLWZvcm1hdC5qcyIsIm5vZGVfbW9kdWxlcy9yZXF3ZXN0L3JlcXdlc3QuanMiLCJub2RlX21vZHVsZXMvc3Bpbi5qcy9zcGluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24ocil7XCJvYmplY3RcIj09PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1yKCk6XCJmdW5jdGlvblwiPT09dHlwZW9mIGRlZmluZSYmZGVmaW5lLk5hP2RlZmluZShbXSxyKTooXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3c/d2luZG93OlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT09dHlwZW9mIHNlbGY/c2VsZjp0aGlzKS5XTVNDYXBhYmlsaXRpZXM9cigpfSkoZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24gZyhoLGEsZSl7ZnVuY3Rpb24gZihjLG0pe2lmKCFhW2NdKXtpZighaFtjXSl7dmFyIGI9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighbSYmYilyZXR1cm4gYihjLCEwKTtpZihsKXJldHVybiBsKGMsITApO2I9RXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2MrXCInXCIpO3Rocm93IGIuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixiO31iPVxuYVtjXT17ZXhwb3J0czp7fX07aFtjXVswXS5jYWxsKGIuZXhwb3J0cyxmdW5jdGlvbihhKXt2YXIgYj1oW2NdWzFdW2FdO3JldHVybiBmKGI/YjphKX0sYixiLmV4cG9ydHMsZyxoLGEsZSl9cmV0dXJuIGFbY10uZXhwb3J0c31mb3IodmFyIGw9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxjPTA7YzxlLmxlbmd0aDtjKyspZihlW2NdKTtyZXR1cm4gZn0oezE6W2Z1bmN0aW9uKGcsaCl7aC5leHBvcnRzPWcoXCIuL3NyYy93bXNcIil9LHtcIi4vc3JjL3dtc1wiOjZ9XSwyOltmdW5jdGlvbihnLGgpe2guZXhwb3J0cz17dToxLEVhOjIsY2E6MyxOOjQsSmE6NSxJYTo2LE1hOjcsRmE6OCxzOjksSGE6MTAsR2E6MTEsTGE6MTJ9fSx7fV0sMzpbZnVuY3Rpb24oZyxoKXtoLmV4cG9ydHM9ZnVuY3Rpb24oYSl7cmV0dXJuIHZvaWQgMCE9PWF9fSx7fV0sNDpbZnVuY3Rpb24oZyxoKXtoLmV4cG9ydHM9ZnVuY3Rpb24oYSxlLGYpe3JldHVybiBlIGluIGE/YVtlXTphW2VdPWZ9fSx7fV0sXG41OltmdW5jdGlvbihnLGgpe3ZhciBhPWcoXCIuL2lzZGVmXCIpLGU9L15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nO2guZXhwb3J0cz17dHJpbTpmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXBsYWNlKGUsXCJcIil9LG06ZnVuY3Rpb24oZSxnLGMpe2U9YShjKT9lLnRvRml4ZWQoYyk6U3RyaW5nKGUpO2M9ZS5pbmRleE9mKFwiLlwiKTstMT09YyYmKGM9ZS5sZW5ndGgpO3JldHVybiBBcnJheShNYXRoLm1heCgwLGctYykrMSkuam9pbihcIjBcIikrZX19fSx7XCIuL2lzZGVmXCI6M31dLDY6W2Z1bmN0aW9uKGcsaCl7ZnVuY3Rpb24gYShhKXt0aGlzLnZlcnNpb249dm9pZCAwO3RoaXMudj1uZXcgZTt0aGlzLkY9YX12YXIgZT1nKFwiLi94bWxfcGFyc2VyXCIpLGY9ZyhcIi4vdXRpbHMvaXNkZWZcIiksbD1nKFwiLi9ub2RlX3R5cGVzXCIpLGM9ZyhcIi4vdXRpbHMvc2V0aWZ1bmRlZmluZWRcIiksZD1nKFwiLi94c2RcIiksbT1nKFwiLi94bGlua1wiKSxiPWUueWE7YS5wcm90b3R5cGUuZGF0YT1mdW5jdGlvbihhKXt0aGlzLkY9XG5hO3JldHVybiB0aGlzfTthLnByb3RvdHlwZS50b0pTT049ZnVuY3Rpb24oYSl7YT1hfHx0aGlzLkY7cmV0dXJuIHRoaXMucGFyc2UoYSl9O2EucHJvdG90eXBlLnBhcnNlPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnBhKHRoaXMudi5DYShhKSl9O2EucHJvdG90eXBlLnBhPWZ1bmN0aW9uKGEpe2ZvcihhPWEuZmlyc3RDaGlsZDthO2E9YS5uZXh0U2libGluZylpZihhLm5vZGVUeXBlPT1sLnUpcmV0dXJuIHRoaXMuQmEoYSk7cmV0dXJuIG51bGx9O2EucHJvdG90eXBlLkJhPWZ1bmN0aW9uKGMpe3RoaXMudmVyc2lvbj1jLmdldEF0dHJpYnV0ZShcInZlcnNpb25cIik7cmV0dXJuIGUuYih7dmVyc2lvbjp0aGlzLnZlcnNpb259LGEuWixjLFtdKXx8bnVsbH07YS5kYT1mdW5jdGlvbihjLGIpe3JldHVybiBlLmIoe30sYS5MLGMsYil9O2EuRz1mdW5jdGlvbihhKXt2YXIgYz1kLm87cmV0dXJuW2MoYS5nZXRBdHRyaWJ1dGUoXCJtaW54XCIpKSxjKGEuZ2V0QXR0cmlidXRlKFwibWlueVwiKSksYyhhLmdldEF0dHJpYnV0ZShcIm1heHhcIikpLFxuYyhhLmdldEF0dHJpYnV0ZShcIm1heHlcIikpXX07YS5mYT1mdW5jdGlvbihjKXt2YXIgYj1hLkcoYyksZT1kLm8sZT1bZShjLmdldEF0dHJpYnV0ZShcInJlc3hcIikpLGUoYy5nZXRBdHRyaWJ1dGUoXCJyZXN5XCIpKV07cmV0dXJue2NyczpjLmdldEF0dHJpYnV0ZShcIkNSU1wiKXx8Yy5nZXRBdHRyaWJ1dGUoXCJTUlNcIiksZXh0ZW50OmIscmVzOmV9fTthLnJhPWZ1bmN0aW9uKGMpe2M9YS5HKGMpO3JldHVybiBmKGNbMF0pJiZmKGNbMV0pJiZmKGNbMl0pJiZmKGNbM10pP2M6dm9pZCAwfTthLnZhPWZ1bmN0aW9uKGEpe3ZhciBjPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJtaW5cIikpO2E9cGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZShcIm1heFwiKSk7cmV0dXJue21pbjpjLG1heDphfX07YS5uYT1mdW5jdGlvbihjLGIpe3ZhciBkPWUuYih7fSxhLlUsYyxiKTtpZihmKGQpKXt2YXIgbT1kLndlc3RCb3VuZExvbmdpdHVkZSxrPWQuc291dGhCb3VuZExhdGl0dWRlLGc9ZC5lYXN0Qm91bmRMb25naXR1ZGUsXG5kPWQubm9ydGhCb3VuZExhdGl0dWRlO3JldHVybiBmKG0pJiZmKGspJiZmKGcpJiZmKGQpP1ttLGssZyxkXTp2b2lkIDB9fTthLmdhPWZ1bmN0aW9uKGMsYil7cmV0dXJuIGUuYih7fSxhLk0sYyxiKX07YS53YT1mdW5jdGlvbihjLGIpe3JldHVybiBlLmIoe30sYS5hYSxjLGIpfTthLmphPWZ1bmN0aW9uKGMsYil7cmV0dXJuIGUuYih7fSxhLlAsYyxiKX07YS5rYT1mdW5jdGlvbihjLGIpe3JldHVybiBlLmIoe30sYS5SLGMsYil9O2EuaWE9ZnVuY3Rpb24oYyxiKXtyZXR1cm4gZS5iKHt9LGEuTyxjLGIpfTthLm9hPWZ1bmN0aW9uKGMsYil7cmV0dXJuIGUuYihbXSxhLlQsYyxiKX07YS5oYT1mdW5jdGlvbihjLGIpe3JldHVybiBlLmIoe30sYS5ELGMsYil9O2Euc2E9ZnVuY3Rpb24oYixtKXt2YXIgZz1tW20ubGVuZ3RoLTFdLGg9ZS5iKHt9LGEuRCxiLG0pO2lmKGYoaCkpe3ZhciBrPWQuaShiLmdldEF0dHJpYnV0ZShcInF1ZXJ5YWJsZVwiKSk7ZihrKXx8KGs9Zy5xdWVyeWFibGUpO1xuaC5xdWVyeWFibGU9ZihrKT9rOiExO2s9ZC5DKGIuZ2V0QXR0cmlidXRlKFwiY2FzY2FkZWRcIikpO2Yoayl8fChrPWcuY2FzY2FkZWQpO2guY2FzY2FkZWQ9aztrPWQuaShiLmdldEF0dHJpYnV0ZShcIm9wYXF1ZVwiKSk7ZihrKXx8KGs9Zy5vcGFxdWUpO2gub3BhcXVlPWYoayk/azohMTtrPWQuaShiLmdldEF0dHJpYnV0ZShcIm5vU3Vic2V0c1wiKSk7ZihrKXx8KGs9Zy5ub1N1YnNldHMpO2gubm9TdWJzZXRzPWYoayk/azohMTtrPWQubyhiLmdldEF0dHJpYnV0ZShcImZpeGVkV2lkdGhcIikpO2Yoayl8fChrPWcuZml4ZWRXaWR0aCk7aC5maXhlZFdpZHRoPWs7az1kLm8oYi5nZXRBdHRyaWJ1dGUoXCJmaXhlZEhlaWdodFwiKSk7ZihrKXx8KGs9Zy5maXhlZEhlaWdodCk7aC5maXhlZEhlaWdodD1rO2Zvcih2YXIgbD1bXCJTdHlsZVwiLFwiQ1JTXCIsXCJBdXRob3JpdHlVUkxcIl0saz0wLHQ9bC5sZW5ndGg7azx0O2srKyl7dmFyIG49bFtrXSxxPWdbbl07aWYoZihxKSl7dmFyIHA9YyhoLG4sW10pLHA9cC5jb25jYXQocSk7XG5oW25dPXB9fWw9XCJFWF9HZW9ncmFwaGljQm91bmRpbmdCb3ggQm91bmRpbmdCb3ggRGltZW5zaW9uIEF0dHJpYnV0aW9uIE1pblNjYWxlRGVub21pbmF0b3IgTWF4U2NhbGVEZW5vbWluYXRvclwiLnNwbGl0KFwiIFwiKTtrPTA7Zm9yKHQ9bC5sZW5ndGg7azx0O2srKyluPWxba10scD1oW25dLGYocCl8fChxPWdbbl0saFtuXT1xKTtyZXR1cm4gaH19O2EubWE9ZnVuY3Rpb24oYSl7cmV0dXJue25hbWU6YS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpLHVuaXRzOmEuZ2V0QXR0cmlidXRlKFwidW5pdHNcIiksdW5pdFN5bWJvbDphLmdldEF0dHJpYnV0ZShcInVuaXRTeW1ib2xcIiksXCJkZWZhdWx0XCI6YS5nZXRBdHRyaWJ1dGUoXCJkZWZhdWx0XCIpLG11bHRpcGxlVmFsdWVzOmQuaShhLmdldEF0dHJpYnV0ZShcIm11bHRpcGxlVmFsdWVzXCIpKSxuZWFyZXN0VmFsdWU6ZC5pKGEuZ2V0QXR0cmlidXRlKFwibmVhcmVzdFZhbHVlXCIpKSxjdXJyZW50OmQuaShhLmdldEF0dHJpYnV0ZShcImN1cnJlbnRcIikpLHZhbHVlczpkLmEoYSl9fTtcbmEuaD1mdW5jdGlvbihjLGIpe3JldHVybiBlLmIoe30sYS5WLGMsYil9O2EudWE9ZnVuY3Rpb24oYyxiKXtyZXR1cm4gZS5iKHt9LGEuJCxjLGIpfTthLmxhPWZ1bmN0aW9uKGMsYil7cmV0dXJuIGUuYih7fSxhLlMsYyxiKX07YS5xYT1mdW5jdGlvbihjLGIpe3JldHVybiBlLmIoe30sYS5XLGMsYil9O2Eudz1mdW5jdGlvbihjLGIpe3JldHVybiBlLmIoe30sYS5ZLGMsYil9O2EuST1mdW5jdGlvbihjLGIpe3ZhciBlPWEuaChjLGIpO2lmKGYoZSkpe3ZhciBtPWQuQyxtPVttKGMuZ2V0QXR0cmlidXRlKFwid2lkdGhcIikpLG0oYy5nZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIikpXTtlLnNpemU9bTtyZXR1cm4gZX19O2EuZWE9ZnVuY3Rpb24oYyxiKXt2YXIgZD1hLmgoYyxiKTtpZihmKGQpKXJldHVybiBkLm5hbWU9Yy5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpLGR9O2EudGE9ZnVuY3Rpb24oYyxiKXt2YXIgZD1hLmgoYyxiKTtpZihmKGQpKXJldHVybiBkLnR5cGU9Yy5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpLFxuZH07YS54YT1mdW5jdGlvbihjLGIpe3JldHVybiBlLmIoe30sYS5iYSxjLGIpfTthLkg9ZnVuY3Rpb24oYyxiKXtyZXR1cm4gZS5iKFtdLGEuWCxjLGIpfTthLmM9W251bGwsXCJodHRwOi8vd3d3Lm9wZW5naXMubmV0L3dtc1wiXTthLlo9ZS5mKGEuYyx7U2VydmljZTpiKGEud2EpLENhcGFiaWxpdHk6YihhLmdhKX0pO2EuTT1lLmYoYS5jLHtSZXF1ZXN0OmIoYS51YSksRXhjZXB0aW9uOmIoYS5vYSksTGF5ZXI6YihhLmhhKX0pO2EuYWE9ZS5mKGEuYyx7TmFtZTpiKGQuYSksVGl0bGU6YihkLmEpLEFic3RyYWN0OmIoZC5hKSxLZXl3b3JkTGlzdDpiKGEuSCksT25saW5lUmVzb3VyY2U6YihtLkEpLENvbnRhY3RJbmZvcm1hdGlvbjpiKGEuamEpLEZlZXM6YihkLmEpLEFjY2Vzc0NvbnN0cmFpbnRzOmIoZC5hKSxMYXllckxpbWl0OmIoZC5CKSxNYXhXaWR0aDpiKGQuQiksTWF4SGVpZ2h0OmIoZC5CKX0pO2EuUD1lLmYoYS5jLHtDb250YWN0UGVyc29uUHJpbWFyeTpiKGEua2EpLENvbnRhY3RQb3NpdGlvbjpiKGQuYSksXG5Db250YWN0QWRkcmVzczpiKGEuaWEpLENvbnRhY3RWb2ljZVRlbGVwaG9uZTpiKGQuYSksQ29udGFjdEZhY3NpbWlsZVRlbGVwaG9uZTpiKGQuYSksQ29udGFjdEVsZWN0cm9uaWNNYWlsQWRkcmVzczpiKGQuYSl9KTthLlI9ZS5mKGEuYyx7Q29udGFjdFBlcnNvbjpiKGQuYSksQ29udGFjdE9yZ2FuaXphdGlvbjpiKGQuYSl9KTthLk89ZS5mKGEuYyx7QWRkcmVzc1R5cGU6YihkLmEpLEFkZHJlc3M6YihkLmEpLENpdHk6YihkLmEpLFN0YXRlT3JQcm92aW5jZTpiKGQuYSksUG9zdENvZGU6YihkLmEpLENvdW50cnk6YihkLmEpfSk7YS5UPWUuZihhLmMse0Zvcm1hdDplLksoZC5hKX0pO2EuRD1lLmYoYS5jLHtOYW1lOmIoZC5hKSxUaXRsZTpiKGQuYSksQWJzdHJhY3Q6YihkLmEpLEtleXdvcmRMaXN0OmIoYS5IKSxDUlM6ZS5nKGQuYSksU1JTOmUuZyhkLmEpLEVYX0dlb2dyYXBoaWNCb3VuZGluZ0JveDpiKGEubmEpLExhdExvbkJvdW5kaW5nQm94OmIoYS5yYSksQm91bmRpbmdCb3g6ZS5nKGEuZmEpLFxuRGltZW5zaW9uOmUuZyhhLm1hKSxBdHRyaWJ1dGlvbjpiKGEuZGEpLEF1dGhvcml0eVVSTDplLmcoYS5lYSksSWRlbnRpZmllcjplLmcoZC5hKSxNZXRhZGF0YVVSTDplLmcoYS50YSksRGF0YVVSTDplLmcoYS5oKSxGZWF0dXJlTGlzdFVSTDplLmcoYS5oKSxTdHlsZTplLmcoYS54YSksTWluU2NhbGVEZW5vbWluYXRvcjpiKGQuaiksTWF4U2NhbGVEZW5vbWluYXRvcjpiKGQuaiksU2NhbGVIaW50OmIoYS52YSksTGF5ZXI6ZS5nKGEuc2EpfSk7YS5MPWUuZihhLmMse1RpdGxlOmIoZC5hKSxPbmxpbmVSZXNvdXJjZTpiKG0uQSksTG9nb1VSTDpiKGEuSSl9KTthLlU9ZS5mKGEuYyx7d2VzdEJvdW5kTG9uZ2l0dWRlOmIoZC5qKSxlYXN0Qm91bmRMb25naXR1ZGU6YihkLmopLHNvdXRoQm91bmRMYXRpdHVkZTpiKGQuaiksbm9ydGhCb3VuZExhdGl0dWRlOmIoZC5qKX0pO2EuJD1lLmYoYS5jLHtHZXRDYXBhYmlsaXRpZXM6YihhLncpLEdldE1hcDpiKGEudyksR2V0RmVhdHVyZUluZm86YihhLncpfSk7XG5hLlk9ZS5mKGEuYyx7Rm9ybWF0OmUuZyhkLmEpLERDUFR5cGU6ZS5nKGEubGEpfSk7YS5TPWUuZihhLmMse0hUVFA6YihhLnFhKX0pO2EuVz1lLmYoYS5jLHtHZXQ6YihhLmgpLFBvc3Q6YihhLmgpfSk7YS5iYT1lLmYoYS5jLHtOYW1lOmIoZC5hKSxUaXRsZTpiKGQuYSksQWJzdHJhY3Q6YihkLmEpLExlZ2VuZFVSTDplLmcoYS5JKSxTdHlsZVNoZWV0VVJMOmIoYS5oKSxTdHlsZVVSTDpiKGEuaCl9KTthLlY9ZS5mKGEuYyx7Rm9ybWF0OmIoZC5hKSxPbmxpbmVSZXNvdXJjZTpiKG0uQSl9KTthLlg9ZS5mKGEuYyx7S2V5d29yZDplLksoZC5hKX0pO2guZXhwb3J0cz1hfSx7XCIuL25vZGVfdHlwZXNcIjoyLFwiLi91dGlscy9pc2RlZlwiOjMsXCIuL3V0aWxzL3NldGlmdW5kZWZpbmVkXCI6NCxcIi4veGxpbmtcIjo3LFwiLi94bWxfcGFyc2VyXCI6OCxcIi4veHNkXCI6OX1dLDc6W2Z1bmN0aW9uKGcsaCl7aC5leHBvcnRzPXtBOmZ1bmN0aW9uKGEpe3JldHVybiBhLmdldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLFxuXCJocmVmXCIpfX19LHt9XSw4OltmdW5jdGlvbihnLGgpe2Z1bmN0aW9uIGEoKXt0aGlzLnY9bmV3IERPTVBhcnNlcn12YXIgZT1nKFwiLi91dGlscy9pc2RlZlwiKSxmPWcoXCIuL3V0aWxzL3NldGlmdW5kZWZpbmVkXCIpLGw9ZyhcIi4vbm9kZV90eXBlc1wiKTthLnByb3RvdHlwZS5DYT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy52LnBhcnNlRnJvbVN0cmluZyhhLFwiYXBwbGljYXRpb24veG1sXCIpfTthLmw9ZnVuY3Rpb24oYyl7cmV0dXJuIGEuSihjLCExLFtdKS5qb2luKFwiXCIpfTthLko9ZnVuY3Rpb24oYyxkLGUpe2lmKGMubm9kZVR5cGU9PT1sLk58fGMubm9kZVR5cGU9PT1sLmNhKWQ/ZS5wdXNoKFN0cmluZyhjLm5vZGVWYWx1ZSkucmVwbGFjZSgvKFxcclxcbnxcXHJ8XFxuKS9nLFwiXCIpKTplLnB1c2goYy5ub2RlVmFsdWUpO2Vsc2UgZm9yKGM9Yy5maXJzdENoaWxkO2M7Yz1jLm5leHRTaWJsaW5nKWEuSihjLGQsZSk7cmV0dXJuIGV9O2EuQWE9ZnVuY3Rpb24oYyxkLG0pe2ZvcihkPWEuZmlyc3RFbGVtZW50Q2hpbGQoZCk7ZDtkPVxuYS5uZXh0RWxlbWVudFNpYmxpbmcoZCkpe3ZhciBiPWNbZC5uYW1lc3BhY2VVUkl8fG51bGxdO2UoYikmJihiPWJbZC5sb2NhbE5hbWVdLGUoYikmJmIuY2FsbCh2b2lkIDAsZCxtKSl9fTthLmZpcnN0RWxlbWVudENoaWxkPWZ1bmN0aW9uKGEpe2ZvcihhPWEuZmlyc3RFbGVtZW50Q2hpbGR8fGEuZmlyc3RDaGlsZDthJiZhLm5vZGVUeXBlIT09bC51OylhPWEubmV4dFNpYmxpbmc7cmV0dXJuIGF9O2EubmV4dEVsZW1lbnRTaWJsaW5nPWZ1bmN0aW9uKGEpe2ZvcihhPWEubmV4dEVsZW1lbnRTaWJsaW5nfHxhLm5leHRTaWJsaW5nO2EmJmEubm9kZVR5cGUhPT1sLnU7KWE9YS5uZXh0U2libGluZztyZXR1cm4gYX07YS5mPWZ1bmN0aW9uKGMsZCl7cmV0dXJuIGEuemEoYyxkKX07YS56YT1mdW5jdGlvbihhLGQpe3ZhciBtPWUodm9pZCAwKT92b2lkIDA6e30sYixmO2I9MDtmb3IoZj1hLmxlbmd0aDtiPGY7KytiKW1bYVtiXV09ZDtyZXR1cm4gbX07YS55YT1mdW5jdGlvbihhLGQsZil7cmV0dXJuIGZ1bmN0aW9uKGIsXG5nKXt2YXIgaD1hLmNhbGwoZShmKT9mOnRoaXMsYixnKTtpZihlKGgpKXt2YXIgbD1nW2cubGVuZ3RoLTFdLHU9ZShkKT9kOmIubG9jYWxOYW1lO2xbdV09aH19fTthLmc9ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGQsZyl7dmFyIGI9YS5jYWxsKGUodm9pZCAwKT92b2lkIDA6dGhpcyxkLGcpO2lmKGUoYikpe3ZhciBoPWdbZy5sZW5ndGgtMV0sbD1lKHZvaWQgMCk/dm9pZCAwOmQubG9jYWxOYW1lO2YoaCxsLFtdKS5wdXNoKGIpfX19O2EuSz1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oZCxmKXt2YXIgYj1hLmNhbGwoZSh2b2lkIDApP3ZvaWQgMDp0aGlzLGQsZik7ZShiKSYmZltmLmxlbmd0aC0xXS5wdXNoKGIpfX07YS5iPWZ1bmN0aW9uKGMsZCxlLGIpe2IucHVzaChjKTthLkFhKGQsZSxiKTtyZXR1cm4gYi5wb3AoKX07aC5leHBvcnRzPWF9LHtcIi4vbm9kZV90eXBlc1wiOjIsXCIuL3V0aWxzL2lzZGVmXCI6MyxcIi4vdXRpbHMvc2V0aWZ1bmRlZmluZWRcIjo0fV0sOTpbZnVuY3Rpb24oZyxcbmgpe3ZhciBhPWcoXCIuL3V0aWxzL2lzZGVmXCIpLGU9ZyhcIi4vdXRpbHMvc3RyaW5nXCIpLGY9ZyhcIi4veG1sX3BhcnNlclwiKSxsPXtLYTpcImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hXCIsT2E6ZnVuY3Rpb24oYSl7YT1mLmwoYSk7cmV0dXJuIGwuaShhKX0saTpmdW5jdGlvbihjKXtpZihjPS9eXFxzKih0cnVlfDEpfChmYWxzZXwwKVxccyokLy5leGVjKGMpKXJldHVybiBhKGNbMV0pfHwhMX0sUGE6ZnVuY3Rpb24oYyl7Yz1mLmwoYyk7aWYoYz0vXlxccyooXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KShafCg/OihbK1xcLV0pKFxcZHsyfSkoPzo6KFxcZHsyfSkpPykpXFxzKiQvLmV4ZWMoYykpe3ZhciBkPURhdGUuVVRDKHBhcnNlSW50KGNbMV0sMTApLHBhcnNlSW50KGNbMl0sMTApLTEscGFyc2VJbnQoY1szXSwxMCkscGFyc2VJbnQoY1s0XSwxMCkscGFyc2VJbnQoY1s1XSwxMCkscGFyc2VJbnQoY1s2XSwxMCkpLzFFMztpZihcIlpcIiE9Y1s3XSl7dmFyIGU9XG5cIi1cIj09Y1s4XT8tMToxLGQ9ZCs2MCplKnBhcnNlSW50KGNbOV0sMTApO2EoY1sxMF0pJiYoZCs9MzYwMCplKnBhcnNlSW50KGNbMTBdLDEwKSl9cmV0dXJuIGR9fSxqOmZ1bmN0aW9uKGEpe2E9Zi5sKGEpO3JldHVybiBsLm8oYSl9LG86ZnVuY3Rpb24oYSl7aWYoYT0vXlxccyooWytcXC1dP1xcZCpcXC4/XFxkKyg/OmVbK1xcLV0/XFxkKyk/KVxccyokL2kuZXhlYyhhKSlyZXR1cm4gcGFyc2VGbG9hdChhWzFdKX0sQjpmdW5jdGlvbihhKXthPWYubChhKTtyZXR1cm4gbC5DKGEpfSxDOmZ1bmN0aW9uKGEpe2lmKGE9L15cXHMqKFxcZCspXFxzKiQvLmV4ZWMoYSkpcmV0dXJuIHBhcnNlSW50KGFbMV0sMTApfSxhOmZ1bmN0aW9uKGEpe2E9Zi5sKGEpO3JldHVybiBlLnRyaW0oYSl9LFFhOmZ1bmN0aW9uKGEsZCl7bC5EYShhLGQ/XCIxXCI6XCIwXCIpfSxSYTpmdW5jdGlvbihhLGQpe3ZhciBlPW5ldyBEYXRlKDFFMypkKSxiPWUuZ2V0VVRDRnVsbFllYXIoKStcIi1cIitiLm0oZS5nZXRVVENNb250aCgpKzEsMikrXG5cIi1cIitiLm0oZS5nZXRVVENEYXRlKCksMikrXCJUXCIrYi5tKGUuZ2V0VVRDSG91cnMoKSwyKStcIjpcIitiLm0oZS5nZXRVVENNaW51dGVzKCksMikrXCI6XCIrYi5tKGUuZ2V0VVRDU2Vjb25kcygpLDIpK1wiWlwiO2EuYXBwZW5kQ2hpbGQoZi5zLmNyZWF0ZVRleHROb2RlKGIpKX0sU2E6ZnVuY3Rpb24oYSxkKXthLmFwcGVuZENoaWxkKGYucy5jcmVhdGVUZXh0Tm9kZShkLnRvUHJlY2lzaW9uKCkpKX0sVGE6ZnVuY3Rpb24oYSxkKXthLmFwcGVuZENoaWxkKGYucy5jcmVhdGVUZXh0Tm9kZShkLnRvU3RyaW5nKCkpKX0sRGE6ZnVuY3Rpb24oYSxkKXthLmFwcGVuZENoaWxkKGYucy5jcmVhdGVUZXh0Tm9kZShkKSl9fTtoLmV4cG9ydHM9bH0se1wiLi91dGlscy9pc2RlZlwiOjMsXCIuL3V0aWxzL3N0cmluZ1wiOjUsXCIuL3htbF9wYXJzZXJcIjo4fV19LHt9LFsxXSkoMSl9KTtcbiIsInZhciBqc29uRm9ybWF0ID0gZ2xvYmFsLmpzb25Gb3JtYXQgPSByZXF1aXJlKCcuL2pzb24tZm9ybWF0Jyk7XG52YXIgeG1sRm9ybWF0ID0gZ2xvYmFsLnhtbEZvcm1hdCA9IHJlcXVpcmUoJy4veG1sLWZvcm1hdCcpO1xudmFyIFdNU0NhcGFiaWxpdGllcyA9IGdsb2JhbC5XTVNDYXBhYmlsaXRpZXMgfHwgcmVxdWlyZSgnLi4vLi4vZGlzdC93bXMtY2FwYWJpbGl0aWVzLm1pbicpO1xudmFyIFNwaW5uZXIgPSByZXF1aXJlKCdzcGluLmpzJyk7XG52YXIgcmVxd2VzdCA9IGdsb2JhbC5yZXF3ZXN0ID0gcmVxdWlyZSgncmVxd2VzdCcpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xudmFyIHNlcnZpY2VTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VydmljZScpO1xudmFyIHhtbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd4bWwnKTtcbnZhciBqc29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzb24nKTtcbnZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC1hcmVhJyk7XG5cbi8vIHRoZSBvbmx5IG9wZW4gQ09SUyBwcm94eSBJIGNvdWxkIGZpbmRcbnZhciBwcm94eSA9IFwiaHR0cHM6Ly9xdWVyeS55YWhvb2FwaXMuY29tL3YxL3B1YmxpYy95cWxcIjtcbnZhciBwYXJzZXIgPSBuZXcgV01TQ2FwYWJpbGl0aWVzKCk7XG5cbmZ1bmN0aW9uIHNob3dJbnB1dCgpIHtcbiAgeG1sLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIGlucHV0LnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbn1cblxuZnVuY3Rpb24gaGlkZUlucHV0KCkge1xuICB4bWwuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUoeG1sU3RyaW5nKSB7XG4gIHhtbC50ZXh0Q29udGVudCA9IHhtbEZvcm1hdCh4bWxTdHJpbmcpO1xuICBQcmlzbS5oaWdobGlnaHRFbGVtZW50KHhtbCk7XG5cbiAganNvbi50ZXh0Q29udGVudCA9IGpzb25Gb3JtYXQoSlNPTi5zdHJpbmdpZnkocGFyc2VyLnBhcnNlKHhtbFN0cmluZykpKTtcbiAgUHJpc20uaGlnaGxpZ2h0RWxlbWVudChqc29uKTtcbn1cblxuc2VydmljZVNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgaWYgKHNlcnZpY2VTZWxlY3QudmFsdWUgIT09ICcnKSB7XG4gICAgaGlkZUlucHV0KCk7XG5cbiAgICByZXF3ZXN0KHtcbiAgICAgIHVybDogcHJveHksXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHE6ICdzZWxlY3QgKiBmcm9tIHhtbCB3aGVyZSB1cmw9XCInICtcbiAgICAgICAgICBzZXJ2aWNlU2VsZWN0LnZhbHVlLnJlcGxhY2UoL1xcJmFtcFxcOy9nLCAnJicpICsgJ1wiJ1xuICAgICAgfSxcbiAgICAgIHR5cGU6IFwieG1sXCIsXG4gICAgICBjcm9zc09yaWdpbjogdHJ1ZSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHhtbCkge1xuICAgICAgICB1cGRhdGUoeG1sLmZpcnN0Q2hpbGQuZmlyc3RDaGlsZC5pbm5lckhUTUwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59LCBmYWxzZSk7XG5cbnhtbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNob3dJbnB1dCwgZmFsc2UpO1xuXG5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIGZ1bmN0aW9uKCkge1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIHVwZGF0ZShpbnB1dC52YWx1ZSk7XG4gICAgaGlkZUlucHV0KCk7XG4gIH0sIDUwKTtcbn0sIGZhbHNlKTtcbiIsIi8qXG4gICAganNvbi1mb3JtYXQgdi4xLjFcbiAgICBodHRwOi8vZ2l0aHViLmNvbS9waG9ib3NsYWIvanNvbi1mb3JtYXRcblxuICAgIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlOlxuICAgIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4qL1xuXG52YXIgcCA9IFtdLFxuICBwdXNoID0gZnVuY3Rpb24obSkge1xuICAgIHJldHVybiAnXFxcXCcgKyBwLnB1c2gobSkgKyAnXFxcXCc7XG4gIH0sXG4gIHBvcCA9IGZ1bmN0aW9uKG0sIGkpIHtcbiAgICByZXR1cm4gcFtpIC0gMV1cbiAgfSxcbiAgdGFicyA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheShjb3VudCArIDEpLmpvaW4oJ1xcdCcpO1xuICB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGpzb24pIHtcbiAgcCA9IFtdO1xuICB2YXIgb3V0ID0gXCJcIixcbiAgICBpbmRlbnQgPSAwO1xuXG4gIC8vIEV4dHJhY3QgYmFja3NsYXNoZXMgYW5kIHN0cmluZ3NcbiAganNvbiA9IGpzb25cbiAgICAucmVwbGFjZSgvXFxcXC4vZywgcHVzaClcbiAgICAucmVwbGFjZSgvKFwiLio/XCJ8Jy4qPycpL2csIHB1c2gpXG4gICAgLnJlcGxhY2UoL1xccysvLCAnJyk7XG5cbiAgLy8gSW5kZW50IGFuZCBpbnNlcnQgbmV3bGluZXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGMgPSBqc29uLmNoYXJBdChpKTtcblxuICAgIHN3aXRjaCAoYykge1xuICAgICAgY2FzZSAneyc6XG4gICAgICAgIG91dCArPSBjICsgXCJcXG5cIiArIHRhYnMoKytpbmRlbnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1snOlxuICAgICAgICBvdXQgKz0gYyArIFwiXFxuXCIgKyB0YWJzKCsraW5kZW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICddJzpcbiAgICAgICAgb3V0ICs9IFwiXFxuXCIgKyB0YWJzKC0taW5kZW50KSArIGM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnfSc6XG4gICAgICAgIG91dCArPSBcIlxcblwiICsgdGFicygtLWluZGVudCkgKyBjO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJywnOlxuICAgICAgICBpZiAoL1xcZC8udGVzdChqc29uLmNoYXJBdChpIC0gMSkpKSB7XG4gICAgICAgICAgb3V0ICs9IFwiLCBcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQgKz0gXCIsXFxuXCIgKyB0YWJzKGluZGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICc6JzpcbiAgICAgICAgb3V0ICs9IFwiOiBcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBvdXQgKz0gYztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RyaXAgd2hpdGVzcGFjZSBmcm9tIG51bWVyaWMgYXJyYXlzIGFuZCBwdXQgYmFja3NsYXNoZXNcbiAgLy8gYW5kIHN0cmluZ3MgYmFjayBpblxuICBvdXQgPSBvdXRcbiAgICAucmVwbGFjZSgvXFxbW1xcZCxcXHNdKz9cXF0vZywgZnVuY3Rpb24obSkge1xuICAgICAgcmV0dXJuIG0ucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICB9KVxuICAgIC8vIG51bWJlciBhcnJheXNcbiAgICAucmVwbGFjZSgvXFxbXFxzKihcXGQpL2csIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiAnWycgKyBiO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoLyhcXGQpXFxzKlxcXS9nLCBmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYiArICddJztcbiAgICB9KVxuICAgIC5yZXBsYWNlKC9cXHtcXHMqXFx9L2csICd7fScpIC8vIGVtcHR5IG9iamVjdHNcbiAgICAucmVwbGFjZSgvXFxcXChcXGQrKVxcXFwvZywgcG9wKSAvLyBzdHJpbmdzXG4gICAgLnJlcGxhY2UoL1xcXFwoXFxkKylcXFxcL2csIHBvcCk7IC8vIGJhY2tzbGFzaGVzIGluIHN0cmluZ3NcblxuICByZXR1cm4gb3V0O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHhtbCkge1xuICB2YXIgZm9ybWF0dGVkID0gJyc7XG4gIHZhciByZWcgPSAvKD4pKDwpKFxcLyopL2c7XG4gIHhtbCA9IHhtbC5yZXBsYWNlKHJlZywgJyQxXFxyXFxuJDIkMycpO1xuICB2YXIgcGFkID0gMDtcblxuICB4bWwuc3BsaXQoJ1xcclxcbicpLmZvckVhY2goZnVuY3Rpb24obm9kZSwgaW5kZXgpIHtcbiAgICB2YXIgaW5kZW50ID0gMDtcbiAgICBpZiAobm9kZS5tYXRjaCgvLis8XFwvXFx3W14+XSo+JC8pKSB7XG4gICAgICBpbmRlbnQgPSAwO1xuICAgIH0gZWxzZSBpZiAobm9kZS5tYXRjaCgvXjxcXC9cXHcvKSkge1xuICAgICAgaWYgKHBhZCAhPSAwKSB7XG4gICAgICAgIHBhZCAtPSAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS5tYXRjaCgvXjxcXHdbXj5dKlteXFwvXT4uKiQvKSkge1xuICAgICAgaW5kZW50ID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5kZW50ID0gMDtcbiAgICB9XG5cbiAgICB2YXIgcGFkZGluZyA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFkOyBpKyspIHtcbiAgICAgIHBhZGRpbmcgKz0gJyAgJztcbiAgICB9XG5cbiAgICBmb3JtYXR0ZWQgKz0gcGFkZGluZyArIG5vZGUgKyAnXFxyXFxuJztcbiAgICBwYWQgKz0gaW5kZW50O1xuICB9KTtcblxuICByZXR1cm4gZm9ybWF0dGVkO1xufTtcbiIsIi8qIVxuICAqIFJlcXdlc3QhIEEgZ2VuZXJhbCBwdXJwb3NlIFhIUiBjb25uZWN0aW9uIG1hbmFnZXJcbiAgKiBsaWNlbnNlIE1JVCAoYykgRHVzdGluIERpYXogMjAxNFxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvcmVxd2VzdFxuICAqL1xuXG4hZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KCdyZXF3ZXN0JywgdGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciB3aW4gPSB3aW5kb3dcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCBodHRwc1JlID0gL15odHRwL1xuICAgICwgcHJvdG9jb2xSZSA9IC8oXlxcdyspOlxcL1xcLy9cbiAgICAsIHR3b0h1bmRvID0gL14oMjBcXGR8MTIyMykkLyAvL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICAgICwgYnlUYWcgPSAnZ2V0RWxlbWVudHNCeVRhZ05hbWUnXG4gICAgLCByZWFkeVN0YXRlID0gJ3JlYWR5U3RhdGUnXG4gICAgLCBjb250ZW50VHlwZSA9ICdDb250ZW50LVR5cGUnXG4gICAgLCByZXF1ZXN0ZWRXaXRoID0gJ1gtUmVxdWVzdGVkLVdpdGgnXG4gICAgLCBoZWFkID0gZG9jW2J5VGFnXSgnaGVhZCcpWzBdXG4gICAgLCB1bmlxaWQgPSAwXG4gICAgLCBjYWxsYmFja1ByZWZpeCA9ICdyZXF3ZXN0XycgKyAoK25ldyBEYXRlKCkpXG4gICAgLCBsYXN0VmFsdWUgLy8gZGF0YSBzdG9yZWQgYnkgdGhlIG1vc3QgcmVjZW50IEpTT05QIGNhbGxiYWNrXG4gICAgLCB4bWxIdHRwUmVxdWVzdCA9ICdYTUxIdHRwUmVxdWVzdCdcbiAgICAsIHhEb21haW5SZXF1ZXN0ID0gJ1hEb21haW5SZXF1ZXN0J1xuICAgICwgbm9vcCA9IGZ1bmN0aW9uICgpIHt9XG5cbiAgICAsIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PSAnZnVuY3Rpb24nXG4gICAgICAgID8gQXJyYXkuaXNBcnJheVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gYSBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgICAgfVxuXG4gICAgLCBkZWZhdWx0SGVhZGVycyA9IHtcbiAgICAgICAgICAnY29udGVudFR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAsICdyZXF1ZXN0ZWRXaXRoJzogeG1sSHR0cFJlcXVlc3RcbiAgICAgICAgLCAnYWNjZXB0Jzoge1xuICAgICAgICAgICAgICAnKic6ICAndGV4dC9qYXZhc2NyaXB0LCB0ZXh0L2h0bWwsIGFwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwsICovKidcbiAgICAgICAgICAgICwgJ3htbCc6ICAnYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCdcbiAgICAgICAgICAgICwgJ2h0bWwnOiAndGV4dC9odG1sJ1xuICAgICAgICAgICAgLCAndGV4dCc6ICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgLCAnanNvbic6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQnXG4gICAgICAgICAgICAsICdqcyc6ICAgJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQsIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAsIHhociA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgLy8gaXMgaXQgeC1kb21haW5cbiAgICAgICAgaWYgKG9bJ2Nyb3NzT3JpZ2luJ10gPT09IHRydWUpIHtcbiAgICAgICAgICB2YXIgeGhyID0gd2luW3htbEh0dHBSZXF1ZXN0XSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbnVsbFxuICAgICAgICAgIGlmICh4aHIgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgICAgICAgICByZXR1cm4geGhyXG4gICAgICAgICAgfSBlbHNlIGlmICh3aW5beERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0KClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCcm93c2VyIGRvZXMgbm90IHN1cHBvcnQgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzJylcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAod2luW3htbEh0dHBSZXF1ZXN0XSkge1xuICAgICAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgLCBnbG9iYWxTZXR1cE9wdGlvbnMgPSB7XG4gICAgICAgIGRhdGFGaWx0ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgfVxuICAgICAgfVxuXG4gIGZ1bmN0aW9uIHN1Y2NlZWQocikge1xuICAgIHZhciBwcm90b2NvbCA9IHByb3RvY29sUmUuZXhlYyhyLnVybCk7XG4gICAgcHJvdG9jb2wgPSAocHJvdG9jb2wgJiYgcHJvdG9jb2xbMV0pIHx8IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcbiAgICByZXR1cm4gaHR0cHNSZS50ZXN0KHByb3RvY29sKSA/IHR3b0h1bmRvLnRlc3Qoci5yZXF1ZXN0LnN0YXR1cykgOiAhIXIucmVxdWVzdC5yZXNwb25zZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlYWR5U3RhdGUociwgc3VjY2VzcywgZXJyb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdXNlIF9hYm9ydGVkIHRvIG1pdGlnYXRlIGFnYWluc3QgSUUgZXJyIGMwMGMwMjNmXG4gICAgICAvLyAoY2FuJ3QgcmVhZCBwcm9wcyBvbiBhYm9ydGVkIHJlcXVlc3Qgb2JqZWN0cylcbiAgICAgIGlmIChyLl9hYm9ydGVkKSByZXR1cm4gZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgaWYgKHIuX3RpbWVkT3V0KSByZXR1cm4gZXJyb3Ioci5yZXF1ZXN0LCAnUmVxdWVzdCBpcyBhYm9ydGVkOiB0aW1lb3V0JylcbiAgICAgIGlmIChyLnJlcXVlc3QgJiYgci5yZXF1ZXN0W3JlYWR5U3RhdGVdID09IDQpIHtcbiAgICAgICAgci5yZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG5vb3BcbiAgICAgICAgaWYgKHN1Y2NlZWQocikpIHN1Y2Nlc3Moci5yZXF1ZXN0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEhlYWRlcnMoaHR0cCwgbykge1xuICAgIHZhciBoZWFkZXJzID0gb1snaGVhZGVycyddIHx8IHt9XG4gICAgICAsIGhcblxuICAgIGhlYWRlcnNbJ0FjY2VwdCddID0gaGVhZGVyc1snQWNjZXB0J11cbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzWydhY2NlcHQnXVtvWyd0eXBlJ11dXG4gICAgICB8fCBkZWZhdWx0SGVhZGVyc1snYWNjZXB0J11bJyonXVxuXG4gICAgdmFyIGlzQUZvcm1EYXRhID0gdHlwZW9mIEZvcm1EYXRhID09PSAnZnVuY3Rpb24nICYmIChvWydkYXRhJ10gaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG4gICAgLy8gYnJlYWtzIGNyb3NzLW9yaWdpbiByZXF1ZXN0cyB3aXRoIGxlZ2FjeSBicm93c2Vyc1xuICAgIGlmICghb1snY3Jvc3NPcmlnaW4nXSAmJiAhaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSkgaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSA9IGRlZmF1bHRIZWFkZXJzWydyZXF1ZXN0ZWRXaXRoJ11cbiAgICBpZiAoIWhlYWRlcnNbY29udGVudFR5cGVdICYmICFpc0FGb3JtRGF0YSkgaGVhZGVyc1tjb250ZW50VHlwZV0gPSBvWydjb250ZW50VHlwZSddIHx8IGRlZmF1bHRIZWFkZXJzWydjb250ZW50VHlwZSddXG4gICAgZm9yIChoIGluIGhlYWRlcnMpXG4gICAgICBoZWFkZXJzLmhhc093blByb3BlcnR5KGgpICYmICdzZXRSZXF1ZXN0SGVhZGVyJyBpbiBodHRwICYmIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihoLCBoZWFkZXJzW2hdKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q3JlZGVudGlhbHMoaHR0cCwgbykge1xuICAgIGlmICh0eXBlb2Ygb1snd2l0aENyZWRlbnRpYWxzJ10gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBodHRwLndpdGhDcmVkZW50aWFscyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGh0dHAud2l0aENyZWRlbnRpYWxzID0gISFvWyd3aXRoQ3JlZGVudGlhbHMnXVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYWxDYWxsYmFjayhkYXRhKSB7XG4gICAgbGFzdFZhbHVlID0gZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gdXJsYXBwZW5kICh1cmwsIHMpIHtcbiAgICByZXR1cm4gdXJsICsgKC9cXD8vLnRlc3QodXJsKSA/ICcmJyA6ICc/JykgKyBzXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpIHtcbiAgICB2YXIgcmVxSWQgPSB1bmlxaWQrK1xuICAgICAgLCBjYmtleSA9IG9bJ2pzb25wQ2FsbGJhY2snXSB8fCAnY2FsbGJhY2snIC8vIHRoZSAnY2FsbGJhY2snIGtleVxuICAgICAgLCBjYnZhbCA9IG9bJ2pzb25wQ2FsbGJhY2tOYW1lJ10gfHwgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeChyZXFJZClcbiAgICAgICwgY2JyZWcgPSBuZXcgUmVnRXhwKCcoKF58XFxcXD98JiknICsgY2JrZXkgKyAnKT0oW14mXSspJylcbiAgICAgICwgbWF0Y2ggPSB1cmwubWF0Y2goY2JyZWcpXG4gICAgICAsIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAgLCBsb2FkZWQgPSAwXG4gICAgICAsIGlzSUUxMCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSAxMC4wJykgIT09IC0xXG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGlmIChtYXRjaFszXSA9PT0gJz8nKSB7XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKGNicmVnLCAnJDE9JyArIGNidmFsKSAvLyB3aWxkY2FyZCBjYWxsYmFjayBmdW5jIG5hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNidmFsID0gbWF0Y2hbM10gLy8gcHJvdmlkZWQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGNia2V5ICsgJz0nICsgY2J2YWwpIC8vIG5vIGNhbGxiYWNrIGRldGFpbHMsIGFkZCAnZW1cbiAgICB9XG5cbiAgICB3aW5bY2J2YWxdID0gZ2VuZXJhbENhbGxiYWNrXG5cbiAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnXG4gICAgc2NyaXB0LnNyYyA9IHVybFxuICAgIHNjcmlwdC5hc3luYyA9IHRydWVcbiAgICBpZiAodHlwZW9mIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgIT09ICd1bmRlZmluZWQnICYmICFpc0lFMTApIHtcbiAgICAgIC8vIG5lZWQgdGhpcyBmb3IgSUUgZHVlIHRvIG91dC1vZi1vcmRlciBvbnJlYWR5c3RhdGVjaGFuZ2UoKSwgYmluZGluZyBzY3JpcHRcbiAgICAgIC8vIGV4ZWN1dGlvbiB0byBhbiBldmVudCBsaXN0ZW5lciBnaXZlcyB1cyBjb250cm9sIG92ZXIgd2hlbiB0aGUgc2NyaXB0XG4gICAgICAvLyBpcyBleGVjdXRlZC4gU2VlIGh0dHA6Ly9qYXVib3VyZy5uZXQvMjAxMC8wNy9sb2FkaW5nLXNjcmlwdC1hcy1vbmNsaWNrLWhhbmRsZXItb2YuaHRtbFxuICAgICAgc2NyaXB0Lmh0bWxGb3IgPSBzY3JpcHQuaWQgPSAnX3JlcXdlc3RfJyArIHJlcUlkXG4gICAgfVxuXG4gICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoKHNjcmlwdFtyZWFkeVN0YXRlXSAmJiBzY3JpcHRbcmVhZHlTdGF0ZV0gIT09ICdjb21wbGV0ZScgJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnbG9hZGVkJykgfHwgbG9hZGVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgICBzY3JpcHQub25jbGljayAmJiBzY3JpcHQub25jbGljaygpXG4gICAgICAvLyBDYWxsIHRoZSB1c2VyIGNhbGxiYWNrIHdpdGggdGhlIGxhc3QgdmFsdWUgc3RvcmVkIGFuZCBjbGVhbiB1cCB2YWx1ZXMgYW5kIHNjcmlwdHMuXG4gICAgICBmbihsYXN0VmFsdWUpXG4gICAgICBsYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgbG9hZGVkID0gMVxuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgc2NyaXB0IHRvIHRoZSBET00gaGVhZFxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuXG4gICAgLy8gRW5hYmxlIEpTT05QIHRpbWVvdXRcbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgICAgIGVycih7fSwgJ1JlcXVlc3QgaXMgYWJvcnRlZDogdGltZW91dCcsIHt9KVxuICAgICAgICBsYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpXG4gICAgICAgIGxvYWRlZCA9IDFcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSZXF1ZXN0KGZuLCBlcnIpIHtcbiAgICB2YXIgbyA9IHRoaXMub1xuICAgICAgLCBtZXRob2QgPSAob1snbWV0aG9kJ10gfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKClcbiAgICAgICwgdXJsID0gdHlwZW9mIG8gPT09ICdzdHJpbmcnID8gbyA6IG9bJ3VybCddXG4gICAgICAvLyBjb252ZXJ0IG5vbi1zdHJpbmcgb2JqZWN0cyB0byBxdWVyeS1zdHJpbmcgZm9ybSB1bmxlc3Mgb1sncHJvY2Vzc0RhdGEnXSBpcyBmYWxzZVxuICAgICAgLCBkYXRhID0gKG9bJ3Byb2Nlc3NEYXRhJ10gIT09IGZhbHNlICYmIG9bJ2RhdGEnXSAmJiB0eXBlb2Ygb1snZGF0YSddICE9PSAnc3RyaW5nJylcbiAgICAgICAgPyByZXF3ZXN0LnRvUXVlcnlTdHJpbmcob1snZGF0YSddKVxuICAgICAgICA6IChvWydkYXRhJ10gfHwgbnVsbClcbiAgICAgICwgaHR0cFxuICAgICAgLCBzZW5kV2FpdCA9IGZhbHNlXG5cbiAgICAvLyBpZiB3ZSdyZSB3b3JraW5nIG9uIGEgR0VUIHJlcXVlc3QgYW5kIHdlIGhhdmUgZGF0YSB0aGVuIHdlIHNob3VsZCBhcHBlbmRcbiAgICAvLyBxdWVyeSBzdHJpbmcgdG8gZW5kIG9mIFVSTCBhbmQgbm90IHBvc3QgZGF0YVxuICAgIGlmICgob1sndHlwZSddID09ICdqc29ucCcgfHwgbWV0aG9kID09ICdHRVQnKSAmJiBkYXRhKSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBkYXRhKVxuICAgICAgZGF0YSA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAob1sndHlwZSddID09ICdqc29ucCcpIHJldHVybiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpXG5cbiAgICAvLyBnZXQgdGhlIHhociBmcm9tIHRoZSBmYWN0b3J5IGlmIHBhc3NlZFxuICAgIC8vIGlmIHRoZSBmYWN0b3J5IHJldHVybnMgbnVsbCwgZmFsbC1iYWNrIHRvIG91cnNcbiAgICBodHRwID0gKG8ueGhyICYmIG8ueGhyKG8pKSB8fCB4aHIobylcblxuICAgIGh0dHAub3BlbihtZXRob2QsIHVybCwgb1snYXN5bmMnXSA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWUpXG4gICAgc2V0SGVhZGVycyhodHRwLCBvKVxuICAgIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pXG4gICAgaWYgKHdpblt4RG9tYWluUmVxdWVzdF0gJiYgaHR0cCBpbnN0YW5jZW9mIHdpblt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgaHR0cC5vbmxvYWQgPSBmblxuICAgICAgICBodHRwLm9uZXJyb3IgPSBlcnJcbiAgICAgICAgLy8gTk9URTogc2VlXG4gICAgICAgIC8vIGh0dHA6Ly9zb2NpYWwubXNkbi5taWNyb3NvZnQuY29tL0ZvcnVtcy9lbi1VUy9pZXdlYmRldmVsb3BtZW50L3RocmVhZC8zMGVmM2FkZC03NjdjLTQ0MzYtYjhhOS1mMWNhMTliNDgxMmVcbiAgICAgICAgaHR0cC5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7fVxuICAgICAgICBzZW5kV2FpdCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVSZWFkeVN0YXRlKHRoaXMsIGZuLCBlcnIpXG4gICAgfVxuICAgIG9bJ2JlZm9yZSddICYmIG9bJ2JlZm9yZSddKGh0dHApXG4gICAgaWYgKHNlbmRXYWl0KSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaHR0cC5zZW5kKGRhdGEpXG4gICAgICB9LCAyMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgIH1cbiAgICByZXR1cm4gaHR0cFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxd2VzdChvLCBmbikge1xuICAgIHRoaXMubyA9IG9cbiAgICB0aGlzLmZuID0gZm5cblxuICAgIGluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHlwZShoZWFkZXIpIHtcbiAgICAvLyBqc29uLCBqYXZhc2NyaXB0LCB0ZXh0L3BsYWluLCB0ZXh0L2h0bWwsIHhtbFxuICAgIGlmIChoZWFkZXIubWF0Y2goJ2pzb24nKSkgcmV0dXJuICdqc29uJ1xuICAgIGlmIChoZWFkZXIubWF0Y2goJ2phdmFzY3JpcHQnKSkgcmV0dXJuICdqcydcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCd0ZXh0JykpIHJldHVybiAnaHRtbCdcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCd4bWwnKSkgcmV0dXJuICd4bWwnXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KG8sIGZuKSB7XG5cbiAgICB0aGlzLnVybCA9IHR5cGVvZiBvID09ICdzdHJpbmcnID8gbyA6IG9bJ3VybCddXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuXG4gICAgLy8gd2hldGhlciByZXF1ZXN0IGhhcyBiZWVuIGZ1bGZpbGxlZCBmb3IgcHVycG9zZVxuICAgIC8vIG9mIHRyYWNraW5nIHRoZSBQcm9taXNlc1xuICAgIHRoaXMuX2Z1bGZpbGxlZCA9IGZhbHNlXG4gICAgLy8gc3VjY2VzcyBoYW5kbGVyc1xuICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24oKXt9XG4gICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycyA9IFtdXG4gICAgLy8gZXJyb3IgaGFuZGxlcnNcbiAgICB0aGlzLl9lcnJvckhhbmRsZXJzID0gW11cbiAgICAvLyBjb21wbGV0ZSAoYm90aCBzdWNjZXNzIGFuZCBmYWlsKSBoYW5kbGVyc1xuICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMgPSBbXVxuICAgIHRoaXMuX2VycmVkID0gZmFsc2VcbiAgICB0aGlzLl9yZXNwb25zZUFyZ3MgPSB7fVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICBmbiA9IGZuIHx8IGZ1bmN0aW9uICgpIHt9XG5cbiAgICBpZiAob1sndGltZW91dCddKSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGltZWRPdXQoKVxuICAgICAgfSwgb1sndGltZW91dCddKVxuICAgIH1cblxuICAgIGlmIChvWydzdWNjZXNzJ10pIHtcbiAgICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydzdWNjZXNzJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvWydlcnJvciddKSB7XG4gICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydlcnJvciddLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKG9bJ2NvbXBsZXRlJ10pIHtcbiAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ2NvbXBsZXRlJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSAocmVzcCkge1xuICAgICAgb1sndGltZW91dCddICYmIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG4gICAgICBzZWxmLnRpbWVvdXQgPSBudWxsXG4gICAgICB3aGlsZSAoc2VsZi5fY29tcGxldGVIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MgKHJlc3ApIHtcbiAgICAgIHZhciB0eXBlID0gb1sndHlwZSddIHx8IHJlc3AgJiYgc2V0VHlwZShyZXNwLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKSkgLy8gcmVzcCBjYW4gYmUgdW5kZWZpbmVkIGluIElFXG4gICAgICByZXNwID0gKHR5cGUgIT09ICdqc29ucCcpID8gc2VsZi5yZXF1ZXN0IDogcmVzcFxuICAgICAgLy8gdXNlIGdsb2JhbCBkYXRhIGZpbHRlciBvbiByZXNwb25zZSB0ZXh0XG4gICAgICB2YXIgZmlsdGVyZWRSZXNwb25zZSA9IGdsb2JhbFNldHVwT3B0aW9ucy5kYXRhRmlsdGVyKHJlc3AucmVzcG9uc2VUZXh0LCB0eXBlKVxuICAgICAgICAsIHIgPSBmaWx0ZXJlZFJlc3BvbnNlXG4gICAgICB0cnkge1xuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dCA9IHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY2FuJ3QgYXNzaWduIHRoaXMgaW4gSUU8PTgsIGp1c3QgaWdub3JlXG4gICAgICB9XG4gICAgICBpZiAocikge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3AgPSB3aW4uSlNPTiA/IHdpbi5KU09OLnBhcnNlKHIpIDogZXZhbCgnKCcgKyByICsgJyknKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yKHJlc3AsICdDb3VsZCBub3QgcGFyc2UgSlNPTiBpbiByZXNwb25zZScsIGVycilcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnanMnOlxuICAgICAgICAgIHJlc3AgPSBldmFsKHIpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgcmVzcCA9IHJcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd4bWwnOlxuICAgICAgICAgIHJlc3AgPSByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvciAvLyBJRSB0cm9sb2xvXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5lcnJvckNvZGVcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLnJlYXNvblxuICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICA6IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fZnVsZmlsbGVkID0gdHJ1ZVxuICAgICAgZm4ocmVzcClcbiAgICAgIHNlbGYuX3N1Y2Nlc3NIYW5kbGVyKHJlc3ApXG4gICAgICB3aGlsZSAoc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3AgPSBzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLnNoaWZ0KCkocmVzcClcbiAgICAgIH1cblxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aW1lZE91dCgpIHtcbiAgICAgIHNlbGYuX3RpbWVkT3V0ID0gdHJ1ZVxuICAgICAgc2VsZi5yZXF1ZXN0LmFib3J0KCkgICAgICBcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwLCBtc2csIHQpIHtcbiAgICAgIHJlc3AgPSBzZWxmLnJlcXVlc3RcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLm1zZyA9IG1zZ1xuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnQgPSB0XG4gICAgICBzZWxmLl9lcnJlZCA9IHRydWVcbiAgICAgIHdoaWxlIChzZWxmLl9lcnJvckhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fZXJyb3JIYW5kbGVycy5zaGlmdCgpKHJlc3AsIG1zZywgdClcbiAgICAgIH1cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0ID0gZ2V0UmVxdWVzdC5jYWxsKHRoaXMsIHN1Y2Nlc3MsIGVycm9yKVxuICB9XG5cbiAgUmVxd2VzdC5wcm90b3R5cGUgPSB7XG4gICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2Fib3J0ZWQgPSB0cnVlXG4gICAgICB0aGlzLnJlcXVlc3QuYWJvcnQoKVxuICAgIH1cblxuICAsIHJldHJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0LmNhbGwodGhpcywgdGhpcy5vLCB0aGlzLmZuKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNtYWxsIGRldmlhdGlvbiBmcm9tIHRoZSBQcm9taXNlcyBBIENvbW1vbkpzIHNwZWNpZmljYXRpb25cbiAgICAgKiBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Qcm9taXNlcy9BXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBgdGhlbmAgd2lsbCBleGVjdXRlIHVwb24gc3VjY2Vzc2Z1bCByZXF1ZXN0c1xuICAgICAqL1xuICAsIHRoZW46IGZ1bmN0aW9uIChzdWNjZXNzLCBmYWlsKSB7XG4gICAgICBzdWNjZXNzID0gc3VjY2VzcyB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgZmFpbCA9IGZhaWwgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQpIHtcbiAgICAgICAgdGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AgPSBzdWNjZXNzKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmYWlsKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMucHVzaChzdWNjZXNzKVxuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZmFpbClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGFsd2F5c2Agd2lsbCBleGVjdXRlIHdoZXRoZXIgdGhlIHJlcXVlc3Qgc3VjY2VlZHMgb3IgZmFpbHNcbiAgICAgKi9cbiAgLCBhbHdheXM6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCB8fCB0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGZhaWxgIHdpbGwgZXhlY3V0ZSB3aGVuIHRoZSByZXF1ZXN0IGZhaWxzXG4gICAgICovXG4gICwgZmFpbDogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICwgJ2NhdGNoJzogZnVuY3Rpb24gKGZuKSB7XG4gICAgICByZXR1cm4gdGhpcy5mYWlsKGZuKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcXdlc3QobywgZm4pIHtcbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICAvLyBub3JtYWxpemUgbmV3bGluZSB2YXJpYW50cyBhY2NvcmRpbmcgdG8gc3BlYyAtPiBDUkxGXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShzKSB7XG4gICAgcmV0dXJuIHMgPyBzLnJlcGxhY2UoL1xccj9cXG4vZywgJ1xcclxcbicpIDogJydcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcmlhbChlbCwgY2IpIHtcbiAgICB2YXIgbiA9IGVsLm5hbWVcbiAgICAgICwgdCA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgLCBvcHRDYiA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgLy8gSUUgZ2l2ZXMgdmFsdWU9XCJcIiBldmVuIHdoZXJlIHRoZXJlIGlzIG5vIHZhbHVlIGF0dHJpYnV0ZVxuICAgICAgICAgIC8vICdzcGVjaWZpZWQnIHJlZjogaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtQ29yZS9jb3JlLmh0bWwjSUQtODYyNTI5MjczXG4gICAgICAgICAgaWYgKG8gJiYgIW9bJ2Rpc2FibGVkJ10pXG4gICAgICAgICAgICBjYihuLCBub3JtYWxpemUob1snYXR0cmlidXRlcyddWyd2YWx1ZSddICYmIG9bJ2F0dHJpYnV0ZXMnXVsndmFsdWUnXVsnc3BlY2lmaWVkJ10gPyBvWyd2YWx1ZSddIDogb1sndGV4dCddKSlcbiAgICAgICAgfVxuICAgICAgLCBjaCwgcmEsIHZhbCwgaVxuXG4gICAgLy8gZG9uJ3Qgc2VyaWFsaXplIGVsZW1lbnRzIHRoYXQgYXJlIGRpc2FibGVkIG9yIHdpdGhvdXQgYSBuYW1lXG4gICAgaWYgKGVsLmRpc2FibGVkIHx8ICFuKSByZXR1cm5cblxuICAgIHN3aXRjaCAodCkge1xuICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgIGlmICghL3Jlc2V0fGJ1dHRvbnxpbWFnZXxmaWxlL2kudGVzdChlbC50eXBlKSkge1xuICAgICAgICBjaCA9IC9jaGVja2JveC9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgcmEgPSAvcmFkaW8vaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHZhbCA9IGVsLnZhbHVlXG4gICAgICAgIC8vIFdlYktpdCBnaXZlcyB1cyBcIlwiIGluc3RlYWQgb2YgXCJvblwiIGlmIGEgY2hlY2tib3ggaGFzIG5vIHZhbHVlLCBzbyBjb3JyZWN0IGl0IGhlcmVcbiAgICAgICAgOyghKGNoIHx8IHJhKSB8fCBlbC5jaGVja2VkKSAmJiBjYihuLCBub3JtYWxpemUoY2ggJiYgdmFsID09PSAnJyA/ICdvbicgOiB2YWwpKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICBjYihuLCBub3JtYWxpemUoZWwudmFsdWUpKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgaWYgKGVsLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdC1vbmUnKSB7XG4gICAgICAgIG9wdENiKGVsLnNlbGVjdGVkSW5kZXggPj0gMCA/IGVsLm9wdGlvbnNbZWwuc2VsZWN0ZWRJbmRleF0gOiBudWxsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gMDsgZWwubGVuZ3RoICYmIGkgPCBlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVsLm9wdGlvbnNbaV0uc2VsZWN0ZWQgJiYgb3B0Q2IoZWwub3B0aW9uc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvLyBjb2xsZWN0IHVwIGFsbCBmb3JtIGVsZW1lbnRzIGZvdW5kIGZyb20gdGhlIHBhc3NlZCBhcmd1bWVudCBlbGVtZW50cyBhbGxcbiAgLy8gdGhlIHdheSBkb3duIHRvIGNoaWxkIGVsZW1lbnRzOyBwYXNzIGEgJzxmb3JtPicgb3IgZm9ybSBmaWVsZHMuXG4gIC8vIGNhbGxlZCB3aXRoICd0aGlzJz1jYWxsYmFjayB0byB1c2UgZm9yIHNlcmlhbCgpIG9uIGVhY2ggZWxlbWVudFxuICBmdW5jdGlvbiBlYWNoRm9ybUVsZW1lbnQoKSB7XG4gICAgdmFyIGNiID0gdGhpc1xuICAgICAgLCBlLCBpXG4gICAgICAsIHNlcmlhbGl6ZVN1YnRhZ3MgPSBmdW5jdGlvbiAoZSwgdGFncykge1xuICAgICAgICAgIHZhciBpLCBqLCBmYVxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmYSA9IGVbYnlUYWddKHRhZ3NbaV0pXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZmEubGVuZ3RoOyBqKyspIHNlcmlhbChmYVtqXSwgY2IpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlID0gYXJndW1lbnRzW2ldXG4gICAgICBpZiAoL2lucHV0fHNlbGVjdHx0ZXh0YXJlYS9pLnRlc3QoZS50YWdOYW1lKSkgc2VyaWFsKGUsIGNiKVxuICAgICAgc2VyaWFsaXplU3VidGFncyhlLCBbICdpbnB1dCcsICdzZWxlY3QnLCAndGV4dGFyZWEnIF0pXG4gICAgfVxuICB9XG5cbiAgLy8gc3RhbmRhcmQgcXVlcnkgc3RyaW5nIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplUXVlcnlTdHJpbmcoKSB7XG4gICAgcmV0dXJuIHJlcXdlc3QudG9RdWVyeVN0cmluZyhyZXF3ZXN0LnNlcmlhbGl6ZUFycmF5LmFwcGx5KG51bGwsIGFyZ3VtZW50cykpXG4gIH1cblxuICAvLyB7ICduYW1lJzogJ3ZhbHVlJywgLi4uIH0gc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVIYXNoKCkge1xuICAgIHZhciBoYXNoID0ge31cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAobmFtZSBpbiBoYXNoKSB7XG4gICAgICAgIGhhc2hbbmFtZV0gJiYgIWlzQXJyYXkoaGFzaFtuYW1lXSkgJiYgKGhhc2hbbmFtZV0gPSBbaGFzaFtuYW1lXV0pXG4gICAgICAgIGhhc2hbbmFtZV0ucHVzaCh2YWx1ZSlcbiAgICAgIH0gZWxzZSBoYXNoW25hbWVdID0gdmFsdWVcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGhhc2hcbiAgfVxuXG4gIC8vIFsgeyBuYW1lOiAnbmFtZScsIHZhbHVlOiAndmFsdWUnIH0sIC4uLiBdIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgcmVxd2VzdC5zZXJpYWxpemVBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyID0gW11cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBhcnIucHVzaCh7bmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlfSlcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgcmVxd2VzdC5zZXJpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiAnJ1xuICAgIHZhciBvcHQsIGZuXG4gICAgICAsIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApXG5cbiAgICBvcHQgPSBhcmdzLnBvcCgpXG4gICAgb3B0ICYmIG9wdC5ub2RlVHlwZSAmJiBhcmdzLnB1c2gob3B0KSAmJiAob3B0ID0gbnVsbClcbiAgICBvcHQgJiYgKG9wdCA9IG9wdC50eXBlKVxuXG4gICAgaWYgKG9wdCA9PSAnbWFwJykgZm4gPSBzZXJpYWxpemVIYXNoXG4gICAgZWxzZSBpZiAob3B0ID09ICdhcnJheScpIGZuID0gcmVxd2VzdC5zZXJpYWxpemVBcnJheVxuICAgIGVsc2UgZm4gPSBzZXJpYWxpemVRdWVyeVN0cmluZ1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3MpXG4gIH1cblxuICByZXF3ZXN0LnRvUXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAobywgdHJhZCkge1xuICAgIHZhciBwcmVmaXgsIGlcbiAgICAgICwgdHJhZGl0aW9uYWwgPSB0cmFkIHx8IGZhbHNlXG4gICAgICAsIHMgPSBbXVxuICAgICAgLCBlbmMgPSBlbmNvZGVVUklDb21wb25lbnRcbiAgICAgICwgYWRkID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAvLyBJZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpbnZva2UgaXQgYW5kIHJldHVybiBpdHMgdmFsdWVcbiAgICAgICAgICB2YWx1ZSA9ICgnZnVuY3Rpb24nID09PSB0eXBlb2YgdmFsdWUpID8gdmFsdWUoKSA6ICh2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZSlcbiAgICAgICAgICBzW3MubGVuZ3RoXSA9IGVuYyhrZXkpICsgJz0nICsgZW5jKHZhbHVlKVxuICAgICAgICB9XG4gICAgLy8gSWYgYW4gYXJyYXkgd2FzIHBhc3NlZCBpbiwgYXNzdW1lIHRoYXQgaXQgaXMgYW4gYXJyYXkgb2YgZm9ybSBlbGVtZW50cy5cbiAgICBpZiAoaXNBcnJheShvKSkge1xuICAgICAgZm9yIChpID0gMDsgbyAmJiBpIDwgby5sZW5ndGg7IGkrKykgYWRkKG9baV1bJ25hbWUnXSwgb1tpXVsndmFsdWUnXSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdHJhZGl0aW9uYWwsIGVuY29kZSB0aGUgXCJvbGRcIiB3YXkgKHRoZSB3YXkgMS4zLjIgb3Igb2xkZXJcbiAgICAgIC8vIGRpZCBpdCksIG90aGVyd2lzZSBlbmNvZGUgcGFyYW1zIHJlY3Vyc2l2ZWx5LlxuICAgICAgZm9yIChwcmVmaXggaW4gbykge1xuICAgICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpKSBidWlsZFBhcmFtcyhwcmVmaXgsIG9bcHJlZml4XSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzcGFjZXMgc2hvdWxkIGJlICsgYWNjb3JkaW5nIHRvIHNwZWNcbiAgICByZXR1cm4gcy5qb2luKCcmJykucmVwbGFjZSgvJTIwL2csICcrJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkUGFyYW1zKHByZWZpeCwgb2JqLCB0cmFkaXRpb25hbCwgYWRkKSB7XG4gICAgdmFyIG5hbWUsIGksIHZcbiAgICAgICwgcmJyYWNrZXQgPSAvXFxbXFxdJC9cblxuICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBhcnJheSBpdGVtLlxuICAgICAgZm9yIChpID0gMDsgb2JqICYmIGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdiA9IG9ialtpXVxuICAgICAgICBpZiAodHJhZGl0aW9uYWwgfHwgcmJyYWNrZXQudGVzdChwcmVmaXgpKSB7XG4gICAgICAgICAgLy8gVHJlYXQgZWFjaCBhcnJheSBpdGVtIGFzIGEgc2NhbGFyLlxuICAgICAgICAgIGFkZChwcmVmaXgsIHYpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgKHR5cGVvZiB2ID09PSAnb2JqZWN0JyA/IGkgOiAnJykgKyAnXScsIHYsIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9iaiAmJiBvYmoudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBvYmplY3QgaXRlbS5cbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgbmFtZSArICddJywgb2JqW25hbWVdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBzY2FsYXIgaXRlbS5cbiAgICAgIGFkZChwcmVmaXgsIG9iailcbiAgICB9XG4gIH1cblxuICByZXF3ZXN0LmdldGNhbGxiYWNrUHJlZml4ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYWxsYmFja1ByZWZpeFxuICB9XG5cbiAgLy8galF1ZXJ5IGFuZCBaZXB0byBjb21wYXRpYmlsaXR5LCBkaWZmZXJlbmNlcyBjYW4gYmUgcmVtYXBwZWQgaGVyZSBzbyB5b3UgY2FuIGNhbGxcbiAgLy8gLmFqYXguY29tcGF0KG9wdGlvbnMsIGNhbGxiYWNrKVxuICByZXF3ZXN0LmNvbXBhdCA9IGZ1bmN0aW9uIChvLCBmbikge1xuICAgIGlmIChvKSB7XG4gICAgICBvWyd0eXBlJ10gJiYgKG9bJ21ldGhvZCddID0gb1sndHlwZSddKSAmJiBkZWxldGUgb1sndHlwZSddXG4gICAgICBvWydkYXRhVHlwZSddICYmIChvWyd0eXBlJ10gPSBvWydkYXRhVHlwZSddKVxuICAgICAgb1snanNvbnBDYWxsYmFjayddICYmIChvWydqc29ucENhbGxiYWNrTmFtZSddID0gb1snanNvbnBDYWxsYmFjayddKSAmJiBkZWxldGUgb1snanNvbnBDYWxsYmFjayddXG4gICAgICBvWydqc29ucCddICYmIChvWydqc29ucENhbGxiYWNrJ10gPSBvWydqc29ucCddKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICByZXF3ZXN0LmFqYXhTZXR1cCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBmb3IgKHZhciBrIGluIG9wdGlvbnMpIHtcbiAgICAgIGdsb2JhbFNldHVwT3B0aW9uc1trXSA9IG9wdGlvbnNba11cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVxd2VzdFxufSk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE0IEZlbGl4IEduYXNzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblxuICAvKiBDb21tb25KUyAqL1xuICBpZiAodHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcpICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKVxuXG4gIC8qIEFNRCBtb2R1bGUgKi9cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShmYWN0b3J5KVxuXG4gIC8qIEJyb3dzZXIgZ2xvYmFsICovXG4gIGVsc2Ugcm9vdC5TcGlubmVyID0gZmFjdG9yeSgpXG59XG4odGhpcywgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBwcmVmaXhlcyA9IFsnd2Via2l0JywgJ01veicsICdtcycsICdPJ10gLyogVmVuZG9yIHByZWZpeGVzICovXG4gICAgLCBhbmltYXRpb25zID0ge30gLyogQW5pbWF0aW9uIHJ1bGVzIGtleWVkIGJ5IHRoZWlyIG5hbWUgKi9cbiAgICAsIHVzZUNzc0FuaW1hdGlvbnMgLyogV2hldGhlciB0byB1c2UgQ1NTIGFuaW1hdGlvbnMgb3Igc2V0VGltZW91dCAqL1xuXG4gIC8qKlxuICAgKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBlbGVtZW50cy4gSWYgbm8gdGFnIG5hbWUgaXMgZ2l2ZW4sXG4gICAqIGEgRElWIGlzIGNyZWF0ZWQuIE9wdGlvbmFsbHkgcHJvcGVydGllcyBjYW4gYmUgcGFzc2VkLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlRWwodGFnLCBwcm9wKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcgfHwgJ2RpdicpXG4gICAgICAsIG5cblxuICAgIGZvcihuIGluIHByb3ApIGVsW25dID0gcHJvcFtuXVxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgY2hpbGRyZW4gYW5kIHJldHVybnMgdGhlIHBhcmVudC5cbiAgICovXG4gIGZ1bmN0aW9uIGlucyhwYXJlbnQgLyogY2hpbGQxLCBjaGlsZDIsIC4uLiovKSB7XG4gICAgZm9yICh2YXIgaT0xLCBuPWFyZ3VtZW50cy5sZW5ndGg7IGk8bjsgaSsrKVxuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGFyZ3VtZW50c1tpXSlcblxuICAgIHJldHVybiBwYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBuZXcgc3R5bGVzaGVldCB0byBob2xkIHRoZSBAa2V5ZnJhbWUgb3IgVk1MIHJ1bGVzLlxuICAgKi9cbiAgdmFyIHNoZWV0ID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbCA9IGNyZWF0ZUVsKCdzdHlsZScsIHt0eXBlIDogJ3RleHQvY3NzJ30pXG4gICAgaW5zKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0sIGVsKVxuICAgIHJldHVybiBlbC5zaGVldCB8fCBlbC5zdHlsZVNoZWV0XG4gIH0oKSlcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvcGFjaXR5IGtleWZyYW1lIGFuaW1hdGlvbiBydWxlIGFuZCByZXR1cm5zIGl0cyBuYW1lLlxuICAgKiBTaW5jZSBtb3N0IG1vYmlsZSBXZWJraXRzIGhhdmUgdGltaW5nIGlzc3VlcyB3aXRoIGFuaW1hdGlvbi1kZWxheSxcbiAgICogd2UgY3JlYXRlIHNlcGFyYXRlIHJ1bGVzIGZvciBlYWNoIGxpbmUvc2VnbWVudC5cbiAgICovXG4gIGZ1bmN0aW9uIGFkZEFuaW1hdGlvbihhbHBoYSwgdHJhaWwsIGksIGxpbmVzKSB7XG4gICAgdmFyIG5hbWUgPSBbJ29wYWNpdHknLCB0cmFpbCwgfn4oYWxwaGEqMTAwKSwgaSwgbGluZXNdLmpvaW4oJy0nKVxuICAgICAgLCBzdGFydCA9IDAuMDEgKyBpL2xpbmVzICogMTAwXG4gICAgICAsIHogPSBNYXRoLm1heCgxIC0gKDEtYWxwaGEpIC8gdHJhaWwgKiAoMTAwLXN0YXJ0KSwgYWxwaGEpXG4gICAgICAsIHByZWZpeCA9IHVzZUNzc0FuaW1hdGlvbnMuc3Vic3RyaW5nKDAsIHVzZUNzc0FuaW1hdGlvbnMuaW5kZXhPZignQW5pbWF0aW9uJykpLnRvTG93ZXJDYXNlKClcbiAgICAgICwgcHJlID0gcHJlZml4ICYmICctJyArIHByZWZpeCArICctJyB8fCAnJ1xuXG4gICAgaWYgKCFhbmltYXRpb25zW25hbWVdKSB7XG4gICAgICBzaGVldC5pbnNlcnRSdWxlKFxuICAgICAgICAnQCcgKyBwcmUgKyAna2V5ZnJhbWVzICcgKyBuYW1lICsgJ3snICtcbiAgICAgICAgJzAle29wYWNpdHk6JyArIHogKyAnfScgK1xuICAgICAgICBzdGFydCArICcle29wYWNpdHk6JyArIGFscGhhICsgJ30nICtcbiAgICAgICAgKHN0YXJ0KzAuMDEpICsgJyV7b3BhY2l0eToxfScgK1xuICAgICAgICAoc3RhcnQrdHJhaWwpICUgMTAwICsgJyV7b3BhY2l0eTonICsgYWxwaGEgKyAnfScgK1xuICAgICAgICAnMTAwJXtvcGFjaXR5OicgKyB6ICsgJ30nICtcbiAgICAgICAgJ30nLCBzaGVldC5jc3NSdWxlcy5sZW5ndGgpXG5cbiAgICAgIGFuaW1hdGlvbnNbbmFtZV0gPSAxXG4gICAgfVxuXG4gICAgcmV0dXJuIG5hbWVcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmllcyB2YXJpb3VzIHZlbmRvciBwcmVmaXhlcyBhbmQgcmV0dXJucyB0aGUgZmlyc3Qgc3VwcG9ydGVkIHByb3BlcnR5LlxuICAgKi9cbiAgZnVuY3Rpb24gdmVuZG9yKGVsLCBwcm9wKSB7XG4gICAgdmFyIHMgPSBlbC5zdHlsZVxuICAgICAgLCBwcFxuICAgICAgLCBpXG5cbiAgICBwcm9wID0gcHJvcC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3Auc2xpY2UoMSlcbiAgICBmb3IoaT0wOyBpPHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwcCA9IHByZWZpeGVzW2ldK3Byb3BcbiAgICAgIGlmKHNbcHBdICE9PSB1bmRlZmluZWQpIHJldHVybiBwcFxuICAgIH1cbiAgICBpZihzW3Byb3BdICE9PSB1bmRlZmluZWQpIHJldHVybiBwcm9wXG4gIH1cblxuICAvKipcbiAgICogU2V0cyBtdWx0aXBsZSBzdHlsZSBwcm9wZXJ0aWVzIGF0IG9uY2UuXG4gICAqL1xuICBmdW5jdGlvbiBjc3MoZWwsIHByb3ApIHtcbiAgICBmb3IgKHZhciBuIGluIHByb3ApXG4gICAgICBlbC5zdHlsZVt2ZW5kb3IoZWwsIG4pfHxuXSA9IHByb3Bbbl1cblxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgLyoqXG4gICAqIEZpbGxzIGluIGRlZmF1bHQgdmFsdWVzLlxuICAgKi9cbiAgZnVuY3Rpb24gbWVyZ2Uob2JqKSB7XG4gICAgZm9yICh2YXIgaT0xOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVmID0gYXJndW1lbnRzW2ldXG4gICAgICBmb3IgKHZhciBuIGluIGRlZilcbiAgICAgICAgaWYgKG9ialtuXSA9PT0gdW5kZWZpbmVkKSBvYmpbbl0gPSBkZWZbbl1cbiAgICB9XG4gICAgcmV0dXJuIG9ialxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpbmUgY29sb3IgZnJvbSB0aGUgZ2l2ZW4gc3RyaW5nIG9yIGFycmF5LlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q29sb3IoY29sb3IsIGlkeCkge1xuICAgIHJldHVybiB0eXBlb2YgY29sb3IgPT0gJ3N0cmluZycgPyBjb2xvciA6IGNvbG9yW2lkeCAlIGNvbG9yLmxlbmd0aF1cbiAgfVxuXG4gIC8vIEJ1aWx0LWluIGRlZmF1bHRzXG5cbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgIGxpbmVzOiAxMiwgICAgICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIHRvIGRyYXdcbiAgICBsZW5ndGg6IDcsICAgICAgICAgICAgLy8gVGhlIGxlbmd0aCBvZiBlYWNoIGxpbmVcbiAgICB3aWR0aDogNSwgICAgICAgICAgICAgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gICAgcmFkaXVzOiAxMCwgICAgICAgICAgIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxuICAgIHJvdGF0ZTogMCwgICAgICAgICAgICAvLyBSb3RhdGlvbiBvZmZzZXRcbiAgICBjb3JuZXJzOiAxLCAgICAgICAgICAgLy8gUm91bmRuZXNzICgwLi4xKVxuICAgIGNvbG9yOiAnIzAwMCcsICAgICAgICAvLyAjcmdiIG9yICNycmdnYmJcbiAgICBkaXJlY3Rpb246IDEsICAgICAgICAgLy8gMTogY2xvY2t3aXNlLCAtMTogY291bnRlcmNsb2Nrd2lzZVxuICAgIHNwZWVkOiAxLCAgICAgICAgICAgICAvLyBSb3VuZHMgcGVyIHNlY29uZFxuICAgIHRyYWlsOiAxMDAsICAgICAgICAgICAvLyBBZnRlcmdsb3cgcGVyY2VudGFnZVxuICAgIG9wYWNpdHk6IDEvNCwgICAgICAgICAvLyBPcGFjaXR5IG9mIHRoZSBsaW5lc1xuICAgIGZwczogMjAsICAgICAgICAgICAgICAvLyBGcmFtZXMgcGVyIHNlY29uZCB3aGVuIHVzaW5nIHNldFRpbWVvdXQoKVxuICAgIHpJbmRleDogMmU5LCAgICAgICAgICAvLyBVc2UgYSBoaWdoIHotaW5kZXggYnkgZGVmYXVsdFxuICAgIGNsYXNzTmFtZTogJ3NwaW5uZXInLCAvLyBDU1MgY2xhc3MgdG8gYXNzaWduIHRvIHRoZSBlbGVtZW50XG4gICAgdG9wOiAnNTAlJywgICAgICAgICAgIC8vIGNlbnRlciB2ZXJ0aWNhbGx5XG4gICAgbGVmdDogJzUwJScsICAgICAgICAgIC8vIGNlbnRlciBob3Jpem9udGFsbHlcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyAgLy8gZWxlbWVudCBwb3NpdGlvblxuICB9XG5cbiAgLyoqIFRoZSBjb25zdHJ1Y3RvciAqL1xuICBmdW5jdGlvbiBTcGlubmVyKG8pIHtcbiAgICB0aGlzLm9wdHMgPSBtZXJnZShvIHx8IHt9LCBTcGlubmVyLmRlZmF1bHRzLCBkZWZhdWx0cylcbiAgfVxuXG4gIC8vIEdsb2JhbCBkZWZhdWx0cyB0aGF0IG92ZXJyaWRlIHRoZSBidWlsdC1pbnM6XG4gIFNwaW5uZXIuZGVmYXVsdHMgPSB7fVxuXG4gIG1lcmdlKFNwaW5uZXIucHJvdG90eXBlLCB7XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZSBzcGlubmVyIHRvIHRoZSBnaXZlbiB0YXJnZXQgZWxlbWVudC4gSWYgdGhpcyBpbnN0YW5jZSBpcyBhbHJlYWR5XG4gICAgICogc3Bpbm5pbmcsIGl0IGlzIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIGl0cyBwcmV2aW91cyB0YXJnZXQgYiBjYWxsaW5nXG4gICAgICogc3RvcCgpIGludGVybmFsbHkuXG4gICAgICovXG4gICAgc3BpbjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICB0aGlzLnN0b3AoKVxuXG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgLCBvID0gc2VsZi5vcHRzXG4gICAgICAgICwgZWwgPSBzZWxmLmVsID0gY3NzKGNyZWF0ZUVsKDAsIHtjbGFzc05hbWU6IG8uY2xhc3NOYW1lfSksIHtwb3NpdGlvbjogby5wb3NpdGlvbiwgd2lkdGg6IDAsIHpJbmRleDogby56SW5kZXh9KVxuXG4gICAgICBjc3MoZWwsIHtcbiAgICAgICAgbGVmdDogby5sZWZ0LFxuICAgICAgICB0b3A6IG8udG9wXG4gICAgICB9KVxuICAgICAgICBcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgdGFyZ2V0Lmluc2VydEJlZm9yZShlbCwgdGFyZ2V0LmZpcnN0Q2hpbGR8fG51bGwpXG4gICAgICB9XG5cbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgncm9sZScsICdwcm9ncmVzc2JhcicpXG4gICAgICBzZWxmLmxpbmVzKGVsLCBzZWxmLm9wdHMpXG5cbiAgICAgIGlmICghdXNlQ3NzQW5pbWF0aW9ucykge1xuICAgICAgICAvLyBObyBDU1MgYW5pbWF0aW9uIHN1cHBvcnQsIHVzZSBzZXRUaW1lb3V0KCkgaW5zdGVhZFxuICAgICAgICB2YXIgaSA9IDBcbiAgICAgICAgICAsIHN0YXJ0ID0gKG8ubGluZXMgLSAxKSAqICgxIC0gby5kaXJlY3Rpb24pIC8gMlxuICAgICAgICAgICwgYWxwaGFcbiAgICAgICAgICAsIGZwcyA9IG8uZnBzXG4gICAgICAgICAgLCBmID0gZnBzL28uc3BlZWRcbiAgICAgICAgICAsIG9zdGVwID0gKDEtby5vcGFjaXR5KSAvIChmKm8udHJhaWwgLyAxMDApXG4gICAgICAgICAgLCBhc3RlcCA9IGYvby5saW5lc1xuXG4gICAgICAgIDsoZnVuY3Rpb24gYW5pbSgpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvLmxpbmVzOyBqKyspIHtcbiAgICAgICAgICAgIGFscGhhID0gTWF0aC5tYXgoMSAtIChpICsgKG8ubGluZXMgLSBqKSAqIGFzdGVwKSAlIGYgKiBvc3RlcCwgby5vcGFjaXR5KVxuXG4gICAgICAgICAgICBzZWxmLm9wYWNpdHkoZWwsIGogKiBvLmRpcmVjdGlvbiArIHN0YXJ0LCBhbHBoYSwgbylcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi50aW1lb3V0ID0gc2VsZi5lbCAmJiBzZXRUaW1lb3V0KGFuaW0sIH5+KDEwMDAvZnBzKSlcbiAgICAgICAgfSkoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGZcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RvcHMgYW5kIHJlbW92ZXMgdGhlIFNwaW5uZXIuXG4gICAgICovXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgICBpZiAoZWwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUpIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXG4gICAgICAgIHRoaXMuZWwgPSB1bmRlZmluZWRcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG1ldGhvZCB0aGF0IGRyYXdzIHRoZSBpbmRpdmlkdWFsIGxpbmVzLiBXaWxsIGJlIG92ZXJ3cml0dGVuXG4gICAgICogaW4gVk1MIGZhbGxiYWNrIG1vZGUgYmVsb3cuXG4gICAgICovXG4gICAgbGluZXM6IGZ1bmN0aW9uKGVsLCBvKSB7XG4gICAgICB2YXIgaSA9IDBcbiAgICAgICAgLCBzdGFydCA9IChvLmxpbmVzIC0gMSkgKiAoMSAtIG8uZGlyZWN0aW9uKSAvIDJcbiAgICAgICAgLCBzZWdcblxuICAgICAgZnVuY3Rpb24gZmlsbChjb2xvciwgc2hhZG93KSB7XG4gICAgICAgIHJldHVybiBjc3MoY3JlYXRlRWwoKSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHdpZHRoOiAoby5sZW5ndGgrby53aWR0aCkgKyAncHgnLFxuICAgICAgICAgIGhlaWdodDogby53aWR0aCArICdweCcsXG4gICAgICAgICAgYmFja2dyb3VuZDogY29sb3IsXG4gICAgICAgICAgYm94U2hhZG93OiBzaGFkb3csXG4gICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnbGVmdCcsXG4gICAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKCcgKyB+figzNjAvby5saW5lcyppK28ucm90YXRlKSArICdkZWcpIHRyYW5zbGF0ZSgnICsgby5yYWRpdXMrJ3B4JyArJywwKScsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAoby5jb3JuZXJzICogby53aWR0aD4+MSkgKyAncHgnXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGZvciAoOyBpIDwgby5saW5lczsgaSsrKSB7XG4gICAgICAgIHNlZyA9IGNzcyhjcmVhdGVFbCgpLCB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAxK34oby53aWR0aC8yKSArICdweCcsXG4gICAgICAgICAgdHJhbnNmb3JtOiBvLmh3YWNjZWwgPyAndHJhbnNsYXRlM2QoMCwwLDApJyA6ICcnLFxuICAgICAgICAgIG9wYWNpdHk6IG8ub3BhY2l0eSxcbiAgICAgICAgICBhbmltYXRpb246IHVzZUNzc0FuaW1hdGlvbnMgJiYgYWRkQW5pbWF0aW9uKG8ub3BhY2l0eSwgby50cmFpbCwgc3RhcnQgKyBpICogby5kaXJlY3Rpb24sIG8ubGluZXMpICsgJyAnICsgMS9vLnNwZWVkICsgJ3MgbGluZWFyIGluZmluaXRlJ1xuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChvLnNoYWRvdykgaW5zKHNlZywgY3NzKGZpbGwoJyMwMDAnLCAnMCAwIDRweCAnICsgJyMwMDAnKSwge3RvcDogMisncHgnfSkpXG4gICAgICAgIGlucyhlbCwgaW5zKHNlZywgZmlsbChnZXRDb2xvcihvLmNvbG9yLCBpKSwgJzAgMCAxcHggcmdiYSgwLDAsMCwuMSknKSkpXG4gICAgICB9XG4gICAgICByZXR1cm4gZWxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgbWV0aG9kIHRoYXQgYWRqdXN0cyB0aGUgb3BhY2l0eSBvZiBhIHNpbmdsZSBsaW5lLlxuICAgICAqIFdpbGwgYmUgb3ZlcndyaXR0ZW4gaW4gVk1MIGZhbGxiYWNrIG1vZGUgYmVsb3cuXG4gICAgICovXG4gICAgb3BhY2l0eTogZnVuY3Rpb24oZWwsIGksIHZhbCkge1xuICAgICAgaWYgKGkgPCBlbC5jaGlsZE5vZGVzLmxlbmd0aCkgZWwuY2hpbGROb2Rlc1tpXS5zdHlsZS5vcGFjaXR5ID0gdmFsXG4gICAgfVxuXG4gIH0pXG5cblxuICBmdW5jdGlvbiBpbml0Vk1MKCkge1xuXG4gICAgLyogVXRpbGl0eSBmdW5jdGlvbiB0byBjcmVhdGUgYSBWTUwgdGFnICovXG4gICAgZnVuY3Rpb24gdm1sKHRhZywgYXR0cikge1xuICAgICAgcmV0dXJuIGNyZWF0ZUVsKCc8JyArIHRhZyArICcgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQuY29tOnZtbFwiIGNsYXNzPVwic3Bpbi12bWxcIj4nLCBhdHRyKVxuICAgIH1cblxuICAgIC8vIE5vIENTUyB0cmFuc2Zvcm1zIGJ1dCBWTUwgc3VwcG9ydCwgYWRkIGEgQ1NTIHJ1bGUgZm9yIFZNTCBlbGVtZW50czpcbiAgICBzaGVldC5hZGRSdWxlKCcuc3Bpbi12bWwnLCAnYmVoYXZpb3I6dXJsKCNkZWZhdWx0I1ZNTCknKVxuXG4gICAgU3Bpbm5lci5wcm90b3R5cGUubGluZXMgPSBmdW5jdGlvbihlbCwgbykge1xuICAgICAgdmFyIHIgPSBvLmxlbmd0aCtvLndpZHRoXG4gICAgICAgICwgcyA9IDIqclxuXG4gICAgICBmdW5jdGlvbiBncnAoKSB7XG4gICAgICAgIHJldHVybiBjc3MoXG4gICAgICAgICAgdm1sKCdncm91cCcsIHtcbiAgICAgICAgICAgIGNvb3Jkc2l6ZTogcyArICcgJyArIHMsXG4gICAgICAgICAgICBjb29yZG9yaWdpbjogLXIgKyAnICcgKyAtclxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHsgd2lkdGg6IHMsIGhlaWdodDogcyB9XG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgdmFyIG1hcmdpbiA9IC0oby53aWR0aCtvLmxlbmd0aCkqMiArICdweCdcbiAgICAgICAgLCBnID0gY3NzKGdycCgpLCB7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogbWFyZ2luLCBsZWZ0OiBtYXJnaW59KVxuICAgICAgICAsIGlcblxuICAgICAgZnVuY3Rpb24gc2VnKGksIGR4LCBmaWx0ZXIpIHtcbiAgICAgICAgaW5zKGcsXG4gICAgICAgICAgaW5zKGNzcyhncnAoKSwge3JvdGF0aW9uOiAzNjAgLyBvLmxpbmVzICogaSArICdkZWcnLCBsZWZ0OiB+fmR4fSksXG4gICAgICAgICAgICBpbnMoY3NzKHZtbCgncm91bmRyZWN0Jywge2FyY3NpemU6IG8uY29ybmVyc30pLCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBvLndpZHRoLFxuICAgICAgICAgICAgICAgIGxlZnQ6IG8ucmFkaXVzLFxuICAgICAgICAgICAgICAgIHRvcDogLW8ud2lkdGg+PjEsXG4gICAgICAgICAgICAgICAgZmlsdGVyOiBmaWx0ZXJcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIHZtbCgnZmlsbCcsIHtjb2xvcjogZ2V0Q29sb3Ioby5jb2xvciwgaSksIG9wYWNpdHk6IG8ub3BhY2l0eX0pLFxuICAgICAgICAgICAgICB2bWwoJ3N0cm9rZScsIHtvcGFjaXR5OiAwfSkgLy8gdHJhbnNwYXJlbnQgc3Ryb2tlIHRvIGZpeCBjb2xvciBibGVlZGluZyB1cG9uIG9wYWNpdHkgY2hhbmdlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIGlmIChvLnNoYWRvdylcbiAgICAgICAgZm9yIChpID0gMTsgaSA8PSBvLmxpbmVzOyBpKyspXG4gICAgICAgICAgc2VnKGksIC0yLCAncHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkJsdXIocGl4ZWxyYWRpdXM9MixtYWtlc2hhZG93PTEsc2hhZG93b3BhY2l0eT0uMyknKVxuXG4gICAgICBmb3IgKGkgPSAxOyBpIDw9IG8ubGluZXM7IGkrKykgc2VnKGkpXG4gICAgICByZXR1cm4gaW5zKGVsLCBnKVxuICAgIH1cblxuICAgIFNwaW5uZXIucHJvdG90eXBlLm9wYWNpdHkgPSBmdW5jdGlvbihlbCwgaSwgdmFsLCBvKSB7XG4gICAgICB2YXIgYyA9IGVsLmZpcnN0Q2hpbGRcbiAgICAgIG8gPSBvLnNoYWRvdyAmJiBvLmxpbmVzIHx8IDBcbiAgICAgIGlmIChjICYmIGkrbyA8IGMuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgYyA9IGMuY2hpbGROb2Rlc1tpK29dOyBjID0gYyAmJiBjLmZpcnN0Q2hpbGQ7IGMgPSBjICYmIGMuZmlyc3RDaGlsZFxuICAgICAgICBpZiAoYykgYy5vcGFjaXR5ID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIHByb2JlID0gY3NzKGNyZWF0ZUVsKCdncm91cCcpLCB7YmVoYXZpb3I6ICd1cmwoI2RlZmF1bHQjVk1MKSd9KVxuXG4gIGlmICghdmVuZG9yKHByb2JlLCAndHJhbnNmb3JtJykgJiYgcHJvYmUuYWRqKSBpbml0Vk1MKClcbiAgZWxzZSB1c2VDc3NBbmltYXRpb25zID0gdmVuZG9yKHByb2JlLCAnYW5pbWF0aW9uJylcblxuICByZXR1cm4gU3Bpbm5lclxuXG59KSk7XG4iXX0=
