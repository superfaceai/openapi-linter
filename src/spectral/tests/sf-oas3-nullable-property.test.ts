import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-oas3-nullable-property', [
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
                'application/json': {
                  schema: {
                    type: 'string',
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
    errors: [
      {
        message:
          "Specification does not define single nullable property - please check that you didn't forget to mark nullable properties",
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
    ],
  },
  // {
  //   name: 'passes when nullable property is provided in request',
  //   document: {
  //     openapi: '3.0.0',
  //     paths: {
  //       '/test': {
  //         get: {
  //           requestBody: {
  //             required: false,
  //             content: {
  //               'application/json': {
  //                 schema: {
  //                   type: 'string',
  //                   nullable: true
  //                 },
  //               },
  //             },
  //           },
  //           responses: {
  //             200: {
  //               content: {
  //                 'application/json': {
  //                   schema: { type: 'string' },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   errors: null,
  // },
]);
