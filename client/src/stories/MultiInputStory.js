import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MultiInput from '../components/MultiInput/MultiInput';

export default class MultiInputStory extends Component {
    static propTypes = {
        defaultLines: PropTypes.arrayOf(PropTypes.string).isRequired,
        onChangeLine: PropTypes.func,
        onAddLine: PropTypes.func,
        onRemoveLine: PropTypes.func,
    };

    state = {
        lines: this.props.defaultLines,
    };

    handleChangeLine = (index, value) => {
        this.setState(state => ({
            lines: [
                ...state.lines.slice(0, index),
                value,
                ...state.lines.slice(index + 1),
            ],
        }));

        if (this.props.onChangeLine) {
            this.props.onChangeLine(index, value);
        }
    };

    handleAddLine = () => {
        this.setState(state => ({
            lines: [...state.lines, ''],
        }));

        if (this.props.onAddLine) {
            this.props.onAddLine();
        }
    };

    handleRemoveLine = (index) => {
        this.setState(state => ({
            lines: [
                ...state.lines.slice(0, index),
                ...state.lines.slice(index + 1),
            ],
        }));

        if (this.props.onRemoveLine) {
            this.props.onRemoveLine(index);
        }
    };

    render() {
        const { lines } = this.state;

        return (
            <MultiInput
                lines={lines}
                onChangeLine={this.handleChangeLine}
                onAddLine={this.handleAddLine}
                onRemoveLine={this.handleRemoveLine}
            />
        )
    }
}
