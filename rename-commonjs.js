import { readdirSync, renameSync, statSync, existsSync, mkdirSync, rmSync } from 'fs';
import { dirname, basename } from 'path';
import { cwd } from 'process';

const getAllFiles = (path) => {
  return readdirSync(path).map((file) => {
    const filePath = path + '/' + file;
    if (statSync(filePath).isDirectory()) {
      return getAllFiles(filePath);
    }

    return [filePath];
  }).flat();
};

const distDir = cwd() + '/dist';
const commonJsDistDir = distDir + '/cjs';

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

  renameSync(fromFolder + '/' + name, toFolder + '/' + name.replace(/\.js$/, '.cjs'));
});

rmSync(commonJsDistDir, { recursive: true, force: true });
