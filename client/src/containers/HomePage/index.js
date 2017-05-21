import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
    makeGetPolls,
    makeGetFetching,
} from './selectors';

import { homePageVisitted } from './actions';

class HomePage extends Component {
    componentDidMount() {
        this.props.homePageVisitted();
    }

    render() {
        const { fetching, polls } = this.props;

        if (fetching && !polls) {
            return <div>Loading ....</div>;
        }

        return (
            <ul>
                {polls.map((poll) => (
                    <li key={poll.get('id')}>
                        <Link to={`/poll/${poll.get('id')}`}>
                            {poll.get('title')}
                        </Link>
                    </li>
                ))}
            </ul>
        )
    }
}

const makeMapStateToProps = () => {
    const getPolls = makeGetPolls();
    const getFetching = makeGetFetching();

    return createStructuredSelector({
        polls: getPolls,
        fetching: getFetching,
    });
};

const mapDispatchToProps = {
    homePageVisitted,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(HomePage);
