import test from 'ava';
import { createTypes } from '../src/createTypes';
import R from 'ramda';

test('throws error if not passed a valid actions object', (t) => {
   t.throws(() => createTypes());
   t.throws(() => createTypes('one'));
   t.throws(() => createTypes({}));

   t.notThrows(() => createTypes({ fetchSomething: () => null }));
});

test('creates an object with the right keys and values', (t) => {
   const types = createTypes({
      fetchSomething: () => ({}),
      fetchSomethingDone: () => ({}),
   });

   const keys = R.keys(types);
   const values = R.values(types);

   t.is(keys[0], 'FETCH_SOMETHING');
   t.is(values[0], 'FETCH_SOMETHING');

   t.is(keys[1], 'FETCH_SOMETHING_DONE');
   t.is(values[1], 'FETCH_SOMETHING_DONE');
});
