import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import reducer from './reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(api, history, initialState) {
    const thunkMiddleware = thunk.withExtraArgument(api);
    const routerMiddleware = createRouterMiddleware(history);

    const middleware = applyMiddleware(
        logger,
        thunkMiddleware,
        routerMiddleware
    );

    const enhancer = composeEnhancers(
        middleware,
    );

    const store = createStore(reducer, initialState, enhancer);

    if (module.hot) {
        module.hot.accept('./reducer', () => {
        // TODO: Use dynamic import with babel-plugin-dynamic-import-node
            store.replaceReducer(require('./reducer'))
        });
    }

    return store;
}
