import {
    POLL_CREATE_REQUEST,
    POLL_CREATE_RESULT,
} from './constants'

export const pollCreateRequest = ({ title, options }) => ({
    type: POLL_CREATE_REQUEST,
    payload: { title, options },
});

export const pollCreateResult = (payload) => {
    if (payload instanceof Error) {
        return {
            type: POLL_CREATE_REQUEST,
            error: true,
            payload,
        };
    }

    return {
        type: POLL_CREATE_RESULT,
        payload: {
            poll: payload,
        },
    };
};

export const createPoll = ({ title, options }) => async (dispatch, getState, api) => {
    dispatch(pollCreateRequest({ title, options }));

    let poll;
    try {
        poll = await api.createPoll({ title, options });
    } catch (error) {
        dispatch(pollCreateResult(error));

        return Promise.reject(error);
    }

    dispatch(pollCreateResult(poll));
};
