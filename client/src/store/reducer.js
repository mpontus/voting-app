import { combineReducers } from 'redux-immutable';
import { reducer as form } from 'redux-form/immutable';
import global from '../containers/App/reducer';
import newPoll from '../containers/CreatePollPage/reducer'
import pollForm from '../containers/PollForm/reducer';
import pollPage from '../containers/PollPage/reducer';
import homePage from '../containers/HomePage/reducer';

export default combineReducers({
    form,
    global,
    newPoll,
    pollForm,
    pollPage,
    homePage,
})
