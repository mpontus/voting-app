import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { submit } from 'redux-form/immutable';
import { createStructuredSelector } from 'reselect';
import { compose, withProps } from 'recompose';
import CreatePollForm from '../CreatePollForm';
import { makeGetFetching } from './selectors';
import { createPoll } from './actions';
import { Card, CardActions, CardText, CardTitle, RaisedButton } from 'material-ui';

const mapStateToProps = () => createStructuredSelector({
    fetching: makeGetFetching(),
});

const enhance = compose(
    connect(mapStateToProps, { submit, createPoll }),
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

const CreatePollPage = ({ submit, submitting, handleSubmit }) => (
    <Card>
        <CardTitle title="New Polll" />
        <CardText style={{ paddingRight: 0 }}>
            <CreatePollForm onSubmit={handleSubmit} />
        </CardText>
        <CardActions style={{ textAlign: 'right' }}>
            <RaisedButton
                label="Create Poll"
                onClick={() => submit('create_poll')}
            />
        </CardActions>
    </Card>
);

export default enhance(CreatePollPage);
