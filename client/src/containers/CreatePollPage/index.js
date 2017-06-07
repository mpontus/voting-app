import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, withProps } from 'recompose';
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
    <CreatePollForm onSubmit={handleSubmit} />
);

export default enhance(CreatePollPage);
