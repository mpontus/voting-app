import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, setPropTypes, defaultProps } from 'recompose';
import { CardText, Checkbox, Subheader, TextField } from 'material-ui';

const propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.string.isRequired,
    ).isRequired,
    value: PropTypes.shape({
        create: PropTypes.bool.isRequired,
        option: PropTypes.string.isRequired,
    }),
    onChange: PropTypes.func,
    customOptionEnabled: PropTypes.bool,
};

const enhance = compose(
    setPropTypes(propTypes),
    defaultProps({
        customOptionEnabled: true,
    }),
    withHandlers({
        // Handler for checkboxes
        handleCheck: ({ onChange, value }) => (event) => {
            if (onChange) {
                const toggleOff = value && !value.create && value.option === event.target.value;

                onChange(toggleOff ? null : {
                    create: false,
                    option: event.target.value,
                });
            }
        },
        // Handler for the custom option input
        handleChange: ({ onChange }) => (event) => {
            if (onChange) {
                const isEmpty = event.target.value === '';

                onChange(isEmpty ? null : {
                    create: true,
                    option: event.target.value,
                });
            }
        },
    }),
);

const VotingForm = ({
    options,
    value,
    customOptionEnabled,
    handleCheck,
    handleChange,
}) => {
    // Hide custom option input when any existing option is selected
    const showCustomOptonInput = !value || value.create;

    // Disable selection for existing options when custom option is entered
    const disableCheckboxes = value && value.create;

    // Value for the input for the custom option
    const customValue = value && value.create ? value.option : '';

    return (
        <div>
            <CardText style={{ flex: '1', paddingLeft: 40 }}>
                <div style={{ paddingBottom: 16 }}>
                    <Subheader style={{ paddingLeft: 0, lineHeight: 1, paddingBottom: 16 }}>
                        Select one option:
                    </Subheader>
                    {options.map((option, index) => {
                        const checked = value && !value.create && option === value.option;

                        return (
                            <Checkbox
                                disabled={disableCheckboxes}
                                key={index}
                                label={option}
                                checked={!!checked}
                                value={option}
                                onCheck={handleCheck}
                            />
                        );
                    })}
                </div>
                {customOptionEnabled && (
                    <TextField
                        style={{ visibility: showCustomOptonInput ? 'visible' : 'hidden' }}
                        floatingLabelText="Add new option"
                        floatingLabelFixed
                        value={customValue}
                        onChange={handleChange}
                    />
                )}
            </CardText>
        </div>
    );
};

export default enhance(VotingForm);
