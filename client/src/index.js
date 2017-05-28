import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory'
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppContainer } from 'react-hot-loader'
import App from './containers/App';
import configureStore from './store';
import Api from './api';
import 'font-awesome/css/font-awesome.css';
import './index.css';

injectTapEventPlugin();

const apiUrl = process.env.API_URL || '/api/';
const api = new Api(apiUrl);
const history = createHistory();

const store = configureStore(api, history);

const render = Component => {
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <AppContainer>
                    <Component />
                </AppContainer>
            </ConnectedRouter>
        </Provider>,
        document.getElementById('root'),
    )
};

api.init().then(() => {
    render(App);
});


if (module.hot) {
    module.hot.accept('./containers/App', () => {
        const NextApp = require('./containers/App').default;
        render(NextApp)
    })
}
