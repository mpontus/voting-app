import {
    LOGIN_REQUEST,
    LOGIN_RESULT,
} from './constants'

export const login = ({ username, password }) => async (dispatch, getState, api) => {
    dispatch(loginRequest({ username, password }));

    let response;
    try {
        response = await api.login(username, password);
    } catch (error) {
        dispatch(loginResult(error));

        return Promise.reject(error);
    }

    const { access_token: accessToken } = response;

    dispatch(loginResult({ accessToken }));

    // return Promise.resolve(accessToken);
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

    const { accessToken } = payload;

    return {
        type: LOGIN_RESULT,
        payload: {
            accessToken,
        },
    };
};
