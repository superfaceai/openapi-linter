import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-oas3-unsupported-media-type', [
  {
    name: 'annotates with correct paths',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          get: {
            requestBody: {
              required: false,
              content: {
                'application/req': {
                  schema: {
                    type: 'object',
                    additionalProperties: false,
                  },
                },
              },
            },
            responses: {
              200: {
                content: {
                  'application/res': {
                    schema: { type: 'string' },
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
        message: '"application/req" is not supported request media type',
        path: [
          'paths',
          '/test',
          'get',
          'requestBody',
          'content',
          'application/req',
        ],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: '"application/res" is not supported response media type',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'content',
          'application/res',
        ],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
  {
    name: 'passes when supported media type are provided',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          get: {
            requestBody: {
              required: false,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    additionalProperties: false,
                  },
                },
              },
            },
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: null,
  },
]);
