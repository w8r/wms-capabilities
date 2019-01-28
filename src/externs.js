/**
 * Externs file for google closure compiler
 */

// this makes GCC play with browserify

/**
 * @param {*=}o
 * @param {*=}u
 */
window.require = function(o, u) {};

/**
 * @type {Object}
 */
window.module = {
  exports: {}
};

window['WMSCapabilities'] = function () {};

/**
 * @class WMSCapabilities
 * @constructor
 */
window['WMSCapabilities'] = function() {};

/**
 * @param {String} xmlString
 * @return {WMSCapabilities}
 */
window['WMSCapabilities'].prototype.data = function(xmlString) {};

/**
 * @param  {String=} xmlString
 * @return {Object}
 */
window['WMSCapabilities'].prototype.toJSON = function(xmlString) {};

/**
 * @param {String} xmlString
 * @return {Object}
 */
window['WMSCapabilities'].prototype.parse = function(xmlString) {};
