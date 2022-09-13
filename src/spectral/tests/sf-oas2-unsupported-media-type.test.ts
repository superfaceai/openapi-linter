import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-oas2-unsupported-media-type', [
  {
    name: 'annotates with correct paths when top level media types are unsupported',
    document: {
      swagger: '2.0',
      consumes: ['text/consumes'],
      produces: ['application/produces'],
      paths: {
        '/test': {
          get: {
            consumes: ['something/consumes'],
            produces: ['something/produces'],
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
        message: '"text/consumes" is not supported request media type',
        path: ['consumes'],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: '"application/produces" is not supported response media type',
        path: ['produces'],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: '"something/consumes" is not supported request media type',
        path: ['paths', '/test', 'get', 'consumes'],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: '"something/produces" is not supported response media type',
        path: ['paths', '/test', 'get', 'produces'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
  {
    name: 'sf-oas2-unsupported-media-type',
    document: {
      swagger: '2.0',
      consumes: ['text/plain'],
      produces: ['application/json'],
      paths: {
        '/test': {
          get: {
            consumes: ['application/problem+json'],
            produces: ['application/json'],
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
    errors: null,
  },
]);
