import {
    LOGIN_REQUEST,
    LOGIN_RESULT,
} from './constants'

export const login = ({ username, password }) => async (dispatch, getState, api) => {
    dispatch(loginRequest({ username, password }));

    let user;
    try {
        user = await api.login(username, password);
    } catch (error) {
        console.log('err', error);
        dispatch(loginResult(error));

        return Promise.reject(error);
    }

    dispatch(loginResult(user));

    return Promise.resolve(user);
};

export const loginRequest = ({ username, password }) => ({
    type: LOGIN_REQUEST,
    payload: { username, password },
});

export const loginResult = (payload) => {
    if (payload instanceof Error) {
        return {
            type: LOGIN_RESULT,
            error: true,
            payload,
        };
    }

    return {
        type: LOGIN_RESULT,
        payload: {
            user: payload,
        },
    };
};
