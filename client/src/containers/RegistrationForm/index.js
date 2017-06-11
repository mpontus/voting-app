import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { TextField } from 'redux-form-material-ui';

const enhance = reduxForm({ form: 'registration' });

const RegistrationPage = ({
    handleSubmit,
}) => (
    <form onSubmit={handleSubmit}>
        <Field
            component={TextField}
            fullWidth
            floatingLabelText="Username"
        />
        <Field
            component={TextField}
            fullWidth
            floatingLabelText="Password"
            type="password"
        />
        <Field
            component={TextField}
            fullWidth
            floatingLabelText="Password confirmation"
            type="password"
        />
        <input type="submit" style={{ display: 'none' }} />
    </form>
);

export default enhance(RegistrationPage);
