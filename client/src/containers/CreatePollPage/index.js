import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, withProps } from 'recompose';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CreatePollForm from '../CreatePollForm';
import { makeGetFetching } from './selectors';
import { createPoll } from './actions';

const mapStateToProps = () => createStructuredSelector({
    fetching: makeGetFetching(),
});

const enhance = compose(
    connect(mapStateToProps, { createPoll }),
    withRouter,
    withProps(({ createPoll, history: { push } }) => ({
        handleSubmit: (values) => createPoll(values).then(() => {
            push('/');
        })
    }))
);

const CreatePollPage = ({ submitting, handleSubmit }) => (
    <Grid>
        <Row>
            <Col xs={8} xsOffset={2} sm={8} smOffset={2} md={6} mdOffset={3}>
                <CreatePollForm onSubmit={handleSubmit} />
            </Col>
        </Row>
    </Grid>
);

export default enhance(CreatePollPage);
