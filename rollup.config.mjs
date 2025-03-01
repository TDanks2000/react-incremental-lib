import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import packageJson from './package.json' with { type: 'json' };

const INPUT_FILE = 'src/index.ts';

const mainBuild = {
  input: INPUT_FILE,
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    del({ targets: 'dist/*', hook: 'buildStart' }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    esbuild({
      target: 'es2020',
      minify: true,
    }),
  ],
};

const dtsBuild = {
  input: INPUT_FILE,
  output: [
    {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
  ],
  plugins: [dts()],
};

export default [mainBuild, dtsBuild];
