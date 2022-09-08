import {
  Document,
  ISpectralDiagnostic,
  Spectral,
} from '@stoplight/spectral-core';
import * as Parsers from '@stoplight/spectral-parsers';

import { prepareRuleset } from './ruleset';

//This should be possible to use as Automaton dependency
export async function lint(
  specification: string,
  extension: 'json' | 'yaml',
  includeAutomatonSpecificRules = true,
  specificationName?: string
  //TODO: custom type instead of spectral?
): Promise<ISpectralDiagnostic[]> {
  let document;

  if (extension === 'json') {
    document = new Document(specification, Parsers.Json, specificationName);
  } else {
    document = new Document(specification, Parsers.Yaml, specificationName);
  }

  const spectral = new Spectral();
  spectral.setRuleset(prepareRuleset(includeAutomatonSpecificRules));

  return spectral.run(document);
}
