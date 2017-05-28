import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LineInput from './LineInput'

class Row extends Component {
    static propTypes = {
        component: PropTypes.func,
        index: PropTypes.number.isRequired,
    }

    renderInputComponent = (props) => {
        return React.createElement(
            this.props.component, {
                index: this.props.index,
                ...props,
            }
        )
    }

    render() {
        const {
            index,
            component,
            ...rest
        } = this.props;

        const inputComponent = this.props.component
            ? this.renderInputComponent
            : undefined;

        return (
            <LineInput
                {...rest}
                index={index}
                component={inputComponent}
            />
        )
    }
}

export default Row
