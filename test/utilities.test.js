import { enforceSchema } from '../src';
import { E100, E101 } from '../src/exceptions';

test('enforceSchema detects incorrect keys', () => {
    const schema = {
        a: 'Example of this thing.',
        b: 'Example of this thing.',
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

    expect(() => enforceSchema(schema, content)).toThrow(E101);
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

    expect(() => enforceSchema(schema, content)).toThrow(E100);
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

    expect(() => enforceSchema(schema, content)).toThrow(E100);
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

    const updatedContent = enforceSchema(schema, content);

    expect(updatedContent.a).toBe(content.a);
    expect(updatedContent.b).toBe('');
    expect(updatedContent.c).toBe('');
});
