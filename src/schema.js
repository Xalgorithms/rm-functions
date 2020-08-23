/**
 * This Schema is the basis for all rule writing.
 *
 * Each field with a value will be used as the placeholder for the field in the rule.
 *
 * Each field requires a corresponding __field key with a text description of the field.
 *
 * The standardized json-schema is not used here as it is far more complex than is necessary
 * for this use case.
 */
export const RuleSchema = {
  path: 'ior://domain.company.division.focus.rule-name',
  __path: 'The storage location for the rule.',
  __metadata: 'Non-computational information about the creation and ownership of the rule',
  metadata: {
    __rule: 'Information about the rule',
    rule: {
      title: 'Simple Rule Title',
      __title: 'The title of the rule',
      description: 'This is a simple rule that determines the required xyz for a given abc.',
      __description: 'A brief description of the rule',
      __authors: 'An array of author information, including name and contact info',
      authors: [
        {
          name: 'First Last',
          __name: "The authors's full plaintext name",
          email: 'first.last@domain.country',
          __email: "The author's email address",
          solid_profile: 'https://firstlast.solid.community/profile/card#me',
          __solid_profile: 'Full address to personal solid profile',
          role: 'Maintainer',
          __role: "The author's role. Can be author, maintainer, etc.",
        },
      ],
    },
  },
  __requirements: 'The set of expected documents required for the rule to run.',
  requirements: {
    __time:
      'The time period when the rule is effective. If no time zone data is included, system assumes UTC.',
    time: {
      start: '2020-01-01T00:00:00-04:00',
      __start: 'The time when the rule comes into effect. Can be blank.',
      end: '2020-01-01T00:00:00-04:00',
      __end: 'The time when the rule is no longer in effect. Can be blank.',
    },
    __fields: 'The set of fields that must be present in the incoming document.',
    fields: [
      {
        reference: 'simple_name',
        __reference: "The name/key the field's value will be referenced by in the system.",
        path: 'input.property.property.field',
        __path: 'The location the system will check in the incoming document for the field.',
        standard: 'standard_name',
        __standard: 'A standard reference name that is defined in the section Standards.',
      },
    ],
    __tables: 'The set of tables that must be present in the incoming document',
    tables: [
      {
        reference: 'simple_table_name',
        __reference: 'The name/key the table will be referenced by in the system.',
        path: 'input.tables.simple_table_name',
        __path:
          'The location the system will check in the incoming document for the table. Can point to the input document or a networked table location.',
        columns: ['id', 'quantity', 'value'],
        __columns: 'The set of expected columns in the incoming table.',
      },
    ],
  },
  __input_conditions: 'The set of conditions that will be applied to the input information.',
  input_conditions: [
    {
      __context: 'The context that must be given for the condition to be true.',
      context: {
        __participle: 'The verb, past participle, describing the attribute.',
        participle: 'invoiced',
        __attribute: 'The variable that we will be observing.',
        attribute: 'orderproperty.subproperty',
        __subject: 'The document that contains this property',
        subject: 'input.order.subtotal',
        __operation: 'A boolean comparison operation, i.e. >, <, ==, !=.',
        operation: '>=',
        __value:
          'A numerical or text value, can be post-fixed with a standard reference name, symbols will be discarded, i.e. "$20 USD", "Brand Name"',
        value: '$30 USD',
      },
      __cases: 'One case object for each scenario presented to the user. Sorted alphabetically.',
      cases: [
        {
          __case: 'The letter associated with a scenario represented across all input conditions.',
          case: 'A',
          __value: 'The value corresponding to this scenario and context',
          value: 'T',
        },
      ],
    },
  ],
  __output_assertions: 'The set of assertsions that will be derived from the input conditions.',
  output_assertions: [
    {
      __context: 'The context that must be given for the condition to be true.',
      context: {
        __participle: 'The verb, past participle, describing the attribute.',
        participle: 'offered',
        __attribute: 'The variable that we will be observing.',
        attribute: 'cash value',
        __subject: 'The document that contains this property',
        subject: 'output.promotion',
        __operation: 'A boolean comparison operation, i.e. >, <, ==, !=.',
        operation: '==',
        __value: 'A numerical or text value, can be post-fixed with a standard reference name',
        value: '$30 USD',
      },
      __cases: 'One case object for each scenario presented to the user. Sorted alphabetically.',
      cases: [
        {
          __case: 'The letter associated with a scenario represented across all input conditions.',
          case: 'A',
          __value: 'The value corresponding to this scenario and context',
          value: 'T',
        },
      ],
    },
  ],
  __standards: 'The set of standards that fields will conform to.',
  standards: [
    {
      __reference: 'The name/key the standard will be referenced by in the system.',
      reference: 'USD',
      __standard_name: 'The official ID or code that the reference is suggesting.',
      standard_name: 'ISO 4217',
      __explanation: 'Describe why this standard is included.',
      explanation:
        'USD is the ISO 4217 code for United States Dollar, and references a currency value of US Dollars.',
    },
  ],
};
