import { RulesetDefinition } from '@stoplight/spectral-core';
import { oas2, oas3 } from '@stoplight/spectral-formats';
import { falsy } from '@stoplight/spectral-functions';
import { oas } from '@stoplight/spectral-rulesets';

import missingInputSchema from './functions/missing-input-schema';
import contentNegotiation from './functions/oas2-content-negotiation';
import oas2UnsupportedMediaType from './functions/oas2-unsupported-media-type';
import oas3UnsupportedMediaType from './functions/oas3-unsupported-media-type';
import operationErrorResponse from './functions/operation-error-response';

//This structure represents rules that we are using to lint OAS
export const rules: RulesetDefinition = {
  formats: [oas2, oas3],
  //Use all of oas rules
  extends: [[oas as RulesetDefinition, 'all']],

  //TODO: be able to turn off rules that are automaton specific and represnts some unsupported features (media type, allOf, security schemas)
  rules: {
    // Overide severity of selected rules
    // Rules that deals with non essential stuff have "hint" severity
    'contact-properties': 'hint',
    'info-contact': 'hint',
    'info-license': 'hint',
    'license-url': 'hint',
    'openapi-tags': 'hint',
    'operation-tags': 'hint',
    'tag-description': 'hint',

    //custom rules

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
      description:
        'Operation must define at least a single 4xx or 5xx response',
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
      given: '$.paths.[*][get,post,put,delete,options]',
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
  },
};
