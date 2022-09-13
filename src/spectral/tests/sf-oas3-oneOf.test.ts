import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-oas3-oneOf', [
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
                      oneOf: [{ type: 'string' }, { type: null }],
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
        message: '"oneOf" keyword is not supported in integration designer',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'oneOf',
        ],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
