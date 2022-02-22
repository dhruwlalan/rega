import { takeLatest } from 'redux-saga/effects';
import { R, matchRoute } from './utils';

export const createRouterSaga = (routerConfig, logAction) => {
   if (R.isNil(routerConfig)) throw new Error('router sagas cannot be empty');
   if (R.isEmpty(routerConfig)) throw new Error('router sagas cannot be empty');
   if (!R.is(Object, routerConfig)) throw new Error('router sagas must be a valid object');
   if (logAction && !R.is(Boolean, logAction)) {
      throw new Error('logAction should be a valid boolean');
   }

   const routes = R.keys(routerConfig);

   function* navigationLoader(action) {
      if (logAction) console.dir(action);

      const currentRoute = routes.find((route) => {
         return matchRoute(route, action.payload.location.pathname);
      });
      if (currentRoute) yield* routerConfig[currentRoute](action);

      return Promise.resolve();
   }

   return [
      function* () {
         yield takeLatest('@@router/LOCATION_CHANGE', navigationLoader);
      },
   ];
};
