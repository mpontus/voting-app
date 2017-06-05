import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
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
    <Grid>
        <Row>
            <Col xs={8} xsOffset={2} sm={8} smOffset={2} md={6} mdOffset={3}>
                <RegistrationForm onSubmit={handleSubmit} />
            </Col>
        </Row>
    </Grid>
);

export default enhance(RegistrationPage)
