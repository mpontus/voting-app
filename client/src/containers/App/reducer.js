import { combineReducers } from 'redux-immutable';

import {
    user,
    entities,
    notifications,
} from './reducers'

export default combineReducers({
    user,
    entities,
    notifications,
})
