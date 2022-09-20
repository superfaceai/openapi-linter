import {
  createRulesetFunction,
  RulesetFunctionContext,
} from '@stoplight/spectral-core';
import { JsonPath } from '@stoplight/types';
import { OpenAPIV3 } from 'openapi-types';

function isObject(
  schema: OpenAPIV3.SchemaObject
): schema is OpenAPIV3.NonArraySchemaObject {
  return schema.type === 'object' || schema.properties !== undefined;
}

function isArray(
  schema: OpenAPIV3.SchemaObject
): schema is OpenAPIV3.ArraySchemaObject {
  return schema.type === 'array';
}

function isPrimitive(
  schema: OpenAPIV3.SchemaObject
): schema is OpenAPIV3.NonArraySchemaObject {
  return (
    schema.type === 'boolean' ||
    schema.type === 'integer' ||
    schema.type === 'number' ||
    schema.type === 'string'
  );
}

function isReference(input: unknown): input is OpenAPIV3.ReferenceObject {
  return typeof input === 'object' && input !== null && '$ref' in input;
}

function visitPrimitiveSchema(
  schema: OpenAPIV3.SchemaObject,
  path: JsonPath
): { message: string; path: JsonPath } | undefined {
  if (!isPrimitive(schema)) {
    return;
  }

  if (schema.example === undefined) {
    return {
      message: 'Each property should define "example" value',
      path: [...path, 'example'],
    };
  }

  return;
}

function visitArraySchema(
  schema: OpenAPIV3.ArraySchemaObject,
  path: JsonPath
): { message: string; path: JsonPath }[] {
  if (!isArray(schema)) {
    return [];
  }

  if (isReference(schema.items)) {
    return [];
  }

  const results: { message: string; path: JsonPath }[] = [];

  if (isPrimitive(schema.items)) {
    const result = visitPrimitiveSchema(schema.items, [...path, 'items']);
    if (result !== undefined) {
      results.push(result);
    }
  } else if (isArray(schema.items)) {
    results.push(...visitArraySchema(schema.items, [...path, 'items']));
  } else if (isObject(schema.items)) {
    results.push(...visitObjectSchema(schema.items, [...path, 'items']));
  }

  return results;
}

function visitObjectSchema(
  schema: OpenAPIV3.NonArraySchemaObject,
  path: JsonPath
): { message: string; path: JsonPath }[] {
  if (!isObject(schema)) {
    return [];
  }

  const results: { message: string; path: JsonPath }[] = [];

  for (const [name, value] of Object.entries(schema.properties ?? {})) {
    if (isReference(value)) {
      continue;
    } else if (isPrimitive(value)) {
      const result = visitPrimitiveSchema(value, [...path, 'properties', name]);
      if (result !== undefined) {
        results.push(result);
      }
    } else if (isObject(value)) {
      results.push(...visitObjectSchema(value, [...path, 'properties', name]));
    } else if (isArray(value)) {
      results.push(...visitArraySchema(value, [...path, 'properties', name]));
    }
  }

  return results;
}

export default createRulesetFunction(
  {
    input: {
      type: 'object',
    },
    errorOnInvalidInput: true,
    options: null,
  },
  (
    input: OpenAPIV3.SchemaObject,
    _options: null,
    context: RulesetFunctionContext
  ) => {
    const results: { message: string; path: JsonPath }[] = [];

    if (isReference(input)) {
      return [];
    } else if (isPrimitive(input)) {
      const result = visitPrimitiveSchema(input, [...context.path]);
      if (result !== undefined) {
        results.push(result);
      }
    } else if (isObject(input)) {
      results.push(...visitObjectSchema(input, [...context.path]));
    } else if (isArray(input)) {
      results.push(...visitArraySchema(input, [...context.path]));
    }

    return results;
  }
);
