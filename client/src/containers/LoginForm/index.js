import React from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import { TextField } from 'redux-form-material-ui';

const required = value => !value && 'Required';

const enhance = reduxForm({ form: 'login' });

const RegistrationPage = ({
    valid,
    handleSubmit,
}) => (
    <form onSubmit={handleSubmit}>
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
        <input type="submit" style={{ display: 'none' }} />
    </form>
);

export default enhance(RegistrationPage);
