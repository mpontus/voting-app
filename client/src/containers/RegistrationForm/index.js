import React from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import { TextField } from 'redux-form-material-ui';

const required = value => !value && 'Required';
const enhance = reduxForm({ form: 'registration' });

const RegistrationPage = ({
    handleSubmit,
}) => (
    <form onSubmit={handleSubmit}>
        <Field
            component={TextField}
            name="username"
            fullWidth
            floatingLabelText="Username"
            validate={required}
        />
        <Field
            component={TextField}
            name="password"
            fullWidth
            floatingLabelText="Password"
            type="password"
            validate={required}
        />
        <Field
            component={TextField}
            name="password_confirmation"
            fullWidth
            floatingLabelText="Password confirmation"
            type="password"
            validate={required}
        />
        <input type="submit" style={{ display: 'none' }} />
    </form>
);

export default enhance(RegistrationPage);
