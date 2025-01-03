# chubbyts-packaging

## Description

Packaging helper

## Requirements

 * node: 18

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-packaging][1].

```ts
npm i -D @chubbyts/chubbyts-packaging@^3.0.0
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
