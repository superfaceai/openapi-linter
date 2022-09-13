import {
  createRulesetFunction,
  RulesetFunctionContext,
} from '@stoplight/spectral-core';
import { oas3 } from '@stoplight/spectral-formats';
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
    context: RulesetFunctionContext
  ) => {
    const results: { message: string; path: JsonPath }[] = [];

    const hasCorrectHttpMethod = (method: string) =>
      method === 'post' ||
      method === 'put' ||
      method === 'patch' ||
      method === 'delete';

    const hasUndefinedParameters = (request: Record<string, unknown>) =>
      request.parameters === undefined ||
      (Array.isArray(request.parameters) && request.parameters.length === 0);

    const hasDefinedRequestBody = (request: Record<string, unknown>) =>
      context.document.formats?.has(oas3) === true &&
      request.requestBody !== undefined;

    for (const [endpoint, endpointBody] of Object.entries(input)) {
      for (const [method, request] of Object.entries(endpointBody)) {
        if (hasCorrectHttpMethod(method)) {
          if (hasUndefinedParameters(request)) {
            if (hasDefinedRequestBody(request)) {
              continue;
            }
            results.push({
              message: `Operation with ${method.toUpperCase()} http method should define body or parameters`,
              path: [...context.path, endpoint, method, 'parameters'],
            });
          }
        }
      }
    }

    return results;
  }
);
