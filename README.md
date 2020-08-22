# Xalgorithms Rule Processor Functions

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)


<br />

## Purpose

A library with utilities for processing blobs of input data and running the
input data against rule blobs.

Also includes a selection of useful utilities for processing JSON and enforcing the XA
rule schema on blobs of JSON.

<br />

## Usage

This library is intended for use in both frontend and backend environments, in
situations where XA rule processing is required.

**Full documentation** can be found at <https://xalgo-rule-processor.netlify.app/>

### In Programs

The package can be installed with Yarn or NPM:

```sh
yarn add xalgo-rule-processor
npm i xalgo-rule-processor
```

```js
import { prettyJSON, processRule } from 'xalgo-rule-processor';

console.log(prettyJSON(theme));

// This specific fuction is currently in development.
processRule(rules, tables);
```

### Testing

```sh
yarn test

# Alternatively, watch for changes
yarn test --watch
```

### Publishing to NPM

```sh
npm login
npm publish
```

<br />

<br />

<br />

<br />

<br />

<br />

<br />

<br />

# Notes & Incomplete Alpha Documentation

## A Minimal Example

This minimal example will introduce the user to how input is processed.

**Section incomplete.**

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

## Sample Input: Britannia Tables

### Delivery

![delivery program table](/docs/britannia.delivery.png)

As JSON:

```json
{}
```

### Anniversary

![anniversary program table](/docs/britannia.anniversary.png)

As JSON:

```json
{}
```

### Loyalty

![loyalty program table](/docs/britannia.loyalty.png)

As JSON:

```json
{}
```

<br />

<br />

<br />

<br />

# Deprecated: Expanded Table Processing System

These cases with `operations` fields for processing tables are potentially to be
included in the future, but for now are **out of scope**.

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

Every table requirement without a path will be interpreted as an _input requirement_ and,
when rules are being found, accompanying tables with the following parameters will be required.

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

### Step One: Rules Are Uploaded

#### Rule One: Delivery Options

Britannia offers several delivery options for customers, including local delivery. These are the criteria for their delivery options:

-   Local Delivery: If the order is to be delivered in Ottawa, then local delivery is available at a flat rate of 15\$.
-   Free local delivery: If a buyer spends 60\$ before tax or orders 24 or more cans, then local delivery is free.
-   Canada Post: Orders can be delivered anywhere in Ontario using Canada Post. The rate is 6\$ per 12 cans.

The website for the brewery is available worldwide, without geofencing. All buyers are welcome, but regulations require that only Ontario, Canada deliveries are permitted.

The brewery wants to present all available options to customers. If they qualify for more than one delivery method, they should be able to choose.

