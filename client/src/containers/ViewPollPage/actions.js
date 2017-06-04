import { normalize } from 'normalizr';
import { pollSchema } from '../App/schemas';
import {
    FETCH_POLL_REQUEST,
    FETCH_POLL_RESULT,
} from './constants';

export const fetchPoll = (id) => async (dispatch, getState, api) => {
    dispatch(fetchPollRequest(id));

    let poll;
    try {
        poll = await api.getPoll(id);
    } catch (error) {
        dispatch(fetchPollResult(error));

        return Promise.reject(error);
    }

    dispatch(fetchPollResult(poll));

    return poll;
};

export const fetchPollRequest = (id) => ({
    type: FETCH_POLL_REQUEST,
    payload: { id },
});

export const fetchPollResult = (payload) => {
    if (payload instanceof Error) {
        return {
            type: FETCH_POLL_RESULT,
            error: true,
            payload,
        }
    }

    const { entities } = normalize(payload, pollSchema);

    return {
        type: FETCH_POLL_RESULT,
        payload: {
            entities,
        },
    };
}

