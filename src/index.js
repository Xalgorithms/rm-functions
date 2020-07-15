//export * from './utils';

import { isObject, isArray, isValue, isTable } from './types.js';

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
    return _pathifyJSON_Base(document, false);
}

function pathifyTableRow(document) {
    return _pathifyJSON_Base(document, true);
}

function _pathifyJSON_Base(document, table = false) {
    const newBlob = { values: {}, tables: {} };
    const path = [];

    if (typeof document !== 'object') {
        console.error(`Document is not valid:\n${document}`);
        return false;
    }

    _recurseAndAdd(null, path, document, newBlob);

    if (table === true && Object.keys(newBlob.tables).length > 0)
        throw 'Table rows include tables.';

    if (table === true) return newBlob.values;
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
    const valuePath = path.join('.');
    if (isObject(value)) {
        if (Object.keys(value).length === 0) return;
        Object.entries(value).forEach(([inner_key, inner_value]) => {
            const newPath = path.slice();
            newPath.push(inner_key);
            _recurseAndAdd(inner_key, newPath, inner_value, blob);
        });
    } else if (isArray(value)) {
        const tableObjects = [];
        const arrayValues = [];
        for (const arrayElementIndex in value) {
            const element = value[arrayElementIndex];
            if (isObject(element)) {
                tableObjects.push(pathifyTableRow(element));
            } else if (isValue(element)) {
                arrayValues.push(normalizeValue(element));
            }
        }
        if (tableObjects.length > 0) blob.tables[valuePath] = tableObjects;
        if (arrayValues.length > 0) blob.values[valuePath] = arrayValues;
    } else if (isValue(value)) {
        blob.values[valuePath] = normalizeValue(value);
    } else {
        console.error(`Unexpected object configuration found. Object:\n\n${prettyJSON(value)}`);
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
 * Ensure numbers are stored in the proccesed JSON as numbers.
 * @param {Object} val A String or Number
 */
export function normalizeValue(val) {
    return val;
}
