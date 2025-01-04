import { describe, expect, test } from 'vitest';
import { fixCommonjsRequirePaths, fixModuleImportPaths } from '../src/build';

describe('build', () => {
  test('fixCommonjsRequirePaths', () => {
    expect(
      fixCommonjsRequirePaths(`
      const myPackageA = require('@mypackageA/path/to/file');
      const a = require('./package/a/module');
      const b = require('../package/b/module.js');
      const c = require('../../package/c/module.cjs');

      const lazyLoad = () => {
        const myPackageB = require('@mypackageB/path/to/file');
        const d = require('./package/d/module');
        const e = require('../package/e/module.js');
        const f = require('../../package/f/module.cjs');
      };

      foo('./looks/like/a/path/but/dont/touch/it');
    `),
    ).toMatchInlineSnapshot(`
      "
            const myPackageA = require('@mypackageA/path/to/file');
            const a = require('./package/a/module.cjs');
            const b = require('../package/b/module.cjs');
            const c = require('../../package/c/module.cjs');

            const lazyLoad = () => {
              const myPackageB = require('@mypackageB/path/to/file');
              const d = require('./package/d/module.cjs');
              const e = require('../package/e/module.cjs');
              const f = require('../../package/f/module.cjs');
            };

            foo('./looks/like/a/path/but/dont/touch/it');
          "
    `);
  });

  test('fixModuleImportPaths', () => {
    expect(
      fixModuleImportPaths(`
      import myPackageA from '@mypackageA/path/to/file';
      import a from './package/a/module';
      import b from '../package/b/module.js';
      import c from '../../package/c/module.mjs';

      const lazyLoad = async () => {
        const myPackageB = await import('@mypackageB/path/to/file');
        const d = await import('./package/d/module');
        const e = await import('../package/e/module.js');
        const f = await import('../../package/f/module.mjs');
      };

      foo('./looks/like/a/path/but/dont/touch/it');
    `),
    ).toMatchInlineSnapshot(`
      "
            import myPackageA from '@mypackageA/path/to/file';
            import a from './package/a/module.mjs';
            import b from '../package/b/module.mjs';
            import c from '../../package/c/module.mjs';

            const lazyLoad = async () => {
              const myPackageB = await import('@mypackageB/path/to/file');
              const d = await import('./package/d/module.mjs');
              const e = await import('../package/e/module.mjs');
              const f = await import('../../package/f/module.mjs');
            };

            foo('./looks/like/a/path/but/dont/touch/it');
          "
    `);
  });
});
