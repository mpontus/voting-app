import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import DevTools from 'containers/DevTools';
import reducer from './reducer';

const enhancers = compose(
    applyMiddleware(thunk),
    DevTools.instrument(),
);

export default function configureStore(initialState) {
    const store = createStore(reducer, initialState, enhancers);

    if (module.hot) {
        module.hot.accept('./reducer', () => {
        // TODO: Use dynamic import with babel-plugin-dynamic-import-node
            store.replaceReducer(require('./reducer'))
        });
    }

    return store;
}
