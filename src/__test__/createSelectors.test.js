import R from 'ramda';

import { createSelectors } from '../createSelectors';

describe('createSelectors', () => {
   describe('checking arguments', () => {
      describe('when passed invalid arguments', () => {
         it('should throw an error', () => {
            expect(() => createSelectors()).toThrow();
            expect(() => createSelectors()).toThrow();
            expect(() => createSelectors({})).toThrow();
            expect(() => createSelectors([])).toThrow();
            expect(() => createSelectors('one')).toThrow();
            expect(() => createSelectors({ foo: 'bar' })).toThrow();
            expect(() => createSelectors({ foo: 'bar' }, null)).toThrow();
            expect(() => createSelectors({ foo: 'bar' }, '')).toThrow();
            expect(() => createSelectors({ foo: 'bar' }, {})).toThrow();
            expect(() => createSelectors({ foo: 'bar' }, [])).toThrow();
         });
      });
      describe('when passed valid arguments', () => {
         it('should not throw an error', () => {
            expect(() => createSelectors({ foo: 'bar' }, 'baz')).not.toThrow();
         });
      });
   });

   describe('checking the created selectors object', () => {
      const selectors = createSelectors({ foo: '', bar: '' }, 'state');
      const keys = R.keys(selectors);

      it('should contain the names of all the variables present in the initial state', () => {
         expect(keys.includes('foo')).toBe(true);
         expect(keys.includes('bar')).toBe(true);
      });

      it('should not contain the names of any variable not present in the initial state', () => {
         expect(keys.includes('boo')).toBe(false);
      });

      it('should create the selectors of all the variables present in the initial state', () => {
         expect(typeof selectors.foo).toBe('function');
         expect(typeof selectors.bar).toBe('function');
         expect(selectors.foo.name).toBe('memoized');
         expect(selectors.bar.name).toBe('memoized');
      });
   });
});
