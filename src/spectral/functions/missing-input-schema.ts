import {
  createRulesetFunction,
  RulesetFunctionContext,
} from '@stoplight/spectral-core';
import { JsonPath } from '@stoplight/types';

export default createRulesetFunction(
  {
    input: {
      type: 'object',
    },
    errorOnInvalidInput: true,
    options: null,
  },
  (
    input: Record<string, Record<string, Record<string, unknown>>>,
    _options: null,
    _context: RulesetFunctionContext
  ) => {
    const results: { message: string; path: JsonPath }[] = [];

    for (const [endpoint, endpointBody] of Object.entries(input)) {
      for (const [method, request] of Object.entries(endpointBody)) {
        if (
          method === 'post' ||
          method === 'put' ||
          method === 'patch' ||
          method === 'delete'
        ) {
          if (
            request.parameters === undefined ||
            (Array.isArray(request.parameters) &&
              request.parameters.length === 0)
          ) {
            results.push({
              message: `Operation with ${method.toUpperCase()} http method should define body or parameters`,
              path: [..._context.path, endpoint, method, 'parameters'],
            });
          }
        }
      }
    }

    return results;
  }
);
