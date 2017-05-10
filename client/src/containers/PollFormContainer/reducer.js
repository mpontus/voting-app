import { fromJS } from 'immutable';

import {
    TITLE_UPDATED,
    OPTION_UPDATED,
    OPTION_INSERTED,
    OPTION_REMOVED,
} from './constants';

const initialState = fromJS({
    title:   '',
    options: [''],
});

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case TITLE_UPDATED: {
            const { value } = payload;

            return state.set('title', value);
        }

        case OPTION_UPDATED: {
            const { index, value } = payload;

            return state.update('options', options =>
                options.set(index, value),
            );
        }

        case OPTION_INSERTED: {
            const { index } = payload;

            return state.update('options', options =>
                options.insert(index, ''),
            )
        }

        case OPTION_REMOVED: {
            const { index } = payload;

            return state.update('options', options =>
                options.delete(index),
            )
        }

        default:
            return state;
    }
}
