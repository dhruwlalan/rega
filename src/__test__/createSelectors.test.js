import R from 'ramda';

import { createSelectors } from '../createSelectors';

describe('createSelectors', () => {
   describe('arguments', () => {
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

   describe('created selectors object', () => {
      test('creates an object of selectors from initial state', () => {
         const selectors = createSelectors({ foo: '', bar: '' }, 'state');

         const keys = R.keys(selectors);

         expect(keys.includes('foo')).toBe(true);
         expect(keys.includes('bar')).toBe(true);
         expect(keys.includes('boo')).toBe(false);

         expect(typeof selectors.foo).toBe('function');
         expect(typeof selectors.bar).toBe('function');

         expect(selectors.foo.name).toBe('memoized');
         expect(selectors.bar.name).toBe('memoized');
      });
   });
});
