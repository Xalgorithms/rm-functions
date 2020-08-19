import { isObject, isArray, isValue } from './types.js';
import { E100, E101 } from './exceptions.js';
import { prettyJSON } from '../src';

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
    console.log(`Checking ${prettyJSON(schema)} against ${prettyJSON(content)}`);
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

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function objectEmpty(obj) {
    const type = typeof obj;
    if (!obj) return true; // If null, return true;
    if (type !== 'object') return true; // If not an object, it's 'empty'.
    return Object.keys(obj).length === 0;
}
