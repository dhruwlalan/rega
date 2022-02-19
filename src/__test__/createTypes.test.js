import { createTypes } from '../createTypes';
import R from 'ramda';

describe('createTypes', () => {
   describe('arguments', () => {
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

   describe('created types object', () => {
      it('should have right keys and values', () => {
         const types = createTypes({
            fetchSomething: () => ({}),
            fetchSomethingDone: () => ({}),
         });

         const keys = R.keys(types);
         const values = R.values(types);

         expect(keys[0]).toBe('FETCH_SOMETHING');
         expect(values[0]).toBe('FETCH_SOMETHING');

         expect(keys[1]).toBe('FETCH_SOMETHING_DONE');
         expect(values[1]).toBe('FETCH_SOMETHING_DONE');
      });
   });
});
