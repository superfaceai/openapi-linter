import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-oas2-content-negotiation', [
  {
    name: 'passes when defined on top level',
    document: {
      swagger: '2.0',
      consumes: ['text/plain'],
      produces: ['application/json'],
      paths: {
        '/test': {
          get: {},
        },
      },
    },
    errors: null,
  },
  {
    name: 'passes when defined on operation level',
    document: {
      swagger: '2.0',
      paths: {
        '/test': {
          get: {
            consumes: ['text/plain'],
            produces: ['application/json'],
          },
        },
      },
    },
    errors: null,
  },
  {
    name: 'passes when defined on top and operation level',
    document: {
      swagger: '2.0',
      consumes: ['text/plain'],
      produces: ['application/json'],
      paths: {
        '/test': {
          get: {
            consumes: ['text/plain'],
            produces: ['application/json'],
          },
        },
      },
    },
    errors: null,
  },

  {
    name: 'fails when not defined',
    document: {
      swagger: '2.0',
      paths: {
        '/test': {
          get: {},
        },
      },
    },
    errors: [
      {
        message: 'Operation should define "consumes" property',
        path: ['paths', '/test', 'get'],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: 'Operation should define "produces" property',
        path: ['paths', '/test', 'get'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: 'fails when top level is overriden with empty array on operation level',
    document: {
      swagger: '2.0',
      consumes: ['text/plain'],
      produces: ['application/json'],
      paths: {
        '/test': {
          get: {
            consumes: [],
            produces: [],
          },
        },
      },
    },
    errors: [
      {
        message: 'Operation should define "consumes" property',
        path: ['paths', '/test', 'get'],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: 'Operation should define "produces" property',
        path: ['paths', '/test', 'get'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
