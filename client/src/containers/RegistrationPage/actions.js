import {
    CREATE_USER_REQUEST,
    CREATE_USER_RESULT,
} from './constants'

export const createUserRequest = ({ username, password }) => ({
    type: CREATE_USER_REQUEST,
    payload: { username, password },
});

export const createUserResult = (payload) => {
    if (payload instanceof Error) {
        return {
            type: CREATE_USER_RESULT,
            error: true,
            payload,
        };
    }

    const { accessToken } = payload;

    return {
        type: CREATE_USER_RESULT,
        payload: {
            accessToken,
        },
    };
};

export const registerUser = ({ username, password }) => async (dispatch, getState, api) => {
    dispatch(createUserRequest({ username, password }));

    let response;
    try {
        response = await api.register({ username, password });
    } catch (error) {
        dispatch(createUserResult(error));

        return Promise.reject(error);
    }

    const accessToken = response.access_token;

    dispatch(createUserResult({ accessToken }));

    return Promise.resolve(response);
};
