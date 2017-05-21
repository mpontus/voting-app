import { createSelector } from 'reselect';

const getPollPage = state => state.get('pollPage');

export const makeGetFetching = () => createSelector(
    getPollPage,
    state => state.get('fetching'),
);
