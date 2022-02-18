import R from 'ramda';
import test from 'ava';
import { reduck } from '../src/reduck';
import Immutable from 'seamless-immutable';

test('throws error if not passed a valid actions object', (t) => {
   const name = 'foo';
   const initialState = { bar: 'boo' };
   const actions = { fetchSomething: () => null };

   t.throws(() => reduck({}));
   t.throws(() => reduck({ name }));
   t.throws(() => reduck({ initialState }));
   t.throws(() => reduck({ actions }));
   t.throws(() => reduck({ name, initialState: {} }));
   t.throws(() => reduck({ name: {}, initialState, actions }));
   t.throws(() => reduck({ name, initialState: {}, actions }));
   t.throws(() => reduck({ name: '', initialState, actions }));
   t.throws(() => reduck({ name, initialState, actions: '' }));
   t.throws(() => reduck({ name, initialState, actions: {} }));

   t.notThrows(() => reduck({ name, initialState, actions }));
});

const { SomeSelectors, SomeTypes, SomeActions, SomeReducer } = reduck({
   name: 'some',
   initialState: {
      something: null,
      isFetching: false,
      isFetchingDone: false,
   },
   actions: {
      fetchSomething: () => ({
         something: null,
         isFetching: true,
         isFetchingDone: false,
      }),
      fetchSomethingDone: ({ something }) => ({
         something,
         isFetching: false,
         isFetchingDone: true,
      }),
   },
});
const SomeSelectorsKeys = R.keys(SomeSelectors);
const SomeTypesKeys = R.keys(SomeTypes);
const SomeTypesValues = R.values(SomeTypes);
const SomeActionsKeys = R.keys(SomeActions);
const InitialState = Immutable({
   something: null,
   isFetching: false,
   isFetchingDone: false,
});

test('selectors', (t) => {
   t.true(SomeSelectorsKeys.includes('something'));
   t.true(SomeSelectorsKeys.includes('isFetching'));
   t.true(SomeSelectorsKeys.includes('isFetchingDone'));
   t.false(SomeSelectorsKeys.includes('unknownKey'));
   t.is(typeof SomeSelectors.something, 'function');
   t.is(typeof SomeSelectors.isFetching, 'function');
   t.is(typeof SomeSelectors.isFetchingDone, 'function');
   t.is(SomeSelectors.something.name, 'memoized');
   t.is(SomeSelectors.isFetching.name, 'memoized');
   t.is(SomeSelectors.isFetchingDone.name, 'memoized');
});

test('types', (t) => {
   t.is(SomeTypesKeys[0], 'FETCH_SOMETHING');
   t.is(SomeTypesValues[0], 'FETCH_SOMETHING');
   t.is(SomeTypesKeys[1], 'FETCH_SOMETHING_DONE');
   t.is(SomeTypesValues[1], 'FETCH_SOMETHING_DONE');
});

test('actions', (t) => {
   t.true(SomeActionsKeys.includes('fetchSomething'));
   t.true(SomeActionsKeys.includes('fetchSomethingDone'));
   t.false(SomeActionsKeys.includes('unknownAction'));
   t.is(typeof SomeActions.fetchSomething, 'function');
   t.is(typeof SomeActions.fetchSomethingDone, 'function');
   t.is(typeof SomeActions.unknownAction, 'undefined');
   t.deepEqual(SomeActions.fetchSomething(), { type: 'FETCH_SOMETHING' });
   t.deepEqual(SomeActions.fetchSomethingDone({ something: 'zozo' }), {
      type: 'FETCH_SOMETHING_DONE',
      something: 'zozo',
   });
   t.deepEqual(SomeActions.fetchSomething({ foo: 'bar' }), { type: 'FETCH_SOMETHING' });
   t.deepEqual(SomeActions.fetchSomething({ hii: false }), { type: 'FETCH_SOMETHING' });
   t.deepEqual(SomeActions.fetchSomething({}), { type: 'FETCH_SOMETHING' });
   t.deepEqual(SomeActions.fetchSomething(), { type: 'FETCH_SOMETHING' });
   t.deepEqual(SomeActions.fetchSomethingDone({}), { type: 'FETCH_SOMETHING_DONE' });
   t.deepEqual(SomeActions.fetchSomethingDone(), { type: 'FETCH_SOMETHING_DONE' });
   t.deepEqual(SomeActions.fetchSomethingDone({ foo: false }), {
      type: 'FETCH_SOMETHING_DONE',
      foo: false,
   });
   t.deepEqual(SomeActions.fetchSomethingDone({ something: 'zozo', bar: 10 }), {
      type: 'FETCH_SOMETHING_DONE',
      something: 'zozo',
      bar: 10,
   });
});

test('reducer', (t) => {
   t.deepEqual(SomeReducer(InitialState, {}), InitialState);
   t.deepEqual(SomeReducer(InitialState, { type: 'UNKNOWN', foo: 6 }), InitialState);
   t.deepEqual(SomeReducer(InitialState, SomeActions.fetchSomething()), {
      something: null,
      isFetching: true,
      isFetchingDone: false,
   });
   t.deepEqual(SomeReducer(InitialState, SomeActions.fetchSomethingDone({ something: 'zozo' })), {
      something: 'zozo',
      isFetching: false,
      isFetchingDone: true,
   });
   t.deepEqual(SomeReducer(InitialState, SomeActions.fetchSomething({ foo: 'bar' })), {
      something: null,
      isFetching: true,
      isFetchingDone: false,
   });
   t.deepEqual(SomeReducer(InitialState, SomeActions.fetchSomethingDone()), {
      something: undefined,
      isFetching: false,
      isFetchingDone: true,
   });
   t.deepEqual(SomeReducer(InitialState, SomeActions.fetchSomethingDone({})), {
      something: undefined,
      isFetching: false,
      isFetchingDone: true,
   });
   t.deepEqual(SomeReducer(InitialState, SomeActions.fetchSomethingDone({ foo: false })), {
      something: undefined,
      isFetching: false,
      isFetchingDone: true,
   });
   t.deepEqual(
      SomeReducer(InitialState, SomeActions.fetchSomethingDone({ something: 'zozo', bar: 10 })),
      {
         something: 'zozo',
         isFetching: false,
         isFetchingDone: true,
      },
   );
});
