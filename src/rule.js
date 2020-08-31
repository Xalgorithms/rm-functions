import {
  enforceSchemaWithTables,
  generateCaseValue,
  RuleSchema,
  deepCopy,
  prettyJSON,
} from '../src';
import { enforceSchema } from './processing';

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

/**
 * Adds an input condition to the rule body.
 * @param {JSON} ruleInput
 */
export function addNewInputCondition(ruleInput) {
  const rule = deepCopy(ruleInput);
  const currentCases =
    rule.input_conditions[0].cases.length || rule.output_assertions[0].cases.length || 1;

  // Get the schema for cases.
  const ICCaseFormat = enforceSchemaWithTables(RuleSchema.input_conditions[0].cases[0], {});

  // Get the schema for input_conditions/output_assertions
  let ICFormat = enforceSchema(RuleSchema.input_conditions[0], {});

  for (let i = 0; i < currentCases; i++) {
    const c = deepCopy(ICCaseFormat);
    c.case = generateCaseValue(i);
    ICFormat.cases.push(c);
  }

  rule.input_conditions.push(deepCopy(ICFormat));
  return rule;
}

/**
 * Adds a new output assertion to the rule body.
 * @param {JSON} ruleInput
 */
export function addNewOutputAssertion(ruleInput) {
  const rule = deepCopy(ruleInput);
  const currentCases =
    rule.input_conditions[0].cases.length || rule.output_assertions[0].cases.length || 1;

  // Get the schema for cases.
  const OACaseFormat = enforceSchemaWithTables(RuleSchema.output_assertions[0].cases[0], {});

  // Get the schema for input_conditions/output_assertions
  const OAFormat = enforceSchema(RuleSchema.output_assertions[0], {});

  for (let i = 0; i < currentCases; i++) {
    const c = deepCopy(OACaseFormat);
    c.case = generateCaseValue(i);
    OAFormat.cases.push(c);
  }

  rule.output_assertions.push(deepCopy(OAFormat));
  return rule;
}
