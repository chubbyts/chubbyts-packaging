# chubbyts-packaging

[![CI](https://github.com/chubbyts/chubbyts-packaging/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyts/chubbyts-packaging/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-packaging/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-packaging?branch=master)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fchubbyts%2Fchubbyts-packaging%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyts/chubbyts-packaging/master)
[![npm-version](https://img.shields.io/npm/v/@chubbyts/chubbyts-packaging.svg)](https://www.npmjs.com/package/@chubbyts/chubbyts-packaging)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=bugs)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=code_smells)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=coverage)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=ncloc)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=alert_status)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=security_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=sqale_index)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-packaging&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-packaging)

## Description

Packaging helper

## Requirements

 * node: 18

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-packaging][1].

```ts
npm i -D @chubbyts/chubbyts-packaging@^4.0.1
```

### package.json

```json
  "type": "module",
  "scripts": {
    "build": "node ./build.mjs",
    ...
  },
  "exports": {
    "./*": {
      "types": "./*.d.ts",
      "require": "./*.cjs",
      "import": "./*.mjs",
      "default": "./*.mjs"
    }
  }
```

### Symlinks

```sh
ln -sf node_modules/@chubbyts/chubbyts-packaging/dist/build.mjs .
ln -sf node_modules/@chubbyts/chubbyts-packaging/tsconfig.json .
```

## Copyright

2025 Dominik Zogg

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-packaging
