import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
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
                <ul>
                    {options.map((option, index) => (
                        <li>{option}</li>
                    ))}
                </ul>
            </div>
        )
    }
}
export default enhance(ViewPollPage);
