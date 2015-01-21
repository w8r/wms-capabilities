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

/**
 * @class WMSCapabilities
 * @constructor
 */
var WMSCapabilities = function() {};

/**
 * @param {String} xmlString
 * @return {WMSCapabilities}
 */
WMS.prototype.data = function(xmlString) {};

/**
 * @param  {String=} xmlString
 * @return {Object}
 */
WMS.prototype.toJSON = function(xmlString) {};

/**
 * @param {String} xmlString
 * @return {Object}
 */
WMS.prototype.parse = function(xmlString) {};
