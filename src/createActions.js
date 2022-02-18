import R from 'ramda';
import { camelCaseToSnakeCase } from './utils';

export const createActions = (actions) => {
   if (R.isNil(actions)) throw new Error('actions object cannot be empty');
   if (R.isEmpty(actions)) throw new Error('actions object cannot be empty');
   if (!R.is(Object, actions)) throw new Error('actions must be a valid object');

   return R.mapObjIndexed((_num, key) => {
      const type = camelCaseToSnakeCase(key);
      const action = (...args) => {
         let actionObject = {};
         if (actions[key].length) actionObject = { ...args[0] };
         actionObject.type = type;
         return actionObject;
      };
      return action;
   })(actions);
};
