import { takeLatest, fork } from 'redux-saga/effects';
import { R, camelCaseToSnakeCase } from './utils';

export const createSagas = (actions) => {
   if (R.isNil(actions)) throw new Error('actions object cannot be empty');
   if (R.isEmpty(actions)) throw new Error('actions object cannot be empty');
   if (!R.is(Object, actions)) throw new Error('actions must be a valid object');

   const sagas = [];
   R.forEachObjIndexed((value, key) => {
      const type = camelCaseToSnakeCase(key);
      if (R.has('saga')(actions[key])) {
         sagas.push(
            Object.defineProperty(
               function* () {
                  yield takeLatest(type, value.saga);
               },
               'name',
               { value: `${key}Watcher` },
            ),
         );
      }
   })(actions);
   const sagasList = sagas.map(fork);

   return sagasList;
};
