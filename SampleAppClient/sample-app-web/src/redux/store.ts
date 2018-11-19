import { createStore, compose, applyMiddleware, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { IApplicationState } from './rootReducer';
import { rootSaga } from './rootSaga';

export function configureStore(
  initialState: IApplicationState
): Store<IApplicationState> {
  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware();

  // dev tools middleware
  const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? [(window as any).__REDUX_DEVTOOLS_EXTENSION__()]
    : [];

  // create a redux store with our reducer above and middleware
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(sagaMiddleware),
      ...reduxDevTools
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
