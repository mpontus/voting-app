import { Map } from 'immutable'
import { ENTITIES_FOR_PAGE_LOADED } from '../../PollPage/constants';
import {
    ENTITIES_LOADED as ENTITIES_FOR_HOME_PAGE_LOADED,
} from '../../HomePage/constants';
import { FETCH_POLL_RESULT } from '../../ViewPollPage/constants';

export default (state = Map(), action) => {
    switch (action.type) {
        case FETCH_POLL_RESULT:
        case ENTITIES_FOR_PAGE_LOADED:
        case ENTITIES_FOR_HOME_PAGE_LOADED: {
            const { entities } = action.payload;

            return state.mergeWith(
                (oldEntities, newEntities) => oldEntities.merge(newEntities),
                entities,
            );
        }

        default:
            return state;
    }
}
