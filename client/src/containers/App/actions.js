import { schema, normalize } from 'normalizr';

import {
    CLIENT_INFO_OBTAINED,
    LOGOUT,
    POLL_LOADED,
    POLLS_LOADED,
} from './constants'

const pollSchema = new schema.Entity('polls');

export const clientInfoUpdated = (user) => ({
    type: CLIENT_INFO_OBTAINED,
    payload: {
        user,
    },
});

export const logout = () => ({
    type: LOGOUT,
});

export const pollLoaded = (poll) => ({
    type: POLL_LOADED,
});

export const pollsLoaded = (payload) => {
    if (typeof payload === Error) {
        return {
            type: POLLS_LOADED,
            error: true,
            payload,
        }
    }

    const { limit, offset, items, total } = payload;
    const { result, entities } = normalize(items, [pollSchema]);

    return {
        type: POLLS_LOADED,
        payload: {
            limit,
            offset,
            total,
            result,
            entities,
        },
    };
};