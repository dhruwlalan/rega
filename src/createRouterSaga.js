import { takeLatest, fork } from 'redux-saga/effects';
import { R, matchRoute, getParams } from './utils';

export const createRouterSaga = ({ beforeEach, matchRoutes, afterEach }) => {
   if (R.isNil(matchRoutes)) throw new Error('router sagas cannot be empty');
   if (R.isEmpty(matchRoutes)) throw new Error('router sagas cannot be empty');
   if (!R.is(Object, matchRoutes)) throw new Error('router sagas must be a valid object');

   const routes = R.keys(matchRoutes);

   function* navigationLoader(action) {
      const currentRoute = routes.find((route) => {
         return matchRoute(route, action.payload.location.pathname);
      });

      if (currentRoute) {
         const location = action.payload.location;
         const { queryParams, routeParams } = getParams(location);
         try {
            yield beforeEach({ action, queryParams, routeParams });
            yield* matchRoutes[currentRoute]({ action, queryParams, routeParams });
            yield afterEach({ action, queryParams, routeParams });
         } catch (error) {
            yield afterEach({ action, queryParams, routeParams, error });
         }
      }

      return Promise.resolve();
   }

   const routerSaga = [
      function* () {
         yield takeLatest('@@router/LOCATION_CHANGE', navigationLoader);
      },
   ];

   const routerSagas = routerSaga.map(fork);

   return routerSagas;
};
