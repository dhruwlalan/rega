import R from 'ramda';
import { camelCaseToSnakeCase } from './utils';

export const createTypes = (actions) => {
   if (R.isNil(actions)) throw new Error('actions object cannot be empty');
   if (R.isEmpty(actions)) throw new Error('actions object cannot be empty');
   if (!R.is(Object, actions)) throw new Error('actions must be a valid object');

   return R.pipe(
      R.keys,
      R.map(camelCaseToSnakeCase),
      R.map((x) => [x, x]),
      R.fromPairs,
   )(actions);
};
