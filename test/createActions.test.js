import test from 'ava';
import { createActions } from '../src/createActions';
import R from 'ramda';

test('throws error if not passed a valid actions object', (t) => {
   t.throws(() => createActions());
   t.throws(() => createActions('one'));
   t.throws(() => createActions({}));

   t.notThrows(() => createActions({ fetchSomething: () => null }));
});

const actions = createActions({
   fetchSomething: () => null,
   fetchSomethingDone: ({ foo, bar }) => ({ foo, bar }),
});

test('creates an object with the correct action keys', (t) => {
   const keys = R.keys(actions);
   t.true(keys.includes('fetchSomething'));
   t.true(keys.includes('fetchSomethingDone'));
   t.false(keys.includes('unknownAction'));
});

test('creates an object with the correct action values', (t) => {
   t.is(typeof actions.fetchSomething, 'function');
   t.is(typeof actions.fetchSomethingDone, 'function');
   t.is(typeof actions.unknownAction, 'undefined');
});

test('returns the correct action object having correct payload', (t) => {
   t.deepEqual(actions.fetchSomething(), { type: 'FETCH_SOMETHING' });
   t.deepEqual(actions.fetchSomethingDone({ foo: 'hii', bar: 'bye' }), {
      type: 'FETCH_SOMETHING_DONE',
      foo: 'hii',
      bar: 'bye',
   });
});

test('returns the correct action object having incorrect payload', (t) => {
   t.deepEqual(actions.fetchSomething({ foo: 'bar' }), { type: 'FETCH_SOMETHING' });
   t.deepEqual(actions.fetchSomething({ hii: false }), { type: 'FETCH_SOMETHING' });

   t.deepEqual(actions.fetchSomething({}), { type: 'FETCH_SOMETHING' });
   t.deepEqual(actions.fetchSomething(), { type: 'FETCH_SOMETHING' });
   t.deepEqual(actions.fetchSomethingDone({}), { type: 'FETCH_SOMETHING_DONE' });
   t.deepEqual(actions.fetchSomethingDone(), { type: 'FETCH_SOMETHING_DONE' });

   t.deepEqual(actions.fetchSomethingDone({ hii: false }), {
      type: 'FETCH_SOMETHING_DONE',
      hii: false,
   });
   t.deepEqual(actions.fetchSomethingDone({ foo: 5, bar: 10 }), {
      type: 'FETCH_SOMETHING_DONE',
      foo: 5,
      bar: 10,
   });
   t.deepEqual(actions.fetchSomethingDone({ foo: 5, bar: true, boo: 'yes' }), {
      type: 'FETCH_SOMETHING_DONE',
      foo: 5,
      bar: true,
      boo: 'yes',
   });
});
