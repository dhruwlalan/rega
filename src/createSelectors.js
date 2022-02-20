import { createSelector } from 'reselect';
import { R } from './utils';

export const createSelectors = (initialState, reducerName) => {
   if (R.isNil(initialState)) throw new Error('initialState cannot be empty');
   if (R.isEmpty(initialState)) throw new Error('initialState cannot be empty');
   if (!R.is(Object, initialState)) throw new Error('initialState must be a valid object');
   if (R.isNil(reducerName)) throw new Error('reducerName cannot be empty');
   if (R.isEmpty(reducerName)) throw new Error('reducerName cannot be empty');
   if (!R.is(String, reducerName)) throw new Error('reducerName must be a valid string');

   return R.mapObjIndexed((_num, key) => {
      return createSelector(
         (state) => state[reducerName],
         (state) => state[key],
      );
   })(initialState);
};
