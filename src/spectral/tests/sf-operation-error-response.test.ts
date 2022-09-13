import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-operation-error-response', [
  //OAS3
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
        message:
          'Operation should define at least a single 4xx or 5xx response',
        path: ['paths', '/test', 'get', 'responses'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
  {
    name: 'passes when there is 500 response',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          get: {
            responses: {
              500: {
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
  {
    name: 'passes when there is 5xx response',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          get: {
            responses: {
              '5xx': {
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
  {
    name: 'passes when there is default response',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          get: {
            responses: {
              default: {
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
  //OAS2
  {
    name: 'annotates with correct paths',
    document: {
      swagger: '2.0',
      schemes: ['http'],
      info: {
        title: 'Test',
        version: '1.0.0',
      },
      paths: {
        '/test': {
          get: {
            responses: {
              200: {
                schema: { type: 'string' },
              },
            },
          },
        },
      },
    },
    errors: [
      {
        message:
          'Operation should define at least a single 4xx or 5xx response',
        path: ['paths', '/test', 'get', 'responses'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
  {
    name: 'passes when there is a 400 response',
    document: {
      swagger: '2.0',
      schemes: ['http'],
      info: {
        title: 'Test',
        version: '1.0.0',
      },
      paths: {
        '/test': {
          get: {
            responses: {
              400: {
                schema: { type: 'string' },
              },
            },
          },
        },
      },
    },
    errors: null,
  },
  {
    name: 'passes when there is a default response',
    document: {
      swagger: '2.0',
      schemes: ['http'],
      info: {
        title: 'Test',
        version: '1.0.0',
      },
      paths: {
        '/test': {
          get: {
            responses: {
              default: {
                schema: { type: 'string' },
              },
            },
          },
        },
      },
    },
    errors: null,
  },
]);
