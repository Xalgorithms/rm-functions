import {
  generateNewRule,
  addNewCase,
  addNewInputCondition,
  prettyJSON,
  addNewOutputAssertion,
} from '../src';

test('Create a new rule. Ensure required data is present.', () => {
  const newRule = generateNewRule();

  expect(newRule.input_conditions[0].cases[0].case).toBe('A');
  expect(newRule.output_assertions[0].cases[0].case).toBe('A');
});

test('Ensure new cases are added correctly to each condition.', () => {
  const newRule = generateNewRule();

  const twoCases = addNewCase(newRule);
  expect(twoCases.input_conditions[0].cases[1].case).toBe('B');

  const threeCases = addNewCase(twoCases);
  expect(threeCases.input_conditions[0].cases[2].case).toBe('C');
  expect(threeCases.output_assertions[0].cases[2].case).toBe('C');
});

test('Ensure new input conditions are added correctly.', () => {
  const newRule = addNewCase(addNewCase(generateNewRule()));

  const twoConditions = addNewInputCondition(newRule);
  const threeConditions = addNewInputCondition(twoConditions);
  const oneMore = addNewOutputAssertion(threeConditions);

  console.log(prettyJSON(oneMore));

  expect(oneMore.input_conditions[2].cases[2].case).toBe('C');
  expect(oneMore.output_assertions[1].cases[2].case).toBe('C');
});
