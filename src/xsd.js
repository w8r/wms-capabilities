import isDef from './utils/isdef';
import { padNumber, trim } from './utils/string';
import XMLParser, { getAllTextContent } from './xml_parser';

/**
 * @const
 * @type {string}
 */
export const NAMESPACE_URI = 'http://www.w3.org/2001/XMLSchema';

/**
 * @param {Node} node Node.
 * @return {boolean|undefined} Boolean.
 */
export function readBoolean (node) {
  const s = getAllTextContent(node, false);
  return readBooleanString(s);
}

/**
 * @param {string} string String.
 * @return {boolean|undefined} Boolean.
 */
export function readBooleanString (string) {
  const m = /^\s*(true|1)|(false|0)\s*$/.exec(string);
  if (m) {
    return isDef(m[1]) || false;
  } else {
    return undefined;
  }
}


/**
 * @param {Node} node Node.
 * @return {number|undefined} DateTime in seconds.
 */
export function readDateTime (node) {
  const s = getAllTextContent(node, false);
  const re = /^\s*(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|(?:([+\-])(\d{2})(?::(\d{2}))?))\s*$/;
  const m = re.exec(s);
  if (m) {
    const year = parseInt(m[1], 10);
    const month = parseInt(m[2], 10) - 1;
    const day = parseInt(m[3], 10);
    const hour = parseInt(m[4], 10);
    const minute = parseInt(m[5], 10);
    const second = parseInt(m[6], 10);
    let dateTime = Date.UTC(year, month, day, hour, minute, second) / 1000;
    if (m[7] != 'Z') {
      const sign = m[8] == '-' ? -1 : 1;
      dateTime += sign * 60 * parseInt(m[9], 10);
      if (isDef(m[10])) {
        dateTime += sign * 60 * 60 * parseInt(m[10], 10);
      }
    }
    return dateTime;
  } else {
    return undefined;
  }
}


/**
 * @param {Node} node Node.
 * @return {number|undefined} Decimal.
 */
export function readDecimal (node) {
  return readDecimalString(getAllTextContent(node, false));
}


/**
 * @param {string} string String.
 * @return {number|undefined} Decimal.
 */
export function readDecimalString (string) {
  // FIXME check spec
  const m = /^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*$/i.exec(string);
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
export function readNonNegativeInteger (node) {
  return readNonNegativeIntegerString(getAllTextContent(node, false));
}


/**
 * @param {string} string String.
 * @return {number|undefined} Non negative integer.
 */
export function  readNonNegativeIntegerString (string) {
  const m = /^\s*(\d+)\s*$/.exec(string);
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
export function readString (node) {
  return trim(getAllTextContent(node, false));
}


/**
 * @param {Node} node Node to append a TextNode with the boolean to.
 * @param {boolean} bool Boolean.
 */
export function writeBooleanTextNode (node, bool) {
  writeStringTextNode(node, (bool) ? '1' : '0');
}


/**
 * @param {Node} node Node to append a TextNode with the dateTime to.
 * @param {number} dateTime DateTime in seconds.
 */
export function writeDateTimeTextNode (node, dateTime) {
  const date = new Date(dateTime * 1000);
  const string = date.getUTCFullYear() + '-' +
    padNumber(date.getUTCMonth() + 1, 2) + '-' +
    padNumber(date.getUTCDate(), 2) + 'T' +
    padNumber(date.getUTCHours(), 2) + ':' +
    padNumber(date.getUTCMinutes(), 2) + ':' +
    padNumber(date.getUTCSeconds(), 2) + 'Z';
  node.appendChild(XMLParser.DOCUMENT.createTextNode(string));
};


/**
 * @param {Node} node Node to append a TextNode with the decimal to.
 * @param {number} decimal Decimal.
 */
export function writeDecimalTextNode (node, decimal) {
  const string = decimal.toPrecision();
  node.appendChild(XMLParser.DOCUMENT.createTextNode(string));
}


/**
 * @param {Node} node Node to append a TextNode with the decimal to.
 * @param {number} nonNegativeInteger Non negative integer.
 */
export function writeNonNegativeIntegerTextNode (node, nonNegativeInteger) {
  const string = nonNegativeInteger.toString();
  node.appendChild(XMLParser.DOCUMENT.createTextNode(string));
}


/**
 * @param {Node} node Node to append a TextNode with the string to.
 * @param {string} string String.
 */
export function writeStringTextNode (node, string) {
  node.appendChild(XMLParser.DOCUMENT.createTextNode(string));
}
