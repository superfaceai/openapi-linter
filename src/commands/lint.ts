import { Command } from '@oclif/core';
import { gray, green, red, yellow } from 'chalk';
import fetch from 'cross-fetch';
import fs from 'fs/promises';
import { URL } from 'url';

import { lint } from '../spectral/run';

export type Log = (...args: unknown[]) => void;

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

    const log = (...text: unknown[]) => this.log(gray(text));
    const success = (...text: unknown[]) => this.log(green(text));
    const warn = (...text: unknown[]) => this.log(yellow(text));
    const err = (...text: unknown[]) => this.log(red(text));

    if (args.specificationPath && typeof args.specificationPath === 'string') {
      const pathOrUrl: string = args.specificationPath;
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

      const lintResult = await lint(specification, 'yaml', specificationName, {
        log,
        warn,
        success,
        err,
      });
      if (lintResult.errorsFound) {
        this.exit(1);
      }
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
