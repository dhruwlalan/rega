import { babel } from '@rollup/plugin-babel';
import ramda from 'rollup-plugin-ramda';
import filesize from 'rollup-plugin-filesize';

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
   external: ['ramda', 'reselect', 'seamless-immutable'],
   output: {
      file: 'dist/rega.js',
      format: 'cjs',
   },
};
