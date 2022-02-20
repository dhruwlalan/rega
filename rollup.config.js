import { babel } from '@rollup/plugin-babel';
import ramda from 'rollup-plugin-ramda';
import filesize from 'rollup-plugin-filesize';

const ramdaFns = [
   'isNil',
   'isEmpty',
   'is',
   'pipe',
   'replace',
   'toUpper',
   'toLower',
   'has',
   'forEach',
   'keys',
   'difference',
   'mapObjIndexed',
   'forEachObjIndexed',
   'map',
   'dissoc',
   'fromPairs',
].map((fn) => `ramda/src/${fn}`);

export default {
   input: 'src/rega.js',
   plugins: [
      babel({
         babelHelpers: 'bundled',
         babelrc: false,
         presets: [['@babel/preset-env', { modules: false }]],
      }),
      ramda(),
      filesize(),
   ],
   external: [...ramdaFns, 'reselect', 'seamless-immutable', 'redux-saga', 'redux-saga/effects'],
   output: {
      file: 'dist/rega.js',
      format: 'cjs',
   },
};
