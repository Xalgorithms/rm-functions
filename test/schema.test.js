import { checkSchema, RuleSchema, isObject, prettyJSON, enforceSchemaWithTables } from '../src';

test('Enforce XA JSON schema on primary rule schema', () => {
    checkSchema(RuleSchema);
});

test('Ensure all required fields are added to an empty rule.', () => {
    const emptyRule = {};
    const updatedRule = enforceSchemaWithTables(RuleSchema, emptyRule);
    console.log(prettyJSON(updatedRule));
    expect(isObject(updatedRule.metadata)).toBe(true);
});
