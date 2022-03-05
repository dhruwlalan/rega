import qs from 'qs';
import Route from 'route-parser';
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

export function matchRoute(expectedPattern, actualPath) {
   let match = true;
   const splitExpectedPattern = expectedPattern.split('/');
   const splitActualPath = actualPath.split('/');
   if (splitExpectedPattern.length !== splitActualPath.length) {
      return false;
   }
   for (let i = 0; i < splitExpectedPattern.length; i += 1) {
      if (!splitExpectedPattern[i].includes(':')) {
         match = match && splitExpectedPattern[i] === splitActualPath[i];
      }
   }
   return match;
}

export function getParams(location) {
   const options = { ignoreQueryPrefix: true };
   const queryParams = qs.parse(location.search, options);
   const route = new Route(location.pathname);
   const routeParams = route.match(location.pathname);
   return { queryParams, routeParams };
}

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
