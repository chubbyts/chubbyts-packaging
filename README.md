# chubbyts-packaging

## Description

Packaging helper

## Requirements

 * node: 16

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-packaging][1].

```ts
npm i -D @chubbyts-packaging@^2.0.1
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
ln -s node_modules/@chubbyts/chubbyts-packaging/build.js .
ln -s node_modules/@chubbyts/chubbyts-packaging/tsconfig.cjs.json .
ln -s node_modules/@chubbyts/chubbyts-packaging/tsconfig.esm.json .
ln -s node_modules/@chubbyts/chubbyts-packaging/tsconfig.json .
ln -s node_modules/@chubbyts/chubbyts-packaging/tsconfig.json .
```

## Copyright

2023 Dominik Zogg

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-packaging
