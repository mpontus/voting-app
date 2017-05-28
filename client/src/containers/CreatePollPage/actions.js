import {
    CHANGE_TITLE,
    CHANGE_OPTION,
    ADD_OPTION,
    REMOVE_OPTION,
} from './constants'

export const changeTitle = (value) => ({
    type: CHANGE_TITLE,
    payload: { value },
});

export const changeOption = (index, value) => ({
    type: CHANGE_OPTION,
    payload: { index, value },
});

export const addOption = () => ({
    type: ADD_OPTION,
});

export const removeOption = (index) => ({
    type: REMOVE_OPTION,
    payload: { index },
});
