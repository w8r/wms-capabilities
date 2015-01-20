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
