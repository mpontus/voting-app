import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form/immutable';
import { compose } from 'recompose'
import { TextField } from 'redux-form-material-ui';
import OptionInput from '../../components/OptionInput';
import MultiInput from '../../components/MultiInput/index';

const enhance = compose(
    reduxForm({ form: 'create_poll' }),
    connect(() => {
        const selector = formValueSelector('create_poll');
        return (state) => ({
            options: selector(state, 'options'),
        })
    }),
);

const renderRow = ({ index, ...input }) => {
    return (
        <OptionInput
            number={index + 1}
            name={`options[${index}]`}
            {...input}
        />
    );
};

const CreatePollForm = ({
    array,
    change,
    options,
    handleSubmit,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <Field
                name="title"
                component={TextField}
                fullWidth={true}
                hintText="Ask your question"
            />
            <MultiInput
                lines={options ? options.toArray() : []}
                minLines={2}
                rowComponent={renderRow}
                onAddLine={() => array.push('options', '')}
                onRemoveLine={(index) => array.remove('options', index)}
                onChangeLine={(index, value) => change(`options[${index}]`, value)}
            />
            <input type="submit" style={{ display: 'none' }} />
        </form>
    );
};

export default enhance(CreatePollForm);
