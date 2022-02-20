import R from 'ramda';
import { takeLatest } from 'redux-saga/effects';
import { camelCaseToSnakeCase } from './utils';

export const createSaga = (actions) => {
   if (R.isNil(actions)) throw new Error('actions object cannot be empty');
   if (R.isEmpty(actions)) throw new Error('actions object cannot be empty');
   if (!R.is(Object, actions)) throw new Error('actions must be a valid object');

   const sagas = {};
   R.forEachObjIndexed((value, key) => {
      const type = camelCaseToSnakeCase(key);
      if (R.has('saga')(actions[key])) {
         sagas[type] = Object.defineProperty(
            function* () {
               yield takeLatest(type, value.saga);
            },
            'name',
            { value: `${key}Watcher` },
         );
      }
   })(actions);
   return sagas;
};
