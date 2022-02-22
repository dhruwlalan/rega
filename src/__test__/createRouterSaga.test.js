import { createRouterSaga } from '../createRouterSaga';

describe('createActions', () => {
   describe('checking arguments', () => {
      describe('when passed invalid arguments', () => {
         it('should throw an error', () => {
            expect(() => createRouterSaga()).toThrow();
            expect(() => createRouterSaga('one')).toThrow();
            expect(() => createRouterSaga([])).toThrow();
            expect(() => createRouterSaga({})).toThrow();
            expect(() => createRouterSaga({}, [])).toThrow();
            expect(() => createRouterSaga({}, '')).toThrow();
         });
      });
      describe('when passed valid arguments', () => {
         it('should not throw an error', () => {
            expect(() => createRouterSaga({ '/dashboard': () => null })).not.toThrow();
            expect(() => createRouterSaga({ '/dashboard': () => null }, true)).not.toThrow();
         });
      });
   });
});
