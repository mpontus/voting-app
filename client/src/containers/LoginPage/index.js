import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router'
import { createStructuredSelector } from 'reselect';
import LoginForm from '../LoginForm';
import RegistrationForm from '../RegistrationForm'
import { login } from './actions';
import { registerUser } from '../RegistrationPage/actions'
import { Tab, Card, CardText, CardActions, FontIcon, FlatButton } from 'material-ui';
import { isValid, submit, SubmissionError } from 'redux-form/immutable';
import SwipeableTabs from '../../components/SwipeableTabs';

const mapStateToProps = () => {
    const [isLoginFormValid, isRegistrationFormValid] =
        ['login', 'registration'].map(form => isValid(form));

    return createStructuredSelector({
        isLoginFormValid,
        isRegistrationFormValid,
    });
};

const enhance = compose(
    connect(mapStateToProps, { login, registerUser, submit }),
    withRouter,
    withHandlers({
        handleSubmit: ({ login, history: { push } }) => async (values) => {
            const { username, password } = values.toJS();

            try {
                await login({ username, password });
            } catch (error) {
                throw new SubmissionError(error);
            }
        },
        handleRegister: ({ registerUser, history: { push } }) => async (values) => {
            const { username, password } = values.toJS();

            try {
                await registerUser({ username, password });
            } catch (error) {
                throw new SubmissionError(error);
            }
        }
    })
);

const LoginPage = ({ isLoginFormValid, isRegistrationFormValid, handleSubmit, handleRegister, submit }) => (
    <Card>
        <SwipeableTabs
            animateHeight
            enableMouseEvents
        >
            <Tab
                icon={<FontIcon className="fa fa-user-circle-o"/>}
                label="Log In"
            >
                <CardText>
                    <LoginForm onSubmit={handleSubmit}/>
                </CardText>
                <CardActions style={{ textAlign: 'right' }}>
                    <FlatButton
                        primary
                        disabled={!isLoginFormValid}
                        icon={<FontIcon className="fa fa-sign-in"/>}
                        label="Enter the Voting App"
                        onClick={() => submit('login')}
                    />
                </CardActions>
            </Tab>
            <Tab
                icon={<FontIcon className="fa fa-user-plus"/>}
                label="Register"
            >
                <CardText>
                    <RegistrationForm onSubmit={handleRegister} />
                </CardText>
                <CardActions style={{ textAlign: 'right' }}>
                    <FlatButton
                        primary
                        disabled={!isRegistrationFormValid}
                        icon={<FontIcon className="fa fa-sign-in"/>}
                        label="Create New Account"
                        onClick={() => submit('registration')}
                    />
                </CardActions>
            </Tab>
        </SwipeableTabs>
    </Card>
);

export default enhance(LoginPage);