```json
{
    "path": "ior://pub.ottawa.britannia.delivery-options",
    "metadata": {},
    "requirements": {
        "context": {
            "time": {
                "timezone": "UTC-04:00",
                "start": "2020-01-01T00:00:00-04:00",
                "end": null
            },
            "business": "canada.ottawa.breweries.britannia"
        },
        "fields": [
            {
                "reference": "city",
                "path": "input.values.customer.address.city",
                "standard": "fake_standard.canada.ca-on.cities"
            },
            {
                "reference": "province",
                "path": "input.values.customer.address.subentity.code.value",
                "standard": "ISO.3116-2"
            }
        ],
        "tables": [
            {
                "reference": "items",
                "probable_path": "input.tables.items",
                "columns": ["id", "quantity.value", "pricing.price.value", "pricing.quantity.value"]
            }
        ]
    },
    "input-conditions": [
        {
            "context": {
                "explanation": "The customer is in the City of Ottawa",
                "condition": {
                    "value": "city",
                    "operation": "equal-to",
                    "input": "Ottawa"
                }
            },
            "cases": {
                "A": "T",
                "B": "T",
                "C": "F"
            }
        },
        {
            "context": {
                "explanation": "Order subtotal is >$60",
                "operations": [
                    {
                        "type": "row",
                        "operation": "divide",
                        "table": "items",
                        "new-column-name": "price-per-quant",
                        "input": ["quantity.value", "pricing.quantity.value"]
                    },
                    {
                        "type": "row",
                        "operation": "multiply",
                        "table": "items",
                        "new-column-name": "cost-of-pack",
                        "input": ["quantity.value", "pricing.quantity.value"]
                    },
                    {
                        "type": "column",
                        "operation": "sum",
                        "new-value-name": "calculated.items.subtotal",
                        "table": "items",
                        "input": ["cost-of-pack"]
                    }
                ],
                "conditions": [
                    {
                        "value": "calculated.items.subtotal",
                        "operation": "greater-than",
                        "input": 60
                    }
                ]
            },
            "cases": {
                "A": "F",
                "B": "T",
                "C": "X"
            }
        },
        {
            "context": {
                "explanation": "Customer is in the Province of Ontario",
                "conditions": [
                    {
                        "value": "province",
                        "operation": "equal-to",
                        "input": "CA-ON"
                    }
                ]
            },
            "cases": {
                "A": "T",
                "B": "T",
                "C": "T"
            }
        }
    ],
    "output-assertions": [
        {
            "context": {
                "assertion": "Local delivery is available for $15."
            },
            "cases": {
                "A": "T",
                "B": "F",
                "C": "F"
            }
        },
        {
            "context": {
                "assertion": "Local delivery is available for free."
            },
            "cases": {
                "A": "F",
                "B": "T",
                "C": "F"
            }
        },
        {
            "context": {
                "assertion": "Your order can be delivered for $6 per 12 cans, which comes to {{calculated.order-total-shipping-cost}}.",
                "operations": [
                    {
                        "type": "column",
                        "operation": "sum",
                        "new-value-name": "calculated.items.total-quantity",
                        "table": "items",
                        "input": ["quantity.value"]
                    },
                    {
                        "type": "value",
                        "operation": "multiply",
                        "new-value-name": "calculated.order-total-shipping-cost",
                        "input": ["calculated.items.total-quantity", 6]
                    }
                ]
            },
            "cases": {
                "A": "T",
                "B": "F",
                "C": "F"
            }
        }
    ],
    "standards": [
        {
            "path": ["requirements.context.time.start", "requirements.context.time.end"],
            "standard": "ISO 8601"
        }
    ]
}
```

#### Rule Two: Anniversary Party

This is an example of a promotional rule that Britannia ran on their fifth anniversary.

-   All orders receive 2 brewery branded coasters.
-   Orders over 20\$ get a pint glass.
-   Orders over 50\$ get an anniversary t-shirt.
-   Orders over 100\$ get 2 pint glasses and the t-shirt.

This promotion was active from 2020 June 12 - 19.

\*In this example, notice the operations section included after the requirements. The calculations performed here will be made available to all the operations performed after this point.

```json
{
    "path": "pub.ottawa.britannia.anniversary-party",
    "metadata": {},
    "requirements": {
        "context": {
            "time": {
                "timezone": "UTC-04:00",
                "start": "2020-01-01T00:00:00-04:00",
                "end": null
            },
            "business": "canada.ottawa.breweries.britannia"
        },
        "fields": [
            {
                "reference": "city",
                "path": "input.values.customer.address.city",
                "standard": "fake_standard.canada.ca-on.cities"
            }
        ],
        "tables": [
            {
                "reference": "items",
                "probable_path": "input.tables.items",
                "columns": ["id", "quantity.value", "pricing.price.value", "pricing.quantity.value"]
            }
        ]
    },
    "operations": [
        {
            "type": "row",
            "operation": "divide",
            "table": "items",
            "input": ["quantity.value", "pricing.quantity.value"],
            "new-column-name": "price-per-quant"
        },
        {
            "type": "row",
            "operation": "multiply",
            "table": "items",
            "input": ["quantity.value", "pricing.quantity.value"],
            "new-column-name": "cost-of-pack"
        },
        {
            "type": "column",
            "operation": "sum",
            "table": "items",
            "input": ["cost-of-pack"],
            "new-value-name": "calculated.items.subtotal"
        }
    ],
    "input-conditions": [
        {
            "context": {
                "explanation": "The order exists"
            },
            "cases": {
                "A": "T",
                "B": "T",
                "C": "T",
                "D": "T"
            }
        },
        {
            "context": {
                "explanation": "Order subtotal is >$60",
                "conditions": [
                    {
                        "value": "calculated.items.subtotal",
                        "operation": "greater-than",
                        "input": 60
                    }
                ]
            },
            "cases": {
                "A": "F",
                "B": "T",
                "C": "X"
            }
        },
        {
            "context": {
                "explanation": "Customer is in the Province of Ontario",
                "conditions": [
                    {
                        "value": "province",
                        "operation": "equal-to",
                        "input": "CA-ON"
                    }
                ]
            },
            "cases": {
                "A": "T",
                "B": "T",
                "C": "T"
            }
        }
    ],
    "output-assertions": [
        {
            "context": {
                "assertion": "Local delivery is available for $15."
            },
            "cases": {
                "A": "T",
                "B": "F",
                "C": "F"
            }
        },
        {
            "context": {
                "assertion": "Local delivery is available for free."
            },
            "cases": {
                "A": "F",
                "B": "T",
                "C": "F"
            }
        },
        {
            "context": {
                "assertion": "Your order can be delivered for $6 per 12 cans, which comes to {{order-total-shipping-cost}}.",
                "operations": [
                    {
                        "operation": "column-sum",
                        "new-value-name": "calculated.items.total-quantity",
                        "table": "items",
                        "input": ["quantity.value"]
                    },
                    {
                        "operation": "value-multiply",
                        "new-value-name": "order-total-shipping-cost",
                        "input": ["calculated.items.total-quantity", 6]
                    }
                ]
            },
            "cases": {
                "A": "T",
                "B": "F",
                "C": "F"
            }
        }
    ],
    "standards": [
        {
            "path": ["requirements.context.time.start", "requirements.context.time.end"],
            "standard": "ISO 8601"
        }
    ]
}
```

