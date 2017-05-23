import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    component: PropTypes.func.isRequired,
};

class Autofocus extends Component {
    componentDidMount() {
        this.input.focus();
    }

    setInput = (element) => {
        this.input = element;
    };

    render() {
        const {
            component,
            ...rest
        } = this.props;

        return React.createElement(
            component,
            {
                ...rest,
                ref: this.setInput,
            },
        );
    }
}

export default Autofocus;
