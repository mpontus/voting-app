import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LineInput extends Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        onKeyDown: PropTypes.func.isRequired,
        onBlur: PropTypes.func.isRequired,
        component: PropTypes.func,
    };

    handleKeyDown = (event) => {
        const { index, onKeyDown } = this.props;

        onKeyDown(event, index, event.key);
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
            component,
        } = this.props;

        const inputProps = {
            value,
            onKeyDown: this.handleKeyDown,
            onChange: this.handleChange,
            onBlur: this.handleBlur,
        };

        const inputComponent = component || 'input';

        return React.createElement(inputComponent, inputProps);
    }
}
