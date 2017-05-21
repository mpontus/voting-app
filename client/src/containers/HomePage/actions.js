import { normalize } from 'normalizr'
import { pollSchema } from 'containers/App/schemas'

import {
    HOME_PAGE_VISITTED,
    ENTITIES_LOADED,
} from './constants'

export const homePageVisitted = () => async (dispatch, getState, api) => {
    dispatch({
        type: HOME_PAGE_VISITTED,
    });

    let polls;

    try {
        polls = await api.getPolls()
    } catch (error) {
        dispatch(entitiesForHomePageLoaded(error));

        return;
    }

    dispatch(entitiesForHomePageLoaded(polls));
};

export const entitiesForHomePageLoaded = (payload) => {
    if (payload instanceof Error) {
        return {
            type: ENTITIES_LOADED,
            error: true,
            payload,
        }
    }

    const { items, total } = payload;

    const { entities, result } = normalize(items, [pollSchema]);

    return {
        type: ENTITIES_LOADED,
        payload: {
            entities,
            result,
            total,
        }
    };
}
