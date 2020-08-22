/**
 * @file
 *
 * Provides a selection of simple utilities for use in other methods.
 */

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
