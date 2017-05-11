import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LineInput extends Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        onTabPress: PropTypes.func.isRequired,
        onBlur: PropTypes.func.isRequired,
    };

    handleKeyDown = (event) => {
        const { index, onTabPress } = this.props;

        if (event.key === 'Tab') {
            onTabPress(event, index);
        }
    };

    handleChange = (event) => {
        const { index, onChange } = this.props;

        onChange(event, index, event.target.value);
    };

    handleBlur = (event) => {
        const { index, onBlur } = this.props;

        onBlur(event, index);
    };

    render() {
        const {
            index,
            value,
            ...rest
        } = this.props;

        return (
            <input
                value={value}
                onKeyDown={this.handleKeyDown}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
            />
        )
    }
}
