import React from 'react'
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { MuiThemeProvider } from 'material-ui';
import { makeGetLoginShown } from './selectors';
import Header from '../Header';
import Layout from '../../components/Layout';
import HomePage from '../../containers/HomePage';
import LoginPage from '../../containers/LoginPage';
import ViewPollPage from '../../containers/ViewPollPage'
import CreatePollPage from '../CreatePollPage'
import RegistrationPage from '../RegistrationPage'
import Notifications from './Notifications';

const mapStateToProps = () => {
    const getLoginShown = makeGetLoginShown();

    return createStructuredSelector({
        loginShown: getLoginShown,
    });
};

const enhance = connect(mapStateToProps);

const App = ({ loginShown }) => (
    <MuiThemeProvider>
        <Layout header={<Header />}>
            {loginShown ? (
                <LoginPage/>
            ) : (
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/poll/:id" component={ViewPollPage} />
                    <Route exact path="/new" component={CreatePollPage} />
                    <Route exact path="/signup" component={RegistrationPage} />
                </Switch>
            )}
            <Notifications />
        </Layout>
    </MuiThemeProvider>
);

export default enhance(App);
