import R from 'ramda';
import { createSaga } from '../createSaga';

describe('createActions', () => {
   describe('checking arguments', () => {
      describe('when passed invalid arguments', () => {
         it('should throw an error', () => {
            expect(() => createSaga()).toThrow();
            expect(() => createSaga('one')).toThrow();
            expect(() => createSaga({})).toThrow();
            expect(() => createSaga([])).toThrow();
            expect(() => createSaga({}, '')).toThrow();
            expect(() => createSaga({}, 'baz')).toThrow();
         });
      });
      describe('when passed valid arguments', () => {
         it('should not throw an error', () => {
            expect(() => createSaga({ fetchSomething: {} })).not.toThrow();
         });
      });
   });

   const actions = {
      setSomething: { arguments: ['bar'], saga: function* setSomething() {} },
      fetchSomething: {
         arguments: [],
         reducer: () => ({ foo: 10 }),
         saga: function* fetchSomething() {},
      },
      fetchSomethingDone: {
         arguments: ['foo', 'bar'],
         reducer: ({ foo, bar }) => ({ foo, bar }),
      },
   };
   const sagas = createSaga(actions);

   describe('checking the created selectors object', () => {
      const keys = R.keys(sagas);

      it('should contain the names of all the sagas present in the action object', () => {
         expect(keys.includes('SET_SOMETHING')).toBe(true);
         expect(keys.includes('FETCH_SOMETHING')).toBe(true);
      });

      it('should not contain the names of any variable not present in the initial state', () => {
         expect(keys.includes('FETCH_SOMETHING_DONE')).toBe(false);
      });

      it('should create the saga functions of all the sagas present in the action object', () => {
         expect(typeof sagas.SET_SOMETHING).toBe('function');
         expect(typeof sagas.FETCH_SOMETHING).toBe('function');
      });

      it('should create the saga functions with correct names of all the sagas present in the action object', () => {
         expect(sagas.SET_SOMETHING.name).toBe('setSomethingWatcher');
         expect(sagas.FETCH_SOMETHING.name).toBe('fetchSomethingWatcher');
      });
   });
});
