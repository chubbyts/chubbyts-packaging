import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { dirname, basename } from 'path';

export const fixCommonjsRequirePaths = (code: string) =>
  code.replace(/(?<=\brequire\(['"])(\.\.?\/[^'"]+?)(?:\.js|\.cjs)?(?=['"])/g, '$1.cjs');

export const fixModuleImportPaths = (code: string) =>
  code.replace(/(?<=\bimport(?:\s+.+?from\s+|(?:\s*\())['"])(\.\.?\/[^'"]+?)(?:\.js|\.mjs)?(?=['"])/g, '$1.mjs');

export const getAllFiles = (path: string): Array<string> => {
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

export const renameAndMoveJsFiles = (path: string, fileEnding: string, fixPaths: (body: string) => string) => {
  const fileEndingSubPath = path + '/' + fileEnding;

  getAllFiles(fileEndingSubPath).map((file) => {
    const name = basename(file);

    const fromFolder = dirname(file);
    const fromPath = fromFolder + '/' + name;

    if (!name.match(/\.js$/)) {
      throw new Error(`"${fromPath}" is not a js file. Please add it with tools like copyfiles after the build.`);
    }

    const toFolder = path + fromFolder.substring(fileEndingSubPath.length);

    if (!existsSync(toFolder)) {
      mkdirSync(toFolder, { recursive: true });
    }

    const toPath = toFolder + '/' + name.replace(/\.js$/, '.' + fileEnding);

    writeFileSync(toPath, fixPaths(readFileSync(fromPath, { encoding: 'utf8', flag: 'r' })));
  });

  rmSync(fileEndingSubPath, { recursive: true, force: true });
};

/////////////////////////////////////////////////////////////////////////////////////////////////

/* c8 ignore next 10000 */
const distDir = './dist';

const commonJsFileEnding = 'cjs';
const moduleFileEnding = 'mjs';

rmSync(distDir, { recursive: true, force: true });

try {
  execSync(`./node_modules/.bin/tsc --module commonjs --outDir ${distDir}/${commonJsFileEnding}`);
  execSync(`./node_modules/.bin/tsc --module esnext --outDir ${distDir}/${moduleFileEnding}`);
  execSync(`./node_modules/.bin/tsc --declaration --emitDeclarationOnly --outDir ${distDir}`);
} catch (e) {
  console.log(e?.toString());

  process.exit(1);
}

renameAndMoveJsFiles(distDir, commonJsFileEnding, fixCommonjsRequirePaths);
renameAndMoveJsFiles(distDir, moduleFileEnding, fixModuleImportPaths);
