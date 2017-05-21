import { combineReducers } from 'redux-immutable';

import {
    userReducer,
    entitiesReducer,
} from './reducers'

export default combineReducers({
    user: userReducer,
    entities: entitiesReducer,
})
