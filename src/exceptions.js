/**
 * @file
 *
 * Contains a set of exception constants that are thrown at various points in execution.
 */

export const E100 = 'The content includes a key that is not part of the schema';
export const E101 = 'Detected a content key with a value type that does not match the schema';
export const E102 = 'Arrays may contain objects or values, but not both';
export const E103 = 'Schema key does not have a corresponding infoKey, add __keyname for keyname';
export const E104 = 'Schema tables must have only one schema object in them.';
