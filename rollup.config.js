import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import browsersync from 'rollup-plugin-browsersync';
import { name, description, license, version } from './package.json';

const banner = `
/**
 * ${name} @${version}
 * @description ${description}
 * @license ${license}
 * @preserve
 */
`

export default [{
  input: 'src/index.js',
  output: {
    file: 'dist/wms-capabilities.js',
    format: 'umd',
    name: 'WMSCapabilities',
    sourcemap: true,
    banner
  },
  plugins: [
    buble(),
  ]
}, {
  input: 'src/index.js',
  output: {
    file: 'dist/wms-capabilities.min.js',
    format: 'umd',
    name: 'WMSCapabilities',
    sourcemap: true,
    banner
  },
  plugins: [
    buble(),
    compiler({
    })
  ]
}, {
  input: 'example/js/app.js',
  output: {
    file: 'example/js/bundle.js',
    format: 'iife'
  },
  plugins: [
    (process.argv[2].indexOf('w') !== -1)
      ? browsersync({
        server: '.',
        port: 3002
      }) : null,
    nodeResolve(),
    commonjs(),
    buble(),
  ]
}];
