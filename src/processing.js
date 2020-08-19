import { prettyJSON, isObject, isArray, isValue, normalizeValue, E100, E101 } from '../src';

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




/**
 * Adds blank missing fields to a piece of content JSON, based on the fields present in the schema.
 * Throws an error if a field that is NOT in the schema is present in the content blob.
 *
 * @param {JSON} schema A JSON blob containing the schema for the passed content
 * @param {JSON} content A JSON blob to be modified to fit the passed schema
 */
export function enforceSchema(schema, content) {
    // First, check for fields in the content that are NOT present in the schema:
    _enforceSchemaCheckMissingFields(schema, content);

    // Then, check for fields in the schema that need to be added to the content.
    _enforceSchemaAddNewFields(schema, content);
}

function _enforceSchemaCheckMissingFields(schema, content) {
    const schemaKeys = Object.keys(schema);
    Object.keys(content).forEach((val) => {
        // If a key is present in the content that is not present in the schema, throw an error.
        if (!schemaKeys.includes(val)) throw E100;

        // If a key is a different type than specified in the schema, throw an error.
        if (typeof content[val] !== typeof schema[val]) throw E101;

        // Recursive run for objects.
        if (isObject(content[val])) {
            _enforceSchemaCheckMissingFields(content[val], schema[val]);
        }

        // Recursive runs for arrays of objects.
        if (isArray(content[val]) && content[val].every(isObject)) {
            content[val].forEach((obj) => {
                _enforceSchemaCheckMissingFields(schema[val][0], obj);
            });
        }
    });
}

function _enforceSchemaAddNewFields(schema, content) {}
