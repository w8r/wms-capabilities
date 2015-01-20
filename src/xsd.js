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
