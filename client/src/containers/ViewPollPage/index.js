import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Menu, MenuItem } from 'material-ui';
import { makeGetPoll } from './selectors';
import { fetchPoll } from './actions';

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
    connect(makeMapStateToProps(), { fetchPoll }),
);

class ViewPollPage extends Component {
    componentDidMount() {
        const { fetchPoll, id } = this.props;

        fetchPoll(id);
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
<<<<<<< Updated upstream
                <ul>
                    {options.map((option) => (
                        <li key={option}>{option}</li>
=======
                <Menu>
                    {options.map((option) => (
                        <MenuItem
                            key={option}
                            primaryText={option}
                            onClick={() => this.handleVote(option)}
                        />
>>>>>>> Stashed changes
                    ))}
                </Menu>
            </div>
        )
    }
}
export default enhance(ViewPollPage);
