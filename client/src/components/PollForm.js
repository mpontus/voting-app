import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PollForm extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
        onChangeTitle: PropTypes.func.isRequired,
        onAddOption: PropTypes.func.isRequired,
        onRemoveOption: PropTypes.func.isRequired,
        onChangeOption: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    handleChangeTitle = (event) => {
        this.props.onChangeTitle(event.target.value);
    };

    handleAddOption = () => {
        this.props.onAddOption();
    };

    handleRemoveOption = () => {
        this.props.onRemoveOption();
    };

    handleChangeOption = (event) => {
        const {
            dataset: { optionIndex },
            value,
        } = event.target;

        this.props.onChangeOption(optionIndex, value);
    };

    render() {
        const {
            title,
            options,
        } = this.props;

        return (
            <form>
                <div>
                    <div>
                        <label>Title</label>
                    </div>
                    <input
                        value={title}
                        onChange={this.handleChangeTitle}
                    />
                </div>
                <div>
                    <div>
                        <label>Options</label>
                    </div>
                    {options.map((option, idx) => (
                        <div key={idx}>
                            <input
                                value={option}
                                onChange={this.handleChangeOption}
                                data-option-index={idx}
                            />
                        </div>
                    ))}
                </div>
                <input type="submit"/>
            </form>
        );
    }
}
