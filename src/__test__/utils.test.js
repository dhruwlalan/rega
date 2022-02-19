import { snakeCaseToCamelCase, camelCaseToSnakeCase, capitalize } from '../utils';

describe('snakeCaseToCamelCase', () => {
   it('converts screeming snake case to camel case', () => {
      const str = 'SCREEMING_SNAKE_CASE_STRING';
      expect(snakeCaseToCamelCase(str)).toBe('screemingSnakeCaseString');
   });
});

describe('camelCaseToSnakeCase', () => {
   test('converts camel case to screeming snake case', () => {
      const str = 'screemingSnakeCaseString';
      expect(camelCaseToSnakeCase(str)).toBe('SCREEMING_SNAKE_CASE_STRING');
   });
});

describe('capitalize', () => {
   test('capitlize first letter of string', () => {
      const str = 'helloWorld';
      expect(capitalize(str)).toBe('HelloWorld');
   });
});
