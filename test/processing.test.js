import {
  enforceSchema,
  enforceSchemaNoCheck,
  enforceSchemaWithTables,
  checkSchema,
  pathifyJSON,
  isArray,
  E100,
  E101,
  E102,
  E103,
  E104,
  generateNewRule,
  RuleSchema,
} from '../src';

/**
 * Tests for enforceSchema
 * ========================================================================
 */

test('enforceSchema detects incorrect keys', () => {
  const schema = {
    a: 'Example of this thing.',
    __a: 'Thing info',
    b: 'Example of this thing.',
    __b: 'B thing info',
  };

  const content = {
    a: "I'm a monster, not a hero",
    n: "But I'll make it on my own",
  };

  expect(() => enforceSchema(schema, content)).toThrow(E100);
});

test('enforceSchema detects keys with incorrect values', () => {
  const schema = {
    a: 'Example of this thing.',
    b: 'Example of this thing.',
  };

  const content = {
    a: "I'm a monster, not a hero",
    b: ["But I'll make it on my own"],
  };

  expect(() => enforceSchemaNoCheck(schema, content)).toThrow(E101);
});

test('enforceSchema detects embedded incorrect keys', () => {
  const schema = {
    a: 'Example of this thing.',
    b: {
      c: 'Example of this thing.',
      d: 'Example of this thing.',
    },
  };

  const content = {
    a: 'They think they know it all',
    b: {
      c: "I'm a nightmare",
      wrong: 'a disaster',
    },
  };

  expect(() => enforceSchemaNoCheck(schema, content)).toThrow(E100);
});

test('enforceSchema detects embedded and tabular incorrect keys', () => {
  const schema = {
    a: 'Example of this thing.',
    b: [
      {
        c: 'Example of this thing.',
        d: 'Example of this thing.',
      },
    ],
  };

  const content = {
    a: 'They think they know it all',
    b: [
      {
        c: "I'm a nightmare",
        d: 'a disaster',
      },
      {
        c: "that's what they",
        wrong: 'always said',
      },
    ],
  };

  expect(() => enforceSchemaNoCheck(schema, content)).toThrow(E100);
});

test('enforceSchema dislikes mixed arrays', () => {
  const schema = {
    b: [
      'Value',
      {
        c: 'Example of this thing.',
        d: 'Example of this thing.',
      },
    ],
  };

  const content = {
    b: ['Test', 'Things'],
  };

  expect(() => enforceSchemaNoCheck(schema, content)).toThrow(E102);
});

test('enforceSchema adds keys to the content', () => {
  const schema = {
    a: 'Example of this thing.',
    b: 'Example of this thing.',
    c: 'Example of this thing.',
  };

  const content = {
    a: "I'm a monster, not a hero",
  };

  const updatedContent = enforceSchemaNoCheck(schema, content);
  expect(updatedContent.a).toBe(content.a);
  expect(updatedContent.b).toBe('');
  expect(updatedContent.c).toBe('');
});

test('enforceSchema adds keys within objects to the content', () => {
  const schema = {
    c: 'Test',
    a: {
      b: 'Neato',
      d: {
        e: {
          f: 'Burrito',
        },
      },
    },
  };

  const content = {
    c: 'Thrice',
  };

  const updatedContent = enforceSchemaNoCheck(schema, content);
  expect(updatedContent.a.b).toBe('');
  expect(updatedContent.a.d.e.f).toBe('');
});

test('enforceSchema adds new keys to each row in a table.', () => {
  const schema = {
    a: 'Topic',
    b: 'Date',
    c: [
      {
        a: 'Event',
        b: 'Detail',
        c: ['neato', 'burrito'],
        d: "Can't touch this.",
        e: {
          a: 'look',
          b: 'a sub-object',
          c: 'how cool',
        },
      },
    ],
  };

  const content = {
    a: 'Topic',
    b: 'Date',
    c: [
      {
        a: 'Event',
        b: 'Detail',
        c: ['neato', 'burrito'],
      },
      {
        a: 'Event',
        b: 'Detail',
        c: ['neato', 'burrito'],
      },
      {
        a: 'Event',
        b: 'Detail',
        c: ['neato', 'burrito'],
      },
    ],
  };

  const updatedContent = enforceSchemaNoCheck(schema, content);
  [0, 1, 2].forEach((x) => {
    expect(updatedContent.c[x].d).toBe('');
    expect(updatedContent.c[x].e.a).toBe('');
  });
});

test('enforceSchema does not add any info keys.', () => {
  const schema = {
    a: 'Topic',
    __a: 'Param a info',
    b: 'Date',
    c: [
      {
        a: 'Event',
        __a: 'Param a info',
        b: 'Detail',
        c: ['neato', 'burrito'],
        __a: 'Param a info',
        d: "Can't touch this.",
        e: {
          a: 'look',
          __a: 'Param a info',
          b: 'a sub-object',
          c: 'how cool',
        },
      },
    ],
  };

  const content = {
    a: 'Topic',
    b: 'Date',
    c: [
      {
        a: 'Event',
        b: 'Detail',
        c: ['neato', 'burrito'],
      },
      {
        a: 'Event',
        b: 'Detail',
        c: ['neato', 'burrito'],
      },
      {
        a: 'Event',
        b: 'Detail',
      },
    ],
  };

  const updatedContent = enforceSchemaNoCheck(schema, content);
  expect(updatedContent.__a).toBe(undefined);
  expect(updatedContent.c[0].__a).toBe(undefined);
  expect(updatedContent.c[0].e.__a).toBe(undefined);
});

