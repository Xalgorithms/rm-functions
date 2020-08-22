/**
 * @file
 *
 * Allows the system to confidently categorize different entities within JSON data.
 */

export const XA_TYPES = {
    OBJECT: 'object',
    ARRAY: 'array',
    VALUE: 'value',
    EMPTY: 'empty',
};

/**
 * Checks to see if the object is a JSON object.
 *
 * @param {Object} x  Object to test.
 * @returns {Boolean}
 */
export function isObject(x) {
    return xaType(x) === XA_TYPES.OBJECT;
}

/**
 * Checks to see if the object is an Array.
 *
 * @param {Object} x  Object to test.
 * @returns {Boolean}
 */
export function isArray(x) {
    return xaType(x) == XA_TYPES.ARRAY;
}

/**
 * Checks to see if the object is an XA VALUE.
 *
 * @param {Object} x  Object to test.
 * @returns {Boolean}
 */
export function isValue(x) {
    return xaType(x) == XA_TYPES.VALUE;
}

/**
 * Checks to see if the object is an XA table: an array with key-value JSON
 * objects. A table may not contain arrays or objects as table values.
 *
 * @param {Object} x  Object to test.
 * @returns {Boolean}
 */
export function isTable(x) {
    // Table must be an array.
    if (!isArray(x)) return false;

    // Table must contain only objects.
    if (!x.every(isObject)) return false;

    // Table objects must all be key-value pairs.
    for (const item of x) {
        for (const value of Object.values(item)) {
            if (!isValue(value)) return false;
        }
    }

    return true;
}

/**
 * Returns the XA_TYPE enumeration of the input object.
 *
 * @param {Object} obj
 */
export function xaType(obj) {
    if (obj === null) return XA_TYPES.EMPTY;
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return XA_TYPES.ARRAY;
        }
        return XA_TYPES.OBJECT;
    }
    return XA_TYPES.VALUE;
}
