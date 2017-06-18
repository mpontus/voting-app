import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { makeGetPoll } from './selectors';
import { makeGetUser } from '../App/selectors';
import { fetchPoll, vote } from './actions';
import Results from './Results';
import Form from './Form';
import { Card, FlatButton } from 'material-ui';
import KeyboardBackspaceIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';
import { Link } from 'react-router-dom';

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
        const { myVote, ownedByMe, tally } = poll;
        const hasVoted = myVote !== null;
        const showResults = ownedByMe || hasVoted;

        return (
            <Card>
                <FlatButton
                    label="Back to the List"
                    icon={<KeyboardBackspaceIcon style={{ paddingTop: 1 }} />}
                    containerElement={<Link to="/" />}
                />
                {showResults ? (
                    <Results
                        {...poll}
                        value={myVote}
                        tally={tally}
                    />
                ) : (
                    <Form
                        {...poll}
                        user={user}
                    />
                )}
            </Card>
        )

    }
}
export default enhance(ViewPollPage);
