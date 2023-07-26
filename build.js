import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { dirname, basename } from 'path';
import { cwd } from 'process';

const getAllFiles = (path) => {
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

const rootDir = cwd();
const distDir = rootDir + '/dist';
const commonJsDistDir = distDir + '/cjs';
const ecmaScriptModuleDistDir = distDir + '/esm';

rmSync(distDir, { recursive: true, force: true });

execSync(`${rootDir}/node_modules/.bin/tsc -b ./tsconfig.cjs.json ./tsconfig.esm.json ./tsconfig.types.json`);

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

  writeFileSync(
    toPath,
    readFileSync(fromPath, { encoding: 'utf8', flag: 'r' }).replace(/require\("\.([^"]+)"\)/g, 'require(".$1.cjs")'),
  );
});

rmSync(commonJsDistDir, { recursive: true, force: true });

getAllFiles(ecmaScriptModuleDistDir).map((file) => {
  const name = basename(file);
  const fromFolder = dirname(file);
  const toFolder = distDir + fromFolder.substring(ecmaScriptModuleDistDir.length);

  if (!name.match(/\.js$/)) {
    return;
  }

  if (!existsSync(toFolder)) {
    mkdirSync(toFolder, { recursive: true });
  }

  const fromPath = fromFolder + '/' + name;
  const toPath = toFolder + '/' + name.replace(/\.js$/, '.mjs');

  writeFileSync(
    toPath,
    readFileSync(fromPath, { encoding: 'utf8', flag: 'r' }).replace(/from '\.([^']+)'/g, "from '.$1.mjs'"),
  );
});

rmSync(ecmaScriptModuleDistDir, { recursive: true, force: true });
