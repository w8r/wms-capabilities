
/**
 * wms-capabilities @0.4.1
 * @description WMS service Capabilities > JSON, based on openlayers 
 * @license BSD-2-Clause
 * @preserve
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WMSCapabilities = factory());
}(this, (function () { 'use strict';

  /**
   * Returns true if the specified value is not undefined.
   *
   * @param {?} val Variable to test.
   * @return {Boolean} Whether variable is defined.
   */
  function isDef (val) { return val !== void 0; }

  /**
   * Adds a key-value pair to the object/map/hash if it doesn't exist yet.
   *
   * @param {Object.<K,V>} obj The object to which to add the key-value pair.
   * @param {String} key The key to add.
   * @param {V} value The value to add if the key wasn't present.
   * @return {V} The value of the entry at the end of the function.
   * @template K,V
   */
  function setIfUndefined (obj, key, value) { return key in obj ? obj[key] : (obj[key] = value); }

  /**
   * @enum {Number}
   */
  var NODE_TYPES = {
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

  var XMLParser = function XMLParser (DOMParser) {
    /**
     * @type {DOMParser}
     */
    this._parser = new DOMParser();
  };
  /**
   * @param{String} xmlstring
   * @return {Document}
   */
  XMLParser.prototype.toDocument = function toDocument (xmlstring) {
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
  XMLParser.prototype.getAllTextContent = function getAllTextContent$1 (node, normalizeWhitespace) {
    return getAllTextContent(node, normalizeWhitespace).join('');
  };


  /**
  * Recursively grab all text content of child nodes into a single string.
  * @param {Node} node Node.
  * @param {boolean} normalizeWhitespace Normalize whitespace: remove all line
  * breaks.
  * @return {string} All text content.
  * @api
  */
  function getAllTextContent (node, normalizeWhitespace) {
   return getAllTextContentInternal(node, normalizeWhitespace, []).join('');
  }


  /**
   * @param {Node} node Node.
   * @param {boolean} normalizeWhitespace Normalize whitespace: remove all line
   * breaks.
   * @param {Array.<String|string>} accumulator Accumulator.
   * @private
   * @return {Array.<String|string>} Accumulator.
   */
  function getAllTextContentInternal (node, normalizeWhitespace, accumulator) {
    if (node.nodeType === NODE_TYPES.CDATA_SECTION ||
      node.nodeType === NODE_TYPES.TEXT) {
      if (normalizeWhitespace) {
        // FIXME understand why goog.dom.getTextContent_ uses String here
        accumulator.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ''));
      } else {
        accumulator.push(node.nodeValue);
      }
    } else {
      var n;
      for (n = node.firstChild; n; n = n.nextSibling) {
        getAllTextContentInternal(n, normalizeWhitespace, accumulator);
      }
    }
    return accumulator;
  }

  /**
   * @param {Object.<string, Object.<string, XMLParser.Parser>>} parsersNS
   *     Parsers by namespace.
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @param {*=} bind The object to use as `this`.
   */
  function parseNode (parsersNS, node, objectStack, bind) {
    for (var n = firstElementChild(node); n; n = nextElementSibling(n)) {
      var namespaceURI = n.namespaceURI || null;
      var parsers = parsersNS[namespaceURI];
      if (isDef(parsers)) {
        var parser = parsers[n.localName];
        if (isDef(parser)) {
          parser.call(bind, n, objectStack);
        }
      }
    }
  }

  /**
   * Mostly for node.js
   * @param  {Node} node
   * @return {Node}
   */
  function firstElementChild (node) {
    var firstElementChild = node.firstElementChild || node.firstChild;
    while (firstElementChild && firstElementChild.nodeType !== NODE_TYPES.ELEMENT) {
      firstElementChild = firstElementChild.nextSibling;
    }
    return firstElementChild;
  }

  /**
   * Mostly for node.js
   * @param  {Node} node
   * @return {Node}
   */
  function nextElementSibling (node) {
    var nextSibling = node.nextElementSibling || node.nextSibling;
    while (nextSibling && nextSibling.nodeType !== NODE_TYPES.ELEMENT) {
      nextSibling = nextSibling.nextSibling;
    }
    return nextSibling;
  }

  /**
   * @param {Array.<string>} namespaceURIs Namespace URIs.
   * @param {Object.<string, XMLParser.Parser>} parsers Parsers.
   * @param {Object.<string, Object.<string, XMLParser.Parser>>=} opt_parsersNS
   *     ParsersNS.
   * @return {Object.<string, Object.<string, XMLParser.Parser>>} Parsers NS.
   */
  function makeParsersNS (namespaceURIs, parsers, opt_parsersNS) {
    return /** @type {Object.<string, Object.<string, XMLParser.Parser>>} */ (
      makeStructureNS(namespaceURIs, parsers, opt_parsersNS));
  }

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
  function makeStructureNS (namespaceURIs, structure, opt_structureNS) {
    /**
     * @type {Object.<string, *>}
     */
    var structureNS = isDef(opt_structureNS) ? opt_structureNS : {};
    var i, ii;
    for (i = 0, ii = namespaceURIs.length; i < ii; ++i) {
      structureNS[namespaceURIs[i]] = structure;
    }
    return structureNS;
  }


  /**
   * @param {function(this: T, Node, Array.<*>): *} valueReader Value reader.
   * @param {T=} opt_this The object to use as `this` in `valueReader`.
   * @return {Function} Parser.
   * @template T
   */
  function makeArrayPusher (valueReader, opt_this) {
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
  }

  /**
   * @param {Object}                                     object Object.
   * @param {Object.<String, Object.<String, Function>>} parsersNS Parsers by namespace.
   * @param {Node}                                       node Node.
   * @param {Array.<*>}                                  objectStack Object stack.
   * @param {*=}                                         bind The object to use as `this`.
   * @return {Object|undefined} Object.
   */
  function pushParseAndPop (object, parsersNS, node, objectStack, bind) {
    objectStack.push(object);
    parseNode(parsersNS, node, objectStack, bind);
    return objectStack.pop();
  }


  /**
   * @param {function(this: T, Node, Array.<*>): *} valueReader Value reader.
   * @param {string=} opt_property Property.
   * @param {T=} opt_this The object to use as `this` in `valueReader`.
   * @return {XMLParser.Parser} Parser.
   * @template T
   */
  function makeObjectPropertySetter (valueReader, opt_property, opt_this) {
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
  }


  /**
     * @param {function(this: T, Node, Array.<*>): *} valueReader Value reader.
     * @param {string=} opt_property Property.
     * @param {T=} opt_this The object to use as `this` in `valueReader`.
     * @return {Function} Parser.
     * @template T
     */
  function makeObjectPropertyPusher (valueReader, opt_property, opt_this) {
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
    }

  /**
   * Make sure we trim BOM and NBSP
   * @type {RegExp}
   */
  var TRIM_RE = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  /**
   * @param  {String} str
   * @return {String}
   */
  function trim (str) {
    return str.replace(TRIM_RE, '');
  }

  /**
   * @param {string} string String.
   * @return {boolean|undefined} Boolean.
   */
  function readBooleanString (string) {
    var m = /^\s*(true|1)|(false|0)\s*$/.exec(string);
    if (m) {
      return isDef(m[1]) || false;
    } else {
      return undefined;
    }
  }


  /**
   * @param {Node} node Node.
   * @return {number|undefined} Decimal.
   */
  function readDecimal (node) {
    return readDecimalString(getAllTextContent(node, false));
  }


  /**
   * @param {string} string String.
   * @return {number|undefined} Decimal.
   */
  function readDecimalString (string) {
    // FIXME check spec
    var m = /^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*$/i.exec(string);
    if (m) {
      return parseFloat(m[1]);
    } else {
      return undefined;
    }
  }


  /**
   * @param {Node} node Node.
   * @return {number|undefined} Non negative integer.
   */
  function readNonNegativeInteger (node) {
    return readNonNegativeIntegerString(getAllTextContent(node, false));
  }


  /**
   * @param {string} string String.
   * @return {number|undefined} Non negative integer.
   */
  function  readNonNegativeIntegerString (string) {
    var m = /^\s*(\d+)\s*$/.exec(string);
    if (m) {
      return parseInt(m[1], 10);
    } else {
      return undefined;
    }
  }


  /**
   * @param {Node} node Node.
   * @return {string|undefined} String.
   */
  function readString (node) {
    return trim(getAllTextContent(node, false));
  }

  /**
   * @const
   * @type {string}
   */
  var NAMESPACE_URI = 'http://www.w3.org/1999/xlink';

  /**
   * @param {Node} node Node.
   * @return {Boolean|undefined} Boolean.
   */
  function readHref (node) {
    return node.getAttributeNS(NAMESPACE_URI, 'href');
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Attribution object.
   */
  function readAttribution(node, objectStack) {
    return pushParseAndPop({}, ATTRIBUTION_PARSERS, node, objectStack);
  }


  /**
   * @private
   * @param {Node} node Node.
   * @return {ol.Extent} Bounding box object.
   */
  function readBoundingBoxExtent (node) {
    return [
      readDecimalString(node.getAttribute('minx')),
      readDecimalString(node.getAttribute('miny')),
      readDecimalString(node.getAttribute('maxx')),
      readDecimalString(node.getAttribute('maxy'))
    ];
  }

  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object} Bounding box object.
   */
  function readBoundingBox (node, objectStack) {
    var extent = readBoundingBoxExtent(node);
    var resolutions = [
      readDecimalString(node.getAttribute('resx')),
      readDecimalString(node.getAttribute('resy'))
    ];

    return {
      'crs': node.getAttribute('CRS') || node.getAttribute('SRS'),
      extent: extent, res: resolutions
    };
  }

  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {ol.Extent|undefined} Bounding box object.
   */
  function readLatLonBoundingBox (node, objectStack) {
    var extent = readBoundingBoxExtent(node);

    if (!isDef(extent[0]) || !isDef(extent[1]) ||
      !isDef(extent[2]) || !isDef(extent[3])) {
      return undefined;
    }

    return extent;
  }


  /**
   * @privat
   * @param  {Node} node  Node
   * @param  {Arra.<Object>} objectStack Object stack
   * @return {Object}
   */
  function readScaleHint (node, objectStack) {
    var min = parseFloat(node.getAttribute('min'));
    var max = parseFloat(node.getAttribute('max'));

    return { min: min, max: max };
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {ol.Extent|undefined} Bounding box object.
   */
  function readEXGeographicBoundingBox (node, objectStack) {
    var geographicBoundingBox = pushParseAndPop({},
      EX_GEOGRAPHIC_BOUNDING_BOX_PARSERS,
      node, objectStack);
    if (!isDef(geographicBoundingBox)) { return undefined; }

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
  }


  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object|undefined} Capability object.
   */
  function readCapability (node, objectStack) {
    return pushParseAndPop({}, CAPABILITY_PARSERS, node, objectStack);
  }


  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object|undefined} Service object.
   */
  function readService (node, objectStack) {
    return pushParseAndPop({}, SERVICE_PARSERS, node, objectStack);
  }


  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object|undefined} Contact information object.
   */
  function readContactInformation (node, objectStack) {
    return pushParseAndPop({}, CONTACT_INFORMATION_PARSERS,
      node, objectStack);
  }


  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object|undefined} Contact person object.
   */
  function readContactPersonPrimary (node, objectStack) {
    return pushParseAndPop({}, CONTACT_PERSON_PARSERS,
      node, objectStack);
  }


  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object|undefined} Contact address object.
   */
  function readContactAddress (node, objectStack) {
    return pushParseAndPop({}, CONTACT_ADDRESS_PARSERS,
      node, objectStack);
  }


  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Array.<string>|undefined} Format array.
   */
  function readException (node, objectStack) {
    return pushParseAndPop(
      [], EXCEPTION_PARSERS, node, objectStack);
  }


  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object|undefined} Layer object.
   */
  function readCapabilityLayer (node, objectStack) {
    var queryable = readBooleanString(node.getAttribute('queryable'));  
    return pushParseAndPop({
      queryable: isDef(queryable) ? queryable : false }, 
      LAYER_PARSERS, node, objectStack);
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Layer object.
   */
  function readLayer (node, objectStack) {
    var parentLayerObject = /**  @type {Object.<string,*>} */
      (objectStack[objectStack.length - 1]);

    var layerObject = /**  @type {Object.<string,*>} */
      (pushParseAndPop({}, LAYER_PARSERS,
        node, objectStack));

    if (!isDef(layerObject)) { return undefined; }

    var queryable = readBooleanString(node.getAttribute('queryable'));
    if (!isDef(queryable)) {
      queryable = parentLayerObject['queryable'];
    }
    layerObject['queryable'] = isDef(queryable) ? queryable : false;

    var cascaded = readNonNegativeIntegerString(node.getAttribute('cascaded'));
    if (!isDef(cascaded)) {
      cascaded = parentLayerObject['cascaded'];
    }
    layerObject['cascaded'] = cascaded;

    var opaque = readBooleanString(node.getAttribute('opaque'));
    if (!isDef(opaque)) {
      opaque = parentLayerObject['opaque'];
    }
    layerObject['opaque'] = isDef(opaque) ? opaque : false;

    var noSubsets = readBooleanString(node.getAttribute('noSubsets'));
    if (!isDef(noSubsets)) {
      noSubsets = parentLayerObject['noSubsets'];
    }
    layerObject['noSubsets'] = isDef(noSubsets) ? noSubsets : false;

    var fixedWidth = readDecimalString(node.getAttribute('fixedWidth'));
    if (!isDef(fixedWidth)) {
      fixedWidth = parentLayerObject['fixedWidth'];
    }
    layerObject['fixedWidth'] = fixedWidth;

    var fixedHeight = readDecimalString(node.getAttribute('fixedHeight'));
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
    for (var i$1 = 0, len$1 = replaceKeys.length; i$1 < len$1; i$1++) {
      var key$1 = replaceKeys[i$1];
      var childValue$1 = layerObject[key$1];
      if (!isDef(childValue$1)) {
        var parentValue$1 = parentLayerObject[key$1];
        layerObject[key$1] = parentValue$1;
      }
    }

    return layerObject;
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object} Dimension object.
   */
  function readDimension (node, objectStack) {
    return {
      'name': node.getAttribute('name'),
      'units': node.getAttribute('units'),
      'unitSymbol': node.getAttribute('unitSymbol'),
      'default': node.getAttribute('default'),
      'multipleValues': readBooleanString(node.getAttribute('multipleValues')),
      'nearestValue': readBooleanString(node.getAttribute('nearestValue')),
      'current': readBooleanString(node.getAttribute('current')),
      'values': readString(node)
    };
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Online resource object.
   */
  function readFormatOnlineresource (node, objectStack) {
    return pushParseAndPop({}, FORMAT_ONLINERESOURCE_PARSERS,
      node, objectStack);
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Request object.
   */
  function readRequest (node, objectStack) {
    return pushParseAndPop({}, REQUEST_PARSERS, node, objectStack);
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} DCP type object.
   */
  function readDCPType (node, objectStack) {
    return pushParseAndPop({}, DCPTYPE_PARSERS, node, objectStack);
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} HTTP object.
   */
  function readHTTP (node, objectStack) {
    return pushParseAndPop({}, HTTP_PARSERS, node, objectStack);
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Operation type object.
   */
  function readOperationType (node, objectStack) {
    return pushParseAndPop({}, OPERATIONTYPE_PARSERS, node, objectStack);
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Online resource object.
   */
  function readSizedFormatOnlineresource (node, objectStack) {
    var formatOnlineresource = readFormatOnlineresource(node, objectStack);
    if (isDef(formatOnlineresource)) {
      var size = [
        readNonNegativeIntegerString(node.getAttribute('width')),
        readNonNegativeIntegerString(node.getAttribute('height'))
      ];
      formatOnlineresource['size'] = size;
      return formatOnlineresource;
    }
    return undefined;
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Authority URL object.
   */
  function readAuthorityURL (node, objectStack) {
    var authorityObject = readFormatOnlineresource(node, objectStack);
    if (isDef(authorityObject)) {
      authorityObject['name'] = node.getAttribute('name');
      return authorityObject;
    }
    return undefined;
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Metadata URL object.
   */
  function readMetadataURL (node, objectStack) {
    var metadataObject = readFormatOnlineresource(node, objectStack);
    if (isDef(metadataObject)) {
      metadataObject['type'] = node.getAttribute('type');
      return metadataObject;
    }
    return undefined;
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Style object.
   */
  function readStyle (node, objectStack) {
    return pushParseAndPop({}, STYLE_PARSERS, node, objectStack);
  }


  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Array.<string>|undefined} Keyword list.
   */
  function readKeywordList (node, objectStack) {
    return pushParseAndPop(
      [], KEYWORDLIST_PARSERS, node, objectStack);
  }


  /**
   * @const
   * @type {Array.<string>}
   */
  var NAMESPACE_URIS = [
    null,
    'http://www.opengis.net/wms'
  ];

  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Service': makeObjectPropertySetter(readService),
      'Capability': makeObjectPropertySetter(readCapability)
    });

  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var CAPABILITY_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Request': makeObjectPropertySetter(readRequest),
      'Exception': makeObjectPropertySetter(readException),
      'Layer': makeObjectPropertySetter(readCapabilityLayer)
    });

  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var SERVICE_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Name': makeObjectPropertySetter(readString),
      'Title': makeObjectPropertySetter(readString),
      'Abstract': makeObjectPropertySetter(readString),
      'KeywordList': makeObjectPropertySetter(readKeywordList),
      'OnlineResource': makeObjectPropertySetter(readHref),
      'ContactInformation': makeObjectPropertySetter(readContactInformation),
      'Fees': makeObjectPropertySetter(readString),
      'AccessConstraints': makeObjectPropertySetter(readString),
      'LayerLimit': makeObjectPropertySetter(readNonNegativeInteger),
      'MaxWidth': makeObjectPropertySetter(readNonNegativeInteger),
      'MaxHeight': makeObjectPropertySetter(readNonNegativeInteger)
    });

  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var CONTACT_INFORMATION_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'ContactPersonPrimary': makeObjectPropertySetter(readContactPersonPrimary),
      'ContactPosition': makeObjectPropertySetter(readString),
      'ContactAddress': makeObjectPropertySetter(readContactAddress),
      'ContactVoiceTelephone': makeObjectPropertySetter(readString),
      'ContactFacsimileTelephone': makeObjectPropertySetter(readString),
      'ContactElectronicMailAddress': makeObjectPropertySetter(readString)
    });

  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var CONTACT_PERSON_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'ContactPerson': makeObjectPropertySetter(readString),
      'ContactOrganization': makeObjectPropertySetter(readString)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var CONTACT_ADDRESS_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'AddressType': makeObjectPropertySetter(readString),
      'Address': makeObjectPropertySetter(readString),
      'City': makeObjectPropertySetter(readString),
      'StateOrProvince': makeObjectPropertySetter(readString),
      'PostCode': makeObjectPropertySetter(readString),
      'Country': makeObjectPropertySetter(readString)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var EXCEPTION_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Format': makeArrayPusher(readString)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var LAYER_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Name': makeObjectPropertySetter(readString),
      'Title': makeObjectPropertySetter(readString),
      'Abstract': makeObjectPropertySetter(readString),
      'KeywordList': makeObjectPropertySetter(readKeywordList),
      'CRS': makeObjectPropertyPusher(readString),
      'SRS': makeObjectPropertyPusher(readString),
      'EX_GeographicBoundingBox': makeObjectPropertySetter(readEXGeographicBoundingBox),
      'LatLonBoundingBox': makeObjectPropertySetter(readLatLonBoundingBox),
      'BoundingBox': makeObjectPropertyPusher(readBoundingBox),
      'Dimension': makeObjectPropertyPusher(readDimension),
      'Attribution': makeObjectPropertySetter(readAttribution),
      'AuthorityURL': makeObjectPropertyPusher(readAuthorityURL),
      'Identifier': makeObjectPropertyPusher(readString),
      'MetadataURL': makeObjectPropertyPusher(readMetadataURL),
      'DataURL': makeObjectPropertyPusher(readFormatOnlineresource),
      'FeatureListURL': makeObjectPropertyPusher(readFormatOnlineresource),
      'Style': makeObjectPropertyPusher(readStyle),
      'MinScaleDenominator': makeObjectPropertySetter(readDecimal),
      'MaxScaleDenominator': makeObjectPropertySetter(readDecimal),
      'ScaleHint': makeObjectPropertySetter(readScaleHint),
      'Layer': makeObjectPropertyPusher(readLayer)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var ATTRIBUTION_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Title': makeObjectPropertySetter(readString),
      'OnlineResource': makeObjectPropertySetter(readHref),
      'LogoURL': makeObjectPropertySetter(readSizedFormatOnlineresource)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var EX_GEOGRAPHIC_BOUNDING_BOX_PARSERS =
    makeParsersNS(NAMESPACE_URIS, {
      'westBoundLongitude': makeObjectPropertySetter(readDecimal),
      'eastBoundLongitude': makeObjectPropertySetter(readDecimal),
      'southBoundLatitude': makeObjectPropertySetter(readDecimal),
      'northBoundLatitude': makeObjectPropertySetter(readDecimal)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var REQUEST_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'GetCapabilities': makeObjectPropertySetter(
        readOperationType),
      'GetMap': makeObjectPropertySetter(
        readOperationType),
      'GetFeatureInfo': makeObjectPropertySetter(
        readOperationType)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var OPERATIONTYPE_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Format': makeObjectPropertyPusher(readString),
      'DCPType': makeObjectPropertyPusher(
        readDCPType)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var DCPTYPE_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'HTTP': makeObjectPropertySetter(
        readHTTP)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var HTTP_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Get': makeObjectPropertySetter(
        readFormatOnlineresource),
      'Post': makeObjectPropertySetter(
        readFormatOnlineresource)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var STYLE_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Name': makeObjectPropertySetter(readString),
      'Title': makeObjectPropertySetter(readString),
      'Abstract': makeObjectPropertySetter(readString),
      'LegendURL': makeObjectPropertyPusher(readSizedFormatOnlineresource),
      'StyleSheetURL': makeObjectPropertySetter(readFormatOnlineresource),
      'StyleURL': makeObjectPropertySetter(readFormatOnlineresource)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var FORMAT_ONLINERESOURCE_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Format': makeObjectPropertySetter(readString),
      'OnlineResource': makeObjectPropertySetter(readHref)
    });


  /**
   * @const
   * @type {Object.<string, Object.<string, XMLParser.Parser>>}
   * @private
   */
  var KEYWORDLIST_PARSERS = makeParsersNS(
    NAMESPACE_URIS, {
      'Keyword': makeArrayPusher(readString)
    });

  var WMS = function WMS(xmlString, DOMParser) {
    if (!DOMParser && typeof window !== 'undefined') {
      DOMParser = window.DOMParser;
    }

    /**
     * @type {String}
     */
    this.version = undefined;

    /**
     * @type {XMLParser}
     */
    this._parser = new XMLParser(DOMParser);

    /**
     * @type {String=}
     */
    this._data = xmlString;
  };


  /**
   * @param {String} xmlString
   * @return {WMS}
   */
  WMS.prototype.data = function data (xmlString) {
    this._data = xmlString;
    return this;
  };

  /**
   * @param{String=} xmlString
   * @return {Object}
   */
  WMS.prototype.toJSON = function toJSON (xmlString) {
    xmlString = xmlString || this._data;
    return this.parse(xmlString);
  };

  /**
   * @return {String} xml
   */
  WMS.prototype.parse = function parse (xmlString) {
    return this._readFromDocument(this._parser.toDocument(xmlString));
  };

  /**
   * @param{Document} doc
   * @return {Object}
   */
  WMS.prototype._readFromDocument = function _readFromDocument (doc) {
    for (var node = doc.firstChild; node; node = node.nextSibling) {
      if (node.nodeType == NODE_TYPES.ELEMENT) {
        return this.readFromNode(node);
      }
    }
    return null;
  };

  /**
   * @param{DOMNode} node
   * @return {Object}
   */
  WMS.prototype.readFromNode = function readFromNode (node) {
    this.version = node.getAttribute('version');
    var wmsCapabilityObject = pushParseAndPop({
      'version': this.version
    }, PARSERS, node, []);

    return wmsCapabilityObject || null;
  };

  return WMS;

})));
//# sourceMappingURL=wms-capabilities.js.map
