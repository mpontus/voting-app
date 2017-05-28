import { fromJS } from 'immutable';

import {
    CHANGE_TITLE,
    CHANGE_OPTION,
    ADD_OPTION,
    REMOVE_OPTION,
} from './constants'

export const initialState = fromJS({
    title: '',
    options: [],
});

export default function (state = initialState, action) {
    console.log(action);

    switch (action.type) {
        case CHANGE_TITLE: {
            const { value } = action.payload;

            return state.set('title', value);
        }

        case CHANGE_OPTION: {
            const { index, value } = action.payload;

            return state.setIn(['options', index], value);
        }

        case ADD_OPTION: {

            const newState = state.update('options', options => options.push(''));

            console.log(state.toJS(), newState.toJS())


            return newState
        }

        case REMOVE_OPTION: {
            const { index } = action.payload;

            return state.update('options', options => options.delete(index))
        }
    }
}
