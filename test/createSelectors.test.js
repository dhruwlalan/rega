import test from 'ava';
import R from 'ramda';

import { createSelectors } from '../src/createSelectors';

test('throws error if not passed a valid actions object', (t) => {
   t.throws(() => createSelectors());
   t.throws(() => createSelectors({}));
   t.throws(() => createSelectors({}, ''));
   t.throws(() => createSelectors({}, 'baz'));
   t.throws(() => createSelectors({ foo: 'bar' }, ''));

   t.notThrows(() => createSelectors({ foo: 'bar' }, 'baz'));
});

test('creates an object of selectors from initial state', (t) => {
   const selectors = createSelectors({ foo: '', bar: '' }, 'state');

   const keys = R.keys(selectors);

   t.true(keys.includes('foo'));
   t.true(keys.includes('bar'));
   t.false(keys.includes('boo'));

   t.is(typeof selectors.foo, 'function');
   t.is(typeof selectors.bar, 'function');

   t.is(selectors.foo.name, 'memoized');
   t.is(selectors.bar.name, 'memoized');
});
