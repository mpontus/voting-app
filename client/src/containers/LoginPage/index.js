import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router'
import { SubmissionError } from 'redux-form/immutable'
import LoginForm from '../LoginForm';
import { login } from './actions';

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
    <LoginForm onSubmit={handleSubmit}/>
);

export default enhance(LoginPage);
