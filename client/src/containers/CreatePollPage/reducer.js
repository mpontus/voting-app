import { fromJS } from 'immutable';

import {
    POLL_CREATE_REQUEST,
    POLL_CREATE_RESULT,
} from './constants'

const initialState = fromJS({
    fetching: false,
});

export default function createPollReducer(state = initialState, action) {
    switch (action.type) {
        case POLL_CREATE_REQUEST:
            return state.set('fetching', true);

        case POLL_CREATE_RESULT:
            return state.set('fetching', false);

        default:
            return state;
    }
};
