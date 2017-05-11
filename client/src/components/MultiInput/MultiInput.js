import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LineInput from './LineInput';

export default class MultiInput extends Component {
    static propTypes = {
        lines: PropTypes.arrayOf(PropTypes.string).isRequired,
        onChangeLine: PropTypes.func,
        onRemoveLine: PropTypes.func,
        onAddLine: PropTypes.func,
    };

    handleChange = (event, index, value) => {
        this.props.onChangeLine(index, value);
    };

    handleTabPress = (event, index) => {
        const { lines, onAddLine } = this.props;
        const lastIndex = lines.length - 1;

        if (index === lastIndex) {
            onAddLine();
        }
    };

    handleBlur = (event, index) => {
        const { lines, onRemoveLine } = this.props;

        if (lines[index] === '') {
            onRemoveLine(index);
        }
    };

    render() {
        const { lines } = this.props;

        return (
            <div>
                {lines.map((line, index) => (
                    <div key={index}>
                        <LineInput
                            index={index}
                            value={line}
                            onChange={this.handleChange}
                            onTabPress={this.handleTabPress}
                            onBlur={this.handleBlur}
                        />
                    </div>
                ))}
            </div>
        )
    }
}
