import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import Devtools from './containers/DevTools';
import configureStore from './store';
import './index.css';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <div>
            <App />
            <Devtools/>
        </div>
    </Provider>,
    document.getElementById('root'),
);
