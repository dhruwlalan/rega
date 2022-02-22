import Immutable from 'seamless-immutable';
import { createSelectors } from './createSelectors';
import { createTypes } from './createTypes';
import { createActions } from './createActions';
import { createReducer } from './createReducer';
import { createSaga } from './createSaga';
import { R, capitalize } from './utils';

export const rega = ({ name, initialState, actions }) => {
   if (R.isNil(name)) throw new Error('name is required');
   if (R.isEmpty(name)) throw new Error('name is required');
   if (!R.is(String, name)) throw new Error('name must be a valid string');

   if (R.isNil(initialState)) throw new Error('initialState is required');
   if (R.isEmpty(initialState)) throw new Error('initialState is required');
   if (!R.is(Object, initialState)) throw new Error('initialState must be a valid object');

   if (R.isNil(actions)) throw new Error('actions is required');
   if (R.isEmpty(actions)) throw new Error('actions is required');
   if (!R.is(Object, actions)) throw new Error('actions must be a valid object');

   const INITIAL_STATE = Immutable(initialState);
   const reducerName = capitalize(name);

   return {
      [`${reducerName}Types`]: createTypes(actions),
      [`${reducerName}Selectors`]: createSelectors(INITIAL_STATE, name),
      [`${reducerName}Actions`]: createActions(name, INITIAL_STATE, actions),
      [`${reducerName}Reducer`]: createReducer(INITIAL_STATE, actions, name),
      [`${reducerName}Saga`]: createSaga(actions),
   };
};

export { createRouterSaga } from './createRouterSaga';
