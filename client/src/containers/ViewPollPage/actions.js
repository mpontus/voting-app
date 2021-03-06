import { normalize } from 'normalizr';
import { pollSchema } from '../App/schemas';
import {
    FETCH_POLL_REQUEST,
    FETCH_POLL_RESULT,
    VOTE_REQUEST,
    VOTE_RESULT,
} from './constants';

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
};

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

export const voteRequest = (pollId, option) => ({
    type: VOTE_REQUEST,
    payload: {
        pollId,
        option,
    },
});

export const voteResult = (payload) => {
    if (payload instanceof Error) {
        console.dir(payload);
        console.error(payload)
        return {
            type: VOTE_RESULT,
            error: true,
            payload,
        }
    }

    const { entities } = normalize(payload, pollSchema);

    return {
        type: VOTE_RESULT,
        payload: {
            entities,
        },
    };
};

export const vote = (pollId, option) => async (dispatch, getState, api) => {
    dispatch(voteRequest(pollId, option));

    let poll;
    try {
        await api.vote(pollId, option);
        poll = await api.getPoll(pollId);
    } catch (error) {
        dispatch(voteResult(error));

        return;
    }

    dispatch(voteResult(poll));
};

export const extend = (pollId, option) => async (dispatch, getState, api) => {
    dispatch(voteRequest(pollId, option));

    let poll;
    try {
        await api.createOption(pollId, option);
        poll = await api.getPoll(pollId);
    } catch (error) {
        dispatch(voteResult(error));

        return;
    }

    dispatch(voteResult(poll));
}
