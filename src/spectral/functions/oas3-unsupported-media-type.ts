import {
  createRulesetFunction,
  RulesetFunctionContext,
} from '@stoplight/spectral-core';
import { JsonPath } from '@stoplight/types';
import { OpenAPIV3 } from 'openapi-types';

const JSON_CONTENT = 'application/json';
const JSON_PROBLEM_CONTENT = 'application/problem+json';
const URLENCODED_CONTENT = 'application/x-www-form-urlencoded';
const FORMDATA_CONTENT = 'multipart/form-data';
const BINARY_CONTENT_TYPES = [
  'application/octet-stream',
  'video/*',
  'audio/*',
  'image/*',
];

export const supportedTypes = [
  JSON_CONTENT,
  JSON_PROBLEM_CONTENT,
  URLENCODED_CONTENT,
  FORMDATA_CONTENT,
  ...BINARY_CONTENT_TYPES,
];

export default createRulesetFunction(
  {
    input: {
      type: 'object',
    },
    errorOnInvalidInput: true,
    options: null,
  },
  (
    input: OpenAPIV3.OperationObject,
    _options: null,
    context: RulesetFunctionContext
  ) => {
    const results: { message: string; path: JsonPath }[] = [];

    for (const [statusCode, response] of Object.entries(
      input?.responses ?? {}
    )) {
      if (!('$ref' in response) && response.content !== undefined) {
        const unsupportedMediaType = Object.keys(response.content).find(
          (contentType: string) =>
            supportedTypes.includes(contentType) === false
        );
        if (unsupportedMediaType !== undefined) {
          results.push({
            message: `"${unsupportedMediaType}" is not supported response media type`,
            path: [
              ...context.path,
              'responses',
              statusCode,
              'content',
              unsupportedMediaType,
            ],
          });
        }
      }
    }

    if (input.requestBody !== undefined && !('$ref' in input.requestBody)) {
      const unsupportedMediaType = Object.keys(input.requestBody.content).find(
        (contentType: string) => supportedTypes.includes(contentType) === false
      );
      if (unsupportedMediaType !== undefined) {
        results.push({
          message: `"${unsupportedMediaType}" is not supported request media type`,
          path: [
            ...context.path,
            'requestBody',
            'content',
            unsupportedMediaType,
          ],
        });
      }
    }

    return results;
  }
);
