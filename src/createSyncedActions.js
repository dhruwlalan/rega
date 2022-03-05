import { select, race, put, take } from 'redux-saga/effects';

export const createSyncedActions = (actionsObject) => {
   const syncedActionsObject = {};

   function* syncedAction(sa, actionObject, force) {
      const state = yield select(sa.state);
      if (!state[sa.success] || force) {
         if (!state[sa.loading]) yield put(actionObject);
         yield race(sa.race.map((a) => take(a)));
         const newState = yield select(sa.state);
         if (newState[sa.success]) return true;
         if (newState[sa.failure]) return false;
      }
      return true;
   }

   Object.keys(actionsObject).forEach((key) => {
      syncedActionsObject[key] = syncedAction.bind(null, actionsObject[key]);
   });

   return {
      putSync: function* (actionObject) {
         const type = actionObject.type;
         const action = syncedActionsObject[type];
         if (action) yield syncedActionsObject[type](actionObject, false);
         else console.error(`no synced action defined for: ${type}`);
      },
      putSyncForce: function* (actionObject) {
         const type = actionObject.type;
         const action = syncedActionsObject[type];
         if (action) yield syncedActionsObject[type](actionObject, true);
         else console.error(`no synced action defined for: ${type}`);
      },
   };
};
