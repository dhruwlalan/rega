import { R, camelCaseToSnakeCase } from './utils';

const checkArguments = (name, initialState, actions) => {
   if (R.isNil(name)) throw new Error('name is required');
   if (R.isEmpty(name)) throw new Error('name is required');
   if (!R.is(String, name)) throw new Error('name must be a valid string');

   if (R.isNil(initialState)) throw new Error('initialState is required');
   if (R.isEmpty(initialState)) throw new Error('initialState is required');
   if (!R.is(Object, initialState)) throw new Error('initialState must be a valid object');

   if (R.isNil(actions)) throw new Error('actions is required');
   if (R.isEmpty(actions)) throw new Error('actions is required');
   if (!R.is(Object, actions)) throw new Error('actions must be a valid object');
};

const checkForTheArgumentsKey = (name, action) => {
   if (!R.has('arguments')(action)) {
      throw new Error(`action [${name}] must contain an arguments key!`);
   }
};

const checkExpectedArguments = (name, expectedArguments) => {
   if (!R.is(Array, expectedArguments)) {
      throw new Error(`action [${name}].arguments must be an array!`);
   }
   if (!R.isEmpty(expectedArguments)) {
      R.forEach((arg) => {
         if (!R.is(String, arg)) {
            throw new Error(`action [${name}].arguments must be an array of strings!`);
         }
         if (R.isEmpty(arg)) {
            throw new Error(`action [${name}].arguments array should not contain empty strings`);
         }
      }, expectedArguments);
   }
};

const checkProvidedArguments = (name, providedArguments, expectedArguments) => {
   if (R.isEmpty(expectedArguments)) {
      if (providedArguments.length) {
         throw new Error(`action [${name}] expects no arguments, but recieved some arguments!`);
      }
   } else {
      if (R.isEmpty(providedArguments)) {
         throw new Error(`action [${name}] expects some arguments, but passed none!`);
      }
      if (providedArguments.length > 1) {
         throw new Error(
            `action [${name}] expects only a single argument, but passed more than one!`,
         );
      }

      const [providedArgument] = providedArguments;

      if (!R.is(Object, providedArgument)) {
         throw new Error(
            `action [${name}] expects an argument of type object, but passed a diffirent type!`,
         );
      }

      const providedArgumentKeys = R.keys(providedArgument);
      const expectedArgumentKeys = expectedArguments;

      const missingKeys = R.difference(expectedArgumentKeys, providedArgumentKeys);
      if (!R.isEmpty(missingKeys)) {
         throw new Error(`action [${name}] didnt recieved these args: ${missingKeys}`);
      }

      const extraKeys = R.difference(providedArgumentKeys, expectedArgumentKeys);
      if (!R.isEmpty(extraKeys)) {
         throw new Error(`action [${name}] recieved with extra agrs: ${extraKeys}`);
      }
   }
};

export const createActions = (name, initialState, actions) => {
   // actions should always be an object
   checkArguments(name, initialState, actions);

   const actionCreators = R.mapObjIndexed((_, name) => {
      const type = camelCaseToSnakeCase(name);
      const action = actions[name];

      // action object should always contain the 'arguments' key:
      checkForTheArgumentsKey(name, action);

      const expectedArguments = action.arguments;

      // expectedArguments must always be an array of non-empty strings:
      checkExpectedArguments(name, expectedArguments);

      const actionCreatorFunction = (...providedArguments) => {
         // check the providedArguments against the expectedArguments
         checkProvidedArguments(name, providedArguments, expectedArguments);

         const actionObject = { type };
         expectedArguments.forEach((arg) => {
            actionObject[arg] = providedArguments[0][arg];
         });
         return actionObject;
      };

      return actionCreatorFunction;
   })(actions);

   actionCreators.reset = () => ({
      type: `RESET_${camelCaseToSnakeCase(name)}`,
   });

   return actionCreators;
};
