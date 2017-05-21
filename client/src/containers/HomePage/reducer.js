import { List } from 'immutable';
import { combineReducers } from 'redux-immutable';

import {
    HOME_PAGE_VISITTED,
    ENTITIES_LOADED,
} from './constants'

const pollsReducer = (state = List(), action) => {
    switch (action.type) {
        case ENTITIES_LOADED: {
            const ids = action.payload.result;

            return List(ids);
        }
    }

    return state;
};

const fetchingReducer = (state = false, action) => {
    switch (action.type) {
        case HOME_PAGE_VISITTED:
            return true;
        case ENTITIES_LOADED:
            return false;
    }

    return state;
};

export default combineReducers({
    polls: pollsReducer,
    fetching: fetchingReducer,
})