#### Rule Three: Loyalty Promotion

This was a loyalty promotion that featured some new styles of beer that the brewery was offering. It was offered from 2020 June - July.

-   To promote a new West Coast IPA, if the buyer had ordered beers that had a sum of greater then 300 IBU in the promotional period, then they got a “Bitter is Best” t-shirt.

-   To promote their new British Porter, if the buyer had ordered more than 2 dozen cans of their english style range in the last 6 months, they get a promotional pint glass with a stylized “Dominion of Canada” brewery logo designed by a local artist. There must be at least 4 cans of the new porter in the qualifying order (The new porter is The Darkness in the sample data below).

In each of these loyalty offerings, the current order was considered as part of the total tally.

This example is currently **incomplete**.

```json
{
    "path": "pub.ottawa.britannia.loyalty-promotion",
    "metadata": {},
    "requirements": {
        "context": {
            "time": {
                "timezone": "UTC-04:00",
                "start": "2020-06-01T00:00:00-04:00",
                "end": "2020-08-01T00:00:00-04:00"
            },
            "business": "canada.ottawa.breweries.britannia"
        },
        "fields": [
            {
                "reference": "customer.id",
                "path": "input.values.customer.id"
            }
        ],
        "tables": [
            {
                "reference": "orders",
                "probable_path": "input.tables.orders",
                "columns": ["id", "name", "stock_id", "order_id", "quantity", "order_date"],
                "note": "This input table must contain the order history of all customers."
            },
            {
                "reference": "items",
                "probable_path": "input.tables.items",
                "columns": ["id.value", "quantity.value"],
                "note": "This input table must contain the items in the current order."
            },
            {
                "reference": "brews",
                "path": "pub.ottawa.britannia.brew-information",
                "columns": ["id", "name", "family", "style", "IBU"],
                "note": "This IOR table contains the Britannia brewing beer collection."
            }
        ]
    },
    "operations": [
        "Note: does this entire thing come down to map-filter-reduce? Three ops?",
        {
            "note": "Reduces the orders table into the orders from the current customer.",
            "type": "table",
            "operation": "filter",
            "table": "orders",
            "column": "id",
            "operation": "equals",
            "parameter": "customer.id",
            "new-table-name": "customer-orders"
        },
        {
            "note": "Returns the cross product of the customer-orders and brews table.",
            "type": "table",
            "operation": "combine",
            "match-column": true,
            "tables": ["customer-orders", "brews"],
            "conflict-action": "prepend-table-name",
            "new-table-name": "customer-orders-with-brews"
        },
        "Note: ability to remove and rename columns?",
        {
            "note": "Filters the customer-orders-with-brews table down to match brews with orders.",
            "type": "table",
            "operation": "filter",
            "table": "orders",
            "column": "stock_id",
            "operation": "equals",
            "parameter": "brews.id",
            "new-table-name": "customer-orders"
        },
        {
            "note": "Reduces the orders table into the orders from the current customer.",
            "type": "table",
            "operation": "filter",
            "table": "orders",
            "column": "id",
            "operation": "equals",
            "parameter": "customer.id",
            "new-table-name": "customer-orders"
        },
        {
            "note": "",
            "type": "row",
            "operation": "multiply",
            "table": "items",
            "input": ["quantity.value", "pricing.quantity.value"],
            "new-column-name": "price-per-quant"
        },
        {
            "note": "",
            "type": "row",
            "operation": "multiply",
            "table": "items",
            "input": ["quantity.value", "pricing.quantity.value"],
            "new-column-name": "cost-of-pack"
        },
        {
            "note": "",
            "type": "column",
            "operation": "sum",
            "table": "items",
            "input": ["cost-of-pack"],
            "new-value-name": "calculated.items.subtotal"
        }
    ],
    "input-conditions": [
        {
            "context": {
                "explanation": "The order exists"
            },
            "cases": {
                "A": "T",
                "B": "T",
                "C": "T",
                "D": "T"
            }
        },
        {
            "context": {
                "explanation": "Order subtotal is >$60",
                "conditions": [
                    {
                        "value": "calculated.items.subtotal",
                        "operation": "greater-than",
                        "input": 60
                    }
                ]
            },
            "cases": {
                "A": "F",
                "B": "T",
                "C": "X"
            }
        },
        {
            "context": {
                "explanation": "Customer is in the Province of Ontario",
                "conditions": [
                    {
                        "value": "province",
                        "operation": "equal-to",
                        "input": "CA-ON"
                    }
                ]
            },
            "cases": {
                "A": "T",
                "B": "T",
                "C": "T"
            }
        }
    ],
    "output-assertions": [
        {
            "context": {
                "assertion": "Local delivery is available for $15."
            },
            "cases": {
                "A": "T",
                "B": "F",
                "C": "F"
            }
        },
        {
            "context": {
                "assertion": "Local delivery is available for free."
            },
            "cases": {
                "A": "F",
                "B": "T",
                "C": "F"
            }
        },
        {
            "context": {
                "assertion": "Your order can be delivered for $6 per 12 cans, which comes to {{order-total-shipping-cost}}.",
                "operations": [
                    {
                        "operation": "column-sum",
                        "new-value-name": "calculated.items.total-quantity",
                        "table": "items",
                        "input": ["quantity.value"]
                    },
                    {
                        "operation": "value-multiply",
                        "new-value-name": "order-total-shipping-cost",
                        "input": ["calculated.items.total-quantity", 6]
                    }
                ]
            },
            "cases": {
                "A": "T",
                "B": "F",
                "C": "F"
            }
        }
    ],
    "standards": [
        {
            "path": ["requirements.context.time.start", "requirements.context.time.end"],
            "standard": "ISO 8601"
        }
    ]
}
```

