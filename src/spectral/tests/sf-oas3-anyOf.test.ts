import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-oas3-anyOf', [
  {
    name: 'annotates with correct paths',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          get: {
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: {
                      anyOf: [{ type: 'string' }, { type: null }],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: [
      {
        message: '"anyOf" keyword is not supported in integration designer',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'anyOf',
        ],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
