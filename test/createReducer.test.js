import test from 'ava';
import { createReducer } from '../src/createReducer';
import Immutable from 'seamless-immutable';

test('throws error if not passed a valid actions object', (t) => {
   t.throws(() => createReducer());
   t.throws(() => createReducer({}));
   t.throws(() => createReducer('foo'));
   t.throws(() => createReducer({ i: 5 }));
   t.throws(() => createReducer({ i: 5 }, {}));
   t.throws(() => createReducer({ i: 5 }, 'foo'));
   t.throws(() => createReducer({}, 'foo'));
   t.throws(() => createReducer({}, { fetchSomething: () => null }));

   t.notThrows(() => createReducer({ i: true }, { fetchSomething: () => null }));
});

const INITIAL_STATE = Immutable({ foo: 5, bar: false });
const actions = {
   setFoo: ({ val }) => ({ foo: val }),
   enableBar: () => ({ bar: true }),
   setFooAndBar: ({ foo, bar }) => ({ foo, bar }),
};

const reducer = createReducer(INITIAL_STATE, actions);

test('returns the state unchanged for an empty action', (t) => {
   const nextState = reducer(INITIAL_STATE, {});
   t.deepEqual(nextState, INITIAL_STATE);
});

test('returns the state unchanged for an unknown action', (t) => {
   const nextState = reducer(INITIAL_STATE, { type: 'UNKNOWN', foo: 6, bar: true });
   t.deepEqual(nextState, INITIAL_STATE);
});

test('returns the correct new state for setFoo action', (t) => {
   const nextState = reducer(INITIAL_STATE, { type: 'SET_FOO', val: 8 });
   t.deepEqual(nextState, { foo: 8, bar: false });
});

test('returns the correct new state for enableBar action', (t) => {
   const nextState = reducer(INITIAL_STATE, { type: 'ENABLE_BAR' });
   t.deepEqual(nextState, { foo: 5, bar: true });
});

test('returns the correct new state for setFooAndBar action', (t) => {
   const nextState = reducer(INITIAL_STATE, { type: 'SET_FOO_AND_BAR', foo: 25, bar: true });
   t.deepEqual(nextState, { foo: 25, bar: true });
});

test('returns the correct new state for setFoo action with no payload', (t) => {
   const nextState = reducer(INITIAL_STATE, { type: 'SET_FOO' });
   t.deepEqual(nextState, { foo: undefined, bar: false });
});

test('returns the correct new state for enableBar action with extra payload', (t) => {
   const nextState = reducer(INITIAL_STATE, { type: 'ENABLE_BAR', foo: 10 });
   t.deepEqual(nextState, { foo: 5, bar: true });
});

test('returns the correct new state for setFooAndBar action with no payload', (t) => {
   const nextState = reducer(INITIAL_STATE, { type: 'SET_FOO_AND_BAR' });
   t.deepEqual(nextState, { foo: undefined, bar: undefined });
});
