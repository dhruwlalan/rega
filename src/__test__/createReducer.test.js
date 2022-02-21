import { createReducer } from '../createReducer';
import Immutable from 'seamless-immutable';

describe('createActions', () => {
   describe('checking arguments', () => {
      describe('when passed invalid arguments', () => {
         it('should throw an error', () => {
            expect(() => createReducer()).toThrow();
            expect(() => createReducer('one')).toThrow();
            expect(() => createReducer({})).toThrow();
            expect(() => createReducer([])).toThrow();
            expect(() => createReducer({}, '')).toThrow();
            expect(() => createReducer({}, 'baz')).toThrow();
         });
      });
      describe('when passed valid arguments', () => {
         it('should not throw an error', () => {
            expect(() =>
               createReducer({ foo: 'bar' }, { fetchSomething: {} }, 'some'),
            ).not.toThrow();
         });
      });
   });

   const INITIAL_STATE = Immutable({ foo: 5, bar: false });
   const actions = {
      setSomething: { arguments: ['bar'] },
      fetchSomething: {
         arguments: [],
         reducer: () => ({ foo: 10 }),
      },
      fetchSomethingDone: {
         arguments: ['foo', 'bar'],
         reducer: ({ foo, bar }) => ({ foo, bar }),
      },
   };
   const reducer = createReducer(INITIAL_STATE, actions, 'some');

   describe('when actions are invalid', () => {
      describe('when actions is empty', () => {
         it('should return the initial state', () => {
            const nextState = reducer(INITIAL_STATE, {});
            expect(nextState).toMatchObject(INITIAL_STATE);
         });
      });
      describe('when actions is null', () => {
         it('should return the initial state', () => {
            const nextState = reducer(INITIAL_STATE, null);
            expect(nextState).toMatchObject(INITIAL_STATE);
         });
      });
      describe('when actions is undefined', () => {
         it('should return the initial state', () => {
            const nextState = reducer(INITIAL_STATE, undefined);
            expect(nextState).toMatchObject(INITIAL_STATE);
         });
      });
      describe('when actions is unknown', () => {
         it('should return the initial state', () => {
            const nextState = reducer(INITIAL_STATE, { type: 'UNKNOWN' });
            expect(nextState).toMatchObject(INITIAL_STATE);
         });
      });
   });

   describe('when actions are valid', () => {
      describe('when the payload is extra', () => {
         it('should throw an error', () => {
            expect(() => reducer(INITIAL_STATE, { type: 'FETCH_SOMETHING', boo: 'boo' })).toThrow({
               message: 'reducer [fetchSomething] recieved with extra agrs: boo',
            });
            expect(() =>
               reducer(INITIAL_STATE, {
                  type: 'FETCH_SOMETHING_DONE',
                  foo: 'FoO',
                  bar: 4,
                  zoo: 'lol',
               }),
            ).toThrow({
               message: 'reducer [fetchSomethingDone] recieved with extra agrs: zoo',
            });
         });
      });
      describe('when the payload is less than or equal to expected', () => {
         it('should not throw an error', () => {
            expect(() => reducer(INITIAL_STATE, { type: 'FETCH_SOMETHING' })).not.toThrow();
            expect(() => reducer(INITIAL_STATE, { type: 'FETCH_SOMETHING_DONE' })).not.toThrow();
            expect(() =>
               reducer(INITIAL_STATE, { type: 'FETCH_SOMETHING_DONE', foo: 'yes' }),
            ).not.toThrow();
         });
         it('should return the correct next state', () => {
            const nextState = reducer(INITIAL_STATE, {
               type: 'FETCH_SOMETHING_DONE',
               foo: 77,
               bar: 88,
            });
            expect(nextState).toStrictEqual({ foo: 77, bar: 88 });
         });
      });
   });

   describe('builtin actions', () => {
      describe('reset', () => {
         it('should return the correct next state', () => {
            const nextState = reducer(INITIAL_STATE, { type: 'FETCH_SOMETHING' });
            expect(nextState).toStrictEqual({ foo: 10, bar: false });
         });
      });
      describe('setters', () => {
         it('should return the correct next state for set foo', () => {
            const nextState = reducer(INITIAL_STATE, { type: 'SET_SOME_FOO', foo: 99 });
            expect(nextState).toStrictEqual({ foo: 99, bar: false });
         });
         it('should return the correct next state for set bar', () => {
            const nextState = reducer(INITIAL_STATE, { type: 'SET_SOME_BAR', bar: true });
            expect(nextState).toStrictEqual({ foo: 5, bar: true });
         });
         it('should throw an error if not passed with correct state key', () => {
            expect(() => reducer(INITIAL_STATE, { type: 'SET_SOME_FOO' })).toThrow({
               message:
                  'reducer [some] passing with action [SET_SOME_FOO] should be passed with foo',
            });
         });
         it('should throw an error if not passed with correct state key', () => {
            expect(() => reducer(INITIAL_STATE, { type: 'SET_SOME_BAR' })).toThrow({
               message:
                  'reducer [some] passing with action [SET_SOME_BAR] should be passed with bar',
            });
         });
      });
   });
});
