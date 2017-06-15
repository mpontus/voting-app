import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { submit } from 'redux-form/immutable';
import { createStructuredSelector } from 'reselect';
import { compose, withProps } from 'recompose';
import CreatePollForm from '../CreatePollForm';
import { makeGetFetching } from './selectors';
import { createPoll } from './actions';
import { Card, CardActions, CardText, FlatButton, RaisedButton } from 'material-ui';
import PollIcon from 'material-ui/svg-icons/social/poll'
import { Link } from 'react-router-dom';

const mapStateToProps = () => createStructuredSelector({
    fetching: makeGetFetching(),
});

const enhance = compose(
    connect(mapStateToProps, { submit, createPoll }),
    withRouter,
    withProps(({ createPoll, history: { push } }) => ({
        handleSubmit: (values) => createPoll(values.toJS()).then(() => push('/')),
    }))
);

const CreatePollPage = ({ submit, submitting, handleSubmit }) => (
    <div>
        <RaisedButton
            primary
            fullWidth
            label="Return to the list of polls"
            containerElement={<Link to="/" />}
            icon={<PollIcon/>}
        />
        <Card>
            <CardText style={{ paddingRight: 0 }}>
                <CreatePollForm onSubmit={handleSubmit} />
            </CardText>
            <CardActions style={{ textAlign: 'right' }}>
                <FlatButton
                    label="Create Poll"
                    onClick={() => submit('create_poll')}
                />
            </CardActions>
        </Card>
    </div>
);

export default enhance(CreatePollPage);
