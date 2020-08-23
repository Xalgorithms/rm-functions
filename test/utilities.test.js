import { normalizeValue } from '../src';

test('Test normalizeValue with strings', () => {
  expect(normalizeValue('test')).toBe('test');
  expect(normalizeValue('1')).toBe(1);
  expect(normalizeValue('1')).toBe(1);
});
