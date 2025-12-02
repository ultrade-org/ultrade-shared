import fs from 'fs';
import path from 'path';
import { cleanDistSync } from 'shared-for-build';

import {
    handlers,
    distDir,
    srcDir,
    modeEnv,
    production,
} from './build.helper';
import type { IEntryPoint } from './build.helper';


const getOutPath = (filePath: string): string =>
  path.relative(srcDir, filePath).replace(/\\/g, '/').replace(/\.ts$/, '');

const fixedEntries: IEntryPoint[] = [
  { in: path.resolve(srcDir, 'constants/index.ts'), out: getOutPath(path.resolve(srcDir, 'constants/index.ts')) },
  { in: path.resolve(srcDir, 'enums/index.ts'), out: getOutPath(path.resolve(srcDir, 'enums/index.ts')) },
  { in: path.resolve(srcDir, 'interfaces/index.ts'), out: getOutPath(path.resolve(srcDir, 'interfaces/index.ts')) },
  { in: path.resolve(srcDir, 'types/index.ts'), out: getOutPath(path.resolve(srcDir, 'types/index.ts')) },
];

/**
 * Recursively walks a directory, finds all .ts files (excluding .d.ts), 
 * and generates entry points.
 * @param {string} dir - The absolute path of the directory to scan.
 * @param {IEntryPoint[]} entries - Array to collect entry points.
 */
async function findInDir(dir: string, entries: IEntryPoint[] = []): Promise<IEntryPoint[]> {
  try {
    await fs.promises.access(dir);
  } catch {
    throw new Error(`Directory not found: ${dir}`);
  }

  const files = await fs.promises.readdir(dir, { withFileTypes: true });

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file.name);

      if (file.isDirectory()) {
        await findInDir(filePath, entries);
      } else if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
        entries.push({ in: filePath, out: getOutPath(filePath) });
      }
    })
  );

  return entries;
}

/**
 * Generates entry points for all files inside ./src/[folderName].
 * The entry key will look like: [folderName]/[subpath]/[filename]
 * @param {string} folderName - The folder name within src/ ('common' or 'helpers').
 */
async function getDynamicEntries(folderName: string): Promise<IEntryPoint[]> {
  const targetPath = path.resolve(srcDir, folderName);
  return findInDir(targetPath);
}

(async () => {

  const [commonEntries, helpersEntries] = await Promise.all([getDynamicEntries('common'), getDynamicEntries('helpers')]);

  const composedEntries = [
    ...fixedEntries,
    ...commonEntries,
    ...helpersEntries
  ];

  cleanDistSync(production, distDir);

  try {
    await handlers[modeEnv](composedEntries);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
})();
