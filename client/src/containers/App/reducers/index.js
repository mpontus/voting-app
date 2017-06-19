import { combineReducers } from 'redux-immutable';
import showLogin from './showLogin';
import user from './user';
import entities from './entities';
import notifications from './notifications';

export default combineReducers({
    user,
    entities,
    notifications,
    showLogin,
})
