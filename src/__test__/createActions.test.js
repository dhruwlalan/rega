import test from 'ava';
import { createActions } from '../createActions';
import R from 'ramda';

test('should throw an error. if: not passed a valid actions object', (t) => {
   t.throws(() => createActions());
   t.throws(() => createActions('one'));
   t.throws(() => createActions({}));
   t.throws(() => createActions({ fetchSomething: () => true }));

   t.notThrows(() => createActions({ fetchSomething: { arguments: ['foo'] } }));
});

const actions = createActions({
   fetchSomething: { arguments: [] },
   fetchSomethingDone: { arguments: ['foo', 'bar'] },
});

test('creates an object with the correct action names', (t) => {
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

// testing [action].arguments is present or not
test('should throw an error. if: the action object does not contain arguments key', (t) => {
   t.throws(() => createActions({ fetchSomething: {} }), {
      message: 'action [fetchSomething] must contain an arguments key!',
   });
});
test('should not throw an error. if: the action object contains arguments key', (t) => {
   t.notThrows(() => createActions({ fetchSomething: { arguments: [] } }));
});

// testing [action].arguments value to be always an array
test('should throw an error. if: the expectedArguments is not an array', (t) => {
   t.throws(() => createActions({ fetchSomething: { arguments: null } }), {
      message: 'action [fetchSomething].arguments must be an array!',
   });
   t.throws(() => createActions({ fetchSomething: { arguments: true } }), {
      message: 'action [fetchSomething].arguments must be an array!',
   });
   t.throws(() => createActions({ fetchSomething: { arguments: {} } }), {
      message: 'action [fetchSomething].arguments must be an array!',
   });
});
test('should not throw an error, if: the expectedArguments is an array', (t) => {
   t.notThrows(() => createActions({ fetchSomething: { arguments: [] } }));
});
test('should not throw an error, if: the expectedArguments is an empty array', (t) => {
   t.notThrows(() => createActions({ fetchSomething: { arguments: [] } }));
});

// testing [action].arguments value to be an array of non-emtpy strings
test('should throw an error, if: the expectedArguments is not an array of strings', (t) => {
   t.throws(() => createActions({ fetchSomething: { arguments: [3] } }), {
      message: 'action [fetchSomething].arguments must be an array of strings!',
   });
   t.throws(() => createActions({ fetchSomething: { arguments: [true] } }), {
      message: 'action [fetchSomething].arguments must be an array of strings!',
   });
   t.throws(() => createActions({ fetchSomething: { arguments: [{ foo: 'bar' }] } }), {
      message: 'action [fetchSomething].arguments must be an array of strings!',
   });
});
test('should not throw an error, if: the expectedArguments is an array of strings', (t) => {
   t.notThrows(() => createActions({ fetchSomething: { arguments: ['a'] } }));
   t.notThrows(() => createActions({ fetchSomething: { arguments: ['a', 'foo'] } }));
});
test('should throw an error, if: the expectedArguments array contains empty strings', (t) => {
   t.throws(() => createActions({ fetchSomething: { arguments: [''] } }), {
      message: 'action [fetchSomething].arguments array should not contain empty strings',
   });
   t.throws(() => createActions({ fetchSomething: { arguments: ['a', '', 'b'] } }), {
      message: 'action [fetchSomething].arguments array should not contain empty strings',
   });
});
test('should not throw an error, if: the expectedArguments array does not contains empty strings', (t) => {
   t.notThrows(() => createActions({ fetchSomething: { arguments: ['a'] } }));
   t.notThrows(() => createActions({ fetchSomething: { arguments: ['a', 'foo', 'b'] } }));
});

// testing when expectedArguments is []
test('should not throw an error, if: the expectedArguments array is empty & providedArguments is also empty', (t) => {
   t.notThrows(() => actions.fetchSomething());
});
test('creates correct action object, when: expectedArguments is empty & providedArguments is also empty', (t) => {
   t.deepEqual(actions.fetchSomething(), { type: 'FETCH_SOMETHING' });
});
