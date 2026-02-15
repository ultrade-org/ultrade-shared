import path from 'path';
import { glob } from 'glob';

import { cleanDistSync } from 'shared-for-build';

import {
    handlers,
    distDir,
    srcDir,
    modeEnv,
    production,
} from './build.helper';

(async () => {
  const fixedEntries = glob.sync(path.resolve(srcDir, '*/index.ts'));
  const helpersEntries = glob.sync(path.resolve(srcDir, 'helpers/**/*.ts'));
  const helpersCodexEntries = glob.sync(path.resolve(srcDir, 'helpers/codex/index.ts'));
  const specialEntries = glob.sync(path.resolve(srcDir, 'constants/env.ts'));

  const composedEntries = [
    ...fixedEntries,
    ...helpersEntries,
    ...helpersCodexEntries,
    ...specialEntries
  ];

  cleanDistSync(production, distDir);

  try {
    await handlers[modeEnv](composedEntries);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
})();
