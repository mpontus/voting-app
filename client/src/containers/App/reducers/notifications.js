import { Map, OrderedSet } from 'immutable';
import shortid from 'shortid';
import { LOGIN_RESULT } from '../../LoginPage/constants';
import { NOTIFICATION_DISMISSED } from '../constants';
import { VOTE_RESULT } from '../../ViewPollPage/constants';

const initialState = Map({
    messagesById: Map(),
    messageIds: OrderedSet(),
});

const addMessage = (text) => (state) => {
    const id = shortid.generate();

    return state
        .update('messagesById', (state) =>
            state.set(id, text))
        .update('messageIds', (state) =>
            state.add(id));
};

const removeMessage = (id) => (state) => {
    return state
        .update('messagesById', (state) =>
            state.delete(id))
        .update('messageIds', (state) =>
            state.delete(id));
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_RESULT: {
            if (action.error) {
                return addMessage('Invalid credentials')(state);
            }

            return state;
        }

        case NOTIFICATION_DISMISSED: {
            const { id } = action.payload;

            return removeMessage(id)(state);
        }

        case VOTE_RESULT: {
            if (!action.error) {
                return state;
            }

            if (!action.payload.response) {
                return state;
            }

            const { message } = action.payload.response;
            return addMessage(message)(state);
        }

        default:
            return state;
    }
}
