import React from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import { TextField } from 'redux-form-material-ui';
import { RaisedButton } from 'material-ui'
import FormLayout from '../../components/FormLayout';

const required = value => !value && 'Required';

const enhance = reduxForm({ form: 'login' });

const RegistrationPage = ({
    valid,
    handleSubmit,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <FormLayout
                actions={
                    <RaisedButton
                        fullWidth
                        label="Log In"
                        type="submit"
                        disabled={!valid}
                    />
                }
            >
                <Field
                    fullWidth
                    name="username"
                    component={TextField}
                    hintText="Username"
                    floatingLabelText="Username"
                    validate={required}
                />
                <Field
                    fullWidth
                    name="password"
                    component={TextField}
                    type="password"
                    hintText="Password"
                    floatingLabelText="Password"
                    validate={required}
                />
            </FormLayout>
        </form>
    );
};

export default enhance(RegistrationPage);
