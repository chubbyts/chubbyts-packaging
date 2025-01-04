import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { rmSync } from 'fs';
import { describe, expect, test } from 'vitest';
import { copySync } from 'fs-extra';
import { fixCommonjsRequirePaths, fixModuleImportPaths, getAllFiles, renameAndMoveJsFiles } from '../src/build';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  test('getAllFiles', () => {
    expect(getAllFiles(__dirname + '/../sample-1').map((filePath) => '.' + filePath.substring(__dirname.length)))
      .toMatchInlineSnapshot(`
        [
          "./../sample-1/cjs/module-a/file1.js",
          "./../sample-1/cjs/module-a/file2.js",
          "./../sample-1/cjs/module-b/file3.js",
          "./../sample-1/cjs/module-b/file4.js",
          "./../sample-1/cjs/module-b/file5.js",
          "./../sample-1/cjs/module-b/submodule-b/file6.js",
          "./../sample-1/cjs/module-c/file7.js",
          "./../sample-1/mjs/module-a/file1.js",
          "./../sample-1/mjs/module-a/file2.js",
          "./../sample-1/mjs/module-b/file3.js",
          "./../sample-1/mjs/module-b/file4.js",
          "./../sample-1/mjs/module-b/file5.js",
          "./../sample-1/mjs/module-b/submodule-b/file6.js",
          "./../sample-1/mjs/module-c/file7.js",
        ]
      `);
  });

  describe('renameAndMoveJsFiles', () => {
    test('successful', () => {
      const tmpDirWithSuffix = tmpdir + '/' + randomBytes(16).toString('hex');

      copySync(__dirname + '/../sample-1', tmpDirWithSuffix + '/sample-1');
      renameAndMoveJsFiles(tmpDirWithSuffix + '/sample-1', 'cjs', (input) => input);
      renameAndMoveJsFiles(tmpDirWithSuffix + '/sample-1', 'mjs', (input) => input);

      expect(
        getAllFiles(tmpDirWithSuffix + '/sample-1').map(
          (filePath) => '.' + filePath.substring(tmpDirWithSuffix.length),
        ),
      ).toMatchInlineSnapshot(`
        [
          "./sample-1/module-a/file1.cjs",
          "./sample-1/module-a/file1.mjs",
          "./sample-1/module-a/file2.cjs",
          "./sample-1/module-a/file2.mjs",
          "./sample-1/module-b/file3.cjs",
          "./sample-1/module-b/file3.mjs",
          "./sample-1/module-b/file4.cjs",
          "./sample-1/module-b/file4.mjs",
          "./sample-1/module-b/file5.cjs",
          "./sample-1/module-b/file5.mjs",
          "./sample-1/module-b/submodule-b/file6.cjs",
          "./sample-1/module-b/submodule-b/file6.mjs",
          "./sample-1/module-c/file7.cjs",
          "./sample-1/module-c/file7.mjs",
        ]
      `);

      rmSync(tmpDirWithSuffix + '/sample-1', { recursive: true, force: true });
    });

    test('not supported file', () => {
      const tmpDirWithSuffix = tmpdir + '/' + randomBytes(16).toString('hex');

      copySync(__dirname + '/../sample-2', tmpDirWithSuffix + '/sample-2');

      try {
        renameAndMoveJsFiles(tmpDirWithSuffix + '/sample-2', 'cjs', (input) => input);
        throw new Error('expected fail');
      } catch (e) {
        expect(e.message).toMatch(
          /\/sample-2\/cjs\/module-b\/file3\.json" is not a js file\. Please add it with tools like copyfiles after the build\.$/,
        );
      }

      rmSync(tmpDirWithSuffix + '/sample-2', { recursive: true, force: true });
    });
  });
});
