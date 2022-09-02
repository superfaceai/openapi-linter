# Open api linter CLI

![TypeScript](https://img.shields.io/badge/%3C%2F%3E-Typescript-blue)

Simple CLI to validate OpenAPI specification. Takes url or filepath as an input. It uses Spectral extended OAS and AsyncApi ruleset.

## Usage

  <!-- commands -->
* [`open-api-linter lint SPECIFICATIONPATH`](#open-api-linter-lint-specificationpath)

## `open-api-linter lint SPECIFICATIONPATH`

Lints OpenAPI specification using three different parsers/validators.

```
USAGE
  $ open-api-linter lint [SPECIFICATIONPATH]

ARGUMENTS
  SPECIFICATIONPATH  Path or URL to specification file

DESCRIPTION
  Lints OpenAPI specification using three different parsers/validators.

EXAMPLES
  $ oal lint https://raw.githubusercontent.com/swagger-api/swagger-petstore/master/src/main/resources/openapi.yaml

  $ oal lint examples/petstore.yaml
```
<!-- commandsstop -->

To install a local artifact globally, symlink the binary (`ln -s bin/open-api-linter <target>`) into one of the following folders:

- `~/.local/bin` - local binaries for your user only (may not be in `PATH` yet)
- `/usr/local/bin` - system-wide binaries installed by the system administrator
- output of `yarn global bin` - usually the same as `/use/local/bin`

*You can do it with `npm link`*

## Maintainers

- [@Jakub Vacek](https://github.com/Jakub-Vacek)

## License

This repository is licensed under the [MIT](LICENSE).
© 2022
