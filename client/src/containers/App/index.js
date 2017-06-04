import React from 'react'
import { Switch, Route } from 'react-router-dom';
import { MuiThemeProvider } from 'material-ui';
import Layout from '../../components/Layout';
import HomePage from '../../containers/HomePage';
import LoginPage from '../../components/LoginPage';
import ViewPollPage from '../../components/ViewPollPage'
import CreatePollPage from '../CreatePollPage'


const App = () => (
    <MuiThemeProvider>
        <Layout>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/poll/:id" component={ViewPollPage} />
                <Route exact path="/new" component={CreatePollPage} />
            </Switch>
        </Layout>
    </MuiThemeProvider>
);

export default App;