test('enforceSchema populates empty tables.', () => {
  const schema = {
    a: 'Topic',
    __a: 'Param a info',
    b: 'Date',
    __b: 'Param b info',
    c: [
      {
        a: 'Event',
        __a: 'Param a info',
        b: 'Detail',
        __b: 'Param b info',
        c: ['neato', 'burrito'],
        __c: 'Param c info',
        d: "Can't touch this.",
        __d: 'Param d info',
        e: {
          a: 'look',
          __a: 'Param a info',
          b: 'a sub-object',
          __b: 'Param b info',
          c: 'how cool',
          __c: 'Param c info',
        },
      },
    ],
    __c: 'Param c info',
    d: [{ a: 'Field content', __a: 'Field a info' }],
    __d: 'Table d info',
  };

  const content = {
    a: 'Topic',
    b: 'Date',
    c: [],
  };

  const updatedContent = enforceSchemaWithTables(schema, content);
  expect(updatedContent.__a).toBe(undefined);
  expect(updatedContent.c[0].a).toBe('');
  expect(updatedContent.c[0].e.a).toBe('');
  expect(updatedContent.d[0].a).toBe('');
  expect(isArray(updatedContent.c[0].c)).toBe(true);
});

test('enforceSchema populates empty rule with all required fields.', () => {
  const content = generateNewRule();
  // This should not throw any errors.
  const updatedContent = enforceSchemaWithTables(RuleSchema, content);
});

/**
 * Tests for checkSchema
 * ========================================================================
 */

test('checkSchema detects missing InfoKeys', () => {
  const schema = {
    a: 'Example of this thing.',
    __a: 'Thing info',
    b: 'Example of this thing.',
  };

  expect(() => checkSchema(schema)).toThrow(E103);
});

test('checkSchema detects deep missing InfoKeys', () => {
  const schema = {
    a: { b: { c: { d: 'No info on this one.' }, __c: 'c info' }, __b: 'B info' },
    __a: 'a info',
  };

  expect(() => checkSchema(schema)).toThrow(E103);
});

test('checkSchema detects table schema with more than one defined object', () => {
  const schema = {
    a: [
      {
        b: 'This is a field',
        __b: 'Field info',
      },
      {
        c: 'This is a field',
        __c: 'Field info',
      },
    ],
    __a: 'A table',
  };

  expect(() => checkSchema(schema)).toThrow(E104);
});
/**
 * Tests for pathifyJSON
 * ========================================================================
 */

test('Pathify sets variable correctly.', () => {
  const document = {
    a: {
      b: {
        c: 'content string',
      },
    },
  };

  const blob = pathifyJSON(document);
  expect(blob.values['a.b.c']).toBe(document.a.b.c);
});

test('Pathify sets multiple variables correctly.', () => {
  const document = {
    a: {
      c: 'content',
      b: {
        c: 'content string',
        d: 'content string',
        e: 'content string',
      },
    },
  };

  const blob = pathifyJSON(document);

  expect(blob.values['a.c']).toBe(document.a.c);
  expect(blob.values['a.b.c']).toBe(document.a.b.c);
  expect(blob.values['a.b.d']).toBe(document.a.b.c);
  expect(blob.values['a.b.e']).toBe(document.a.b.c);
});

test('Pathify grabs tables correctly, simple example.', () => {
  const document = {
    Table: {
      Metadata: {
        path: 'gov.sg.iras.rules.absd.tables',
      },
      Data: [
        { a: 1, b: 2 },
        { a: 2, b: 4 },
        { a: 3, b: 6 },
      ],
    },
  };

  const blob = pathifyJSON(document);

  expect(blob.values['Table.Metadata.path']).toStrictEqual(document.Table.Metadata.path);
  expect(blob.tables['Table.Data']).toStrictEqual(document.Table.Data);
});

test('Pathify grabs tables correctly, complex example.', () => {
  const document = {
    id: '38936c5e',
    business: {
      id: 'breweries.canada.ottawa.britannia',
      address: {
        street: 'Lager St',
        number: '19',
        city: 'Ottawa',
      },
      brews: ['house lager', 'house ale', 'saskatchewan fog'],
    },
    customer: {
      id: '72cb5602',
      address: {
        street: 'Main St',
        number: '12',
        city: 'Ottawa',
        subentity: {
          name: 'Ontario',
          code: {
            value: 'CA-ON',
            list_id: 'ISO 3116-2',
            list_name: 'Country Subentity',
            version_id: '20010914',
          },
        },
      },
    },
    items: [
      {
        id: {
          value: '1',
          list_id: 'britannia-stock-ids',
        },
        description: 'The MSB (6)',
        quantity: {
          value: 6,
          unit: 'can',
        },
        pricing: {
          price: {
            value: '5.76',
            currency_code: 'CAD',
          },
          quantity: {
            value: 1,
            unit: 'can',
          },
        },
      },
      {
        id: {
          value: '3',
          list_id: 'britannia-stock-ids',
        },
        description: 'Eternally Hoptimistic (12)',
        quantity: {
          value: 12,
          unit: 'can',
        },
        pricing: {
          price: {
            value: '4.87',
            currency_code: 'CAD',
          },
          quantity: {
            value: 1,
            unit: 'can',
          },
        },
      },
    ],
  };

  const blob = pathifyJSON(document);
  expect(blob.values['customer.address.city']).toBe('Ottawa');
  expect(blob.values['business.brews']).toStrictEqual([
    'house lager',
    'house ale',
    'saskatchewan fog',
  ]);
  expect(blob.tables['items'][0]['id.value']).toBe(1);
});
