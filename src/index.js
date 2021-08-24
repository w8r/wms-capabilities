import XMLParser, { pushParseAndPop } from './xml_parser';
import nodeTypes from './node_types';
import { PARSERS } from './parsers';

export default class WMS {
  /**
   * WMS Capabilities parser
   *
   * @param {String=} xmlString
   * @constructor
   */
  constructor(xmlString, DOMParser) {
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
  }


  /**
   * @param {String} xmlString
   * @return {WMS}
   */
  data (xmlString) {
    this._data = xmlString;
    return this;
  }

  /**
   * @param  {String=} xmlString
   * @return {Object|null}
   */
  toJSON (xmlString) {
    xmlString = xmlString || this._data;
    return this.parse(xmlString);
  }

  /**
   * @return {String} xml
   * @return {Object|null}
   */
  parse (xmlString) {
    return this.readFromDocument(this._parser.toDocument(xmlString));
  }

  /**
   * @param  {Document} doc
   * @return {Object|null}
   */
  readFromDocument (doc) {
    for (let node = doc.firstChild; node; node = node.nextSibling) {
      if (node.nodeType == nodeTypes.ELEMENT) {
        return this.readFromNode(node);
      }
    }
    return null;
  }

  /**
   * @param  {DOMNode} node
   * @return {Object}
   */
  readFromNode (node) {
    this.version = node.getAttribute('version');
    const wmsCapabilityObject = pushParseAndPop({
      'version': this.version
    }, PARSERS, node, []);

    return wmsCapabilityObject || null;
  }
}
    