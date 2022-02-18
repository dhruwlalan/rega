import R from 'ramda';
import { camelCaseToSnakeCase, snakeCaseToCamelCase } from './utils';

export const createReducer = (initialState, actions) => {
   if (R.isNil(initialState)) throw new Error('initial state is required');
   if (R.isEmpty(initialState)) throw new Error('initial state is required');
   if (!R.is(Object, initialState)) throw new Error('initial state must be a valid object');
   if (R.isNil(actions)) throw new Error('actions object cannot be empty');
   if (R.isEmpty(actions)) throw new Error('actions object cannot be empty');
   if (!R.is(Object, actions)) throw new Error('actions must be a valid object');

   const handlers = R.pipe(
      R.keys,
      R.map(camelCaseToSnakeCase),
      R.reject(R.isNil),
      R.reject(R.isEmpty),
      R.map((a) => [
         a,
         (state, action) => state.merge(actions[snakeCaseToCamelCase(a)]({ ...action })),
      ]),
      R.fromPairs,
   )(actions);

   return (state = initialState, action = null) => {
      if (R.isNil(action)) return state;
      if (R.isEmpty(action)) return state;
      if (!R.has('type', action)) return state;

      const handler = handlers[action.type];
      if (R.isNil(handler)) return state;
      if (R.isEmpty(handler)) return state;

      return handler(state, action);
   };
};
