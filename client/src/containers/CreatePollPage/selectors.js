import { createSelector } from 'reselect';

const getCreatePollPage = state => state.get('newPoll');

export const makeGetFetching = () => createSelector(
    getCreatePollPage,
    state => state.get('fetching'),
);
