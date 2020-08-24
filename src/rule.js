import {
  enforceSchemaWithTables,
  generateCaseValue,
  RuleSchema,
  deepCopy,
  prettyJSON,
} from '../src';

/**
 * Generates a new rule, taking care to add presets where necessary.
 */
export function generateNewRule() {
  // Get a new blank rule by enforcing the rule schema on an empty object.
  const rule = enforceSchemaWithTables(RuleSchema, {});

  // Ensure empty cases are pre-filled with the correct letter.
  rule.input_conditions[0].cases[0].case = generateCaseValue(0);
  rule.output_assertions[0].cases[0].case = generateCaseValue(0);

  // Finally, return the rule.
  return rule;
}

/**
 * Adds a new i/o case to the rule JSON.
 * @param {JSON} ruleInput the rule.
 * @returns The modified rule JSON.
 */
export function addNewCase(ruleInput) {
  const rule = deepCopy(ruleInput);

  // Get the schema for cases.
  const ICCaseFormat = enforceSchemaWithTables(RuleSchema.input_conditions[0].cases[0], {});
  const OACaseFormat = enforceSchemaWithTables(RuleSchema.output_assertions[0].cases[0], {});

  // Get correct parameters from first case of input_conditions.
  const currentCases = rule.input_conditions[0].cases.length;
  const newCaseNumber = currentCases;
  const newCaseID = generateCaseValue(newCaseNumber);
  ICCaseFormat.case = newCaseID;
  OACaseFormat.case = newCaseID;

  rule.input_conditions.map((condition, index) => {
    // For every condition, first check that the number of cases matches currentCases.
    if (condition.cases.length !== currentCases) {
      throw Error('A condition in input_conditions has an incorrect number of cases.');
    }
    condition.cases.push(ICCaseFormat);
    return condition;
  });

  rule.output_assertions.map((condition, index) => {
    // For every condition, first check that the number of cases matches currentCases.
    if (condition.cases.length !== currentCases) {
      throw Error('A condition in input_conditions has an incorrect number of cases.');
    }
    condition.cases.push(OACaseFormat);
    return condition;
  });

  return rule;
}
