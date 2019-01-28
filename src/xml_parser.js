import isDef from './utils/isdef';
import setIfUndefined from'./utils/setifundefined';
import nodeTypes from './node_types';

export default class XMLParser {
  /**
   * XML DOM parser
   * @constructor
   * @param {DOMParser} DOMParser
   */
  constructor (DOMParser) {
    /**
     * @type {DOMParser}
     */
    this._parser = new DOMParser();
  };

  /**
   * @param  {String} xmlstring
   * @return {Document}
   */
  toDocument (xmlstring) {
    return this._parser.parseFromString(xmlstring, 'application/xml');
  }

  /**
   * Recursively grab all text content of child nodes into a single string.
   * @param {Node} node Node.
   * @param {boolean} normalizeWhitespace Normalize whitespace: remove all line
   * breaks.
   * @return {string} All text content.
   * @api
   */
  getAllTextContent (node, normalizeWhitespace) {
    return getAllTextContent(node, normalizeWhitespace, []).join('');
  }
}


/**
* Recursively grab all text content of child nodes into a single string.
* @param {Node} node Node.
* @param {boolean} normalizeWhitespace Normalize whitespace: remove all line
* breaks.
* @return {string} All text content.
* @api
*/
export function getAllTextContent (node, normalizeWhitespace) {
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
export function getAllTextContentInternal (node, normalizeWhitespace, accumulator) {
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
export function parseNode (parsersNS, node, objectStack, bind) {
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
export function firstElementChild (node) {
  let firstElementChild = node.firstElementChild || node.firstChild;
  while (firstElementChild && firstElementChild.nodeType !== nodeTypes.ELEMENT) {
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
  let nextSibling = node.nextElementSibling || node.nextSibling;
  while (nextSibling && nextSibling.nodeType !== nodeTypes.ELEMENT) {
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
export function makeParsersNS (namespaceURIs, parsers, opt_parsersNS) {
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
export function makeStructureNS (namespaceURIs, structure, opt_structureNS) {
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
export function makeArrayPusher (valueReader, opt_this) {
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
export function pushParseAndPop (object, parsersNS, node, objectStack, bind) {
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
export function makeObjectPropertySetter (valueReader, opt_property, opt_this) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array.<*>} objectStack Object stack.
     */
    function(node, objectStack) {
      let value = valueReader.call(isDef(opt_this) ? opt_this : this,
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
export function makeObjectPropertyPusher (valueReader, opt_property, opt_this) {
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
