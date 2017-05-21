import { normalize } from 'normalizr';
import { pollSchema } from 'containers/App/schemas';
import { VISIT, ENTITIES_FOR_PAGE_LOADED } from './constants';

export const visit = (id) => async (dispatch, getState, api) => {
    dispatch({
        type: VISIT,
        payload: { id },
    });

    let poll;

    try {
        poll = await api.getPoll(id)
    } catch (error) {
        throw error

        dispatch(entitiesForPageLoaded(error));

        return;
    }

    dispatch(entitiesForPageLoaded(poll));
};

export const entitiesForPageLoaded = (payload) => {
    if (payload instanceof Error) {
        return {
            type: ENTITIES_FOR_PAGE_LOADED,
            error: true,
            payload,
        }
    }

    const { entities } = normalize(payload, pollSchema);

    return {
        type: ENTITIES_FOR_PAGE_LOADED,
        payload: {
            entities,
        }
    }
};
