# Xalgorithms Rule Processor Prototype

[![Build Status](https://travis-ci.org/RyanFleck/Xalgorithms-Rule-Processor-Prototype.svg?branch=master)](https://travis-ci.org/RyanFleck/Xalgorithms-Rule-Processor-Prototype)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Purpose

## Usage

### In Programs

The package can be installed with Yarn or NPM:

```sh
yarn add xalgo-rule-processor
npm i xalgo-rule-processor
```

Rules and tables can be passed to the exposed function:

```js
processRule(rules, tables);
```

### Testing

```
yarn test
```

### Publishing to NPM

```sh
npm login
npm publish
```

## A Minimal Example

This minimal example will introduce the user to how input is processed.

### Input

The following document is sent to the system.

```json
{}
```

### Rules

The following documents and tables are already present within the system.

```json
{}
```

```json
{}
```

### Output

The input and rules are given as parameters to the processing function. The
group of input, rules, and tables is known as the 'body' below:

1. Identify all tables that are present in the body.
2. Ensure all tables required by the rule are present in the set of tables.

```json
{}
```

## Sample System Run

This sample run is based on the
[Britannia Brewery](https://development.xalgorithms.org/thought_experiments/britannia_brewery/)
thought experiment.

An `input.xalgo` document takes the form of a blob of JSON data. For the
examples below, the following blob will be used.

Any structure in the JSON that is an array containing JSON objects with
key-value pairs will be considered a table by the system. Below, the only table
included in the input data is the table _items_.

Any structure in the JSON that ends in a value will be considered to be part of
the context.

All _short-term_ data is included with the rule. Data that is to be applied to
every incoming rule is considered _long term_ and, unless private, should be
included with the rule when uploaded.

```json
{
    "id": "38936c5e",
    "business": "breweries.canada.ottawa.britannia",
    "customer": {
        "id": "72cb5602",
        "address": {
            "street": "Main St",
            "number": "12",
            "city": "Ottawa",
            "subentity": {
                "name": "Ontario",
                "code": {
                    "value": "CA-ON",
                    "list_id": "ISO 3116-2",
                    "list_name": "Country Subentity",
                    "version_id": "20010914"
                }
            }
        }
    },
    "items": [
        {
            // 6 cans of 'The MSB' priced at 5.76CAD per 1 can
            "id": {
                "value": "1",
                "list_id": "britannia-stock-ids"
            },
            "description": "The MSB (6)",
            "quantity": {
                "value": 6,
                "unit": "can"
            },
            "pricing": {
                "price": {
                    "value": "5.76",
                    "currency_code": "CAD"
                },
                "quantity": {
                    "value": 1,
                    "unit": "can"
                }
            }
        },
        {
            // 12 cans of 'Eternally Hoptimistic' priced at 4.87CAD per 1 can
            "id": {
                "value": "3",
                "list_id": "britannia-stock-ids"
            },
            "description": "Eternally Hoptimistic (12)",
            "quantity": {
                "value": 12,
                "unit": "can"
            },
            "pricing": {
                "price": {
                    "value": "4.87",
                    "currency_code": "CAD"
                },
                "quantity": {
                    "value": 1,
                    "unit": "can"
                }
            }
        }
    ]
}
```

### A Rule is Uploaded

Rule

```json
{
    "path": "ior://pub.ottawa.britannia.delivery-policy",
    "metadata": {},
    "requirements": {
        "context": {
            "time": {
                "timezone": "UTC-05:00",
                "start": "2020-01-01 00:00",
                "end": null
            },
            "business": "ior://breweries.canada.ottawa.britannia"
        },
        "fields": [
            {
                "field_name": "id",
                "field_path": "id",
                "field_standard": "database.sql.id"
            }
        ],
        "tables": {
            "items": ["id", "description", "quantity", "pricing"]
        }
    },
    "input-conditions": [
        {
            "context": {},
            "cases": {
                "A": "T",
                "B": "T",
                "C": "T",
                "D": "T",
                "E": "T",
                "F": "T"
            }
        }
    ],
    "output-assertions": [],
    "standards": {}
}
```

Proper table input:

```json
{
    "Table": {
        "Metadata": {
            "path": "gov.sg.iras.rules.absd.tables."
        },
        "Data": [
            { "a": 1, "b": 2 },
            { "a": 2, "b": 4 },
            { "a": 3, "b": 6 }
        ]
    }
}
```