The following table will be submitted as part of the input:

```json
{
    "orders": [
        {
            "id": "27eb11cd",
            "name": "Laverne De Fazio",
            "stock_id": 1,
            "stock_name": "Dirty Summer Blonde",
            "order_id": "d4af0131",
            "quantity": 12,
            "order_date": "2020-06-13T00:30:24-04:00"
        },
        {
            "id": "675b70ec",
            "name": "Shirley Feeney",
            "stock_id": 3,
            "stock_name": "Eternally Hoptimistic",
            "order_id": "3b9e255d",
            "quantity": 24,
            "order_date": "2020-06-13T00:30:24-04:00"
        },
        {
            "id": "6bc91ad2",
            "name": "Leonard Kosnowski",
            "stock_id": 2,
            "stock_name": "Britannia Amber Rose",
            "order_id": "0e3b047d",
            "quantity": 48,
            "order_date": "2020-06-13T00:30:24-04:00"
        },
        {
            "id": "72cb5602",
            "name": "Andrew Squiggman",
            "stock_id": 5,
            "stock_name": "The Notorious M.S.B.",
            "order_id": "38936c5e",
            "quantity": 6,
            "order_date": "2020-06-13T00:30:24-04:00"
        },
        {
            "id": "72cb5602",
            "name": "Andrew Squiggman",
            "stock_id": 3,
            "stock_name": "Eternally Hoptimistic",
            "order_id": "38936c5e",
            "quantity": 12,
            "order_date": "2020-06-13T00:30:24-04:00"
        },
        {
            "id": "72cb5602",
            "name": "Andrew Squiggman",
            "stock_id": 7,
            "stock_name": "Shed No Tears",
            "order_id": "95475c5c",
            "quantity": 12,
            "order_date": "2020-06-13T00:30:24-04:00"
        }
    ]
}
```

