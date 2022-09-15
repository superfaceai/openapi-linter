import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-oas3-missing-schema-property-example', [
  {
    name: 'annotates with correct paths - missing example in components',
    document: {
      openapi: '3.0.0',
      components: {
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
        path: ['components', 'schemas', 'test', 'properties', 'test'],
        severity: DiagnosticSeverity.Hint,
      },
    ],
  },
  {
    name: 'annotates with correct paths - missing example in contents',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          post: {
            requestBody: {
              content: {
                'application/x-www-form-urlencoded': {
                  schema: {
                    properties: {
                      test: {
                        type: 'string',
                      },
                    },
                  },
                  required: true,
                },
              },
            },
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      properties: {
                        test: {
                          type: 'string',
                        },
                      },
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
        message: 'Each property should define "example" value',
        path: [
          'paths',
          '/test',
          'post',
          'requestBody',
          'content',
          'application/x-www-form-urlencoded',
          'schema',
          'properties',
          'test',
        ],
        severity: DiagnosticSeverity.Hint,
      },
      {
        message: 'Each property should define "example" value',
        path: [
          'paths',
          '/test',
          'post',
          'responses',
          '200',
          'content',
          'application/json',
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
      openapi: '3.0.0',
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
]);
