import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { dirname, basename } from 'path';

const distDir = './dist';
const commonJsDistDir = distDir + '/cjs';
const moduleDistDir = distDir + '/esm';

export const fixCommonjsRequirePaths = (code: string) =>
  code.replace(/(?<=\brequire\(['"])(\.\.?\/[^'"]+?)(?:\.js|\.cjs)?(?=['"])/g, '$1.cjs');

export const fixModuleImportPaths = (code: string) =>
  code.replace(/(?<=\bimport(?:\s+.+?from\s+|(?:\s*\())['"])(\.\.?\/[^'"]+?)(?:\.js|\.mjs)?(?=['"])/g, '$1.mjs');

const getAllFiles = (path: string): Array<string> => {
  return readdirSync(path)
    .map((file) => {
      const filePath = path + '/' + file;
      if (statSync(filePath).isDirectory()) {
        return getAllFiles(filePath);
      }

      return [filePath];
    })
    .flat();
};

const renameAndMoveCommonJsFiles = () => {
  getAllFiles(commonJsDistDir).map((file) => {
    const name = basename(file);
    const fromFolder = dirname(file);
    const toFolder = distDir + fromFolder.substring(commonJsDistDir.length);

    if (!name.match(/\.js$/)) {
      return;
    }

    if (!existsSync(toFolder)) {
      mkdirSync(toFolder, { recursive: true });
    }

    const fromPath = fromFolder + '/' + name;
    const toPath = toFolder + '/' + name.replace(/\.js$/, '.cjs');

    writeFileSync(toPath, fixCommonjsRequirePaths(readFileSync(fromPath, { encoding: 'utf8', flag: 'r' })));
  });
};

const renameAndMoveModuleFiles = () => {
  getAllFiles(moduleDistDir).map((file) => {
    const name = basename(file);
    const fromFolder = dirname(file);
    const toFolder = distDir + fromFolder.substring(moduleDistDir.length);

    if (!name.match(/\.js$/)) {
      return;
    }

    if (!existsSync(toFolder)) {
      mkdirSync(toFolder, { recursive: true });
    }

    const fromPath = fromFolder + '/' + name;
    const toPath = toFolder + '/' + name.replace(/\.js$/, '.mjs');

    writeFileSync(toPath, fixModuleImportPaths(readFileSync(fromPath, { encoding: 'utf8', flag: 'r' })));
  });
};

rmSync(distDir, { recursive: true, force: true });

try {
  execSync(`./node_modules/.bin/tsc --module commonjs --outDir ${commonJsDistDir}`);
  execSync(`./node_modules/.bin/tsc --module esnext --outDir ${moduleDistDir}`);
  execSync(`./node_modules/.bin/tsc --declaration --emitDeclarationOnly --outDir ${distDir}`);
} catch (e) {
  console.log(e?.toString());

  process.exit(1);
}

renameAndMoveCommonJsFiles();
rmSync(commonJsDistDir, { recursive: true, force: true });

renameAndMoveModuleFiles();
rmSync(moduleDistDir, { recursive: true, force: true });
