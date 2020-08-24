import { normalizeValue, generateCaseValue, generateCaseValueFromPrev } from '../src';

test('Test normalizeValue with strings', () => {
  expect(normalizeValue('test')).toBe('test');
  expect(normalizeValue('1')).toBe(1);
  expect(normalizeValue('1')).toBe(1);
});

test('Ensure case values are generated correctly', () => {
  expect(generateCaseValue(0)).toBe('A');
  expect(generateCaseValue(1)).toBe('B');
  expect(generateCaseValue(25)).toBe('Z');
  expect(generateCaseValue(26)).toBe('1A');
  expect(generateCaseValue(27)).toBe('1B');
});

test('Ensure case values are generated correctly', () => {
  expect(generateCaseValueFromPrev('A')).toBe('B');
  expect(generateCaseValueFromPrev('B')).toBe('C');
  expect(generateCaseValueFromPrev('Z')).toBe('1A');
  expect(generateCaseValueFromPrev('1A')).toBe('1B');
});
