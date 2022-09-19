import { IRuleResult, Spectral } from '@stoplight/spectral-core';
import { RuleDefinition } from '@stoplight/spectral-core/dist/ruleset/types';
import { httpAndFileResolver } from '@stoplight/spectral-ref-resolver';

import { automatonSpecificRuleset } from '../../ruleset';

// taken from: https://github.com/stoplightio/spectral/blob/develop/packages/rulesets/src/__tests__/__helpers__/tester.ts

export type RuleName = keyof typeof automatonSpecificRuleset;

type Scenario = ReadonlyArray<
  Readonly<{
    name: string;
    document: Record<string, unknown>;
    errors: ReadonlyArray<Partial<IRuleResult>> | null;
  }>
>;

export function testRule(ruleName: RuleName, tests: Scenario): void {
  describe(`Rule ${ruleName}`, () => {
    for (const testCase of tests) {
      it(testCase.name, async () => {
        const s = createWithRules([ruleName]);
        const doc = JSON.stringify(testCase.document);
        const errors = await s.run(doc);
        if (testCase.errors === null) {
          expect(errors.filter(({ code }) => code === ruleName)).toEqual([]);
        } else {
          expect(errors.filter(({ code }) => code === ruleName)).toEqual(
            testCase.errors.map(
              error => expect.objectContaining(error) as unknown
            )
          );
        }
      });
    }
  });
}

export function createWithRules(rules: RuleName[]): Spectral {
  const s = new Spectral({ resolver: httpAndFileResolver });

  s.setRuleset({
    // extends: [[automatonSpecificRuleset as RulesetDefinition, 'off']],
    rules: rules.reduce((obj, name) => {
      obj[name] = automatonSpecificRuleset[name];

      return obj;
    }, {} as Record<string, Readonly<RuleDefinition>>),
    aliases: {
      PathItem: ['$.paths[*]'],
      OperationObject: [
        '#PathItem[get,put,post,delete,options,head,patch,trace]',
      ],
    },
  });

  return s;
}
