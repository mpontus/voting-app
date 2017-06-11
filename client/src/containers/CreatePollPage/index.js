import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, withProps } from 'recompose';
import CreatePollForm from '../CreatePollForm';
import { makeGetFetching } from './selectors';
import { createPoll } from './actions';
import { Card, CardText, CardTitle } from 'material-ui';

const mapStateToProps = () => createStructuredSelector({
    fetching: makeGetFetching(),
});

const enhance = compose(
    connect(mapStateToProps, { createPoll }),
    withRouter,
    withProps(({ createPoll, history: { push } }) => ({
        handleSubmit: (values) => {
            // console.log(values.toJS());
            // debugger;

            return createPoll(values.toJS()).then(() => {
                push('/');
            });
        }
    }))
);

const CreatePollPage = ({ submitting, handleSubmit }) => (
    <Card>
        <CardTitle title="New Polll" />
        <CardText style={{ paddingRight: 0 }}>
            <CreatePollForm onSubmit={handleSubmit} />
        </CardText>
    </Card>
);

export default enhance(CreatePollPage);
