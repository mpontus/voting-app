import React from 'react';
import R from 'ramda';
import { TextField, RaisedButton } from 'material-ui'
import { compose, withState, withHandlers, withProps } from 'recompose';
import FormLayout from '../../components/FormLayout';

// This function helps reduce boilerplate for creating input handlers
const makeSetter = (field) => ({ setState }) => (event) =>
    setState(R.set(R.lensProp(field), event.target.value));

const enhance = compose(
    // Use internal state for holding form values
    withState('state', 'setState', {
        username: '',
        password: '',
        passwordConfirmation: '',
    }),

    // Define shortcuts for updating form values
    withHandlers({
        handleChangeUsername: makeSetter('username'),
        handleChangePassword: makeSetter('password'),
        handleChangePasswordConfirmation: makeSetter('passwordConfirmation'),
    }),

    // Simple form validator
    withProps(({ state }) => {
        const { username, password, passwordConfirmation } = state;

        function isValid() {
            if (username.trim() === '') {
                return false;
            }

            if (password.trim() === '') {
                return false;
            }

            return password === passwordConfirmation;
        }

        return { valid: isValid() };
    }),

    // Decorate submission handler
    withProps(({ onSubmit, state }) => ({
        handleSubmit: (event) => {
            event.preventDefault();

            return onSubmit(state);
        },
    })),
);

const RegistrationPage = ({
    state,
    valid,
    handleChangeUsername,
    handleChangePassword,
    handleChangePasswordConfirmation,
    handleSubmit,
}) => {
    const { username, password, passwordConfirmation } = state;

    return (
        <form onSubmit={handleSubmit}>
            <FormLayout
                actions={
                    <RaisedButton
                        fullWidth
                        label="Sign Up"
                        type="submit"
                        disabled={!valid}
                    />
                }
            >
                <TextField
                    fullWidth
                    floatingLabelText="Username"
                    value={username}
                    onChange={handleChangeUsername}
                />
                <TextField
                    fullWidth
                    floatingLabelText="Password"
                    type="password"
                    value={password}
                    onChange={handleChangePassword}
                />
                <TextField
                    fullWidth
                    floatingLabelText="Password confirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={handleChangePasswordConfirmation}
                />
            </FormLayout>
        </form>
    );
};

export default enhance(RegistrationPage);
