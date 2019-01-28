import isDef from './isdef';

/**
 * Make sure we trim BOM and NBSP
 * @type {RegExp}
 */
const TRIM_RE = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

/**
 * Repeats a string n times.
 * @param {String} string The string to repeat.
 * @param {Number} length The number of times to repeat.
 * @return {String} A string containing {@code length} repetitions of
 *     {@code string}.
 */
function repeat(string, length) {
  return new Array(length + 1).join(string);
}

/**
 * @param  {String} str
 * @return {String}
 */
export function trim (str) {
  return str.replace(TRIM_RE, '');
}

/**
 * Pads number to given length and optionally rounds it to a given precision.
 * For example:
 * <pre>padNumber(1.25, 2, 3) -> '01.250'
 * padNumber(1.25, 2) -> '01.25'
 * padNumber(1.25, 2, 1) -> '01.3'
 * padNumber(1.25, 0) -> '1.25'</pre>
 *
 * @param {Number} num The number to pad.
 * @param {Number} length The desired length.
 * @param {Number=} opt_precision The desired precision.
 * @return {String} {@code num} as a string with the given options.
 */
export function padNumber (num, length, opt_precision) {
  var s = isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf('.');
  if (index == -1) {
    index = s.length;
  }
  return repeat('0', Math.max(0, length - index)) + s;
}
