import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose, withHandlers } from 'recompose';
import RegistrationForm from '../RegistrationForm'
import { registerUser } from './actions'

const enhance = compose(
    withRouter,
    connect(null, { registerUser }),
    withHandlers({
        handleSubmit: ({ registerUser, history: { push } }) => ({ username, password }) => {
            registerUser({ username, password }).then(() => {
                push('/');
            }).catch(() => {});
        }
    }),
);

const RegistrationPage = ({ handleSubmit }) => (
    <RegistrationForm onSubmit={handleSubmit} />
);

export default enhance(RegistrationPage)
