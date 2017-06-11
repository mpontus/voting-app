import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form/immutable';
import { compose } from 'recompose'
import { Row, Col } from 'react-flexbox-grid';
import { TextField } from 'redux-form-material-ui';
import { RaisedButton } from 'material-ui'
import OptionInput from '../../components/OptionInput';
import MultiInput from '../../components/MultiInput/index';

const styles = {
    actions: {
        marginTop: 30,
    },
};

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
            <Row style={styles.actions}>
                <Col xs={12} sm={6} smOffset={6}>
                    <RaisedButton
                        label="Create Poll"
                        fullWidth={true}
                        type="submit"
                    />
                </Col>
            </Row>
        </form>
    );
};

export default enhance(CreatePollForm);
