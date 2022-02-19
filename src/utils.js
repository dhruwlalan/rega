import R from 'ramda';

export const camelCaseToSnakeCase = R.pipe(
   R.replace(/(?!^)([A-Z][a-z0-9]+|[A-Z][A-Z0-9]*(?=[A-Z]|\b))/g, '_$1'),
   R.toUpper,
);

export const snakeCaseToCamelCase = R.pipe(
   R.toLower,
   R.replace(/([_][a-z])/g, (group) => R.toUpper(group).replace('_', '')),
);

export const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export const checkArgs = (actionName, providedArguments, expectedArguments) => {
   console.log({ providedArguments, expectedArguments });

   // 1. expectedArguments
   if (R.isEmpty(expectedArguments) && !R.isNil(providedArguments[0])) {
      throw new Error(`action [${actionName}] expects no arguments, but recieved some arguments!`);
   }

   // providedArguments should only contain a single argument, that too of type object
   // if (providedArguments.length > 1) {
   //    throw new Error(`action [${actionName}] should be only passed with a single argument!`);
   // }

   // if (R.isEmpty(expectedArguments) && R.isNil(providedArguments[0])) return true;
   // if (R.isEmpty(expectedArguments) && R.isEmpty(providedArguments[0])) return true;

   // if (
   //    R.isEmpty(expectedArguments) &&
   //    !R.isEmpty(providedArguments[0]) &&
   //    !R.isNil(providedArguments[0])
   // ) {
   //    throw new Error(`action [${actionName}] expects no arguments, but recieved some arguments!`);
   // }

   // const argsObject = providedArguments[0];

   // if (!R.is(Object, providedArguments[0])) {
   //    throw new Error(`action [${actionName}] not passed with an argument of type object!`);
   // }

   return true;
};

// actionArgsObject = {
//    foo: '1',
//    bar: '2',
// },
// expectedArguments: [foo, bar]
