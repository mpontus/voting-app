import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { FlatButton, FontIcon } from 'material-ui';
import { makeGetPoll } from './selectors';
import { makeGetUser } from '../App/selectors';
import { fetchPoll, vote } from './actions';
import { Link } from 'react-router-dom';
import KeyboardBackspaceIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';
import Results from './Results';
import Form from './Form';

const makeMapStateToProps = () => (state, props) => {
    const { id } = props;
    const getPoll = makeGetPoll();
    const getUser = makeGetUser();

    return {
        poll: getPoll(state, id),
        user: getUser(state),
    };
};

const enhance = compose(
    withProps(({ match }) => ({
        id: match.params.id,
    })),
    connect(makeMapStateToProps(), { fetchPoll, vote }),
);

class ViewPollPage extends Component {
    componentDidMount() {
        const { fetchPoll, id } = this.props;

        fetchPoll(id);
    }

    componentWillReceiveProps(nextProps) {
        const { fetchPoll, id, user } = nextProps;

        if ((this.props.id !== id) || (this.props.user !== user)) {
            fetchPoll(id);
        }
    }

    handleVote(option) {
        const { vote, id } = this.props;

        vote(id, option);
    }

    render() {
        if (!this.props.poll) {
            return null;
        }

        const poll = this.props.poll.toJS();
        const user = this.props.user.toJS();
        const { title, options, myVote, author } = poll;
        const isOwner = user.id === author.id;
        const hasVoted = myVote !== null;
        const showResults = isOwner || hasVoted;

        return (
            <div>
                {showResults ? (
                    <Results
                        {...poll}
                        value={myVote}
                    />
                ) : (
                    <Form
                        {...poll}
                    />
                )}
            </div>
        )

    }
}
export default enhance(ViewPollPage);
