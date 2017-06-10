import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose, withHandlers } from 'recompose';
import RegistrationForm from '../RegistrationForm'
import { registerUser } from './actions'
import { Card, CardText, CardTitle } from 'material-ui';

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
    <Card>
        <CardTitle title="Sign Up" />
        <CardText>
            <RegistrationForm onSubmit={handleSubmit} />
        </CardText>
    </Card>
);

export default enhance(RegistrationPage)
