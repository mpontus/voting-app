import { fromJS } from 'immutable';
import { CLIENT_INFO_OBTAINED, LOGOUT } from '../constants'

export default (state = null, action) => {
    switch (action.type) {
        case CLIENT_INFO_OBTAINED: {
            const { user } = action.payload;

            return fromJS(user);
        }

        case LOGOUT: {
            return null;
        }

        default:
            return state;
    }

}
