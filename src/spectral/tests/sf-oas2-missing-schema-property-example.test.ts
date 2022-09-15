import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-oas2-missing-schema-property-example', [
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
                  properties: { test: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
    errors: [
      {
        message: 'Each property should define "example" value',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'schema',
          'properties',
          'test',
        ],
        severity: DiagnosticSeverity.Hint,
      },
    ],
  },
  {
    name: 'annotates with correct paths - missing example in parameters',
    document: {
      swagger: '2.0',
      paths: {
        '/test': {
          post: {
            parameters: [
              {
                description: 'The format of the response',
                in: 'path',
                name: 'format',
                required: true,
                schema: {
                  properties: {
                    test: {
                      type: 'string',
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
    errors: [
      {
        message: 'Each property should define "example" value',
        path: [
          'paths',
          '/test',
          'post',
          'parameters',
          '0',
          'schema',
          'properties',
          'test',
        ],
        severity: DiagnosticSeverity.Hint,
      },
    ],
  },
  {
    name: 'annotates with correct paths - missing example in definitions',
    document: {
      swagger: '2.0',
      definitions: {
        schemas: {
          test: {
            properties: {
              test: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    errors: [
      {
        message: 'Each property should define "example" value',
        path: ['definitions', 'schemas', 'test', 'properties', 'test'],
        severity: DiagnosticSeverity.Hint,
      },
    ],
  },
]);
