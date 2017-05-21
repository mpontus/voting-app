import { Map, fromJS } from 'immutable'
import { POLL_LOADED, POLLS_LOADED } from 'containers/App/constants';
import { ENTITIES_FOR_PAGE_LOADED } from 'containers/PollPage/constants';
import {
    ENTITIES_LOADED as ENTITIES_FOR_HOME_PAGE_LOADED,
} from 'containers/HomePage/constants';

export default (state = Map(), action) => {
    switch (action.type) {
        case ENTITIES_FOR_PAGE_LOADED:
        case ENTITIES_FOR_HOME_PAGE_LOADED: {
            const { entities } = action.payload;

            return state.mergeWith(
                (oldEntities, newEntities) => oldEntities.merge(newEntities),
                entities,
            );
        }
    }

    return state;
}
