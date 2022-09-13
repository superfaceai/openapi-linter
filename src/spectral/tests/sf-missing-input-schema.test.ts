import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-missing-input-schema', [
  //OAS3
  {
    name: 'annotates with correct paths',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          post: {},
        },
      },
    },
    errors: [
      {
        message:
          'Operation with POST http method should define body or parameters',
        path: ['paths', '/test', 'post'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: 'annotates with correct paths',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          put: {
            parameters: [],
          },
        },
      },
    },
    errors: [
      {
        message:
          'Operation with PUT http method should define body or parameters',
        path: ['paths', '/test', 'put', 'parameters'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: 'passes when parameters are defined',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          post: {
            parameters: [
              {
                name: 'q',
                in: 'query',
                schema: {
                  type: 'string',
                  example: 'Prague',
                },
              },
            ],
          },
        },
      },
    },
    errors: null,
  },

  {
    name: 'passes when request body is defined',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          post: {
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                    example: 'Prague',
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
  //OAS2
  {
    name: 'annotates with correct paths',
    document: {
      swagger: '2.0',
      paths: {
        '/test': {
          delete: {},
        },
      },
    },
    errors: [
      {
        message:
          'Operation with DELETE http method should define body or parameters',
        path: ['paths', '/test', 'delete'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: 'annotates with correct paths',
    document: {
      swagger: '2.0',
      paths: {
        '/test': {
          put: {
            parameters: [],
          },
        },
      },
    },
    errors: [
      {
        message:
          'Operation with PUT http method should define body or parameters',
        path: ['paths', '/test', 'put', 'parameters'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: 'passes when parameters are defined',
    document: {
      swagger: '2.0',
      paths: {
        '/test': {
          put: {
            parameters: [
              {
                description:
                  'Timestamp to start search from, epoch time in milliseconds.',
                format: 'int64',
                in: 'query',
                name: 'fromTimestamp',
                required: false,
                type: 'integer',
              },
            ],
          },
        },
      },
    },
    errors: null,
  },
]);
