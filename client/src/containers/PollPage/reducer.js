import { fromJS } from 'immutable';
import { VISIT, ENTITIES_FOR_PAGE_LOADED } from './constants';

const initialState = fromJS({
    fetching: false,
});

export default (state = initialState, action) => {
    switch (action.type) {
        case VISIT:
            return state.set('fetching', true);
        case ENTITIES_FOR_PAGE_LOADED:
            return state.set('fetching', false);
        default:
            return state;
    }

}
