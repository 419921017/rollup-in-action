import pluginBabel from 'rollup-plugin-babel';
import pluginResolveNode from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginTypescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pluginPostcss from 'rollup-plugin-postcss';
import pluginServe from 'rollup-plugin-serve';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'bundleName',
    // exports: 'auto',
    globals: {
      // 直接从window下面取
      lodash: '_', // window._
      jQuery: '$', // window.$
    },
  },
  plugins: [
    pluginBabel({ exclude: 'node_modules/**' }),
    pluginResolveNode(),
    pluginCommonjs(),
    pluginTypescript({}),
    pluginPostcss(),
    terser(),
    pluginServe({ open: true, port: 8088, contentBase: './dist' }),
  ],
  external: ['lodash', 'jQuery'],
};
