import {
    TITLE_UPDATED,
    OPTION_UPDATED,
    OPTION_INSERTED,
    OPTION_REMOVED,
    SUBMITTED,
} from './constants';

export const titleUpdated = value => ({
    type: TITLE_UPDATED,
    payload: { value },
});

export const optionUpdated = (index, value) => ({
    type: OPTION_UPDATED,
    payload: { index, value },
});

export const optionInserted = index => ({
    type: OPTION_INSERTED,
    payload: { index },
});

export const optionRemoved = index => ({
    type: OPTION_REMOVED,
    payload: { index },
});

export const submitted = ({ title, options }) => ({
    type: SUBMITTED,
    payload: { title, options },
});
