import {
  createRulesetFunction,
  RulesetFunctionContext,
} from '@stoplight/spectral-core';
import { JsonPath } from '@stoplight/types';
import { OpenAPIV2 } from 'openapi-types';

import { supportedTypes } from './oas3-unsupported-media-type';

export default createRulesetFunction(
  {
    input: {
      type: 'object',
    },
    errorOnInvalidInput: true,
    options: null,
  },
  (
    input: OpenAPIV2.Document,
    _options: null,
    context: RulesetFunctionContext
  ) => {
    const results: { message: string; path: JsonPath }[] = [];

    const checkContentTypes = (
      contentTypes: string[],
      kind: 'consumes' | 'produces',
      path?: string[]
    ) => {
      const unsupportedMediaType = contentTypes.find(
        (contentType: string) => supportedTypes.includes(contentType) === false
      );
      if (unsupportedMediaType !== undefined) {
        results.push({
          message: `"${unsupportedMediaType}" is not supported ${
            kind === 'consumes' ? 'request' : 'response'
          } media type`,
          path: [...context.path, ...(path ?? []), kind, unsupportedMediaType],
        });
      }
    };

    if (input.consumes !== undefined && Array.isArray(input.consumes)) {
      checkContentTypes(input.consumes, 'consumes');
    }
    if (input.produces !== undefined && Array.isArray(input.produces)) {
      checkContentTypes(input.produces, 'produces');
    }

    for (const [endpoint, endpointBody] of Object.entries(input?.paths ?? {})) {
      for (const [method, request] of Object.entries<Record<string, unknown>>(
        endpointBody
      )) {
        if (
          request !== undefined &&
          typeof request === 'object' &&
          request !== null
        ) {
          if (
            request.consumes !== undefined &&
            Array.isArray(request.consumes)
          ) {
            checkContentTypes(request.consumes, 'consumes', [
              'paths',
              endpoint,
              method,
            ]);
          }

          if (
            request.produces !== undefined &&
            Array.isArray(request.produces)
          ) {
            checkContentTypes(request.produces, 'produces', [
              'paths',
              endpoint,
              method,
            ]);
          }
        }
        // TODO: check headers for accepts/content-type
      }
    }

    return results;
  }
);
