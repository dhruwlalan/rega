import { createTypes } from '../createTypes';
import R from 'ramda';

describe('createTypes', () => {
   describe('checking arguments', () => {
      describe('when passed invalid arguments', () => {
         it('should throw an error', () => {
            expect(() => createTypes()).toThrow();
            expect(() => createTypes('one')).toThrow();
            expect(() => createTypes({})).toThrow();
            expect(() => createTypes([])).toThrow();
            expect(() => createTypes({}, '')).toThrow();
            expect(() => createTypes({}, 'baz')).toThrow();
         });
      });
      describe('when passed valid arguments', () => {
         it('should not throw an error', () => {
            expect(() => createTypes({ fetchSomething: () => null })).not.toThrow();
         });
      });
   });

   describe('checking the created types object', () => {
      const types = createTypes({
         fetchSomething: () => ({}),
         fetchSomethingDone: () => ({}),
      });

      const keys = R.keys(types);
      const values = R.values(types);

      it('should have types for all the actions present in the actions object', () => {
         expect(keys.includes('FETCH_SOMETHING')).toBe(true);
         expect(keys.includes('FETCH_SOMETHING_DONE')).toBe(true);
      });

      it('should not have types for any action not present in the actions object', () => {
         expect(keys.includes('FETCH_SOMETHING_DIFFERENT')).toBe(false);
      });

      it('should have the right keys and values for all the actions', () => {
         expect(keys[0]).toBe('FETCH_SOMETHING');
         expect(values[0]).toBe('FETCH_SOMETHING');
         expect(keys[1]).toBe('FETCH_SOMETHING_DONE');
         expect(values[1]).toBe('FETCH_SOMETHING_DONE');
      });
   });
});
