import { createSelector } from 'reselect';

const selectPollForm = state => state.get('pollForm');

export const makeSelectTitle = () => createSelector(
    selectPollForm,
    pollFormState => pollFormState.get('title'),
);

export const makeSelectOptions = () => createSelector(
    selectPollForm,
    pollFormState => pollFormState.get('options').toArray(),
);
