import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Menu, MenuItem } from 'material-ui';
import { makeGetPoll } from './selectors';
import { fetchPoll, vote } from './actions';

const makeMapStateToProps = () => (state, props) => {
    const { id } = props;
    const getPoll = makeGetPoll();

    return {
        poll: getPoll(state, id),
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

    handleVote(option) {
        const { vote, id } = this.props;

        vote(id, option);
    }

    render() {
        const { poll } = this.props;

        if (!poll) {
            return null;
        }

        const { title, options } = poll.toJS();

        return (
            <div>
                <h2>{title}</h2>
                <Menu>
                    {options.map((option) => (
                        <MenuItem
                            key={option}
                            primaryText={option}
                            onClick={() => this.handleVote(option)}
                        />
                    ))}
                </Menu>
            </div>
        )
    }
}
export default enhance(ViewPollPage);
