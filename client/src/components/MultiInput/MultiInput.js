import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { repeat } from 'ramda';
import LineInput from './LineInput';

export default class MultiInput extends Component {
    static propTypes = {
        lines: PropTypes.arrayOf(PropTypes.string).isRequired,
        minLines: PropTypes.number,
        onChangeLine: PropTypes.func,
        onRemoveLine: PropTypes.func,
        onAddLine: PropTypes.func,
    };

    static defaultProps = {
        minLines: 0,
    };

    inputs = [];

    handleChange = (event, index, value) => {
        const { onChangeLine } = this.props;

        if (onChangeLine) {
            onChangeLine(index, value);
        }
    };

    handleKeyDown = (event, index, key) => {
        const { lines } = this.props;

        switch (key) {
            case 'Tab':
                this.handleTabKey(event, index);

                return;

            case 'Backspace':
                this.handleBackspaceKey(event, index);

                return;

            case 'Delete':
                this.handleDeleteKey(event, index);

                return;
        }
    };

    handleBlur = (event, index) => {
        const { lines, onRemoveLine } = this.props;

        if (!onRemoveLine) {
            return;
        }

        if (lines[index] !== '') {
            return;
        }

        if (lines.length <= minLines) {
            return;
        }

        onRemoveLine(index);
    };

    handleTabKey = (event, index) => {
        const { lines, onAddLine } = this.props;
        const lastIndex = lines.length - 1;

        // Shift key must not be held
        if (event.shiftKey) {
            return;
        }

        // Focus should be on the last line
        if (index !== lastIndex) {
            return;
        }

        // The line should be empty
        if (lines[index] === '') {
            return;
        }

        // Handling for adding the line must be specified
        if (!onAddLine) {
            return;
        }

        this.props.onAddLine();
    };

    handleBackspaceKey = (event, index) => {
        const { lines, minLines, onRemoveLine } = this.props;

        // Line must be empty
        if (lines[index] !== '') {
            return;
        }

        // Removal must be possible
        if (minLines <= lines.length) {
            return;
        }

        // Handle removal of the only line
        if (lines.length === 1) {
            onRemoveLine(index);
            event.preventDefault();

            return;
        }

        // Handle removal of the first line
        if (index === 0) {
            // Focus on the next row and let blur handler take care of removal
            this.inputs[index + 1].focus();
            event.preventDefault();

            return;
        }

        // For subsequent rows focus on preceeding row and let blur handler take care of removal
        this.inputs[index - 1].focus();
        event.preventDefault();
    };

    handleDeleteKey = (event, index) => {
        const { lines, onRemoveLine } = this.props;

        if (lines[index] !== '') {
            return;
        }

        event.preventDefault();

        onRemoveLine(index);
    };

    setRef = (index, input) => {
        this.inputs[index] = input;
    };

    render() {
        const { lines, minLines } = this.props;

        const paddedLines = [
            ...lines,
            ...repeat('', Math.max(0, minLines - lines.length)),
        ];

        return (
            <div>
                {paddedLines.map((line, index) => (
                    <div key={index}>
                        <LineInput
                            index={index}
                            value={line}
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDown}
                            onBlur={this.handleBlur}
                            setRef={this.setRef}
                        />
                    </div>
                ))}
            </div>
        )
    }
}
