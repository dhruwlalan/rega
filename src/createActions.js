import R from 'ramda';
import { camelCaseToSnakeCase, checkArgs } from './utils';

export const createActions = (actions) => {
   if (R.isNil(actions)) throw new Error('actions object cannot be empty');
   if (R.isEmpty(actions)) throw new Error('actions object cannot be empty');
   if (!R.is(Object, actions)) throw new Error('actions must be a valid object');

   return R.mapObjIndexed((_num, key) => {
      const type = camelCaseToSnakeCase(key);

      // action object should always contain the 'arguments' key:
      if (!R.has('arguments')(actions[key])) {
         throw new Error(`action [${key}] must contain an arguments key!`);
      }

      const expectedArguments = actions[key].arguments;

      // expectedArguments must always be an array of non-empty strings:
      if (!R.is(Array, expectedArguments)) {
         throw new Error(`action [${key}].arguments must be an array!`);
      }
      if (!R.isEmpty(expectedArguments)) {
         R.forEach((arg) => {
            if (!R.is(String, arg)) {
               throw new Error(`action [${key}].arguments must be an array of strings!`);
            }
            if (R.isEmpty(arg)) {
               throw new Error(`action [${key}].arguments array should not contain empty strings`);
            }
         }, expectedArguments);
      }

      const action = (...providedArguments) => {
         if (!checkArgs(key, providedArguments, expectedArguments)) {
            throw new Error(`action [${key}] contains invalid arguments!`);
         }

         const actionObject = { type };
         expectedArguments.forEach((arg) => {
            actionObject[arg] = providedArguments[0][arg];
         });
         return actionObject;
      };

      return action;
   })(actions);
};
