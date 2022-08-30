import SwaggerParser from '@apidevtools/swagger-parser';
import { Command } from '@oclif/core';
import { lint, loadConfig } from '@redocly/openapi-core';
import Validator from '@seriousme/openapi-schema-validator';
import { green, red } from 'chalk';
import fetch from 'cross-fetch';
import { URL } from 'url';

type Log = (...args: unknown[]) => void;

export class Lint extends Command {
  static description = `Lints OpenAPI specification using three different parsers/validators.
`;

  static args = [
    {
      name: 'specificationPath',
      required: true,
      description: 'Path or URL to specification file',
    },
  ];

  static examples = [
    '$ oal lint https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml',
    '$ oal lint examples/petstore.yaml',
  ];

  static strict = false;

  async run(): Promise<void> {
    const { args } = await this.parse(Lint);

    const log = (...text: unknown[]) => this.log(green(text));
    const err = (...text: unknown[]) => this.log(red(text));

    if (args.specificationPath && typeof args.specificationPath === 'string') {
      const pathOrUrl: string = args.specificationPath;

      await validateWithSchemaValidator(pathOrUrl, { log, err });
      await validateWithSwaggerParser(pathOrUrl, { log, err });
      await validateWithRedoicly(pathOrUrl, { log, err });
    } else {
      err('Invalid argument: ', args.specificationPath);
      this.exit();
    }
  }
}

function isUrl(input: string): boolean {
  try {
    new URL(input);

    return true;
  } catch (error) {
    void error;

    return false;
  }
}

async function validateWithRedoicly(
  pathOrUrl: string,
  { log, err }: { log: Log; err: Log }
): Promise<void> {
  const problems = await lint({ ref: pathOrUrl, config: await loadConfig() });
  if (problems.length === 0) {
    log('Validation with redocly OK');
  } else {
    log('Validation with found errors:');
    for (const problem of problems) {
      err(
        `${problem.severity}: ${problem.message} - ${problem.location
          .map(l => l.pointer)
          .join('\n')}`
      );
    }
  }
}
async function validateWithSwaggerParser(
  pathOrUrl: string,
  { log, err }: { log: Log; err: Log }
): Promise<void> {
  try {
    await SwaggerParser.validate(pathOrUrl);
    log('Validation with swagger parser OK');
  } catch (error) {
    err(error as string);
  }
}

async function validateWithSchemaValidator(
  pathOrUrl: string,
  { log, err }: { log: Log; err: Log }
): Promise<void> {
  let validationResult;
  if (isUrl(pathOrUrl)) {
    const specification = await fetchUrl(pathOrUrl, { log, err });
    validationResult = await new Validator().validate(specification);
  } else {
    validationResult = await new Validator().validate(pathOrUrl);
  }
  if (validationResult.valid) {
    log('Validation with schema validator OK');
  }
}

async function fetchUrl(
  url: string,
  { log, err }: { log: Log; err: Log }
): Promise<string> {
  log(`Trying to fetch specification from url: "${url}"`);

  const response = await fetch(url);
  if (!response.ok) {
    err('Response is not valid', response);
    throw new Error('Invalid response');
  }

  return response.text();
}
