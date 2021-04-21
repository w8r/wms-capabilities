(function () {
  'use strict';

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

  function jsonFormat(json) {
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
  }

  function xmlFormat(xml) {
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
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  /*
   BSD-2-Clause
   @preserve
  */

  var wmsCapabilities_min = createCommonjsModule(function (module, exports) {
  (function(f,m){module.exports=m();})(commonjsGlobal,function(){function f(a){return void 0!==a}function m(a,c,b){if(a.nodeType===u.CDATA_SECTION||a.nodeType===u.TEXT){ c?b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g,"")):b.push(a.nodeValue); }else { for(a=a.firstChild;a;a=a.nextSibling){ m(a,c,b); } }return b}function F(a){for(a=a.nextElementSibling||a.nextSibling;a&&
  a.nodeType!==u.ELEMENT;){ a=a.nextSibling; }return a}function h(a,c,b){b=f(b)?b:{};var d;var n=0;for(d=a.length;n<d;++n){ b[a[n]]=c; }return b}function A(a,c){return function(b,d){b=a.call(f(c)?c:this,b,d);f(b)&&d[d.length-1].push(b);}}function l(a,c,b,d,e){d.push(a);for(a=b.firstElementChild||b.firstChild;a&&a.nodeType!==u.ELEMENT;){ a=a.nextSibling; }for(;a;a=F(a)){ b=c[a.namespaceURI||null],f(b)&&(b=b[a.localName],f(b)&&b.call(e,a,d)); }return d.pop()}function b(a,c,b){return function(d,e){var n=a.call(f(b)?b:
  this,d,e);f(n)&&(e=e[e.length-1],d=f(c)?c:d.localName,e[d]=n);}}function k(a,c,b){return function(d,e){var n=a.call(f(b)?b:this,d,e);if(f(n)){e=e[e.length-1];d=f(c)?c:d.localName;var g=[];(d in e?e[d]:e[d]=g).push(n);}}}function r(a){if(a=/^\s*(true|1)|(false|0)\s*$/.exec(a)){ return f(a[1])||!1 }}function t(a){return p(m(a,!1,[]).join(""))}function p(a){if(a=/^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*$/i.exec(a)){ return parseFloat(a[1]) }}function w(a){return v(m(a,!1,[]).join(""))}function v(a){if(a=/^\s*(\d+)\s*$/.exec(a)){ return parseInt(a[1],
  10) }}function e(a){return m(a,!1,[]).join("").replace(G,"")}function x(a){return a.getAttributeNS("http://www.w3.org/1999/xlink","href")}function B(a){return [p(a.getAttribute("minx")),p(a.getAttribute("miny")),p(a.getAttribute("maxx")),p(a.getAttribute("maxy"))]}function q(a,c){return l({},H,a,c)}function y(a,c){return l({},I,a,c)}function C(a,c){c=q(a,c);if(f(c)){ return a=[v(a.getAttribute("width")),v(a.getAttribute("height"))],c.size=a,c }}function D(a,c){return l([],J,a,c)}var u={ELEMENT:1,ATTRIBUTE:2,
  TEXT:3,CDATA_SECTION:4,ENTITY_REFERENCE:5,ENTITY:6,PROCESSING_INSTRUCTION:7,COMMENT:8,DOCUMENT:9,DOCUMENT_TYPE:10,DOCUMENT_FRAGMENT:11,NOTATION:12},z=function(a){this._parser=new a;};z.prototype.toDocument=function(a){return this._parser.parseFromString(a,"application/xml")};z.prototype.getAllTextContent=function(a,c){return m(a,c,[]).join("").join("")};var G=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,g=[null,"http://www.opengis.net/wms"],M=h(g,{Service:b(function(a,c){return l({},K,a,c)}),Capability:b(function(a,
  c){return l({},L,a,c)})}),L=h(g,{Request:b(function(a,c){return l({},N,a,c)}),Exception:b(function(a,c){return l([],O,a,c)}),Layer:b(function(a,c){var b=r(a.getAttribute("queryable"));return l({queryable:f(b)?b:!1},E,a,c)})}),K=h(g,{Name:b(e),Title:b(e),Abstract:b(e),KeywordList:b(D),OnlineResource:b(x),ContactInformation:b(function(a,c){return l({},P,a,c)}),Fees:b(e),AccessConstraints:b(e),LayerLimit:b(w),MaxWidth:b(w),MaxHeight:b(w)}),P=h(g,{ContactPersonPrimary:b(function(a,c){return l({},Q,a,
  c)}),ContactPosition:b(e),ContactAddress:b(function(a,c){return l({},R,a,c)}),ContactVoiceTelephone:b(e),ContactFacsimileTelephone:b(e),ContactElectronicMailAddress:b(e)}),Q=h(g,{ContactPerson:b(e),ContactOrganization:b(e)}),R=h(g,{AddressType:b(e),Address:b(e),City:b(e),StateOrProvince:b(e),PostCode:b(e),Country:b(e)}),O=h(g,{Format:A(e)}),E=h(g,{Name:b(e),Title:b(e),Abstract:b(e),KeywordList:b(D),CRS:k(e),SRS:k(e),EX_GeographicBoundingBox:b(function(a,c){var b=l({},S,a,c);if(f(b)){a=b.westBoundLongitude;
  c=b.southBoundLatitude;var d=b.eastBoundLongitude;b=b.northBoundLatitude;if(f(a)&&f(c)&&f(d)&&f(b)){ return [a,c,d,b] }}}),LatLonBoundingBox:b(function(a,b){a=B(a);if(f(a[0])&&f(a[1])&&f(a[2])&&f(a[3])){ return a }}),BoundingBox:k(function(a,b){b=B(a);var c=[p(a.getAttribute("resx")),p(a.getAttribute("resy"))];return {crs:a.getAttribute("CRS")||a.getAttribute("SRS"),extent:b,res:c}}),Dimension:k(function(a,b){return {name:a.getAttribute("name"),units:a.getAttribute("units"),unitSymbol:a.getAttribute("unitSymbol"),
  "default":a.getAttribute("default"),multipleValues:r(a.getAttribute("multipleValues")),nearestValue:r(a.getAttribute("nearestValue")),current:r(a.getAttribute("current")),values:e(a)}}),Attribution:b(function(a,b){return l({},T,a,b)}),AuthorityURL:k(function(a,b){b=q(a,b);if(f(b)){ return b.name=a.getAttribute("name"),b }}),Identifier:k(e),MetadataURL:k(function(a,b){b=q(a,b);if(f(b)){ return b.type=a.getAttribute("type"),b }}),DataURL:k(q),FeatureListURL:k(q),Style:k(function(a,b){return l({},U,a,b)}),MinScaleDenominator:b(t),
  MaxScaleDenominator:b(t),ScaleHint:b(function(a,b){b=parseFloat(a.getAttribute("min"));a=parseFloat(a.getAttribute("max"));return {min:b,max:a}}),Layer:k(function(a,b){var c=b[b.length-1];b=l({},E,a,b);if(f(b)){var d=r(a.getAttribute("queryable"));f(d)||(d=c.queryable);b.queryable=f(d)?d:!1;d=v(a.getAttribute("cascaded"));f(d)||(d=c.cascaded);b.cascaded=d;d=r(a.getAttribute("opaque"));f(d)||(d=c.opaque);b.opaque=f(d)?d:!1;d=r(a.getAttribute("noSubsets"));f(d)||(d=c.noSubsets);b.noSubsets=f(d)?d:!1;
  d=p(a.getAttribute("fixedWidth"));f(d)||(d=c.fixedWidth);b.fixedWidth=d;a=p(a.getAttribute("fixedHeight"));f(a)||(a=c.fixedHeight);b.fixedHeight=a;a=["Style","CRS","AuthorityURL"];d=0;for(var e=a.length;d<e;d++){var g=a[d],h=c[g];if(f(h)){var k=[];k=g in b?b[g]:b[g]=k;k=k.concat(h);b[g]=k;}}a="EX_GeographicBoundingBox BoundingBox Dimension Attribution MinScaleDenominator MaxScaleDenominator".split(" ");d=0;for(e=a.length;d<e;d++){ g=a[d],f(b[g])||(b[g]=c[g]); }return b}})}),T=h(g,{Title:b(e),OnlineResource:b(x),
  LogoURL:b(C)}),S=h(g,{westBoundLongitude:b(t),eastBoundLongitude:b(t),southBoundLatitude:b(t),northBoundLatitude:b(t)}),N=h(g,{GetCapabilities:b(y),GetMap:b(y),GetFeatureInfo:b(y)}),I=h(g,{Format:k(e),DCPType:k(function(a,b){return l({},V,a,b)})}),V=h(g,{HTTP:b(function(a,b){return l({},W,a,b)})}),W=h(g,{Get:b(q),Post:b(q)}),U=h(g,{Name:b(e),Title:b(e),Abstract:b(e),LegendURL:k(C),StyleSheetURL:b(q),StyleURL:b(q)}),H=h(g,{Format:b(e),OnlineResource:b(x)}),J=h(g,{Keyword:A(e)});g=function(a,b){b||
  "undefined"===typeof window||(b=window.DOMParser);this.version=void 0;this._parser=new z(b);this._data=a;};g.prototype.data=function(a){this._data=a;return this};g.prototype.toJSON=function(a){a=a||this._data;return this.parse(a)};g.prototype.parse=function(a){return this._readFromDocument(this._parser.toDocument(a))};g.prototype._readFromDocument=function(a){for(a=a.firstChild;a;a=a.nextSibling){ if(a.nodeType==u.ELEMENT){ return this.readFromNode(a); } }return null};g.prototype.readFromNode=function(a){this.version=
  a.getAttribute("version");return l({version:this.version},M,a,[])||null};return g});
  //# sourceMappingURL=wms-capabilities.min.js.map
  });

  //import Spinner from 'spin.js';

  ////////////////////////////////////////////////////////////////////////////////
  var serviceSelect = document.getElementById('service');
  var xml = document.getElementById('xml');
  var json = document.getElementById('json');
  var input = document.getElementById('input-area');

  // the only open CORS proxy I could find
  var parser = new wmsCapabilities_min();

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

      fetch(serviceSelect.value)
        .then(function (response) { return response.text(); })
        .then(function (xmlString) { return update(xmlString); });
    }
  }, false);

  xml.addEventListener('click', showInput, false);

  input.addEventListener('paste', function() {
    setTimeout(function() {
      update(input.value);
      hideInput();
    }, 50);
  }, false);

}());
