# Xalgorithms Rule Processor Prototype

[![Build Status](https://travis-ci.com/RyanFleck/Xalgorithms-Rule-Processor-Prototype.svg?token=etWmvYVue86yTwPL2RCa&branch=master)](https://travis-ci.com/RyanFleck/Xalgorithms-Rule-Processor-Prototype)
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

## Sample Input

Proper table input:

```json
{
    "Table": {
        "data": [
            { "a": 1, "b": 2 },
            { "a": 2, "b": 4 },
            { "a": 3, "b": 6 }
        ]
    }
}
```

Proper rule input:

```json
{
    "Rule": {
        "Metadata": {
            "Rule": {
                "id": "r6qW2UeKE5hq",
                "version": "0.3.0",
                "criticality": "experimental",
                "url": "https://www.iras.gov.sg/IRASHome/Other-Taxes/Stamp-Duty-for-Property/Working-out-your-Stamp-Duty/Buying-or-Acquiring-Property/What-is-the-Duty-that-I-Need-to-Pay-as-a-Buyer-or-Transferee-of-Residential-Property/Additional-Buyer-s-Stamp-Duty--ABSD-"
            },
            "RuleMaker": {
                "Entity": {
                    "name": "Inland Revenue Authority of Singapore",
                    "url": "https://www.iras.gov.sg",
                    "id": "gov.sg.iras"
                },
                "Managers": ["jpotvin.solid.community/profile/card#me"],
                "Authors": [
                    "jpotvin.solid.community/profile/card#me",
                    "ryanfleck.solid.community/profile/card#me"
                ]
            },
            "Xalgorithms-Engine": {
                "version": "0.5.0 Tabular Alpha"
            }
        },
        "Input": {
            "Sources": {},
            "Context": {},
            "Filters": {},
            "Conditions": {}
        },
        "Output": {
            "Assertions": {},
            "Purpose": {},
            "Weight": {}
        },
        "Standards": [
            {
                "fields": ["parties.buyer.industry"],
                "title": {
                    "concise": "",
                    "full": ""
                },
                "url": ""
            },
            {
                "fields": ["item.classification"],
                "title": {
                    "concise": "",
                    "full": ""
                },
                "url": ""
            },
            {
                "fields": ["purchaseorder", "invoice", "creditnote"],
                "title": {
                    "concise": "",
                    "full": ""
                },
                "url": ""
            }
        ]
    }
}
```
