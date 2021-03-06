import { R, camelCaseToSnakeCase, snakeCaseToCamelCase } from './utils';

const checkInitialStateAndActionsObject = (initialState, actions) => {
   if (R.isNil(initialState)) throw new Error('initial state is required');
   if (R.isEmpty(initialState)) throw new Error('initial state is required');
   if (!R.is(Object, initialState)) throw new Error('initial state must be a valid object');
   if (R.isNil(actions)) throw new Error('actions object cannot be empty');
   if (R.isEmpty(actions)) throw new Error('actions object cannot be empty');
   if (!R.is(Object, actions)) throw new Error('actions must be a valid object');
};

const extractAllReducers = (actions) => {
   const reducers = {};
   R.forEachObjIndexed((value, key) => {
      if (R.has('reducer')(actions[key])) {
         reducers[key] = value.reducer;
      }
   })(actions);
   return reducers;
};

const checkProvidedArguments = (name, providedArguments, expectedArguments) => {
   const providedArgumentKeys = R.keys(providedArguments);
   const expectedArgumentKeys = expectedArguments;

   const extraKeys = R.difference(providedArgumentKeys, expectedArgumentKeys);
   if (!R.isEmpty(extraKeys)) {
      throw new Error(`reducer [${name}] recieved with extra agrs: ${extraKeys}`);
   }
};

export const createReducer = (initialState, actions, name) => {
   checkInitialStateAndActionsObject(initialState, actions);

   const reducers = extractAllReducers(actions);

   const handlers = R.pipe(
      R.keys,
      R.map(camelCaseToSnakeCase),
      R.map((a) => [
         a,
         (state, action) => {
            const expectedArguments = actions[snakeCaseToCamelCase(a)].arguments;
            const providedArguments = R.dissoc('type', action);
            checkProvidedArguments(snakeCaseToCamelCase(a), providedArguments, expectedArguments);
            return state.merge(reducers[snakeCaseToCamelCase(a)]({ ...action }));
         },
      ]),
      R.fromPairs,
   )(reducers);

   handlers[`RESET_${camelCaseToSnakeCase(name)}`] = () => initialState;

   R.mapObjIndexed((_, key) => {
      handlers[`SET_${camelCaseToSnakeCase(name)}_${camelCaseToSnakeCase(key)}`] = (
         state,
         action,
      ) => {
         if (!R.has(key)(action)) {
            throw new Error(
               `reducer [${name}] passing with action [${`SET_${camelCaseToSnakeCase(
                  name,
               )}_${camelCaseToSnakeCase(key)}`}] should be passed with ${key}`,
            );
         }
         return state.merge({
            [key]: action[key],
         });
      };
   })(initialState);

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
