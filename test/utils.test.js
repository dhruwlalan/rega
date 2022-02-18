import test from 'ava';
import { snakeCaseToCamelCase, camelCaseToSnakeCase, capitalize } from '../src/utils';

test('converts screeming snake case to camel case', (t) => {
   const str = 'SCREEMING_SNAKE_CASE_STRING';
   t.is(snakeCaseToCamelCase(str), 'screemingSnakeCaseString');
});

test('converts camel case to screeming snake case', (t) => {
   const str = 'screemingSnakeCaseString';
   t.is(camelCaseToSnakeCase(str), 'SCREEMING_SNAKE_CASE_STRING');
});

test('capitlize first letter of string', (t) => {
   const str = 'helloWorld';
   t.is(capitalize(str), 'HelloWorld');
});
