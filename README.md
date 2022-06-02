# REGA - REdux + saGA

The default way of writing redux along with sagas includes too much of the boilerplate code making it very hard to maintain for large apps. rega is a combined wrapper for your redux app using sagas making it easy to work with & maintain for large apps. It is highly based upon the modular duck pattern.

# Features

 - no switch statements or destructuring of states.
 - simple reducer function to update the state.
 - simple actions object to maintain all the actions of a reducer.
 - simple hook for saga to attach it directly to an action.
 - clean readable code with less files.

# Usage

Lets take `foo` as a piece of state for which you want to write your reducer & saga.

#### store/foo/index.js

```js
import { rega } from '@dhruwlalan/rega';

import { fetchFoo } from './sagas';

export const { FooReducer, FooSagas, FooActions, FooSelectors } = rega({
  name: 'foo',
  initialState: {
    foo: 0,
    isFetching: false,
    isFetchingDone: false,
    isFetchingError: false,
    fetchingError: null,
  },
  actions: {
    fetchFoo: {
      saga: fetchFoo,
      arguments: [],
      reducer: () => ({
        isFetching: true,
        isFetchingDone: false,
        isFetchingError: false,
        fetchingError: null,
      }),
    },
    fetchFooDone: {
      arguments: ['foo'],
      reducer: ({ foo }) => ({
        foo,
        isFetching: false,
        isFetchingDone: true,
        isFetchingError: false,
        fetchingError: null,
      }),
    },
    fetchFooError: {
      arguments: ['error'],
      reducer: ({ error }) => ({
        isFetching: false,
        isFetchingDone: true,
        isFetchingError: true,
        fetchingError: error,
      }),
    },
  },
});
```

#### store/foo/sagas.js

```js
import { put } from 'redux-saga/effects';

import { FooActions } from './index';

export function* fetchFoo({ currentCount, actionType }) {
  try {
    const response = yield fetch('some_api_url');
    const data = yield response.text();
    yield put(FooActions.fetchFooDone({ foo: data }));
  } catch (error) {
    yield put(FooActions.updateCounterError({ error }));
  }
}
```

#### store/store.js

```js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import { FooReducer, FooSagas } from './foo';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({ foo: FooReducer });

const rootSaga = function* () {
  yield all([...FooSagas]);
};

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
```

# Example

[a simple counter example app](https://stackblitz.com/edit/rega-counter-demo?file=src/redux/store.js)

Changelog
---------

[CHANGELOG.md](./CHANGELOG.md)
