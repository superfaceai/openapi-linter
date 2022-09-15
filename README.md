# Open api linter

![TypeScript](https://img.shields.io/badge/%3C%2F%3E-Typescript-blue)

Simple CLI to validate Open Api specification. Takes url or file path as an input. It uses Spectral OAS ruleset with custom rules. Main goal is to ensure sufficient quality of Open Api specification to be used in Integration Designer or other tool that generates well documented client code from Open Api Specification.

## Added rules(WIP)
* Each operation has to define at least one success response
* Each operation has to define at least one error or default response


## Usage in code

```ts
import { lint } from 'openapi-linter';

// Get specification as string
const specification =  await fs.readFile(pathToSpec, {encoding: 'utf-8'});
      
// Pass specification, its extension ("yaml" or "json") and name
const lintResult = await lint(specification, 'yaml', 'my-spec-name');

//Do something with result
console.log(lintResult);
```

## Usage as CLI

  <!-- commands -->
* [`openapi-linter lint SPECIFICATIONPATH`](#openapi-linter-lint-specificationpath)

## `openapi-linter lint SPECIFICATIONPATH`

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

To install a local artifact globally, symlink the binary (`ln -s bin/openapi-linter <target>`) into one of the following folders:

- `~/.local/bin` - local binaries for your user only (may not be in `PATH` yet)
- `/usr/local/bin` - system-wide binaries installed by the system administrator
- output of `yarn global bin` - usually the same as `/use/local/bin`

*You can do it with `npm link`*

## Maintainers

- [@Jakub Vacek](https://github.com/Jakub-Vacek)

## License

This repository is licensed under the [MIT](LICENSE).
© 2022
