import { generateNewRule, addNewCase } from '../src';

test('Create a new rule. Ensure required data is present.', () => {
  const newRule = generateNewRule();

  expect(newRule.input_conditions[0].cases[0].case).toBe('A');
  expect(newRule.output_assertions[0].cases[0].case).toBe('A');
});

test('Ensure new cases are added correctly.', () => {
  const newRule = generateNewRule();

  const twoCases = addNewCase(newRule);
  expect(twoCases.input_conditions[0].cases[1].case).toBe('B');

  const threeCases = addNewCase(twoCases);
  expect(threeCases.input_conditions[0].cases[2].case).toBe('C');
  expect(threeCases.output_assertions[0].cases[2].case).toBe('C');
});
