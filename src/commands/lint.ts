import { Command, Flags as oclifFlags } from '@oclif/core';
import { CLIError } from '@oclif/errors';
import { DiagnosticSeverity } from '@stoplight/types';
import { gray, green, red, yellow } from 'chalk';
import fetch from 'cross-fetch';
import fs from 'fs/promises';
import { URL } from 'url';

import { format, lint } from '../spectral';

export type Log = (...args: unknown[]) => void;

export class Lint extends Command {
  static description =
    'Lints OpenAPI specification using three different parsers/validators.';

  static args = [
    {
      name: 'specificationPath',
      required: true,
      description: 'Path or URL to specification file',
    },
  ];

  static flags = {
    fileFormat: oclifFlags.custom<'yaml' | 'json' | undefined>({
      char: 'f',
      description:
        'Format of specification. Must be "yaml" or "json" when defined',
      options: ['yaml', 'json'],
    })({ default: undefined }),

    throwOn: oclifFlags.custom<'error' | 'warning' | 'any' | undefined>({
      char: 'e',
      description:
        'On which kind of severty error should be thrown. When set to warning command will throw when there is a result with "warning" or "error" severity.',
      options: ['error', 'warning', 'any'],
    })({ default: 'error' }),
  };

  static examples = [
    '$ oal lint https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml',
    '$ oal lint examples/petstore.yaml',
    '$ oal lint examples/petstore.yaml -e any',
    '$ oal lint examples/petstore.yaml -f yaml',
  ];

  static strict = false;

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Lint);

    const log = (...text: unknown[]) => this.log(gray(text));
    const success = (...text: unknown[]) => this.log(green(text));
    const warn = (...text: unknown[]) => this.log(yellow(text));
    const err = (...text: unknown[]) => this.log(red(text));

    if (
      args.specificationPath === undefined ||
      typeof args.specificationPath !== 'string'
    ) {
      err('Invalid argument: ', args.specificationPath);
      this.exit();
    }

    const pathOrUrl: string = args.specificationPath as string;
    const extension = resolveExtension(pathOrUrl, flags.fileFormat);

    let specificationName: string;

    let specification: string;
    if (isUrl(pathOrUrl)) {
      specification = await fetchUrl(pathOrUrl, { log, err });
      specificationName = 'downloaded';
    } else {
      specification = (
        await fs.readFile(pathOrUrl, {
          encoding: 'utf-8',
        })
      ).trim();
      specificationName = pathOrUrl;
    }

    const lintResult = await lint(
      specification,
      extension,
      true,
      specificationName
    );

    // print formated result
    if (lintResult.length > 0) {
      for (const result of lintResult) {
        if (result.severity === DiagnosticSeverity.Error) {
          err(format(result));
        } else if (result.severity === DiagnosticSeverity.Warning) {
          warn(format(result));
        } else {
          log(format(result));
        }
      }
    } else {
      success('OK');
    }

    if (flags.throwOn === 'any' && lintResult.length > 0) {
      throw new CLIError(`${lintResult.length} problems found`);
    }

    let numberOfProblems = lintResult.filter(
      r => r.severity === DiagnosticSeverity.Error
    ).length;
    if (flags.throwOn === 'error' && numberOfProblems > 0) {
      throw new CLIError(`${numberOfProblems} problems found`);
    }
    numberOfProblems = lintResult.filter(
      r =>
        r.severity === DiagnosticSeverity.Error ||
        r.severity === DiagnosticSeverity.Warning
    ).length;
    if (flags.throwOn === 'warning' && numberOfProblems > 0) {
      throw new CLIError(`${numberOfProblems} problems found`);
    }

    this.exit(0);
  }
}

function resolveExtension(
  pathOrUrl: string,
  extensionFlag?: 'json' | 'yaml'
): 'json' | 'yaml' {
  if (extensionFlag !== undefined) {
    return extensionFlag;
  }

  if (pathOrUrl.endsWith('yaml')) {
    return 'yaml';
  }

  if (pathOrUrl.endsWith('json')) {
    return 'json';
  }

  throw new CLIError(
    `Path: "${pathOrUrl}" does not ends with supoported extensions ("yaml" or "json"). You can pass extension as flag`
  );
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
