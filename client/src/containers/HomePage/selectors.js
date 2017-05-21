import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { getEntities } from 'containers/App/selectors';
import { pollSchema } from 'containers/App/schemas';

const getHomePage = state => state.get('homePage');

export const makeGetPolls = () => createSelector(
    [getHomePage, getEntities],
    (state, entitites) => {
        return denormalize(state.get('polls').toJS(), [pollSchema], entitites);
    },
);

export const makeGetFetching = () => createSelector(
    getHomePage,
    state => state.get('fetching'),
);
