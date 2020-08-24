/**
 * Returns a deep copy of a JSON object.
 * @param {JSON} obj The JSON object to replicate.
 */
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function objectEmpty(obj) {
  const type = typeof obj;
  if (!obj) return true; // If null, return true;
  if (type !== 'object') return true; // If not an object, it's 'empty'.
  return Object.keys(obj).length === 0;
}

/* ============================================================================= */

/**
 * Returns the stringified version of a JSON object.
 *
 * @param {Object} x Input JSON object.
 * @returns {String} Pretty-printed JSON string.
 */
export function prettyJSON(x) {
  return JSON.stringify(x, null, 2);
}

/**
 * Ensure numbers are stored in the proccesed JSON as numbers.
 * @param {Object} val A String or Number
 */
export function normalizeValue(val) {
  // Float?
  const float = parseFloat(val);
  if (!isNaN(float)) return float;

  // Int?
  const int = parseInt(val);
  if (!isNaN(int)) return int;

  // String.
  return val;
}

export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const alpha_len = alphabet.length;

/**
 * Generates an input/output case ID from the previous int/char combination.
 * @param {string} prevValue
 */
export function generateCaseValueFromPrev(prevValue) {
  if (typeof prevValue !== 'string')
    throw Error('Could not generate next case, value is not a string.');
  if (prevValue.length === 1) {
    const nextVal = alphabet.indexOf(prevValue) + 1;
    return generateCaseValue(nextVal);
  } else {
    const valueLen = prevValue.length;
    const number = parseInt(prevValue.substring(0, valueLen - 1));
    const letter = alphabet.indexOf(prevValue.substring(valueLen - 1, valueLen));
    const nextVal = number * alpha_len + letter + 1;
    return generateCaseValue(nextVal);
  }
}

/**
 * Generates an input/output case ID from its numerical position in the cases.
 * @param {int} number
 */
export function generateCaseValue(number) {
  const pre = Math.floor(number / alpha_len);
  const cha = alphabet.charAt(number % alpha_len);
  if (pre === 0) {
    return cha;
  } else {
    return `${pre}${cha}`;
  }
}
