import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { submit } from 'redux-form/immutable';
import { createStructuredSelector } from 'reselect';
import { compose, withProps } from 'recompose';
import CreatePollForm from '../CreatePollForm';
import { makeGetFetching } from './selectors';
import { createPoll } from './actions';
import { Card, CardActions, CardText, FlatButton } from 'material-ui';
import KeyboardBackspaceIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';
import PlaylistAddIcon from 'material-ui/svg-icons/av/playlist-add';
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
    <Card>
        <FlatButton
            label="Back to the List"
            icon={<KeyboardBackspaceIcon style={{ paddingTop: 1 }} />}
            containerElement={<Link to="/" />}
        />
        <CardText style={{ paddingRight: 0 }}>
            <CreatePollForm onSubmit={handleSubmit} />
        </CardText>
        <CardActions style={{ textAlign: 'right' }}>
            <FlatButton
                primary
                label="Create Poll"
                icon={<PlaylistAddIcon/>}
                onClick={() => submit('create_poll')}
            />
        </CardActions>
    </Card>
);

export default enhance(CreatePollPage);
