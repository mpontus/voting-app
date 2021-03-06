import { fromJS } from 'immutable';
import jwtDecode from 'jwt-decode';
import { LOGIN_RESULT } from '../../LoginPage/constants';
import { CREATE_USER_RESULT } from '../../RegistrationPage/constants';
import { CLIENT_INFO_OBTAINED, LOGOUT } from '../constants'

export default (state = null, action) => {
    switch (action.type) {
        case LOGIN_RESULT:
        case CREATE_USER_RESULT: {
            if (action.error) {
                return state;
            }

            const { accessToken } = action.payload;
            const user = jwtDecode(accessToken);

            return fromJS(user);
        }

        case CLIENT_INFO_OBTAINED:
        case LOGOUT: {
            const { user } = action.payload;

            return fromJS(user);
        }

        default:
            return state;
    }

}
