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

  const fromPath = fromFolder + '/' + name;
  const toPath = toFolder + '/' + name.replace(/\.js$/, '.cjs');

  writeFileSync(
    toPath,
    readFileSync(fromPath, { encoding: 'utf8', flag: 'r' }).replace(
      /require\("\.([^"]+)\.js"\)/g,
      'require(".$1.cjs")',
    ),
  );
});

rmSync(commonJsDistDir, { recursive: true, force: true });
