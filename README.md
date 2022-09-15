# OpenAPI Linter

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/superfaceai/openapi-linter/CI)](https://github.com/superfaceai/openapi-linter/actions/workflows/main.yml)
[![npm](https://img.shields.io/npm/v/@superfaceai/openapi-linter)](https://www.npmjs.com/package/@superfaceai/openapi-linter)
[![license](https://img.shields.io/npm/l/@superfaceai/openapi-linter)](LICENSE)
[![CLI built with oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Discord](https://img.shields.io/discord/819563244418105354?logo=discord&logoColor=fff)](https://sfc.is/discord)

> Is your OpenAPI Spec ready for SDK generators?

OpenAPI Linter is a CLI and a Node.js library to validate OpenAPI specification from URL or file path.
It is based on [Spectral] by Stoplight with [OpenAPI rules](https://meta.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules) with additional rules. The goal of Linter is to check whether the spec contains enough information to generate high quality, well documented SDK.
We use OpenAPI Linter in [Superface Integration Designer][designer], but any client code generator benefits from well written OpenAPI specs.

## Setup

Install from npm globally:

```shell
npm i -g @superfaceai/openapi-linter
```

Now you can use the linter with commands `openapi-linter` or `oal`.

Alternatively you can use the linter without installation with `npx`:

```
npx @superfaceai/openapi-linter lint <file or URL>
```

## CLI commands

  <!-- commands -->

- [`openapi-linter lint SPECIFICATIONPATH`](#openapi-linter-lint-specificationpath)

### `openapi-linter lint SPECIFICATIONPATH`

Lints OpenAPI specification using three different parsers/validators.

```
USAGE
  $ openapi-linter lint [SPECIFICATIONPATH] [-f yaml|json] [-e error|warning|any]

ARGUMENTS
  SPECIFICATIONPATH  Path or URL to specification file

FLAGS
  -e, --throwOn=<option>     [default: error] On which kind of severty error should be thrown. When set to warning
                             command will throw when there is a result with "warning" or "error" severity.
                             <options: error|warning|any>
  -f, --fileFormat=<option>  Format of specification. Must be "yaml" or "json" when defined
                             <options: yaml|json>

DESCRIPTION
  Lints OpenAPI specification using three different parsers/validators.

EXAMPLES
  $ oal lint https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml

  $ oal lint examples/petstore.yaml

  $ oal lint examples/petstore.yaml -e any

  $ oal lint examples/petstore.yaml -f yaml
```

<!-- commandsstop -->

## Usage in code

Install the linter as a dependency into your project:

```shell
npm i @superfaceai/openapi-linter
```

Use the `lint` function:

<!-- TODO: Add example what's in lintResult -->

```ts
import { lint } from 'openapi-linter';

// Get specification as string
const specification = await fs.readFile(pathToSpec, { encoding: 'utf-8' });

// Pass specification, its extension ("yaml" or "json") and name
const lintResult = await lint(specification, 'yaml', 'my-spec-name');

//Do something with result
console.log(lintResult);
```

<!-- TODO
## Added rules (WIP)

* Each operation has to define at least one success response
* Each operation has to define at least one error or default response
-->

## Related projects

- [Spectral], generic linter for JSON and YAML this project is based on
- [OpenAPI Enforcer](https://openapi-enforcer.com/)
- [OpenAPI Validator](https://github.com/IBM/openapi-validator)
- [OAS Tools](https://oas-tools.github.io/)
- [Redocly CLI](https://github.com/Redocly/redocly-cli)
- [Cherrybomb](https://github.com/blst-security/cherrybomb) (Rust)
- and [many more](https://openapi.tools/)

## Maintainers

- [Jakub Vacek](https://github.com/Jakub-Vacek)
- [Radek Kyselý](https://github.com/kysely)

## License

This project is licensed under the [MIT license](LICENSE).

© 2022 Superface s.r.o.

[spectral]: https://stoplight.io/open-source/spectral
[designer]: https://superface.ai/designer
