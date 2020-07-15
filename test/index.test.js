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
    console.log(JSON.stringify(blob, null, 2));

    expect(blob.values['customer.address.city']).toBe('Ottawa');
    expect(blob.values['business.brews']).toStrictEqual([
        'house lager',
        'house ale',
        'saskatchewan fog',
    ]);
    expect(blob.tables['items'][0]['id.value']).toBe('1');
});
