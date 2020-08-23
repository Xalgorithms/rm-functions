import {
  prettyJSON,
  isObject,
  isArray,
  isValue,
  normalizeValue,
  E100,
  E101,
  E102,
  E103,
  E104,
  deepCopy,
} from '../src';

/**
 * ===========================================================================
 *     Pathify JSON function.
 * ===========================================================================
 */

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

  if (table === true && Object.keys(newBlob.tables).length > 0) throw 'Table rows include tables.';

  if (table === true) return newBlob.values;
  return newBlob;
}

/**
 * Modifies a restructured JSON object with all values stored with full JSON
 * string-paths in a values object, and all tables stored with full JSON
 * string-paths in a tables object. Used by pathifyJSON function.
 *
 * @private
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
 * ===========================================================================
 *     Enforce Schema Function
 * ===========================================================================
 */

/**
 * Adds blank missing fields to a piece of content JSON, based on the fields present in the schema.
 * Throws an error if a field that is NOT in the schema is present in the content blob.
 *
 * Additionally, ignores schema enforcement.
 *
 * @param {JSON} schema A JSON blob containing the schema for the passed content
 * @param {JSON} content A JSON blob to be modified to fit the passed schema
 */
export function enforceSchemaNoCheck(schema, content) {
  return enforceSchema(schema, content, false, true);
}

/**
 * Adds blank missing fields to a piece of content JSON, based on the fields present in the schema.
 * Throws an error if a field that is NOT in the schema is present in the content blob.
 *
 * Additionally, adds an empty table row for any object-tables.
 *
 * @param {JSON} schema A JSON blob containing the schema for the passed content
 * @param {JSON} content A JSON blob to be modified to fit the passed schema
 */
export function enforceSchemaWithTables(schema, content) {
  return enforceSchema(schema, content, true, false);
}

/**
 * Adds blank missing fields to a piece of content JSON, based on the fields present in the schema.
 * Throws an error if a field that is NOT in the schema is present in the content blob.
 *
 * @param {JSON} schema A JSON blob containing the schema for the passed content
 * @param {JSON} content A JSON blob to be modified to fit the passed schema
 * @param {boolean} skipSchemaCheck For development: skip checkSchema tests for test simplicity.
 */
export function enforceSchema(schema, content, addEmptyTableRows = false, skipSchemaCheck = false) {
  if (!skipSchemaCheck) checkSchema(schema);

  // Take a deep copy so we don't alter the original content object.
  const newContent = deepCopy(content);

  // First, check for fields in the content that are NOT present in the schema:
  _enforceSchemaCheckForIncorrectFields(schema, newContent);

  // Then, check for fields in the schema that need to be added to the content.
  return _enforceSchemaAddNewFields(schema, newContent, addEmptyTableRows);
}

/**
 * Checks the content JSON for incorrect keys or keys with incorrect values.
 * @private
 * @param {JSON} schema The schema JSON to observe.
 * @param {JSON} content The conent JSON to check.
 */
function _enforceSchemaCheckForIncorrectFields(schema, content) {
  const schemaKeys = Object.keys(schema).filter(_isNotInfoKey);
  Object.keys(content).forEach((val) => {
    // If a key is present in the content that is not present in the schema, throw an error.
    if (!schemaKeys.includes(val)) throw E100;

    // If a key is a different type than specified in the schema, throw an error.
    if (typeof content[val] !== typeof schema[val]) throw E101;

    // Recursive run for objects.
    if (isObject(content[val])) {
      _enforceSchemaCheckForIncorrectFields(content[val], schema[val]);
    }

    // Recursive runs for arrays of objects.
    if (isArray(content[val]) && content[val].every(isObject)) {
      content[val].forEach((obj) => {
        _enforceSchemaCheckForIncorrectFields(schema[val][0], obj);
      });
    }

    // Arrays can contain values or objects, not both.
    if (isArray(schema[val]) && schema[val].some(isObject) && schema[val].some(isValue)) throw E102;

    if (isArray(content[val]) && content[val].some(isObject) && content[val].some(isValue))
      throw E102;
  });
}

/**
 * Adds blank missing fields to all objects in the schema.
 * @private
 * @param {JSON} schema The schema JSON to observe.
 * @param {JSON} content The conent JSON to modify.
 */
function _enforceSchemaAddNewFields(schema, content, addEmptyTableRows = false) {
  const schemaKeys = Object.keys(schema).filter(_isNotInfoKey);
  const contentKeys = Object.keys(content);
  schemaKeys.forEach((key) => {
    // Values
    if (isValue(schema[key])) {
      if (!contentKeys.includes(key)) {
        // Include empty value.
        content[key] = '';
      }
    }

    // Objects
    if (isObject(schema[key])) {
      if (!contentKeys.includes(key)) content[key] = {};
      content[key] = _enforceSchemaAddNewFields(schema[key], content[key], addEmptyTableRows);
    }

    // Arrays of Objects
    if (isArray(schema[key]) && schema[key].every(isObject)) {
      if (!contentKeys.includes(key)) {
        content[key] = [];
      } else {
        // Ensure every object in the table matches the schema's first entry.
        const contentArray = content[key];
        const arraySchema = schema[key][0];
        for (let i = 0; i < contentArray.length; i++) {
          content[key][i] = _enforceSchemaAddNewFields(
            arraySchema,
            contentArray[i],
            addEmptyTableRows
          );
        }
      }

      // If the table is empty, add a key
      if (addEmptyTableRows && content[key].length === 0) {
        // Populate the row with an object if addEmptyTableRows is true.
        content[key].push({});
        _enforceSchemaAddNewFields(schema[key][0], content[key][0], addEmptyTableRows);
      }
    } else if (
      // If the array is empty/full of values, add it.
      isArray(schema[key]) &&
      (schema[key].every(isValue) || schema[key].length === 0)
    ) {
      if (!contentKeys.includes(key)) content[key] = [];
    }
  });
  return content;
}

/**
 * ===========================================================================
 *     Check Schema Function
 * ===========================================================================
 */

/**
 * Adds blank missing fields to a piece of content JSON, based on the fields present in the schema.
 * Throws an error if a field that is NOT in the schema is present in the content blob.
 *
 * @param {JSON} schema A JSON blob containing a rule schema.
 */
export function checkSchema(schema) {
  const allSchemaKeys = Object.keys(schema);
  const schemaKeys = allSchemaKeys.filter(_isNotInfoKey);

  // Every key must have a corresponding infoKey:
  schemaKeys.forEach((key) => {
    const infoKey = `__${key}`;
    if (!allSchemaKeys.includes(infoKey)) {
      throw E103 + `, missing InfoKey: ${infoKey}`;
    }

    if (isObject(schema[key])) {
      checkSchema(schema[key]);
    }

    // Arrays can contain values or objects, not both.
    if (isArray(schema[key]) && schema[key].some(isObject) && schema[key].some(isValue)) throw E102;

    if (isArray(schema[key]) && schema[key].every(isObject) && schema[key].length > 1) throw E104;
  });
}

/**
 * ===========================================================================
 *     Schema Helper Functions
 * ===========================================================================
 */

/**
 * Returns true if key does not start with double underscore, indicating an infoKey
 * @private
 * @param {String} key
 */
function _isNotInfoKey(key) {
  return !key.startsWith('__');
}
