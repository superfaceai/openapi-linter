import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-oas2-allOf', [
  {
    name: 'annotates with correct paths',
    document: {
      swagger: '2.0',
      paths: {
        '/test': {
          get: {
            responses: {
              200: {
                description: 'A paged array of pets',
                schema: {
                  allOf: [{ type: 'string' }, { type: null }],
                },
              },
            },
          },
        },
      },
    },
    errors: [
      {
        message: '"allOf" keyword is not supported in integration designer',
        path: ['paths', '/test', 'get', 'responses', '200', 'schema', 'allOf'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
