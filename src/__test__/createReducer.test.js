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
            expect(() => createReducer({ foo: 'bar' }, { fetchSomething: {} })).not.toThrow();
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
   const reducer = createReducer(INITIAL_STATE, actions);

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
      describe('when the payload is invalid', () => {
         expect(() => reducer(INITIAL_STATE, { type: 'FETCH_SOMETHING', boo: 'boo' })).toThrow({
            message: 'reducer [fetchSomething] recieved with extra agrs: boo',
         });
         expect(() => reducer(INITIAL_STATE, { type: 'FETCH_SOMETHING_DONE' })).toThrow({
            message: 'reducer [fetchSomethingDone] didnt recieved these args: foo,bar',
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
      describe('when the payload is valid', () => {
         it('should return the correct next state', () => {
            const nextState = reducer(INITIAL_STATE, {
               type: 'FETCH_SOMETHING_DONE',
               foo: 77,
               bar: 88,
            });
            expect(nextState).toStrictEqual({ foo: 77, bar: 88 });
         });
         it('should return the correct next state', () => {
            const nextState = reducer(INITIAL_STATE, { type: 'FETCH_SOMETHING' });
            expect(nextState).toStrictEqual({ foo: 10, bar: false });
         });
      });
   });
});
