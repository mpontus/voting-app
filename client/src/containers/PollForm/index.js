import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import BasicPollForm from 'components/PollForm';

import {
    makeSelectTitle,
    makeSelectOptions,
} from './selectors';

import {
    titleUpdated,
    optionUpdated,
    optionInserted,
    optionRemoved,
    pollSubmitted,
} from './actions';

const mapStateToProps = createStructuredSelector({
    title:   makeSelectTitle(),
    options: makeSelectOptions(),
});

const mapDispatchToProps = {
    titleUpdated,
    optionUpdated,
    optionInserted,
    optionRemoved,
    pollSubmitted,
};

class PollFormContainer extends Component {
    static propTypes = {
        title:          PropTypes.string.isRequired,
        options:        PropTypes.arrayOf(PropTypes.string).isRequired,
        titleUpdated:   PropTypes.func.isRequired,
        optionUpdated:  PropTypes.func.isRequired,
        optionInserted: PropTypes.func.isRequired,
        optionRemoved:  PropTypes.func.isRequired,
        pollSubmitted:  PropTypes.func.isRequired,
    };

    handleChangeTitle = (value) => {
        this.props.titleUpdated(value);
    };

    handleChangeOption = (index, value) => {
        this.props.optionUpdated(index, value);
    };

    handleAddOption = () => {
        const { optionInserted, options } = this.props;
        const nextOptionIndex = options.length;

        optionInserted(nextOptionIndex, '');
    };

    handleRemoveOption = (index) => {
        this.props.optionRemoved(index);
    };

    handleSubmit = (event) => {
        const { pollSubmitted, title, options, history } = this.props;

        event.preventDefault();

        pollSubmitted({
            title,
            options,
        }).then(() => {
            history.push('/');
        })
    };

    render() {
        const { title, options } = this.props;

        return (
            <BasicPollForm
                title={title}
                options={options}
                onChangeTitle={this.handleChangeTitle}
                onAddOption={this.handleAddOption}
                onRemoveOption={this.handleRemoveOption}
                onChangeOption={this.handleChangeOption}
                onSubmit={this.handleSubmit}
            />
        )
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(PollFormContainer);
