import { DiagnosticSeverity } from '@stoplight/types';

import { testRule } from './helpers/test-rule';

testRule('sf-missing-operaion-summary', [
  {
    name: 'annotates with correct paths',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          get: {
            summary: '',
          },
        },
      },
    },
    errors: [
      {
        message: 'Operation must have non-empty summary property',
        path: ['paths', '/test', 'get', 'summary'],
        severity: DiagnosticSeverity.Hint,
      },
    ],
  },
  {
    name: 'annotates with correct paths',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          get: {},
        },
      },
    },
    errors: [
      {
        message: 'Operation must have non-empty summary property',
        path: ['paths', '/test', 'get'],
        severity: DiagnosticSeverity.Hint,
      },
    ],
  },
  {
    name: 'passes when there is a summary in OAS 3.0 document',
    document: {
      openapi: '3.0.0',
      paths: {
        '/test': {
          get: {
            summary: 'test',
          },
        },
      },
    },
    errors: null,
  },
  {
    name: 'annotates with correct paths',
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
        message: 'Operation must have non-empty summary property',
        path: ['paths', '/test', 'get'],
        severity: DiagnosticSeverity.Hint,
      },
    ],
  },
  {
    name: 'annotates with correct paths',
    document: {
      swagger: '2.0',
      paths: {
        '/test': {
          get: {
            summary: '',
          },
        },
      },
    },
    errors: [
      {
        message: 'Operation must have non-empty summary property',
        path: ['paths', '/test', 'get', 'summary'],
        severity: DiagnosticSeverity.Hint,
      },
    ],
  },
  {
    name: 'passes when there is a summary in OAS 2.0 document',
    document: {
      swagger: '2.0',
      paths: {
        '/test': {
          get: {
            summary: 'test',
          },
        },
      },
    },
    errors: null,
  },
]);
