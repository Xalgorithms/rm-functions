import { checkSchema, RuleSchema } from '../src';

test('Enforce XA JSON schema on primary rule schema', () => {
    checkSchema(RuleSchema);
});
