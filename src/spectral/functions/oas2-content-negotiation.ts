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
    input: Record<
      string,
      Record<string, Record<string, Record<string, unknown>>>
    >,
    _options: null,
    context: RulesetFunctionContext
  ) => {
    const results: { message: string; path: JsonPath }[] = [];

    // Returns true when operation consumes/produces is defined and not empty or top level consumes/produces is defined and not empty
    const isDefined = (
      producesOrConsumes: unknown,
      topLevelDefined: boolean
    ) => {
      if (
        producesOrConsumes !== undefined &&
        Array.isArray(producesOrConsumes) &&
        producesOrConsumes.length > 0
      ) {
        return true;
      }

      return topLevelDefined;
    };

    /**
     * Produces / consumes can be defined on top level and overriden on opertaion level
     * so we check that each opration have consumes / produces defined and not empty
     */
    const topLevelConsumes =
      input.consumes !== undefined &&
      Array.isArray(input.consumes) &&
      input.consumes.length > 0;
    const topLevelProduces =
      input.produces !== undefined &&
      Array.isArray(input.produces) &&
      input.produces.length > 0;

    let operationConsumes: boolean;
    let operationProduces: boolean;

    for (const [endpoint, endpointBody] of Object.entries(input?.paths ?? {})) {
      for (const [method, request] of Object.entries(endpointBody)) {
        operationConsumes = isDefined(request.consumes, topLevelConsumes);
        operationProduces = isDefined(request.produces, topLevelProduces);

        if (!operationConsumes) {
          results.push({
            message: 'Operation should define "consumes" property',
            path: [...context.path, 'paths', endpoint, method, 'consumes'],
          });
        }

        if (!operationProduces) {
          results.push({
            message: 'Operation should define "produces" property',
            path: [...context.path, 'paths', endpoint, method, 'produces'],
          });
        }

        // TODO: check headers for accepts/content-type
      }
    }

    return results;
  }
);
