import { PRESS_LOGIN_BUTTON, PRESS_CLOSE_BUTTON } from '../constants';
import { LOGIN_RESULT } from '../../LoginPage/constants';

export default (state = false, action) => {
    switch (action.type) {
        case PRESS_LOGIN_BUTTON:
            return true;

        case PRESS_CLOSE_BUTTON:
            return false;

        case LOGIN_RESULT:
            if (!action.error) {
                return false;
            }

            return state;

        default:
            return state;
    }
}
