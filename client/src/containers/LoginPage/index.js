import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router'
import LoginForm from '../LoginForm';
import { login } from './actions';
import { Card, CardText, CardTitle } from 'material-ui';

const enhance = compose(
    connect(null, { login }),
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
        }
    })
);

const LoginPage = ({ handleSubmit }) => (

    <Card>
        <CardTitle title="Log In" />
        <CardText>
            <LoginForm onSubmit={handleSubmit}/>
        </CardText>
    </Card>
);

export default enhance(LoginPage);

