import * as esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import path from 'path';

import { baseBrowserBuildConfig, baseNodeBuildConfig, basePlugins, basePluginsForBrowser } from 'shared-for-build';

type Mode = 'production' | 'node-dev' | 'browser-dev' | 'development';

export const modeEnv: Mode = process.env.MODE as Mode;

if (!modeEnv) {
  throw new Error('MODE environment variable is required');
}

export const production = modeEnv === 'production';
export const distDir = path.resolve(__dirname, 'dist');
export const srcDir = path.resolve(__dirname, 'src');

const tsconfig = path.resolve(__dirname, production ? 'tsconfig.json' : 'tsconfig.dev.json');


const pluginsForBrowser: esbuild.Plugin[] = [
  ...basePlugins({
    production,
    src: srcDir,
    out: distDir,
    tsconfig
  }),
  ...basePluginsForBrowser
];


const buildOptionsForBrowser = (composedEntries: string[]): esbuild.BuildOptions => ({
  ...baseBrowserBuildConfig,
  entryPoints: composedEntries,
  sourcemap: !production,
  minify: production,
  outdir: path.resolve(distDir, 'browser'),
  plugins: pluginsForBrowser,
});


const pluginsForNode: esbuild.Plugin[] = [
  ...basePlugins({
    production,
    src: srcDir,
    out: distDir,
    tsconfig
  }),
  nodeExternalsPlugin({
    packagePath: path.resolve(__dirname, 'package.json'),
  })
];

const buildOptionsForNode = (composedEntries: string[]): esbuild.BuildOptions => ({
  ...baseNodeBuildConfig,
  entryPoints: composedEntries,
  sourcemap: !production,
  minify: production,
  outdir: path.resolve(distDir, 'node'),
  plugins: pluginsForNode,
})

type Handlers = Record<Mode, (composedEntries: string[]) => Promise<void>>;

export const handlers: Handlers = {
  production: async (composedEntries) => {
    await Promise.all([
      esbuild.build(buildOptionsForNode(composedEntries)),
      esbuild.build(buildOptionsForBrowser(composedEntries)),
    ]);
    console.log('🚀 Production build completed (node + browser)');
  },
  'node-dev': async (composedEntries) => {
    const ctx = await esbuild.context(buildOptionsForNode(composedEntries));
    await ctx.watch({ delay: 70 });
    console.log('👀 Watching Node build...');
  },
  'browser-dev': async (composedEntries) => {
    const ctx = await esbuild.context(buildOptionsForBrowser(composedEntries));
    await ctx.watch({ delay: 70 });
    console.log('👀 Watching Browser build...');
  },
  development: async (composedEntries) => {
    const [ctxNode, ctxBrowser] = await Promise.all([
      esbuild.context(buildOptionsForNode(composedEntries)),
      esbuild.context(buildOptionsForBrowser(composedEntries)),
    ]);
    await Promise.all([ctxNode.watch(), ctxBrowser.watch()]);
    console.log('👀 Watching Node + Browser builds in parallel...');
  },
};