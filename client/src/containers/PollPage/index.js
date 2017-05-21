// TODO: DirectoryNameAsMain
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { makeGetPoll } from 'containers/App/selectors';
import { visit } from './actions';
import { makeGetFetching } from './selectors';

class PollPage extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        fetching: PropTypes.bool.isRequired,
        poll: PropTypes.object,
        visit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        poll: null,
    };

    componentDidMount() {
        const { visit, id } = this.props;

        visit(id);
    }

    render() {
        const { fetching, poll } = this.props;

        if (fetching) {
            return (
                <div>Loading....</div>
            )
        }

        if (!poll) {
            return null;
        }

        return (
            <div>
                <h1>{poll.get('title')}</h1>
                <ul>
                    {poll.get('options').map((option, index) =>
                        <li key={index}>{option}</li>
                    )}
                </ul>
            </div>
        )
    }
}

const makeMapStateToProps = () => {
    const getFetching = makeGetFetching();
    const getPoll = makeGetPoll();

    return (state, { id }) => ({
        fetching: getFetching(state, { id }),
        poll: getPoll(state, { id }),
    });
};

const mapDispatchToProps = {
    visit,
};

const ConnectedPollPage = connect(makeMapStateToProps(), mapDispatchToProps)(PollPage);

ConnectedPollPage.propTypes = {
    id: PropTypes.string.isRequired,
};

export default ConnectedPollPage;
