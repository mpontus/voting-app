import { fromJS } from 'immutable';
import jwtDecode from 'jwt-decode';
import { LOGIN_RESULT } from '../../LoginPage/constants';
import { CLIENT_INFO_OBTAINED, LOGOUT } from '../constants'

export default (state = null, action) => {
    switch (action.type) {
        case LOGIN_RESULT: {
            const { accessToken } = action.payload;
            const user = jwtDecode(accessToken);

            return fromJS(user);
        }

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
