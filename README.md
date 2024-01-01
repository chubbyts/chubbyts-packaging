# chubbyts-packaging

## Description

Packaging helper

## Requirements

 * node: 16

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-packaging][1].

```ts
npm i -D @chubbyts/chubbyts-packaging@^2.0.4
```

### package.json

```json
  "type": "module",
  "scripts": {
    "build": "node ./build.js",
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
ln -sf node_modules/@chubbyts/chubbyts-packaging/build.js .
ln -sf node_modules/@chubbyts/chubbyts-packaging/tsconfig.cjs.json .
ln -sf node_modules/@chubbyts/chubbyts-packaging/tsconfig.esm.json .
ln -sf node_modules/@chubbyts/chubbyts-packaging/tsconfig.json .
ln -sf node_modules/@chubbyts/chubbyts-packaging/tsconfig.types.json .
```

## Copyright

2024 Dominik Zogg

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-packaging
