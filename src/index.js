//export * from './utils';

const XA_TYPES = {
    OBJECT: 'object',
    ARRAY: 'array',
    VALUE: 'value',
};

/**
 * Tests the
 * @param {*} stringx
 */
export function processText(stringx) {
    return stringx;
}

/**
 * Takes a document and transforms nested objects into string paths.
 *
 * @param {Object} document A blob of incoming structured JSON data.
 * @returns {Object} Restructured version of the original document
 */
export function pathifyJSON(document) {
    const newBlob = { values: {}, tables: {} };
    const path = [];

    if (typeof document !== 'object') {
        console.error('Document is not valid.');
        return false;
    }

    _recurseAndAdd(null, path, document, newBlob);
    return newBlob;
}

/**
 * Modifies a restructured JSON object with all values stored with full JSON
 * string-paths in a values object, and all tables stored with full JSON
 * string-paths in a tables object. Used by pathifyJSON function.
 *
 * @param {String} key JSON object key.
 * @param {Array} path Array of keys, the path to the current value.
 * @param {Object} value The JSON object value.
 * @param {Object} blob The returned object of the parent function
 */
function _recurseAndAdd(key, path, value, blob) {
    if (isObject(value)) {
        Object.entries(value).forEach(([inner_key, inner_value]) => {
            const newPath = path.slice();
            newPath.push(inner_key);
            _recurseAndAdd(inner_key, newPath, inner_value, blob);
        });
        return;
    } else if (isArray(value) && value.every(isValue)) {
        const valuePath = path.join('.');
        blob.values[valuePath] = value;
        return;
    } else if (isArray(value) && value.every(isObject)) {
        return;
    } else if (isArray(value)) {
        console.error(`Unexpected mixed array found. Object:\n\n${prettyJSON(value)}`);
        return;
    } else if (isValue(value)) {
        const valuePath = path.join('.');
        console.warn(`Found VALUE: ${valuePath}: ${value}`);
        blob.values[valuePath] = value;
        return;
    } else {
        console.error(`Unexpected object configuration found. Object:\n\n${prettyJSON(value)}`);
        return;
    }
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
 * Checks to see if the object is an XA table: an array with key-value JSON objects.
 *
 * @param {Object} x  Object to test.
 * @returns {Boolean}
 */
export function isTable(x) {
    // Table must be an array.
    if (!isArray(x)) return false;

    // Table must contain only objects.
    if (!table.every(isObject)) return false;

    // Table objects must all be key-value pairs.
}

/**
 * Returns the XA_TYPE enumeration of the input object.
 *
 * @param {Object} obj
 */
export function xaType(obj) {
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return XA_TYPES.ARRAY;
        }
        return XA_TYPES.OBJECT;
    }
    return XA_TYPES.VALUE;
}
