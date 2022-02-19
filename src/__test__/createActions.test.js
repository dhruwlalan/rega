import { createActions } from '../createActions';
import R from 'ramda';

describe('createActions', () => {
   describe('checking arguments', () => {
      describe('when passed invalid arguments', () => {
         it('should throw an error', () => {
            expect(() => createActions()).toThrow();
            expect(() => createActions('one')).toThrow();
            expect(() => createActions({})).toThrow();
            expect(() => createActions([])).toThrow();
            expect(() => createActions({}, '')).toThrow();
            expect(() => createActions({}, 'baz')).toThrow();
         });
      });
      describe('when passed valid arguments', () => {
         it('should not throw an error', () => {
            expect(() => createActions({ fetchSomething: { arguments: ['foo'] } })).not.toThrow();
         });
      });
   });

   const actions = createActions({
      fetchSomething: { arguments: [] },
      fetchSomethingDone: { arguments: ['foo', 'bar'] },
   });

   describe('checking the actions object', () => {
      it('should have correct action names', () => {
         const keys = R.keys(actions);
         expect(keys.includes('fetchSomething')).toBe(true);
         expect(keys.includes('fetchSomethingDone')).toBe(true);
         expect(keys.includes('unknownAction')).toBe(false);
      });
      it('should have correct action values', () => {
         expect(typeof actions.fetchSomething).toBe('function');
         expect(typeof actions.fetchSomethingDone).toBe('function');
         expect(typeof actions.unknownAction).toBe('undefined');
      });
   });

   describe('checking the expectedArguments key', () => {
      describe('when not present', () => {
         it('should throw an error', () => {
            expect(() => createActions({ fetchSomething: {} })).toThrowError({
               message: 'action [fetchSomething] must contain an arguments key!',
            });
         });
      });
      describe('when present', () => {
         it('should not throw an error', () => {
            expect(() => createActions({ fetchSomething: { arguments: [] } })).not.toThrow();
         });
      });
   });

   describe('checking the expectedArguments value', () => {
      describe('when it is not an array', () => {
         it('should throw an error', () => {
            expect(() => createActions({ fetchSomething: { arguments: null } })).toThrowError({
               message: 'action [fetchSomething].arguments must be an array!',
            });
            expect(() => createActions({ fetchSomething: { arguments: true } })).toThrowError({
               message: 'action [fetchSomething].arguments must be an array!',
            });
            expect(() => createActions({ fetchSomething: { arguments: {} } })).toThrowError({
               message: 'action [fetchSomething].arguments must be an array!',
            });
         });
      });
      describe('when it is an array', () => {
         describe('when it is empty', () => {
            it('should not throw an error', () => {
               expect(() => createActions({ fetchSomething: { arguments: [] } })).not.toThrow();
            });
         });
         describe('when it contains values of different types', () => {
            it('should throw an error', () => {
               expect(() => createActions({ fetchSomething: { arguments: [3] } })).toThrowError({
                  message: 'action [fetchSomething].arguments must be an array of strings!',
               });
               expect(() => createActions({ fetchSomething: { arguments: [true] } })).toThrowError({
                  message: 'action [fetchSomething].arguments must be an array of strings!',
               });
               expect(() =>
                  createActions({ fetchSomething: { arguments: [{ foo: 'bar' }] } }),
               ).toThrowError({
                  message: 'action [fetchSomething].arguments must be an array of strings!',
               });
            });
         });
         describe('when it contains any empty string', () => {
            it('should throw an error', () => {
               expect(() => createActions({ fetchSomething: { arguments: [''] } })).toThrowError({
                  message:
                     'action [fetchSomething].arguments array should not contain empty strings',
               });
               expect(() =>
                  createActions({ fetchSomething: { arguments: ['a', '', 'b'] } }),
               ).toThrowError({
                  message:
                     'action [fetchSomething].arguments array should not contain empty strings',
               });
            });
         });
         describe('when all the values are non-empty strings', () => {
            it('should not throw an error', () => {
               expect(() => createActions({ fetchSomething: { arguments: ['a'] } })).not.toThrow();
               expect(() =>
                  createActions({ fetchSomething: { arguments: ['a', 'foo'] } }),
               ).not.toThrow();
            });
         });
      });
   });

   describe('when expectedArguments is an empty array', () => {
      describe('when providedArguments is also empty', () => {
         it('should create an action with just the type property', () => {
            expect(actions.fetchSomething()).toStrictEqual({ type: 'FETCH_SOMETHING' });
         });
         it('should not throw an error', () => {
            expect(() => actions.fetchSomething()).not.toThrow();
         });
      });
      describe('when providedArguments is not empty', () => {
         it('should throw an error', () => {
            expect(() => actions.fetchSomething({})).toThrow({
               message:
                  'action [fetchSomething] expects no arguments, but recieved some arguments!',
            });
            expect(() => actions.fetchSomething({}, 'a')).toThrow({
               message:
                  'action [fetchSomething] expects no arguments, but recieved some arguments!',
            });
            expect(() => actions.fetchSomething('foo')).toThrow({
               message:
                  'action [fetchSomething] expects no arguments, but recieved some arguments!',
            });
            expect(() => actions.fetchSomething(null)).toThrow({
               message:
                  'action [fetchSomething] expects no arguments, but recieved some arguments!',
            });
            expect(() => actions.fetchSomething(undefined)).toThrow({
               message:
                  'action [fetchSomething] expects no arguments, but recieved some arguments!',
            });
         });
      });
   });

   describe('when there are some expectedArguments', () => {
      describe('when providedArguments is empty', () => {
         it('should throw an error', () => {
            expect(() => actions.fetchSomethingDone()).toThrow({
               message: 'action [fetchSomethingDone] expects some arguments, but passed none!',
            });
         });
      });
      describe('when there are also some providedArguments', () => {
         it('should throw an error if there are more than 1 providedArguments', () => {
            expect(() => actions.fetchSomethingDone('', '')).toThrow({
               message:
                  'action [fetchSomethingDone] expects only a single argument, but passed more than one!',
            });
         });
      });
      describe('when there is only one providedArgument', () => {
         it('should throw an error if providedArgument is not an object', () => {
            expect(() => actions.fetchSomethingDone('')).toThrow({
               message:
                  'action [fetchSomethingDone] expects an argument of type object, but passed a diffirent type!',
            });
            expect(() => actions.fetchSomethingDone(null)).toThrow({
               message:
                  'action [fetchSomethingDone] expects an argument of type object, but passed a diffirent type!',
            });
            expect(() => actions.fetchSomethingDone(undefined)).toThrow({
               message:
                  'action [fetchSomethingDone] expects an argument of type object, but passed a diffirent type!',
            });
         });
         it('should throw an error if the providedArgument is missing some keys', () => {
            expect(() => actions.fetchSomethingDone({})).toThrow({
               message: 'action [fetchSomethingDone] didnt recieved these args: foo,bar',
            });
            expect(() => actions.fetchSomethingDone({ foo: 29 })).toThrow({
               message: 'action [fetchSomethingDone] didnt recieved these args: bar',
            });
            expect(() => actions.fetchSomethingDone({ foo: 29, boo: 'hii', zoo: true })).toThrow({
               message: 'action [fetchSomethingDone] didnt recieved these args: bar',
            });
         });
         it('should throw an error if the providedArgument is passing extra keys', () => {
            expect(() => actions.fetchSomethingDone({ foo: 'Foo', bar: 2, zoo: true })).toThrow({
               message: 'action [fetchSomethingDone] recieved with extra agrs: zoo',
            });
            expect(() =>
               actions.fetchSomethingDone({ foo: 'Foo', bar: true, zoo: true, loo: {} }),
            ).toThrow({
               message: 'action [fetchSomethingDone] recieved with extra agrs: zoo,loo',
            });
         });
      });
   });

   describe('when the providedArgument equals expectedArguments', () => {
      it('should not throw an error', () => {
         expect(() => actions.fetchSomethingDone({ foo: 'yes', bar: true })).not.toThrow();
      });
      it('should return the correct action object', () => {
         expect(actions.fetchSomething()).toStrictEqual({ type: 'FETCH_SOMETHING' });
         expect(actions.fetchSomethingDone({ foo: 'yes', bar: true })).toStrictEqual({
            type: 'FETCH_SOMETHING_DONE',
            foo: 'yes',
            bar: true,
         });
         expect(actions.fetchSomethingDone({ foo: {}, bar: [] })).toStrictEqual({
            type: 'FETCH_SOMETHING_DONE',
            foo: {},
            bar: [],
         });
         expect(
            actions.fetchSomethingDone({ foo: { yes: 'YAA' }, bar: [{ is: false }] }),
         ).toStrictEqual({
            type: 'FETCH_SOMETHING_DONE',
            foo: { yes: 'YAA' },
            bar: [{ is: false }],
         });
         expect(actions.fetchSomethingDone({ foo: null, bar: undefined })).toStrictEqual({
            type: 'FETCH_SOMETHING_DONE',
            foo: null,
            bar: undefined,
         });
      });
   });
});
