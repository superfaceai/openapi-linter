import { Document, Spectral } from '@stoplight/spectral-core';
import * as Parsers from '@stoplight/spectral-parsers';
import { DiagnosticSeverity } from '@stoplight/types';

import { Log } from '../commands/lint';
import { format } from './format';
import { rules } from './ruleset';

//This should be possible to use as Automaton dependency
export async function lint(
  specification: string,
  extension: 'json' | 'yaml',
  specificationName: string,
  { log, err, success, warn }: { log: Log; err: Log; success: Log; warn: Log }
): Promise<{ errorsFound: boolean }> {
  let document;

  if (extension === 'json') {
    document = new Document(specification, Parsers.Json, specificationName);
  } else {
    document = new Document(specification, Parsers.Yaml, specificationName);
  }

  const spectral = new Spectral();
  spectral.setRuleset(rules);

  //TODO: Format output
  const results = await spectral.run(document);

  let errorsFound = false;

  if (results.length === 0) {
    success('OK');
  }
  for (const result of results) {
    if (result.severity === DiagnosticSeverity.Error) {
      errorsFound = true;
      err(format(result));
    } else if (result.severity === DiagnosticSeverity.Warning) {
      warn(format(result));
    } else {
      log(format(result));
    }
  }

  return { errorsFound };
}
