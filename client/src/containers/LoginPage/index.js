import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router'
import LoginForm from '../LoginForm';
import RegistrationForm from '../RegistrationForm'
import { login } from './actions';
import { registerUser } from '../RegistrationPage/actions'
import { Tabs, Tab, Card, CardText, CardActions, FontIcon, FlatButton } from 'material-ui';
import { submit } from 'redux-form';

const enhance = compose(
    connect(null, { login, registerUser, submit }),
    withRouter,
    withHandlers({
        handleSubmit: ({ login, history: { push } }) => async (values) => {
            const { username, password } = values.toJS();

            try {
                await login({ username, password });
            } catch (error) {
                return;
            }

            push('/');

            return Promise.resolve();
        },
        handleRegister: ({ registerUser, history: { push } }) => ({ username, password }) => {
            registerUser({ username, password }).then(() => {
                push('/');
            }).catch(() => {});
        }
    })
);

const LoginPage = ({ handleSubmit, handleRegister, submit }) => (

    <Card>
        <Tabs>
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
                        icon={<FontIcon className="fa fa-sign-in"/>}
                        label="Enter the Voting App"
                        onClick={() => submit('login')}
                    />
                </CardActions>
            </Tab>
            <Tab
                icon={<FontIcon className="fa fa-user-circle"/>}
                label="Register"
            >
                <CardText>
                    <RegistrationForm onSubmit={handleRegister} />
                </CardText>
                <CardActions style={{ textAlign: 'right' }}>
                    <FlatButton
                        primary
                        icon={<FontIcon className="fa fa-sign-in"/>}
                        label="Create New Account"
                        onClick={() => submit('registration')}
                    />
                </CardActions>
            </Tab>
        </Tabs>
    </Card>
);

export default enhance(LoginPage);

