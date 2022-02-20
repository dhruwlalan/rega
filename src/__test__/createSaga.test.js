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
      it('should contain the exact no of saga functions', () => {
         expect(sagas.length).toBe(2);
      });

      it('should create the saga functions of all the sagas present in the action object', () => {
         expect(typeof sagas[0]).toBe('function');
         expect(typeof sagas[0]).toBe('function');
      });

      it('should create the saga functions with correct names of all the sagas present in the action object', () => {
         expect(sagas[0].name).toBe('setSomethingWatcher');
         expect(sagas[1].name).toBe('fetchSomethingWatcher');
      });
   });
});
