import { processText, pathifyJSON } from '../src';

test('Process returns identical string', () => {
    const s = 'asdfjkl;';
    expect(processText(s)).toBe(s);
});

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
