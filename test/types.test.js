import { isObject, isArray, isTable, isValue, xaType, XA_TYPES } from '../src/types.js';

test('Ensure isTable interprets simple input correctly', () => {
  const object = { key: 123 };
  const value = 'hello';
  const number = 123;
  const array = ['1', 2];

  expect(isTable(object)).toBe(false);
  expect(isTable(value)).toBe(false);
  expect(isTable(number)).toBe(false);
  expect(isTable(array)).toBe(false);
});

test('Ensure isTable interprets input correctly', () => {
  const table1 = [
    { key1: 'value', key2: 123 },
    { key1: 'value', key2: 123 },
    { key1: 'value', key2: 123 },
  ];
  const table2 = [
    { key1: 'value', key2: 123, key3: 'value' },
    { key1: 'value', key3: 'value' },
    { key1: 'value', key2: 123 },
  ];

  // Test table examples:
  expect(isTable(table1)).toBe(true);
  expect(isTable(table2)).toBe(true);
});

test('Ensure isTable interprets incorrect input correctly', () => {
  const not_table1 = [
    { key1: 'value', key2: 123, key3: 'value' },
    { key1: 'value', key2: 123, key3: 'value' },
    { key1: 'value', key2: 123, key3: ['oh', 'no'] },
  ];
  const not_table2 = [
    { key1: 'value', key2: 123, key3: 'value' },
    { key1: 'value', key2: { value: 123 }, key3: 'value' },
    { key1: 'value', key2: 123, key3: 'value' },
  ];

  expect(isTable(not_table1)).toBe(false);
  expect(isTable(not_table2)).toBe(false);
});

test('Ensure isObject interprets input correctly', () => {
  const object = { key: 123 };
  const value = 'hello';
  const number = 123;
  const array = ['1', 2];

  expect(isObject(object)).toBe(true);
  expect(isObject(value)).toBe(false);
  expect(isObject(number)).toBe(false);
  expect(isObject(array)).toBe(false);
});

test('Ensure isArray interprets input correctly', () => {
  const object = { key: 123 };
  const value = 'hello';
  const number = 123;
  const array = ['1', 2];

  expect(isArray(object)).toBe(false);
  expect(isArray(value)).toBe(false);
  expect(isArray(number)).toBe(false);
  expect(isArray(array)).toBe(true);
});

test('Ensure isValue interprets input correctly', () => {
  const object = { key: 123 };
  const value = 'hello';
  const number = 123;
  const array = ['1', 2];

  expect(isValue(object)).toBe(false);
  expect(isValue(value)).toBe(true);
  expect(isValue(number)).toBe(true);
  expect(isValue(array)).toBe(false);
});

test('Ensure xaType interprets input correctly', () => {
  const object = { key: 123 };
  const value = 'hello';
  const number = 123;
  const array = ['1', 2];

  expect(xaType(object)).toBe(XA_TYPES.OBJECT);
  expect(xaType(value)).toBe(XA_TYPES.VALUE);
  expect(xaType(number)).toBe(XA_TYPES.VALUE);
  expect(xaType(array)).toBe(XA_TYPES.ARRAY);
});
