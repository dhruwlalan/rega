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