The following table will be submitted _with_ the rule:

```json
{
    "Table": {
        "Metadata": {
            "path": "pub.ottawa.britannia.brew-information"
        },
        "Data": [
            {
                "id": 1,
                "name": "Dirty Summer Blonde",
                "family": "american",
                "style": "blonde",
                "IBU": 20
            },
            {
                "id": 2,
                "name": "Britannia Amber Rose",
                "family": "american",
                "style": "amber",
                "IBU": 20
            },
            {
                "id": 3,
                "name": "Eternally Hoptimistic",
                "family": "american",
                "style": "pale",
                "IBU": 20
            },
            {
                "id": 4,
                "name": "Walk on the Mild Side",
                "family": "british",
                "style": "mild",
                "IBU": 20
            },
            {
                "id": 5,
                "name": "The Notorious M.S.B.",
                "family": "british",
                "style": "brown",
                "IBU": 20
            },
            {
                "id": 6,
                "name": "Quarter After Midnight",
                "family": "british",
                "style": "stout",
                "IBU": 20
            },
            {
                "id": 7,
                "name": "Shed No Tears",
                "family": "british",
                "style": "chocolate stout",
                "IBU": 20
            },
            {
                "id": 8,
                "name": "Britannia Royal Porter",
                "family": "british",
                "style": "porter",
                "IBU": 20
            }
        ]
    }
}
```

<br />

### Step Two: The System Runs

Section on how the input is processed.

#### Delivery Options

Content

#### Loyalty Promotion

Content

#### Anniversary Party

Content

<br />

### Step Three: Output is Returned

Section on what the output looks like.

#### Delivery Options

Content

#### Loyalty Promotion

Content

#### Anniversary Party

Content

<br />

<br />

<br />

<br />

# Pathify Function Example

The `pathifyJSON` function takes blobs of input data and reliably restructures
them into values and tables. Please report any problems with this process as
issues on this repository.

**Input:**

```json
{
    "order_id": "38936c5e",
    "business": {
        "id": "breweries.canada.ottawa.britannia",
        "address": {
            "street": "Lager St",
            "number": "19",
            "city": "Ottawa"
        },
        "brews": ["house lager", "house ale", "saskatchewan fog"]
    },
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

**Output:**

This will be provided to the system as the 'input blob' and will be available to reference for rule-writers at the input document.

Values will be referenced like `input.values.value_name`

Tables and table values will be referenced like `input.tables.table_name.field_name`

```json
{
    "values": {
        "order_id": 38936,
        "business.id": "breweries.canada.ottawa.britannia",
        "business.address.street": "Lager St",
        "business.address.number": 19,
        "business.address.city": "Ottawa",
        "business.brews": ["house lager", "house ale", "saskatchewan fog"],
        "customer.id": 72,
        "customer.address.street": "Main St",
        "customer.address.number": 12,
        "customer.address.city": "Ottawa",
        "customer.address.subentity.name": "Ontario",
        "customer.address.subentity.code.value": "CA-ON",
        "customer.address.subentity.code.list_id": "ISO 3116-2",
        "customer.address.subentity.code.list_name": "Country Subentity",
        "customer.address.subentity.code.version_id": 20010914
    },
    "tables": {
        "items": [
            {
                "id.value": 1,
                "id.list_id": "britannia-stock-ids",
                "description": "The MSB (6)",
                "quantity.value": 6,
                "quantity.unit": "can",
                "pricing.price.value": 5.76,
                "pricing.price.currency_code": "CAD",
                "pricing.quantity.value": 1,
                "pricing.quantity.unit": "can"
            },
            {
                "id.value": 3,
                "id.list_id": "britannia-stock-ids",
                "description": "Eternally Hoptimistic (12)",
                "quantity.value": 12,
                "quantity.unit": "can",
                "pricing.price.value": 4.87,
                "pricing.price.currency_code": "CAD",
                "pricing.quantity.value": 1,
                "pricing.quantity.unit": "can"
            }
        ]
    }
}
```

<br />

<br />

<br />

# Potential Format for Metadata

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
