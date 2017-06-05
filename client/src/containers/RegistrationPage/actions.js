import {
    CREATE_USER_REQUEST,
    CREATE_USER_RESULT,
} from './constants'

export const registerUser = ({ username, password }) => async (dispatch, getState, api) => {
    dispatch(createUserRequest({ username, password }));

    let user;
    try {
        user = await api.register({ username, password });
    } catch (error) {
        dispatch(createUserResult(error));

        return Promise.reject(error);
    }

    dispatch(createUserResult(user));

    return Promise.resolve(user);
};

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

    return {
        type: CREATE_USER_RESULT,
        payload: {
            user: payload,
        },
    };
};
