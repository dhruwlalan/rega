import {
   isNil,
   isEmpty,
   is,
   pipe,
   replace,
   toUpper,
   toLower,
   has,
   forEach,
   keys,
   difference,
   mapObjIndexed,
   forEachObjIndexed,
   map,
   dissoc,
   fromPairs,
} from 'ramda';

export const camelCaseToSnakeCase = pipe(
   replace(/(?!^)([A-Z][a-z0-9]+|[A-Z][A-Z0-9]*(?=[A-Z]|\b))/g, '_$1'),
   toUpper,
);

export const snakeCaseToCamelCase = pipe(
   toLower,
   replace(/([_][a-z])/g, (group) => toUpper(group).replace('_', '')),
);

export const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export const R = {
   isNil,
   isEmpty,
   is,
   pipe,
   replace,
   toUpper,
   toLower,
   has,
   forEach,
   keys,
   difference,
   mapObjIndexed,
   forEachObjIndexed,
   map,
   dissoc,
   fromPairs,
};
