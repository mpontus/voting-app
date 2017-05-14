import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { repeat } from 'ramda';
import LineInput from './LineInput';

// TODO: Handle backspace and delete keys
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

    handleChange = (event, index, value) => {
        const { onChangeLine } = this.props;

        if (onChangeLine) {
            onChangeLine(index, value);
        }
    };

    handleKeyDown = (event, index, key) => {
        const { lines, onAddLine } = this.props;
        const lastIndex = lines.length - 1;

        if (key !== 'Tab') {
            return;
        }

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

        onAddLine();
    };

    handleBlur = (event, index) => {
        const { lines, minLines, onRemoveLine } = this.props;

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
                        />
                    </div>
                ))}
            </div>
        )
    }
}
