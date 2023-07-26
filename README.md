# chubbyts-packaging

## Description

Packaging helper

## Requirements

 * node: 16

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-packaging][1].

```ts
npm i -D @chubbyts-packaging@^2.0.0
```

### package.json

```json
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

## Copyright

2023 Dominik Zogg

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-packaging
