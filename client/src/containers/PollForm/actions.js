import { normalize } from 'normalizr';
import { pollSchema } from 'containers/App/schemas'

import {
    TITLE_UPDATED,
    OPTION_UPDATED,
    OPTION_INSERTED,
    OPTION_REMOVED,
    POLL_SUBMITTED,
    POLL_CREATED,
} from './constants';

export const titleUpdated = value => ({
    type: TITLE_UPDATED,
    payload: { value },
});

export const optionUpdated = (index, value) => ({
    type: OPTION_UPDATED,
    payload: { index, value },
});

export const optionInserted = index => ({
    type: OPTION_INSERTED,
    payload: { index },
});

export const optionRemoved = index => ({
    type: OPTION_REMOVED,
    payload: { index },
});

export const pollSubmitted = ({ title, options }) => async (dispatch, getState, api) => {
    dispatch({
        type: POLL_SUBMITTED,
        payload: { title, options },
    });

    let poll;

    try {
        poll = await api.createPoll({
            title,
            options,
        });
    } catch (error) {
        dispatch(pollCreated(error));

        return;
    }

    dispatch(pollCreated(poll));
};

export const pollCreated = (payload) => {
    if (payload instanceof Error) {
        return {
            type: POLL_CREATED,
            error: true,
            payload,
        };
    }

    const { entities } = normalize(payload, pollSchema);

    return {
        type: POLL_CREATED,
        payload: {
            entities,
        }
    };
};
