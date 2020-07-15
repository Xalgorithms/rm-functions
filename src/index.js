//export * from './utils';

const XA_TYPES = {
    OBJECT: 'object',
    ARRAY: 'array',
    VALUE: 'value',
};

export function processText(stringx) {
    return stringx;
}

/**
 * pathifyJSON( document: JSON blob )
 * Takes a document and transforms nested objects into string paths.
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
 *
 * @param {String} key
 * @param {Array} path
 * @param {Object} value
 * @param {Object} blob
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
        // This is an ARRAY-VALUE
        const valuePath = path.join('.');
        blob.values[valuePath] = value;
        return;
    } else if (isArray(value) && value.every(isObject)) {
        // This is a TABLE.
        return;
    } else if (isArray(value)) {
        // This is a MIXED TABLE.
        console.error(`Unexpected mixed array found. Object:\n\n${prettyJSON(value)}`);
        return;
    } else if (isValue(value)) {
        // The value is a VALUE.
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
 * @param {Object} x Input JSON object.
 * @returns {String} Pretty-printed JSON string.
 */
export function prettyJSON(x) {
    return JSON.stringify(x, null, 2);
}

/**
 * Checks to see if the object is a JSON object.
 * @param {Object} x  Object to test.
 * @returns {Boolean}
 */
export function isObject(x) {
    return xaType(x) === XA_TYPES.OBJECT;
}

/**
 * Checks to see if the object is an Array.
 * @param {Object} x  Object to test.
 * @returns {Boolean}
 */
export function isArray(x) {
    return xaType(x) == XA_TYPES.ARRAY;
}

/**
 * Checks to see if the object is an XA VALUE.
 * @param {Object} x  Object to test.
 * @returns {Boolean}
 */
export function isValue(x) {
    return xaType(x) == XA_TYPES.VALUE;
}

/**
 * Checks to see if the object is an XA table: an array with key-value JSON objects.
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
