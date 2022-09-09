import { RuleDefinition, RulesetDefinition } from '@stoplight/spectral-core';
import { FileRuleDefinition } from '@stoplight/spectral-core/dist/ruleset/types';
import { oas2, oas3, oas3_0, oas3_1 } from '@stoplight/spectral-formats';
import { falsy, truthy } from '@stoplight/spectral-functions';
import { oas } from '@stoplight/spectral-rulesets';

import missingInputSchema from './functions/missing-input-schema';
import contentNegotiation from './functions/oas2-content-negotiation';
import oas2UnsupportedMediaType from './functions/oas2-unsupported-media-type';
import oas3UnsupportedMediaType from './functions/oas3-unsupported-media-type';
import operationErrorResponse from './functions/operation-error-response';

const automatonSpecificRuleset: Record<string, Readonly<RuleDefinition>> = {
  'sf-oas3-allOf': {
    description: '"allOf" keyword must not be used in OpenAPI v3 document.',
    severity: 'warn',
    given: '$..allOf',
    recommended: true,
    message: '"allOf" keyword must not be used in OpenAPI v3 document.',
    then: {
      function: falsy,
    },
    formats: [oas3],
  },

  'sf-oas3-anyOf': {
    description: '"anyOf" keyword must not be used in OpenAPI v3 document.',
    severity: 'warn',
    given: '$..anyOf',
    recommended: true,
    message: '"anyOf" keyword must not be used in OpenAPI v3 document.',
    then: {
      function: falsy,
    },
    formats: [oas3],
  },

  'sf-oas3-oneOf': {
    description: '"oneOf" keyword must not be used in OpenAPI v3 document.',
    severity: 'warn',
    given: '$..oneOf',
    recommended: true,
    message: '"oneOf" keyword must not be used in OpenAPI v3 document.',
    then: {
      function: falsy,
    },
    formats: [oas3],
  },
  'sf-oas2-allOf': {
    description: '"allOf" keyword must not be used in OpenAPI v2 document.',
    severity: 'warn',
    given: '$..allOf',
    recommended: true,
    message: '"allOf" keyword must not be used in OpenAPI v2 document.',
    then: {
      function: falsy,
    },
    formats: [oas2],
  },
  'sf-oas2-operation-error-response': {
    description: 'Operation must define at least a single 4xx or 5xx response',
    severity: 'warn',
    given: '$.paths..responses',
    recommended: true,
    message: 'Operation must define at least a single 4xx or 5xx response',
    then: {
      function: operationErrorResponse,
    },
    formats: [oas2],
  },
  'sf-missing-input-schema': {
    severity: 'warn',
    given: '$.paths',
    recommended: true,
    then: {
      function: missingInputSchema,
    },
    formats: [oas3, oas2],
  },
  'sf-oas2-content-negotiation': {
    severity: 'warn',
    given: '$',
    recommended: true,
    then: {
      function: contentNegotiation,
    },
    formats: [oas2],
  },

  'sf-oas3-unsupported-media-type': {
    severity: 'warn',
    given: '#OperationObject',
    recommended: true,
    then: {
      function: oas3UnsupportedMediaType,
    },
    formats: [oas3],
  },

  'sf-oas2-unsupported-media-type': {
    severity: 'warn',
    given: '$',
    recommended: true,
    then: {
      function: oas2UnsupportedMediaType,
    },
    formats: [oas2],
  },
  'sf-oas3-nullable-property': {
    severity: 'warn',
    message:
      "Specification does not define single nullable property - please check that you didn't forget to mark nullable properties",
    given: '$..nullable',
    recommended: true,
    then: {
      function: truthy,
    },
    formats: [oas3],
  },
  'sf-missing-operaion-summary': {
    severity: 'hint',
    message: "Operation must have non-empty summary property",
    given: '#OperationObject',
    recommended: true,
    then: {
      field: 'summary',
      function: truthy,
    },
    formats: [oas3, oas2],
  },
};

export function prepareRuleset(
  includeAutomatonSpecificRules?: boolean
): RulesetDefinition {
  let rules: Record<string, Readonly<FileRuleDefinition>> = {
    // Overide severity of selected rules
    // Rules that deals with non essential stuff have "hint" severity
    'contact-properties': 'hint',
    'info-contact': 'hint',
    'info-license': 'hint',
    'license-url': 'hint',
    'openapi-tags': 'hint',
    'operation-tags': 'hint',
    'tag-description': 'hint',
  };

  if (includeAutomatonSpecificRules) {
    rules = { ...rules, ...automatonSpecificRuleset };
  }

  return {
    formats: [oas2, oas3, oas3_0, oas3_1],
    aliases: {
      PathItem: ['$.paths[*]'],
      OperationObject: [
        '#PathItem[get,put,post,delete,options,head,patch,trace]',
      ],
    },
    //Use all of oas rules
    extends: [[oas as RulesetDefinition, 'all']],
    rules,
  };
}
