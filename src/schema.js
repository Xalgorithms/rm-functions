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
      __title: 'The title of the rule (max 120 characters)',
      description: 'This is a simple rule that determines the required xyz for a given abc.',
      __description: 'A short summary of the rule (max 240 characters)',
      version: '1.0',
      __version: 'Each rule author or maintainer is responsible for version management based on the ‘Semver’ industry convention.',
      criticality: 'Experimental',
      __criticality: 'Choose: experimental, in effect or archived',

      __entity: 'An array of entity information, including name and url',
      entity: [
        {
          name: 'My Organization',
          __name: "What is the official name of the organization or person declaring this to be a rule?",
          url: 'www.myorganization.com',
          __url: "Please supply a Web link to a page that describes the organization or person which is declaring this to be a rule.",
          id: 'https://firstlast.solid.community/profile/card#me',
          __id: 'Full address to personal solid profile',
        },
      ],
      __authors: 'An array of author information, including name and contact info',
      authors: [
        {
          name: 'First Last',
          __name: "The 'author' of a rule is considered to be the person most directly responsible for how this rules is expressed in Xalgo",
          email: 'first.last@domain.country',
          __email: "The author's email address",
          solid_profile: 'https://firstlast.solid.community/profile/card#me',
          __solid_profile: 'Full address to personal solid profile',
          role: 'Author',
          __role: "The author's role. Can be author, maintainer, etc.",
        },
      ],
      __maintainers: 'An array of maintainer information, including name and contact info',
      maintainers: [
        {
          name: 'Firstname LastName',
          __name: 'The maintainer of a rule is considered to be the person most recently edited it in Xalgo',
          id: 'Rule Maintainer ID',
          __id: 'This is automatically assigned https://github.com/Xalgorithms/xalgorm_rule-maker/issues/9',
          email: 'hello@world.com',
          __email: 'Please supply an email address for the maintainer of this rule.',
        },
      ],
      __manager: 'An array of manager information, including name and contact info',
      manager: [
        {
          name: 'Firstname LastName',
          __name: 'The manager of a rule is considered to be the person most directly responsible for what this rule asserts.',
          id: 'Rule Manager ID',
          __id: 'This is automatically assigned https://github.com/Xalgorithms/xalgorm_rule-maker/issues/9',
          email: 'hello@world.com',
          __email: 'Please supply an email address for the manager of this rule.',
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
  __input_sources: "Origins of Data that this rule depends upon",
  input_sources: [
    {
      parameter: '', // need feedback for this section
      __parameter: '',
    },
  ],
  __input_context: 'Where is this rule asserted to be in effect',
  input_context: {
    __jurisdiction: 'What is the jurisdiction of the organization or person declaring this to be a rule?',
    jurisdiction: [
      {
        country: 'Canada',
        __country: 'What is the country jurisdiction of the organization or person declaring this to be a rule?',
        subcountry: 'Ontario',
        __subcountry: 'What is the state/province/territory/region jurisdiction (one level below the country) of the organization or person declaring this to be a rule?',
      },
    ],
    timezone: 'UTC-12:00',
    __timezone: 'The start and finish times are given for what time zone? (dropdown list of UTC  time zones)',
  },
  __input_filters: 'External data values for which this rule is deemed to be applicable',
  input_filters: {
    __standard_role_name: '',// need feedback for this section
    standard_role_name: [
      {
        standard_industry_name: '',
        __standard_industry_name: '',
        isic_industry_code: '',
        __isic_industry_code: '',
        isic_industry_name: '',
        __isic_industry_name: '',
      },
    ],
    __involved_product_service: '',
    involved_product_service: [
      {
        unspsc_name: '',
        __unspsc_name: '',
        unspsc_code: '',
        __unspsc_code: '',
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
  __output_weight: 'Rulemaker ranking of rule weight',
  output_weight: {
    __character_of_obligation: 'This is weighted up to 99 out of 100. The ruletaker always holds the determing weight of 100.',
    character_of_obligation: 0,
    __enforcement_measures: 'This is weighted up to 99 out of 100. The ruletaker always holds the determing weight of 100.',
    enforcement_measures: 0,
    __consequences: 'This is weighted up to 99 out of 100. The ruletaker always holds the determing weight of 100.',
    consequences: 0,
  },
  __output_purpose: 'Output attributes that characterize this rule',
  output_purpose: {
      responsibility: '',
      __responsibility: 'Who has responsibility for conformance?',
      normative_verb: '',
      __normative_verb: 'What is the primary normative (deontic; modal) verb?',
      modal_verb: '',
      __modal_verb: 'Is the primary modal verb stated in the affirmative; negative or as a question?',
      action_verb: '',
      __action_verb: 'What is the primary action verb?',
      philosophical_rationale: '',
      __philosophical_rationale: 'What is the principal type of philosophical rationale for this rule?',
      implementation: '',
      __implementation: 'Is this a directly implemented rule, a desription of a rule to be conformed with, or an empirical fact about a rule?',
  },
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
