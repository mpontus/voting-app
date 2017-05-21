import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory'
import App from 'containers/App';
import Devtools from './containers/DevTools';
import configureStore from './store';
import Api from './api';
import { clientInfoUpdated } from 'containers/App/actions'
import './index.css';

const apiUrl = process.env.API_URL || '/api/';
const api = new Api(apiUrl);
const history = createHistory();

const store = configureStore(api, history);

api.init().then(() => {
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <div>
                    <App />
                    <Devtools/>
                </div>
            </ConnectedRouter>
        </Provider>,
        document.getElementById('root'),
    );
});

