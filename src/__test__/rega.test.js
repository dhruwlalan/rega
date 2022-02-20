import R from 'ramda';
import Immutable from 'seamless-immutable';
import { rega } from '../rega';

describe('rega', () => {
   describe('checking arguments', () => {
      const name = 'test';
      const initialState = { foo: 'bar' };
      const actions = { setFoo: { arguments: ['foo'], reducer: ({ foo }) => ({ foo }) } };

      describe('when passed invalid arguments', () => {
         it('should throw an error', () => {
            expect(() => rega()).toThrow();
            expect(() => rega({ name })).toThrow();
            expect(() => rega({ initialState })).toThrow();
            expect(() => rega({ actions })).toThrow();
            expect(() => rega({ name, initialState: {} })).toThrow();
            expect(() => rega({ name, initialState: {}, actions: {} })).toThrow();
            expect(() => rega({ name, initialState, actions: {} })).toThrow();
            expect(() => rega({ name, initialState: {}, actions })).toThrow();
            expect(() => rega({ name: '', initialState, actions })).toThrow();
            expect(() => rega({ name: {}, initialState, actions })).toThrow();
            expect(() => rega({ name: [], initialState, actions })).toThrow();
            expect(() => rega({ name: null, initialState, actions })).toThrow();
            expect(() => rega({ name: undefined, initialState, actions })).toThrow();
            expect(() => rega({ name, initialState: '', actions })).toThrow();
            expect(() => rega({ name, initialState: {}, actions })).toThrow();
            expect(() => rega({ name, initialState: [], actions })).toThrow();
            expect(() => rega({ name, initialState: null, actions })).toThrow();
            expect(() => rega({ name, initialState: undefined, actions })).toThrow();
            expect(() => rega({ name, initialState, actions: '' })).toThrow();
            expect(() => rega({ name, initialState, actions: {} })).toThrow();
            expect(() => rega({ name, initialState, actions: [] })).toThrow();
            expect(() => rega({ name, initialState, actions: null })).toThrow();
            expect(() => rega({ name, initialState, actions: undefined })).toThrow();
         });
      });
      describe('when passed valid arguments', () => {
         it('should not throw an error', () => {
            expect(() => rega({ name, initialState, actions })).not.toThrow();
         });
      });
   });

   const { SomeSelectors, SomeTypes, SomeActions, SomeReducer, SomeSaga } = rega({
      name: 'some',
      initialState: {
         something: null,
         isFetching: false,
         isFetchingDone: false,
      },
      actions: {
         fetchSomething: {
            arguments: [],
            reducer: () => ({
               something: 0,
               isFetching: true,
               isFetchingDone: false,
            }),
            saga: function* fetchSomething() {},
         },
         fetchSomethingDone: {
            arguments: ['something'],
            reducer: ({ something }) => ({
               something,
               isFetching: false,
               isFetchingDone: true,
            }),
         },
      },
   });
   const SomeSelectorsKeys = R.keys(SomeSelectors);
   const SomeTypesKeys = R.keys(SomeTypes);
   const SomeTypesValues = R.values(SomeTypes);
   const SomeActionsKeys = R.keys(SomeActions);
   const SomeSagaKeys = R.keys(SomeSaga);
   const InitialState = Immutable({
      something: null,
      isFetching: false,
      isFetchingDone: false,
   });

   describe('checking selectors', () => {
      it('should contain the names of all the variables present in the initial state', () => {
         expect(SomeSelectorsKeys.includes('something')).toBe(true);
         expect(SomeSelectorsKeys.includes('isFetching')).toBe(true);
         expect(SomeSelectorsKeys.includes('isFetchingDone')).toBe(true);
      });
      it('should not contain the names of any variable not present in the initial state', () => {
         expect(SomeSelectorsKeys.includes('isUnknown')).toBe(false);
      });
      it('should create the selectors of all the variables present in the initial state', () => {
         expect(typeof SomeSelectors.something).toBe('function');
         expect(typeof SomeSelectors.isFetching).toBe('function');
         expect(typeof SomeSelectors.isFetchingDone).toBe('function');
         expect(SomeSelectors.something.name).toBe('memoized');
         expect(SomeSelectors.isFetching.name).toBe('memoized');
         expect(SomeSelectors.isFetchingDone.name).toBe('memoized');
      });
   });

   describe('checking types', () => {
      it('should have types for all the actions present in the actions object', () => {
         expect(SomeTypesKeys.includes('FETCH_SOMETHING')).toBe(true);
         expect(SomeTypesKeys.includes('FETCH_SOMETHING_DONE')).toBe(true);
      });
      it('should not have types for any action not present in the actions object', () => {
         expect(SomeTypesKeys.includes('FETCH_SOMETHING_DIFFERENT')).toBe(false);
      });
      it('should have the right keys and values for all the actions', () => {
         expect(SomeTypesKeys[0]).toBe('FETCH_SOMETHING');
         expect(SomeTypesValues[0]).toBe('FETCH_SOMETHING');
         expect(SomeTypesKeys[1]).toBe('FETCH_SOMETHING_DONE');
         expect(SomeTypesValues[1]).toBe('FETCH_SOMETHING_DONE');
      });
   });

   describe('checking actions', () => {
      describe('checking the actions object', () => {
         it('should have correct action names', () => {
            expect(SomeActionsKeys.includes('fetchSomething')).toBe(true);
            expect(SomeActionsKeys.includes('fetchSomethingDone')).toBe(true);
            expect(SomeActionsKeys.includes('unknownAction')).toBe(false);
         });
         it('should have correct action values', () => {
            expect(typeof SomeActions.fetchSomething).toBe('function');
            expect(typeof SomeActions.fetchSomethingDone).toBe('function');
            expect(typeof SomeActions.unknownAction).toBe('undefined');
         });
      });
      describe('checking payload', () => {
         describe('when payload is valid', () => {
            it('should create correct action objects', () => {
               expect(SomeActions.fetchSomething()).toEqual({ type: 'FETCH_SOMETHING' });
               expect(SomeActions.fetchSomethingDone({ something: 'zozo' })).toEqual({
                  type: 'FETCH_SOMETHING_DONE',
                  something: 'zozo',
               });
            });
         });
         describe('when payload is invalid', () => {
            it('should throw an error', () => {
               expect(() => SomeActions.fetchSomething('')).toThrow({
                  message:
                     'action [fetchSomething] expects no arguments, but recieved some arguments!',
               });
               expect(() => SomeActions.fetchSomething({ foo: 'bar' })).toThrow({
                  message:
                     'action [fetchSomething] expects no arguments, but recieved some arguments!',
               });
               expect(() => SomeActions.fetchSomethingDone()).toThrow({
                  message: 'action [fetchSomethingDone] expects some arguments, but passed none!',
               });
               expect(() => SomeActions.fetchSomethingDone('')).toThrow({
                  message:
                     'action [fetchSomethingDone] expects an argument of type object, but passed a diffirent type!',
               });
               expect(() => SomeActions.fetchSomethingDone({})).toThrow({
                  message: 'action [fetchSomethingDone] didnt recieved these args: something',
               });
               expect(() => SomeActions.fetchSomethingDone({ foo: 'bar' })).toThrow({
                  message: 'action [fetchSomethingDone] didnt recieved these args: something',
               });
               expect(() => SomeActions.fetchSomethingDone({ something: 23, foo: 'bar' })).toThrow({
                  message: 'action [fetchSomethingDone] recieved with extra agrs: foo',
               });
            });
         });
      });
   });

   describe('checking reducer', () => {
      describe('when actions are invalid', () => {
         describe('when actions is empty', () => {
            it('should return the initial state', () => {
               const nextState = SomeReducer(InitialState, {});
               expect(nextState).toMatchObject(InitialState);
            });
         });
         describe('when actions is null', () => {
            it('should return the initial state', () => {
               const nextState = SomeReducer(InitialState, null);
               expect(nextState).toMatchObject(InitialState);
            });
         });
         describe('when actions is undefined', () => {
            it('should return the initial state', () => {
               const nextState = SomeReducer(InitialState, undefined);
               expect(nextState).toMatchObject(InitialState);
            });
         });
         describe('when actions is unknown', () => {
            it('should return the initial state', () => {
               const nextState = SomeReducer(InitialState, { type: 'UNKNOWN' });
               expect(nextState).toMatchObject(InitialState);
            });
         });
      });

      describe('when actions are valid', () => {
         it('should return the correct next state', () => {
            const nextState = SomeReducer(InitialState, SomeActions.fetchSomething());
            expect(nextState).toMatchObject({
               something: 0,
               isFetching: true,
               isFetchingDone: false,
            });
         });
         it('should return the correct next state', () => {
            const nextState = SomeReducer(
               InitialState,
               SomeActions.fetchSomethingDone({ something: 'yes' }),
            );
            expect(nextState).toMatchObject({
               something: 'yes',
               isFetching: false,
               isFetchingDone: true,
            });
         });
      });
   });

   describe('checking saga', () => {
      it('should contain the names of all the sagas present in the action object', () => {
         expect(SomeSagaKeys.includes('FETCH_SOMETHING')).toBe(true);
      });

      it('should not contain the names of any variable not present in the initial state', () => {
         expect(SomeSagaKeys.includes('FETCH_SOMETHING_DONE')).toBe(false);
      });

      it('should create the saga functions of all the sagas present in the action object', () => {
         expect(typeof SomeSaga.FETCH_SOMETHING).toBe('function');
      });

      it('should create the saga functions with correct names of all the sagas present in the action object', () => {
         expect(SomeSaga.FETCH_SOMETHING.name).toBe('fetchSomethingWatcher');
      });
   });
});
