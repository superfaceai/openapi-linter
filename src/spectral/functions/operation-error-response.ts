import {
  createRulesetFunction,
  RulesetFunctionContext,
} from '@stoplight/spectral-core';
import { oas3 } from '@stoplight/spectral-formats';

export default createRulesetFunction(
  {
    input: {
      type: 'object',
    },
    errorOnInvalidInput: true,
    options: null,
  },
  (
    input: Record<string, unknown>,
    _options: null,
    context: RulesetFunctionContext
  ) => {
    const isOAS3X = context.document.formats?.has(oas3) === true;

    if (
      Object.keys(input).some(response =>
        /(40[0-9]|4[1-9][0-9]|500)/.test(response)
      )
    ) {
      return;
    }

    if (
      isOAS3X &&
      Object.keys(input).some(
        response => response === '4XX' || response === '5XX'
      )
    ) {
      return;
    }

    return [{ message: context.rule.message ?? '' }];
  }
);
